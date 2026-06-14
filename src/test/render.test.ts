import { describe, it, expect } from 'vitest'
import { renderPanel } from '../core/render'
import { DEFAULT_STATE } from '../core/types'

function freshState() {
  return { ...DEFAULT_STATE }
}

describe('renderPanel', () => {
  it('returns a non-empty HTML string', () => {
    const html = renderPanel(freshState(), 'S')
    expect(typeof html).toBe('string')
    expect(html.length).toBeGreaterThan(0)
  })

  it('includes the header title', () => {
    expect(renderPanel(freshState(), 'S')).toContain('React Accessibility Widget')
  })

  it('renders a custom escaped header title', () => {
    const html = renderPanel(freshState(), 'S', 'en', { title: 'Team <Access> & QA' })
    expect(html).toContain('Team &lt;Access&gt; &amp; QA')
    expect(html).not.toContain('Team <Access> & QA')
  })

  it('includes Accessibility Settings subtitle', () => {
    expect(renderPanel(freshState(), 'S')).toContain('Accessibility Settings')
  })

  it('renders all 7 profile cards', () => {
    const html = renderPanel(freshState(), 'S')
    const profiles = [
      'seizure-safe', 'vision-impaired', 'adhd-friendly', 'cognitive-disability',
      'keyboard-navigation', 'color-blind', 'dyslexia',
    ]
    for (const id of profiles) {
      expect(html, `missing profile: ${id}`).toContain(`data-profile="${id}"`)
    }
  })

  it('marks active profile as aria-pressed=true', () => {
    const state = freshState()
    state.profile = 'dyslexia'
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-profile="dyslexia" aria-pressed="true"')
  })

  it('marks inactive profiles as aria-pressed=false', () => {
    const state = freshState()
    state.profile = 'dyslexia'
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-profile="seizure-safe" aria-pressed="false"')
  })

  it('renders all stepper tiles', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('data-tool="fontSize"')
    expect(html).toContain('data-tool="lineHeight"')
    expect(html).toContain('data-tool="letterSpacing"')
  })

  it('renders variable level indicators only for multi-level tools', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('accessibility-widget-levels')
    expect(html).toContain('data-tool="fontSize" data-level="0" data-max-level="4"')
    expect(html).toContain('data-tool="highlightLinks" data-level="0" data-max-level="2"')
    expect(html).toContain('data-tool="legibleFonts" data-level="0" data-max-level="2"')
    expect(html).toContain('data-tool="textMagnifier" data-level="0" data-max-level="1"')
    expect(html).toContain('data-tool="readingLens" data-level="0" data-max-level="1"')
  })

  it('marks the active level bar for leveled tools', () => {
    const state = freshState()
    state.fontSize = 3
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-tool="fontSize" data-level="3"')
    expect(html).toContain('accessibility-widget-level active')
  })

  it('renders all toggle tiles', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('data-tool="legibleFonts"')
    expect(html).toContain('data-tool="highlightTitles"')
    expect(html).toContain('data-tool="highlightLinks"')
    expect(html).toContain('data-tool="textMagnifier"')
    expect(html).toContain('data-tool="readingLens"')
    expect(html).toContain('data-tool="bigCursor"')
    expect(html).toContain('data-tool="readingMask"')
    expect(html).toContain('data-tool="readingGuide"')
    expect(html).toContain('data-tool="pageStructure"')
    expect(html).toContain('Page Structure')
  })

  it('marks active toggle tile as aria-pressed=true', () => {
    const state = freshState()
    state.legibleFonts = 1
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-tool="legibleFonts" data-level="1" data-max-level="2" aria-pressed="true"')
    expect(html).toContain('Dyslexia Friendly')
  })

  it('marks page structure tile active when the dialog is open', () => {
    const html = renderPanel(freshState(), 'S', 'en', { pageStructureOpen: true })
    expect(html).toContain('data-tool="pageStructure" data-level="1" data-max-level="1" aria-pressed="true"')
  })

  it('renders the second legible font level with the general label', () => {
    const state = freshState()
    state.legibleFonts = 2
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-tool="legibleFonts" data-level="2" data-max-level="2" aria-pressed="true"')
    expect(html).toContain('Legible Fonts')
  })

  it('renders all color tiles', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('Visual Adjustments')
    expect(html).toContain('data-tool="darkContrast"')
    expect(html).toContain('data-tool="lightContrast"')
    expect(html).toContain('data-tool="highContrast"')
    expect(html).toContain('data-tool="monochrome"')
    expect(html).toContain('data-tool="invertColors"')
    expect(html).toContain('data-tool="colorBlind"')
    expect(html).toContain('data-tool="hideImages"')
    expect(html).toContain('data-tool="offAnimations"')
    expect(html).toContain('Reduce Animations')
    expect(html).not.toContain('Off Animations')
    expect(html).toContain('data-tool="monochrome" data-level="0" data-max-level="1"')
    expect(html).toContain('data-tool="invertColors" data-level="0" data-max-level="1"')
    expect(html).toContain('data-tool="hideImages" data-level="0" data-max-level="1"')
    expect(html).toContain('data-tool="offAnimations" data-level="0" data-max-level="1"')
  })

  it('marks active color tile as aria-pressed=true', () => {
    const state = freshState()
    state.darkContrast = 3
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-tool="darkContrast" data-level="3" data-max-level="3" aria-pressed="true"')
  })

  it('renders text alignment as a leveled tool', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('data-tool="textAlignment"')
  })

  it('maps alignment states to tool levels', () => {
    const state = freshState()
    state.textAlignment = 'center'
    const html = renderPanel(state, 'S')
    expect(html).toContain('data-tool="textAlignment" data-level="2" data-max-level="4" aria-pressed="true"')
  })

  it('renders a single XL size switch', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).toContain('role="switch"')
    expect(html).toContain('XL Size')
    expect(html).toContain('data-size="XL"')
    expect(html).toContain('aria-checked="false"')
  })

  it('marks XL size switch as active', () => {
    const html = renderPanel(freshState(), 'XL')
    expect(html).toContain('data-size="S"')
    expect(html).toContain('aria-checked="true"')
  })

  it('renders reset button with data-action=reset', () => {
    expect(renderPanel(freshState(), 'S')).toContain('data-action="reset"')
  })

  it('renders close button', () => {
    expect(renderPanel(freshState(), 'S')).toContain('accessibility-widget-close')
  })

  it('does not render page analysis controls', () => {
    const html = renderPanel(freshState(), 'S')
    expect(html).not.toContain('Page Analysis')
  })
})

describe('renderPanel — i18n', () => {
  it('renders Spanish labels with lang=es', () => {
    const html = renderPanel(freshState(), 'S', 'es')
    expect(html).toContain('Configuración de Accesibilidad')
    expect(html).toContain('Restablecer configuración')
  })

  it('renders French labels with lang=fr', () => {
    const html = renderPanel(freshState(), 'S', 'fr')
    expect(html).toContain("Paramètres d'Accessibilité")
  })

  it('renders German labels with lang=de', () => {
    const html = renderPanel(freshState(), 'S', 'de')
    expect(html).toContain('Barrierefreiheitseinstellungen')
  })

  it('renders Portuguese labels with lang=pt', () => {
    const html = renderPanel(freshState(), 'S', 'pt')
    expect(html).toContain('Configurações de Acessibilidade')
  })

  it('renders Arabic labels with lang=ar and dir=rtl', () => {
    const html = renderPanel(freshState(), 'S', 'ar')
    expect(html).toContain('إعدادات إمكانية الوصول')
    expect(html).toContain('dir="rtl"')
  })

  it('falls back to English for unknown lang', () => {
    const html = renderPanel(freshState(), 'S', 'en')
    expect(html).toContain('Accessibility Settings')
  })
})
