import type { SpindleFrontendContext } from 'lumiverse-spindle-types'

export function setup(ctx: SpindleFrontendContext) {
  // Inject custom styles
  const removeStyle = ctx.dom.addStyle(`
    .tarot-container { 
      padding: 16px; 
      display: flex; 
      flex-direction: column; 
      gap: 12px; 
      height: 100%; 
      box-sizing: border-box; 
      overflow-y: auto; 
    }
    .tarot-section { 
      background: var(--lumiverse-fill-subtle); 
      padding: 12px; 
      border-radius: var(--lumiverse-radius); 
      border: 1px solid var(--lumiverse-border); 
      display: flex; 
      flex-direction: column; 
      gap: 8px; 
    }
    .tarot-label { 
      font-size: 12px; 
      color: var(--lumiverse-text-muted); 
      font-weight: 600; 
      text-transform: uppercase; 
    }
    .tarot-btn { 
      padding: 8px 12px; 
      background: var(--lumiverse-accent); 
      color: var(--lumiverse-accent-fg); 
      border: none; 
      border-radius: var(--lumiverse-radius); 
      cursor: pointer; 
      font-weight: 600; 
      transition: filter 0.2s;
    }
    .tarot-btn:hover { filter: brightness(1.1); }
    .tarot-divider { height: 1px; background: var(--lumiverse-border); margin: 4px 0; }
  `)

  // Register the Drawer Tab
  const tab = ctx.ui.registerDrawerTab({
    id: 'tarot-reader',
    title: 'Tarot Reader',
    shortName: 'Tarot',
    description: 'Perform LLM-driven tarot readings',
    keywords: ['tarot', 'reading', 'cards', 'divination']
  })

  // Inject the HTML skeleton
  tab.root.innerHTML = `
    <div class="tarot-container">
      <div class="tarot-section">
        <div class="tarot-label">Settings</div>
        <div id="tarot-sys-prompt-slot"></div>
        <div id="tarot-conn-slot"></div>
        <button class="tarot-btn" id="tarot-save-btn">Save Settings</button>
      </div>
      <div class="tarot-divider"></div>
      <div class="tarot-section" id="tarot-reading-view">
        <div class="tarot-label">Reading</div>
        <div style="color: var(--lumiverse-text-muted); font-size: 13px;">Waiting for backend to load settings...</div>
      </div>
    </div>
  `

  // Get DOM elements
  const sysPromptSlot = tab.root.querySelector('#tarot-sys-prompt-slot') as HTMLElement
  const connSlot = tab.root.querySelector('#tarot-conn-slot') as HTMLElement
  const saveBtn = tab.root.querySelector('#tarot-save-btn') as HTMLButtonElement
  const readingView = tab.root.querySelector('#tarot-reading-view') as HTMLElement

  // State holders for components
  let currentSettings = { systemPrompt: '', connectionId: '' }
  let sysPromptHandle: any = null
  let connHandle: any = null

  // Request init data from backend
  ctx.sendToBackend({ type: 'init' })

  // Listen for data from backend
  const unsub = ctx.onBackendMessage((payload: any) => {
    if (payload.type === 'init_data') {
      currentSettings = payload.settings

      // Mount System Prompt Textarea
      if (sysPromptHandle) sysPromptHandle.destroy()
      sysPromptHandle = ctx.components.mountTextArea(sysPromptSlot, {
        value: currentSettings.systemPrompt,
        rows: 6,
        placeholder: 'Enter custom system prompt for the reader...',
        onChange: (val) => { currentSettings.systemPrompt = val }
      })

      // Mount Connection Select
      if (connHandle) connHandle.destroy()
      connHandle = ctx.components.mountSelect(connSlot, {
        value: currentSettings.connectionId,
        placeholder: 'Select LLM Connection',
        options: payload.connections.map((c: any) => ({
          value: c.id,
          label: c.name || c.id,
          group: c.provider
        })),
        onChange: (val) => { currentSettings.connectionId = val }
      })

      // Update reading view placeholder
      readingView.innerHTML = `
        <div style="color: var(--lumiverse-text-muted); font-size: 13px;">
          Settings loaded. Ready for Phase 3!
        </div>
      `
    }
  })

  // Save button handler
  saveBtn.addEventListener('click', () => {
    ctx.sendToBackend({
      type: 'save_settings',
      systemPrompt: currentSettings.systemPrompt,
      connectionId: currentSettings.connectionId
    })
  })

  // Cleanup
  return () => {
    unsub()
    removeStyle()
    if (sysPromptHandle) sysPromptHandle.destroy()
    if (connHandle) connHandle.destroy()
    tab.destroy()
  }
    }
