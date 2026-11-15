// Pure tarot-deck data shared by the backend (and later the frontend).
// No spindle dependencies — safe to import from any extension bundle.
import { TAROT_DECK } from './tarot-data'

export const TOTAL_CARDS = 79

export const MAX_CARD_BYTES = 2_500_000
// base64 expands 3 bytes into 4 chars; allow a small slack for padding/length quirks.
export const MAX_B64_CHARS = Math.ceil((MAX_CARD_BYTES * 4) / 3) + 16

export const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

function slugify(name: string): string {
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
