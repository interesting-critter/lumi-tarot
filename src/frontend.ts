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
    
    .tarot-flip-controls { display: flex; flex-direction: column; gap: 8px; align-items: stretch; margin-top: 12px; }
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
    id: 'lumi-tarot',
    title: 'lumi-tarot',
    shortName: 'Tarot',
    description: 'Perform LLM-driven tarot readings',
    keywords: ['tarot', 'reading', 'cards', 'divination']
    iconSvg: "<svg version='1.0' xmlns='http://www.w3.org/2000/svg' width='901.333' height='898.667' viewBox='0 0 676 674'>
  <path d='M291 64.4c-4.7 1.3-20 5.3-34 8.9s-32.5 8.4-41 10.6c-19.9 5.1-49.2 12.6-74.5 19.1-11 2.8-25.8 6.6-33 8.5-7.1 1.9-22 5.7-33 8.5-27.3 7-29.3 7.6-32.9 10.4-4 3-7.6 10.2-7.6 15.3 0 2.3 3.6 18.9 8 36.9 4.4 18.1 10.5 43 13.5 55.4s7.7 31.7 10.5 43c5.4 21.8 8 32.8 30 123 25.5 104.8 23.9 98.6 27.2 103.1 3.4 4.7 9.5 7.8 15.2 7.9 2.2 0 16.4-3.2 31.5-7.1 15.2-3.9 36.2-9.3 46.8-12 10.5-2.7 19.6-4.9 20.2-4.9s1.1 2 1.1 4.5c0 5.6 2.9 11.6 7.2 14.8C248 511.7 270 521 295 531s74.8 29.9 110.5 44.2c35.8 14.4 69.3 27.8 74.5 29.9 11.5 4.7 16.6 4.9 23.6 1.4 6.2-3.2 7.2-4.6 12.7-18.5 2.5-6.3 8.2-20.5 12.7-31.5s13.4-32.8 19.7-48.5 14.3-35.5 17.8-44c12.8-31.6 38.4-95 58.6-145.4 22.4-55.7 23-57.5 19.3-65.2-3.2-6.7-6.7-8.8-28.7-17.7-11.7-4.6-65.3-26.1-119.2-47.7s-99.8-39.7-102-40.2c-6.3-1.4-13 .7-17.9 5.6-3.5 3.5-5.4 7.5-12.6 25.4-4.6 11.7-8.8 21.2-9.2 21.2-1 0-.9.2-19.3-76-13-53.7-13-53.7-20.7-59.1-4.6-3.3-12.9-3.4-23.8-.5m-12.7 18.3c-2.4 8.2.1 17.6 6.6 24 4.5 4.6 9.1 6.3 16.6 6.3 6.9 0 10.7-1.3 15.9-5.7 3.6-3 3.5-3.2 7.1 11.7 1.5 6.3 6.9 28.6 12 49.5s9.9 40.7 10.5 44l1.2 6-7.5 18.5c-4.1 10.2-7.9 18.4-8.4 18.3-.7-.2-3.1-9.1-9.3-35.3-1.2-5.2-4.6-19.4-7.5-31.5-7.3-30.3-9.2-38.2-10.5-44-2.1-9.4-5.1-11.3-12.1-7.8-2.1 1.1-6.4 1.9-11.6 2.1-6.9.3-9 0-12.7-1.7-6.6-3.2-12.1-9.7-14.1-16.7-2.9-9.9-3.2-10.4-6.3-10.4-1.5 0-13.3 2.7-26.2 5.9-12.9 3.3-42.2 10.7-65 16.5-22.8 5.7-42.3 10.7-43.2 11.1-2.4 1-3.1 3.8-1.9 8.2 1.7 6.2 1.3 15.3-1 20.3-3.8 8.4-11.9 15-20.4 16.5-6 1.1-7.5 2.2-7.5 5.4 0 1.5 3.3 16.7 7.4 33.7 7.4 30.7 24.2 100.3 41.6 172.9 5 20.9 9.8 39.1 10.7 40.3 1.2 1.9 2 2.3 4.1 1.7 1.5-.3 5.4-1.1 8.8-1.7 14-2.5 27.4 6.9 31.4 21.9.6 2.4 1.8 4.7 2.8 5.2 1.2.6 10.6-1.4 31.9-6.7 16.6-4.3 30.4-7.4 30.8-7.1.5.6-8 23.5-9.4 25.1-.6.6-66 17.7-71.3 18.6-3.2.5-3.1.8-1.7-5.7 1.6-7.7-.9-15.2-7.1-21.3-5.2-5-9.7-6.8-17-6.8-6 0-13.9 3.8-17.7 8.5-1.7 2-3.3 3.3-3.6 2.7-.8-1.1-3-10.2-42.2-170.6-17.3-71-31.3-129.2-31.1-129.4s2.6.4 5.3 1.3c7.9 2.7 17.7.4 24.2-5.8 10.4-9.8 9.6-27.1-1.5-36.5-3-2.5-4-3.8-3.1-4.3.6-.4 12-3.5 25.2-6.9 25.3-6.5 50.3-12.9 72-18.5 7.2-1.8 24.7-6.3 39-10 48.9-12.5 65-16.7 65.4-17.1.2-.2.7-.1 1.1.1.5.3.2 2.6-.7 5.2m-31.9 43.8c3.4 7.6 6.8 11.8 12.9 15.8 7.8 5.2 14.3 7 23.5 6.4 4.2-.3 8.8-.8 10.2-1.2 2.4-.6 2.7-.3 3.8 4.2.6 2.6 3.6 14.9 6.6 27.3 2.9 12.4 7.2 30.1 9.5 39.5 4.1 17.1 11.7 49.3 12.6 52.9.4 1.9-9.8 29.2-11.7 31.1-.6.7-4.5-2.8-11.4-10-5.8-6.1-12.8-13.3-15.6-16.1l-5-5.2 3.7-13.3c2-7.4 4.8-17.3 6.1-22.1 3-11 3-12.9-.2-16.7-3.8-4.6-1.9-4.8-42.1 5.9l-10.3 2.7-17.3-17.3c-18.5-18.6-19.4-19.2-25.7-15.9-3.3 1.7-3.6 2.6-11 30-2.9 10.4-5.3 19.1-5.5 19.3s-11 3.2-24.2 6.8c-25.4 6.9-28.3 8.3-28.3 14 0 4.3 1.7 6.3 18.8 23.6l16.6 16.7-1 4.8c-.6 2.6-3.4 13.2-6.3 23.5-3.3 12.1-4.9 19.7-4.5 21.3.8 3.3 4.9 6.5 8.3 6.5 2.5 0 18.3-4.1 37.5-9.6l8.9-2.6 17.3 17.3c16.2 16.1 17.6 17.3 20.9 17.2 1.9-.1 4.6-.8 5.8-1.6 2.5-1.6 2.7-2.2 10.6-30.5 2.7-9.5 5.2-17.6 5.5-17.9.9-1 39-11.1 39.8-10.7.4.3.3 1.5-.1 2.7-.5 1.2-8 19.7-16.6 41.2-8.7 21.4-19 47.1-23 57-4 9.8-7.8 18.3-8.6 18.7s-14.8 4.1-31.1 8.2l-29.8 7.4-3.1-6.3c-5.4-11-14.8-18.1-27.4-20.5-4.2-.8-7.3-.8-10.4-.1-2.5.5-4.8.8-5.2.6-.8-.6-1.7-3.9-9.5-36.5-6.4-27-22.2-92.8-26.9-112.5-12.7-52.6-19.5-81.3-19.5-82.7 0-1 2.3-2.7 6.2-4.5 7.9-3.8 11.7-6.9 16.2-13.7 4.7-7.1 7-16.2 6.3-24.3l-.6-6.2 3.7-1c2-.6 21.7-5.6 43.7-11.1 22-5.6 47.4-12.1 56.5-14.4s16.8-4.1 17.2-3.9 1.8 2.8 3.2 5.8M513.5 205c51.2 20.5 93.8 37.6 94.8 38.2 1.6.8 1.3 1.3-2.6 3.8-2.7 1.7-5.7 4.8-7.4 7.7-2.4 4.1-2.8 5.9-2.8 12.4 0 6.7.4 8.1 3 12.5 1.7 2.7 5.1 6.2 7.5 7.9 3.8 2.5 5.7 3 11.8 3.3 4.9.3 7.2.8 7.2 1.7 0 .7-2.6 7.7-5.9 15.6-5.5 13.5-16 39.6-71.6 177.9-28.5 70.8-32.3 80.2-33 80.8-.3.3-1.8-1-3.4-2.9-11.6-14-36.2-8.8-41.1 8.7-1.3 4.4-1 13.2.5 16.8.7 1.5.5 1.8-.6 1.4-24.7-9.5-194.9-78.4-194.9-79 0-.4 1.6-1.5 3.5-2.4 4.2-2 9.2-7.4 11.2-12.2 1.9-4.6 1.8-13.7-.1-18.4-4-9.5-13.5-15.3-23.8-14.6-3.7.3-5.8 0-5.8-.6s2.6-7.6 5.9-15.6c3.2-8 11-27.3 17.4-43 14.6-36.1 82.9-206 86.8-215.8.9-2.2 1.1-2.1 6.2 3.2 5.8 5.9 9.8 7.6 18.2 7.6 8.8-.1 16.2-4.8 20.7-13.1 1.8-3.6 2.3-5.9 2.2-12.2-.1-6.7.2-7.8 1.5-7.4.9.3 43.5 17.2 94.6 37.7m-287 25.9c-1.2 1.1-34.7 10.2-35.3 9.6-.5-.5 7.1-29.6 9-34.4.9-2.4 1.4-2 14.1 10.7 8.3 8.3 12.8 13.5 12.2 14.1m57.2-2.7c-1 4.8-8.9 33.3-9.4 34.2-.3.4-6.6-5.2-13.9-12.5-7.4-7.3-13-13.6-12.6-14s6.9-2.3 14.4-4.3c7.6-2 14.8-4.1 16-4.6 4.2-1.6 6.1-1.2 5.5 1.2m-29.8 28.4c15.4 15.7 17.1 17.9 16.6 20.3-.3 1.4-3.4 12.9-6.8 25.5l-6.2 23-23.8 6.4c-21.1 5.8-24 6.4-26 5.2-1.2-.8-9.4-8.7-18.2-17.7l-16-16.3 3.4-13.3c1.9-7.2 5.1-18.8 7-25.6l3.6-12.4 23-6.3c12.7-3.4 23.7-6.3 24.6-6.3.9-.1 9.4 7.8 18.8 17.5m-77.9-.3c0 .7-1.8 7.5-3.9 15.2-2.2 7.7-4.5 15.9-5.1 18.2-.6 2.4-1.4 4.3-1.8 4.3-1.1 0-28.7-27.9-28.1-28.4.5-.6 35.7-10.4 37.7-10.5.6-.1 1.2.5 1.2 1.2m117.9 40.8c7.3 7.7 13.1 14.2 12.8 14.5-.8.8-37.8 10.6-38.2 10.2-.3-.2 1.4-7.1 3.7-15.4 2.2-8.2 4.5-16.8 5.1-19.2.6-2.3 1.5-4.2 2.1-4.2s7.1 6.3 14.5 14.1M181 323.7c13.6 14 16.4 17.2 15.8 17.9-1.1 1-35.8 10.2-36.2 9.5-.2-.3 1.6-7.6 3.9-16.1s4.5-16.7 4.9-18.3c.3-1.5 1-2.7 1.4-2.7s5 4.4 10.2 9.7m68.3 31.6c-2.6 9.7-5.3 17.7-5.9 17.7-1.8 0-26.8-26-25.8-26.9.5-.5 4.7-1.8 9.4-3s12.3-3.2 17-4.5 8.8-2.1 9.3-1.7c.4.4-1.4 8.7-4 18.4'/>
  <path d='M434.3 193.2c-.6.7-2.1 3.8-3.5 6.9-5 11.1-13.6 17-25.9 17.7-6.8.4-8.4.1-13.2-2.2-3.1-1.4-6-2.6-6.6-2.6-1.8 0-3.8 3.9-10.6 21-10.9 27.1-36.4 90.3-50.5 125-37.4 92.7-39.5 98-38.4 99.8.6.9 3.2 2.4 5.9 3.4 9.9 3.5 17 10.7 19.5 19.8 1.5 5.2 1.2 13.6-.5 17.7-.8 1.9-1.5 4.8-1.5 6.4 0 2.5.7 3.2 4.3 4.9 12.1 5.6 128.2 51 130.3 51 2 0 2.9-1 5-5.7 3-7 7.3-11.7 13.7-14.9 9.3-4.8 19-4.4 28.2 1.1 6.5 3.9 8.5 4.3 10.7 1.7.8-.9 5.4-11.6 10.3-23.7 4.8-12.1 18.1-45.2 29.5-73.5s29.4-73 39.9-99.2c20.6-51.3 20.6-51.1 14.3-52.3-8.7-1.8-13.7-4-17.9-7.8-8.3-7.7-11.4-17.7-8.8-28.1.9-3.4 2-6.5 2.5-7 1.4-1.4 1.2-6.2-.2-7.3-1.8-1.4-132.4-53.3-134.1-53.3-.8 0-1.9.6-2.4 1.2m66.7 34.2 58.5 23.4-.3 2.8c-.1 1.6-.4 7.2-.5 12.4-.2 8.5.1 10.1 2.5 15.2 1.5 3.2 3.9 7.4 5.5 9.5 3.2 4.2 13 10.8 17.3 11.8 1.7.4 3.2 1 3.5 1.5s-1 4.6-2.9 9.2C580.6 323 521.8 469 507 506c-5.6 14-10.6 25.9-11 26.4-.5.4-3.8-.2-7.5-1.4-9.1-3-20.5-2.5-28.7 1.2-6.5 3-14.6 10.1-17.4 15.3-1 1.9-2.3 3.5-2.9 3.5-1.6 0-117.6-46.7-118.6-47.7-.5-.5-.5-3.3.1-6.5 2.9-15.3-5-32.1-18.6-39.9-3-1.7-5.4-3.5-5.4-4.1s4.1-11.2 9.1-23.7c19.9-49.4 37-91.9 56.6-140.6 11.3-28.1 21.7-53.8 23.1-57.3 2.1-5.5 2.7-6.3 4.6-5.8 1.1.4 5.2 1.2 8.9 1.8 5.9 1.1 7.7 1 13.3-.5 11.1-2.9 19.5-9.1 25.1-18.5 1.4-2.3 3-4.2 3.6-4.2.7 0 27.5 10.5 59.7 23.4'/>
  <path d='M413.5 255.6c-1 1-1.4 2.6-1.1 3.8s4.8 32.2 10.1 69c5.3 36.9 10.1 67.6 10.7 68.3s1.8 1.3 2.7 1.3c1 0 26.4-19.4 56.7-43 48.7-38.1 54.9-43.3 54.9-45.7 0-2-.7-3.1-2.5-3.9-5.2-2.5-128-51.4-128.9-51.4-.5 0-1.7.7-2.6 1.6'/>
  <path d='M402.1 376.9c-1.7 2.1-4.4 6.6-5.9 9.8-2.3 5.1-2.7 7-2.7 15.3.1 8.5.4 10.2 3.2 16.2 4.1 8.8 10 15.1 18.1 19 5.5 2.8 7.8 3.3 15.7 3.6 11.6.5 18-1.2 25.8-7.2 9.6-7.2 14.9-16.6 16.3-28.6.8-7.3-.4-7.8-5.6-2.4-15.2 15.7-37.5 17.9-48.9 4.9-5.1-5.8-9-15-10.1-23.8-.5-4.3-.9-8.3-.7-8.9.6-2.7-2.4-1.5-5.2 2.1m-47.9 29.3c-.7.7-1.2 2.1-1.2 3.3 0 3.9 1.8 4.5 13.6 4.5s14.4-.9 14.4-4.9c0-3.5-2.1-4.1-14-4.1-7.7 0-12 .4-12.8 1.2m32.1 21.9c-4.1 1.5-29.2 18.9-30.3 20.9-1.5 2.7.4 6 3.4 6 2.2 0 28.2-16.2 31.9-19.9 3.5-3.5-.3-8.8-5-7M404 447c-2.8 5.3-7.9 20.1-7.4 21.4.7 1.8 4.6 3.1 6.8 2.3.7-.3 3.2-5.3 5.5-11 3.5-8.7 4.1-10.9 3.1-12.6-1.5-2.8-6.5-2.9-8-.1m52.7-.2c-2.3 2.5-2.2 3.4 2.1 14.7 3.5 9.6 3.8 10 6.9 10.3 2.4.2 3.4-.2 4.3-1.8.9-1.7.5-4-2.5-12.3-4.4-12.4-7-15.1-10.8-10.9m-26.7 6.8c-1.3 3.2-1.3 33.5-.1 36.7 1.3 3.2 3.9 4.1 6.7 2.2 2.4-1.5 2.4-1.7 2.4-20.3 0-20.3-.2-21.2-5.2-21.2-2.1 0-3.1.6-3.8 2.6M545.2 86.2c-.6.7-2.8 6.5-5 12.8l-3.9 11.4-10.8 3.8c-6 2.1-11.5 4.4-12.2 5-.8.6-1.3 2.5-1.1 4.2.3 3 .8 3.3 11.4 7.1 6 2.2 11.5 4.3 12.1 4.8.6.4 2.8 5.7 4.8 11.7 3.6 11 5.4 14 8 14s4.4-3 8-14c2-6 4.2-11.3 4.8-11.7.6-.5 6.1-2.6 12.1-4.8 10.3-3.7 11.1-4.2 11.4-6.8.2-1.6-.1-3.4-.7-4.1-.6-.8-5.7-3-11.4-5-5.6-2-10.7-4-11.3-4.4s-2.6-5.2-4.4-10.7-3.9-11-4.6-12.3c-1.6-2.4-5.5-3-7.2-1m-419.4 457c-.9.7-2.6 4.4-3.9 8.1-1.2 3.8-2.9 7.7-3.8 8.7-.9.9-4.5 2.8-8.1 4-7.3 2.6-10 4.5-10 7 0 2.6 2.8 4.4 11.1 7.4l7.5 2.7 2.8 8.2c3.2 9.5 4 10.7 7.2 10.7 2.9 0 4.5-2.5 7.3-11.2 1.2-3.6 2.7-7.1 3.4-7.6s4.1-1.9 7.7-3.2c8-2.8 10.5-4.9 9.6-8.3-.5-2-2.1-3-8.3-5.2-4.3-1.5-8.3-3.2-9-3.7-.6-.5-2.4-4.5-3.8-8.9-3.1-9.2-5.9-11.7-9.7-8.7m453.8 22.9c-4.1 1.2-8.4 5.7-9.8 10.1-.9 3.1-.8 4.5.6 8.3 5.4 14 25.3 11.6 27.3-3.3 1.3-9.5-8.7-17.9-18.1-15.1M280 588.2c-1.1 1.8-2.2 4.5-2.5 6-.5 2-1.6 3-4.3 3.9-5.7 1.8-8.2 3.7-8.2 6.3 0 2.9 1.1 3.8 7.2 6.1 4.1 1.5 4.8 2.2 6.5 6.7 3.4 9.5 8.6 9.4 11.8-.1 1.5-4.5 2-5 6.8-6.8 3.7-1.5 5.5-2.7 6.1-4.6 1.3-3.4-.3-5.2-6.4-7.2-4.2-1.4-5-2.1-6.1-5.3-2.8-8.9-7.3-10.9-10.9-5'/>
</svg>"
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
