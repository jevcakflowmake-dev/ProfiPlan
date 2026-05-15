// ───────────────────────────────────────────────────────────
// Profiplán — definice modulů a polí pro AI extrakci
// ───────────────────────────────────────────────────────────

export type ModuleType =
  | 'income_protection_1'
  | 'income_protection_2'
  | 'pension'
  | 'mortgage_preparation'
  | 'mortgage'
  | 'children_investment'
  | 'children_insurance'
  | 'free_investment'
  | 'savings_goal'

export interface ModuleDef {
  type: ModuleType
  label: string
  group: 'income' | 'retirement' | 'housing' | 'children' | 'investment' | 'savings'
  fields: { key: string; label: string; unit?: string; type?: 'text' | 'number' | 'date' | 'array' }[]
  slot?: 1 | 2
}

const incomeFields = [
  { key: 'pojistovna', label: 'Pojišťovna' },
  { key: 'mesicni_pojistne', label: 'Měsíční pojistné', unit: 'Kč', type: 'number' as const },
  { key: 'pojistna_castka', label: 'Pojistná částka', unit: 'Kč', type: 'number' as const },
  { key: 'platnost_od', label: 'Platnost od', type: 'date' as const },
  { key: 'platnost_do', label: 'Platnost do', type: 'date' as const },
  { key: 'kryti_rizika', label: 'Krytá rizika', type: 'array' as const },
  { key: 'cekaci_doba', label: 'Čekací doba' },
  { key: 'karence', label: 'Karence' },
  { key: 'indexace', label: 'Indexace' },
]

const mortgageFields = [
  { key: 'banka', label: 'Banka' },
  { key: 'vyse_uveru', label: 'Výše úvěru', unit: 'Kč', type: 'number' as const },
  { key: 'mesicni_splatka', label: 'Měsíční splátka', unit: 'Kč', type: 'number' as const },
  { key: 'urokova_sazba', label: 'Úroková sazba', unit: '%', type: 'number' as const },
  { key: 'doba_splaceni', label: 'Doba splácení (roky)', type: 'number' as const },
  { key: 'ltv', label: 'LTV', unit: '%', type: 'number' as const },
  { key: 'fixace', label: 'Fixace' },
]

const investmentFields = [
  { key: 'instituce', label: 'Instituce' },
  { key: 'mesicni_vklad', label: 'Měsíční vklad', unit: 'Kč', type: 'number' as const },
  { key: 'predpokladane_zhodnoceni', label: 'Předpokládané zhodnocení', unit: '% p.a.', type: 'number' as const },
  { key: 'investicni_horizont', label: 'Investiční horizont (roky)', type: 'number' as const },
  { key: 'cilova_castka', label: 'Cílová částka', unit: 'Kč', type: 'number' as const },
]

export const MODULES: ModuleDef[] = [
  {
    type: 'income_protection_1',
    label: 'Zajištění příjmu — návrh 1',
    group: 'income',
    slot: 1,
    fields: incomeFields,
  },
  {
    type: 'income_protection_2',
    label: 'Zajištění příjmu — návrh 2',
    group: 'income',
    slot: 2,
    fields: incomeFields,
  },
  {
    type: 'pension',
    label: 'Zajištění na penzi',
    group: 'retirement',
    fields: [
      { key: 'instituce', label: 'Instituce' },
      { key: 'mesicni_prispevek', label: 'Měsíční příspěvek', unit: 'Kč', type: 'number' },
      { key: 'statni_prispevek', label: 'Státní příspěvek', unit: 'Kč', type: 'number' },
      { key: 'zamestnavatelsky_prispevek', label: 'Příspěvek zaměstnavatele', unit: 'Kč', type: 'number' },
      { key: 'predpokladana_renta', label: 'Předpokládaná renta', unit: 'Kč/měs', type: 'number' },
      { key: 'vek_odchodu', label: 'Věk odchodu', type: 'number' },
      { key: 'zhodnoceni_pa', label: 'Zhodnocení', unit: '% p.a.', type: 'number' },
    ],
  },
  { type: 'mortgage_preparation', label: 'Příprava na hypotéku', group: 'housing', fields: mortgageFields },
  { type: 'mortgage', label: 'Hypotéka', group: 'housing', fields: mortgageFields },
  { type: 'children_investment', label: 'Investice pro děti', group: 'children', fields: investmentFields },
  {
    type: 'children_insurance',
    label: 'Pojištění dětí',
    group: 'children',
    fields: [
      { key: 'pojistovna', label: 'Pojišťovna' },
      { key: 'mesicni_pojistne', label: 'Měsíční pojistné', unit: 'Kč', type: 'number' },
      { key: 'pojistna_castka', label: 'Pojistná částka', unit: 'Kč', type: 'number' },
      { key: 'kryti_rizika', label: 'Krytá rizika', type: 'array' },
      { key: 'vek_do', label: 'Pojištění do věku', type: 'number' },
    ],
  },
  { type: 'free_investment', label: 'Investice volných prostředků', group: 'investment', fields: investmentFields },
  {
    type: 'savings_goal',
    label: 'Spoření na přání',
    group: 'savings',
    fields: [
      { key: 'instituce', label: 'Instituce' },
      { key: 'mesicni_vklad', label: 'Měsíční vklad', unit: 'Kč', type: 'number' },
      { key: 'cilova_castka', label: 'Cílová částka', unit: 'Kč', type: 'number' },
      { key: 'horizont', label: 'Horizont (roky)', type: 'number' },
      { key: 'ucel', label: 'Účel' },
    ],
  },
]

export function getModule(type: ModuleType | string): ModuleDef | undefined {
  return MODULES.find((m) => m.type === type)
}

export function statusLabel(status: 'draft' | 'review' | 'complete'): string {
  return status === 'draft' ? 'Rozpracovaný' : status === 'review' ? 'Ke kontrole' : 'Dokončený'
}

export function statusBadgeClass(status: 'draft' | 'review' | 'complete'): string {
  return status === 'draft' ? 'badge-draft' : status === 'review' ? 'badge-review' : 'badge-complete'
}
