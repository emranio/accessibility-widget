export const STYLE_ID = 'accessibility-widget-styles'

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
  font-family: "Accessibility Widget Lexend";
  src: url("/accessibility-widget/fonts/lexend-regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessibility Widget Lexend";
  src: url("/accessibility-widget/fonts/lexend-bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessibility Widget Atkinson Hyperlegible";
  src: url("/accessibility-widget/fonts/atkinson-hyperlegible-regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Accessibility Widget Atkinson Hyperlegible";
  src: url("/accessibility-widget/fonts/atkinson-hyperlegible-bold.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

.accessibility-widget-root {
  --accessibility-widget-primary: ${vars.primary};
  --accessibility-widget-primary-dark: ${vars.primaryDark};
  --accessibility-widget-bg: ${vars.background};
  --accessibility-widget-text: ${vars.text};
  --accessibility-widget-border: ${vars.border};
  --accessibility-widget-muted: ${vars.muted};
  --accessibility-widget-surface: ${vars.surface};
  --accessibility-widget-radius: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--accessibility-widget-text);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
.accessibility-widget-root *, .accessibility-widget-root *::before, .accessibility-widget-root *::after {
  box-sizing: border-box;
}

/* ── Trigger ── */
.accessibility-widget-trigger {
  position: fixed;
  z-index: 2147483646;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.08);
  background: var(--accessibility-widget-trigger-bg, var(--accessibility-widget-primary));
  color: var(--accessibility-widget-trigger-icon, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: -1px 2px 12px 2px rgba(0,0,0,0.10);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.accessibility-widget-trigger:hover {
  transform: scale(1.06);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}
.accessibility-widget-trigger svg { width: 22px; height: 29px; }
.accessibility-widget-trigger svg circle,
.accessibility-widget-header-icon svg circle {
  fill: currentColor !important;
}
.accessibility-widget-trigger[data-position="bottom-right"] { right: 20px; bottom: 20px; }
.accessibility-widget-trigger[data-position="bottom-left"]  { left: 20px;  bottom: 20px; }
.accessibility-widget-trigger[data-position="top-right"]    { right: 20px; top: 20px; }
.accessibility-widget-trigger[data-position="top-left"]     { left: 20px;  top: 20px; }

/* ── Overlay ── */
.accessibility-widget-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 2147483646;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
}
.accessibility-widget-overlay.open { opacity: 1; pointer-events: auto; }

/* ── Panel ── */
.accessibility-widget-panel {
  position: fixed;
  z-index: 2147483647;
  background: var(--accessibility-widget-bg);
  width: 320px;
  max-width: calc(100vw - 16px);
  height: calc(100vh - 16px);
  max-height: 620px;
  border-radius: 12px;
  border: 1px solid var(--accessibility-widget-border);
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
.accessibility-widget-panel.open {
  transform: translateY(0) scale(1);
  opacity: 1;
  pointer-events: auto;
}
.accessibility-widget-panel[data-size="S"] { width: 320px; max-height: 620px; }
.accessibility-widget-panel[data-size="XL"] { width: 460px; max-height: 920px; }
.accessibility-widget-panel[data-position="bottom-right"] { right: 8px; bottom: 8px; transform-origin: bottom right; }
.accessibility-widget-panel[data-position="bottom-left"]  { left: 8px;  bottom: 8px; transform-origin: bottom left; }
.accessibility-widget-panel[data-position="top-right"]    { right: 8px; top: 8px;    transform-origin: top right; }
.accessibility-widget-panel[data-position="top-left"]     { left: 8px;  top: 8px;    transform-origin: top left; }

/* ── Header ── */
.accessibility-widget-header {
  background: var(--accessibility-widget-header-bg, var(--accessibility-widget-primary));
  color: #fff;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.accessibility-widget-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.accessibility-widget-header-icon {
  width: 32px;
  height: 32px;
  background: rgba(255,255,255,0.12);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.accessibility-widget-header-icon svg { width: 18px; height: 18px; }
.accessibility-widget-header h2 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1;
}
.accessibility-widget-header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  max-width: 220px;
}
.accessibility-widget-header-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #fff;
  line-height: 1.15;
}
.accessibility-widget-header-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.72);
  letter-spacing: 0.01em;
  line-height: 1.2;
}
.accessibility-widget-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
.accessibility-widget-icon-btn {
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
.accessibility-widget-icon-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.accessibility-widget-icon-btn svg { width: 15px; height: 15px; }

/* ── Body ── */
.accessibility-widget-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  background: var(--accessibility-widget-bg);
  min-width: 0;
}
.accessibility-widget-body::-webkit-scrollbar { width: 6px; }
.accessibility-widget-body::-webkit-scrollbar-track { background: transparent; }
.accessibility-widget-body::-webkit-scrollbar-thumb { background: var(--accessibility-widget-border); border-radius: 3px; }

/* ── Section ── */
.accessibility-widget-section {
  padding: 16px 18px;
  border-bottom: 1px solid var(--accessibility-widget-border);
}
.accessibility-widget-section:last-child { border-bottom: none; }
.accessibility-widget-section--compact { padding: 10px 18px; }
.accessibility-widget-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.accessibility-widget-section--compact .accessibility-widget-section-head { margin-bottom: 0; }
.accessibility-widget-section-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--accessibility-widget-muted);
}

