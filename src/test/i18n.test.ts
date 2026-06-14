import { describe, it, expect } from 'vitest'
import { getTranslations } from '../core/i18n'

describe('getTranslations', () => {
  it('returns English by default', () => {
    const t = getTranslations('en')
    expect(t.title).toBe('React Accessibility Widget')
    expect(t.subtitle).toBe('Accessibility Settings')
    expect(t.resetAll).toBe('Reset all settings')
  })

  it('returns Spanish translations', () => {
    const t = getTranslations('es')
    expect(t.subtitle).toBe('Configuración de Accesibilidad')
    expect(t.resetAll).toBe('Restablecer configuración')
    expect(t.dyslexia).toBe('Dislexia')
  })

  it('returns French translations', () => {
    const t = getTranslations('fr')
    expect(t.subtitle).toContain('Accessibilité')
    expect(t.dyslexia).toBe('Dyslexie')
  })

  it('returns German translations', () => {
    const t = getTranslations('de')
    expect(t.subtitle).toBe('Barrierefreiheitseinstellungen')
    expect(t.dyslexia).toBe('Legasthenie')
  })

  it('returns Portuguese translations', () => {
    const t = getTranslations('pt')
    expect(t.subtitle).toBe('Configurações de Acessibilidade')
    expect(t.dyslexia).toBe('Dislexia')
  })

  it('returns Arabic translations', () => {
    const t = getTranslations('ar')
    expect(t.subtitle).toBe('إعدادات إمكانية الوصول')
    expect(t.resetAll).toBe('إعادة تعيين جميع الإعدادات')
  })

  it('every language has a non-empty title', () => {
    for (const lang of ['en', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      expect(getTranslations(lang).title.length, lang).toBeGreaterThan(0)
    }
  })

  it('every language has all required keys', () => {
    const keys: Array<keyof ReturnType<typeof getTranslations>> = [
      'title', 'subtitle', 'widgetSize', 'xlSize', 'profiles', 'contentAdjustments',
      'colorAdjustments', 'pageStructure', 'structureHeadings', 'structureLandmarks',
      'structureLinks', 'noStructureItems', 'untitledHeading', 'untitledLink',
      'resetAll', 'close', 'dyslexia', 'seizureSafe',
      'fontSize', 'legibleFonts', 'dyslexiaFriendly', 'textMagnifier', 'bigCursor', 'readingMask',
    ]
    for (const lang of ['en', 'es', 'fr', 'de', 'pt', 'ar'] as const) {
      const t = getTranslations(lang)
      for (const key of keys) {
        expect(t[key], `${lang}.${key}`).toBeTruthy()
      }
    }
  })
})
