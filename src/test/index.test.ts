import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { AccessibilityWidget } from '../core/index'
import { DEFAULT_STATE, STORAGE_KEY, type AccessibilityProfile, type AccessibilityWidgetState } from '../core/types'
import { HOST_WRAPPER_ID } from '../core/effects'

beforeEach(() => {
  document.body.innerHTML = '<p id="page-content">page</p>'
  localStorage.clear()
})

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

const EXPECTED_PROFILE_PRESETS = {
  'seizure-safe': {
    lightContrast: 2,
    monochrome: 1,
    hideImages: 1,
    offAnimations: 1,
  },
  'vision-impaired': {
    fontSize: 4,
    lineHeight: 3,
    letterSpacing: 1,
    textMagnifier: 1,
    bigCursor: 3,
    readingGuide: 1,
    highContrast: 2,
  },
  'adhd-friendly': {
    highlightTitles: 2,
    highlightLinks: 1,
    lineHeight: 2,
    readingMask: 2,
    readingGuide: 1,
    offAnimations: 1,
  },
  'cognitive-disability': {
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
  },
  'keyboard-navigation': {
    highlightTitles: 1,
    highlightLinks: 2,
  },
  'color-blind': {
    colorBlind: 1,
    highContrast: 1,
    highlightTitles: 1,
    highlightLinks: 2,
  },
  'dyslexia': {
    legibleFonts: 1,
    fontSize: 1,
    lineHeight: 3,
    letterSpacing: 2,
    readingMask: 1,
    readingGuide: 1,
    textAlignment: 'left',
  },
} satisfies Record<AccessibilityProfile, Partial<AccessibilityWidgetState>>

describe('Accessibility Widget — constructor', () => {
  it('applies defaults when no config provided', () => {
    const a = new AccessibilityWidget()
    expect(a.getState()).toEqual(DEFAULT_STATE)
    a.destroy()
  })

  it('loads persisted state from localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_STATE, fontSize: 3 }))
    const a = new AccessibilityWidget()
    expect(a.getState().fontSize).toBe(3)
    a.destroy()
  })

  it('ignores localStorage when persistence is false', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_STATE, fontSize: 5 }))
    const a = new AccessibilityWidget({ persistence: false })
    expect(a.getState().fontSize).toBe(0)
    a.destroy()
  })

  it('uses default size S', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector<HTMLElement>('.accessibility-widget-panel')
    expect(panel?.dataset.size).toBe('S')
    a.destroy()
  })

  it('respects custom size', () => {
    const a = new AccessibilityWidget({ size: 'XL' })
    a.mount()
    const panel = document.querySelector<HTMLElement>('.accessibility-widget-panel')
    expect(panel?.dataset.size).toBe('XL')
    a.destroy()
  })
})

describe('Accessibility Widget — mount / destroy', () => {
  it('appends accessibility-widget-root to body', () => {
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.querySelector('.accessibility-widget-root')).not.toBeNull()
    a.destroy()
  })

  it('uses the custom trigger icon', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const icon = document.querySelector<SVGSVGElement>('.accessibility-widget-trigger svg')
    expect(icon?.getAttribute('viewBox')).toBe('0 0 100 131.3')
    expect(icon?.getAttribute('xml:space')).toBe('preserve')
    expect(icon?.getAttribute('part')).toBe('accessibility-widget-trigger-icon-svg')
    expect(icon?.getAttribute('data-testid')).toBe('accessibility-widget-base-icon-svg')
    expect(icon?.querySelector('circle')?.getAttribute('style')).toBe('fill:#fff')
    a.destroy()
  })

  it('creates host wrapper when no target given', () => {
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.getElementById(HOST_WRAPPER_ID)).not.toBeNull()
    a.destroy()
  })

  it('always creates host wrapper so effects work when the page already has extra containers', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.getElementById(HOST_WRAPPER_ID)).not.toBeNull()
    a.destroy()
  })

  it('injects the styles tag into head', () => {
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.getElementById('accessibility-widget-styles')).not.toBeNull()
    a.destroy()
  })

  it('removes accessibility-widget-root on destroy', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.destroy()
    expect(document.querySelector('.accessibility-widget-root')).toBeNull()
  })

  it('removes host wrapper on destroy', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.destroy()
    expect(document.getElementById(HOST_WRAPPER_ID)).toBeNull()
  })
})

