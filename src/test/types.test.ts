import { describe, it, expect } from 'vitest'
import { DEFAULT_STATE, STORAGE_KEY } from '../core/types'

describe('DEFAULT_STATE', () => {
  it('has null profile', () => {
    expect(DEFAULT_STATE.profile).toBeNull()
  })

  it('has all numeric fields at 0', () => {
    expect(DEFAULT_STATE.fontSize).toBe(0)
    expect(DEFAULT_STATE.lineHeight).toBe(0)
    expect(DEFAULT_STATE.letterSpacing).toBe(0)
    expect(DEFAULT_STATE.bigCursor).toBe(0)
    expect(DEFAULT_STATE.readingMask).toBe(0)
    expect(DEFAULT_STATE.readingGuide).toBe(0)
    expect(DEFAULT_STATE.hideImages).toBe(0)
    expect(DEFAULT_STATE.offAnimations).toBe(0)
  })

  it('has default text alignment', () => {
    expect(DEFAULT_STATE.textAlignment).toBe('default')
  })

  it('has all level-based flags at 0', () => {
    const levelKeys = [
      'legibleFonts', 'highlightTitles', 'highlightLinks', 'textMagnifier',
      'readingLens', 'bigCursor', 'readingMask', 'readingGuide',
      'darkContrast', 'lightContrast', 'highContrast', 'colorBlind',
      'monochrome', 'invertColors', 'hideImages', 'offAnimations',
    ] as const
    for (const key of levelKeys) {
      expect(DEFAULT_STATE[key], key).toBe(0)
    }
  })
})

describe('STORAGE_KEY', () => {
  it('is a non-empty string', () => {
    expect(typeof STORAGE_KEY).toBe('string')
    expect(STORAGE_KEY.length).toBeGreaterThan(0)
  })
})
