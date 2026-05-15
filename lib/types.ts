export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  created_at: string
}

export interface Client {
  id: string
  advisor_id: string
  full_name: string
  age: number
  created_at: string
  updated_at: string
}

export type PlanStatus = 'draft' | 'review' | 'complete'

export interface FinancialPlan {
  id: string
  client_id: string
  advisor_id: string
  status: PlanStatus
  created_at: string
  updated_at: string
}

export interface PlanModule {
  id: string
  plan_id: string
  module_type: string
  slot: number
  extracted_data: Record<string, unknown> | null
  manual_override: Record<string, unknown> | null
  pdf_url: string | null
  is_verified: boolean
  created_at: string
}

export interface PlanWithClient extends FinancialPlan {
  clients: { full_name: string; age: number } | null
}
