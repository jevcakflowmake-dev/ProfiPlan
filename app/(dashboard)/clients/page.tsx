import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ClientsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: clients } = await supabase
    .from('clients')
    .select('id, full_name, age, created_at')
    .eq('advisor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Klienti</h1>
          <p className="text-sm text-muted mt-1">Seznam tvých klientů</p>
        </div>
        <Link href="/plans/new" className="btn-primary">
          + Nový plán
        </Link>
      </header>

      {clients && clients.length > 0 ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted uppercase">
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium">Jméno</th>
                <th className="text-left px-6 py-3 font-medium">Věk</th>
                <th className="text-left px-6 py-3 font-medium">Založen</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-6 py-3 font-medium">{c.full_name}</td>
                  <td className="px-6 py-3 text-muted">{c.age}</td>
                  <td className="px-6 py-3 text-muted">{new Date(c.created_at).toLocaleDateString('cs-CZ')}</td>
                  <td className="px-6 py-3 text-right">
                    <Link href={`/clients/${c.id}`} className="text-accent font-medium">
                      Detail →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-muted mb-4">Zatím nemáš žádné klienty.</p>
          <Link href="/plans/new" className="btn-primary">
            Založit prvního klienta
          </Link>
        </div>
      )}
    </div>
  )
}
