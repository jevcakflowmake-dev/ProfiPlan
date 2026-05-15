# Profiplán

B2B SaaS pro finanční poradce — tvorba a prezentace finančních plánů s AI extrakcí parametrů z PDF modelací.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Supabase** (Auth + Postgres + Storage, projekt `pytzxqyzyjsbzlbgahkw`, Frankfurt)
- **Anthropic Claude** (`claude-sonnet-4-20250514` pro PDF extrakci)
- **Tailwind CSS**
- **Reveal.js** (animovaná prezentace pro klienta)
- **@react-pdf/renderer** (PDF export)
- Deploy: **Vercel** (projekt `profi-plan`, alias `profi-plan.vercel.app`)

## Lokální vývoj

```bash
cp .env.example .env.local
# vyplň 4 klíče (anon, service role, anthropic, supabase url)
npm install
npm run dev
```

## Struktura

```
app/
├── (auth)/login, register
├── (dashboard)/
│   ├── page.tsx                  ← přehled, statistiky, poslední plány
│   ├── clients/                  ← seznam + detail klienta
│   └── plans/
│       ├── new/                  ← výběr klienta + modulů
│       └── [id]/
│           ├── page.tsx          ← editor (sidebar modulů + PlanEditor)
│           ├── review/           ← doublecheck před exportem
│           ├── presentation/     ← Reveal.js
│           └── export/           ← PDF
└── api/
    ├── extract-pdf/              ← Claude PDF → JSON
    ├── generate-pdf/             ← @react-pdf render
    └── auth/signout/

lib/
├── modules.ts                    ← definice 9 typů modulů a polí pro AI
├── types.ts
└── supabase/{client,server,middleware}.ts

supabase/migrations/0001_init.sql ← schema + RLS + Storage bucket
```

## Moduly plánu

`income_protection_1/2`, `pension`, `mortgage_preparation`, `mortgage`, `children_investment`, `children_insurance`, `free_investment`, `savings_goal`.

## Bezpečnost

RLS politika: každý poradce vidí pouze své `clients`, `financial_plans` a `plan_modules`. Storage bucket `plan-pdfs` má RLS svázanou s `advisor_id` přes path prefix `<plan_id>/`.
