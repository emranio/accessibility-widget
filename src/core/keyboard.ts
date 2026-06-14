const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

let trapHandler: ((e: KeyboardEvent) => void) | null = null
let triggerEl: HTMLElement | null = null
let trappedEl: HTMLElement | null = null

export function trapFocus(panel: HTMLElement, trigger: HTMLElement, onEscape?: () => void): void {
  releaseFocus()
  triggerEl = trigger
  trappedEl = panel

  trapHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      if (onEscape) {
        onEscape()
      } else {
        trigger.click()
        trigger.focus()
      }
      return
    }
    if (e.key !== 'Tab') return

    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      .filter(el => !el.closest('[hidden]') && el.offsetParent !== null)

    if (focusable.length === 0) { e.preventDefault(); return }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  panel.addEventListener('keydown', trapHandler)

  // Move focus to first focusable element in panel
  const first = panel.querySelector<HTMLElement>(FOCUSABLE)
  first?.focus()
}

export function releaseFocus(): void {
  if (trapHandler && trappedEl) trappedEl.removeEventListener('keydown', trapHandler)
  trapHandler = null
  triggerEl = null
  trappedEl = null
}

const SKIP_LINK_ID = 'accessify-skip-link'

export function injectSkipLink(): void {
  if (document.getElementById(SKIP_LINK_ID)) return

  // Only inject if there's a main landmark to skip to
  const main = document.querySelector('main, [role="main"], #main, #content, #main-content')
  if (!main) return

  if (!main.id) main.id = 'acc-main-content'

  const link = document.createElement('a')
  link.id = SKIP_LINK_ID
  link.href = `#${main.id}`
  link.textContent = 'Skip to main content'
  link.className = 'accessify-skip-link'
  document.body.insertBefore(link, document.body.firstChild)
}

export function removeSkipLink(): void {
  document.getElementById(SKIP_LINK_ID)?.remove()
}
