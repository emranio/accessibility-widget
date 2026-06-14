import { __iconNode as aLargeSmallIcon } from 'lucide-react/dist/esm/icons/a-large-small.mjs'
import { __iconNode as betweenHorizontalStartIcon } from 'lucide-react/dist/esm/icons/between-horizontal-start.mjs'
import { __iconNode as betweenVerticalStartIcon } from 'lucide-react/dist/esm/icons/between-vertical-start.mjs'
import { __iconNode as bookOpenTextIcon } from 'lucide-react/dist/esm/icons/book-open-text.mjs'
import { __iconNode as brainIcon } from 'lucide-react/dist/esm/icons/brain.mjs'
import { __iconNode as chevronDownIcon } from 'lucide-react/dist/esm/icons/chevron-down.mjs'
import { __iconNode as chevronUpIcon } from 'lucide-react/dist/esm/icons/chevron-up.mjs'
import { __iconNode as circleIcon } from 'lucide-react/dist/esm/icons/circle.mjs'
import { __iconNode as circleOffIcon } from 'lucide-react/dist/esm/icons/circle-off.mjs'
import { __iconNode as contrastIcon } from 'lucide-react/dist/esm/icons/contrast.mjs'
import { __iconNode as eyeIcon } from 'lucide-react/dist/esm/icons/eye.mjs'
import { __iconNode as externalLinkIcon } from 'lucide-react/dist/esm/icons/external-link.mjs'
import { __iconNode as focusIcon } from 'lucide-react/dist/esm/icons/focus.mjs'
import { __iconNode as headingIcon } from 'lucide-react/dist/esm/icons/heading.mjs'
import { __iconNode as imageOffIcon } from 'lucide-react/dist/esm/icons/image-off.mjs'
import { __iconNode as keyboardIcon } from 'lucide-react/dist/esm/icons/keyboard.mjs'
import { __iconNode as landmarkIcon } from 'lucide-react/dist/esm/icons/landmark.mjs'
import { __iconNode as layersIcon } from 'lucide-react/dist/esm/icons/layers.mjs'
import { __iconNode as linkIcon } from 'lucide-react/dist/esm/icons/link.mjs'
import { __iconNode as monitorPauseIcon } from 'lucide-react/dist/esm/icons/monitor-pause.mjs'
import { __iconNode as moonIcon } from 'lucide-react/dist/esm/icons/moon.mjs'
import { __iconNode as mousePointer2Icon } from 'lucide-react/dist/esm/icons/mouse-pointer-2.mjs'
import { __iconNode as moveHorizontalIcon } from 'lucide-react/dist/esm/icons/move-horizontal.mjs'
import { __iconNode as paletteIcon } from 'lucide-react/dist/esm/icons/palette.mjs'
import { __iconNode as rotateCcwIcon } from 'lucide-react/dist/esm/icons/rotate-ccw.mjs'
import { __iconNode as rows3Icon } from 'lucide-react/dist/esm/icons/rows-3.mjs'
import { __iconNode as scanEyeIcon } from 'lucide-react/dist/esm/icons/scan-eye.mjs'
import { __iconNode as sunIcon } from 'lucide-react/dist/esm/icons/sun.mjs'
import { __iconNode as textAlignCenterIcon } from 'lucide-react/dist/esm/icons/text-align-center.mjs'
import { __iconNode as textAlignEndIcon } from 'lucide-react/dist/esm/icons/text-align-end.mjs'
import { __iconNode as textAlignJustifyIcon } from 'lucide-react/dist/esm/icons/text-align-justify.mjs'
import { __iconNode as textAlignStartIcon } from 'lucide-react/dist/esm/icons/text-align-start.mjs'
import { __iconNode as textInitialIcon } from 'lucide-react/dist/esm/icons/text-initial.mjs'
import { __iconNode as venetianMaskIcon } from 'lucide-react/dist/esm/icons/venetian-mask.mjs'
import { __iconNode as wholeWordIcon } from 'lucide-react/dist/esm/icons/whole-word.mjs'
import { __iconNode as xIcon } from 'lucide-react/dist/esm/icons/x.mjs'
import { __iconNode as zapIcon } from 'lucide-react/dist/esm/icons/zap.mjs'
import { __iconNode as zoomInIcon } from 'lucide-react/dist/esm/icons/zoom-in.mjs'

type LucideIconNode = Array<[tag: string, attrs: Record<string, string>]>

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

