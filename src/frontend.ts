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
    
    /* --- Spread Layouts --- */
    .tarot-spread-grid { display: grid; gap: 12px; margin-top: 16px; width: 100%; padding: 12px 0; }
    .tarot-card-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; position: relative; }
    .tarot-card-img { width: 100%; max-width: 65px; aspect-ratio: 2/3.5; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s; }
    .tarot-card-img:hover { transform: scale(1.05); }
    .tarot-card-pos { font-size: 10px; color: var(--lumiverse-text-muted); font-weight: 600; text-transform: uppercase; text-align: center; }
    
    /* 1 Card */
    .tarot-spread-1 { grid-template-columns: 1fr; justify-items: center; }
    
    /* 3 Card */
    .tarot-spread-3 { grid-template-columns: repeat(3, 1fr); justify-items: center; }
    
    /* 5 Card Cross */
    .tarot-spread-5 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(3, auto); justify-items: center; align-items: center; }
    .s5-0 { grid-area: 2 / 1; } /* Past (Left) */
    .s5-1 { grid-area: 2 / 2; } /* Present (Center) */
    .s5-2 { grid-area: 2 / 3; } /* Future (Right) */
    .s5-3 { grid-area: 1 / 2; } /* Core Reason (Top) */
    .s5-4 { grid-area: 3 / 2; } /* Potential (Bottom) */
    
    /* 7 Card Horseshoe */
    .tarot-spread-7 { grid-template-columns: repeat(3, 1fr); grid-template-rows: repeat(4, auto); justify-items: center; }
    .s7-0 { grid-area: 4 / 1; } /* Bottom Left */
    .s7-1 { grid-area: 3 / 1; }
    .s7-2 { grid-area: 2 / 1; }
    .s7-3 { grid-area: 1 / 2; } /* Top Center */
    .s7-4 { grid-area: 2 / 3; }
    .s7-5 { grid-area: 3 / 3; }
    .s7-6 { grid-area: 4 / 3; } /* Bottom Right */
    
    /* 10 Card Celtic Cross */
    .tarot-spread-10 { grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(5, auto); justify-items: center; align-items: center; }
    .s10-0 { grid-area: 3 / 2; z-index: 1; } /* Center (Cover) */
    .s10-1 { grid-area: 3 / 2; transform: rotate(90deg); z-index: 2; } /* Crossing */
    .s10-2 { grid-area: 4 / 2; } /* Foundation */
    .s10-3 { grid-area: 3 / 1; } /* Recent Past */
    .s10-4 { grid-area: 2 / 2; } /* Possible Future */
    .s10-5 { grid-area: 3 / 3; } /* Near Future */
    .s10-6 { grid-area: 5 / 4; } /* Self (Bottom of Staff) */
    .s10-7 { grid-area: 4 / 4; } /* Environment */
    .s10-8 { grid-area: 3 / 4; } /* Hopes/Fears */
    .s10-9 { grid-area: 2 / 4; } /* Outcome (Top of Staff) */
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
      </div>
      
      <!-- Reading View -->
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
          <textarea id="tarot-question" class="tarot-input" rows="3" placeholder="Ask a question (or leave blank to use chat history)"></textarea>
          <button class="tarot-btn" id="tarot-draw-btn">Draw Cards</button>
        </div>
        <div id="tarot-cards-area"></div>
      </div>

      <!-- Settings View -->
      <div id="tarot-settings-view" class="tarot-view" style="display: none;">
        <div class="tarot-section">
          <div class="tarot-label">Custom System Prompt</div>
          <div id="tarot-sys-prompt-slot"></div>
          <div class="tarot-label">LLM Connection</div>
          <div id="tarot-conn-slot"></div>
          <button class="tarot-btn" id="tarot-save-btn" style="margin-top: 8px;">Save Settings</button>
        </div>
      </div>
    </div>
  `

  // --- DOM Elements ---
  const navBtns = tab.root.querySelectorAll('.tarot-nav-btn')
  const readingView = tab.root.querySelector('#tarot-reading-view') as HTMLElement
  const settingsView = tab.root.querySelector('#tarot-settings-view') as HTMLElement
  const spreadSelect = tab.root.querySelector('#tarot-spread-select') as HTMLSelectElement
  const questionInput = tab.root.querySelector('#tarot-question') as HTMLTextAreaElement
  const drawBtn = tab.root.querySelector('#tarot-draw-btn') as HTMLButtonElement
  const cardsArea = tab.root.querySelector('#tarot-cards-area') as HTMLElement
  
  const sysPromptSlot = tab.root.querySelector('#tarot-sys-prompt-slot') as HTMLElement
  const connSlot = tab.root.querySelector('#tarot-conn-slot') as HTMLElement
  const saveBtn = tab.root.querySelector('#tarot-save-btn') as HTMLButtonElement

  // --- State ---
  let currentSettings = { systemPrompt: '', connectionId: '' }
  let sysPromptHandle: any = null
  let connHandle: any = null
  let imageUrls: Record<number, string> = {}
  let currentDraw: { cards: any[], positions: string[] } | null = null

  // --- Navigation Router ---
  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      if (btn.getAttribute('data-view') === 'settings') {
        readingView.style.display = 'none'
        settingsView.style.display = 'block'
      } else {
        readingView.style.display = 'block'
        settingsView.style.display = 'none'
      }
    })
  })

  // --- Backend Comms ---
  ctx.sendToBackend({ type: 'init' })

  const unsub = ctx.onBackendMessage((payload: any) => {
    if (payload.type === 'init_data') {
      imageUrls = payload.imageUrls
      currentSettings = payload.settings

      if (sysPromptHandle) sysPromptHandle.destroy()
      sysPromptHandle = ctx.components.mountTextArea(sysPromptSlot, {
        value: currentSettings.systemPrompt,
        rows: 6,
        placeholder: 'Enter custom system prompt for the reader...',
        onChange: (val: string) => { currentSettings.systemPrompt = val }
      })

      if (connHandle) connHandle.destroy()
      connHandle = ctx.components.mountSelect(connSlot, {
        value: currentSettings.connectionId,
        placeholder: 'Select LLM Connection',
        options: payload.connections.map((c: any) => ({
          value: c.id,
          label: c.name || c.id,
          group: c.provider
        })),
        onChange: (val: string) => { currentSettings.connectionId = val }
      })
    }
    
    if (payload.type === 'draw_result') {
      currentDraw = payload
      renderCards()
    }
  })

  // --- Drawing Logic ---
  drawBtn.addEventListener('click', () => {
    const val = spreadSelect.value
    let spreadType = val
    let variant = 'ppf'
    
    if (val === '3-mbs') {
      spreadType = '3'
      variant = 'mbs'
    }
    
    cardsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 13px; margin-top: 16px; text-align: center;">Drawing cards...</div>'
    ctx.sendToBackend({ type: 'draw_cards', spreadType, variant })
  })

  function renderCards() {
    if (!currentDraw) return
    const { cards, positions } = currentDraw
    const count = cards.length
    
    let gridClass = ''
    let cardClasses: string[] = []
    
    // Determine layout classes based on count
    if (count === 1) {
      gridClass = 'tarot-spread-1'
      cardClasses = ['s1-0']
    } else if (count === 3) {
      gridClass = 'tarot-spread-3'
      cardClasses = ['s3-0', 's3-1', 's3-2']
    } else if (count === 5) {
      gridClass = 'tarot-spread-5'
      cardClasses = ['s5-0', 's5-1', 's5-2', 's5-3', 's5-4']
    } else if (count === 7) {
      gridClass = 'tarot-spread-7'
      cardClasses = ['s7-0', 's7-1', 's7-2', 's7-3', 's7-4', 's7-5', 's7-6']
    } else if (count === 10) {
      gridClass = 'tarot-spread-10'
      cardClasses = ['s10-0', 's10-1', 's10-2', 's10-3', 's10-4', 's10-5', 's10-6', 's10-7', 's10-8', 's10-9']
    }
    
    cardsArea.innerHTML = `
      <div class="tarot-spread-grid ${gridClass}">
        ${cards.map((card, i) => `
          <div class="tarot-card-slot ${cardClasses[i] || ''}">
            <img src="${imageUrls[78]}" class="tarot-card-img" data-index="${i}" />
            <div class="tarot-card-pos">${positions[i]}</div>
          </div>
        `).join('')}
      </div>
    `
  }

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
    tab.destroy()
  }
    }
