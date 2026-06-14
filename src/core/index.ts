import { applyEffects, clearEffects, ensureHostWrapper, unwrapHost } from './effects'
import { ICONS } from './icons'
import { getTranslations } from './i18n'
import { trapFocus, releaseFocus, injectSkipLink, removeSkipLink } from './keyboard'
import { collectPageStructure, renderPageStructureDialog } from './page-structure'
import { renderPanel } from './render'
import { buildStyles, DEFAULT_VARS, STYLE_ID } from './styles'
import { LEVEL_TOOLS, TOOL_MAX_LEVELS, type LevelToolKey } from './tool-levels'
import {
  DEFAULT_STATE,
  STORAGE_KEY,
  type AdjustmentLevel,
  type AccessibilityProfile,
  type AccessibilityWidgetConfig,
  type AccessibilityWidgetState,
  type AccessifyConfig,
  type AccessifyState,
  type ColorScheme,
  type Lang,
  type PageStructureData,
  type PageStructureItem,
  type PageStructureTab,
  type TextAlignment,
  type TriggerScheme,
  type WidgetSize,
} from './types'

export type {
  AccessibilityProfile,
  AccessibilityWidgetConfig,
  AccessibilityWidgetState,
  AccessifyConfig,
  AccessifyState,
  ColorScheme,
  Lang,
  PageStructureData,
  PageStructureItem,
  PageStructureTab,
  Position,
  TextAlignment,
  TriggerScheme,
  WidgetSize,
} from './types'

type ProfilePreset = Readonly<Partial<Omit<AccessibilityWidgetState, 'profile'>>>

function defineProfilePreset(preset: ProfilePreset): ProfilePreset {
  for (const key of LEVEL_TOOLS) {
    const value = preset[key]
    if (typeof value !== 'number') continue
    const maxLevel = TOOL_MAX_LEVELS[key]
    if (value < 0 || value > maxLevel) {
      throw new Error(`Invalid profile preset: ${key} level ${value} exceeds max ${maxLevel}`)
    }
  }
  return preset
}

const PROFILE_PRESETS: Record<AccessibilityProfile, ProfilePreset> = {
  'seizure-safe': defineProfilePreset({
    lightContrast: 2,
    monochrome: 1,
    hideImages: 1,
    offAnimations: 1,
  }),
  'vision-impaired': defineProfilePreset({
    fontSize: 4,
    lineHeight: 3,
    letterSpacing: 1,
    textMagnifier: 1,
    bigCursor: 3,
    readingGuide: 1,
    highContrast: 2,
  }),
  'adhd-friendly': defineProfilePreset({
    highlightTitles: 2,
    highlightLinks: 1,
    lineHeight: 2,
    readingMask: 2,
    readingGuide: 1,
    offAnimations: 1,
  }),
  'cognitive-disability': defineProfilePreset({
    legibleFonts: 2,
    fontSize: 2,
    lineHeight: 2,
    letterSpacing: 1,
    highlightTitles: 2,
    highlightLinks: 2,
    textMagnifier: 1,
    readingGuide: 1,
    textAlignment: 'left',
    offAnimations: 1,
  }),
  'keyboard-navigation': defineProfilePreset({
    highlightTitles: 1,
    highlightLinks: 2,
  }),
  'color-blind': defineProfilePreset({
    colorBlind: 1,
    highContrast: 1,
    highlightTitles: 1,
    highlightLinks: 2,
  }),
  'dyslexia': defineProfilePreset({
    legibleFonts: 1,
    fontSize: 1,
    lineHeight: 3,
    letterSpacing: 2,
    readingMask: 1,
    readingGuide: 1,
    textAlignment: 'left',
  }),
}

const COLOR_EXCLUSIVE: Array<keyof AccessibilityWidgetState> = [
  'darkContrast',
  'lightContrast',
  'highContrast',
  'monochrome',
  'invertColors',
]

const ALIGNMENT_LEVELS: TextAlignment[] = ['left', 'center', 'right', 'justify']