function attrsToString(attrs: Record<string, string>): string {
  return Object.entries(attrs)
    .filter(([name]) => name !== 'key')
    .map(([name, value]) => `${name}="${escapeAttr(String(value))}"`)
    .join(' ')
}

const lucideSvg = (node: LucideIconNode): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${node
    .map(([tag, attrs]) => `<${tag} ${attrsToString(attrs)}/>`)
    .join('')}</svg>`

const triggerSvg = (): string =>
  '<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 100 131.3" part="accessibility-widget-trigger-icon-svg" data-testid="accessibility-widget-base-icon-svg" style="display: inline-flex;"><path xmlns="http://www.w3.org/2000/svg" d="M71.6 131.3c1 0 2.1-.3 3.1-.8 3.9-1.8 5.5-6.2 3.6-10.1 0 0-14.3-32.7-16.9-44.7-1-4.2-1.6-15.3-1.8-20.5 0-1.8 1-3.4 2.6-3.9l32-9.6c3.9-1 6.2-5.5 5.2-9.4s-5.5-6.2-9.4-5.2c0 0-29.6 9.6-40.3 9.6-10.4 0-39.8-9.4-39.8-9.4-3.9-1-8.3.8-9.6 4.7-1.3 4.2 1 8.6 5.2 9.6l32 9.6c1.6.5 2.9 2.1 2.6 3.9-.3 5.2-.8 16.4-1.8 20.5-2.6 12-16.9 44.7-16.9 44.7-1.8 3.9 0 8.3 3.6 10.1 1 .5 2.1.8 3.1.8 2.9 0 5.7-1.6 6.8-4.4l15.3-31.2L64.8 127c1.3 2.7 3.9 4.3 6.8 4.3"></path><circle xmlns="http://www.w3.org/2000/svg" cx="50.3" cy="14.6" r="14.6" style="fill:#fff"></circle></svg>'

export const ICONS = {
  trigger: triggerSvg(),
  close: lucideSvg(xIcon),
  chevronUp: lucideSvg(chevronUpIcon),
  chevronDown: lucideSvg(chevronDownIcon),
  reset: lucideSvg(rotateCcwIcon),

  // Product and profile icons.
  wheelchair: triggerSvg(),
  seizure: lucideSvg(zapIcon),
  vision: lucideSvg(eyeIcon),
  adhd: lucideSvg(focusIcon),
  cognitive: lucideSvg(brainIcon),
  keyboard: lucideSvg(keyboardIcon),
  colorBlind: lucideSvg(paletteIcon),
  dyslexia: lucideSvg(bookOpenTextIcon),

  // Content adjustments.
  legibleFonts: lucideSvg(textInitialIcon),
  dyslexiaFriendlyFont: lucideSvg(wholeWordIcon),
  highlightTitles: lucideSvg(headingIcon),
  fontSizing: lucideSvg(aLargeSmallIcon),
  textMagnifier: lucideSvg(zoomInIcon),
  readingLens: lucideSvg(scanEyeIcon),
  bigCursor: lucideSvg(mousePointer2Icon),
  readingMask: lucideSvg(rows3Icon),
  readingGuide: lucideSvg(moveHorizontalIcon),
  highlightLinks: lucideSvg(linkIcon),
  lineHeight: lucideSvg(betweenVerticalStartIcon),
  letterSpacing: lucideSvg(betweenHorizontalStartIcon),
  textAlignLeft: lucideSvg(textAlignStartIcon),
  textAlignCenter: lucideSvg(textAlignCenterIcon),
  textAlignRight: lucideSvg(textAlignEndIcon),
  textAlignJustify: lucideSvg(textAlignJustifyIcon),
  pageStructure: lucideSvg(layersIcon),
  structureLandmark: lucideSvg(landmarkIcon),
  structureLink: lucideSvg(linkIcon),
  structureExternal: lucideSvg(externalLinkIcon),

  // Visual adjustments.
  darkContrast: lucideSvg(moonIcon),
  lightContrast: lucideSvg(sunIcon),
  highContrast: lucideSvg(contrastIcon),
  monochrome: lucideSvg(circleIcon),
  invertColors: lucideSvg(circleOffIcon),
  colorBlindVisual: lucideSvg(venetianMaskIcon),
  hideImages: lucideSvg(imageOffIcon),
  offAnimations: lucideSvg(monitorPauseIcon),
}
