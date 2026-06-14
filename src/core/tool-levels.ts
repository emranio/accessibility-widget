import type { AccessibilityWidgetState } from './types'

export type ToolMaxLevel = 1 | 2 | 3 | 4

export const TOOL_MAX_LEVELS = {
  legibleFonts: 2,
  highlightTitles: 2,
  fontSize: 4,
  textMagnifier: 1,
  highlightLinks: 2,
  readingLens: 1,
  bigCursor: 3,
  readingMask: 3,
  readingGuide: 1,
  lineHeight: 3,
  letterSpacing: 3,
  darkContrast: 3,
  lightContrast: 3,
  highContrast: 3,
  monochrome: 1,
  invertColors: 1,
  colorBlind: 1,
  hideImages: 1,
  offAnimations: 1,
} as const satisfies Readonly<Partial<Record<keyof AccessibilityWidgetState, ToolMaxLevel>>>

export type LevelToolKey = keyof typeof TOOL_MAX_LEVELS

export const LEVEL_TOOLS = Object.keys(TOOL_MAX_LEVELS) as LevelToolKey[]

export const TEXT_ALIGNMENT_MAX_LEVEL = 4
