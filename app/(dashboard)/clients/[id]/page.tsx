import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { statusLabel, statusBadgeClass } from '@/lib/modules'

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: client } = await supabase
    .from('clients')
    .select('*')
    .eq('id', params.id)
    .eq('advisor_id', user.id)
    .maybeSingle()
  if (!client) notFound()

  const { data: plans } = await supabase
    .from('financial_plans')
    .select('id, status, created_at, updated_at')
    .eq('client_id', client.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{client.full_name}</h1>
          <p className="text-sm text-muted mt-1">{client.age} let</p>
        </div>
        <Link href={`/plans/new?client=${client.id}`} className="btn-primary">
          + Nový plán
        </Link>
      </header>

      <section className="card">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-display text-lg font-semibold text-ink">Plány</h2>
        </div>
        {plans && plans.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="text-xs text-muted uppercase">
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium">Stav</th>
                <th className="text-left px-6 py-3 font-medium">Vytvořen</th>
                <th className="text-left px-6 py-3 font-medium">Aktualizován</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-6 py-3">
                    <span className={statusBadgeClass(p.status)}>{statusLabel(p.status)}</span>
                  </td>
                  <td className="px-6 py-3 text-muted">{new Date(p.created_at).toLocaleDateString('cs-CZ')}</td>
                  <td className="px-6 py-3 text-muted">{new Date(p.updated_at).toLocaleDateString('cs-CZ')}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/plans/${p.id}`} className="text-accent font-medium">
                      Otevřít →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-muted text-sm">Klient zatím nemá žádný plán.</div>
        )}
      </section>
    </div>
  )
}
