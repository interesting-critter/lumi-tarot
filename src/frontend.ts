import type { SpindleFrontendContext } from 'lumiverse-spindle-types'

export function setup(ctx: SpindleFrontendContext) {
  const removeStyle = ctx.dom.addStyle(`
    .tarot-container { padding: 12px; display: flex; flex-direction: column; gap: 12px; height: 100%; box-sizing: border-box; overflow-y: auto; }
    .tarot-nav { display: flex; gap: 4px; border-bottom: 1px solid var(--lumiverse-border); margin-bottom: 8px; }
    .tarot-nav-btn { padding: 8px 12px; background: none; border: none; color: var(--lumiverse-text-muted); cursor: pointer; font-weight: 600; border-bottom: 2px solid transparent; }
    .tarot-nav-btn.active { color: var(--lumiverse-text); border-bottom-color: var(--lumiverse-accent); }
    
    .tarot-section { background: var(--lumiverse-fill-subtle); padding: 12px; border-radius: var(--lumiverse-radius); border: 1px solid var(--lumiverse-border); display: flex; flex-direction: column; gap: 8px; }
    .tarot-label { font-size: 12px; color: var(--lumiverse-text-muted); font-weight: 600; text-transform: uppercase; }
    .tarot-btn { padding: 8px 12px; background: var(--lumiverse-accent); color: var(--lumiverse-accent-fg); border: none; border-radius: var(--lumiverse-radius); cursor: pointer; font-weight: 600; width: 100%; box-sizing: border-box; }
    .tarot-btn:hover { filter: brightness(1.1); }
    .tarot-btn:disabled { background: var(--lumiverse-fill); color: var(--lumiverse-text-dim); cursor: not-allowed; }
    
    .tarot-input { width: 100%; box-sizing: border-box; padding: 8px; background: var(--lumiverse-fill); border: 1px solid var(--lumiverse-border); border-radius: var(--lumiverse-radius); color: var(--lumiverse-text); font-family: inherit; font-size: 14px; }
    
    .tarot-spread-grid { display: grid; gap: 12px; margin-top: 16px; width: 100%; padding: 12px 0; }
    .tarot-card-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; }
    .tarot-card-img { width: 100%; max-width: 100px; aspect-ratio: 2/3.5; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s; }
    .tarot-card-img:hover { transform: scale(1.05); }
    .tarot-card-img.inverted { transform: rotate(180deg); }
    .tarot-card-img.inverted:hover { transform: rotate(180deg) scale(1.05); }
    .tarot-card-pos { font-size: 10px; color: var(--lumiverse-text-muted); font-weight: 600; text-transform: uppercase; text-align: center; }
    
    .tarot-card-text { font-size: 11px; color: var(--lumiverse-text); margin-top: 8px; padding: 8px; background: var(--lumiverse-fill); border-radius: 4px; width: 100%; box-sizing: border-box; text-align: left; min-height: 40px; border: 1px solid var(--lumiverse-border); white-space: pre-wrap; }
    
    .tarot-reread-btn { margin-top: 4px; padding: 4px 8px; font-size: 10px; background: var(--lumiverse-fill); color: var(--lumiverse-text-muted); border: 1px solid var(--lumiverse-border); border-radius: 4px; cursor: pointer; width: 100%; box-sizing: border-box; }
    .tarot-reread-btn:hover { border-color: var(--lumiverse-accent); color: var(--lumiverse-accent); }
    
    .tarot-synthesis-box { margin-top: 16px; padding: 12px; background: var(--lumiverse-fill-subtle); border: 1px solid var(--lumiverse-border); border-radius: 8px; }
    .tarot-history-item { padding: 12px; background: var(--lumiverse-fill-subtle); border: 1px solid var(--lumiverse-border); border-radius: 8px; margin-bottom: 12px; }
    .tarot-history-meta { font-size: 11px; color: var(--lumiverse-text-muted); margin-bottom: 8px; }
    
    .tarot-flip-controls { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
    .tarot-checkbox { display: flex; gap: 4px; align-items: center; font-size: 12px; color: var(--lumiverse-text-muted); cursor: pointer; }
    
    /* Spread layouts */
    .tarot-spread-1 { grid-template-columns: 1fr; justify-items: center; }
    .tarot-spread-3 { grid-template-columns: repeat(3, 1fr); justify-items: center; }
    .tarot-spread-5 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, auto); justify-items: center; align-items: center; }
    .s5-0 { grid-area: 2 / 1; } .s5-1 { grid-area: 2 / 2; } .s5-2 { grid-area: 2 / 3; } .s5-3 { grid-area: 1 / 2; } .s5-4 { grid-area: 3 / 2; }
    .tarot-spread-7 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, auto); justify-items: center; }
    .s7-0 { grid-area: 4 / 1; } .s7-1 { grid-area: 3 / 1; } .s7-2 { grid-area: 2 / 1; } .s7-3 { grid-area: 1 / 2; } .s7-4 { grid-area: 2 / 3; } .s7-5 { grid-area: 3 / 3; } .s7-6 { grid-area: 4 / 3; }
    .tarot-spread-10 { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(5, auto); justify-items: center; align-items: center; }
    .s10-0 { grid-area: 3 / 2; z-index: 1; } .s10-1 { grid-area: 3 / 2; transform: rotate(90deg); z-index: 2; } .s10-2 { grid-area: 4 / 2; } .s10-3 { grid-area: 3 / 1; } .s10-4 { grid-area: 2 / 2; } .s10-5 { grid-area: 3 / 3; } .s10-6 { grid-area: 5 / 4; } .s10-7 { grid-area: 4 / 4; } .s10-8 { grid-area: 3 / 4; } .s10-9 { grid-area: 2 / 4; }
  `)

  const tab = ctx.ui.registerDrawerTab({
    id: 'tarot-reader',
    title: 'Tarot Reader',
    shortName: 'Tarot',
    description: 'Perform LLM-driven tarot readings',
    keywords: ['tarot', 'reading', 'cards', 'divination']
  })

  tab.root.innerHTML = `
    <div class="tarot-container">
      <div class="tarot-nav">
        <button class="tarot-nav-btn active" data-view="reading">Reading</button>
        <button class="tarot-nav-btn" data-view="settings">Settings</button>
        <button class="tarot-nav-btn" data-view="history">History</button>
      </div>
      
      <div id="tarot-reading-view" class="tarot-view">
        <div class="tarot-section">
          <div class="tarot-label">Reading Setup</div>
          <select id="tarot-spread-select" class="tarot-input">
            <option value="1">1 Card</option>
            <option value="3">3 Cards (Past/Present/Future)</option>
            <option value="3-mbs">3 Cards (Mind/Body/Soul)</option>
            <option value="5">5 Cards (Cross)</option>
            <option value="7">7 Cards (Horseshoe)</option>
            <option value="10">10 Cards (Celtic Cross)</option>
          </select>
          <div id="tarot-reader-select-slot"></div>
          <textarea id="tarot-question" class="tarot-input" rows="3" placeholder="Ask a question (or leave blank to use chat history)"></textarea>
          <button class="tarot-btn" id="tarot-draw-btn">Draw Cards</button>
        </div>
        <div id="tarot-cards-area"></div>
        <div id="tarot-flip-controls-area"></div>
        <div id="tarot-synthesis-area" style="display: none;">
          <div class="tarot-label">Overall Synthesis</div>
          <div id="tarot-synthesis-text" class="tarot-card-text" style="min-height: 60px;"></div>
          <button class="tarot-btn" id="tarot-synth-retry-btn" style="margin-top: 8px; display: none;">Re-synthesize</button>
        </div>
      </div>

      <div id="tarot-settings-view" class="tarot-view" style="display: none;">
        <div class="tarot-section">
          <div class="tarot-label">Custom System Prompt</div>
          <div id="tarot-sys-prompt-slot"></div>
          <div class="tarot-label">LLM Connection</div>
          <div id="tarot-conn-slot"></div>
          <button class="tarot-btn" id="tarot-save-btn" style="margin-top: 8px;">Save Settings</button>
        </div>
      </div>

      <div id="tarot-history-view" class="tarot-view" style="display: none;">
        <div class="tarot-label" style="margin-bottom: 12px;">Last 3 Readings for this Chat</div>
        <div id="tarot-history-list"></div>
      </div>
    </div>
  `

  // --- DOM Elements ---
  const navBtns = tab.root.querySelectorAll('.tarot-nav-btn')
  const readingView = tab.root.querySelector('#tarot-reading-view') as HTMLElement
  const settingsView = tab.root.querySelector('#tarot-settings-view') as HTMLElement
  const historyView = tab.root.querySelector('#tarot-history-view') as HTMLElement
  const historyList = tab.root.querySelector('#tarot-history-list') as HTMLElement
  
  const spreadSelect = tab.root.querySelector('#tarot-spread-select') as HTMLSelectElement
  const questionInput = tab.root.querySelector('#tarot-question') as HTMLTextAreaElement
  const drawBtn = tab.root.querySelector('#tarot-draw-btn') as HTMLButtonElement
  const cardsArea = tab.root.querySelector('#tarot-cards-area') as HTMLElement
  const flipControlsArea = tab.root.querySelector('#tarot-flip-controls-area') as HTMLElement
  const synthesisArea = tab.root.querySelector('#tarot-synthesis-area') as HTMLElement
  const synthesisText = tab.root.querySelector('#tarot-synthesis-text') as HTMLElement
  const synthRetryBtn = tab.root.querySelector('#tarot-synth-retry-btn') as HTMLButtonElement
  const readerSelectSlot = tab.root.querySelector('#tarot-reader-select-slot') as HTMLElement
  
  const sysPromptSlot = tab.root.querySelector('#tarot-sys-prompt-slot') as HTMLElement
  const connSlot = tab.root.querySelector('#tarot-conn-slot') as HTMLElement
  const saveBtn = tab.root.querySelector('#tarot-save-btn') as HTMLButtonElement

  // --- State ---
  let currentSettings = { systemPrompt: '', connectionId: '' }
  let sysPromptHandle: any = null
  let connHandle: any = null
  let readerSelectHandle: any = null
  let imageUrls: Record<number, string> = {}
  let currentDraw: { cards: any[], positions: string[] } | null = null
  let readerCharacterId: string = ''
  let readIndices: Set<number> = new Set()
  let isStreaming = false
  let autoAdvance = false
  let synthesisStarted = false

  // --- Navigation Router ---
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      const view = btn.getAttribute('data-view')
      readingView.style.display = view === 'reading' ? 'block' : 'none'
      settingsView.style.display = view === 'settings' ? 'block' : 'none'
      historyView.style.display = view === 'history' ? 'block' : 'none'
      
      if (view === 'history') ctx.sendToBackend({ type: 'load_history' })
    })
  })

  // --- Backend Comms ---
  ctx.sendToBackend({ type: 'init' })

  const unsub = ctx.onBackendMessage((payload: any) => {
    if (payload.type === 'init_data') {
      imageUrls = payload.imageUrls
      currentSettings = payload.settings

      if (readerSelectHandle) readerSelectHandle.destroy()
      readerSelectHandle = ctx.components.mountSelect(readerSelectSlot, {
        value: '', placeholder: 'Reader (Defaults to Active Chat)',
        options: payload.characters.map((c: any) => ({ value: c.id, label: c.name })),
        clearable: true,
        onChange: (val: string) => { readerCharacterId = val }
      })

      if (sysPromptHandle) sysPromptHandle.destroy()
      sysPromptHandle = ctx.components.mountTextArea(sysPromptSlot, {
        value: currentSettings.systemPrompt, rows: 6,
        placeholder: 'Enter custom system prompt...',
        onChange: (val: string) => { currentSettings.systemPrompt = val }
      })

      if (connHandle) connHandle.destroy()
      connHandle = ctx.components.mountSelect(connSlot, {
        value: currentSettings.connectionId, placeholder: 'Select LLM Connection',
        options: payload.connections.map((c: any) => ({ value: c.id, label: c.name || c.id, group: c.provider })),
        onChange: (val: string) => { currentSettings.connectionId = val }
      })
    }
    
    if (payload.type === 'draw_result') {
      currentDraw = payload
      readIndices = new Set()
      synthesisStarted = false
      synthesisArea.style.display = 'none'
      synthesisText.textContent = ''
      synthRetryBtn.style.display = 'none'
      renderCards()
      renderFlipControls()
    }
    
    // Stream handling for both cards and synthesis
    if (payload.type === 'stream_start') {
      if (payload.cardIndex === 'synthesis') {
        synthesisArea.style.display = 'block'
        synthesisText.textContent = ''
        synthRetryBtn.style.display = 'none'
      } else {
        const slot = cardsArea.querySelector(`.tarot-card-slot[data-index="${payload.cardIndex}"]`)
        if (slot && !slot.querySelector('.tarot-card-text')) {
          const textDiv = document.createElement('div')
          textDiv.className = 'tarot-card-text'
          textDiv.setAttribute('data-index', payload.cardIndex)
          slot.appendChild(textDiv)
        }
      }
    }
    
    if (payload.type === 'stream_token') {
      if (payload.cardIndex === 'synthesis') {
        synthesisText.textContent += payload.token
        synthesisText.scrollTop = synthesisText.scrollHeight
      } else {
        const textDiv = cardsArea.querySelector(`.tarot-card-text[data-index="${payload.cardIndex}"]`)
        if (textDiv) {
          textDiv.textContent += payload.token
          textDiv.scrollTop = textDiv.scrollHeight
        }
      }
    }
    
    if (payload.type === 'stream_end') {
      isStreaming = false
      
      if (payload.cardIndex === 'synthesis') {
        if (!synthesisText.textContent.trim() && payload.fullText) {
          synthesisText.textContent = payload.fullText
        }
        synthRetryBtn.style.display = 'block'
        flipControlsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 12px; text-align: center; margin-top: 8px;">Reading complete. Saved to history.</div>'
      } else {
        const cardIndex = parseInt(payload.cardIndex)
        readIndices.add(cardIndex)
        
        const textDiv = cardsArea.querySelector(`.tarot-card-text[data-index="${payload.cardIndex}"]`) as HTMLElement
        if (textDiv && payload.fullText && !textDiv.textContent.trim()) {
          textDiv.textContent = payload.fullText
        }
        
        // Inject Re-read button
        const slot = cardsArea.querySelector(`.tarot-card-slot[data-index="${payload.cardIndex}"]`)
        if (slot && !slot.querySelector('.tarot-reread-btn')) {
          const rereadBtn = document.createElement('button')
          rereadBtn.className = 'tarot-reread-btn'
          rereadBtn.textContent = 'Re-read Card'
          rereadBtn.addEventListener('click', () => flipCard(cardIndex, true))
          slot.appendChild(rereadBtn)
        }
        
        // Auto-advance logic
        if (autoAdvance && currentDraw && readIndices.size < currentDraw.cards.length) {
          const nextUnread = currentDraw.cards.findIndex((_, i) => !readIndices.has(i))
          if (nextUnread !== -1) {
            setTimeout(() => flipCard(nextUnread), 800)
          }
        } else if (autoAdvance && currentDraw && readIndices.size === currentDraw.cards.length && !synthesisStarted) {
          synthesisStarted = true
          setTimeout(() => synthesizeReading(), 800)
        } else {
          renderFlipControls()
        }
      }
    }

    if (payload.type === 'history_data') {
      if (payload.history.length === 0) {
        historyList.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 13px;">No readings saved for this chat yet.</div>'
        return
      }
      historyList.innerHTML = payload.history.map((r: any) => `
        <div class="tarot-history-item">
          <div class="tarot-history-meta">
            <strong>${new Date(r.timestamp).toLocaleString()}</strong> | ${r.spreadType}-Card Spread
            ${r.question ? `<br><em>Q: ${r.question}</em>` : ''}
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin: 12px 0;">
            ${r.cards.map((c: any) => `
              <div>
                <strong>${c.name} ${c.inverted ? '(Inverted)' : ''}</strong>
                <div style="font-size: 11px; color: var(--lumiverse-text-muted); white-space: pre-wrap;">${c.interpretation || ''}</div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top: 12px; border-top: 1px solid var(--lumiverse-border); padding-top: 8px;">
            <strong>Synthesis:</strong>
            <div style="font-size: 12px; color: var(--lumiverse-text); white-space: pre-wrap;">${r.synthesis || ''}</div>
          </div>
        </div>
      `).join('')
    }
  })

  // --- Drawing Logic ---
  drawBtn.addEventListener('click', () => {
    const val = spreadSelect.value
    let spreadType = val, variant = 'ppf'
    if (val === '3-mbs') { spreadType = '3'; variant = 'mbs' }
    
    cardsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 13px; margin-top: 16px; text-align: center;">Drawing cards...</div>'
    flipControlsArea.innerHTML = ''
    ctx.sendToBackend({ type: 'draw_cards', spreadType, variant, question: questionInput.value, readerCharacterId })
  })

  function renderCards() {
    if (!currentDraw) return
    const { cards, positions } = currentDraw
    const count = cards.length
    let gridClass = '', cardClasses: string[] = []
    
    if (count === 1) { gridClass = 'tarot-spread-1'; cardClasses = ['s1-0'] }
    else if (count === 3) { gridClass = 'tarot-spread-3'; cardClasses = ['s3-0', 's3-1', 's3-2'] }
    else if (count === 5) { gridClass = 'tarot-spread-5'; cardClasses = ['s5-0', 's5-1', 's5-2', 's5-3', 's5-4'] }
    else if (count === 7) { gridClass = 'tarot-spread-7'; cardClasses = ['s7-0', 's7-1', 's7-2', 's7-3', 's7-4', 's7-5', 's7-6'] }
    else if (count === 10) { gridClass = 'tarot-spread-10'; cardClasses = ['s10-0', 's10-1', 's10-2', 's10-3', 's10-4', 's10-5', 's10-6', 's10-7', 's10-8', 's10-9'] }
    
    cardsArea.innerHTML = `
      <div class="tarot-spread-grid ${gridClass}">
        ${cards.map((card, i) => `
          <div class="tarot-card-slot ${cardClasses[i] || ''}" data-index="${i}">
            <img src="${imageUrls[78]}" class="tarot-card-img" data-index="${i}" />
            <div class="tarot-card-pos">${positions[i]}</div>
          </div>
        `).join('')}
      </div>
    `
  }

  function renderFlipControls() {
    if (!currentDraw) return
    if (readIndices.size >= currentDraw.cards.length) {
      if (!synthesisStarted) {
        flipControlsArea.innerHTML = `<button class="tarot-btn" id="tarot-synth-btn">Synthesize Reading</button>`
        flipControlsArea.querySelector('#tarot-synth-btn')?.addEventListener('click', synthesizeReading)
      }
      return
    }
    
    const nextUnread = currentDraw.cards.findIndex((_, i) => !readIndices.has(i))
    
    flipControlsArea.innerHTML = `
      <div class="tarot-flip-controls">
        <button class="tarot-btn" id="tarot-flip-btn" ${isStreaming ? 'disabled' : ''}>
          ${isStreaming ? 'Reading...' : `Flip Card ${nextUnread + 1}`}
        </button>
        <label class="tarot-checkbox">
          <input type="checkbox" id="tarot-auto-advance" ${autoAdvance ? 'checked' : ''} />
          Auto-advance
        </label>
      </div>
    `
    
    const flipBtn = flipControlsArea.querySelector('#tarot-flip-btn') as HTMLButtonElement
    const autoCheck = flipControlsArea.querySelector('#tarot-auto-advance') as HTMLInputElement
    
    flipBtn.addEventListener('click', () => { if (!isStreaming) flipCard(nextUnread) })
    autoCheck.addEventListener('change', (e) => {
      autoAdvance = (e.target as HTMLInputElement).checked
      if (autoAdvance && !isStreaming && readIndices.size < currentDraw.cards.length) {
        flipCard(nextUnread)
      }
    })
  }

  function flipCard(index: number, isRetry = false) {
    if (isStreaming || !currentDraw) return
    isStreaming = true
    
    const card = currentDraw.cards[index]
    const img = cardsArea.querySelector(`.tarot-card-img[data-index="${index}"]`) as HTMLImageElement
    if (img) {
      img.src = imageUrls[card.id]
      if (card.inverted) img.classList.add('inverted')
    }
    
    const textDiv = cardsArea.querySelector(`.tarot-card-text[data-index="${index}"]`) as HTMLElement
    if (textDiv) textDiv.textContent = ''
    
    const rereadBtn = cardsArea.querySelector(`.tarot-card-slot[data-index="${index}"] .tarot-reread-btn`)
    if (rereadBtn) rereadBtn.remove()
    
    renderFlipControls()
    ctx.sendToBackend({ type: 'flip_card', cardIndex: index })
  }

  function synthesizeReading() {
    if (isStreaming) return
    isStreaming = true
    synthesisStarted = true
    flipControlsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 12px; text-align: center; margin-top: 8px;">Synthesizing reading...</div>'
    ctx.sendToBackend({ type: 'synthesize' })
  }

  // Synthesis Re-read button
  synthRetryBtn.addEventListener('click', () => {
    if (isStreaming) return
    isStreaming = true
    synthesisText.textContent = ''
    synthRetryBtn.style.display = 'none'
    flipControlsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 12px; text-align: center; margin-top: 8px;">Re-synthesizing...</div>'
    ctx.sendToBackend({ type: 'synthesize' })
  })

  // --- Save Settings ---
  saveBtn.addEventListener('click', () => {
    ctx.sendToBackend({
      type: 'save_settings',
      systemPrompt: currentSettings.systemPrompt,
      connectionId: currentSettings.connectionId
    })
  })

  return () => {
    unsub()
    removeStyle()
    if (sysPromptHandle) sysPromptHandle.destroy()
    if (connHandle) connHandle.destroy()
    if (readerSelectHandle) readerSelectHandle.destroy()
    tab.destroy()
  }
}
