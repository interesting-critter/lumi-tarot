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
    .tarot-row { display: flex; gap: 8px; }
    .tarot-row > * { flex: 1; }
    
    .tarot-spread-grid { display: grid; gap: 12px; margin-top: 12px; width: 100%; }
    .tarot-card-slot { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .tarot-card-img { width: 80px; height: 140px; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s; }
    .tarot-card-img:hover { transform: scale(1.05); }
    .tarot-card-pos { font-size: 11px; color: var(--lumiverse-text-muted); font-weight: 600; text-transform: uppercase; }
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
    
    cardsArea.innerHTML = '<div style="color: var(--lumiverse-text-muted); font-size: 13px;">Drawing cards...</div>'
    ctx.sendToBackend({ type: 'draw_cards', spreadType, variant })
  })

  function renderCards() {
    if (!currentDraw) return
    const { cards, positions } = currentDraw
    
    // Determine grid columns based on card count
    let cols = cards.length
    if (cards.length === 10) cols = 5 // Celtic cross wraps
    if (cards.length === 7) cols = 4  // Horseshoe wraps
    if (cards.length === 5) cols = 3  // Cross wraps
    
    cardsArea.innerHTML = `
      <div class="tarot-spread-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
        ${cards.map((card, i) => `
          <div class="tarot-card-slot">
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
