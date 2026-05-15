import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { getModule } from '@/lib/modules'

export const runtime = 'nodejs'
export const maxDuration = 60

const SYSTEM_PROMPT = `Jsi expert na analýzu českých finančních dokumentů.
Dostaneš PDF modelaci pojistného nebo finančního produktu.
Extrahuj klíčové parametry a vrať POUZE validní JSON objekt — bez code fence, bez vysvětlení.
Pokud hodnotu nenajdeš nebo není jasná, použij null.
Číselné hodnoty vracej jako čísla (bez měny a bez mezer).
Pole vracej jako pole stringů.`

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Chybí ANTHROPIC_API_KEY.' }, { status: 500 })

  const body = (await req.json()) as { moduleId: string; path: string; moduleType: string }
  const def = getModule(body.moduleType)
  if (!def) return NextResponse.json({ error: 'Neznámý typ modulu.' }, { status: 400 })

  // Ověření vlastnictví modulu přes RLS
  const { data: mod } = await supabase
    .from('plan_modules')
    .select('id, plan_id')
    .eq('id', body.moduleId)
    .maybeSingle()
  if (!mod) return NextResponse.json({ error: 'Modul nenalezen.' }, { status: 404 })

  // Stažení PDF přes service role (bypass storage RLS pro server)
  const service = createServiceClient()
  const { data: file, error: dlErr } = await service.storage.from('plan-pdfs').download(body.path)
  if (dlErr || !file) return NextResponse.json({ error: dlErr?.message ?? 'PDF nenalezeno.' }, { status: 404 })

  const arrayBuf = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuf).toString('base64')

  const fieldsHint = def.fields.map((f) => `"${f.key}": ${f.type === 'array' ? 'string[]' : f.type === 'number' ? 'number' : 'string'} // ${f.label}${f.unit ? ` (${f.unit})` : ''}`).join('\n')

  const anthropic = new Anthropic({ apiKey })
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 },
          },
          {
            type: 'text',
            text: `Extrahuj z dokumentu parametry pro typ modulu: ${def.label}.\n\nVrať JSON s následujícími klíči:\n${fieldsHint}\n\nVrať POUZE JSON objekt.`,
          },
        ],
      },
    ],
  })

  const text = message.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n')

  let parsed: Record<string, unknown>
  try {
    const match = text.match(/\{[\s\S]*\}/)
    parsed = JSON.parse(match ? match[0] : text)
  } catch {
    return NextResponse.json({ error: 'Claude vrátil neplatný JSON.', raw: text }, { status: 502 })
  }

  await supabase.from('plan_modules').update({ extracted_data: parsed }).eq('id', body.moduleId)

  return NextResponse.json({ data: parsed })
}