describe('Accessibility Widget — open / close / toggle', () => {
  it('panel does not have .open class initially', () => {
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(false)
    a.destroy()
  })

  it('open() adds .open class to panel', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.open()
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(true)
    a.destroy()
  })

  it('close() removes .open class from panel', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.open()
    a.close()
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(false)
    a.destroy()
  })

  it('toggle() flips open state', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.toggle()
    expect(a.getIsOpen()).toBe(true)
    a.toggle()
    expect(a.getIsOpen()).toBe(false)
    a.destroy()
  })

  it('calls onOpen callback', () => {
    const onOpen = vi.fn()
    const a = new AccessibilityWidget({ onOpen })
    a.mount()
    a.open()
    expect(onOpen).toHaveBeenCalledOnce()
    a.destroy()
  })

  it('calls onClose callback', () => {
    const onClose = vi.fn()
    const a = new AccessibilityWidget({ onClose })
    a.mount()
    a.open()
    a.close()
    expect(onClose).toHaveBeenCalledOnce()
    a.destroy()
  })
})

describe('Accessibility Widget — reset', () => {
  it('resets state to defaults', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...DEFAULT_STATE, fontSize: 5, legibleFonts: 2 }))
    const a = new AccessibilityWidget()
    a.mount()
    a.reset()
    expect(a.getState()).toEqual(DEFAULT_STATE)
    a.destroy()
  })

  it('calls onReset callback', () => {
    const onReset = vi.fn()
    const a = new AccessibilityWidget({ onReset })
    a.mount()
    a.reset()
    expect(onReset).toHaveBeenCalledOnce()
    a.destroy()
  })

  it('clears persisted state', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.reset()
    const stored = localStorage.getItem(STORAGE_KEY)
    expect(stored ? JSON.parse(stored) : {}).toEqual(DEFAULT_STATE)
    a.destroy()
  })
})

describe('Accessibility Widget — setSize', () => {
  it('updates panel data-size attribute', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.setSize('S')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-panel')?.dataset.size).toBe('S')
    a.setSize('XL')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-panel')?.dataset.size).toBe('XL')
    a.destroy()
  })
})

