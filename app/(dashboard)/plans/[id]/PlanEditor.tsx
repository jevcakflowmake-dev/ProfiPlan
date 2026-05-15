'use client'
import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { getModule } from '@/lib/modules'
import type { PlanModule } from '@/lib/types'
import { saveModuleData } from './actions'

interface Props {
  planId: string
  module: PlanModule
}

export default function PlanEditor({ planId, module }: Props) {
  const router = useRouter()
  const def = getModule(module.module_type)!
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [data, setData] = useState<Record<string, unknown>>(
    (module.manual_override ?? module.extracted_data ?? {}) as Record<string, unknown>,
  )
  const [editing, setEditing] = useState(false)
  const [pdfUrl, setPdfUrl] = useState(module.pdf_url)
  const [verified, setVerified] = useState(module.is_verified)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setData((module.manual_override ?? module.extracted_data ?? {}) as Record<string, unknown>)
    setPdfUrl(module.pdf_url)
    setVerified(module.is_verified)
    setEditing(false)
  }, [module.id, module.extracted_data, module.manual_override, module.pdf_url, module.is_verified])

  async function handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      toast.error('Nahraj prosím PDF soubor.')
      return
    }
    setUploading(true)
    const supabase = createClient()
    const path = `${planId}/${module.module_type}_${module.slot}.pdf`
    const { error: upErr } = await supabase.storage.from('plan-pdfs').upload(path, file, {
      upsert: true,
      contentType: 'application/pdf',
    })
    setUploading(false)
    if (upErr) {
      toast.error(upErr.message)
      return
    }

    const { error: saveErr } = await saveModuleData(module.id, { pdf_url: path })
    if (saveErr) {
      toast.error(saveErr)
      return
    }
    setPdfUrl(path)
    toast.success('PDF nahráno. Spouštím AI extrakci…')

    setExtracting(true)
    const res = await fetch('/api/extract-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleId: module.id, path, moduleType: module.module_type }),
    })
    setExtracting(false)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error ?? 'AI extrakce selhala.')
      return
    }
    const json = await res.json()
    setData(json.data ?? {})
    toast.success('AI extrakce dokončena. Zkontroluj hodnoty.')
    startTransition(() => router.refresh())
  }

  async function onSave() {
    const res = await saveModuleData(module.id, {
      manual_override: editing ? data : null,
      is_verified: verified,
    })
    if (res.error) {
      toast.error(res.error)
      return
    }
    toast.success('Uloženo')
    startTransition(() => router.refresh())
  }

  async function onVerify() {
    setVerified(true)
    const res = await saveModuleData(module.id, {
      manual_override: editing ? data : module.manual_override ?? undefined,
      is_verified: true,
    })
    if (res.error) {
      toast.error(res.error)
      setVerified(false)
      return
    }
    toast.success('Modul označen jako zkontrolovaný')
    startTransition(() => router.refresh())
  }

  return (
    <div className="space-y-4">
      <div className="card p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">{def.label}</h2>
            {pdfUrl && <p className="text-xs text-muted mt-1">PDF: {pdfUrl.split('/').pop()}</p>}
          </div>
          {verified && (
            <span className="badge-complete">
              ✓ Zkontrolováno
            </span>
          )}
        </div>

        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const file = e.dataTransfer.files?.[0]
            if (file) handleFile(file)
          }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            dragOver
              ? 'border-accent bg-accent/5'
              : pdfUrl
                ? 'border-success/30 bg-success/5'
                : 'border-slate-300 hover:border-accent'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
          />
          <div className="text-2xl mb-1">{pdfUrl ? '📄' : '⬆'}</div>
          <div className="text-sm font-medium text-ink">
            {uploading
              ? 'Nahrávám…'
              : extracting
                ? 'AI analyzuje dokument…'
                : pdfUrl
                  ? 'PDF nahráno — klikni pro nahrazení'
                  : 'Klikni nebo přetáhni PDF modelaci'}
          </div>
          <div className="text-xs text-muted mt-1">Max 20 MB, pouze PDF</div>
        </div>

        {/* Extracted data */}
        {Object.keys(data).length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Vytažené hodnoty</h3>
              <label className="text-xs text-muted flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing}
                  onChange={(e) => setEditing(e.target.checked)}
                  className="accent-accent"
                />
                Upravit ručně
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {def.fields.map((f) => {
                const value = data[f.key]
                const isArr = f.type === 'array'
                return (
                  <div key={f.key}>
                    <label className="label">
                      {f.label}
                      {f.unit && <span className="text-muted/60"> ({f.unit})</span>}
                    </label>
                    {editing ? (
                      isArr ? (
                        <input
                          className="input"
                          value={Array.isArray(value) ? value.join(', ') : (value as string) ?? ''}
                          onChange={(e) =>
                            setData({ ...data, [f.key]: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
                          }
                          placeholder="oddělit čárkou"
                        />
                      ) : (
                        <input
                          className="input"
                          type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'}
                          value={(value as string | number | null) ?? ''}
                          onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                        />
                      )
                    ) : (
                      <div className="font-mono text-sm bg-slate-50 rounded-lg px-3 py-2 min-h-[40px] text-ink">
                        {value == null || value === ''
                          ? <span className="text-muted/50">—</span>
                          : Array.isArray(value)
                            ? value.join(', ')
                            : String(value)}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted bg-slate-50 rounded-lg px-4 py-6 text-center">
            Zatím žádná data. Nahraj PDF nebo přepni do ručního režimu níže.
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          {!Object.keys(data).length && (
            <button
              type="button"
              onClick={() => {
                setEditing(true)
                const empty: Record<string, unknown> = {}
                def.fields.forEach((f) => (empty[f.key] = ''))
                setData(empty)
              }}
              className="btn-ghost text-sm"
            >
              + Vyplnit ručně
            </button>
          )}

          <div className="flex gap-2 ml-auto">
            <button type="button" onClick={onSave} className="btn-secondary">
              Uložit
            </button>
            {!verified ? (
              <button type="button" onClick={onVerify} className="btn-primary">
                ✓ Zkontrolováno
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  setVerified(false)
                  await saveModuleData(module.id, { is_verified: false })
                  startTransition(() => router.refresh())
                }}
                className="btn-ghost text-sm"
              >
                Zrušit verifikaci
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
