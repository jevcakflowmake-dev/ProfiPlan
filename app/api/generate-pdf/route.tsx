import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { PlanDocument } from './document'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const planId = searchParams.get('planId')
  if (!planId) return NextResponse.json({ error: 'planId required' }, { status: 400 })

  const { data: plan } = await supabase
    .from('financial_plans')
    .select('*, clients (full_name, age)')
    .eq('id', planId)
    .eq('advisor_id', user.id)
    .maybeSingle()
  if (!plan) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const { data: modules } = await supabase
    .from('plan_modules')
    .select('*')
    .eq('plan_id', plan.id)
    .order('created_at')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .maybeSingle()

  const client = Array.isArray(plan.clients) ? plan.clients[0] : plan.clients

  const buffer = await renderToBuffer(
    <PlanDocument
      clientName={client?.full_name ?? ''}
      clientAge={client?.age ?? 0}
      advisorName={profile?.full_name ?? profile?.email ?? user.email ?? ''}
      modules={modules ?? []}
    />,
  )

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="plan-${(client?.full_name ?? 'klient').replace(/\s+/g, '-')}.pdf"`,
    },
  })
}
