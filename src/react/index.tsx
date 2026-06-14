import { useEffect, useRef, useState, useCallback } from 'react'
import {
  AccessibilityWidget as AccessibilityWidgetCore,
  type AccessibilityWidgetConfig,
  type AccessibilityWidgetState,
} from '../core'

export type AccessibilityWidgetProps = AccessibilityWidgetConfig
export type ReactAccessibilityWidgetProps = AccessibilityWidgetProps

export function AccessibilityWidget(props: AccessibilityWidgetProps) {
  const instanceRef = useRef<AccessibilityWidgetCore | null>(null)
  const propsRef = useRef<AccessibilityWidgetProps>(props)
  propsRef.current = props

  useEffect(() => {
    const instance = new AccessibilityWidgetCore(propsRef.current)
    instanceRef.current = instance
    instance.mount()

    return () => {
      instance.destroy()
      instanceRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!instanceRef.current) return
    if (props.colorScheme) instanceRef.current.setColorScheme(props.colorScheme)
  }, [props.colorScheme])

  useEffect(() => {
    if (!instanceRef.current) return
    if (props.lang) instanceRef.current.setLang(props.lang)
  }, [props.lang])

  useEffect(() => {
    if (!instanceRef.current) return
    if (props.size) instanceRef.current.setSize(props.size)
  }, [props.size])

  useEffect(() => {
    if (!instanceRef.current) return
    if (props.triggerScheme) instanceRef.current.setTriggerScheme(props.triggerScheme)
  }, [props.triggerScheme])

  useEffect(() => {
    if (!instanceRef.current) return
    instanceRef.current.setTitle(props.title)
  }, [props.title])

  useEffect(() => {
    if (!instanceRef.current) return
    instanceRef.current.setAccentColor(props.accentColor)
  }, [props.accentColor])

  useEffect(() => {
    if (!instanceRef.current) return
    instanceRef.current.setTheme(props.theme)
  }, [props.theme])

  return null
}

export const ReactAccessibilityWidget = AccessibilityWidget

export function useAccessibilityWidget(config: AccessibilityWidgetConfig = {}) {
  const instanceRef = useRef<AccessibilityWidgetCore | null>(null)
  const [state, setState] = useState<AccessibilityWidgetState | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const instance = new AccessibilityWidgetCore(config)
    instanceRef.current = instance
    instance.mount()
    setState(instance.getState())
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
  }, [])

  const open = useCallback(() => {
    instanceRef.current?.open()
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    instanceRef.current?.close()
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    instanceRef.current?.toggle()
    setIsOpen(prev => !prev)
  }, [])

  const reset = useCallback(() => {
    instanceRef.current?.reset()
    if (instanceRef.current) {
      setState(instanceRef.current.getState())
    }
  }, [])

  const setTitle = useCallback((title?: string) => {
    instanceRef.current?.setTitle(title)
  }, [])

  const setAccentColor = useCallback((accentColor?: string) => {
    instanceRef.current?.setAccentColor(accentColor)
  }, [])

  const setTheme = useCallback((theme?: AccessibilityWidgetConfig['theme']) => {
    instanceRef.current?.setTheme(theme)
  }, [])

  return { open, close, toggle, reset, setTitle, setAccentColor, setTheme, state, isOpen }
}

export type {
  AccessibilityWidgetConfig,
  AccessibilityWidgetState,
} from '../core'
