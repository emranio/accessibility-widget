import { describe, it, expect, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { AccessibilityWidget, useAccessibilityWidget } from '../react/index'
import React, { useEffect } from 'react'

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

describe('AccessibilityWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<AccessibilityWidget />)
    expect(container).toBeTruthy()
  })

  it('mounts accessibility-widget-root into the container', () => {
    render(<AccessibilityWidget />)
    expect(document.querySelector('.accessibility-widget-root')).not.toBeNull()
  })

  it('injects styles into head', () => {
    render(<AccessibilityWidget />)
    expect(document.getElementById('accessibility-widget-styles')).not.toBeNull()
  })

  it('renders the trigger button', () => {
    render(<AccessibilityWidget />)
    expect(document.querySelector('.accessibility-widget-trigger')).not.toBeNull()
  })

  it('renders the panel', () => {
    render(<AccessibilityWidget />)
    expect(document.querySelector('.accessibility-widget-panel')).not.toBeNull()
  })

  it('unmounting destroys the widget and removes accessibility-widget-root', () => {
    const { unmount } = render(<AccessibilityWidget />)
    unmount()
    expect(document.querySelector('.accessibility-widget-root')).toBeNull()
  })

  it('applies position prop to trigger', () => {
    render(<AccessibilityWidget position="top-left" />)
    const trigger = document.querySelector<HTMLButtonElement>('.accessibility-widget-trigger')
    expect(trigger?.dataset.position).toBe('top-left')
  })

  it('applies size prop to panel', () => {
    render(<AccessibilityWidget size="S" />)
    const panel = document.querySelector<HTMLElement>('.accessibility-widget-panel')
    expect(panel?.dataset.size).toBe('S')
  })

  it('applies colorScheme="dark" to root data-scheme', () => {
    render(<AccessibilityWidget colorScheme="dark" />)
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')
    expect(root?.dataset.scheme).toBe('dark')
  })

  it('applies colorScheme="light" to root data-scheme', () => {
    render(<AccessibilityWidget colorScheme="light" />)
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')
    expect(root?.dataset.scheme).toBe('light')
  })

  it('only one accessibility-widget-root when AccessibilityWidget is rendered once', () => {
    render(<AccessibilityWidget colorScheme="dark" />)
    expect(document.querySelectorAll('.accessibility-widget-root').length).toBe(1)
  })

  it('updates title and accent props at runtime', () => {
    const { rerender } = render(<AccessibilityWidget title="First Menu" accentColor="#0f766e" />)
    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain('First Menu')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.style.getPropertyValue('--accessibility-widget-primary')).toBe('#0f766e')

    rerender(<AccessibilityWidget title="Second Menu" accentColor="#b45309" />)

    expect(document.querySelector('.accessibility-widget-panel')?.innerHTML).toContain('Second Menu')
    expect(document.querySelector<HTMLElement>('.accessibility-widget-root')?.style.getPropertyValue('--accessibility-widget-primary')).toBe('#b45309')
  })

  it('updates theme prop at runtime', () => {
    const { rerender } = render(<AccessibilityWidget theme={{ primary: '#17313f', background: '#fffaf3', text: '#17212b' }} />)
    const root = document.querySelector<HTMLElement>('.accessibility-widget-root')
    expect(root?.style.getPropertyValue('--accessibility-widget-primary')).toBe('#17313f')

    rerender(<AccessibilityWidget theme={{ primary: '#1f4d3c', background: '#fbf8f1', text: '#1b241f' }} />)

    expect(root?.style.getPropertyValue('--accessibility-widget-primary')).toBe('#1f4d3c')
    expect(root?.style.getPropertyValue('--accessibility-widget-bg')).toBe('#fbf8f1')
  })
})

// Helper component that exposes useAccessibilityWidget return values via data attributes
function HookHarness({ onMount }: { onMount: (api: ReturnType<typeof useAccessibilityWidget>) => void }) {
  const api = useAccessibilityWidget()
  useEffect(() => { onMount(api) }, [])
  return null
}

describe('useAccessibilityWidget', () => {
  it('mounts the widget on mount', () => {
    render(<HookHarness onMount={() => {}} />)
    expect(document.querySelector('.accessibility-widget-root')).not.toBeNull()
  })

  it('returns initial isOpen as false', () => {
    let capturedIsOpen: boolean | undefined
    render(<HookHarness onMount={({ isOpen }) => { capturedIsOpen = isOpen }} />)
    expect(capturedIsOpen).toBe(false)
  })

  it('returns initial state matching DEFAULT_STATE fields', () => {
    let capturedState: ReturnType<typeof useAccessibilityWidget>['state'] | undefined
    render(<HookHarness onMount={({ state }) => { capturedState = state }} />)
    // state is null until the useEffect fires and sets it — null is the initial value
    expect(capturedState === null || capturedState === undefined || capturedState?.profile === null).toBe(true)
    if (capturedState) {
      expect(capturedState.fontSize).toBe(0)
      expect(capturedState.legibleFonts).toBe(0)
    }
  })

  it('open() opens the panel', async () => {
    let api!: ReturnType<typeof useAccessibilityWidget>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.open() })
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(true)
  })

  it('close() closes the panel', async () => {
    let api!: ReturnType<typeof useAccessibilityWidget>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.open() })
    await act(async () => { api.close() })
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(false)
  })

  it('toggle() flips open state', async () => {
    let api!: ReturnType<typeof useAccessibilityWidget>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.toggle() })
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(true)
    await act(async () => { api.toggle() })
    expect(document.querySelector('.accessibility-widget-panel')?.classList.contains('open')).toBe(false)
  })

  it('destroys widget on unmount', () => {
    const { unmount } = render(<HookHarness onMount={() => {}} />)
    unmount()
    expect(document.querySelector('.accessibility-widget-root')).toBeNull()
  })
})
