declare const spindle: import('lumiverse-spindle-types').SpindleAPI

type TarotHistoryCard = {
  id?: number
  inverted?: boolean
  name?: string
  interpretation?: string
}

type TarotHistoryEntry = {
  timestamp?: number
  question?: string
  spreadType?: string
  variant?: string
  positions?: string[]
  cards?: TarotHistoryCard[]
  synthesis?: string
}

type MacroSection = 'cards' | 'interpret' | 'synthesis' | 'full'

type MacroInvocationContext = {
  commit?: boolean
  chatId?: string
  env?: {
    chat?: { id?: string }
    extra?: { userId?: unknown }
  } & Record<string, unknown>
}

// Output must never re-expand as macros: break up brace pairs coming from
// user/LLM content. Single lone braces are left alone.
const sanitize = (text: string): string => text.replace(/\{\{/g, '{ {').replace(/\}\}/g, '} }')

function chatIdFrom(ctx: MacroInvocationContext | null | undefined): string | null {
  const fromCtx = typeof ctx?.chatId === 'string' ? ctx.chatId.trim() : ''
  if (fromCtx) return /^[A-Za-z0-9_-]{1,128}$/.test(fromCtx) ? fromCtx : null
  const envId = ctx?.env?.chat?.id
  const fromEnv = typeof envId === 'string' ? envId.trim() : ''
  return fromEnv && /^[A-Za-z0-9_-]{1,128}$/.test(fromEnv) ? fromEnv : null
}

function userIdFrom(ctx: MacroInvocationContext | null | undefined): string | null {
  const raw = ctx?.env?.extra?.userId
  if (typeof raw === 'string' && raw.trim()) return raw.trim()
  if (typeof raw === 'number' && Number.isFinite(raw)) return String(raw)
  return null
}

// Entries are stored newest-first (unshift), capped to the last 3 readings.
// Only fully-synthesized readings are written, so the head of the list is the
// latest complete reading for this chat.
async function getHistoryEntry(chatId: string, userId: string): Promise<TarotHistoryEntry | null> {
  try {
    const history = await spindle.userStorage.getJson<TarotHistoryEntry[]>(`history/${chatId}.json`, { fallback: [], userId })
    if (!Array.isArray(history) || history.length === 0) return null
    const latest = history[0]
    if (!latest || typeof latest !== 'object') return null
    return latest
  } catch (err: any) {
    try { spindle.log.error(`Tarot Reader: Failed to read history for chat ${chatId} - ${err?.message || err}`) } catch { /* never throw from a macro */ }
    return null
  }
}

function reconstructedPositions(spreadType: string, variant: string): string[] | null {
  switch (spreadType) {
    case '1': return ['The Card']
    case '3': return variant === 'mbs' ? ['Mind', 'Body', 'Soul'] : ['Past', 'Present', 'Future']
    case '5': return ['Past', 'Present', 'Future', 'Core Reason', 'Potential']
    case '7': return ['Past', 'Present', 'Hidden Influences', 'Obstacles', 'Potential', 'Advice', 'Potential Outcome']
    case '10': return ['Present', 'Challenge', 'Focus', 'Past', 'Strengths', 'Near Future', 'Advice', 'Environment', 'Hopes and Fears', 'Potential Outcome']
    default: return null
  }
}

function positionsFor(entry: TarotHistoryEntry): string[] {
  const cards = Array.isArray(entry.cards) ? entry.cards : []
  const stored = Array.isArray(entry.positions) ? entry.positions : null
  const base = reconstructedPositions(String(entry.spreadType ?? ''), String(entry.variant ?? ''))
  return cards.map((_, i) => {
    const fromStored = stored?.[i]
    if (typeof fromStored === 'string' && fromStored.trim()) return fromStored.trim()
    const fromBase = base?.[i]
    if (fromBase) return fromBase
    return `Card ${i + 1}`
  })
}

function spreadLabel(entry: TarotHistoryEntry): string {
  const spreadType = String(entry.spreadType ?? '')
  let label: string
  switch (spreadType) {
    case '1': label = 'Single Card'; break
    case '3': label = '3-Card Spread'; break
    case '5': label = 'Five Card Cross'; break
    case '7': label = 'Seven Card Horseshoe'; break
    case '10': label = 'Celtic Cross'; break
    default: label = 'Tarot Spread'
  }
  if (spreadType === '3') label += String(entry.variant ?? '') === 'mbs' ? ' (Mind/Body/Soul)' : ' (Past/Present/Future)'
  return label
}

