import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { trapFocus, releaseFocus, injectSkipLink, removeSkipLink } from '../core/keyboard'

beforeEach(() => {
  document.body.innerHTML = ''
})

afterEach(() => {
  releaseFocus()
  removeSkipLink()
  document.body.innerHTML = ''
})

describe('injectSkipLink', () => {
  it('does nothing when no main landmark exists', () => {
    injectSkipLink()
    expect(document.getElementById('accessify-skip-link')).toBeNull()
  })

  it('injects skip link when <main> exists', () => {
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    injectSkipLink()
    const link = document.getElementById('accessify-skip-link') as HTMLAnchorElement
    expect(link).not.toBeNull()
    expect(link.href).toContain('#main')
  })

  it('injects skip link for [role="main"]', () => {
    const div = document.createElement('div')
    div.setAttribute('role', 'main')
    div.id = 'content'
    document.body.appendChild(div)
    injectSkipLink()
    expect(document.getElementById('accessify-skip-link')).not.toBeNull()
  })

  it('assigns an id to main if it has none', () => {
    const main = document.createElement('main')
    document.body.appendChild(main)
    injectSkipLink()
    expect(main.id).toBe('acc-main-content')
    const link = document.getElementById('accessify-skip-link') as HTMLAnchorElement
    expect(link.href).toContain('#acc-main-content')
  })

  it('is idempotent — calling twice injects only one link', () => {
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    injectSkipLink()
    injectSkipLink()
    expect(document.querySelectorAll('#accessify-skip-link')).toHaveLength(1)
  })

  it('inserts skip link as first child of body', () => {
    const p = document.createElement('p')
    document.body.appendChild(p)
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    injectSkipLink()
    expect(document.body.firstElementChild?.id).toBe('accessify-skip-link')
  })
})

describe('removeSkipLink', () => {
  it('removes the skip link', () => {
    const main = document.createElement('main')
    main.id = 'main'
    document.body.appendChild(main)
    injectSkipLink()
    removeSkipLink()
    expect(document.getElementById('accessify-skip-link')).toBeNull()
  })

  it('is safe to call when skip link does not exist', () => {
    expect(() => removeSkipLink()).not.toThrow()
  })
})

describe('trapFocus', () => {
  function buildPanel(...tags: string[]): HTMLDivElement {
    const panel = document.createElement('div')
    for (const tag of tags) {
      const el = document.createElement(tag) as HTMLButtonElement
      el.textContent = tag
      if (tag === 'button') el.type = 'button'
      panel.appendChild(el)
    }
    document.body.appendChild(panel)
    return panel
  }

  it('does not throw when panel has no focusable elements', () => {
    const panel = document.createElement('div')
    document.body.appendChild(panel)
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    expect(() => trapFocus(panel, trigger)).not.toThrow()
  })

  it('closes panel on Escape key', () => {
    const trigger = document.createElement('button')
    trigger.type = 'button'
    document.body.appendChild(trigger)
    let clicked = false
    trigger.addEventListener('click', () => { clicked = true })

    const panel = buildPanel('button', 'button')
    trapFocus(panel, trigger)

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    panel.dispatchEvent(event)
    expect(clicked).toBe(true)
  })

  it('releaseFocus does not throw when no trap is active', () => {
    expect(() => releaseFocus()).not.toThrow()
  })
})
