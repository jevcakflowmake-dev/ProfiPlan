// ───────────────────────────────────────────────────────────
// Demo data pro manažerský dashboard
// ───────────────────────────────────────────────────────────

export interface DemoAdvisor {
  id: string
  initials: string
  fullName: string
  region: string
  joinedAt: string
  totalPlans: number
  activePlans: number
  completedPlans: number
  thisWeek: number
  lastActivity: string
  activity30d: number[] // sparkline — denní počet akcí
  avatarColor: string
}

export interface DemoPlan {
  id: string
  clientName: string
  clientAge: number
  advisorId: string
  advisorName: string
  status: 'draft' | 'review' | 'complete'
  updatedAt: string
  modules: number
  monthlyValue: number // pojistné / vklady součet
}

export const DEMO_MANAGER = {
  fullName: 'Jakub Jevčák',
  role: 'Ředitel sítě',
  teamName: 'Tým Praha & Střední Čechy',
}

export const DEMO_ADVISORS: DemoAdvisor[] = [
  {
    id: 'a1',
    initials: 'AS',
    fullName: 'Anna Svobodová',
    region: 'Praha',
    joinedAt: '2024-02-15',
    totalPlans: 47,
    activePlans: 8,
    completedPlans: 39,
    thisWeek: 5,
    lastActivity: 'před 2 hod',
    activity30d: [2, 3, 1, 4, 2, 0, 0, 3, 5, 2, 4, 1, 0, 0, 3, 6, 4, 2, 0, 0, 5, 3, 4, 2, 1, 0, 0, 4, 5, 3],
    avatarColor: '#2D7DD2',
  },
  {
    id: 'a2',
    initials: 'TD',
    fullName: 'Tomáš Dvořák',
    region: 'Mladá Boleslav',
    joinedAt: '2023-09-04',
    totalPlans: 62,
    activePlans: 11,
    completedPlans: 51,
    thisWeek: 7,
    lastActivity: 'před 35 min',
    activity30d: [4, 5, 3, 2, 4, 0, 0, 6, 7, 5, 4, 3, 0, 0, 5, 8, 6, 4, 0, 0, 6, 5, 7, 4, 3, 0, 0, 5, 7, 8],
    avatarColor: '#16A34A',
  },
  {
    id: 'a3',
    initials: 'MN',
    fullName: 'Marie Nováková',
    region: 'Kladno',
    joinedAt: '2025-03-22',
    totalPlans: 14,
    activePlans: 5,
    completedPlans: 9,
    thisWeek: 3,
    lastActivity: 'dnes ráno',
    activity30d: [0, 0, 1, 2, 1, 0, 0, 0, 2, 1, 3, 1, 0, 0, 2, 3, 1, 2, 0, 0, 1, 2, 3, 1, 0, 0, 0, 2, 3, 2],
    avatarColor: '#D97706',
  },
  {
    id: 'a4',
    initials: 'PČ',
    fullName: 'Petr Černý',
    region: 'Beroun',
    joinedAt: '2023-05-11',
    totalPlans: 31,
    activePlans: 2,
    completedPlans: 29,
    thisWeek: 0,
    lastActivity: 'před 6 dny',
    activity30d: [1, 0, 0, 0, 1, 0, 0, 2, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    avatarColor: '#64748B',
  },
  {
    id: 'a5',
    initials: 'LP',
    fullName: 'Lucie Procházková',
    region: 'Praha 4',
    joinedAt: '2024-11-08',
    totalPlans: 28,
    activePlans: 9,
    completedPlans: 19,
    thisWeek: 6,
    lastActivity: 'před 12 min',
    activity30d: [3, 4, 2, 3, 5, 0, 0, 4, 5, 6, 3, 2, 0, 0, 4, 5, 3, 4, 0, 0, 6, 4, 5, 3, 2, 0, 0, 5, 6, 4],
    avatarColor: '#8B5CF6',
  },
  {
    id: 'a6',
    initials: 'JV',
    fullName: 'Jiří Veselý',
    region: 'Příbram',
    joinedAt: '2024-06-20',
    totalPlans: 19,
    activePlans: 4,
    completedPlans: 15,
    thisWeek: 2,
    lastActivity: 'včera',
    activity30d: [1, 2, 1, 0, 2, 0, 0, 1, 3, 2, 1, 1, 0, 0, 2, 3, 1, 1, 0, 0, 2, 1, 3, 1, 1, 0, 0, 1, 2, 1],
    avatarColor: '#0EA5E9',
  },
]

export const DEMO_RECENT_PLANS: DemoPlan[] = [
  {
    id: 'p1',
    clientName: 'Petr Novák',
    clientAge: 38,
    advisorId: 'a2',
    advisorName: 'Tomáš Dvořák',
    status: 'complete',
    updatedAt: '2026-05-20T07:24:00Z',
    modules: 6,
    monthlyValue: 32450,
  },
  {
    id: 'p2',
    clientName: 'Jana Veselá',
    clientAge: 42,
    advisorId: 'a5',
    advisorName: 'Lucie Procházková',
    status: 'review',
    updatedAt: '2026-05-20T06:48:00Z',
    modules: 4,
    monthlyValue: 8900,
  },
  {
    id: 'p3',
    clientName: 'Karel Procházka',
    clientAge: 55,
    advisorId: 'a1',
    advisorName: 'Anna Svobodová',
    status: 'complete',
    updatedAt: '2026-05-19T18:32:00Z',
    modules: 7,
    monthlyValue: 24800,
  },
  {
    id: 'p4',
    clientName: 'Eva Horáková',
    clientAge: 31,
    advisorId: 'a3',
    advisorName: 'Marie Nováková',
    status: 'draft',
    updatedAt: '2026-05-19T14:15:00Z',
    modules: 3,
    monthlyValue: 4200,
  },
  {
    id: 'p5',
    clientName: 'Martin Krejčí',
    clientAge: 47,
    advisorId: 'a2',
    advisorName: 'Tomáš Dvořák',
    status: 'review',
    updatedAt: '2026-05-19T11:02:00Z',
    modules: 5,
    monthlyValue: 14600,
  },
  {
    id: 'p6',
    clientName: 'Andrea Müllerová',
    clientAge: 29,
    advisorId: 'a5',
    advisorName: 'Lucie Procházková',
    status: 'complete',
    updatedAt: '2026-05-18T16:40:00Z',
    modules: 4,
    monthlyValue: 6800,
  },
  {
    id: 'p7',
    clientName: 'Lukáš Beneš',
    clientAge: 51,
    advisorId: 'a1',
    advisorName: 'Anna Svobodová',
    status: 'complete',
    updatedAt: '2026-05-18T13:20:00Z',
    modules: 6,
    monthlyValue: 19200,
  },
  {
    id: 'p8',
    clientName: 'Veronika Šťastná',
    clientAge: 36,
    advisorId: 'a6',
    advisorName: 'Jiří Veselý',
    status: 'review',
    updatedAt: '2026-05-18T09:55:00Z',
    modules: 5,
    monthlyValue: 11400,
  },
  {
    id: 'p9',
    clientName: 'Roman Beneš',
    clientAge: 44,
    advisorId: 'a2',
    advisorName: 'Tomáš Dvořák',
    status: 'draft',
    updatedAt: '2026-05-17T17:30:00Z',
    modules: 2,
    monthlyValue: 3100,
  },
  {
    id: 'p10',
    clientName: 'Klára Dudková',
    clientAge: 33,
    advisorId: 'a1',
    advisorName: 'Anna Svobodová',
    status: 'complete',
    updatedAt: '2026-05-17T11:08:00Z',
    modules: 5,
    monthlyValue: 13200,
  },
]

// ── Souhrnné metriky ─────────────────────────────────────
export function getTeamMetrics() {
  const totalAdvisors = DEMO_ADVISORS.length
  const totalPlans = DEMO_ADVISORS.reduce((s, a) => s + a.totalPlans, 0)
  const activePlans = DEMO_ADVISORS.reduce((s, a) => s + a.activePlans, 0)
  const completedPlans = DEMO_ADVISORS.reduce((s, a) => s + a.completedPlans, 0)
  const thisWeek = DEMO_ADVISORS.reduce((s, a) => s + a.thisWeek, 0)
  const monthlyVolume = DEMO_RECENT_PLANS.reduce((s, p) => s + p.monthlyValue, 0)
  const avgPlansPerAdvisor = Math.round(totalPlans / totalAdvisors)

  return {
    totalAdvisors,
    totalPlans,
    activePlans,
    completedPlans,
    thisWeek,
    monthlyVolume,
    avgPlansPerAdvisor,
  }
}
