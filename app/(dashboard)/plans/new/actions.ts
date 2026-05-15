'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createPlan(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const existingClientId = formData.get('client_id') as string | null
  const newClientName = formData.get('new_client_name') as string | null
  const newClientAge = formData.get('new_client_age') as string | null
  const moduleTypes = formData.getAll('modules') as string[]

  if (moduleTypes.length === 0) {
    return { error: 'Vyber alespoň jeden modul.' }
  }

  let clientId = existingClientId
  if (!clientId) {
    if (!newClientName || !newClientAge) {
      return { error: 'Vyplň jméno a věk klienta.' }
    }
    const { data: created, error } = await supabase
      .from('clients')
      .insert({ advisor_id: user.id, full_name: newClientName, age: parseInt(newClientAge, 10) })
      .select('id')
      .single()
    if (error || !created) return { error: error?.message ?? 'Nepodařilo se založit klienta.' }
    clientId = created.id
  }

  const { data: plan, error: planErr } = await supabase
    .from('financial_plans')
    .insert({ client_id: clientId, advisor_id: user.id, status: 'draft' })
    .select('id')
    .single()
  if (planErr || !plan) return { error: planErr?.message ?? 'Nepodařilo se vytvořit plán.' }

  const rows = moduleTypes.map((t) => ({
    plan_id: plan.id,
    module_type: t,
    slot: t === 'income_protection_2' ? 2 : 1,
  }))
  const { error: modErr } = await supabase.from('plan_modules').insert(rows)
  if (modErr) return { error: modErr.message }

  revalidatePath('/')
  redirect(`/plans/${plan.id}`)
}