describe('Accessibility Widget — panel click interactions', () => {
  it('close button closes the panel', () => {
    const a = new AccessibilityWidget()
    a.mount()
    a.open()
    const closeBtn = document.querySelector<HTMLButtonElement>('.accessibility-widget-close')!
    closeBtn.click()
    expect(a.getIsOpen()).toBe(false)
    a.destroy()
  })

  it('reset button resets state', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    const resetBtn = panel.querySelector<HTMLButtonElement>('[data-action="reset"]')!
    resetBtn.click()
    expect(a.getState()).toEqual(DEFAULT_STATE)
    a.destroy()
  })

  it('profile button activates profile', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    const profileBtn = panel.querySelector<HTMLButtonElement>('[data-profile="dyslexia"]')!
    profileBtn.click()
    expect(a.getState().profile).toBe('dyslexia')
    a.destroy()
  })

  for (const [profile, preset] of Object.entries(EXPECTED_PROFILE_PRESETS) as Array<[AccessibilityProfile, Partial<AccessibilityWidgetState>]>) {
    it(`maps the ${profile} profile to its full tool preset`, () => {
      const a = new AccessibilityWidget()
      a.mount()
      document.querySelector<HTMLButtonElement>(`.accessibility-widget-panel [data-profile="${profile}"]`)!.click()
      expect(a.getState()).toEqual({ ...DEFAULT_STATE, profile, ...preset })
      a.destroy()
    })
  }

  it('clicking active profile resets to default state', () => {
    const a = new AccessibilityWidget()
    a.mount()
    // Query fresh after each click — panel innerHTML is replaced on state change
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="dyslexia"]')!.click()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="dyslexia"]')!.click()
    expect(a.getState().profile).toBeNull()
    a.destroy()
  })

  it('legible font tile advances to the first font level', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="legibleFonts"]')!.click()
    expect(a.getState().legibleFonts).toBe(1)
    a.destroy()
  })

  it('page structure tile opens headings, landmarks, and links tabs', () => {
    document.body.innerHTML = `
      <header><nav aria-label="Main menu"><a href="#intro">Intro link</a></nav></header>
      <main>
        <h1>Demo heading</h1>
        <section aria-label="Feature section"><h2>Feature heading</h2></section>
        <a href="https://example.com" target="_blank">External resource</a>
      </main>
    `
    const a = new AccessibilityWidget()
    a.mount()

    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="pageStructure"]')!.click()
    expect(document.querySelector('.accessibility-widget-structure-dialog')).not.toBeNull()
    expect(document.querySelector('.accessibility-widget-structure-dialog')?.textContent).toContain('Demo heading')
    expect(document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="pageStructure"]')?.getAttribute('aria-pressed')).toBe('true')

    document.querySelector<HTMLButtonElement>('[data-structure-tab="landmarks"]')!.click()
    expect(document.querySelector('.accessibility-widget-structure-dialog')?.textContent).toContain('Main')
    expect(document.querySelector('.accessibility-widget-structure-dialog')?.textContent).toContain('Navigation: Main menu')

    document.querySelector<HTMLButtonElement>('[data-structure-tab="links"]')!.click()
    expect(document.querySelector('.accessibility-widget-structure-dialog')?.textContent).toContain('External resource')

    document.querySelector<HTMLButtonElement>('[data-structure-action="close"]')!.click()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-structure-layer')?.hidden).toBe(true)
    expect(document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="pageStructure"]')?.getAttribute('aria-pressed')).toBe('false')
    a.destroy()
  })

  it('color tile toggles color flag', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="monochrome"]')!.click()
    expect(a.getState().monochrome).toBe(1)
    a.destroy()
  })

  it('activating a color flag turns off exclusive others', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="darkContrast"]')!.click()
    panel.querySelector<HTMLButtonElement>('[data-tool="lightContrast"]')!.click()
    const state = a.getState()
    expect(state.lightContrast).toBe(1)
    expect(state.darkContrast).toBe(0)
    a.destroy()
  })

  it('tool click advances a level-based control', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="fontSize"]')!.click()
    expect(a.getState().fontSize).toBe(1)
    a.destroy()
  })

  it('new visual reading tools advance as level-based controls', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="bigCursor"]')!.click()
    panel.querySelector<HTMLButtonElement>('[data-tool="readingMask"]')!.click()
    panel.querySelector<HTMLButtonElement>('[data-tool="readingGuide"]')!.click()
    const state = a.getState()
    expect(state.bigCursor).toBe(1)
    expect(state.readingMask).toBe(1)
    expect(state.readingGuide).toBe(1)
    a.destroy()
  })

  it('visual adjustment toggles turn on and off', () => {
    const a = new AccessibilityWidget()
    a.mount()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="hideImages"]')!.click()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="offAnimations"]')!.click()
    expect(a.getState().hideImages).toBe(1)
    expect(a.getState().offAnimations).toBe(1)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="hideImages"]')!.click()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="offAnimations"]')!.click()
    expect(a.getState().hideImages).toBe(0)
    expect(a.getState().offAnimations).toBe(0)
    a.destroy()
  })

  it('tool click turns off after the configured max level', () => {
    const a = new AccessibilityWidget()
    a.mount()
    for (let i = 0; i < 4; i++) {
      document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="fontSize"]')!.click()
    }
    expect(a.getState().fontSize).toBe(4)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="fontSize"]')!.click()
    expect(a.getState().fontSize).toBe(0)
    a.destroy()
  })

  it('three-level tools turn off after level 3', () => {
    const a = new AccessibilityWidget()
    a.mount()
    for (let i = 0; i < 3; i++) {
      document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="bigCursor"]')!.click()
    }
    expect(a.getState().bigCursor).toBe(3)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="bigCursor"]')!.click()
    expect(a.getState().bigCursor).toBe(0)
    a.destroy()
  })

  it('magnifier, lens, monochrome, and invert are toggle-only tools', () => {
    const a = new AccessibilityWidget()
    a.mount()
    for (const tool of ['textMagnifier', 'readingLens', 'monochrome', 'invertColors'] as const) {
      document.querySelector<HTMLButtonElement>(`.accessibility-widget-panel [data-tool="${tool}"]`)!.click()
      expect(a.getState()[tool]).toBe(1)
      document.querySelector<HTMLButtonElement>(`.accessibility-widget-panel [data-tool="${tool}"]`)!.click()
      expect(a.getState()[tool]).toBe(0)
    }
    a.destroy()
  })

  it('two-level tools turn off after level 2', () => {
    const a = new AccessibilityWidget()
    a.mount()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="legibleFonts"]')!.click()
    expect(a.getState().legibleFonts).toBe(1)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="legibleFonts"]')!.click()
    expect(a.getState().legibleFonts).toBe(2)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="legibleFonts"]')!.click()
    expect(a.getState().legibleFonts).toBe(0)
    a.destroy()
  })

  it('alignment tool cycles through the alignment presets', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="textAlignment"]')!.click()
    expect(a.getState().textAlignment).toBe('left')
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="textAlignment"]')!.click()
    expect(a.getState().textAlignment).toBe('center')
    a.destroy()
  })

  it('alignment tool wraps back to the first level', () => {
    const a = new AccessibilityWidget()
    a.mount()
    for (let i = 0; i < 4; i++) {
      document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="textAlignment"]')!.click()
    }
    expect(a.getState().textAlignment).toBe('justify')
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-tool="textAlignment"]')!.click()
    expect(a.getState().textAlignment).toBe('left')
    a.destroy()
  })

  it('XL size switch changes widget size', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    const sizeBtn = panel.querySelector<HTMLButtonElement>('.accessibility-widget-size-switch')!
    sizeBtn.click()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-panel')?.dataset.size).toBe('XL')
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel .accessibility-widget-size-switch')!.click()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-panel')?.dataset.size).toBe('S')
    a.destroy()
  })
})

