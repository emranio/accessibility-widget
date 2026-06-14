export type WidgetSize = 'S' | 'XL'
export type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
export type TextAlignment = 'left' | 'center' | 'right' | 'justify' | 'default'
export type AdjustmentLevel = 0 | 1 | 2 | 3 | 4
export type PageStructureTab = 'headings' | 'landmarks' | 'links'

export type AccessibilityProfile =
  | 'seizure-safe'
  | 'vision-impaired'
  | 'adhd-friendly'
  | 'cognitive-disability'
  | 'keyboard-navigation'
  | 'color-blind'
  | 'dyslexia'

export type ColorScheme = 'light' | 'dark'
export type Lang = 'en' | 'ar' | 'es' | 'fr' | 'de' | 'pt'

export type TriggerScheme = 'auto' | 'dark' | 'light'

export interface AccessibilityWidgetConfig {
  title?: string
  accentColor?: string
  position?: Position
  size?: WidgetSize
  theme?: {
    primary?: string
    background?: string
    text?: string
  }
  colorScheme?: ColorScheme
  /**
   * Trigger button color preset.
   * - 'auto'  — matches colorScheme (default)
   * - 'dark'  — black background, white icon
   * - 'light' — white background, dark icon
   */
  triggerScheme?: TriggerScheme
  persistence?: boolean
  lang?: Lang
  onOpen?: () => void
  onClose?: () => void
  onReset?: () => void
}

export interface AccessibilityWidgetState {
  profile: AccessibilityProfile | null
  fontSize: AdjustmentLevel
  lineHeight: AdjustmentLevel
  letterSpacing: AdjustmentLevel
  textAlignment: TextAlignment
  legibleFonts: AdjustmentLevel
  highlightTitles: AdjustmentLevel
  highlightLinks: AdjustmentLevel
  textMagnifier: AdjustmentLevel
  readingLens: AdjustmentLevel
  bigCursor: AdjustmentLevel
  readingMask: AdjustmentLevel
  readingGuide: AdjustmentLevel
  darkContrast: AdjustmentLevel
  lightContrast: AdjustmentLevel
  highContrast: AdjustmentLevel
  colorBlind: AdjustmentLevel
  monochrome: AdjustmentLevel
  invertColors: AdjustmentLevel
  hideImages: AdjustmentLevel
  offAnimations: AdjustmentLevel
}

export interface PageStructureItem {
  id: string
  label: string
  meta: string
  depth?: number
  external?: boolean
}

export interface PageStructureData {
  headings: PageStructureItem[]
  landmarks: PageStructureItem[]
  links: PageStructureItem[]
}

export const DEFAULT_STATE: AccessibilityWidgetState = {
  profile: null,
  fontSize: 0,
  lineHeight: 0,
  letterSpacing: 0,
  textAlignment: 'default',
  legibleFonts: 0,
  highlightTitles: 0,
  highlightLinks: 0,
  textMagnifier: 0,
  readingLens: 0,
  bigCursor: 0,
  readingMask: 0,
  readingGuide: 0,
  darkContrast: 0,
  lightContrast: 0,
  highContrast: 0,
  colorBlind: 0,
  monochrome: 0,
  invertColors: 0,
  hideImages: 0,
  offAnimations: 0,
}

export const STORAGE_KEY = 'react-accessibility-widget-state'
