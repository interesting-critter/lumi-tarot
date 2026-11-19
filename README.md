# lumi-tarot
Just a simple, mostly vibecoded tarot reading extension.

* Any character can perform the reading on {{user}}. Either let the current chat's character do it or choose one from your library.
* The main prompt can be edited in the settings tab.
* The reader receives your persona description along with the current chat's character description and limited chat history.
* Includes 6 different spreads:
  * Single Card
  * Past/Present/Future
  * Mind/Body/Soul
  * Five Card Cross
  * Seven Card Horseshoe
  * Celtic Cross (Ten Card)
* Uses your chosen LLM connection to interpret each card as it's flipped, then a "synthesis" of all cards together at the end.
* The three most recent readings per chat are saved between sessions in the history tab. History can be cleared for current chat or all chats in the settings tab.

## Macros
All four macros are chat-aware: they insert the LATEST FULLY COMPLETED reading for the CURRENT chat, never readings from other chats, and expand to an empty string when the current chat has no completed reading.
* `{{tarotCards}}` — just the cards: header (spread type + date, and the question if one was asked) plus one line per position with the card name and orientation.
* `{{tarotInterpret}}` — the cards plus their individual LLM interpretations, no synthesis.
* `{{tarotSynthesis}}` — only the final synthesis paragraph.
* `{{tarotReading}}` — the full reading: cards, interpretations, and synthesis (same content as the History tab).
* Brace sequences in card text are neutralized so LLM output can't break macro expansion, and the macros are read-only (safe in dry-run previews).

## Custom Decks
The Custom Decks section in the Settings tab lets you use your own deck art instead of the built-in Rider–Waite one.
* Users can create multiple named custom decks (e.g. personal scans of deck art they own) and import them one card at a time, in the same order as the default deck: 00-fool, 01-magician, 02-high-priestess, … 77-king-of-pentacles, then 78-card-back (79 images total).
* The UI tells you which card to import each step; order is enforced by the backend (importing out of order is rejected), and you can stop and Resume Import later — progress is saved per user per deck. Use "Choose Card Image…" to pick each card's image and "Save & Exit" to pause; "Create Deck" makes a new deck.
* Requirements per card: JPEG, PNG or WebP, max 2.5MB per image (use ~1000px JPEGs for best results).
* Decks are stored per-user on this instance (not shipped anywhere) and served only to the importing user; the default Rider–Waite deck is unaffected and remains the fallback.
* Switch the active deck in the Custom Decks section ("Use" on a completed deck) — only completed decks can be activated. Deleting a deck removes its images. Deck names are editable via Rename.
* The default deck's images are now cached per user (previously shared on the instance); existing installs re-upload the default deck once per user on first load (~21MB).
* The extension declares the `base64_decode` backend capability because it decodes user-picked image files in its backend — a static-scan opt-out for a legitimate image-bytes use, not a network or subprocess capability.