function normalizeSize(size: unknown): WidgetSize {
  return size === 'XL' ? 'XL' : 'S'
}

function setStyleVar(el: HTMLElement, name: string, value?: string): void {
  const normalized = value?.trim()
  if (normalized) el.style.setProperty(name, normalized)
  else el.style.removeProperty(name)
}

export class AccessibilityWidget {
  private readonly config: AccessibilityWidgetConfig
  private size: WidgetSize
  private lang: Lang
  private scheme: ColorScheme
  private state: AccessibilityWidgetState
  private root: HTMLDivElement | null = null
  private trigger: HTMLButtonElement | null = null
  private overlay: HTMLDivElement | null = null
  private panel: HTMLDivElement | null = null
  private structureDialog: HTMLDivElement | null = null
  private isOpen = false
  private pageStructureOpen = false
  private pageStructureTab: PageStructureTab = 'headings'

  constructor(config: AccessibilityWidgetConfig = {}) {
    this.config = {
      position: 'bottom-right',
      persistence: true,
      lang: 'en',
      colorScheme: 'light',
      ...config,
    }
    this.size = normalizeSize(this.config.size)
    this.lang = this.config.lang ?? 'en'
    this.scheme = this.config.colorScheme ?? 'light'
    this.state = this.loadState()
  }

  mount(): void {
    if (typeof document === 'undefined') return
    this.injectStyles()

    ensureHostWrapper()
    if (this.state.profile === 'keyboard-navigation') {
      injectSkipLink()
    }

    this.root = document.createElement('div')
    this.root.className = 'accessify-root'
    this.root.setAttribute('role', 'complementary')
    this.root.dataset.scheme = this.scheme === 'dark' ? 'dark' : 'light'
    this.applyTheme()

    this.trigger = document.createElement('button')
    this.trigger.className = 'accessify-trigger'
    this.trigger.type = 'button'
    this.trigger.dataset.position = this.config.position!
    this.trigger.setAttribute('aria-expanded', 'false')
    this.trigger.innerHTML = ICONS.trigger
    this.trigger.addEventListener('click', () => this.toggle())

    this.overlay = document.createElement('div')
    this.overlay.className = 'accessify-overlay'
    this.overlay.addEventListener('click', () => {
      if (this.pageStructureOpen) this.closePageStructure()
      else this.close()
    })

    this.panel = document.createElement('div')
    this.panel.className = 'accessify-panel'
    this.panel.setAttribute('role', 'dialog')
    this.panel.setAttribute('aria-modal', 'true')
    this.panel.dataset.position = this.config.position!
    this.panel.dataset.size = this.size
    this.panel.addEventListener('click', e => this.handlePanelClick(e))

    this.structureDialog = document.createElement('div')
    this.structureDialog.className = 'accessify-structure-layer'
    this.structureDialog.hidden = true
    this.structureDialog.addEventListener('click', e => this.handleStructureClick(e))

    this.root.append(this.trigger, this.overlay, this.panel, this.structureDialog)
    // Always append to <body> directly so the widget lives as a sibling
    // of #accessify-host and is never affected by the effects (font-size,
    // contrast, filters etc) applied to the page content wrapper.
    document.body.appendChild(this.root)

    this.update()
    applyEffects(this.state)
  }

  destroy(): void {
    clearEffects()
    unwrapHost()
    releaseFocus()
    removeSkipLink()
    if (this.root) {
      this.root.remove()
      this.root = null
    }
    this.trigger = null
    this.overlay = null
    this.panel = null
    this.structureDialog = null
  }

  open(): void {
    this.isOpen = true
    this.trigger?.setAttribute('aria-expanded', 'true')
    this.config.onOpen?.()
    this.update()
    if (this.panel && this.trigger) trapFocus(this.panel, this.trigger)
  }

  close(): void {
    this.isOpen = false
    this.pageStructureOpen = false
    this.trigger?.setAttribute('aria-expanded', 'false')
    this.config.onClose?.()
    releaseFocus()
    this.update()
  }

