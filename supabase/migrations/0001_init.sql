-- ───────────────────────────────────────────────────────────
-- Profiplán — počáteční schema
-- ───────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- profiles ----------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

-- auto-insert profile při signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- clients ----------------------------------------------------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  age integer not null check (age >= 0 and age < 130),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists clients_advisor_idx on public.clients(advisor_id);

-- financial_plans --------------------------------------------
do $$ begin
  create type plan_status as enum ('draft', 'review', 'complete');
exception when duplicate_object then null; end $$;

create table if not exists public.financial_plans (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  advisor_id uuid not null references public.profiles(id) on delete cascade,
  status plan_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists plans_advisor_idx on public.financial_plans(advisor_id);
create index if not exists plans_client_idx on public.financial_plans(client_id);

-- plan_modules -----------------------------------------------
create table if not exists public.plan_modules (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.financial_plans(id) on delete cascade,
  module_type text not null,
  slot integer not null default 1 check (slot in (1, 2)),
  extracted_data jsonb,
  manual_override jsonb,
  pdf_url text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  unique (plan_id, module_type, slot)
);
create index if not exists modules_plan_idx on public.plan_modules(plan_id);

-- updated_at autoupdate --------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists clients_touch on public.clients;
create trigger clients_touch before update on public.clients
  for each row execute function public.touch_updated_at();

drop trigger if exists plans_touch on public.financial_plans;
create trigger plans_touch before update on public.financial_plans
  for each row execute function public.touch_updated_at();

-- ───────────────────────────────────────────────────────────
-- Row Level Security
-- ───────────────────────────────────────────────────────────

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.financial_plans enable row level security;
alter table public.plan_modules enable row level security;

-- profiles: vidí jen vlastní profil
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
  for select using (auth.uid() = id);

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (auth.uid() = id);

-- clients: poradce vidí/upravuje jen své
drop policy if exists clients_owner_all on public.clients;
create policy clients_owner_all on public.clients
  for all using (auth.uid() = advisor_id) with check (auth.uid() = advisor_id);

-- plans
drop policy if exists plans_owner_all on public.financial_plans;
create policy plans_owner_all on public.financial_plans
  for all using (auth.uid() = advisor_id) with check (auth.uid() = advisor_id);

-- plan_modules: přes parent plan
drop policy if exists modules_owner_all on public.plan_modules;
create policy modules_owner_all on public.plan_modules
  for all using (
    exists (
      select 1 from public.financial_plans p
      where p.id = plan_modules.plan_id and p.advisor_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.financial_plans p
      where p.id = plan_modules.plan_id and p.advisor_id = auth.uid()
    )
  );

-- ───────────────────────────────────────────────────────────
-- Storage bucket pro PDF
-- ───────────────────────────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('plan-pdfs', 'plan-pdfs', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

drop policy if exists "advisor reads own pdfs" on storage.objects;
create policy "advisor reads own pdfs" on storage.objects
  for select using (
    bucket_id = 'plan-pdfs'
    and exists (
      select 1 from public.financial_plans p
      where p.id::text = (storage.foldername(name))[1]
        and p.advisor_id = auth.uid()
    )
  );

drop policy if exists "advisor writes own pdfs" on storage.objects;
create policy "advisor writes own pdfs" on storage.objects
  for insert with check (
    bucket_id = 'plan-pdfs'
    and exists (
      select 1 from public.financial_plans p
      where p.id::text = (storage.foldername(name))[1]
        and p.advisor_id = auth.uid()
    )
  );

drop policy if exists "advisor updates own pdfs" on storage.objects;
create policy "advisor updates own pdfs" on storage.objects
  for update using (
    bucket_id = 'plan-pdfs'
    and exists (
      select 1 from public.financial_plans p
      where p.id::text = (storage.foldername(name))[1]
        and p.advisor_id = auth.uid()
    )
  );

drop policy if exists "advisor deletes own pdfs" on storage.objects;
create policy "advisor deletes own pdfs" on storage.objects
  for delete using (
    bucket_id = 'plan-pdfs'
    and exists (
      select 1 from public.financial_plans p
      where p.id::text = (storage.foldername(name))[1]
        and p.advisor_id = auth.uid()
    )
  );
