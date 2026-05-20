import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { statusLabel, statusBadgeClass } from '@/lib/modules'

export default async function DashboardHome() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [{ count: clientCount }, { count: activeCount }, { count: doneCount }, { data: recent }] = await Promise.all([
    supabase.from('clients').select('*', { head: true, count: 'exact' }).eq('advisor_id', user.id),
    supabase.from('financial_plans').select('*', { head: true, count: 'exact' }).eq('advisor_id', user.id).in('status', ['draft', 'review']),
    supabase.from('financial_plans').select('*', { head: true, count: 'exact' }).eq('advisor_id', user.id).eq('status', 'complete'),
    supabase
      .from('financial_plans')
      .select('id, status, updated_at, clients ( full_name, age )')
      .eq('advisor_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(10),
  ])

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Přehled</h1>
          <p className="text-sm text-muted mt-1">Tvoje aktivita za poslední dny</p>
        </div>
        <Link href="/plans/new" className="btn-primary">
          + Nový plán
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Klienti" value={clientCount ?? 0} />
        <Stat label="Aktivní plány" value={activeCount ?? 0} />
        <Stat label="Dokončené plány" value={doneCount ?? 0} />
      </div>

      <section className="card">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-semibold text-ink">Poslední plány</h2>
        </div>
        {recent && recent.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-xs text-muted uppercase tracking-wide">
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium">Klient</th>
                <th className="text-left px-6 py-3 font-medium">Věk</th>
                <th className="text-left px-6 py-3 font-medium">Stav</th>
                <th className="text-left px-6 py-3 font-medium">Aktualizováno</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {recent.map((p) => {
                const client = Array.isArray(p.clients) ? p.clients[0] : p.clients
                return (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                    <td className="px-6 py-3 font-medium">{client?.full_name ?? '—'}</td>
                    <td className="px-6 py-3 text-muted">{client?.age ?? '—'}</td>
                    <td className="px-6 py-3">
                      <span className={statusBadgeClass(p.status)}>{statusLabel(p.status)}</span>
                    </td>
                    <td className="px-6 py-3 text-muted">
                      {new Date(p.updated_at).toLocaleDateString('cs-CZ')}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <Link href={`/plans/${p.id}`} className="text-accent font-medium">
                        Otevřít →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-muted text-sm">
            Zatím nemáš žádný plán.{' '}
            <Link href="/plans/new" className="text-accent font-medium">
              Začni nový
            </Link>
            .
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card p-5">
      <div className="text-xs text-muted uppercase tracking-wide">{label}</div>
      <div className="font-display text-3xl font-semibold text-primary mt-2">{value}</div>
    </div>
  )
}
