import Link from 'next/link'
import Sparkline from '@/components/Sparkline'
import { statusBadgeClass, statusLabel } from '@/lib/modules'
import { DEMO_ADVISORS, DEMO_MANAGER, DEMO_RECENT_PLANS, getTeamMetrics } from '@/lib/demo-team'

function fmtMoney(n: number): string {
  return n.toLocaleString('cs-CZ') + ' Kč'
}

function fmtDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit' }) +
    ' · ' +
    d.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
}

export default function ManagerDashboardPage() {
  const m = getTeamMetrics()
  const sortedAdvisors = [...DEMO_ADVISORS].sort((a, b) => b.thisWeek - a.thisWeek)

  return (
    <div className="min-h-screen bg-bg">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-display text-lg font-bold text-primary">
              Profiplán
            </Link>
            <nav className="hidden md:flex gap-1 text-sm">
              <span className="px-3 py-1.5 rounded-md bg-primary/5 text-primary font-medium">Přehled týmu</span>
              <Link href="/demo" className="px-3 py-1.5 rounded-md text-muted hover:bg-slate-100">
                Ukázka plánu
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs px-2.5 py-1 rounded-full bg-amber-50 text-warning font-medium">
              UKÁZKOVÉ PROSTŘEDÍ
            </span>
            <Link href="/login" className="text-sm text-muted hover:text-ink">
              Přihlásit
            </Link>
            <Link
              href="/register"
              className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary-light"
            >
              Vytvořit účet
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero / Welcome */}
        <section className="card overflow-hidden">
          <div className="grid lg:grid-cols-3">
            <div className="lg:col-span-2 p-8 lg:p-10 bg-gradient-to-br from-primary via-primary to-primary-light text-white">
              <div className="text-xs uppercase tracking-widest text-white/70 mb-3">
                Vítej zpět, řediteli
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {DEMO_MANAGER.fullName}
              </h1>
              <p className="text-white/80 mt-2 text-sm">
                {DEMO_MANAGER.teamName} · {m.totalAdvisors} aktivních poradců
              </p>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <HeroStat label="Celkem plánů" value={m.totalPlans.toString()} />
                <HeroStat label="Tento týden" value={`+${m.thisWeek}`} accent />
                <HeroStat label="Aktivních" value={m.activePlans.toString()} />
              </div>
            </div>
            <div className="p-8 flex flex-col justify-between bg-white">
              <div>
                <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
                  Nástroj pro tým
                </div>
                <h2 className="font-display text-xl font-semibold text-ink">
                  AI-asistovaná tvorba finančních plánů
                </h2>
                <p className="text-sm text-muted mt-2 leading-relaxed">
                  Poradci nahrávají PDF modelace, Claude vytáhne parametry, plán letí ke klientovi
                  jako animovaná prezentace.
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <Link href="/demo" className="btn-primary text-center">
                  ▶ Spustit ukázku plánu
                </Link>
                <Link href="/demo/presentation" className="btn-secondary text-center">
                  🎞 Prezentace klientovi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Top KPI row */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Měsíční objem"
            value={fmtMoney(m.monthlyVolume)}
            hint="celkem v plánech"
            tone="primary"
          />
          <KpiCard
            label="Dokončené plány"
            value={m.completedPlans.toString()}
            hint={`Ø ${m.avgPlansPerAdvisor} na poradce`}
            tone="success"
          />
          <KpiCard
            label="Plány ke kontrole"
            value={m.activePlans.toString()}
            hint="čekají na finalizaci"
            tone="warning"
          />
          <KpiCard
            label="Tento týden"
            value={`+${m.thisWeek}`}
            hint="nových klientů"
            tone="accent"
          />
        </section>

        {/* Poradci */}
        <section className="card">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Podřízení poradci</h2>
              <p className="text-xs text-muted mt-0.5">
                Jak tým využívá Profiplán · seřazeno podle aktivity za týden
              </p>
            </div>
            <Link href="/demo" className="text-sm text-accent font-medium hover:underline">
              Otevřít vzorový plán →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted uppercase tracking-wide">
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-medium">Poradce</th>
                  <th className="text-left px-3 py-3 font-medium">Region</th>
                  <th className="text-right px-3 py-3 font-medium">Plány</th>
                  <th className="text-right px-3 py-3 font-medium">Aktivní</th>
                  <th className="text-right px-3 py-3 font-medium">Hotové</th>
                  <th className="text-right px-3 py-3 font-medium">Týden</th>
                  <th className="text-left px-3 py-3 font-medium">Aktivita 30 dní</th>
                  <th className="text-left px-3 py-3 font-medium">Poslední</th>
                </tr>
              </thead>
              <tbody>
                {sortedAdvisors.map((a) => (
                  <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: a.avatarColor }}
                        >
                          {a.initials}
                        </div>
                        <div>
                          <div className="font-medium text-ink">{a.fullName}</div>
                          <div className="text-xs text-muted">
                            v týmu od {new Date(a.joinedAt).toLocaleDateString('cs-CZ', { month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted">{a.region}</td>
                    <td className="px-3 py-3 text-right font-mono text-ink">{a.totalPlans}</td>
                    <td className="px-3 py-3 text-right">
                      <span className="badge-review">{a.activePlans}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="badge-complete">{a.completedPlans}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className={a.thisWeek > 4 ? 'text-success font-semibold' : a.thisWeek === 0 ? 'text-muted/60' : 'text-ink'}>
                        {a.thisWeek > 0 ? `+${a.thisWeek}` : '0'}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Sparkline data={a.activity30d} color={a.avatarColor} />
                    </td>
                    <td className="px-3 py-3 text-xs text-muted whitespace-nowrap">{a.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent plans */}
        <section className="card">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Poslední vytvořené plány</h2>
              <p className="text-xs text-muted mt-0.5">Napříč celým týmem · klikni pro ukázku</p>
            </div>
            <span className="text-xs text-muted">{DEMO_RECENT_PLANS.length} záznamů</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted uppercase tracking-wide">
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 font-medium">Klient</th>
                  <th className="text-left px-3 py-3 font-medium">Poradce</th>
                  <th className="text-left px-3 py-3 font-medium">Stav</th>
                  <th className="text-right px-3 py-3 font-medium">Modulů</th>
                  <th className="text-right px-3 py-3 font-medium">Měsíčně</th>
                  <th className="text-left px-3 py-3 font-medium">Aktualizováno</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {DEMO_RECENT_PLANS.map((p) => {
                  const advisor = DEMO_ADVISORS.find((a) => a.id === p.advisorId)
                  return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                      <td className="px-6 py-3">
                        <div className="font-medium text-ink">{p.clientName}</div>
                        <div className="text-xs text-muted">{p.clientAge} let</div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                            style={{ background: advisor?.avatarColor ?? '#64748B' }}
                          >
                            {advisor?.initials ?? '?'}
                          </div>
                          <span className="text-muted">{p.advisorName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className={statusBadgeClass(p.status)}>{statusLabel(p.status)}</span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-ink">{p.modules}</td>
                      <td className="px-3 py-3 text-right font-mono text-ink">
                        {fmtMoney(p.monthlyValue)}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted whitespace-nowrap">
                        {fmtDateTime(p.updatedAt)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Link href="/demo" className="text-accent font-medium text-xs hover:underline">
                          Otevřít →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer note */}
        <footer className="text-center text-xs text-muted py-6">
          Toto je <strong>ukázkové prostředí</strong> pro prezentaci. V ostré verzi vidíte reálná
          data svého týmu.{' '}
          <Link href="/demo" className="text-accent font-medium">
            Spustit ukázku plánu →
          </Link>
        </footer>
      </main>
    </div>
  )
}

// ── Sub-komponenty ────────────────────────────────────────
function HeroStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className={`font-display text-3xl font-bold ${accent ? 'text-amber-300' : 'text-white'}`}>
        {value}
      </div>
      <div className="text-xs text-white/60 uppercase tracking-wide mt-1">{label}</div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint: string
  tone: 'primary' | 'success' | 'warning' | 'accent'
}) {
  const toneClass = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent',
  }[tone]
  return (
    <div className="card p-5">
      <div className="text-xs text-muted uppercase tracking-wide">{label}</div>
      <div className={`font-display text-2xl md:text-3xl font-semibold mt-2 ${toneClass}`}>
        {value}
      </div>
      <div className="text-xs text-muted mt-1">{hint}</div>
    </div>
  )
}
