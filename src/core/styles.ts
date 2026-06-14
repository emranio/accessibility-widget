export const STYLE_ID = 'accessify-styles'

export interface StyleVars {
  primary: string
  primaryDark: string
  background: string
  text: string
  border: string
  muted: string
  surface: string
}

export const DEFAULT_VARS: StyleVars = {
  primary: '#0c0c0c',
  primaryDark: '#18181b',
  background: '#ffffff',
  text: '#0c0c0c',
  border: '#e4e4e7',
  muted: '#71717a',
  surface: '#f4f4f5',
}

export function buildStyles(vars: StyleVars): string {
  return `
@font-face {
  font-family: "Accessify Lexend";
  src: url("/accessibility-widget/fonts/lexend-regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessify Lexend";
  src: url("/accessibility-widget/fonts/lexend-bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessify Atkinson Hyperlegible";
  src: url("/accessibility-widget/fonts/atkinson-hyperlegible-regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessify Atkinson Hyperlegible";
  src: url("/accessibility-widget/fonts/atkinson-hyperlegible-bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.accessify-root {
  --acc-primary: ${vars.primary};
  --acc-primary-dark: ${vars.primaryDark};
  --acc-bg: ${vars.background};
  --acc-text: ${vars.text};
  --acc-border: ${vars.border};
  --acc-muted: ${vars.muted};
  --acc-surface: ${vars.surface};
  --acc-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--acc-text);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
.accessify-root *, .accessify-root *::before, .accessify-root *::after {
  box-sizing: border-box;
}

/* ── Trigger ── */
.accessify-trigger {
  position: fixed;
  z-index: 2147483646;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.08);
  background: var(--acc-trigger-bg, var(--acc-primary));
  color: var(--acc-trigger-icon, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -1px 2px 12px 2px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.accessify-trigger:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}
.accessify-trigger svg { width: 22px; height: 29px; }
.accessify-trigger svg circle,
.accessify-header-icon svg circle {
  fill: currentColor !important;
}
.accessify-trigger[data-position="bottom-right"] { right: 20px; bottom: 20px; }
.accessify-trigger[data-position="bottom-left"]  { left: 20px;  bottom: 20px; }
.accessify-trigger[data-position="top-right"]    { right: 20px; top: 20px; }
.accessify-trigger[data-position="top-left"]     { left: 20px;  top: 20px; }

/* ── Overlay ── */
.accessify-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 2147483646;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.accessify-overlay.open { opacity: 1; pointer-events: auto; }

/* ── Panel ── */
.accessify-panel {
  position: fixed;
  z-index: 2147483647;
  background: var(--acc-bg);
  width: 320px;
  max-width: calc(100vw - 16px);
  height: calc(100vh - 16px);
  max-height: 620px;
  border-radius: 12px;
  border: 1px solid var(--acc-border);
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  transform: translateY(12px) scale(0.98);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.2s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease;
  transform-origin: bottom center;
}
.accessify-panel.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}
.accessify-panel[data-size="S"] { width: 320px; max-height: 620px; }
.accessify-panel[data-size="XL"] { width: 460px; max-height: 920px; }
.accessify-panel[data-position="bottom-right"] { right: 8px; bottom: 8px; transform-origin: bottom right; }
.accessify-panel[data-position="bottom-left"]  { left: 8px;  bottom: 8px; transform-origin: bottom left; }
.accessify-panel[data-position="top-right"]    { right: 8px; top: 8px;    transform-origin: top right; }
.accessify-panel[data-position="top-left"]     { left: 8px;  top: 8px;    transform-origin: top left; }

/* ── Header ── */
.accessify-header {
  background: var(--acc-header-bg, var(--acc-primary));
  color: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.accessify-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.accessify-header-icon {
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.accessify-header-icon svg { width: 18px; height: 18px; }
.accessify-header h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
}
.accessify-header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  max-width: 220px;
}
.accessify-header-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1.15;
}
.accessify-header-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.72);
  letter-spacing: 0.01em;
  line-height: 1.2;
}
.accessify-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.accessify-icon-btn {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s ease, color 0.12s ease;
}
.accessify-icon-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.accessify-icon-btn svg { width: 15px; height: 15px; }

/* ── Body ── */
.accessify-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: var(--acc-bg);
  min-width: 0;
}
.accessify-body::-webkit-scrollbar { width: 6px; }
.accessify-body::-webkit-scrollbar-track { background: transparent; }
.accessify-body::-webkit-scrollbar-thumb { background: var(--acc-border); border-radius: 3px; }

/* ── Section ── */
.accessify-section {
  padding: 16px 18px;
  border-bottom: 1px solid var(--acc-border);
}
.accessify-section:last-child { border-bottom: none; }
.accessify-section--compact { padding: 10px 18px; }
.accessify-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.accessify-section--compact .accessify-section-head { margin-bottom: 0; }
.accessify-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--acc-muted);
}

/* ── Size switch ── */
.accessify-size-switch {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--acc-text);
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
  min-height: 0;
  padding: 0;
  transition: filter 0.12s ease;
}
.accessify-size-switch:hover {
  filter: brightness(0.98);
}
.accessify-size-switch:focus-visible {
  outline: 2px solid var(--acc-primary);
  outline-offset: 3px;
}
.accessify-size-switch-track {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--acc-bg) 92%, var(--acc-surface));
  border: 2px solid color-mix(in srgb, var(--acc-muted) 42%, var(--acc-border));
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 3px;
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}
.accessify-size-switch-option {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  font-size: 15px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.01em;
  color: color-mix(in srgb, var(--acc-muted) 86%, var(--acc-text));
  transition: color 0.16s ease;
}
.accessify-size-switch-thumb {
    position: absolute;
    z-index: 1;
    left: 1px;
    top: 1px;
    background: var(--acc-primary);
    transition: transform 0.16s ease, background 0.16s ease;
    width: 55%;
    height: 26px;
    border-radius: 3rem;
}
.accessify-size-switch[aria-checked="true"] .accessify-size-switch-track {
  border-color: color-mix(in srgb, var(--acc-primary) 42%, var(--acc-border));
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
}
.accessify-size-switch[aria-checked="true"] .accessify-size-switch-thumb {
  transform: translateX(25px);
}
.accessify-size-switch[aria-checked="false"] .accessify-size-switch-option--s,
.accessify-size-switch[aria-checked="true"] .accessify-size-switch-option--l {
  color: var(--acc-bg);
}

/* ── Profile cards ── */
.accessify-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.accessify-grid-3 { grid-template-columns: repeat(3, 1fr); }
[data-size="S"] .accessify-grid-3 { grid-template-columns: repeat(2, 1fr); }
.accessify-grid > *, .accessify-grid-3 > * { min-width: 0; }

.accessify-card {
  border: 1px solid var(--acc-border);
  border-radius: var(--acc-radius);
  padding: 10px 12px;
  background: var(--acc-bg);
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  transition: border-color 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 52px;
}
.accessify-card:hover {
  background: var(--acc-surface);
  border-color: #a1a1aa;
}
.accessify-card[aria-pressed="true"] {
  border-color: var(--acc-primary);
  background: var(--acc-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.accessify-card[aria-pressed="true"] .icon { color: rgba(255,255,255,0.85); }
.accessify-card[aria-pressed="true"]:hover { background: var(--acc-primary); border-color: var(--acc-primary); }
.accessify-card[aria-pressed="true"]:hover .icon { color: #fff; }
.accessify-card .icon { width: 22px; height: 22px; color: var(--acc-muted); flex-shrink: 0; transition: color 0.12s ease; }
.accessify-card:not([aria-pressed="true"]):hover .icon { color: var(--acc-text); }
.accessify-card .icon svg { width: 100%; height: 100%; }
.accessify-card .label { font-size: 12px; font-weight: 500; line-height: 1.3; min-width: 0; overflow-wrap: break-word; }

/* ── Tiles (content & color adjustments) ── */
.accessify-tile {
  border: 1px solid var(--acc-border);
  border-radius: var(--acc-radius);
  padding: 14px 10px 12px;
  background: var(--acc-bg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition: border-color 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
  min-height: 118px;
  width: 100%;
}
.accessify-tile:hover {
  background: var(--acc-surface);
  border-color: #a1a1aa;
}
.accessify-tile[aria-pressed="true"] {
  border-color: var(--acc-primary);
  background: var(--acc-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.accessify-tile[aria-pressed="true"] .icon { color: rgba(255,255,255,0.85); }
.accessify-tile[aria-pressed="true"]:hover { background: var(--acc-primary); border-color: var(--acc-primary); }
.accessify-tile[aria-pressed="true"]:hover .icon { color: #fff; }
.accessify-tile .icon { width: 28px; height: 28px; color: var(--acc-muted); transition: color 0.12s ease; }
.accessify-tile:not([aria-pressed="true"]):hover .icon { color: var(--acc-text); }
.accessify-tile .icon svg { width: 100%; height: 100%; }
.accessify-tile .label { font-size: 11px; font-weight: 500; line-height: 1.25; overflow-wrap: break-word; width: 100%; text-align: center; color: inherit; }
.accessify-levels {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  max-width: 78px;
  margin-top: 2px;
}
.accessify-levels span {
  height: 4px;
  border-radius: 999px;
  background: rgba(12,12,12,0.12);
  transition: background 0.12s ease, transform 0.12s ease;
}
.accessify-levels span.active {
  background: var(--acc-primary);
  transform: scaleY(1.15);
}
.accessify-tile[aria-pressed="true"] .accessify-levels span {
  background: rgba(255,255,255,0.25);
}
.accessify-tile[aria-pressed="true"] .accessify-levels span.active {
  background: #fff;
}

/* ── Page structure dialog ── */
.accessify-structure-layer {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
}
.accessify-structure-layer[hidden] { display: none; }
.accessify-structure-dialog {
  position: fixed;
  top: 24px;
  bottom: 24px;
  left: clamp(16px, 5vw, 80px);
  width: min(920px, calc(100vw - 420px));
  min-width: min(640px, calc(100vw - 32px));
  background: var(--acc-bg);
  color: var(--acc-text);
  border-radius: 14px;
  border: 1px solid var(--acc-border);
  box-shadow: 0 20px 56px rgba(0,0,0,0.22);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}
.accessify-structure-header {
  min-height: 62px;
  padding: 14px 22px;
  background: var(--acc-primary);
  color: var(--acc-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.accessify-structure-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.accessify-structure-close {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s ease, transform 0.12s ease;
}
.accessify-structure-close:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
  transform: scale(1.04);
}
.accessify-structure-close svg {
  width: 20px;
  height: 20px;
}
.accessify-structure-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid var(--acc-border);
  background: var(--acc-bg);
}
.accessify-structure-tab {
  min-height: 50px;
  border: 0;
  border-inline-end: 1px solid var(--acc-border);
  background: transparent;
  color: var(--acc-muted);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.01em;
  position: relative;
  transition: background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
}
.accessify-structure-tab:last-child { border-inline-end: 0; }
.accessify-structure-tab:hover {
  background: var(--acc-surface);
  color: var(--acc-text);
}
.accessify-structure-tab[aria-selected="true"] {
  background: var(--acc-bg);
  color: var(--acc-text);
  box-shadow: inset 0 -3px 0 var(--acc-primary);
}
.accessify-structure-list {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: var(--acc-bg);
}
.accessify-structure-item {
  width: 100%;
  min-height: 42px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--acc-text);
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  margin-inline-start: calc(var(--acc-structure-depth, 0) * 22px);
  text-align: left;
  transition: background 0.12s ease, color 0.12s ease;
}
.accessify-structure-item:hover {
  background: var(--acc-surface);
  color: var(--acc-primary);
}
.accessify-structure-badge {
  width: 34px;
  height: 26px;
  border-radius: 7px;
  background: var(--acc-surface);
  border: 1px solid var(--acc-border);
  color: var(--acc-primary);
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.accessify-structure-badge--text {
  background: var(--acc-surface);
  font-size: 11px;
  font-weight: 700;
}
.accessify-structure-badge svg {
  width: 16px;
  height: 16px;
}
.accessify-structure-item-label {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 1.25;
}
.accessify-structure-external {
  flex: 0 0 auto;
  display: inline-flex;
  color: var(--acc-primary);
}
.accessify-structure-external svg {
  width: 14px;
  height: 14px;
}
.accessify-structure-empty {
  padding: 28px 12px;
  color: var(--acc-muted);
  font-size: 13px;
}

/* ── Reset bar ── */
.accessify-reset-bar {
  padding: 12px 18px;
  border-top: 1px solid var(--acc-border);
  flex-shrink: 0;
  background: var(--acc-bg);
}
.accessify-reset-btn {
  width: 100%;
  height: 34px;
  border-radius: var(--acc-radius);
  border: 1px solid var(--acc-border);
  background: var(--acc-bg);
  color: var(--acc-text);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  transition: background 0.12s ease, border-color 0.12s ease;
}
.accessify-reset-btn:hover { background: var(--acc-surface); border-color: #a1a1aa; }
.accessify-reset-btn svg { width: 14px; height: 14px; color: var(--acc-muted); }

/* ── Applied host effects ── */
#accessify-host.acc-legible-fonts, #accessify-host.acc-legible-fonts * {
  font-family: var(--acc-legible-font-family), Tahoma, Verdana, Arial, sans-serif !important;
  letter-spacing: var(--acc-legible-letter-spacing, 0em) !important;
  word-spacing: var(--acc-legible-word-spacing, 0em) !important;
}
#accessify-host.acc-dyslexia, #accessify-host.acc-dyslexia * {
  font-family: "Accessify Lexend", Tahoma, Verdana, Arial, sans-serif !important;
  letter-spacing: 0.04em !important;
  word-spacing: 0.03em !important;
}
#accessify-host.acc-highlight-titles h1,
#accessify-host.acc-highlight-titles h2,
#accessify-host.acc-highlight-titles h3,
#accessify-host.acc-highlight-titles h4,
#accessify-host.acc-highlight-titles h5,
#accessify-host.acc-highlight-titles h6 {
  outline: var(--acc-title-outline-width, 2px) solid #f59e0b !important;
  outline-offset: 2px !important;
  background: rgba(245,158,11,var(--acc-title-highlight-alpha, 0.07)) !important;
}
#accessify-host.acc-highlight-links a {
  outline: var(--acc-link-outline-width, 2px) solid #3b82f6 !important;
  outline-offset: 2px !important;
  background: rgba(59,130,246,var(--acc-link-highlight-alpha, 0.07)) !important;
  text-decoration: underline !important;
  text-decoration-thickness: var(--acc-link-underline-width, 1px) !important;
}
#accessify-host.acc-dark-contrast {
  background: var(--acc-dark-contrast-bg, #000) !important;
  color: var(--acc-dark-contrast-text, #fff) !important;
}
#accessify-host.acc-dark-contrast * {
  background-color: transparent !important;
  color: var(--acc-dark-contrast-text, #fff) !important;
  border-color: var(--acc-dark-contrast-border, #333) !important;
}
#accessify-host.acc-light-contrast {
  background: var(--acc-light-contrast-bg, #fff) !important;
  color: var(--acc-light-contrast-text, #000) !important;
}
#accessify-host.acc-light-contrast * {
  background-color: transparent !important;
  color: var(--acc-light-contrast-text, #000) !important;
  border-color: var(--acc-light-contrast-border, #475569) !important;
}
#accessify-host.acc-high-contrast {
  background: var(--acc-high-contrast-bg, #000) !important;
  color: var(--acc-high-contrast-text, #ff0) !important;
}
#accessify-host.acc-high-contrast * {
  background-color: var(--acc-high-contrast-bg, #000) !important;
  color: var(--acc-high-contrast-text, #ff0) !important;
  border-color: var(--acc-high-contrast-border, #ff0) !important;
}
#accessify-host.acc-monochrome { filter: grayscale(var(--acc-monochrome-amount, 100%)) !important; }
#accessify-host.acc-invert { filter: invert(var(--acc-invert-amount, 100%)) hue-rotate(180deg) !important; }
#accessify-host.acc-color-blind {
  filter:
    url('#acc-protanopia')
    saturate(var(--acc-color-blind-saturate, 0.85))
    contrast(var(--acc-color-blind-contrast, 1)) !important;
}
#accessify-host.acc-hide-images img,
#accessify-host.acc-hide-images picture {
  visibility: hidden !important;
}
#accessify-host.acc-off-animations,
#accessify-host.acc-off-animations *,
#accessify-host.acc-off-animations *::before,
#accessify-host.acc-off-animations *::after {
  animation-delay: 0s !important;
  animation-duration: 0.001ms !important;
  animation-iteration-count: 1 !important;
  scroll-behavior: auto !important;
  transition-delay: 0s !important;
  transition-duration: 0.001ms !important;
}

/* ── Keyboard Navigation profile ──
   Strong, always-visible focus rings on every interactive element so
   keyboard users can clearly see what's focused. */
#accessify-host.acc-keyboard-nav a:focus,
#accessify-host.acc-keyboard-nav button:focus,
#accessify-host.acc-keyboard-nav input:focus,
#accessify-host.acc-keyboard-nav select:focus,
#accessify-host.acc-keyboard-nav textarea:focus,
#accessify-host.acc-keyboard-nav [tabindex]:focus,
#accessify-host.acc-keyboard-nav summary:focus,
#accessify-host.acc-keyboard-nav [role="button"]:focus,
#accessify-host.acc-keyboard-nav [role="link"]:focus {
  outline: 3px solid #2563eb !important;
  outline-offset: 3px !important;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25) !important;
  border-radius: 2px;
}
#accessify-host.acc-keyboard-nav a:hover,
#accessify-host.acc-keyboard-nav button:hover {
  outline: 2px dashed #2563eb !important;
  outline-offset: 2px !important;
}

.acc-magnify-cursor {
  position: fixed;
  box-sizing: border-box;
  pointer-events: none;
  z-index: 2147483645;
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 18px;
  max-width: 280px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  color: #0c0c0c;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* ── Reading lens (circular zoom that follows the cursor) ── */
.acc-reading-lens {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2147483645;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  background: #fff;
  border: 4px solid #0c0c0c;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.6),
    0 16px 40px rgba(0,0,0,0.40),
    inset 0 0 0 1px rgba(255,255,255,0.4);
  will-change: transform;
  contain: layout paint;
}
.acc-reading-lens::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: inset 0 0 24px rgba(0,0,0,0.10);
}
.acc-reading-lens-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
  will-change: transform;
}
.acc-reading-lens-inner > * {
  margin: 0 !important;
}
.acc-reading-lens-inner,
.acc-reading-lens-inner *,
.acc-reading-lens-inner *::before,
.acc-reading-lens-inner *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

/* ── Reading mask (clear horizontal band with shaded surroundings) ── */
.acc-reading-mask {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483644;
}
.acc-reading-mask-panel {
  position: fixed;
  left: 0;
  right: 0;
  background: rgba(0,0,0,var(--acc-reading-mask-opacity, 0.45));
}
.acc-reading-mask-top {
  top: 0;
  border-bottom: 3px solid var(--acc-reading-mask-edge, #10b981);
}
.acc-reading-mask-bottom {
  bottom: 0;
  border-top: 3px solid var(--acc-reading-mask-edge, #10b981);
}

/* ── Reading guide (high-contrast rule that follows the cursor) ── */
.acc-reading-guide {
  position: fixed;
  left: 0;
  width: 100vw;
  height: var(--acc-reading-guide-height, 8px);
  border: var(--acc-reading-guide-border, 3px) solid var(--acc-reading-guide-edge, #facc15);
  border-radius: 999px;
  background: var(--acc-reading-guide-fill, #0c0c0c);
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.28),
    0 0 18px var(--acc-reading-guide-glow, rgba(250,204,21,0.34));
  pointer-events: none;
  z-index: 2147483645;
}
.acc-reading-guide-pointer {
  position: absolute;
  left: var(--acc-reading-guide-x, 50vw);
  top: -24px;
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-bottom: 18px solid var(--acc-reading-guide-edge, #facc15);
}
.acc-reading-guide-pointer::after {
  content: '';
  position: absolute;
  left: -12px;
  top: 7px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid var(--acc-reading-guide-fill, #0c0c0c);
}

.accessify-root :focus-visible {
  outline: 2px solid var(--acc-primary);
  outline-offset: 2px;
}

/* ── Skip link ── */
.accessify-skip-link {
  position: fixed;
  top: -100%;
  left: 8px;
  z-index: 2147483647;
  padding: 8px 16px;
  background: #0c0c0c;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 0 0 var(--acc-radius, 8px) var(--acc-radius, 8px);
  text-decoration: none;
  transition: top 0.15s ease;
}
.accessify-skip-link:focus {
  top: 0;
  outline: 2px solid #fff;
  outline-offset: -4px;
}

/* ── Dark mode ── */
/* Explicit light override — wins over OS preference and data-scheme="dark" */
.accessify-root[data-scheme="light"] {
  --acc-primary: #0c0c0c;
  --acc-primary-dark: #18181b;
  --acc-bg: #ffffff;
  --acc-text: #0c0c0c;
  --acc-border: #e4e4e7;
  --acc-muted: #71717a;
  --acc-surface: #f4f4f5;
}
.accessify-root[data-scheme="dark"] {
  --acc-primary: #fafafa;
  --acc-primary-dark: #e4e4e7;
  --acc-bg: #0c0c0c;
  --acc-text: #fafafa;
  --acc-border: #27272a;
  --acc-muted: #71717a;
  --acc-surface: #18181b;
}
.accessify-root[data-scheme="dark"] .accessify-header {
  background: var(--acc-header-bg, #18181b);
  border-bottom-color: rgba(255,255,255,0.06);
}
.accessify-root[data-scheme="dark"] .accessify-trigger {
  background: var(--acc-trigger-bg, #fafafa);
  color: var(--acc-trigger-icon, #0c0c0c);
  border-color: rgba(0,0,0,0.12);
}
.accessify-root[data-scheme="dark"] .accessify-reset-bar { background: #0c0c0c; }
.accessify-root[data-scheme="dark"] .acc-magnify-cursor {
  background: #18181b;
  border-color: #27272a;
  color: #fafafa;
}
.accessify-root[data-scheme="dark"] .accessify-card[aria-pressed="true"],
.accessify-root[data-scheme="dark"] .accessify-tile[aria-pressed="true"] {
  background: var(--acc-primary);
  color: #0c0c0c;
  border-color: var(--acc-primary);
}
.accessify-root[data-scheme="dark"] .accessify-card[aria-pressed="true"] .icon,
.accessify-root[data-scheme="dark"] .accessify-tile[aria-pressed="true"] .icon { color: rgba(0,0,0,0.75); }
.accessify-root[data-scheme="dark"] .accessify-card[aria-pressed="true"]:hover,
.accessify-root[data-scheme="dark"] .accessify-tile[aria-pressed="true"]:hover { background: var(--acc-primary); }
.accessify-root[data-scheme="dark"] .accessify-size-switch-track {
  background: var(--acc-surface);
  box-shadow: inset 0 0 0 1px var(--acc-border);
}
.accessify-root[data-scheme="dark"] .accessify-structure-dialog {
  background: var(--acc-bg);
  color: var(--acc-text);
  border-color: var(--acc-border);
}
.accessify-root[data-scheme="dark"] .accessify-structure-header {
  background: var(--acc-surface);
  color: var(--acc-text);
}
.accessify-root[data-scheme="dark"] .accessify-structure-tabs {
  background: var(--acc-bg);
  border-bottom-color: var(--acc-border);
}
.accessify-root[data-scheme="dark"] .accessify-structure-tab {
  border-inline-end-color: var(--acc-border);
  color: var(--acc-muted);
}
.accessify-root[data-scheme="dark"] .accessify-structure-tab[aria-selected="true"] {
  background: var(--acc-bg);
  color: var(--acc-text);
}
.accessify-root[data-scheme="dark"] .accessify-structure-item {
  color: var(--acc-text);
}
.accessify-root[data-scheme="dark"] .accessify-structure-item:hover {
  background: var(--acc-surface);
  color: var(--acc-primary);
}
.accessify-root[data-scheme="dark"] .accessify-structure-external {
  color: var(--acc-primary);
}
@media (max-width: 900px) {
  .accessify-structure-dialog {
    inset: 12px;
    width: auto;
    min-width: 0;
  }
  .accessify-structure-header {
    min-height: 64px;
    padding: 14px 18px;
  }
  .accessify-structure-tab {
    min-height: 46px;
    font-size: 13px;
  }
  .accessify-structure-list {
    padding: 12px;
  }
  .accessify-structure-item {
    margin-inline-start: calc(var(--acc-structure-depth, 0) * 12px);
  }
  .accessify-structure-item-label {
    font-size: 14px;
  }
}
`
}