  toggle(): void {
    if (this.isOpen) this.close()
    else this.open()
  }

  reset(): void {
    this.pageStructureOpen = false
    this.state = { ...DEFAULT_STATE }
    this.saveState()
    applyEffects(this.state)
    this.config.onReset?.()
    this.update()
  }

  getState(): AccessibilityWidgetState {
    return { ...this.state }
  }

  getIsOpen(): boolean {
    return this.isOpen
  }

  setSize(size: WidgetSize): void {
    this.size = normalizeSize(size)
    if (this.panel) this.panel.dataset.size = this.size
    this.update()
  }

  setLang(lang: Lang): void {
    this.lang = lang
    this.update()
  }

  setTitle(title?: string): void {
    this.config.title = title
    this.updateWidgetLabels()
    this.update()
  }

  setAccentColor(accentColor?: string): void {
    this.config.accentColor = accentColor
    this.applyTheme()
  }

  setTheme(theme?: AccessibilityWidgetConfig['theme']): void {
    this.config.theme = theme
    this.applyTheme()
  }

  setColorScheme(scheme: ColorScheme): void {
    this.scheme = scheme
    this.applyScheme()
    // If trigger is on 'auto' (matches colorScheme), refresh it too so the
    // trigger color follows when colorScheme changes at runtime.
    if ((this.config.triggerScheme ?? 'auto') === 'auto') this.applyTriggerScheme()
  }

  private applyScheme(): void {
    if (!this.root) return
    this.root.dataset.scheme = this.scheme === 'dark' ? 'dark' : 'light'
  }

  private getTitle(): string {
    return this.config.title?.trim() || getTranslations(this.lang).title
  }

  private getTriggerLabel(title: string): string {
    return title.toLowerCase().includes('menu') ? `Open ${title}` : `Open ${title} menu`
  }

  private updateWidgetLabels(): void {
    const title = this.getTitle()
    this.root?.setAttribute('aria-label', title)
    this.trigger?.setAttribute('aria-label', this.getTriggerLabel(title))
    this.panel?.setAttribute('aria-label', `${title} settings`)
  }

  private applyTheme(): void {
    if (!this.root) return
    const accentColor = this.config.accentColor?.trim() || this.config.theme?.primary
    const t = this.config.theme
    setStyleVar(this.root, '--acc-primary', accentColor)
    setStyleVar(this.root, '--acc-primary-dark', accentColor)
    setStyleVar(this.root, '--acc-header-bg', accentColor)
    setStyleVar(this.root, '--acc-bg', t?.background)
    setStyleVar(this.root, '--acc-text', t?.text)
    this.applyTriggerScheme()
  }

  private applyTriggerScheme(): void {
    if (!this.root) return
    // Resolution chain:
    //   1. explicit config.triggerScheme other than 'auto' wins
    //   2. 'auto' (or unset) → match this.scheme (the resolved colorScheme,
    //      which itself defaults to 'light' when not passed)
    let resolved: 'dark' | 'light'
    const wanted = this.config.triggerScheme ?? 'auto'
    if (wanted === 'dark' || wanted === 'light') {
      resolved = wanted
    } else {
      resolved = this.scheme === 'dark' ? 'dark' : 'light'
    }
    if (resolved === 'dark') {
      this.root.style.setProperty('--acc-trigger-bg', '#0c0c0c')
      this.root.style.setProperty('--acc-trigger-icon', '#ffffff')
    } else {
      this.root.style.setProperty('--acc-trigger-bg', '#ffffff')
      this.root.style.setProperty('--acc-trigger-icon', '#0c0c0c')
    }
  }

  setTriggerScheme(scheme: TriggerScheme): void {
    this.config.triggerScheme = scheme
    this.applyTriggerScheme()
  }

