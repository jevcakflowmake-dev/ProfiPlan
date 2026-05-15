# Profiplán — ruční kroky před spuštěním

Aplikace je nasazena, ale potřebuje pár kroků v externích službách.

## 1. Reaktivace Supabase projektu

Projekt `pytzxqyzyjsbzlbgahkw` (region Frankfurt) je momentálně **paused**.

→ Jdi na [supabase.com/dashboard/project/pytzxqyzyjsbzlbgahkw](https://supabase.com/dashboard/project/pytzxqyzyjsbzlbgahkw) a klikni **Restore project**. Trvá ~2 min.

## 2. Spuštění SQL migrace

V Supabase **SQL Editoru** spusť obsah souboru `supabase/migrations/0001_init.sql`. Vytvoří:

- tabulky `profiles`, `clients`, `financial_plans`, `plan_modules`
- enum `plan_status` (draft/review/complete)
- trigger pro auto-vytvoření profilu při signup
- **RLS policies** — každý poradce vidí pouze své záznamy
- Storage bucket `plan-pdfs` (private, 20 MB limit, jen PDF) + RLS policies

## 3. Získání klíčů a vyplnění Vercel env vars

V Supabase → **Project Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://pytzxqyzyjsbzlbgahkw.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon public key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role secret (POZOR: tajné, jen server)

Plus z [console.anthropic.com](https://console.anthropic.com/settings/keys):

- `ANTHROPIC_API_KEY` = sk-ant-...

Přidej na Vercelu pod **profi-plan → Settings → Environment Variables** (Production + Preview).

⚠ **Důležité:** Když přes terminál (`vercel env add` / `echo | ...`) — nezadávej hodnotu přes `printf '...\n'` — ulozí to s trailing newline. Použij `printf '%s' "$VALUE" | vercel env add NAME production` nebo přidej raději přes UI.

Po přidání env vars **redeploy** poslední commit (nebo push prázdný commit `git commit --allow-empty -m "redeploy"`).

## 4. Nastavení Supabase Auth

V Supabase → **Authentication → URL Configuration**:

- **Site URL** = `https://profi-plan.vercel.app`
- **Redirect URLs** (přidej):
  - `https://profi-plan.vercel.app`
  - `https://profi-plan.vercel.app/login`
  - `http://localhost:3000` (pro lokální dev)

V **Authentication → Providers → Email** se ujisti, že **Enable Email provider** je on. Doporučuji vypnout **Confirm email** pro rychlejší onboarding (poradci si tak nemusí potvrzovat email kliknutím v mailu).

## 5. (volitelné) Verifikace Resend domény pro produkční e-maily

Supabase built-in SMTP má rate limit (4 emaily/hod). Pokud chceš spolehlivě posílat e-maily na obnovu hesla a pozvánky:

- V Supabase → Auth → SMTP Settings → nastav vlastní Resend SMTP (`resend.com` účet)
- Verifikuj doménu (DNS DKIM + SPF)

## 6. Lokální dev

```bash
cd /Users/jevci/projects/profi-plan
cp .env.example .env.local
# vyplň 4 klíče
npm run dev
```

App pojede na `http://localhost:3000`.

## Co je hotové

- ✅ Auth (login/register/middleware)
- ✅ Multi-tenant DB schema + RLS
- ✅ Dashboard se statistikami
- ✅ CRUD klientů
- ✅ Nový plán flow (výběr klienta + checkboxy 9 modulů)
- ✅ Editor plánu s drag&drop PDF uploadem do Supabase Storage
- ✅ AI extrakce přes Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- ✅ Ruční override + verifikační checkbox
- ✅ Doublecheck stránka s warning bannerem
- ✅ Reveal.js prezentace (animované slidy, optimalizace pro iPad)
- ✅ PDF export přes `@react-pdf/renderer`
- ✅ Build prošel čistě, deploy běží

## Co budeme dělat dál

Po prvním ručním otestování:
- Vylepšení slidů (grafy růstu investic, timeline penze)
- Logo poradce v PDF (upload do profilu)
- Custom branding (název firmy, kontakty)
- E-mail klientovi s PDF přílohou