describe('Accessibility Widget — persistence', () => {
  it('saves state to localStorage on change', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="legibleFonts"]')!.click()
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
    expect(stored.legibleFonts).toBe(1)
    a.destroy()
  })

  it('does not write to localStorage when persistence=false', () => {
    const a = new AccessibilityWidget({ persistence: false })
    a.mount()
    const panel = document.querySelector('.accessibility-widget-panel')!
    panel.querySelector<HTMLButtonElement>('[data-tool="legibleFonts"]')!.click()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
    a.destroy()
  })
})

describe('Accessibility Widget — dark mode', () => {
  it('applies light scheme by default', () => {
    const a = new AccessibilityWidget()
    a.mount()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.dataset.scheme).toBe('light')
    a.destroy()
  })

  it('applies dark scheme when colorScheme=dark', () => {
    const a = new AccessibilityWidget({ colorScheme: 'dark' })
    a.mount()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.dataset.scheme).toBe('dark')
    a.destroy()
  })

  it('applies light scheme when colorScheme=light', () => {
    const a = new AccessibilityWidget({ colorScheme: 'light' })
    a.mount()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.dataset.scheme).toBe('light')
    a.destroy()
  })

  it('setColorScheme updates scheme at runtime', () => {
    const a = new AccessibilityWidget({ colorScheme: 'light' })
    a.mount()
    a.setColorScheme('dark')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.dataset.scheme).toBe('dark')
    a.destroy()
  })
})

