import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  ensureHostWrapper,
  unwrapHost,
  applyEffects,
  clearEffects,
  HOST_WRAPPER_ID,
} from '../core/effects'
import { DEFAULT_STATE } from '../core/types'

function freshState() {
  return { ...DEFAULT_STATE }
}

beforeEach(() => {
  document.body.innerHTML = '<p id="content">hello</p>'
})

afterEach(() => {
  clearEffects()
  unwrapHost()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  const mockedElementFromPoint = (document as unknown as { elementFromPoint?: unknown }).elementFromPoint
  if (vi.isMockFunction(mockedElementFromPoint)) {
    delete (document as unknown as { elementFromPoint?: Document['elementFromPoint'] }).elementFromPoint
  }
  vi.unstubAllGlobals()
})

describe('ensureHostWrapper', () => {
  it('creates the wrapper div in body', () => {
    ensureHostWrapper()
    expect(document.getElementById(HOST_WRAPPER_ID)).not.toBeNull()
  })

  it('moves existing body children into wrapper', () => {
    ensureHostWrapper()
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    expect(wrapper.querySelector('#content')).not.toBeNull()
  })

  it('does not move .accessibility-widget-root elements into wrapper', () => {
    const root = document.createElement('div')
    root.className = 'accessibility-widget-root'
    document.body.appendChild(root)
    ensureHostWrapper()
    expect(document.body.contains(root)).toBe(true)
    expect(document.getElementById(HOST_WRAPPER_ID)!.contains(root)).toBe(false)
  })

  it('is idempotent — calling twice returns same wrapper', () => {
    const a = ensureHostWrapper()
    const b = ensureHostWrapper()
    expect(a).toBe(b)
    expect(document.querySelectorAll(`#${HOST_WRAPPER_ID}`)).toHaveLength(1)
  })
})

describe('unwrapHost', () => {
  it('restores children back to body and removes wrapper', () => {
    ensureHostWrapper()
    unwrapHost()
    expect(document.getElementById(HOST_WRAPPER_ID)).toBeNull()
    expect(document.getElementById('content')).not.toBeNull()
  })

  it('is a no-op when wrapper does not exist', () => {
    expect(() => unwrapHost()).not.toThrow()
  })
})

