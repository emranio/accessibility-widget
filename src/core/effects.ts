import type { AccessibilityWidgetState } from './types'

const HOST_STYLE_ID = 'accessibility-widget-host-effects'
export const HOST_WRAPPER_ID = 'accessibility-widget-host'
const COLOR_BLIND_FILTER_ID = 'accessibility-widget-protanopia-filter'

function ensureColorBlindFilter(): void {
  if (document.getElementById(COLOR_BLIND_FILTER_ID)) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = COLOR_BLIND_FILTER_ID
  svg.setAttribute('aria-hidden', 'true')
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none;'
  svg.innerHTML = `
    <defs>
      <filter id="accessibility-widget-protanopia">
        <feColorMatrix type="matrix" values="
          0.567 0.433 0 0 0
          0.558 0.442 0 0 0
          0     0.242 0.758 0 0
          0     0     0 1 0"/>
      </filter>
    </defs>`
  document.body.appendChild(svg)
}

function ensureHostStyle(): HTMLStyleElement {
  let el = document.getElementById(HOST_STYLE_ID) as HTMLStyleElement | null
  if (!el) {
    el = document.createElement('style')
    el.id = HOST_STYLE_ID
    document.head.appendChild(el)
  }
  return el
}

export function ensureHostWrapper(): HTMLDivElement {
  let wrapper = document.getElementById(HOST_WRAPPER_ID) as HTMLDivElement | null
  if (wrapper) return wrapper

  wrapper = document.createElement('div')
  wrapper.id = HOST_WRAPPER_ID
  const body = document.body
  const moved: Node[] = []
  for (const node of Array.from(body.childNodes)) {
    if (node instanceof HTMLElement && (node.classList.contains('accessibility-widget-root') || node.id === HOST_WRAPPER_ID)) {
      continue
    }
    moved.push(node)
  }
  for (const node of moved) wrapper.appendChild(node)
  body.insertBefore(wrapper, body.firstChild)
  return wrapper
}

export function unwrapHost(): void {
  const wrapper = document.getElementById(HOST_WRAPPER_ID)
  if (!wrapper) return
  const body = wrapper.parentElement
  if (!body) return
  while (wrapper.firstChild) body.insertBefore(wrapper.firstChild, wrapper)
  wrapper.remove()
}

const FONT_STEP = 0.1
const LH_STEP = 0.15
const LS_STEP = 0.02

const DARK_CONTRAST_PRESETS = [
  { bg: '#1f2937', text: '#f9fafb', border: '#6b7280' },
  { bg: '#111827', text: '#ffffff', border: '#9ca3af' },
  { bg: '#030712', text: '#ffffff', border: '#d1d5db' },
  { bg: '#000000', text: '#ffffff', border: '#ffffff' },
]

const LIGHT_CONTRAST_PRESETS = [
  { bg: '#ffffff', text: '#111827', border: '#d1d5db' },
  { bg: '#f9fafb', text: '#0f172a', border: '#94a3b8' },
  { bg: '#ffffff', text: '#000000', border: '#475569' },
  { bg: '#ffffff', text: '#000000', border: '#000000' },
]

const HIGH_CONTRAST_PRESETS = [
  { bg: '#111111', text: '#fff7c2', border: '#ffe066' },
  { bg: '#000000', text: '#fff27a', border: '#fff27a' },
  { bg: '#000000', text: '#ffff00', border: '#ffff00' },
  { bg: '#000000', text: '#00ffff', border: '#00ffff' },
]

const READING_MASK_PRESETS = [
  { band: 86, opacity: 0.35, edge: '#2563eb' },
  { band: 116, opacity: 0.45, edge: '#0891b2' },
  { band: 146, opacity: 0.55, edge: '#10b981' },
]

const READING_GUIDE_PRESETS = [
  { height: 6, border: 2, fill: '#0c0c0c', edge: '#facc15', glow: 'rgba(250,204,21,0.28)' },
]

function presetIndex(level: number, length: number): number {
  return Math.max(0, Math.min(level - 1, length - 1))
}

