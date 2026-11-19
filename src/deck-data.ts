// Pure tarot-deck data shared by the backend (and later the frontend).
// No spindle dependencies — safe to import from any extension bundle.
import { TAROT_DECK } from './tarot-data'

export const TOTAL_CARDS = 79

export const MAX_CUSTOM_CARDS = 400
export const MAX_CARD_NAME_CHARS = 80
export const MAX_GUIDEBOOK_CHARS = 32000

export const MAX_CARD_BYTES = 2_500_000
// base64 expands 3 bytes into 4 chars; allow a small slack for padding/length quirks.
export const MAX_B64_CHARS = Math.ceil((MAX_CARD_BYTES * 4) / 3) + 16

export const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// The plain slug rule yields "the-fool" / "the-magician" / "the-high-priestess"
// for the first three majors, but the canonical import filenames drop the
// leading article there. Every other entry follows the rule as written
// (e.g. 12-the-hanged-man, 10-wheel-of-fortune, 78-card-back).
const SLUG_OVERRIDES: Record<number, string> = {
  0: 'fool',
  1: 'magician',
  2: 'high-priestess',
  78: 'card-back'
}

export const DECK_SLUGS: string[] = Array.from({ length: TOTAL_CARDS }, (_, i) => {
  const base = SLUG_OVERRIDES[i] ?? slugify(TAROT_DECK[i]?.name ?? 'unknown')
  return `${i.toString().padStart(2, '0')}-${base}`
})

export function cardLabel(i: number): { slug: string; name: string } {
  const idx = Number.isFinite(i) ? Math.trunc(i) : 0
  const card = TAROT_DECK[idx]
  return {
    slug: DECK_SLUGS[idx] ?? `${idx.toString().padStart(2, '0')}-unknown`,
    name: card?.name ?? 'Unknown'
  }
}

export interface ParsedCustomList {
  cardNames: string[]
  backIndex: number | null
}

// Parses a user-supplied custom card list. Two entry shapes are supported:
//   '3=The Emperor'  — numbered card at index 3 (indices must be 0..N-1)
//   'back'           — marks the card back; placed at the final index
// Entries are separated by commas and/or newlines. Never throws — on any
// problem the return value is { error } with a user-facing message.
export function parseCustomCardList(raw: string): ParsedCustomList | { error: string } {
  if (typeof raw !== 'string') return { error: 'Card list must be a string.' }

  const segments = raw
    .split(/[,\n]/)
    .map(segment => segment.trim())
    .filter(segment => segment.length > 0)

  const entries: Array<{ index: number; name: string }> = []
  let backCount = 0

  for (const segment of segments) {
    if (segment.toLowerCase() === 'back') {
      backCount += 1
      if (backCount > 1) return { error: "Only one card back ('back') entry is allowed." }
      continue
    }
    const match = /^(\d+)\s*=\s*(.*)$/.exec(segment)
    if (!match) {
      return { error: `Line/entry "${segment}" must look like '0=Card Name' or the bare word 'back'.` }
    }
    const index = Number(match[1])
    const name = match[2].trim()
    if (name.length === 0) return { error: `Card name for index ${index} is empty.` }
    if (name.length > MAX_CARD_NAME_CHARS) return { error: `Card name for index ${index} exceeds ${MAX_CARD_NAME_CHARS} characters.` }
    entries.push({ index, name })
  }

  const numbered = entries.length
  const total = numbered + (backCount > 0 ? 1 : 0)
  if (total < 1) return { error: 'Deck must contain at least one card.' }
  if (total > MAX_CUSTOM_CARDS) return { error: `Deck exceeds the ${MAX_CUSTOM_CARDS}-card limit.` }

  const sorted = [...entries].sort((a, b) => a.index - b.index)
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].index === sorted[i - 1].index) {
      return { error: `Duplicate card index ${sorted[i].index}.` }
    }
  }

  const seen = new Set(entries.map(entry => entry.index))
  for (let i = 0; i < numbered; i++) {
    if (!seen.has(i)) {
      return { error: `Missing card index ${i} (indices must be 0..N-1 with no gaps).` }
    }
  }

  const cardNames: string[] = new Array(total)
  for (const entry of entries) cardNames[entry.index] = entry.name
  let backIndex: number | null = null
  if (backCount > 0) {
    backIndex = numbered
    cardNames[numbered] = 'Card Back'
  }

  return { cardNames, backIndex }
}
