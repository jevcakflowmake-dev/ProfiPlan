import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import { getModule } from '@/lib/modules'
import type { PlanModule } from '@/lib/types'

const styles = StyleSheet.create({
  page: { padding: 56, fontFamily: 'Helvetica', color: '#0F172A', fontSize: 11 },
  cover: {
    padding: 56,
    backgroundColor: '#1B3A6B',
    color: '#FFFFFF',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  brand: { fontSize: 14, letterSpacing: 2, color: '#A5B4D2' },
  hugeTitle: { fontSize: 36, fontWeight: 700, marginTop: 12, fontFamily: 'Helvetica-Bold' },
  sub: { fontSize: 14, marginTop: 8, color: '#CBD5E1' },
  footer: { fontSize: 9, color: '#A5B4D2' },

  h1: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#1B3A6B', marginBottom: 6 },
  h2: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#1B3A6B', marginTop: 18, marginBottom: 10 },
  meta: { fontSize: 10, color: '#64748B', marginBottom: 24 },

  row: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#E2E8F0', paddingVertical: 6 },
  cellLabel: { width: '45%', color: '#64748B', fontSize: 10 },
  cellValue: { width: '55%', color: '#0F172A', fontSize: 10, fontFamily: 'Helvetica-Bold' },

  summaryBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
})

interface Props {
  clientName: string
  clientAge: number
  advisorName: string
  modules: PlanModule[]
}

function fmt(value: unknown, unit?: string): string {
  if (value == null || value === '') return '—'
  if (Array.isArray(value)) return value.join(', ')
  if (typeof value === 'number') return `${value.toLocaleString('cs-CZ')}${unit ? ' ' + unit : ''}`
  return String(value) + (unit ? ` ${unit}` : '')
}

export function PlanDocument({ clientName, clientAge, advisorName, modules }: Props) {
  return (
    <Document>
      {/* Titulní strana */}
      <Page size="A4" style={{ padding: 0 }}>
        <View style={styles.cover}>
          <View>
            <Text style={styles.brand}>PROFIPLÁN</Text>
            <Text style={styles.hugeTitle}>Finanční plán</Text>
            <Text style={styles.sub}>{clientName}</Text>
            <Text style={{ ...styles.sub, fontSize: 11, opacity: 0.75 }}>
              {clientAge} let · {new Date().toLocaleDateString('cs-CZ')}
            </Text>
          </View>
          <View>
            <Text style={styles.footer}>Připravil: {advisorName}</Text>
          </View>
        </View>
      </Page>

      {/* Moduly */}
      {modules.map((m) => {
        const def = getModule(m.module_type)
        if (!def) return null
        const data = (m.manual_override ?? m.extracted_data ?? {}) as Record<string, unknown>
        return (
          <Page key={m.id} size="A4" style={styles.page}>
            <Text style={styles.h1}>{def.label}</Text>
            <Text style={styles.meta}>
              {clientName} · {clientAge} let
            </Text>

            <View>
              {def.fields.map((f) => (
                <View key={f.key} style={styles.row}>
                  <Text style={styles.cellLabel}>{f.label}</Text>
                  <Text style={styles.cellValue}>{fmt(data[f.key], f.unit)}</Text>
                </View>
              ))}
            </View>
          </Page>
        )
      })}

      {/* Závěr */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Shrnutí</Text>
        <Text style={styles.meta}>
          Plán pokrývá {modules.length} oblastí finanční ochrany a růstu.
        </Text>

        <View style={styles.summaryBox}>
          <Text style={{ fontSize: 11, color: '#1B3A6B', fontFamily: 'Helvetica-Bold' }}>
            Tvůj poradce
          </Text>
          <Text style={{ fontSize: 14, marginTop: 6 }}>{advisorName}</Text>
        </View>
      </Page>
    </Document>
  )
}