function bigCursorValue(level: number): string {
  const index = presetIndex(level, 3)
  const size = 38 + index * 10
  const hotspot = Math.round(size * 0.16)
  const accent = ['#2563eb', '#0891b2', '#0f766e'][index]
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64">
      <circle cx="30" cy="31" r="27" fill="${accent}" opacity="0.24"/>
      <path d="M8 5l42 27-20 5 13 18-10 6-13-19-12 16z" fill="#ffffff" stroke="#050505" stroke-width="5" stroke-linejoin="round"/>
      <path d="M8 5l42 27-20 5 13 18-10 6-13-19-12 16z" fill="none" stroke="${accent}" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>
  `.trim()
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") ${hotspot} ${hotspot}, auto`
}

function legibleFontFamily(level: number): string | null {
  if (level === 1) return '"Accessibility Widget Lexend"'
  if (level === 2) return '"Accessibility Widget Atkinson Hyperlegible"'
  return null
}

function dynamicCss(state: AccessibilityWidgetState): string {
  const rules: string[] = []
  const scope = `#${HOST_WRAPPER_ID}`

  if (state.fontSize !== 0) {
    const pct = 100 + state.fontSize * FONT_STEP * 100
    // Set on wrapper so inheritance does the work — avoids compounding on nested elements
    rules.push(`${scope} { font-size: ${pct}% !important; }`)
  }
  if (state.lineHeight !== 0) {
    const lh = 1.5 + state.lineHeight * LH_STEP
    rules.push(`${scope} * { line-height: ${lh} !important; }`)
  }
  if (state.letterSpacing !== 0) {
    const ls = state.letterSpacing * LS_STEP
    rules.push(`${scope} * { letter-spacing: ${ls}em !important; }`)
  }
  if (state.textAlignment !== 'default') {
    rules.push(`${scope} * { text-align: ${state.textAlignment} !important; }`)
  }
  if (state.bigCursor !== 0) {
    const cursor = bigCursorValue(state.bigCursor)
    rules.push(`html, body, ${scope}, ${scope} *, .accessibility-widget-root, .accessibility-widget-root * { cursor: ${cursor} !important; }`)
  }
  return rules.join('\n')
}

let magnifierHandler: ((e: MouseEvent) => void) | null = null
let magnifierEl: HTMLDivElement | null = null

function normalizedMagnifierText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().slice(0, 200)
}

function collectMagnifierText(node: Node, parts: string[]): void {
  if (parts.join(' ').length >= 220) return
  if (node.nodeType === Node.TEXT_NODE) {
    const text = normalizedMagnifierText(node.textContent || '')
    if (text) parts.push(text)
    return
  }
  if (!(node instanceof Element)) return
  if (node.matches('script, style, noscript, template')) return
  if (node instanceof HTMLElement && (node.hidden || node.getAttribute('aria-hidden') === 'true')) return

  if (node instanceof HTMLSelectElement) {
    const selected = node.selectedOptions[0] ?? node.options[node.selectedIndex]
    const text = normalizedMagnifierText(selected?.textContent || node.value)
    if (text) parts.push(text)
    return
  }

  if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
    const text = normalizedMagnifierText(node.value || node.placeholder || node.getAttribute('aria-label') || '')
    if (text) parts.push(text)
    return
  }

  if (node instanceof HTMLImageElement) {
    const text = normalizedMagnifierText(node.alt || node.getAttribute('aria-label') || '')
    if (text) parts.push(text)
    return
  }

  for (const child of Array.from(node.childNodes)) collectMagnifierText(child, parts)
}

function magnifierTextForElement(element: Element): string {
  const target = element.closest('button, a, label, summary, [role="button"], [role="link"], select, input, textarea') ?? element
  const parts: string[] = []
  collectMagnifierText(target, parts)
  return normalizedMagnifierText(parts.join(' '))
}

function updateMagnifierAppearance(level: number): void {
  if (!magnifierEl) return
  const presets = [
    { fontSize: 18, maxWidth: 260, padding: '8px 12px' },
    { fontSize: 20, maxWidth: 300, padding: '10px 14px' },
    { fontSize: 22, maxWidth: 340, padding: '12px 16px' },
  ]
  const preset = presets[Math.max(0, Math.min(level - 1, presets.length - 1))]
  magnifierEl.style.fontSize = `${preset.fontSize}px`
  magnifierEl.style.maxWidth = `${preset.maxWidth}px`
  magnifierEl.style.padding = preset.padding
}

