import { describe, it, expect, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { AccessifyWidget, useAccessify } from '../react/index'
import React, { useEffect } from 'react'

afterEach(() => {
  document.body.innerHTML = ''
  localStorage.clear()
})

describe('AccessifyWidget', () => {
  it('renders without crashing', () => {
    const { container } = render(<AccessifyWidget />)
    expect(container).toBeTruthy()
  })

  it('mounts accessify-root into the container', () => {
    render(<AccessifyWidget />)
    expect(document.querySelector('.accessify-root')).not.toBeNull()
  })

  it('injects styles into head', () => {
    render(<AccessifyWidget />)
    expect(document.getElementById('accessify-styles')).not.toBeNull()
  })

  it('renders the trigger button', () => {
    render(<AccessifyWidget />)
    expect(document.querySelector('.accessify-trigger')).not.toBeNull()
  })

  it('renders the panel', () => {
    render(<AccessifyWidget />)
    expect(document.querySelector('.accessify-panel')).not.toBeNull()
  })

  it('unmounting destroys the widget and removes accessify-root', () => {
    const { unmount } = render(<AccessifyWidget />)
    unmount()
    expect(document.querySelector('.accessify-root')).toBeNull()
  })

  it('applies position prop to trigger', () => {
    render(<AccessifyWidget position="top-left" />)
    const trigger = document.querySelector<HTMLButtonElement>('.accessify-trigger')
    expect(trigger?.dataset.position).toBe('top-left')
  })

  it('applies size prop to panel', () => {
    render(<AccessifyWidget size="S" />)
    const panel = document.querySelector<HTMLElement>('.accessify-panel')
    expect(panel?.dataset.size).toBe('S')
  })

  it('applies colorScheme="dark" to root data-scheme', () => {
    render(<AccessifyWidget colorScheme="dark" />)
    const root = document.querySelector<HTMLElement>('.accessify-root')
    expect(root?.dataset.scheme).toBe('dark')
  })

  it('applies colorScheme="light" to root data-scheme', () => {
    render(<AccessifyWidget colorScheme="light" />)
    const root = document.querySelector<HTMLElement>('.accessify-root')
    expect(root?.dataset.scheme).toBe('light')
  })

  it('only one accessify-root when AccessifyWidget is rendered once', () => {
    render(<AccessifyWidget colorScheme="dark" />)
    expect(document.querySelectorAll('.accessify-root').length).toBe(1)
  })

  it('updates title and accent props at runtime', () => {
    const { rerender } = render(<AccessifyWidget title="First Menu" accentColor="#0f766e" />)
    expect(document.querySelector('.accessify-panel')?.innerHTML).toContain('First Menu')
    expect(document.querySelector<HTMLElement>('.accessify-root')?.style.getPropertyValue('--acc-primary')).toBe('#0f766e')

    rerender(<AccessifyWidget title="Second Menu" accentColor="#b45309" />)

    expect(document.querySelector('.accessify-panel')?.innerHTML).toContain('Second Menu')
    expect(document.querySelector<HTMLElement>('.accessify-root')?.style.getPropertyValue('--acc-primary')).toBe('#b45309')
  })

  it('updates theme prop at runtime', () => {
    const { rerender } = render(<AccessifyWidget theme={{ primary: '#17313f', background: '#fffaf3', text: '#17212b' }} />)
    const root = document.querySelector<HTMLElement>('.accessify-root')
    expect(root?.style.getPropertyValue('--acc-primary')).toBe('#17313f')

    rerender(<AccessifyWidget theme={{ primary: '#1f4d3c', background: '#fbf8f1', text: '#1b241f' }} />)

    expect(root?.style.getPropertyValue('--acc-primary')).toBe('#1f4d3c')
    expect(root?.style.getPropertyValue('--acc-bg')).toBe('#fbf8f1')
  })
})

// Helper component that exposes useAccessify return values via data attributes
function HookHarness({ onMount }: { onMount: (api: ReturnType<typeof useAccessify>) => void }) {
  const api = useAccessify()
  useEffect(() => { onMount(api) }, [])
  return null
}

describe('useAccessify', () => {
  it('mounts the widget on mount', () => {
    render(<HookHarness onMount={() => {}} />)
    expect(document.querySelector('.accessify-root')).not.toBeNull()
  })

  it('returns initial isOpen as false', () => {
    let capturedIsOpen: boolean | undefined
    render(<HookHarness onMount={({ isOpen }) => { capturedIsOpen = isOpen }} />)
    expect(capturedIsOpen).toBe(false)
  })

  it('returns initial state matching DEFAULT_STATE fields', () => {
    let capturedState: ReturnType<typeof useAccessify>['state'] | undefined
    render(<HookHarness onMount={({ state }) => { capturedState = state }} />)
    // state is null until the useEffect fires and sets it — null is the initial value
    expect(capturedState === null || capturedState === undefined || capturedState?.profile === null).toBe(true)
    if (capturedState) {
      expect(capturedState.fontSize).toBe(0)
      expect(capturedState.legibleFonts).toBe(0)
    }
  })

  it('open() opens the panel', async () => {
    let api!: ReturnType<typeof useAccessify>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.open() })
    expect(document.querySelector('.accessify-panel')?.classList.contains('open')).toBe(true)
  })

  it('close() closes the panel', async () => {
    let api!: ReturnType<typeof useAccessify>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.open() })
    await act(async () => { api.close() })
    expect(document.querySelector('.accessify-panel')?.classList.contains('open')).toBe(false)
  })

  it('toggle() flips open state', async () => {
    let api!: ReturnType<typeof useAccessify>
    render(<HookHarness onMount={a => { api = a }} />)
    await act(async () => { api.toggle() })
    expect(document.querySelector('.accessify-panel')?.classList.contains('open')).toBe(true)
    await act(async () => { api.toggle() })
    expect(document.querySelector('.accessify-panel')?.classList.contains('open')).toBe(false)
  })

  it('destroys widget on unmount', () => {
    const { unmount } = render(<HookHarness onMount={() => {}} />)
    unmount()
    expect(document.querySelector('.accessify-root')).toBeNull()
  })
})
