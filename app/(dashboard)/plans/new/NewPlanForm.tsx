'use client'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { createPlan } from './actions'
import type { ModuleDef } from '@/lib/modules'

interface Client {
  id: string
  full_name: string
  age: number
}

export default function NewPlanForm({
  clients,
  modules,
  preselectClient,
}: {
  clients: Client[]
  modules: ModuleDef[]
  preselectClient?: string
}) {
  const [mode, setMode] = useState<'existing' | 'new'>(preselectClient || clients.length > 0 ? 'existing' : 'new')
  const [clientId, setClientId] = useState(preselectClient ?? clients[0]?.id ?? '')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(type: string) {
    const next = new Set(selected)
    next.has(type) ? next.delete(type) : next.add(type)
    setSelected(next)
  }

  async function action(formData: FormData) {
    selected.forEach((t) => formData.append('modules', t))
    if (mode === 'existing') formData.set('client_id', clientId)
    const res = await createPlan(formData)
    if (res?.error) toast.error(res.error)
  }

  const grouped = modules.reduce<Record<string, ModuleDef[]>>((acc, m) => {
    ;(acc[m.group] ||= []).push(m)
    return acc
  }, {})

  const groupLabel: Record<string, string> = {
    income: 'Zajištění příjmu',
    retirement: 'Penze',
    housing: 'Bydlení',
    children: 'Děti',
    investment: 'Investice',
    savings: 'Spoření',
  }

  return (
    <form action={action} className="space-y-6">
      <section className="card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">1. Klient</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode('existing')}
            disabled={clients.length === 0}
            className={mode === 'existing' ? 'btn-primary' : 'btn-secondary'}
          >
            Existující klient
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={mode === 'new' ? 'btn-primary' : 'btn-secondary'}
          >
            Nový klient
          </button>
        </div>

        {mode === 'existing' ? (
          <div>
            <label className="label">Klient</label>
            <select
              className="input"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} · {c.age} let
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Jméno a příjmení</label>
              <input name="new_client_name" required className="input" />
            </div>
            <div>
              <label className="label">Věk</label>
              <input name="new_client_age" type="number" min={0} max={120} required className="input" />
            </div>
          </div>
        )}
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink">2. Moduly plánu</h2>
        <p className="text-sm text-muted -mt-2">Vyber, které oblasti budeš v plánu řešit.</p>

        <div className="space-y-6">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              <h3 className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                {groupLabel[group]}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {items.map((m) => (
                  <label
                    key={m.type}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                      selected.has(m.type)
                        ? 'border-accent bg-accent/5'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(m.type)}
                      onChange={() => toggle(m.type)}
                      className="mt-0.5 accent-accent"
                    />
                    <span className="text-sm">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Submit disabled={selected.size === 0} />
      </div>
    </form>
  )
}

function Submit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className="btn-primary" disabled={disabled || pending}>
      {pending ? 'Vytvářím…' : 'Vytvořit plán'}
    </button>
  )
}
