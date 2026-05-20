'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function saveModuleData(
  moduleId: string,
  payload: { extracted_data?: Record<string, unknown>; manual_override?: Record<string, unknown> | null; is_verified?: boolean; pdf_url?: string | null },
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nepřihlášený uživatel.' }

  const { error } = await supabase.from('plan_modules').update(payload).eq('id', moduleId)
  if (error) return { error: error.message }

  revalidatePath('/plans')
  return { ok: true }
}

export async function setPlanStatus(planId: string, status: 'draft' | 'review' | 'complete') {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nepřihlášený uživatel.' }

  const { error } = await supabase
    .from('financial_plans')
    .update({ status })
    .eq('id', planId)
    .eq('advisor_id', user.id)
  if (error) return { error: error.message }

  revalidatePath('/plans')
  revalidatePath('/dashboard')
  return { ok: true }
}
