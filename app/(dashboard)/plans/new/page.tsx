import { createClient } from '@/lib/supabase/server'
import { MODULES } from '@/lib/modules'
import NewPlanForm from './NewPlanForm'

export default async function NewPlanPage({ searchParams }: { searchParams: { client?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: clients } = await supabase
    .from('clients')
    .select('id, full_name, age')
    .eq('advisor_id', user.id)
    .order('full_name')

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Nový plán</h1>
        <p className="text-sm text-muted mt-1">Vyber klienta a moduly, které bude plán obsahovat.</p>
      </header>

      <NewPlanForm clients={clients ?? []} modules={MODULES} preselectClient={searchParams.client} />
    </div>
  )
}
