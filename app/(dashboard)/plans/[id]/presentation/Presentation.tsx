'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { getModule } from '@/lib/modules'
import type { PlanModule } from '@/lib/types'

interface Props {
  planId: string
  clientName: string
  clientAge: number
  advisorName: string
  modules: PlanModule[]
}

export default function Presentation({ planId, clientName, clientAge, advisorName, modules }: Props) {
  const deckRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let deck: { destroy?: () => void } | null = null
    let css: HTMLLinkElement | null = null
    let theme: HTMLLinkElement | null = null

    ;(async () => {
      css = document.createElement('link')
      css.rel = 'stylesheet'
      css.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/reveal.min.css'
      document.head.appendChild(css)

      theme = document.createElement('link')
      theme.rel = 'stylesheet'
      theme.href = 'https://cdn.jsdelivr.net/npm/reveal.js@5.1.0/dist/theme/black.min.css'
      document.head.appendChild(theme)

      const Reveal = (await import('reveal.js')).default
      deck = new Reveal(deckRef.current!, {
        embedded: false,
        hash: true,
        transition: 'slide',
        controls: true,
        progress: true,
        touch: true,
        slideNumber: 'c/t',
      })
      // @ts-expect-error reveal types
      await deck.initialize()
    })()

    return () => {
      try { deck?.destroy?.() } catch { /* noop */ }
      css?.remove()
      theme?.remove()
    }
  }, [])

  function fmt(value: unknown, unit?: string) {
    if (value == null || value === '') return '—'
    if (Array.isArray(value)) return value.join(' · ')
    if (typeof value === 'number') return `${value.toLocaleString('cs-CZ')}${unit ? ' ' + unit : ''}`
    return String(value) + (unit ? ` ${unit}` : '')
  }

  return (
    <div className="fixed inset-0 bg-black">
      <Link
        href={`/plans/${planId}/review`}
        className="absolute top-4 left-4 z-50 text-white/70 hover:text-white text-sm bg-white/10 backdrop-blur px-3 py-1.5 rounded-full"
      >
        ← Zpět
      </Link>

      <div className="reveal" ref={deckRef}>
        <div className="slides">
          {/* Titulní slide */}
          <section data-background-gradient="linear-gradient(135deg, #1B3A6B 0%, #2D7DD2 100%)">
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '1.4em' }}>Finanční plán</h2>
            <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '2.5em' }}>{clientName}</h1>
            <p style={{ opacity: 0.8, fontSize: '0.7em' }}>
              {clientAge} let · {new Date().toLocaleDateString('cs-CZ')}
            </p>
            <p style={{ opacity: 0.6, fontSize: '0.5em', marginTop: '2em' }}>Připravil: {advisorName}</p>
          </section>

          {/* Přehled */}
          <section>
            <h2>Co plán zahrnuje</h2>
            <ul style={{ display: 'inline-block', textAlign: 'left' }}>
              {modules.map((m) => {
                const def = getModule(m.module_type)
                return <li key={m.id}>{def?.label}</li>
              })}
            </ul>
          </section>

          {/* Modul po modulu */}
          {modules.map((m) => {
            const def = getModule(m.module_type)
            if (!def) return null
            const data = (m.manual_override ?? m.extracted_data ?? {}) as Record<string, unknown>
            return (
              <section key={m.id}>
                <h2>{def.label}</h2>
                <table
                  style={{
                    margin: '0 auto',
                    fontSize: '0.65em',
                    borderCollapse: 'collapse',
                  }}
                >
                  <tbody>
                    {def.fields.map((f) => (
                      <tr key={f.key}>
                        <td style={{ padding: '0.4em 1em', opacity: 0.6, textAlign: 'right' }}>
                          {f.label}
                        </td>
                        <td style={{ padding: '0.4em 1em', textAlign: 'left', fontFamily: 'JetBrains Mono, monospace' }}>
                          {fmt(data[f.key], f.unit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )
          })}

          {/* Závěr */}
          <section data-background-gradient="linear-gradient(135deg, #1B3A6B 0%, #2D7DD2 100%)">
            <h2>Shrnutí</h2>
            <p style={{ opacity: 0.85, marginTop: '1em' }}>
              Tvůj plán pokrývá <strong>{modules.length}</strong> oblastí.
            </p>
            <p style={{ opacity: 0.6, fontSize: '0.6em', marginTop: '2em' }}>{advisorName}</p>
          </section>
        </div>
      </div>
    </div>
  )
}