/* ── Size switch ── */
.accessibility-widget-size-switch {
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--accessibility-widget-text);
  cursor: pointer;
  font: inherit;
  display: inline-flex;
  align-items: center;
  min-height: 0;
  padding: 0;
  transition: filter 0.12s ease;
}
.accessibility-widget-size-switch:hover {
  filter: brightness(0.98);
}
.accessibility-widget-size-switch:focus-visible {
  outline: 2px solid var(--accessibility-widget-primary);
  outline-offset: 3px;
}
.accessibility-widget-size-switch-track {
  position: relative;
  width: 64px;
  height: 32px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--accessibility-widget-bg) 92%, var(--accessibility-widget-surface));
  border: 2px solid color-mix(in srgb, var(--accessibility-widget-muted) 42%, var(--accessibility-widget-border));
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 3px;
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
}
.accessibility-widget-size-switch-option {
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
  color: color-mix(in srgb, var(--accessibility-widget-muted) 86%, var(--accessibility-widget-text));
  transition: color 0.16s ease;
}
.accessibility-widget-size-switch-thumb {
    position: absolute;
    z-index: 1;
    left: 1px;
    top: 1px;
    background: var(--accessibility-widget-primary);
    transition: transform 0.16s ease, background 0.16s ease;
    width: 55%;
    height: 26px;
    border-radius: 3rem;
}
.accessibility-widget-size-switch[aria-checked="true"] .accessibility-widget-size-switch-track {
  border-color: color-mix(in srgb, var(--accessibility-widget-primary) 42%, var(--accessibility-widget-border));
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.04);
}
.accessibility-widget-size-switch[aria-checked="true"] .accessibility-widget-size-switch-thumb {
  transform: translateX(25px);
}
.accessibility-widget-size-switch[aria-checked="false"] .accessibility-widget-size-switch-option--s,
.accessibility-widget-size-switch[aria-checked="true"] .accessibility-widget-size-switch-option--l {
  color: var(--accessibility-widget-bg);
}

/* ── Profile cards ── */
.accessibility-widget-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
.accessibility-widget-grid-3 { grid-template-columns: repeat(3, 1fr); }
[data-size="S"] .accessibility-widget-grid-3 { grid-template-columns: repeat(2, 1fr); }
.accessibility-widget-grid > *, .accessibility-widget-grid-3 > * { min-width: 0; }

