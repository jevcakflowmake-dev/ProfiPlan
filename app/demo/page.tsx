import Link from 'next/link'
import { DEMO_CLIENT, DEMO_MODULES } from '@/lib/demo-data'
import { getModule } from '@/lib/modules'

export default function DemoPlanPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">
              {DEMO_CLIENT.full_name}
            </h1>
            <span className="badge-complete">✓ Dokončený plán</span>
          </div>
          <p className="text-sm text-muted mt-1">
            {DEMO_CLIENT.age} let · ukázkový finanční plán
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/demo/presentation" className="btn-primary">
            🎞 Animovaná prezentace
          </Link>
        </div>
      </header>

      <div className="rounded-xl bg-accent/10 border border-accent/20 text-accent px-4 py-3 text-sm">
        Toto je <strong>ukázkový plán</strong> se vzorovými daty. V ostré verzi by tady poradce
        viděl reálné modelace svého klienta, vytažené AI z PDF.
      </div>

      <div className="space-y-3">
        {DEMO_MODULES.map((m) => {
          const def = getModule(m.module_type)
          if (!def) return null
          const data = (m.manual_override ?? m.extracted_data ?? {}) as Record<string, unknown>
          return (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-ink">{def.label}</h3>
                <span className="badge-complete">✓ Zkontrolováno</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                {def.fields.map((f) => {
                  const v = data[f.key]
                  return (
                    <div key={f.key}>
                      <div className="text-xs text-muted">{f.label}</div>
                      <div className="font-mono text-ink mt-0.5">
                        {v == null || v === ''
                          ? '—'
                          : Array.isArray(v)
                            ? v.join(', ')
                            : typeof v === 'number'
                              ? `${v.toLocaleString('cs-CZ')}${f.unit ? ' ' + f.unit : ''}`
                              : String(v) + (f.unit ? ` ${f.unit}` : '')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="card p-6 bg-primary text-white">
        <h2 className="font-display text-xl font-semibold">Spusť prezentaci pro klienta</h2>
        <p className="text-white/70 mt-2">
          Animovaná prezentace v Reveal.js — projde všechny moduly plánu a uzavře profesionálním
          shrnutím. Optimalizovaná pro iPad a touch ovládání.
        </p>
        <div className="flex gap-3 mt-5">
          <Link
            href="/demo/presentation"
            className="bg-white text-primary px-5 py-2.5 rounded-lg font-semibold"
          >
            ▶ Spustit prezentaci
          </Link>
          <Link href="/" className="text-white/80 hover:text-white px-5 py-2.5">
            ← Zpět na úvod
          </Link>
        </div>
      </div>
    </div>
  )
}