describe('applyEffects', () => {
  beforeEach(() => {
    ensureHostWrapper()
  })

  it('toggles accessibility-widget-effect-legible-fonts class and font variables', () => {
    const state = freshState()
    state.legibleFonts = 1
    applyEffects(state)
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    expect(wrapper.classList.contains('accessibility-widget-effect-legible-fonts')).toBe(true)
    expect(wrapper.style.getPropertyValue('--accessibility-widget-legible-font-family')).toBe('"Accessibility Widget Lexend"')
  })

  it('uses Atkinson Hyperlegible for the second legible font level', () => {
    const state = freshState()
    state.legibleFonts = 2
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.style.getPropertyValue('--accessibility-widget-legible-font-family')).toBe('"Accessibility Widget Atkinson Hyperlegible"')
  })

  it('removes accessibility-widget-effect-legible-fonts when false', () => {
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    wrapper.classList.add('accessibility-widget-effect-legible-fonts')
    applyEffects(freshState())
    expect(wrapper.classList.contains('accessibility-widget-effect-legible-fonts')).toBe(false)
  })

  it('toggles accessibility-widget-effect-highlight-titles', () => {
    const state = freshState()
    state.highlightTitles = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-highlight-titles')).toBe(true)
  })

  it('toggles accessibility-widget-effect-highlight-links', () => {
    const state = freshState()
    state.highlightLinks = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-highlight-links')).toBe(true)
  })

  it('toggles accessibility-widget-effect-dark-contrast', () => {
    const state = freshState()
    state.darkContrast = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-dark-contrast')).toBe(true)
  })

  it('toggles accessibility-widget-effect-light-contrast', () => {
    const state = freshState()
    state.lightContrast = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-light-contrast')).toBe(true)
  })

  it('toggles accessibility-widget-effect-high-contrast', () => {
    const state = freshState()
    state.highContrast = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-high-contrast')).toBe(true)
  })

  it('toggles accessibility-widget-effect-monochrome', () => {
    const state = freshState()
    state.monochrome = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-monochrome')).toBe(true)
  })

  it('toggles accessibility-widget-effect-invert for invertColors', () => {
    const state = freshState()
    state.invertColors = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-invert')).toBe(true)
  })

  it('toggles accessibility-widget-effect-color-blind and injects SVG filter', () => {
    const state = freshState()
    state.colorBlind = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-color-blind')).toBe(true)
    expect(document.getElementById('accessibility-widget-protanopia-filter')).not.toBeNull()
  })

  it('toggles accessibility-widget-effect-hide-images', () => {
    const state = freshState()
    state.hideImages = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-hide-images')).toBe(true)
  })

  it('toggles accessibility-widget-effect-off-animations', () => {
    const state = freshState()
    state.offAnimations = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-off-animations')).toBe(true)
  })

  it('toggles accessibility-widget-effect-dyslexia for dyslexia profile', () => {
    const state = freshState()
    state.profile = 'dyslexia'
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-dyslexia')).toBe(true)
  })

  it('injects dynamic font-size CSS for non-zero fontSize', () => {
    const state = freshState()
    state.fontSize = 2
    applyEffects(state)
    const style = document.getElementById('accessibility-widget-host-effects') as HTMLStyleElement
    expect(style?.textContent).toContain('font-size:')
  })

  it('injects custom cursor CSS for big cursor', () => {
    const state = freshState()
    state.bigCursor = 2
    applyEffects(state)
    const style = document.getElementById('accessibility-widget-host-effects') as HTMLStyleElement
    expect(style?.textContent).toContain('cursor:')
    expect(style?.textContent).toContain('data:image/svg+xml')
    expect(document.getElementById(HOST_WRAPPER_ID)!.classList.contains('accessibility-widget-effect-big-cursor')).toBe(true)
  })

  it('does nothing when wrapper is absent', () => {
    unwrapHost()
    expect(() => applyEffects(freshState())).not.toThrow()
  })

  it('normalizes text magnifier content from form controls', () => {
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    wrapper.innerHTML = `
      <section id="controls">
        <label>Position
          <select>
            <option selected>Bottom right</option>
            <option>Bottom left</option>
            <option>Top right</option>
          </select>
        </label>
        <label>Size
          <select>
            <option>Small</option>
            <option selected>Medium</option>
            <option>Large</option>
          </select>
        </label>
      </section>
    `
    Object.defineProperty(document, 'elementFromPoint', {
      configurable: true,
      value: vi.fn(() => wrapper.querySelector('#controls')),
    })

    const state = freshState()
    state.textMagnifier = 1
    applyEffects(state)
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 140, bubbles: true }))

    const magnifierText = document.querySelector('.accessibility-widget-magnify-cursor')?.textContent
    expect(magnifierText).toContain('Position Bottom right Size Medium')
    expect(magnifierText).not.toContain('Bottom rightBottom left')
    expect(magnifierText).not.toContain('SmallMediumLarge')
  })

  it('mounts reading lens element when readingLens is true', () => {
    const state = freshState()
    state.readingLens = 1
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-lens')).not.toBeNull()
    expect(document.querySelector('.accessibility-widget-reading-lens-inner')).not.toBeNull()
  })

  it('removes reading lens element when readingLens turns off', () => {
    const state = freshState()
    state.readingLens = 1
    applyEffects(state)
    state.readingLens = 0
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-lens')).toBeNull()
  })

  it('mounts reading mask element when readingMask is true', () => {
    const state = freshState()
    state.readingMask = 1
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-mask')).not.toBeNull()
    expect(document.querySelectorAll('.accessibility-widget-reading-mask-panel')).toHaveLength(2)
  })

  it('removes reading mask element when readingMask turns off', () => {
    const state = freshState()
    state.readingMask = 1
    applyEffects(state)
    state.readingMask = 0
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-mask')).toBeNull()
  })

  it('mounts reading guide element when readingGuide is true', () => {
    const state = freshState()
    state.readingGuide = 1
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-guide')).not.toBeNull()
    expect(document.querySelector('.accessibility-widget-reading-guide-pointer')).not.toBeNull()
  })

  it('removes reading guide element when readingGuide turns off', () => {
    const state = freshState()
    state.readingGuide = 1
    applyEffects(state)
    state.readingGuide = 0
    applyEffects(state)
    expect(document.querySelector('.accessibility-widget-reading-guide')).toBeNull()
  })

  it('does NOT add accessibility-widget-reading-lens class to wrapper (avoids style collision with the lens element)', () => {
    const state = freshState()
    state.readingLens = 1
    applyEffects(state)
    expect(document.getElementById(HOST_WRAPPER_ID)?.classList.contains('accessibility-widget-reading-lens')).toBe(false)
  })

  it('reading lens mirrors live input values into the clone', () => {
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    const input = document.createElement('input')
    input.type = 'text'
    input.defaultValue = ''      // attribute is empty
    wrapper.appendChild(input)
    input.value = 'typed text'   // IDL value differs from attribute

    const state = freshState()
    state.readingLens = 1
    applyEffects(state)

    const lensInput = document.querySelector<HTMLInputElement>('.accessibility-widget-reading-lens-inner input')
    expect(lensInput).not.toBeNull()
    expect(lensInput!.value).toBe('typed text')
  })

  it('reading lens mirrors live <select> selected index into the clone', () => {
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    const select = document.createElement('select')
    select.innerHTML = '<option>a</option><option>b</option><option>c</option>'
    wrapper.appendChild(select)
    select.selectedIndex = 2

    const state = freshState()
    state.readingLens = 1
    applyEffects(state)

    const lensSelect = document.querySelector<HTMLSelectElement>('.accessibility-widget-reading-lens-inner select')
    expect(lensSelect).not.toBeNull()
    expect(lensSelect!.selectedIndex).toBe(2)
  })

  it('keeps the reading lens clone stable while visible', () => {
    vi.stubGlobal('requestAnimationFrame', () => 1)
    vi.stubGlobal('cancelAnimationFrame', () => undefined)

    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    wrapper.innerHTML = '<article><h1>Stable heading</h1><p>Stable lens content</p></article>'

    const state = freshState()
    state.readingLens = 1
    applyEffects(state)

    wrapper.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 140, bubbles: true }))
    const visibleClone = document.querySelector('.accessibility-widget-reading-lens-inner')?.firstElementChild
    expect(visibleClone).not.toBeNull()

    wrapper.dispatchEvent(new MouseEvent('mousemove', { clientX: 124, clientY: 146, bubbles: true }))
    applyEffects(state)

    const cloneAfterMoveAndEffect = document.querySelector('.accessibility-widget-reading-lens-inner')?.firstElementChild
    expect(cloneAfterMoveAndEffect).toBe(visibleClone)
  })

  it('does not reset the reading lens transform during effect commits', () => {
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => undefined)

    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    wrapper.innerHTML = '<article><h1>Stable heading</h1><p>Stable lens content</p></article>'

    const state = freshState()
    state.readingLens = 1
    applyEffects(state)
    wrapper.dispatchEvent(new MouseEvent('mousemove', { clientX: 120, clientY: 140, bubbles: true }))

    const inner = document.querySelector<HTMLElement>('.accessibility-widget-reading-lens-inner')
    expect(inner?.style.transform).toContain('translate3d')
    const transformBeforeEffectCommit = inner?.style.transform

    applyEffects(state)

    expect(document.querySelector<HTMLElement>('.accessibility-widget-reading-lens-inner')?.style.transform).toBe(transformBeforeEffectCommit)
  })
})

