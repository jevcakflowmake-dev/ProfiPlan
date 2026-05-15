import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getModule } from '@/lib/modules'
import ReviewActions from './ReviewActions'

export default async function ReviewPage({ params }: { params: { id: string } }) {
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

  const allVerified = mods.length > 0 && mods.every((m) => m.is_verified)
  const client = Array.isArray(plan.clients) ? plan.clients[0] : plan.clients

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <Link href={`/plans/${plan.id}`} className="text-sm text-muted hover:text-ink">
            ← Zpět do editoru
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink mt-1">Doublecheck</h1>
          <p className="text-sm text-muted mt-1">
            {client?.full_name} · {client?.age} let
          </p>
        </div>
      </header>

      {!allVerified && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          ⚠ Některé moduly nejsou zkontrolované. Před exportem ověř všechny hodnoty.
        </div>
      )}

      <div className="space-y-3">
        {mods.map((m) => {
          const def = getModule(m.module_type)
          const data = (m.manual_override ?? m.extracted_data ?? {}) as Record<string, unknown>
          const keyFields = def?.fields.slice(0, 4) ?? []
          return (
            <Link
              key={m.id}
              href={`/plans/${plan.id}?module=${m.id}`}
              className="block card p-5 hover:border-accent transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-ink">{def?.label}</h3>
                <span className={m.is_verified ? 'badge-complete' : 'badge-draft'}>
                  {m.is_verified ? '✓ Zkontrolováno' : '○ Čeká na kontrolu'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                {keyFields.map((f) => {
                  const v = data[f.key]
                  return (
                    <div key={f.key}>
                      <div className="text-xs text-muted">{f.label}</div>
                      <div className="font-mono text-ink truncate">
                        {v == null || v === '' ? '—' : Array.isArray(v) ? v.join(', ') : String(v)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Link>
          )
        })}
      </div>

      <ReviewActions planId={plan.id} allVerified={allVerified} status={plan.status} />
    </div>
  )
}