function dateLabel(timestamp: unknown): string | null {
  const t = typeof timestamp === 'number' ? timestamp : Number(timestamp)
  if (!Number.isFinite(t)) return null
  try {
    return new Date(t).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return null
  }
}

function headerLines(entry: TarotHistoryEntry): string[] {
  const base = `Tarot reading — ${spreadLabel(entry)}`
  const date = dateLabel(entry.timestamp)
  const lines = [date ? `${base} · ${date}` : base]
  const question = typeof entry.question === 'string' ? entry.question.trim() : ''
  if (question) lines.push(`Question: ${question}`)
  return lines
}

function cardBasics(entry: TarotHistoryEntry): Array<{ position: string; name: string; orientation: string }> {
  const cards = Array.isArray(entry.cards) ? entry.cards : []
  const positions = positionsFor(entry)
  return cards.map((card, i) => ({
    position: positions[i],
    name: typeof card?.name === 'string' && card.name.trim() ? card.name.trim() : 'Unknown',
    orientation: card?.inverted ? 'Inverted' : 'Upright',
  }))
}

function interpretationFor(entry: TarotHistoryEntry, index: number): string {
  const cards = Array.isArray(entry.cards) ? entry.cards : []
  const raw = cards[index]?.interpretation
  return typeof raw === 'string' ? raw.trim() : ''
}

function synthesisOf(entry: TarotHistoryEntry): string {
  return typeof entry.synthesis === 'string' ? entry.synthesis.trim() : ''
}

function format(entry: TarotHistoryEntry, section: MacroSection): string {
  const synthesis = synthesisOf(entry)

  if (section === 'synthesis') {
    return sanitize(synthesis)
  }

  const basics = cardBasics(entry)
  const header = headerLines(entry)

  if (section === 'cards') {
    const lines = [...header]
    basics.forEach(({ position, name, orientation }, i) => {
      lines.push(`${i + 1}. ${position} — ${name} (${orientation})`)
    })
    return sanitize(lines.join('\n'))
  }

  const blocks = basics.map(({ position, name, orientation }, i) => {
    const cardLine = `${position} — ${name} (${orientation})`
    const interpretation = interpretationFor(entry, i)
    return interpretation ? `${cardLine}\n${interpretation}` : cardLine
  })

  const parts = [...header]
  if (blocks.length > 0) {
    parts.push('', blocks.join('\n\n'))
  }
  if (section === 'full' && synthesis) {
    parts.push('', `Synthesis:\n${synthesis}`)
  }
  return sanitize(parts.join('\n'))
}

async function resolveReading(ctx: MacroInvocationContext | null | undefined, section: MacroSection): Promise<string> {
  try {
    const chatId = chatIdFrom(ctx)
    if (!chatId) return ''
    const userId = userIdFrom(ctx)
    if (!userId) return ''
    const entry = await getHistoryEntry(chatId, userId)
    if (!entry) return ''
    return format(entry, section)
  } catch (err: any) {
    try { spindle.log.error(`Tarot Reader: Macro resolve failed - ${err?.message || err}`) } catch { /* never throw from a macro */ }
    return ''
  }
}

export function registerTarotMacros(): void {
  // The host invokes function handlers directly (string handlers are refused)
  // and matches macro names case-insensitively. The published DTO types lag
  // the host (handler is typed as string and `terminal` is absent), so cast.
  const register = (name: string, description: string, section: MacroSection) => {
    const def = {
      name,
      category: 'Tarot',
      description,
      volatile: true,
      terminal: true,
      returnType: 'string',
      handler: (ctx: MacroInvocationContext) => resolveReading(ctx ?? {}, section),
    }
    spindle.registerMacro(def as unknown as Parameters<typeof spindle.registerMacro>[0])
  }

  register('tarotCards', 'Insert the card list from the latest completed tarot reading in the current chat. Empty string when no reading exists for this chat.', 'cards')
  register('tarotInterpret', 'Insert the latest completed tarot reading for the current chat with per-card interpretations. Empty string when no reading exists for this chat.', 'interpret')
  register('tarotSynthesis', 'Insert only the synthesis of the latest completed tarot reading in the current chat. Empty string when no reading exists for this chat.', 'synthesis')
  register('tarotReading', 'Insert the full latest completed tarot reading for the current chat (cards, interpretations, and synthesis). Empty string when no reading exists for this chat.', 'full')
}
