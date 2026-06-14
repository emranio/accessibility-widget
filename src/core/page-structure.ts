import { ICONS } from './icons'
import type { PageStructureData, PageStructureItem, PageStructureTab } from './types'
import type { Translations } from './i18n'

const STRUCTURE_TARGET_ATTR = 'data-accessibility-widget-structure-id'
const MAX_ITEMS = 80
let structureTargetId = 0

const LANDMARK_SELECTOR = [
  'header',
  'nav',
  'main',
  'footer',
  'aside',
  'section',
  'article',
  'form',
  '[role="banner"]',
  '[role="navigation"]',
  '[role="main"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  '[role="region"]',
  '[role="search"]',
  '[role="form"]',
  '[role="article"]',
].join(',')

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function targetIdFor(el: Element): string {
  const existing = el.getAttribute(STRUCTURE_TARGET_ATTR)
  if (existing) return existing
  const id = `accessibility-widget-structure-${++structureTargetId}`
  el.setAttribute(STRUCTURE_TARGET_ATTR, id)
  return id
}

function pageRoot(): HTMLElement {
  return document.getElementById('accessibility-widget-host') ?? document.body
}

function isIgnored(el: Element): boolean {
  return Boolean(el.closest('.accessibility-widget-root, script, style, template, [hidden], [aria-hidden="true"]'))
}

function isVisible(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false
  if (isIgnored(el)) return false
  const style = getComputedStyle(el)
  return style.display !== 'none' && style.visibility !== 'hidden'
}

function cleanText(value: string | null | undefined): string {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function labelledByText(el: Element): string {
  const ids = cleanText(el.getAttribute('aria-labelledby')).split(' ').filter(Boolean)
  return ids.map(id => cleanText(document.getElementById(id)?.textContent)).filter(Boolean).join(' ')
}

function accessibleName(el: Element): string {
  return cleanText(el.getAttribute('aria-label')) ||
    labelledByText(el) ||
    cleanText(el.getAttribute('title'))
}

function elementText(el: Element): string {
  return accessibleName(el) || cleanText(el.textContent)
}

function linkLabel(el: HTMLAnchorElement, fallback: string): string {
  return elementText(el) || cleanText(el.href) || fallback
}

function landmarkKind(el: Element): string {
  const role = cleanText(el.getAttribute('role')).toLowerCase()
  if (role === 'banner') return 'Header'
  if (role === 'navigation') return 'Navigation'
  if (role === 'main') return 'Main'
  if (role === 'contentinfo') return 'Footer'
  if (role === 'complementary') return 'Aside'
  if (role === 'search') return 'Search'
  if (role === 'form') return 'Form'
  if (role === 'article') return 'Article'
  if (role === 'region') return 'Section'

  const tag = el.tagName.toLowerCase()
  if (tag === 'nav') return 'Navigation'
  if (tag === 'main') return 'Main'
  if (tag === 'footer') return 'Footer'
  if (tag === 'aside') return 'Aside'
  return tag.charAt(0).toUpperCase() + tag.slice(1)
}

function firstHeadingText(el: Element): string {
  return cleanText(el.querySelector('h1,h2,h3,h4,h5,h6')?.textContent)
}

function landmarkLabel(el: Element): string {
  const kind = landmarkKind(el)
  const name = accessibleName(el) || firstHeadingText(el)
  return name ? `${kind}: ${name}` : kind
}

function landmarkDepth(el: Element, root: HTMLElement): number {
  let depth = 0
  let parent = el.parentElement
  while (parent && parent !== root) {
    if (parent.matches(LANDMARK_SELECTOR) && isVisible(parent)) depth++
    parent = parent.parentElement
  }
  return Math.min(depth, 5)
}

function isExternalLink(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === '_blank') return true
  try {
    return new URL(anchor.href, location.href).origin !== location.origin
  } catch {
    return false
  }
}

