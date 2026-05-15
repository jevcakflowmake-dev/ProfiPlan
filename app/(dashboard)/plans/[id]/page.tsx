import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getModule, MODULES, statusLabel, statusBadgeClass } from '@/lib/modules'
import PlanEditor from './PlanEditor'

export default async function PlanEditorPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { module?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: plan } = await supabase
    .from('financial_plans')
    .select('*, clients (full_name, age)')
    .eq('id', params.id)
    .eq('advisor_id', user.id)
    .maybeSingle()
  if (!plan) notFound()

  const { data: modules } = await supabase
    .from('plan_modules')
    .select('*')
    .eq('plan_id', plan.id)
    .order('created_at')
  const mods = modules ?? []

  const activeModuleId = searchParams.module ?? mods[0]?.id

  const client = Array.isArray(plan.clients) ? plan.clients[0] : plan.clients

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">{client?.full_name}</h1>
            <span className={statusBadgeClass(plan.status)}>{statusLabel(plan.status)}</span>
          </div>
          <p className="text-sm text-muted mt-1">{client?.age} let · plán {plan.id.slice(0, 8)}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/plans/${plan.id}/review`} className="btn-secondary">
            Doublecheck
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3 card p-4">
          <h2 className="text-xs uppercase tracking-wider text-muted font-semibold mb-3 px-2">Moduly</h2>
          <nav className="space-y-1">
            {mods.map((m) => {
              const def = getModule(m.module_type)
              const isActive = m.id === activeModuleId
              return (
                <Link
                  key={m.id}
                  href={`/plans/${plan.id}?module=${m.id}`}
                  scroll={false}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    isActive ? 'bg-primary text-white' : 'hover:bg-slate-50 text-ink'
                  }`}
                >
                  <span className="truncate">{def?.label ?? m.module_type}</span>
                  {m.is_verified && <span className="text-success">✓</span>}
                </Link>
              )
            })}
          </nav>
        </aside>

        <section className="col-span-12 lg:col-span-9 space-y-4">
          {activeModuleId && mods.find((m) => m.id === activeModuleId) ? (
            <PlanEditor
              planId={plan.id}
              module={mods.find((m) => m.id === activeModuleId)!}
            />
          ) : (
            <div className="card p-12 text-center text-muted">Vyber modul ze sidebaru.</div>
          )}
        </section>
      </div>
    </div>
  )
}
