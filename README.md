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
* Custom decks come in two modes: a standard 78-card layout, or a fully custom card list (comma/newline-separated `index=Name` entries, optional bare `back` line reserving the final slot as the card back). Each deck can carry its own freeform guidebook that is injected into interpretation prompts for that deck only.
* The "Custom Decks" tab manages deck art: pick a deck, browse a grid of all its cards (unimported cards show placeholders), replace a card's image, rename it in place, or edit its per-orientation meanings, and edit the deck's guidebook there.
* Spreads requiring more cards than the active deck has playable cards are refused with a toast instead of drawing a partial spread.

## Macros
All four macros are chat-aware: they insert the LATEST FULLY COMPLETED reading for the CURRENT chat, never readings from other chats, and expand to an empty string when the current chat has no completed reading.
* `{{tarotCards}}` — just the cards: header (spread type + date, and the question if one was asked) plus one line per position with the card name and orientation.
* `{{tarotInterpret}}` — the cards plus their individual LLM interpretations, no synthesis.
* `{{tarotSynthesis}}` — only the final synthesis paragraph.
* `{{tarotReading}}` — the full reading: cards, interpretations, and synthesis (same content as the History tab).
* Brace sequences in card text are neutralized so LLM output can't break macro expansion, and the macros are read-only (safe in dry-run previews).

## Custom Decks
The Custom Decks section in the Settings tab and the dedicated "Custom Decks" tab let you use your own deck art instead of the built-in Rider–Waite one.
* Users can create multiple named custom decks in two modes. "Standard Deck (78)" imports the classic Rider–Waite order: 00-fool, 01-magician, 02-high-priestess, … 77-king-of-pentacles, then 78-card-back (79 images total). "Custom Deck…" builds a deck from your own list of cards.
* Custom list format: comma- or newline-separated entries. Each entry is `index=Name` (e.g. `0=The Fool, 1=The Magician`); add a line with only the bare word `back` to reserve the final slot as the card back. Indices must be exactly 0..N-1 with no duplicates or gaps, names are limited to 80 characters, and the whole deck may contain at most 400 cards (including the card back). The UI validates the list live, reports the exact problem, and enables "Create Custom Deck" only once the list parses cleanly and the deck name is valid.
* Each deck can carry a freeform guidebook (up to 32,000 characters), edited in the "Custom Decks" tab and injected into interpretation prompts only when reading with that deck — paste the full guidebook or just the card meanings. Saving is explicit via "Save Guidebook" (switching decks does not auto-save); an over-limit guidebook is rejected with a toast. Custom cards are prompted to the LLM by name only — no built-in upright/inverted meanings are sent for cards outside the standard set, so a per-deck guidebook (injected for that deck only) is the way to give the reader real meaning text.
* The "Custom Decks" tab has a deck selector, the guidebook editor, and a grid of every card in the selected deck. Cards that have been imported show their artwork; others show a numbered placeholder ("Not imported"). Hover a card and click the pencil — the edit menu offers "Change Image" (imported cards only, JPEG/PNG/WebP up to 2.5MB), "Change Name", "Change Upright Meaning" and "Change Inverse Meaning" for regular cards, and "Change Image" plus the two meaning actions for the card back (the back cannot be renamed). Rename and image replace errors are shown inline in the tab.
* Per-card upright/inverse meanings can be edited from the same pencil menu. Meanings have no length limit; saving an empty textarea clears the definition. For standard decks, a saved meaning overrides the built-in meaning for that card/orientation — clearing it reverts to the built-in. For custom cards (which have no built-in meanings), definitions are the way to give the reader real meaning text without a guidebook. Tiles show small `u` / `i` badges (bottom-right) for cards with an upright/inverse meaning defined. Meanings are injected into the flip prompt only (never the synthesis). When a deck has at least one meaning defined, flipping a card whose drawn orientation has no meaning shows a warning toast — you can disable this in the Settings tab ("Notify when a drawn card is missing an orientation meaning", under Custom Decks; enabled by default).
* The UI tells you which card to import each step; order is enforced by the backend (importing out of order is rejected), and you can stop and Resume Import later — progress is saved per user per deck. Use "Choose Card Image…" to pick each card's image and "Save & Exit" to pause; "Create Deck" asks whether you want a standard or a custom deck.
* Spreads that require more cards than the active deck has playable cards are refused with a toast (custom back slots don't count as playable).
* Requirements per card: JPEG, PNG or WebP, max 2.5MB per image (use ~1000px JPEGs for best results).
* Decks are stored per-user on this instance (not shipped anywhere) and served only to the importing user; the default Rider–Waite deck is unaffected and remains the fallback.
* Switch the active deck in the Custom Decks section ("Use" on a completed deck) — only completed decks can be activated. Deleting a deck removes its images. Deck names are editable via Rename.
* The default deck's images are now cached per user (previously shared on the instance); existing installs re-upload the default deck once per user on first load (~21MB).
* The extension declares the `base64_decode` backend capability because it decodes user-picked image files in its backend — a static-scan opt-out for a legitimate image-bytes use, not a network or subprocess capability.

## What's new in 1.3.0
* Per-card Upright/Inverse meanings: edit them from the pencil menu on any card in the "Custom Decks" grid (including the card back). No length limit; an empty save clears the definition.
* Standard decks treat saved meanings as overrides of the built-in meanings — clearing reverts to the built-in. Custom cards use them as their only built-in-style meanings.
* Grid tiles show `u` / `i` badges (bottom-right) when a card has an upright/inverse meaning defined.
* Missing-orientation-meaning warning toast on the flip path (only when the deck has at least one meaning defined; never for synthesis), with a new toggle in the Settings tab's Custom Decks section to disable it (enabled by default).

## What's new in 1.2.0
* New "Custom Decks" tab: deck selector, card grid with placeholders for unimported cards, hover-pencil actions (Change Image / Change Name), and the per-deck guidebook editor with a live character counter.
* Custom deck creation rework: "Create Deck" now asks for Standard (78) vs Custom Deck…, with a live-validated custom list format.
* Custom card backs: active decks with their own card back art show it when cards are face-down.
* Small custom decks can refuse large spreads (with a toast) instead of dealing a partial spread.
* Per-deck guidebooks are injected into interpretation prompts for that deck only.
* Replacing a card image and renaming a card in place, from the grid.