describe('Accessibility Widget — branding', () => {
  it('uses a custom title in labels and panel header', () => {
    const a = new AccessibilityWidget({ title: 'Client Access Menu' })
    a.mount()
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.getAttribute('aria-label')).toBe('Client Access Menu')
    expect(document.querySelector<HTMLButtonElement>('.accessibility-widget-trigger')?.getAttribute('aria-label')).toBe('Open Client Access Menu')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-panel')?.getAttribute('aria-label')).toBe('Client Access Menu settings')
    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain('Client Access Menu')
    a.destroy()
  })

  it('updates title at runtime', () => {
    const a = new AccessibilityWidget({ title: 'Original Menu' })
    a.mount()
    a.setTitle('Updated Menu')
    expect(document.querySelector<HTMLButtonElement>('.accessibility-widget-trigger')?.getAttribute('aria-label')).toBe('Open Updated Menu')
    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain('Updated Menu')
    a.destroy()
  })

  it('uses accentColor for primary widget variables', () => {
    const a = new AccessibilityWidget({ accentColor: '#0f766e' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-primary')).toBe('#0f766e')
    expect(root.style.getPropertyValue('--accessibility-widget-header-bg')).toBe('#0f766e')
    a.destroy()
  })

  it('lets accentColor override theme.primary and update at runtime', () => {
    const a = new AccessibilityWidget({ accentColor: '#0f766e', theme: { primary: '#17313f' } })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-primary')).toBe('#0f766e')
    a.setAccentColor('#b45309')
    expect(root.style.getPropertyValue('--accessibility-widget-primary')).toBe('#b45309')
    a.destroy()
  })

  it('falls back to theme.primary when accentColor is cleared', () => {
    const a = new AccessibilityWidget({ accentColor: '#0f766e', theme: { primary: '#17313f' } })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    a.setAccentColor(undefined)
    expect(root.style.getPropertyValue('--accessibility-widget-primary')).toBe('#17313f')
    a.destroy()
  })
})

describe('Accessibility Widget — triggerScheme', () => {
  it('explicit triggerScheme="dark" → dark trigger', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'dark' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#0c0c0c')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-icon')).toBe('#ffffff')
    a.destroy()
  })

  it('explicit triggerScheme="light" → light trigger', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'light' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-icon')).toBe('#0c0c0c')
    a.destroy()
  })

  it('triggerScheme unset, colorScheme="dark" → trigger matches: dark', () => {
    const a = new AccessibilityWidget({ colorScheme: 'dark' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#0c0c0c')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-icon')).toBe('#ffffff')
    a.destroy()
  })

  it('triggerScheme unset, colorScheme="light" → trigger matches: light', () => {
    const a = new AccessibilityWidget({ colorScheme: 'light' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-icon')).toBe('#0c0c0c')
    a.destroy()
  })

  it('triggerScheme and colorScheme both unset → falls back to default colorScheme (light) → light trigger', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-icon')).toBe('#0c0c0c')
    a.destroy()
  })

  it('triggerScheme="auto" explicitly → still matches resolved colorScheme', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'auto', colorScheme: 'dark' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#0c0c0c')
    a.destroy()
  })

  it('explicit triggerScheme wins over colorScheme', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'light', colorScheme: 'dark' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    a.destroy()
  })

  it('setTriggerScheme updates trigger styling at runtime', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'light' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    a.setTriggerScheme('dark')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#0c0c0c')
    a.destroy()
  })

  it('setColorScheme refreshes trigger when on "auto"', () => {
    const a = new AccessibilityWidget({ colorScheme: 'light' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff')
    a.setColorScheme('dark')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#0c0c0c')
    a.destroy()
  })

  it('setColorScheme does NOT touch trigger when explicit triggerScheme is set', () => {
    const a = new AccessibilityWidget({ triggerScheme: 'light', colorScheme: 'light' })
    a.mount()
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')!
    a.setColorScheme('dark')
    expect(root.style.getPropertyValue('--accessibility-widget-trigger-bg')).toBe('#ffffff') // still light
    a.destroy()
  })
})

describe('Accessibility Widget — i18n', () => {
  it('renders Spanish labels when lang=es', () => {
    const a = new AccessibilityWidget({ lang: 'es' })
    a.mount()
    a.open()
    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain('Configuración de Accesibilidad')
    a.destroy()
  })

  it('setLang updates panel language at runtime', () => {
    const a = new AccessibilityWidget({ lang: 'en' })
    a.mount()
    a.open()
    a.setLang('fr')
    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain("Paramètres d'Accessibilité")
    a.destroy()
  })
})

describe('Accessibility Widget — keyboard navigation profile', () => {
  it('injects skip link when keyboard-navigation profile is activated', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="keyboard-navigation"]')!.click()
    expect(document.getElementById('accessibility-widget-skip-link')).not.toBeNull()
    a.destroy()
  })

  it('removes skip link when keyboard-navigation profile is deactivated', () => {
    const a = new AccessibilityWidget()
    a.mount()
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="keyboard-navigation"]')!.click()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="keyboard-navigation"]')!.click()
    expect(document.getElementById('accessibility-widget-skip-link')).toBeNull()
    a.destroy()
  })

  it('adds accessibility-widget-effect-keyboard-nav class to host when keyboard-navigation profile is activated', () => {
    const a = new AccessibilityWidget()
    a.mount()
    document.querySelector<HTMLButtonElement>('.accessibility-widget-panel [data-profile="keyboard-navigation"]')!.click()
    expect(document.getElementById('accessibility-widget-host')?.classList.contains('accessibility-widget-effect-keyboard-nav')).toBe(true)
    a.destroy()
  })
})