function enableMagnifier(level: number): void {
  if (magnifierHandler) {
    updateMagnifierAppearance(level)
    return
  }
  magnifierEl = document.createElement('div')
  magnifierEl.className = 'accessibility-widget-magnify-cursor'
  magnifierEl.style.display = 'none'
  document.body.appendChild(magnifierEl)
  updateMagnifierAppearance(level)

  magnifierHandler = (e: MouseEvent) => {
    if (!magnifierEl) return
    const el = document.elementFromPoint(e.clientX, e.clientY)
    if (!el || el.closest('.accessibility-widget-root') || el.closest('.accessibility-widget-magnify-cursor')) {
      magnifierEl.style.display = 'none'
      return
    }
    const text = magnifierTextForElement(el)
    if (!text) {
      magnifierEl.style.display = 'none'
      return
    }
    magnifierEl.textContent = text
    magnifierEl.style.display = 'block'
    const rect = magnifierEl.getBoundingClientRect()
    const gap = 16
    const margin = 8
    const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin)
    const maxTop = Math.max(margin, window.innerHeight - rect.height - margin)
    const left = Math.min(Math.max(e.clientX + gap, margin), maxLeft)
    const top = Math.min(Math.max(e.clientY + gap, margin), maxTop)
    magnifierEl.style.left = `${left}px`
    magnifierEl.style.top = `${top}px`
  }
  document.addEventListener('mousemove', magnifierHandler)
}

function disableMagnifier(): void {
  if (magnifierHandler) {
    document.removeEventListener('mousemove', magnifierHandler)
    magnifierHandler = null
  }
  if (magnifierEl) {
    magnifierEl.remove()
    magnifierEl = null
  }
}

let lensDiameter = 220
let lensZoom = 1.8

let lensEl: HTMLDivElement | null = null
let lensInner: HTMLDivElement | null = null
let lensCloneEl: HTMLElement | null = null
let lensMoveHandler: ((e: MouseEvent) => void) | null = null
let lensRafId: number | null = null
let lensTargetX = 0
let lensTargetY = 0
let lensCurX = 0
let lensCurY = 0
let lensVisible = false

function updateReadingLensAppearance(level: number): void {
  const presets = [
    { diameter: 220, zoom: 1.8 },
    { diameter: 240, zoom: 2.2 },
    { diameter: 260, zoom: 2.75 },
  ]
  const preset = presets[Math.max(0, Math.min(level - 1, presets.length - 1))]
  lensDiameter = preset.diameter
  lensZoom = preset.zoom
  if (!lensEl || !lensInner) return
  lensEl.style.width = `${lensDiameter}px`
  lensEl.style.height = `${lensDiameter}px`
  if (lensVisible) lensRafId ??= requestAnimationFrame(lensFrame)
}

function snapshotHostIntoLens(): void {
  if (!lensInner) return
  const host = document.getElementById(HOST_WRAPPER_ID)
  if (!host) return
  const rect = host.getBoundingClientRect()
  lensCloneEl = null
  lensInner.innerHTML = ''
  const clone = host.cloneNode(true) as HTMLElement
  clone.id = ''
  clone.style.position = 'absolute'
  clone.style.top = `${rect.top}px`
  clone.style.left = `${rect.left}px`
  clone.style.width = `${rect.width}px`
  clone.style.pointerEvents = 'none'
  // Strip interactive cloned widgets that would re-mount/clash
  clone.querySelectorAll('.accessibility-widget-root, .accessibility-widget-reading-lens, script, iframe').forEach(n => n.remove())
  // Mirror live input/textarea values onto the clone (cloneNode doesn't
  // copy the IDL value property, only the initial defaultValue attribute).
  const liveInputs = host.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
  const cloneInputs = clone.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')
  for (let i = 0; i < liveInputs.length && i < cloneInputs.length; i++) {
    const live = liveInputs[i]
    const dup = cloneInputs[i]
    if (live instanceof HTMLInputElement && dup instanceof HTMLInputElement) {
      dup.value = live.value
      if (live.type === 'checkbox' || live.type === 'radio') dup.checked = live.checked
    } else if (live instanceof HTMLTextAreaElement && dup instanceof HTMLTextAreaElement) {
      dup.value = live.value
    }
  }
  // Same for <select> — cloneNode doesn't preserve the selected option's
  // runtime state.
  const liveSelects = host.querySelectorAll<HTMLSelectElement>('select')
  const cloneSelects = clone.querySelectorAll<HTMLSelectElement>('select')
  for (let i = 0; i < liveSelects.length && i < cloneSelects.length; i++) {
    cloneSelects[i].selectedIndex = liveSelects[i].selectedIndex
  }
  lensCloneEl = clone
  lensInner.appendChild(clone)
}