describe('clearEffects', () => {
  beforeEach(() => {
    ensureHostWrapper()
  })

  it('removes all accessibility-widget-effect-* classes from wrapper', () => {
    const state = freshState()
    state.legibleFonts = 1
    state.darkContrast = 1
    applyEffects(state)
    clearEffects()
    const wrapper = document.getElementById(HOST_WRAPPER_ID)!
    const accessibilityWidgetEffectClasses = Array.from(wrapper.classList).filter(c => c.startsWith('accessibility-widget-effect-'))
    expect(accessibilityWidgetEffectClasses).toHaveLength(0)
  })

  it('clears dynamic style content', () => {
    const state = freshState()
    state.fontSize = 3
    applyEffects(state)
    clearEffects()
    const style = document.getElementById('accessibility-widget-host-effects') as HTMLStyleElement
    expect(style?.textContent ?? '').toBe('')
  })

  it('removes the color-blind SVG filter element', () => {
    const state = freshState()
    state.colorBlind = 1
    applyEffects(state)
    clearEffects()
    expect(document.getElementById('accessibility-widget-protanopia-filter')).toBeNull()
  })

  it('removes reading mask and guide overlays', () => {
    const state = freshState()
    state.readingMask = 1
    state.readingGuide = 1
    applyEffects(state)
    clearEffects()
    expect(document.querySelector('.accessibility-widget-reading-mask')).toBeNull()
    expect(document.querySelector('.accessibility-widget-reading-guide')).toBeNull()
  })

  it('is safe to call when nothing was applied', () => {
    expect(() => clearEffects()).not.toThrow()
  })
})
