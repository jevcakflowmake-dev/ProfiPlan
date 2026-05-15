import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Presentation from './Presentation'

export const dynamic = 'force-dynamic'

export default async function PresentationPage({ params }: { params: { id: string } }) {
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

  const client = Array.isArray(plan.clients) ? plan.clients[0] : plan.clients

  return (
    <Presentation
      planId={plan.id}
      clientName={client?.full_name ?? ''}
      clientAge={client?.age ?? 0}
      advisorName={user.user_metadata?.full_name ?? user.email ?? ''}
      modules={modules ?? []}
    />
  )
}
