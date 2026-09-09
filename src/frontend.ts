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
    .tarot-card-img { width: 100%; max-width: 90px; aspect-ratio: 2/3.5; border-radius: 6px; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.3); cursor: pointer; transition: transform 0.2s; }
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
    keywords: ['tarot', 'reading', 'cards', 'divination'],
    iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3464 3464" stroke="currentColor" fill="currentColor" stroke-width="1.8">><path d="M496.5 12.1c-6.6.8-24.1 6.9-29.2 10-3.7 2.3-12.1 11.3-16.2 17.3-3.8 5.6-8.9 18.8-10.1 26.1-1.3 8.1-1.3 3326.5 0 3335.5 2.1 14.1 11.1 31.3 21.3 40.7 5.5 5.1 7.3 6 21.2 10.9l11 3.9h2479l12.4-4.6c19.3-7.2 28.4-15.8 36.6-35.1 2-4.8 4.3-9.2 5.1-9.9 2.1-1.8 2.1-3343.1 0-3344.8-.8-.7-3.1-5.5-5.2-10.6-4.1-10.4-11.1-20.5-18.5-26.8-5.7-4.7-23.1-11.4-33.4-12.7-8.7-1.2-2465.5-1.1-2474 .1m2400.2 130.2 2.8 2.7.3 1587.8c.2 1218.9-.1 1588.4-1 1590.6-.7 1.7-2.5 3.4-4.4 4.2-2.8 1.2-180 1.4-1159.6 1.4-796.1 0-1157.5-.3-1160-1-2.1-.6-4.3-2.1-5-3.3-1.1-1.8-1.3-313.9-1.3-1590.9V145.1l2.2-2.2c1.2-1.3 4.1-2.6 6.5-3 2.4-.3 524.6-.6 1160.5-.5l1156.3.1z"/><path d="M773 207.1c-27.2 6.6-52.8 17-66.6 27.2-13.9 10.2-34.5 32.1-45.1 47.7-11 16.3-20.2 39.5-23.7 60.5l-2.6 15 .2 1377.5.3 1377.5 2.3 12.3c2.6 13.5 9 32.8 14.8 44.4 10.4 20.8 27 41.5 44.6 55.6 20.9 16.7 47 29.6 69.1 34l13.2 2.7h1908l13.3-2.7c7.9-1.6 15.8-3.9 19.7-5.7 3.6-1.7 6.9-.1 7.4-3.1 1.5 0 22.4-11.2 29.1-15.7 11.3-7.4 17.2-12.3 28.1-23.2 14.8-14.8 30.3-38.9 36.5-56.6 5.3-15.1 6.3-18.5 9-32.5l2.9-14.5.2-414c.2-227.7-.1-845.8-.6-1373.5-.8-865.4-1.1-960.4-2.5-968.5-.8-5-2.1-12.2-2.7-16-1.2-7.4-7.3-24.8-13.3-37.7-9.8-21.4-36.4-52.1-57.6-66.5-11.5-7.8-37.2-18-58.7-23.3l-16.2-4-948.3.1H785.5zm260.1 127.6c2 2 2.1 2.4.9 5.4-1.4 3.2-255.3 257.5-260.8 261.1-3.7 2.4-5.9 2.3-7.7-.6-1.4-2.1-1.5-15.3-1.3-120.2l.3-117.9 3.2-6.5c4.1-8.4 10.3-14.8 17.7-18.3 12.3-5.9 6.2-5.6 130.8-5.4l114.7.2zm1211 .7c2.4 1.6 105.9 104.4 230 228.5 179.3 179.4 226 226.7 228 230.6l2.4 5v1870l-2.7 4.5c-3.7 6.1-452.9 455.4-458.8 458.9l-4.5 2.6H1734c-488.6 0-504.6-.1-508-1.8-5.4-2.9-458.3-456.3-460.6-461.2-1.9-3.9-1.9-23.2-1.9-938.5V799.5l2.5-4.8c1.9-3.4 46.9-49.2 164.5-166.8 287.6-287.7 293.5-293.5 298-294.7 2.7-.7 166.3-.9 507.6-.8l503.5.1zm430.5 1c15.7 4.2 25.2 14.9 29 32.6 2.1 9.9 2.1 227.5 0 232.5-1.7 4.1-4.5 4.6-9 1.5-5.1-3.3-258.5-257.2-259.7-260.2-1.4-3.4-.7-5.6 2.3-6.8 1.3-.5 50.4-.9 117.3-.9 94.4-.1 115.9.2 120.1 1.3M773.7 2867c3.9 2.4 23.2 21.2 98.8 96.1 31.3 31.2 80.8 80.2 109.8 109 48.7 48.3 52.9 52.7 52.5 55.4-.2 1.9-1.2 3.4-2.8 4.2-2 1-26.7 1.2-120.5 1l-118-.2-5.7-2.3c-9.9-4-20.1-16.7-22.8-28.4-1.4-6.1-1.4-232.3 0-234.9 1.4-2.4 4.6-2.4 8.7.1m1930 1c1 2 1.3 25.7 1.1 117l-.3 114.5-3.3 8.1c-2.7 6.8-4.3 9.1-10 14.7-5.8 5.6-7.8 6.8-13.8 8.6-6.9 2.1-7.5 2.1-123.7 1.9l-116.9-.3-1.8-2.2c-1-1.3-1.6-3.2-1.3-4.2.8-3.1 254.2-254.7 261.2-259.4 3.5-2.3 7.2-1.8 8.8 1.3"/><path d="M1722.5 490.8c-22.4 6.7-32 12.8-41 26.2-8.5 12.8-10.6 19.1-11.6 35.9-2.5 41.5-8.4 65.1-24.7 99.3-8.5 17.8-22 37.3-39.8 57.2-9 10.1-13.8 14.4-29.8 26.5-14.5 11-21.9 15.7-38.2 24.1-17.7 9.1-33.3 14.4-49.9 16.9-7.1 1.1-16.4 2.7-20.5 3.6s-14.9 2.2-24 3c-13.7 1.2-17.9 1.9-24.8 4.5-11.4 4.2-15.5 6.3-24 12.6-12.2 9.2-19 20.3-21.7 35.8-3.8 21.8 1.7 41.2 16.3 56.8 5.3 5.7 17.8 13.9 24.7 16.3 2.9 1 12.3 2.3 22.5 3.1 53.4 4.4 72.9 9 102.8 24.5 25.9 13.4 41 24.8 63.8 48 21 21.5 32 37.6 46.2 67.9 10.8 22.9 18.3 56.6 20.7 92.5.8 11.7 2.5 18.5 6.7 28 9 19.9 19 28.5 40.2 34.4 13.6 3.8 20.8 4 33.6.6 21.2-5.6 32-14.2 40.9-32.8 6-12.4 6.8-16.5 7.6-38.2.7-20.2 2.1-29.1 7.4-48.5 5.3-19.6 8.9-29.6 15-41.8 11.7-23.3 24.1-40.7 44-62 10.9-11.6 14.8-14.8 34.1-28.1 19.6-13.4 42.4-25.8 53-28.7 3-.8 10-2.8 15.5-4.4 26.9-7.6 36.1-8.8 61.5-8.1 17 .4 38.3-6.7 48.2-16.3 5.9-5.6 14.1-19.5 16.7-28.1 2.6-8.4 4-19.6 3.4-25.6-1-10.1-4.5-21.5-9-29.4-8.4-14.6-13.5-19.2-28.4-25.4s-16.3-6.4-41.4-6.6c-25.1-.3-29-.8-50.7-6.9-17-4.8-27-9-45.1-18.7-19.4-10.4-22.8-12.7-36.4-23.7-24.1-19.8-40.2-37.9-53-59.7-7.2-12.4-18.4-34.8-19.5-39.5-.6-2.5-2-6.5-3-9-1.8-4.2-7.3-26.9-9.7-40.5-.6-3.2-1.6-13.1-2.1-22-1.3-20.1-2.4-25.7-7.2-36.9-7-16.1-14-23.1-30.7-30.8-11.4-5.3-16.1-6.7-25.1-7.3-5.5-.4-9.1 0-13.5 1.3m14.9 274.3c1.4 1.1 5.7 6.2 9.5 11.2 10.1 13.6 29.5 33.2 49.7 50.2 25.3 21.3 26.8 22.8 25.9 26.2-.8 3.5-2.5 5.4-10 11.2-20.1 15.4-51.6 44.8-63.1 58.7-8.6 10.5-11.7 13.4-14.5 13.4-2.7 0-7.5-4.6-14.6-13.9-13.3-17.8-47.7-51.6-64.1-63.2-12-8.4-14-13-7.9-18.5 3.4-3.2 18.8-15.5 27.2-21.8 12.8-9.6 33.3-30.1 45.5-45.6 8.4-10.7 11.1-12 16.4-7.9m-21.9 585c-4.4.5-18.8 2.2-32 3.9-13.2 1.6-31 3.7-39.5 4.5-8.5.9-21.6 2.7-29 4.1s-18.4 3.2-24.4 3.9c-5.9.8-14.2 2.6-18.5 3.9-4.2 1.3-10.1 2.9-13.1 3.6-3 .6-11 2.9-17.7 5.1-6.7 2.1-12.9 3.9-13.7 3.9s-5 1.2-9.3 2.6-11.4 3.6-15.8 4.9c-13.7 4-36.6 12.1-45.5 16-4.7 2-11.2 4.8-14.5 6.2-3.3 1.3-9.1 3.9-13 5.8-3.8 1.8-12.2 5.6-18.5 8.5-35.5 16-55.7 26.3-84 42.7-53.7 31.1-90.6 55.4-123 81.1-8 6.4-20.1 16-27 21.5-18.5 14.7-33.8 27.3-53 43.6-17.4 14.9-59.1 55.3-82.1 79.6-14.4 15.3-43.4 47.4-50.9 56.5-3.4 4.1-9.4 11.2-13.4 15.8-9.3 10.9-12.6 15.9-20 30.5l-6.1 12.2v30l4.8 10.5c4.9 10.6 8.8 16.6 18.2 27.5 2.8 3.3 7.3 8.9 10 12.5s8.3 10.1 12.5 14.5 8.9 9.6 10.4 11.5c12.4 15.8 72.1 77 95.7 98.1 5.8 5.2 17.7 16 26.5 23.9 19.7 18 28.9 25.9 33.4 29s21 15.9 32 24.9c15.4 12.6 25.2 19.8 45.5 33.6 11 7.5 23.8 16.3 28.5 19.6 19.2 13.6 44.9 29.3 65.2 39.7 16.8 8.6 20.9 10.8 28.7 15.6 3.5 2.2 15.9 8.7 27.5 14.4 19.7 9.8 28.9 13.9 44.4 19.8 3.4 1.3 7.9 3.2 10 4.3 4.7 2.3 25.6 10.7 34.2 13.6 31.6 10.9 58 18.9 69.5 21.2 3.9.8 14.7 3.2 24 5.3 42.7 9.8 51.1 11.4 72 13 8.3.6 24.2 2.2 35.5 3.6 35.5 4.2 55.4 5 78 3 10.7-.9 25.8-2.5 33.5-3.6s22.6-2.6 33-3.5c12.2-1 23.5-2.6 31.5-4.4 6.9-1.6 16.8-3.7 22-4.6 5.2-1 11.9-2.6 14.9-3.6 3-1.1 10.6-2.8 17-3.8 6.4-1.1 13.6-2.7 16.1-3.6s8.3-2.5 13-3.6 11.7-3.1 15.5-4.5c3.9-1.4 10.4-3.6 14.5-4.9 17.7-5.6 46.9-16.7 53-20.3 1.9-1.1 5.5-2.6 8-3.2 2.5-.7 6.3-2.1 8.4-3.2 2.2-1.1 6.3-2.8 9.1-3.8 2.7-1 13.6-6 24-11.1 17.2-8.4 27.2-13.8 46.5-24.9 3.6-2.1 9.9-5.4 14-7.5 18.2-9 48.6-27.4 67-40.6 6.9-4.9 13.6-9.7 15-10.6s8.8-5.8 16.5-10.9 21.2-14.9 30-21.8c17.7-13.9 31.3-24.5 45-34.9 9.3-7 16.1-13 42-36.7 8.3-7.6 21.5-19.7 29.5-27 20.1-18.3 69.3-69.1 83.9-86.5 1.8-2.2 6.4-7.2 10-11 3.7-3.9 11.2-12.6 16.7-19.3 5.4-6.8 11.6-14.5 13.7-17 7.6-9.4 15-26.6 16.1-37.2 1.1-11.6-.6-20.8-6-32.2-5.8-12.2-10.5-18.9-28.6-40.8-24-29.3-111.8-119.2-138.1-141.5-6.5-5.5-17.5-14.9-24.5-20.8s-15.4-12.9-18.7-15.5c-3.3-2.5-17.1-13.4-30.6-24.2-13.5-10.7-28.1-22-32.5-25-24.1-16.9-40.1-27.6-49.4-33.2-5.8-3.4-15.7-9.4-22-13.3-6.3-4-18.5-11.1-27-16-8.5-4.8-16.8-9.6-18.4-10.8-4.1-2.8-32.4-16.8-56.1-27.6-54.2-24.9-63.8-29-76.8-33.1-5-1.5-12.6-4-16.7-5.3-14.9-5.1-26.7-8.7-34.5-10.6-4.4-1.1-10.7-2.9-13.9-4.1-3.3-1.1-9.6-2.9-14.2-4-4.5-1-10.9-2.8-14.1-3.9s-11.2-2.7-17.8-3.5c-6.6-.9-16.5-2.5-22-3.6-14.3-2.7-15-2.8-36.5-5-10.7-1.1-26.2-3-34.5-4.1-35.1-4.6-52.4-5.6-69-3.8m53.5 130.4c17 2.5 45.7 8.3 56.6 11.4 5.9 1.7 11.1 3.1 11.6 3.1 1.3 0 23 8.5 31.8 12.5 4.1 1.8 8.6 3.6 9.9 4 8.9 2.6 23.1 10.5 50.6 28.3 29.4 18.9 68.4 57.4 92 90.7 6.8 9.6 14.8 23.1 20.3 34.5 2.5 5.2 5.6 11.1 6.9 13 4 6.2 13.5 30.6 18.5 47.5 5.5 18.6 7.9 27.6 9.2 34 1.9 8.8 5.3 41.4 6 56.4 1 21.3-3.4 67.2-8 84.1-1.3 4.7-3.3 12.3-4.5 17-1.1 4.7-3.4 12.1-4.9 16.5-1.6 4.4-4 11.5-5.5 15.8-2.8 7.9-20.5 43.7-26.6 53.7-7.3 11.9-20.5 30.8-25.8 37-3.1 3.6-7.4 8.7-9.6 11.5-9.1 11.6-26.2 27.8-48.9 46.4-11.8 9.7-41.1 28.2-57.1 36.1-12.2 6-25.5 11.5-35.5 14.5-4.1 1.2-9.5 3.1-12 4.2s-7 2.6-10 3.2-9.3 2.3-14 3.6c-10.3 3-39.5 9-54 11.1-15.9 2.3-61.8 1.4-75-1.5-5.2-1.2-14.7-3-21-4.1s-14.6-3-18.5-4.1c-3.8-1.2-11.7-3.4-17.5-4.9-11.2-3-30.1-9.5-44.1-15.3-32.3-13.1-73.5-41.5-103.4-71.1-18.1-18-40-45.9-50.7-64.8-20.6-36.4-29.7-57.8-37.8-88.8-2.1-8-4.3-15.8-4.9-17.4s-1.8-8.5-2.6-15.5c-.8-6.9-2-16.4-2.7-21.1-.8-5.2-1.2-20.1-1.3-38 0-26.6.3-31.4 2.7-49 1.5-10.8 3.5-21.6 4.3-24 .9-2.5 3.6-12.2 6-21.5 5.7-22.2 13.5-43.8 19-52.5 1.2-1.9 5.1-9.2 8.7-16.1 11.8-22.8 25.8-42.3 47.6-66.4 7.9-8.7 31.9-31.4 38.7-36.5 2.8-2.1 8.2-6.3 12.2-9.3 11.9-9.1 44.2-29.1 53.3-32.9 4.7-2 12.3-5.3 17-7.3 12.7-5.4 33.4-13.2 37.2-14 1.8-.3 7-1.8 11.6-3.1 6.9-2.1 48.4-10.3 58.7-11.7 8.4-1.1 56.6-.6 65.5.8m-483.2 180.1c.2 2.8-.7 6.7-2.7 12-3.5 9-10.5 33.4-12.7 43.9-.8 3.8-2.8 12.6-4.4 19.5-3.4 14.5-7.8 51.3-8.7 72.7-.5 12.5 1 53 2.2 61.3.2 1.4 1.3 10.6 2.5 20.5 2.7 23.7 13 66.6 21.1 87.9q3 7.8 2.7 12c-.3 3.8-.5 4.1-3.3 4.4-3.4.3-8.8-3.4-26.1-17.8-29.6-24.6-39.7-33.1-46.4-38.9-15.4-13.5-36.7-33.9-56.2-53.9-11.1-11.4-24.8-25.2-30.4-30.7-10.3-10.2-18.2-19.2-20.3-23.2-1.6-3.2-1.3-7.4.8-10.6 5-7.6 66-69.9 87.1-89.1 19.4-17.6 28.1-25.2 36.6-32.2 3.9-3.3 14.7-12.5 24-20.5 20.9-18 26.7-22.1 30.8-21.7 2.9.3 3.1.6 3.4 4.4m907.8-1.5c5.9 3.8 11.1 8 26.4 21.5 6.3 5.5 17.8 15.4 25.5 21.9 7.7 6.4 16.3 13.8 19 16.4 2.8 2.5 11.5 10.5 19.5 17.8 14.8 13.4 26.6 25.2 58.5 58.7 20.3 21.3 23.5 25.4 23.5 30.8 0 5.3-3.2 9-37.4 44.1-30.2 30.8-53.9 53.5-68.5 65.7-4.3 3.6-20.1 16.8-35.1 29.3-36.8 30.8-40.1 32.9-42.4 26.4-.8-2.2-.3-4.8 2.6-13.5 9.2-27.5 18.1-64.8 21.2-88.7 7.5-58.4 5.2-116.9-6.5-164.5-6.4-25.6-10.8-41.9-14.8-53.6-3.4-10.1-3.7-12.4-1.9-14.2 2-2 5.1-1.4 10.4 1.9"/><path d="M1712.5 1567.6c-6.6.7-17.8 2.5-25 3.8-7.1 1.4-15.9 3-19.5 3.6-19.4 3.4-56.8 21.1-83 39.4-11.6 8-30.8 23.6-35.5 28.8-2.2 2.4-7 7.7-10.9 11.8-12.1 13.1-30.6 39.9-35.7 51.6-1.2 2.7-3.2 7.2-4.5 10-4.4 9.7-9.8 24.3-15.4 42.2-4.3 13.9-6.2 25.8-8.1 51.2-1.8 24.2 1.7 62.2 7.4 80.5 1.9 6 3.8 12.5 4.2 14.4 2.5 11.5 16 40.6 28.1 60.6 11.7 19.4 30.9 40.8 52.9 59 14.1 11.7 20.2 16.2 27 20 2.8 1.5 6.2 3.6 7.7 4.7 4.8 3.4 34.1 17.6 38.8 18.8 2.5.6 8.3 2.5 13 4.1 8.4 3 28.8 7.5 47 10.3 14.1 2.2 33.8 2.9 48.7 1.7 18.7-1.5 50.3-7.3 60.5-11.1 3.1-1.1 8.9-3 13-4.1 6.6-1.8 39.2-17.3 42.8-20.3.8-.7 4.4-2.9 8-4.9 8.9-4.9 33.3-24.6 46.3-37.5 17.4-17.2 35.1-42.2 48.5-68.8 4.3-8.5 11.4-26.9 13.2-34.4.6-2.5 2.4-8.6 4-13.7 7.5-23.4 9.7-68.6 5.1-101.3-1.2-8.5-2.8-17.8-3.6-20.5l-4-14c-8.1-28-22.1-55.8-42.6-84.5-4.1-5.7-16.5-19.7-24.4-27.4-15.5-15.2-44.1-35.6-65-46.4-25.2-12.9-38.4-17.9-53.9-20.7-4.6-.8-12.8-2.3-18.2-3.4-12.2-2.4-37.9-5.1-47.7-5-3.9.1-12.6.7-19.2 1.5m58.5 132.1c15 4.8 22.5 8.5 34.5 16.9 27.9 19.5 38.8 32.7 50 60.5 5.8 14.3 9.5 33.4 9.5 48.6 0 8.2-2.1 24.8-4.1 33-7.4 29.9-29.2 60.1-55.3 76.6-18.9 12-39.7 19.1-60.3 20.7-26.7 1.9-48.4-2.3-71.3-14.2-19.6-10.1-32.8-21.6-48.1-41.9-4.6-6.1-12-21.3-15.9-32.3-6.1-17.6-8.4-43.3-5.6-62.6 2.1-14.4 4.3-21.1 12.1-37.5 9.3-19.7 21.1-33.2 41.5-47.7 14.5-10.3 24-15.3 36.8-19.3 15.7-5 19.4-5.4 42.7-5.1l21 .4zm-408 797.4c-22 6.5-30.4 13.5-39.5 32.9-9 19.4-8.6 37.9 1.3 57.6 2.2 4.4 6.6 10.8 9.8 14.3 4.9 5.4 7.4 7.1 16.1 11.2 18.1 8.6-16.4 7.9 383.9 7.9 399.6 0 365 .7 382.7-7.7 8.2-3.9 10.9-5.9 16.3-11.5 18.9-20.1 22.5-48.9 9.5-75.4-8.4-16.9-16.9-23.3-39.9-29.9l-12.4-3.5-357.1.1h-357.2zm141.8 242c-4.9.5-10.3 1.9-14.7 3.8-3.8 1.7-7.5 3.1-8.3 3.1-2 0-10.8 5.4-15.6 9.5-6 5.2-9.8 11.2-14.5 22.8l-4.1 10.2-.1 14c0 13.9.1 14.1 3.8 23.4 4.2 10.5 11.1 20.6 18.3 26.5 7.4 6.2 25.2 12.6 37.9 13.7 13 1.1 439.9 1.1 453 0 9.9-.8 23.2-4.9 33.6-10.2 6.1-3.1 15.5-14.4 20.4-24.4 5.8-12.2 6.8-16.2 6.8-28.5.1-11.9-1.3-17.6-7.3-30.5-6.2-13.6-15.6-22.2-30.1-27.5-4.6-1.7-10.4-3.9-12.9-4.8-4.2-1.6-21.2-1.7-231.5-1.8-124.8-.1-230.5.2-234.7.7"/></svg>`
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
