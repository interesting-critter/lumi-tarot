// Per-user custom tarot deck state. Uses spindle.userStorage (pass userId everywhere).
declare const spindle: import('lumiverse-spindle-types').SpindleAPI

import { TAROT_DECK } from './tarot-data'
import { DECK_SLUGS, TOTAL_CARDS } from './deck-data'

export interface DeckCardEntry {
  url: string
  imageId: string
  mimeType: string
  file: string
}

export interface CustomDeck {
  id: string
  name: string
  createdAt: number
  nextIndex: number
  cards: Record<string, DeckCardEntry>
}

export interface DecksState {
  activeDeckId: string // 'default' or a deck id
  decks: CustomDeck[]
}

export interface DeckSummary {
  id: string
  name: string
  createdAt: number
  importedCount: number
  complete: boolean
  isActive: boolean
  nextSlug: string | null
  nextCardName: string | null
}

const DEFAULT_STATE: DecksState = { activeDeckId: 'default', decks: [] }

export function isSafeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{1,128}$/.test(id)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeCardEntry(value: unknown, deckId: string): DeckCardEntry | null {
  if (!isRecord(value)) return null
  const url = typeof value.url === 'string' ? value.url : ''
  const imageId = typeof value.imageId === 'string' ? value.imageId : ''
  const mimeType = typeof value.mimeType === 'string' ? value.mimeType : ''
  const file = typeof value.file === 'string' ? value.file : ''
  if (!url || !imageId) return null
  if (!url.startsWith('/api/v1/images/')) return null
  if (!isSafeId(imageId)) return null
  if (!file.startsWith(`decks/${deckId}/`)) return null
  if (file.includes('..') || file.includes('\\')) return null
  return { url, imageId, mimeType, file }
}

function sanitizeDeck(value: unknown): CustomDeck | null {
  if (!isRecord(value)) return null
  const id = typeof value.id === 'string' ? value.id.trim() : ''
  const name = typeof value.name === 'string' ? value.name : ''
  if (!id || id === 'default' || !isSafeId(id) || !name) return null

  const createdAtRaw = Number(value.createdAt)
  const createdAt = Number.isFinite(createdAtRaw) && createdAtRaw > 0 ? createdAtRaw : Date.now()

  const nextIndexRaw = Number(value.nextIndex)
  let nextIndex = Number.isFinite(nextIndexRaw) ? Math.trunc(nextIndexRaw) : 0
  nextIndex = Math.min(Math.max(nextIndex, 0), TOTAL_CARDS)

  const cards: Record<string, DeckCardEntry> = {}
  if (isRecord(value.cards)) {
    for (const [key, entry] of Object.entries(value.cards)) {
      const idx = Number(key)
      if (!Number.isInteger(idx) || idx < 0 || idx >= TOTAL_CARDS) continue
      const clean = sanitizeCardEntry(entry, id)
      if (clean) cards[String(idx)] = clean
    }
  }

  return { id, name, createdAt, nextIndex, cards }
}

export async function loadDecksState(userId: string): Promise<DecksState> {
  let raw: unknown = null
  try {
    raw = await spindle.userStorage.getJson<unknown>('decks.json', { fallback: null, userId })
  } catch (err: any) {
    spindle.log.error(`Tarot Reader: Failed to read decks.json - ${err?.message || err}`)
    return { ...DEFAULT_STATE, decks: [] }
  }

  if (!isRecord(raw)) return { ...DEFAULT_STATE, decks: [] }

  const decksInput = Array.isArray(raw.decks) ? raw.decks : []
  const decks: CustomDeck[] = []
  const seen = new Set<string>()
  for (const item of decksInput) {
    const deck = sanitizeDeck(item)
    if (!deck) continue
    if (seen.has(deck.id)) continue
    seen.add(deck.id)
    decks.push(deck)
  }

  let activeDeckId = typeof raw.activeDeckId === 'string' && raw.activeDeckId.trim() ? raw.activeDeckId : 'default'
  if (activeDeckId !== 'default' && !isSafeId(activeDeckId)) {
    activeDeckId = 'default'
  }
  if (activeDeckId !== 'default' && !decks.some(d => d.id === activeDeckId)) {
    activeDeckId = 'default'
  }

  return { activeDeckId, decks }
}

export async function saveDecksState(userId: string, state: DecksState): Promise<void> {
  await spindle.userStorage.setJson('decks.json', {
    activeDeckId: state.activeDeckId,
    decks: state.decks
  }, { userId })
}

export function complete(deck: CustomDeck): boolean {
  return deck.nextIndex >= TOTAL_CARDS
}

export function importedCount(deck: CustomDeck): number {
  return Math.min(Math.max(deck.nextIndex, 0), TOTAL_CARDS)
}

export function deckSummary(state: DecksState, deck: CustomDeck): DeckSummary {
  const idx = importedCount(deck)
  const isComplete = complete(deck)
  return {
    id: deck.id,
    name: deck.name,
    createdAt: deck.createdAt,
    importedCount: idx,
    complete: isComplete,
    isActive: state.activeDeckId === deck.id,
    nextSlug: isComplete ? null : (DECK_SLUGS[idx] ?? null),
    nextCardName: isComplete ? null : (TAROT_DECK[idx]?.name ?? null)
  }
}

export function summaries(state: DecksState): DeckSummary[] {
  // The built-in Default deck is NOT included — the frontend renders that row itself.
  return state.decks.map(deck => deckSummary(state, deck))
}

export function findDeck(state: DecksState, id: string): CustomDeck | null {
  if (!id || id === 'default') return null
  return state.decks.find(d => d.id === id) ?? null
}

export function imageUrlsFor(
  state: DecksState,
  activeDeckId: string,
  defaultUrls: Record<number, string>
): Record<number, string> {
  if (activeDeckId === 'default') return defaultUrls
  const deck = findDeck(state, activeDeckId)
  if (!deck) return defaultUrls
  const urls: Record<number, string> = {}
  for (const [key, entry] of Object.entries(deck.cards)) {
    const idx = Number(key)
    if (!Number.isInteger(idx) || idx < 0 || idx >= TOTAL_CARDS) continue
    if (entry?.url) urls[idx] = entry.url
  }
  return urls
}