.accessibility-widget-card {
  border: 1px solid var(--accessibility-widget-border);
  border-radius: var(--accessibility-widget-radius);
  padding: 10px 12px;
  background: var(--accessibility-widget-bg);
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
.accessibility-widget-card:hover {
  background: var(--accessibility-widget-surface);
  border-color: #a1a1aa;
}
.accessibility-widget-card[aria-pressed="true"] {
  border-color: var(--accessibility-widget-primary);
  background: var(--accessibility-widget-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.accessibility-widget-card[aria-pressed="true"] .icon { color: rgba(255,255,255,0.85); }
.accessibility-widget-card[aria-pressed="true"]:hover { background: var(--accessibility-widget-primary); border-color: var(--accessibility-widget-primary); }
.accessibility-widget-card[aria-pressed="true"]:hover .icon { color: #fff; }
.accessibility-widget-card .icon { width: 22px; height: 22px; color: var(--accessibility-widget-muted); flex-shrink: 0; transition: color 0.12s ease; }
.accessibility-widget-card:not([aria-pressed="true"]):hover .icon { color: var(--accessibility-widget-text); }
.accessibility-widget-card .icon svg { width: 100%; height: 100%; }
.accessibility-widget-card .label { font-size: 12px; font-weight: 500; line-height: 1.3; min-width: 0; overflow-wrap: break-word; }

/* ── Tiles (content & color adjustments) ── */
.accessibility-widget-tile {
  border: 1px solid var(--accessibility-widget-border);
  border-radius: var(--accessibility-widget-radius);
  padding: 14px 10px 12px;
  background: var(--accessibility-widget-bg);
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
.accessibility-widget-tile:hover {
  background: var(--accessibility-widget-surface);
  border-color: #a1a1aa;
}
.accessibility-widget-tile[aria-pressed="true"] {
  border-color: var(--accessibility-widget-primary);
  background: var(--accessibility-widget-primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.accessibility-widget-tile[aria-pressed="true"] .icon { color: rgba(255,255,255,0.85); }
.accessibility-widget-tile[aria-pressed="true"]:hover { background: var(--accessibility-widget-primary); border-color: var(--accessibility-widget-primary); }
.accessibility-widget-tile[aria-pressed="true"]:hover .icon { color: #fff; }
.accessibility-widget-tile .icon { width: 28px; height: 28px; color: var(--accessibility-widget-muted); transition: color 0.12s ease; }
.accessibility-widget-tile:not([aria-pressed="true"]):hover .icon { color: var(--accessibility-widget-text); }
.accessibility-widget-tile .icon svg { width: 100%; height: 100%; }
.accessibility-widget-tile .label { font-size: 11px; font-weight: 500; line-height: 1.25; overflow-wrap: break-word; width: 100%; text-align: center; color: inherit; }
.accessibility-widget-levels {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  width: 100%;
  max-width: 78px;
  margin-top: 2px;
}
.accessibility-widget-levels span {
  height: 4px;
  border-radius: 999px;
  background: rgba(12,12,12,0.12);
  transition: background 0.12s ease, transform 0.12s ease;
}
.accessibility-widget-levels span.active {
  background: var(--accessibility-widget-primary);
  transform: scaleY(1.15);
}
.accessibility-widget-tile[aria-pressed="true"] .accessibility-widget-levels span {
  background: rgba(255,255,255,0.25);
}
.accessibility-widget-tile[aria-pressed="true"] .accessibility-widget-levels span.active {
  background: #fff;
}

/* ── Page structure dialog ── */
.accessibility-widget-structure-layer {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  pointer-events: none;
}
.accessibility-widget-structure-layer[hidden] { display: none; }
.accessibility-widget-structure-dialog {
  position: fixed;
  top: 24px;
  bottom: 24px;
  left: clamp(16px, 5vw, 80px);
  width: min(920px, calc(100vw - 420px));
  min-width: min(640px, calc(100vw - 32px));
  background: var(--accessibility-widget-bg);
  color: var(--accessibility-widget-text);
  border-radius: 14px;
  border: 1px solid var(--accessibility-widget-border);
  box-shadow: 0 20px 56px rgba(0,0,0,0.22);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}
.accessibility-widget-structure-header {
  min-height: 62px;
  padding: 14px 22px;
  background: var(--accessibility-widget-primary);
  color: var(--accessibility-widget-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.accessibility-widget-structure-header h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 650;
  letter-spacing: -0.02em;
}
.accessibility-widget-structure-close {
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
.accessibility-widget-structure-close:hover {
  background: color-mix(in srgb, currentColor 12%, transparent);
  transform: scale(1.04);
}
.accessibility-widget-structure-close svg {
  width: 20px;
  height: 20px;
}
.accessibility-widget-structure-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-bottom: 1px solid var(--accessibility-widget-border);
  background: var(--accessibility-widget-bg);
}
.accessibility-widget-structure-tab {
  min-height: 50px;
  border: 0;
  border-inline-end: 1px solid var(--accessibility-widget-border);
  background: transparent;
  color: var(--accessibility-widget-muted);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 650;
  letter-spacing: 0.01em;
  position: relative;
  transition: background 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
}
.accessibility-widget-structure-tab:last-child { border-inline-end: 0; }
.accessibility-widget-structure-tab:hover {
  background: var(--accessibility-widget-surface);
  color: var(--accessibility-widget-text);
}
.accessibility-widget-structure-tab[aria-selected="true"] {
  background: var(--accessibility-widget-bg);
  color: var(--accessibility-widget-text);
  box-shadow: inset 0 -3px 0 var(--accessibility-widget-primary);
}
.accessibility-widget-structure-list {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: var(--accessibility-widget-bg);
}
.accessibility-widget-structure-item {
  width: 100%;
  min-height: 42px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: var(--accessibility-widget-text);
  cursor: pointer;
  font: inherit;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  margin-inline-start: calc(var(--accessibility-widget-structure-depth, 0) * 22px);
  text-align: left;
  transition: background 0.12s ease, color 0.12s ease;
}
.accessibility-widget-structure-item:hover {
  background: var(--accessibility-widget-surface);
  color: var(--accessibility-widget-primary);
}
.accessibility-widget-structure-badge {
  width: 34px;
  height: 26px;
  border-radius: 7px;
  background: var(--accessibility-widget-surface);
  border: 1px solid var(--accessibility-widget-border);
  color: var(--accessibility-widget-primary);
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.accessibility-widget-structure-badge--text {
  background: var(--accessibility-widget-surface);
  font-size: 11px;
  font-weight: 700;
}
.accessibility-widget-structure-badge svg {
  width: 16px;
  height: 16px;
}
.accessibility-widget-structure-item-label {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 1.25;
}
.accessibility-widget-structure-external {
  flex: 0 0 auto;
  display: inline-flex;
  color: var(--accessibility-widget-primary);
}
.accessibility-widget-structure-external svg {
  width: 14px;
  height: 14px;
}
.accessibility-widget-structure-empty {
  padding: 28px 12px;
  color: var(--accessibility-widget-muted);
  font-size: 13px;
}

/* ── Reset bar ── */
.accessibility-widget-reset-bar {
  padding: 12px 18px;
  border-top: 1px solid var(--accessibility-widget-border);
  flex-shrink: 0;
  background: var(--accessibility-widget-bg);
}
.accessibility-widget-reset-btn {
  width: 100%;
  height: 34px;
  border-radius: var(--accessibility-widget-radius);
  border: 1px solid var(--accessibility-widget-border);
  background: var(--accessibility-widget-bg);
  color: var(--accessibility-widget-text);
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
.accessibility-widget-reset-btn:hover { background: var(--accessibility-widget-surface); border-color: #a1a1aa; }
.accessibility-widget-reset-btn svg { width: 14px; height: 14px; color: var(--accessibility-widget-muted); }

/* ── Applied host effects ── */
#accessibility-widget-host.accessibility-widget-effect-legible-fonts, #accessibility-widget-host.accessibility-widget-effect-legible-fonts * {
  font-family: var(--accessibility-widget-legible-font-family), Tahoma, Verdana, Arial, sans-serif !important;
  letter-spacing: var(--accessibility-widget-legible-letter-spacing, 0em) !important;
  word-spacing: var(--accessibility-widget-legible-word-spacing, 0em) !important;
}
#accessibility-widget-host.accessibility-widget-effect-dyslexia, #accessibility-widget-host.accessibility-widget-effect-dyslexia * {
  font-family: "Accessibility Widget Lexend", Tahoma, Verdana, Arial, sans-serif !important;
  letter-spacing: 0.04em !important;
  word-spacing: 0.03em !important;
}
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h1,
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h2,
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h3,
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h4,
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h5,
#accessibility-widget-host.accessibility-widget-effect-highlight-titles h6 {
  outline: var(--accessibility-widget-title-outline-width, 2px) solid #f59e0b !important;
  outline-offset: 2px !important;
  background: rgba(245,158,11,var(--accessibility-widget-title-highlight-alpha, 0.07)) !important;
}
#accessibility-widget-host.accessibility-widget-effect-highlight-links a {
  outline: var(--accessibility-widget-link-outline-width, 2px) solid #3b82f6 !important;
  outline-offset: 2px !important;
  background: rgba(59,130,246,var(--accessibility-widget-link-highlight-alpha, 0.07)) !important;
  text-decoration: underline !important;
  text-decoration-thickness: var(--accessibility-widget-link-underline-width, 1px) !important;
}
#accessibility-widget-host.accessibility-widget-effect-dark-contrast {
  background: var(--accessibility-widget-dark-contrast-bg, #000) !important;
  color: var(--accessibility-widget-dark-contrast-text, #fff) !important;
}
#accessibility-widget-host.accessibility-widget-effect-dark-contrast * {
  background-color: transparent !important;
  color: var(--accessibility-widget-dark-contrast-text, #fff) !important;
  border-color: var(--accessibility-widget-dark-contrast-border, #333) !important;
}
#accessibility-widget-host.accessibility-widget-effect-light-contrast {
  background: var(--accessibility-widget-light-contrast-bg, #fff) !important;
  color: var(--accessibility-widget-light-contrast-text, #000) !important;
}
#accessibility-widget-host.accessibility-widget-effect-light-contrast * {
  background-color: transparent !important;
  color: var(--accessibility-widget-light-contrast-text, #000) !important;
  border-color: var(--accessibility-widget-light-contrast-border, #475569) !important;
}
#accessibility-widget-host.accessibility-widget-effect-high-contrast {
  background: var(--accessibility-widget-high-contrast-bg, #000) !important;
  color: var(--accessibility-widget-high-contrast-text, #ff0) !important;
}
#accessibility-widget-host.accessibility-widget-effect-high-contrast * {
  background-color: var(--accessibility-widget-high-contrast-bg, #000) !important;
  color: var(--accessibility-widget-high-contrast-text, #ff0) !important;
  border-color: var(--accessibility-widget-high-contrast-border, #ff0) !important;
}
#accessibility-widget-host.accessibility-widget-effect-monochrome { filter: grayscale(var(--accessibility-widget-monochrome-amount, 100%)) !important; }
#accessibility-widget-host.accessibility-widget-effect-invert { filter: invert(var(--accessibility-widget-invert-amount, 100%)) hue-rotate(180deg) !important; }
#accessibility-widget-host.accessibility-widget-effect-color-blind {
  filter:
    url('#accessibility-widget-protanopia')
    saturate(var(--accessibility-widget-color-blind-saturate, 0.85))
    contrast(var(--accessibility-widget-color-blind-contrast, 1)) !important;
}
#accessibility-widget-host.accessibility-widget-effect-hide-images img,
#accessibility-widget-host.accessibility-widget-effect-hide-images picture {
  visibility: hidden !important;
}
#accessibility-widget-host.accessibility-widget-effect-off-animations,
#accessibility-widget-host.accessibility-widget-effect-off-animations *,
#accessibility-widget-host.accessibility-widget-effect-off-animations *::before,
#accessibility-widget-host.accessibility-widget-effect-off-animations *::after {
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
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav a:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav button:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav input:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav select:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav textarea:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav [tabindex]:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav summary:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav [role="button"]:focus,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav [role="link"]:focus {
  outline: 3px solid #2563eb !important;
  outline-offset: 3px !important;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.25) !important;
  border-radius: 2px;
}
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav a:hover,
#accessibility-widget-host.accessibility-widget-effect-keyboard-nav button:hover {
  outline: 2px dashed #2563eb !important;
  outline-offset: 2px !important;
}

.accessibility-widget-magnify-cursor {
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
.accessibility-widget-reading-lens {
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
.accessibility-widget-reading-lens::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: inset 0 0 24px rgba(0,0,0,0.10);
}
.accessibility-widget-reading-lens-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transform-origin: 0 0;
  will-change: transform;
}
.accessibility-widget-reading-lens-inner > * {
  margin: 0 !important;
}
.accessibility-widget-reading-lens-inner,
.accessibility-widget-reading-lens-inner *,
.accessibility-widget-reading-lens-inner *::before,
.accessibility-widget-reading-lens-inner *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}

/* ── Reading mask (clear horizontal band with shaded surroundings) ── */
.accessibility-widget-reading-mask {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 2147483644;
}
.accessibility-widget-reading-mask-panel {
  position: fixed;
  left: 0;
  right: 0;
  background: rgba(0,0,0,var(--accessibility-widget-reading-mask-opacity, 0.45));
}
.accessibility-widget-reading-mask-top {
  top: 0;
  border-bottom: 3px solid var(--accessibility-widget-reading-mask-edge, #10b981);
}
.accessibility-widget-reading-mask-bottom {
  bottom: 0;
  border-top: 3px solid var(--accessibility-widget-reading-mask-edge, #10b981);
}

/* ── Reading guide (high-contrast rule that follows the cursor) ── */
.accessibility-widget-reading-guide {
  position: fixed;
  left: 0;
  width: 100vw;
  height: var(--accessibility-widget-reading-guide-height, 8px);
  border: var(--accessibility-widget-reading-guide-border, 3px) solid var(--accessibility-widget-reading-guide-edge, #facc15);
  border-radius: 999px;
  background: var(--accessibility-widget-reading-guide-fill, #0c0c0c);
  box-shadow:
    0 0 0 1px rgba(0,0,0,0.28),
    0 0 18px var(--accessibility-widget-reading-guide-glow, rgba(250,204,21,0.34));
  pointer-events: none;
  z-index: 2147483645;
}
.accessibility-widget-reading-guide-pointer {
  position: absolute;
  left: var(--accessibility-widget-reading-guide-x, 50vw);
  top: -24px;
  width: 0;
  height: 0;
  transform: translateX(-50%);
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-bottom: 18px solid var(--accessibility-widget-reading-guide-edge, #facc15);
}
.accessibility-widget-reading-guide-pointer::after {
  content: '';
  position: absolute;
  left: -12px;
  top: 7px;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid var(--accessibility-widget-reading-guide-fill, #0c0c0c);
}

.accessibility-widget-root :focus-visible {
  outline: 2px solid var(--accessibility-widget-primary);
  outline-offset: 2px;
}

/* ── Skip link ── */
.accessibility-widget-skip-link {
  position: fixed;
  top: -100%;
  left: 8px;
  z-index: 2147483647;
  padding: 8px 16px;
  background: #0c0c0c;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 0 0 var(--accessibility-widget-radius, 8px) var(--accessibility-widget-radius, 8px);
  text-decoration: none;
  transition: top 0.15s ease;
}
.accessibility-widget-skip-link:focus {
  top: 0;
  outline: 2px solid #fff;
  outline-offset: -4px;
}

/* ── Dark mode ── */
/* Explicit light override — wins over OS preference and data-scheme="dark" */
.accessibility-widget-root[data-scheme="light"] {
  --accessibility-widget-primary: #0c0c0c;
  --accessibility-widget-primary-dark: #18181b;
  --accessibility-widget-bg: #ffffff;
  --accessibility-widget-text: #0c0c0c;
  --accessibility-widget-border: #e4e4e7;
  --accessibility-widget-muted: #71717a;
  --accessibility-widget-surface: #f4f4f5;
}
.accessibility-widget-root[data-scheme="dark"] {
  --accessibility-widget-primary: #fafafa;
  --accessibility-widget-primary-dark: #e4e4e7;
  --accessibility-widget-bg: #0c0c0c;
  --accessibility-widget-text: #fafafa;
  --accessibility-widget-border: #27272a;
  --accessibility-widget-muted: #71717a;
  --accessibility-widget-surface: #18181b;
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-header {
  background: var(--accessibility-widget-header-bg, #18181b);
  border-bottom-color: rgba(255,255,255,0.06);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-trigger {
  background: var(--accessibility-widget-trigger-bg, #fafafa);
  color: var(--accessibility-widget-trigger-icon, #0c0c0c);
  border-color: rgba(0,0,0,0.12);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-reset-bar { background: #0c0c0c; }
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-magnify-cursor {
  background: #18181b;
  border-color: #27272a;
  color: #fafafa;
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-card[aria-pressed="true"],
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-tile[aria-pressed="true"] {
  background: var(--accessibility-widget-primary);
  color: #0c0c0c;
  border-color: var(--accessibility-widget-primary);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-card[aria-pressed="true"] .icon,
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-tile[aria-pressed="true"] .icon { color: rgba(0,0,0,0.75); }
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-card[aria-pressed="true"]:hover,
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-tile[aria-pressed="true"]:hover { background: var(--accessibility-widget-primary); }
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-size-switch-track {
  background: var(--accessibility-widget-surface);
  box-shadow: inset 0 0 0 1px var(--accessibility-widget-border);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-dialog {
  background: var(--accessibility-widget-bg);
  color: var(--accessibility-widget-text);
  border-color: var(--accessibility-widget-border);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-header {
  background: var(--accessibility-widget-surface);
  color: var(--accessibility-widget-text);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-tabs {
  background: var(--accessibility-widget-bg);
  border-bottom-color: var(--accessibility-widget-border);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-tab {
  border-inline-end-color: var(--accessibility-widget-border);
  color: var(--accessibility-widget-muted);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-tab[aria-selected="true"] {
  background: var(--accessibility-widget-bg);
  color: var(--accessibility-widget-text);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-item {
  color: var(--accessibility-widget-text);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-item:hover {
  background: var(--accessibility-widget-surface);
  color: var(--accessibility-widget-primary);
}
.accessibility-widget-root[data-scheme="dark"] .accessibility-widget-structure-external {
  color: var(--accessibility-widget-primary);
}
@media (max-width: 900px) {
  .accessibility-widget-structure-dialog {
    inset: 12px;
    width: auto;
    min-width: 0;
  }
  .accessibility-widget-structure-header {
    min-height: 64px;
    padding: 14px 18px;
  }
  .accessibility-widget-structure-tab {
    min-height: 46px;
    font-size: 13px;
  }
  .accessibility-widget-structure-list {
    padding: 12px;
  }
  .accessibility-widget-structure-item {
    margin-inline-start: calc(var(--accessibility-widget-structure-depth, 0) * 12px);
  }
  .accessibility-widget-structure-item-label {
    font-size: 14px;
  }
}
`
}
