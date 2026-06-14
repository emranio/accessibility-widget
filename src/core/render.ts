import { ICONS } from './icons'
import { getTranslations } from './i18n'
import { TEXT_ALIGNMENT_MAX_LEVEL, TOOL_MAX_LEVELS, type LevelToolKey } from './tool-levels'
import type { AccessibilityProfile, AccessibilityWidgetState, Lang, TextAlignment, WidgetSize } from './types'

function sizeSwitch(active: WidgetSize, label: string): string {
  const isXl = active === 'XL'
  const nextSize: WidgetSize = isXl ? 'S' : 'XL'
  return `
    <button type="button" class="accessibility-widget-size-switch" role="switch" data-size="${nextSize}" aria-checked="${isXl}" aria-label="${label}">
      <span class="accessibility-widget-size-switch-track" aria-hidden="true">
        <span class="accessibility-widget-size-switch-option accessibility-widget-size-switch-option--s">S</span>
        <span class="accessibility-widget-size-switch-option accessibility-widget-size-switch-option--l">L</span>
        <span class="accessibility-widget-size-switch-thumb"></span>
      </span>
    </button>
  `
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function profileCard(id: AccessibilityProfile, label: string, icon: string, active: boolean): string {
  return `
    <button class="accessibility-widget-card" type="button" data-profile="${id}" aria-pressed="${active}">
      <span class="icon">${icon}</span>
      <span class="label">${label}</span>
    </button>
  `
}

function levelBars(level: number, maxLevel: number): string {
  if (maxLevel <= 1) return ''
  return `
    <div class="accessibility-widget-levels" aria-hidden="true">
      ${Array.from({ length: maxLevel }, (_, index) => `
        <span class="accessibility-widget-level${index + 1 === level ? ' active' : ''}"></span>
      `).join('')}
    </div>
  `
}

function toolTile(opts: {
  key: string; icon: string; label: string; level: number; maxLevel: number
}): string {
  const { key, icon, label, level, maxLevel } = opts
  const ariaLevel = maxLevel <= 1
    ? (level > 0 ? 'On' : 'Off')
    : (level > 0 ? `Level ${level} of ${maxLevel}` : 'Off')
  return `
    <button class="accessibility-widget-tile" type="button" data-tool="${key}" data-level="${level}" data-max-level="${maxLevel}" aria-pressed="${level > 0}" aria-label="${label}, ${ariaLevel}">
      <span class="icon">${icon}</span>
      <span class="label">${label}</span>
      ${levelBars(level, maxLevel)}
    </button>
  `
}

function adjustmentTile(state: AccessibilityWidgetState, key: LevelToolKey, icon: string, label: string): string {
  return toolTile({ key, icon, label, level: state[key] as number, maxLevel: TOOL_MAX_LEVELS[key] })
}

function legibleFontsTile(state: AccessibilityWidgetState, t: ReturnType<typeof getTranslations>): string {
  const isDyslexiaFriendly = state.legibleFonts === 1
  return adjustmentTile(
    state,
    'legibleFonts',
    isDyslexiaFriendly ? ICONS.dyslexiaFriendlyFont : ICONS.legibleFonts,
    isDyslexiaFriendly ? t.dyslexiaFriendly : t.legibleFonts,
  )
}

function alignmentLevel(active: TextAlignment): number {
  if (active === 'left') return 1
  if (active === 'center') return 2
  if (active === 'right') return 3
  if (active === 'justify') return 4
  return 0
}

function alignmentIcon(active: TextAlignment): string {
  if (active === 'center') return ICONS.textAlignCenter
  if (active === 'right') return ICONS.textAlignRight
  if (active === 'justify') return ICONS.textAlignJustify
  return ICONS.textAlignLeft
}


export function renderPanel(
  state: AccessibilityWidgetState,
  size: WidgetSize,
  lang: Lang = 'en',
  options: { pageStructureOpen?: boolean; title?: string } = {},
): string {
  const t = getTranslations(lang)
  const title = escapeHtml(options.title?.trim() || t.title)

  const PROFILES: Array<{ id: AccessibilityProfile; label: string; icon: string }> = [
    { id: 'seizure-safe',         label: t.seizureSafe,         icon: ICONS.seizure },
    { id: 'vision-impaired',      label: t.visionImpaired,      icon: ICONS.vision },
    { id: 'adhd-friendly',        label: t.adhdFriendly,        icon: ICONS.adhd },
    { id: 'cognitive-disability', label: t.cognitiveDisability,  icon: ICONS.cognitive },
    { id: 'keyboard-navigation',  label: t.keyboardNavigation,  icon: ICONS.keyboard },
    { id: 'color-blind',          label: t.colorBlind,          icon: ICONS.colorBlind },
    { id: 'dyslexia',             label: t.dyslexia,            icon: ICONS.dyslexia },
  ]

  const dir = lang === 'ar' ? ' dir="rtl"' : ''

  return `
    <div class="accessibility-widget-header"${dir}>
      <div class="accessibility-widget-header-left">
        <div class="accessibility-widget-header-icon">${ICONS.wheelchair}</div>
        <div class="accessibility-widget-header-text">
          <div class="accessibility-widget-header-title">${title}</div>
          <div class="accessibility-widget-header-sub">${t.subtitle}</div>
        </div>
      </div>
      <div class="accessibility-widget-header-actions">
        <button type="button" class="accessibility-widget-icon-btn accessibility-widget-close" aria-label="${t.close}">${ICONS.close}</button>
      </div>
    </div>

    <div class="accessibility-widget-body"${dir}>

      <div class="accessibility-widget-section accessibility-widget-section--compact">
        <div class="accessibility-widget-section-head">
          <span class="accessibility-widget-section-title">${t.widgetSize}</span>
          ${sizeSwitch(size, t.xlSize)}
        </div>
      </div>

      <div class="accessibility-widget-section">
        <div class="accessibility-widget-section-head">
          <span class="accessibility-widget-section-title">${t.profiles}</span>
        </div>
        <div class="accessibility-widget-grid">
          ${PROFILES.map(p => profileCard(p.id, p.label, p.icon, state.profile === p.id)).join('')}
        </div>
      </div>

      <div class="accessibility-widget-section">
        <div class="accessibility-widget-section-head">
          <span class="accessibility-widget-section-title">${t.contentAdjustments}</span>
        </div>
        <div class="accessibility-widget-grid accessibility-widget-grid-3">
          ${legibleFontsTile(state, t)}
          ${adjustmentTile(state, 'highlightTitles', ICONS.highlightTitles,t.highlightTitles)}
          ${adjustmentTile(state, 'fontSize',        ICONS.fontSizing,     t.fontSize)}
          ${adjustmentTile(state, 'textMagnifier',   ICONS.textMagnifier,  t.textMagnifier)}
          ${adjustmentTile(state, 'highlightLinks',  ICONS.highlightLinks, t.highlightLinks)}
          ${adjustmentTile(state, 'readingLens',     ICONS.readingLens,    t.readingLens)}
          ${adjustmentTile(state, 'bigCursor',       ICONS.bigCursor,      t.bigCursor)}
          ${adjustmentTile(state, 'readingMask',     ICONS.readingMask,    t.readingMask)}
          ${adjustmentTile(state, 'readingGuide',    ICONS.readingGuide,   t.readingGuide)}
          ${toolTile({ key: 'pageStructure', icon: ICONS.pageStructure, label: t.pageStructure, level: options.pageStructureOpen ? 1 : 0, maxLevel: 1 })}
          ${adjustmentTile(state, 'lineHeight',      ICONS.lineHeight,     t.lineHeight)}
          ${adjustmentTile(state, 'letterSpacing',   ICONS.letterSpacing,  t.letterSpacing)}
          ${toolTile({ key: 'textAlignment', icon: alignmentIcon(state.textAlignment), label: t.textAlign, level: alignmentLevel(state.textAlignment), maxLevel: TEXT_ALIGNMENT_MAX_LEVEL })}
        </div>
      </div>

      <div class="accessibility-widget-section">
        <div class="accessibility-widget-section-head">
          <span class="accessibility-widget-section-title">${t.colorAdjustments}</span>
        </div>
        <div class="accessibility-widget-grid accessibility-widget-grid-3">
          ${adjustmentTile(state, 'darkContrast', ICONS.darkContrast, t.darkContrast)}
          ${adjustmentTile(state, 'lightContrast', ICONS.lightContrast, t.lightContrast)}
          ${adjustmentTile(state, 'highContrast', ICONS.highContrast, t.highContrast)}
          ${adjustmentTile(state, 'monochrome', ICONS.monochrome, t.monochrome)}
          ${adjustmentTile(state, 'invertColors', ICONS.invertColors, t.invertColors)}
          ${adjustmentTile(state, 'colorBlind', ICONS.colorBlindVisual, t.colorBlind)}
          ${adjustmentTile(state, 'hideImages', ICONS.hideImages, t.hideImages)}
          ${adjustmentTile(state, 'offAnimations', ICONS.offAnimations, t.offAnimations)}
        </div>
      </div>

    </div>

    <div class="accessibility-widget-reset-bar"${dir}>
      <button type="button" class="accessibility-widget-reset-btn" data-action="reset" aria-label="${t.resetAll}">
        ${ICONS.reset}
        ${t.resetAll}
      </button>
    </div>
  `
}