  private handlePanelClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (target.closest<HTMLElement>('.accessify-close')) { this.close(); return }
    if (this.handleActionClick(target)) return
    if (this.handleSizeClick(target)) return
    if (this.handleProfileClick(target)) return
    this.handleToolClick(target)
  }

  private handleActionClick(target: HTMLElement): boolean {
    const btn = target.closest<HTMLElement>('[data-action]')
    if (!btn) return false
    if (btn.dataset.action === 'reset') this.reset()
    return true
  }

  private handleSizeClick(target: HTMLElement): boolean {
    const btn = target.closest<HTMLElement>('[data-size]')
    if (!btn || !this.panel?.contains(btn) || !btn.classList.contains('accessify-size-switch')) return false
    this.setSize(btn.dataset.size as WidgetSize)
    return true
  }

  private handleProfileClick(target: HTMLElement): boolean {
    const btn = target.closest<HTMLElement>('[data-profile]')
    if (!btn) return false
    this.toggleProfile(btn.dataset.profile as AccessibilityProfile)
    return true
  }

  private handleToolClick(target: HTMLElement): boolean {
    const btn = target.closest<HTMLElement>('[data-tool]')
    if (!btn) return false
    const key = btn.dataset.tool
    if (key === 'pageStructure') this.togglePageStructure()
    else if (key === 'textAlignment') this.cycleAlignment()
    else if (key && LEVEL_TOOLS.includes(key as LevelToolKey)) this.cycleLevel(key as LevelToolKey)
    return true
  }

  private handleStructureClick(e: MouseEvent): void {
    const target = e.target as HTMLElement
    if (target.closest<HTMLElement>('[data-structure-action="close"]')) {
      this.closePageStructure()
      return
    }

    const tab = target.closest<HTMLElement>('[data-structure-tab]')
    if (tab) {
      this.pageStructureTab = this.normalizeStructureTab(tab.dataset.structureTab)
      this.update()
      return
    }

    const item = target.closest<HTMLElement>('[data-structure-target]')
    if (item?.dataset.structureTarget) {
      this.jumpToStructureTarget(item.dataset.structureTarget)
    }
  }

  private normalizeStructureTab(tab: string | undefined): PageStructureTab {
    if (tab === 'landmarks' || tab === 'links') return tab
    return 'headings'
  }

  private togglePageStructure(): void {
    if (this.pageStructureOpen) this.closePageStructure()
    else this.openPageStructure()
  }

  private openPageStructure(): void {
    this.pageStructureTab = 'headings'
    this.pageStructureOpen = true
    this.update()
    this.trapStructureFocus()
  }

  private closePageStructure(): void {
    if (!this.pageStructureOpen) return
    this.pageStructureOpen = false
    releaseFocus()
    this.update()
    if (this.isOpen && this.panel && this.trigger) trapFocus(this.panel, this.trigger)
  }

  private trapStructureFocus(): void {
    const closeBtn = this.structureDialog?.querySelector<HTMLElement>('.accessify-structure-close')
    if (!this.structureDialog || !closeBtn) return
    trapFocus(this.structureDialog, closeBtn, () => this.closePageStructure())
  }

  private jumpToStructureTarget(id: string): void {
    const target = document.querySelector<HTMLElement>(`[data-accessify-structure-id="${id}"]`)
    if (!target) return
    this.closePageStructure()
    target.scrollIntoView({ block: 'center', behavior: 'smooth' })
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }

  private toggleProfile(id: AccessibilityProfile): void {
    if (this.state.profile === id) {
      this.state = { ...DEFAULT_STATE }
    } else {
      const preset = PROFILE_PRESETS[id] ?? {}
      this.state = { ...DEFAULT_STATE, profile: id, ...preset }
    }
    if (this.state.profile === 'keyboard-navigation') {
      injectSkipLink()
    } else {
      removeSkipLink()
    }
    this.commit()
  }

  private cycleLevel(key: LevelToolKey): void {
    const current = this.state[key]
    if (typeof current !== 'number') return
    const maxLevel = TOOL_MAX_LEVELS[key]
    const next = (current >= maxLevel ? 0 : current + 1) as AdjustmentLevel
    if (COLOR_EXCLUSIVE.includes(key) && next > 0) {
      for (const k of COLOR_EXCLUSIVE) {
        if (k !== key) (this.state as unknown as Record<string, unknown>)[k] = 0
      }
    }
    ;(this.state as unknown as Record<string, unknown>)[key] = next
    this.commit()
  }

  private cycleAlignment(): void {
    const currentIndex = ALIGNMENT_LEVELS.indexOf(this.state.textAlignment)
    this.state.textAlignment = ALIGNMENT_LEVELS[(currentIndex + 1) % ALIGNMENT_LEVELS.length]
    this.commit()
  }

  private commit(): void {
    this.saveState()
    applyEffects(this.state)
    this.update()
  }

  private update(): void {
    if (!this.panel) return
    this.updateWidgetLabels()
    this.panel.classList.toggle('open', this.isOpen)
    this.overlay?.classList.toggle('open', this.isOpen)
    const prevScroll = this.panel.querySelector<HTMLElement>('.accessify-body')?.scrollTop ?? 0
    this.panel.innerHTML = renderPanel(this.state, this.size, this.lang, {
      pageStructureOpen: this.pageStructureOpen,
      title: this.getTitle(),
    })
    const nextBody = this.panel.querySelector<HTMLElement>('.accessify-body')
    if (nextBody) nextBody.scrollTop = prevScroll
    this.renderStructureDialog()
    this.applyScheme()
  }

  private renderStructureDialog(): void {
    if (!this.structureDialog) return
    this.structureDialog.hidden = !this.pageStructureOpen
    this.structureDialog.classList.toggle('open', this.pageStructureOpen)
    if (!this.pageStructureOpen) {
      this.structureDialog.innerHTML = ''
      return
    }
    const t = getTranslations(this.lang)
    const data = collectPageStructure(t)
    this.structureDialog.innerHTML = renderPageStructureDialog(data, this.pageStructureTab, t, this.lang)
  }

  private injectStyles(): void {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = buildStyles(DEFAULT_VARS)
    document.head.appendChild(style)
  }

  private loadState(): AccessibilityWidgetState {
    if (!this.config.persistence) return { ...DEFAULT_STATE }
    if (typeof localStorage === 'undefined') return { ...DEFAULT_STATE }
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return this.normalizeState(JSON.parse(stored))
    } catch {
      // ignore
    }
    return { ...DEFAULT_STATE }
  }

  private saveState(): void {
    if (!this.config.persistence) return
    if (typeof localStorage === 'undefined') return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
    } catch {
      // ignore
    }
  }

  private normalizeState(raw: unknown): AccessibilityWidgetState {
    const source = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {}
    const state: AccessibilityWidgetState = { ...DEFAULT_STATE }

    if (source.profile === 'seizure-safe' ||
        source.profile === 'vision-impaired' ||
        source.profile === 'adhd-friendly' ||
        source.profile === 'cognitive-disability' ||
        source.profile === 'keyboard-navigation' ||
        source.profile === 'color-blind' ||
        source.profile === 'dyslexia') {
      state.profile = source.profile
    }

    for (const key of LEVEL_TOOLS) {
      state[key] = this.normalizeLevel(source[key], TOOL_MAX_LEVELS[key])
    }

    if (source.textAlignment === 'left' ||
        source.textAlignment === 'center' ||
        source.textAlignment === 'right' ||
        source.textAlignment === 'justify') {
      state.textAlignment = source.textAlignment
    }

    return state
  }

  private normalizeLevel(value: unknown, maxLevel: number): AdjustmentLevel {
    if (value === true) return 1
    if (value === false || value == null) return 0
    if (typeof value === 'number' && Number.isFinite(value)) {
      if (value <= 0) return 0
      return Math.min(maxLevel, Math.max(1, Math.round(value))) as AdjustmentLevel
    }
    return 0
  }
}

export { AccessibilityWidget as Accessify }