export function collectPageStructure(t: Translations): PageStructureData {
  if (typeof document === 'undefined') {
    return { headings: [], landmarks: [], links: [] }
  }

  const root = pageRoot()
  const headings = Array.from(root.querySelectorAll<HTMLHeadingElement>('h1,h2,h3,h4,h5,h6'))
    .filter(isVisible)
    .slice(0, MAX_ITEMS)
    .map((heading): PageStructureItem => {
      const level = Number(heading.tagName.slice(1))
      return {
        id: targetIdFor(heading),
        label: elementText(heading) || t.untitledHeading,
        meta: `H${level}`,
        depth: Math.max(0, level - 1),
      }
    })

  const landmarks = Array.from(root.querySelectorAll<HTMLElement>(LANDMARK_SELECTOR))
    .filter(isVisible)
    .slice(0, MAX_ITEMS)
    .map((landmark): PageStructureItem => ({
      id: targetIdFor(landmark),
      label: landmarkLabel(landmark),
      meta: landmarkKind(landmark),
      depth: landmarkDepth(landmark, root),
    }))

  const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .filter(isVisible)
    .slice(0, MAX_ITEMS)
    .map((anchor): PageStructureItem => ({
      id: targetIdFor(anchor),
      label: linkLabel(anchor, t.untitledLink),
      meta: 'Link',
      external: isExternalLink(anchor),
    }))

  return { headings, landmarks, links }
}

function tabLabel(tab: PageStructureTab, t: Translations): string {
  if (tab === 'landmarks') return t.structureLandmarks
  if (tab === 'links') return t.structureLinks
  return t.structureHeadings
}

function renderTabs(activeTab: PageStructureTab, t: Translations): string {
  const tabs: PageStructureTab[] = ['headings', 'landmarks', 'links']
  return `
    <div class="accessibility-widget-structure-tabs" role="tablist" aria-label="${escapeHtml(t.pageStructure)}">
      ${tabs.map(tab => `
        <button type="button" class="accessibility-widget-structure-tab" role="tab" data-structure-tab="${tab}" aria-selected="${activeTab === tab}">
          ${escapeHtml(tabLabel(tab, t))}
        </button>
      `).join('')}
    </div>
  `
}

function renderBadge(tab: PageStructureTab, item: PageStructureItem): string {
  if (tab === 'headings') {
    return `<span class="accessibility-widget-structure-badge accessibility-widget-structure-badge--text">${escapeHtml(item.meta)}</span>`
  }
  const icon = tab === 'links' ? ICONS.structureLink : ICONS.structureLandmark
  return `<span class="accessibility-widget-structure-badge">${icon}</span>`
}

function renderItems(items: PageStructureItem[], activeTab: PageStructureTab, t: Translations): string {
  if (items.length === 0) {
    return `<div class="accessibility-widget-structure-empty">${escapeHtml(t.noStructureItems)}</div>`
  }

  return items.map(item => `
    <button type="button" class="accessibility-widget-structure-item" data-structure-target="${escapeHtml(item.id)}" style="--accessibility-widget-structure-depth:${item.depth ?? 0}">
      ${renderBadge(activeTab, item)}
      <span class="accessibility-widget-structure-item-label">${escapeHtml(item.label)}</span>
      ${item.external ? `<span class="accessibility-widget-structure-external">${ICONS.structureExternal}</span>` : ''}
    </button>
  `).join('')
}

export function renderPageStructureDialog(
  data: PageStructureData,
  activeTab: PageStructureTab,
  t: Translations,
  lang: string,
): string {
  const dir = lang === 'ar' ? ' dir="rtl"' : ''
  const items = data[activeTab]

  return `
    <div class="accessibility-widget-structure-dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(t.pageStructure)}"${dir}>
      <div class="accessibility-widget-structure-header">
        <h2>${escapeHtml(t.pageStructure)}</h2>
        <button type="button" class="accessibility-widget-structure-close" data-structure-action="close" aria-label="${escapeHtml(t.close)}">
          ${ICONS.close}
        </button>
      </div>
      ${renderTabs(activeTab, t)}
      <div class="accessibility-widget-structure-list" role="tabpanel" aria-label="${escapeHtml(tabLabel(activeTab, t))}">
        ${renderItems(items, activeTab, t)}
      </div>
    </div>
  `
}