function syncLensClonePosition(): void {
  if (!lensCloneEl) return
  const host = document.getElementById(HOST_WRAPPER_ID)
  if (!host) return
  const rect = host.getBoundingClientRect()
  lensCloneEl.style.top = `${rect.top}px`
  lensCloneEl.style.left = `${rect.left}px`
  lensCloneEl.style.width = `${rect.width}px`
}

function lensFrame(): void {
  lensRafId = null
  if (!lensEl || !lensInner) return
  const lensHalf = lensDiameter / 2
  lensCurX = Math.round(lensTargetX)
  lensCurY = Math.round(lensTargetY)
  syncLensClonePosition()
  lensEl.style.transform = `translate3d(${lensCurX - lensHalf}px, ${lensCurY - lensHalf}px, 0)`
  const tx = lensHalf - lensCurX * lensZoom
  const ty = lensHalf - lensCurY * lensZoom
  lensInner.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${lensZoom})`
}

function enableReadingLens(level: number): void {
  updateReadingLensAppearance(level)
  if (lensEl) {
    if (!lensVisible) snapshotHostIntoLens()
    return
  }
  lensEl = document.createElement('div')
  lensEl.className = 'accessibility-widget-reading-lens'
  lensEl.setAttribute('aria-hidden', 'true')
  lensEl.style.display = 'none'
  lensEl.style.left = '0'
  lensEl.style.top = '0'
  lensEl.style.willChange = 'transform'

  lensInner = document.createElement('div')
  lensInner.className = 'accessibility-widget-reading-lens-inner'
  lensInner.style.willChange = 'transform'
  lensEl.appendChild(lensInner)

  document.body.appendChild(lensEl)
  updateReadingLensAppearance(level)
  snapshotHostIntoLens()

  lensMoveHandler = (e: MouseEvent) => {
    if (!lensEl) return
    const target = e.target as Element | null
    if (target?.closest('.accessibility-widget-root')) {
      if (lensVisible) {
        lensEl.style.display = 'none'
        lensVisible = false
      }
      return
    }
    if (!lensVisible) {
      lensEl.style.display = 'block'
      lensTargetX = e.clientX
      lensTargetY = e.clientY
      lensCurX = e.clientX
      lensCurY = e.clientY
      lensVisible = true
      // Lens just became visible; re-snapshot now in case anything
      // changed while it was hidden over the widget UI.
      snapshotHostIntoLens()
    }
    lensTargetX = e.clientX
    lensTargetY = e.clientY
    lensRafId ??= requestAnimationFrame(lensFrame)
  }
  document.addEventListener('mousemove', lensMoveHandler, { passive: true })
}

function disableReadingLens(): void {
  if (lensMoveHandler) {
    document.removeEventListener('mousemove', lensMoveHandler)
    lensMoveHandler = null
  }
  if (lensRafId !== null) {
    cancelAnimationFrame(lensRafId)
    lensRafId = null
  }
  lensVisible = false
  if (lensEl) {
    lensEl.remove()
    lensEl = null
    lensInner = null
    lensCloneEl = null
  }
}

let readingMaskEl: HTMLDivElement | null = null
let readingMaskTopEl: HTMLDivElement | null = null
let readingMaskBottomEl: HTMLDivElement | null = null
let readingMaskMoveHandler: ((e: MouseEvent) => void) | null = null
let readingMaskResizeHandler: (() => void) | null = null
let readingMaskY = 0
let readingMaskLevel = 1

function updateReadingMaskAppearance(level: number): void {
  if (!readingMaskEl) return
  readingMaskLevel = level
  const preset = READING_MASK_PRESETS[presetIndex(level, READING_MASK_PRESETS.length)]
  readingMaskEl.dataset.level = String(level)
  readingMaskEl.style.setProperty('--accessibility-widget-reading-mask-opacity', String(preset.opacity))
  readingMaskEl.style.setProperty('--accessibility-widget-reading-mask-edge', preset.edge)
}

function positionReadingMask(y: number): void {
  if (!readingMaskTopEl || !readingMaskBottomEl) return
  const preset = READING_MASK_PRESETS[presetIndex(readingMaskLevel, READING_MASK_PRESETS.length)]
  const topHeight = Math.max(0, y - preset.band / 2)
  const bottomTop = Math.min(window.innerHeight, y + preset.band / 2)
  readingMaskTopEl.style.height = `${topHeight}px`
  readingMaskBottomEl.style.top = `${bottomTop}px`
  readingMaskBottomEl.style.height = `${Math.max(0, window.innerHeight - bottomTop)}px`
}

function enableReadingMask(level: number): void {
  if (!readingMaskEl) {
    readingMaskEl = document.createElement('div')
    readingMaskEl.className = 'accessibility-widget-reading-mask'
    readingMaskEl.setAttribute('aria-hidden', 'true')

    readingMaskTopEl = document.createElement('div')
    readingMaskTopEl.className = 'accessibility-widget-reading-mask-panel accessibility-widget-reading-mask-top'
    readingMaskBottomEl = document.createElement('div')
    readingMaskBottomEl.className = 'accessibility-widget-reading-mask-panel accessibility-widget-reading-mask-bottom'

    readingMaskEl.append(readingMaskTopEl, readingMaskBottomEl)
    document.body.appendChild(readingMaskEl)

    readingMaskY = window.innerHeight / 2
    readingMaskMoveHandler = (e: MouseEvent) => {
      readingMaskY = e.clientY
      positionReadingMask(readingMaskY)
    }
    readingMaskResizeHandler = () => positionReadingMask(readingMaskY)
    document.addEventListener('mousemove', readingMaskMoveHandler, { passive: true })
    window.addEventListener('resize', readingMaskResizeHandler, { passive: true })
  }
  updateReadingMaskAppearance(level)
  positionReadingMask(readingMaskY)
}

function disableReadingMask(): void {
  if (readingMaskMoveHandler) {
    document.removeEventListener('mousemove', readingMaskMoveHandler)
    readingMaskMoveHandler = null
  }
  if (readingMaskResizeHandler) {
    window.removeEventListener('resize', readingMaskResizeHandler)
    readingMaskResizeHandler = null
  }
  if (readingMaskEl) {
    readingMaskEl.remove()
    readingMaskEl = null
    readingMaskTopEl = null
    readingMaskBottomEl = null
  }
}

let readingGuideEl: HTMLDivElement | null = null
let readingGuidePointerEl: HTMLSpanElement | null = null
let readingGuideMoveHandler: ((e: MouseEvent) => void) | null = null
let readingGuideResizeHandler: (() => void) | null = null
let readingGuideX = 0
let readingGuideY = 0
let readingGuideLevel = 1

function updateReadingGuideAppearance(level: number): void {
  if (!readingGuideEl) return
  readingGuideLevel = level
  const preset = READING_GUIDE_PRESETS[presetIndex(level, READING_GUIDE_PRESETS.length)]
  readingGuideEl.dataset.level = String(level)
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-height', `${preset.height}px`)
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-border', `${preset.border}px`)
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-fill', preset.fill)
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-edge', preset.edge)
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-glow', preset.glow)
}

function positionReadingGuide(x: number, y: number): void {
  if (!readingGuideEl) return
  const preset = READING_GUIDE_PRESETS[presetIndex(readingGuideLevel, READING_GUIDE_PRESETS.length)]
  const totalHeight = preset.height + preset.border * 2
  const top = Math.max(0, Math.min(window.innerHeight - totalHeight, y - totalHeight / 2))
  readingGuideEl.style.top = `${top}px`
  readingGuideEl.style.setProperty('--accessibility-widget-reading-guide-x', `${x}px`)
}

function enableReadingGuide(level: number): void {
  if (!readingGuideEl) {
    readingGuideEl = document.createElement('div')
    readingGuideEl.className = 'accessibility-widget-reading-guide'
    readingGuideEl.setAttribute('aria-hidden', 'true')
    readingGuidePointerEl = document.createElement('span')
    readingGuidePointerEl.className = 'accessibility-widget-reading-guide-pointer'
    readingGuideEl.appendChild(readingGuidePointerEl)
    document.body.appendChild(readingGuideEl)

    readingGuideX = window.innerWidth / 2
    readingGuideY = window.innerHeight / 2
    readingGuideMoveHandler = (e: MouseEvent) => {
      readingGuideX = e.clientX
      readingGuideY = e.clientY
      positionReadingGuide(readingGuideX, readingGuideY)
    }
    readingGuideResizeHandler = () => positionReadingGuide(readingGuideX, readingGuideY)
    document.addEventListener('mousemove', readingGuideMoveHandler, { passive: true })
    window.addEventListener('resize', readingGuideResizeHandler, { passive: true })
  }
  updateReadingGuideAppearance(level)
  positionReadingGuide(readingGuideX, readingGuideY)
}

function disableReadingGuide(): void {
  if (readingGuideMoveHandler) {
    document.removeEventListener('mousemove', readingGuideMoveHandler)
    readingGuideMoveHandler = null
  }
  if (readingGuideResizeHandler) {
    window.removeEventListener('resize', readingGuideResizeHandler)
    readingGuideResizeHandler = null
  }
  if (readingGuideEl) {
    readingGuideEl.remove()
    readingGuideEl = null
    readingGuidePointerEl = null
  }
}

function setWrapperVar(wrapper: HTMLElement, name: string, value: string | null): void {
  if (value == null) wrapper.style.removeProperty(name)
  else wrapper.style.setProperty(name, value)
}

function syncWrapperVars(wrapper: HTMLElement, state: AccessibilityWidgetState): void {
  setWrapperVar(wrapper, '--accessibility-widget-legible-font-family', legibleFontFamily(state.legibleFonts))
  setWrapperVar(wrapper, '--accessibility-widget-legible-word-spacing', state.legibleFonts > 0 ? `${state.legibleFonts === 1 ? 0.03 : 0.015}em` : null)
  setWrapperVar(wrapper, '--accessibility-widget-legible-letter-spacing', state.legibleFonts > 0 ? `${state.legibleFonts === 1 ? 0.02 : 0.005}em` : null)
  setWrapperVar(wrapper, '--accessibility-widget-title-outline-width', state.highlightTitles > 0 ? `${state.highlightTitles}px` : null)
  setWrapperVar(wrapper, '--accessibility-widget-title-highlight-alpha', state.highlightTitles > 0 ? `${0.04 + state.highlightTitles * 0.03}` : null)
  setWrapperVar(wrapper, '--accessibility-widget-link-outline-width', state.highlightLinks > 0 ? `${state.highlightLinks}px` : null)
  setWrapperVar(wrapper, '--accessibility-widget-link-highlight-alpha', state.highlightLinks > 0 ? `${0.04 + state.highlightLinks * 0.03}` : null)
  setWrapperVar(wrapper, '--accessibility-widget-link-underline-width', state.highlightLinks > 0 ? `${state.highlightLinks}px` : null)

  const dark = state.darkContrast > 0 ? DARK_CONTRAST_PRESETS[state.darkContrast - 1] : null
  setWrapperVar(wrapper, '--accessibility-widget-dark-contrast-bg', dark?.bg ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-dark-contrast-text', dark?.text ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-dark-contrast-border', dark?.border ?? null)

  const light = state.lightContrast > 0 ? LIGHT_CONTRAST_PRESETS[state.lightContrast - 1] : null
  setWrapperVar(wrapper, '--accessibility-widget-light-contrast-bg', light?.bg ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-light-contrast-text', light?.text ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-light-contrast-border', light?.border ?? null)

  const high = state.highContrast > 0 ? HIGH_CONTRAST_PRESETS[state.highContrast - 1] : null
  setWrapperVar(wrapper, '--accessibility-widget-high-contrast-bg', high?.bg ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-high-contrast-text', high?.text ?? null)
  setWrapperVar(wrapper, '--accessibility-widget-high-contrast-border', high?.border ?? null)

  setWrapperVar(wrapper, '--accessibility-widget-monochrome-amount', state.monochrome > 0 ? '100%' : null)
  setWrapperVar(wrapper, '--accessibility-widget-invert-amount', state.invertColors > 0 ? '100%' : null)
  setWrapperVar(wrapper, '--accessibility-widget-color-blind-saturate', state.colorBlind > 0 ? `${1 - state.colorBlind * 0.1}` : null)
  setWrapperVar(wrapper, '--accessibility-widget-color-blind-contrast', state.colorBlind > 0 ? `${1 + state.colorBlind * 0.05}` : null)
}

export function applyEffects(state: AccessibilityWidgetState): void {
  if (typeof document === 'undefined') return
  const wrapper = document.getElementById(HOST_WRAPPER_ID)
  if (!wrapper) return

  const toggles: Array<[string, boolean]> = [
    ['accessibility-widget-effect-legible-fonts', state.legibleFonts > 0],
    ['accessibility-widget-effect-dyslexia', state.profile === 'dyslexia'],
    ['accessibility-widget-effect-highlight-titles', state.highlightTitles > 0],
    ['accessibility-widget-effect-highlight-links', state.highlightLinks > 0],
    ['accessibility-widget-effect-dark-contrast', state.darkContrast > 0],
    ['accessibility-widget-effect-light-contrast', state.lightContrast > 0],
    ['accessibility-widget-effect-high-contrast', state.highContrast > 0],
    ['accessibility-widget-effect-monochrome', state.monochrome > 0],
    ['accessibility-widget-effect-invert', state.invertColors > 0],
    ['accessibility-widget-effect-color-blind', state.colorBlind > 0],
    ['accessibility-widget-effect-hide-images', state.hideImages > 0],
    ['accessibility-widget-effect-off-animations', state.offAnimations > 0],
    ['accessibility-widget-effect-text-magnifier', state.textMagnifier > 0],
    ['accessibility-widget-effect-big-cursor', state.bigCursor > 0],
    ['accessibility-widget-effect-reading-mask-active', state.readingMask > 0],
    ['accessibility-widget-effect-reading-guide-active', state.readingGuide > 0],
    ['accessibility-widget-effect-keyboard-nav', state.profile === 'keyboard-navigation'],
  ]
  for (const [cls, on] of toggles) {
    wrapper.classList.toggle(cls, on)
  }
  syncWrapperVars(wrapper, state)
  if (state.colorBlind > 0) ensureColorBlindFilter()
  ensureHostStyle().textContent = dynamicCss(state)
  if (state.textMagnifier > 0) enableMagnifier(state.textMagnifier)
  else disableMagnifier()
  if (state.readingLens > 0) enableReadingLens(state.readingLens)
  else disableReadingLens()
  if (state.readingMask > 0) enableReadingMask(state.readingMask)
  else disableReadingMask()
  if (state.readingGuide > 0) enableReadingGuide(state.readingGuide)
  else disableReadingGuide()
}

export function clearEffects(): void {
  if (typeof document === 'undefined') return
  const wrapper = document.getElementById(HOST_WRAPPER_ID)
  if (wrapper) {
    for (const cls of Array.from(wrapper.classList)) {
      if (cls.startsWith('accessibility-widget-effect-')) wrapper.classList.remove(cls)
    }
  }
  const host = document.getElementById(HOST_STYLE_ID)
  if (host) host.textContent = ''
  document.getElementById(COLOR_BLIND_FILTER_ID)?.remove()
  disableMagnifier()
  disableReadingLens()
  disableReadingMask()
  disableReadingGuide()
}
