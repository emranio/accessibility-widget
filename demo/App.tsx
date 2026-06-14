import { useState } from 'react'
import { AccessibilityWidget } from '../src/react'
import type { ColorScheme, Lang, Position, TriggerScheme, WidgetSize } from '../src/core'

const THEMES = {
  ember: {
    primary: '#17313f',
    background: '#fffaf3',
    text: '#17212b',
  },
  grove: {
    primary: '#1f4d3c',
    background: '#fbf8f1',
    text: '#1b241f',
  },
  tide: {
    primary: '#2d325a',
    background: '#f7f7fb',
    text: '#161824',
  },
} as const

const METRICS = [
  { label: 'Profiles', value: '7', detail: 'Preset accessibility modes for quick testing.' },
  { label: 'Languages', value: '6', detail: 'Localized labels with RTL support.' },
  { label: 'Controls', value: '15+', detail: 'Typography, color, focus, and reading helpers.' },
]

const FEATURE_CARDS = [
  {
    title: 'Keyboard-first review',
    body: 'Turn on Keyboard Navigation to inject a skip link and stronger focus rings across the page.',
  },
  {
    title: 'Structured page testing',
    body: 'Use headings, forms, tables, and landmark sections to verify keyboard focus, contrast, and reading adjustments.',
  },
  {
    title: 'Reading tools',
    body: 'Text Magnifier and Reading Lens help inspect tiny labels, dense tables, and mixed media content.',
  },
]

const TABLE_ROWS = [
  { feature: 'Font sizing', result: 'Live scaling across the host page', target: 'Marketing copy, forms, and legal text' },
  { feature: 'Contrast filters', result: 'One-click visual changes without touching app CSS', target: 'Low-vision testing and QA sweeps' },
  { feature: 'Reading aids', result: 'Cursor, mask, guide, lens, and magnifier helpers', target: 'Dense layouts and long-form content' },
]

function makeArt(title: string, left: string, right: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 520" role="img" aria-label="${title}">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${left}" />
          <stop offset="100%" stop-color="${right}" />
        </linearGradient>
      </defs>
      <rect width="760" height="520" rx="36" fill="#f8f4ec" />
      <rect x="42" y="42" width="676" height="436" rx="28" fill="url(#g)" opacity="0.18" />
      <rect x="84" y="104" width="288" height="232" rx="24" fill="#fffdf8" />
      <rect x="404" y="86" width="234" height="54" rx="18" fill="#fffdf8" />
      <rect x="404" y="164" width="272" height="20" rx="10" fill="#fffdf8" opacity="0.9" />
      <rect x="404" y="202" width="224" height="20" rx="10" fill="#fffdf8" opacity="0.7" />
      <rect x="404" y="240" width="250" height="20" rx="10" fill="#fffdf8" opacity="0.55" />
      <circle cx="186" cy="220" r="82" fill="url(#g)" />
      <circle cx="566" cy="356" r="86" fill="url(#g)" opacity="0.42" />
      <rect x="108" y="370" width="246" height="24" rx="12" fill="#fffdf8" opacity="0.9" />
      <rect x="108" y="410" width="202" height="24" rx="12" fill="#fffdf8" opacity="0.72" />
    </svg>
  `)}`
}

const HERO_ART = makeArt('Abstract interface composition', '#d96b3b', '#255d67')
const AUDIT_ART = makeArt('Intentional audit sandbox graphic', '#c15555', '#735ac7')
const IFRAME_DOC = `
  <!doctype html>
  <html lang="en">
    <body style="margin:0;font-family:Georgia,serif;background:#f4efe7;color:#26221d;display:grid;place-items:center;height:100%;">
      <div style="padding:20px;text-align:center;">
        <strong>Embedded preview</strong>
        <p style="margin:8px 0 0;">This iframe gives the demo a mixed-content surface for visual testing.</p>
      </div>
    </body>
  </html>
`

export default function App() {
  const [widgetTitle, setWidgetTitle] = useState('React Accessibility Widget')
  const [position, setPosition] = useState<Position>('bottom-right')
  const [size, setSize] = useState<WidgetSize>('S')
  const [lang, setLang] = useState<Lang>('en')
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  const [triggerScheme, setTriggerScheme] = useState<TriggerScheme>('auto')
  const [themeName, setThemeName] = useState<keyof typeof THEMES>('ember')
  const [accentColor, setAccentColor] = useState<string>(THEMES.ember.primary)
  const widgetTheme = { ...THEMES[themeName], primary: accentColor }

  return (
    <>
      <div className={`demo-shell scheme-${colorScheme}`}>
        <header className="site-header reveal">
          <div className="brand-lockup">
            <p className="eyebrow">firefam</p>
            <h1>React Accessibility Widget</h1>
            <p className="lede">
              A live demo page with real semantic content, interactive controls, and an intentional visual sandbox so you can
              exercise the widget visually instead of testing against a blank page.
            </p>
          </div>
          <nav className="top-nav" aria-label="Section navigation">
            <a href="#overview">Overview</a>
            <a href="#landmarks">Landmarks</a>
            <a href="#forms">Forms</a>
            <a href="#audit">Audit Lab</a>
          </nav>
        </header>

        <main id="main" className="site-main">
          <section id="overview" className="hero-grid reveal">
            <article className="hero-card">
              <div className="hero-copy">
                <p className="eyebrow">Live showcase</p>
                <h2>Stress-test the widget against mixed content</h2>
                <p>
                  This page includes headings, cards, forms, a table, details/summary, an image, an iframe, and dense
                  reading surfaces so the widget has realistic content to adjust.
                </p>
                <div className="hero-actions">
                  <button type="button">Primary Action</button>
                  <a href="#audit" className="ghost-action">Jump to audit sandbox</a>
                </div>
                <ul className="bullet-strip">
                  <li>Keyboard focus targets</li>
                  <li>Text scaling coverage</li>
                  <li>Landmark visualization</li>
                </ul>
              </div>
              <img
                className="hero-art"
                src={HERO_ART}
                alt="Abstract layout showing layered cards, focus zones, and reading surfaces"
              />
            </article>

            <aside className="control-card">
              <p className="eyebrow">Widget controls</p>
              <h2>Change live props from the page</h2>
              <div className="control-grid">
                <label>
                  Widget title
                  <input
                    type="text"
                    value={widgetTitle}
                    onChange={event => setWidgetTitle(event.target.value)}
                    placeholder="React Accessibility Widget"
                  />
                </label>

                <label>
                  Accent color
                  <span className="color-row">
                    <input
                      type="color"
                      value={accentColor}
                      onInput={event => setAccentColor(event.currentTarget.value)}
                      onChange={event => setAccentColor(event.currentTarget.value)}
                      aria-label="Widget accent color"
                    />
                    <span>{accentColor}</span>
                  </span>
                </label>

                <label>
                  Position
                  <select value={position} onChange={event => setPosition(event.target.value as Position)}>
                    <option value="bottom-right">Bottom right</option>
                    <option value="bottom-left">Bottom left</option>
                    <option value="top-right">Top right</option>
                    <option value="top-left">Top left</option>
                  </select>
                </label>

                <label>
                  Size
                  <select value={size} onChange={event => setSize(event.target.value as WidgetSize)}>
                    <option value="S">Small</option>
                    <option value="XL">XL</option>
                  </select>
                </label>

                <label>
                  Language
                  <select value={lang} onChange={event => setLang(event.target.value as Lang)}>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>

                <label>
                  Color scheme
                  <select value={colorScheme} onChange={event => setColorScheme(event.target.value as ColorScheme)}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>

                <label>
                  Trigger scheme
                  <select value={triggerScheme} onChange={event => setTriggerScheme(event.target.value as TriggerScheme)}>
                    <option value="auto">Auto</option>
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </label>
              </div>

              <div className="theme-picker" role="group" aria-label="Widget theme presets">
                {Object.keys(THEMES).map(key => (
                  <button
                    key={key}
                    type="button"
                    className="theme-pill"
                    aria-pressed={themeName === key}
                    onClick={() => {
                      const nextTheme = key as keyof typeof THEMES
                      setThemeName(nextTheme)
                      setAccentColor(THEMES[nextTheme].primary)
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>

              <dl className="state-list">
                <div>
                  <dt>Current widget</dt>
                  <dd>{size} / {lang} / {position} / {accentColor}</dd>
                </div>
                <div>
                  <dt>Widget title</dt>
                  <dd>{widgetTitle || 'Default title'}</dd>
                </div>
                <div>
                  <dt>Best first check</dt>
                  <dd>Open the widget, try Keyboard Navigation, then test the reading aids over dense content.</dd>
                </div>
              </dl>
            </aside>
          </section>

          <section className="metrics-grid reveal" aria-label="Key widget metrics">
            {METRICS.map(metric => (
              <article key={metric.label} className="metric-card">
                <p className="metric-value">{metric.value}</p>
                <h2>{metric.label}</h2>
                <p>{metric.detail}</p>
              </article>
            ))}
          </section>

          <section id="landmarks" className="content-grid reveal">
            <article className="story-card">
              <p className="eyebrow">Semantic landmarks</p>
              <h2>Readable content with varied structure</h2>
              <p>
                Long-form paragraphs are useful for testing font sizing, line height, letter spacing, and the reading
                lens. Use the widget controls to increase density or loosen spacing and watch how the prose adapts.
              </p>
              <blockquote>
                Good accessibility tooling is easier to trust when it can be exercised against content that looks like a real
                product instead of a synthetic sample.
              </blockquote>
              <p>
                The demo also includes links, buttons, tables, form fields, summary elements, and multiple landmarks so the
                keyboard and visual adjustment tools can be tested in context.
              </p>

              <details>
                <summary>Why keep an intentional visual sandbox on the page?</summary>
                <p>
                  Because widget behavior is easier to validate against realistic friction. This page includes dense prose,
                  mixed controls, media, and compact links so manual visual QA has useful targets.
                </p>
              </details>
            </article>

            <aside className="stack-card">
              <h3>Try these visual checks</h3>
              <div className="feature-stack">
                {FEATURE_CARDS.map(card => (
                  <article key={card.title} className="mini-card">
                    <h4>{card.title}</h4>
                    <p>{card.body}</p>
                  </article>
                ))}
              </div>
            </aside>
          </section>

          <section id="forms" className="lab-grid reveal">
            <article className="form-card">
              <p className="eyebrow">Interactive controls</p>
              <h2>Forms, labels, and dense UI</h2>
              <form className="demo-form">
                <label>
                  Full name
                  <input type="text" name="fullName" placeholder="Ari Mason" />
                </label>

                <label>
                  Email address
                  <input type="email" name="email" placeholder="ari@example.com" />
                </label>

                <label>
                  Team size
                  <select name="teamSize" defaultValue="6-20">
                    <option value="1-5">1-5 people</option>
                    <option value="6-20">6-20 people</option>
                    <option value="21-50">21-50 people</option>
                    <option value="50+">50+ people</option>
                  </select>
                </label>

                <label>
                  Notes
                  <textarea name="notes" rows={4} placeholder="What kind of accessibility review are you running?" />
                </label>

                <fieldset className="choice-row">
                  <legend>Preferred review path</legend>
                  <label><input type="radio" name="path" defaultChecked /> Visual pass</label>
                  <label><input type="radio" name="path" /> Keyboard pass</label>
                  <label><input type="radio" name="path" /> Reading aid pass</label>
                </fieldset>

                <label className="checkbox-row">
                  <input type="checkbox" defaultChecked />
                  Send a follow-up checklist
                </label>
              </form>
            </article>

            <article className="table-card">
              <p className="eyebrow">Comparison table</p>
              <h2>Feature coverage at a glance</h2>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">What it changes</th>
                    <th scope="col">Best used for</th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map(row => (
                    <tr key={row.feature}>
                      <th scope="row">{row.feature}</th>
                      <td>{row.result}</td>
                      <td>{row.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          </section>

          <section id="audit" className="audit-grid reveal">
            <article className="audit-card">
              <p className="eyebrow">Intentional QA surface</p>
              <h2>Scanner playground</h2>
              <p>
                The blocks below intentionally include common accessibility mistakes so widget behavior can be tested
                against realistic page structure.
              </p>

              <div className="problem-grid">
                <section className="problem-card">
                  <h4>Skipped heading level</h4>
                  <p>This card jumps from the section heading to an `h4`, which should register as a heading-order warning.</p>
                </section>

                <section className="problem-card">
                  <img className="audit-image" src={AUDIT_ART} />
                  <p className="note-text">This image intentionally has no `alt` attribute so the image audit can flag it.</p>
                </section>

                <section className="problem-card">
                  <input type="text" placeholder="Unlabeled sandbox input" />
                  <div className="sandbox-actions">
                    <button type="button" className="icon-only">
                      <span className="plus-mark" aria-hidden="true" />
                    </button>
                    <a href="#footer" className="empty-link">
                      <span aria-hidden="true" />
                    </a>
                    <a href="#footer" className="tiny-target">go</a>
                  </div>
                </section>

                <section className="problem-card">
                  <p className="low-contrast">This line intentionally uses poor contrast to demonstrate the contrast rule.</p>
                  <iframe srcDoc={IFRAME_DOC} />
                </section>
              </div>
            </article>

            <aside className="tips-card">
              <h3>Suggested manual test loop</h3>
              <ol>
                <li>Open the widget and enable Keyboard Navigation to confirm focus rings and the skip link.</li>
                <li>Cycle font size, line height, and letter spacing over the long-form copy.</li>
                <li>Switch to Keyboard Navigation mode and inspect focus targets across header, main, sections, aside, and footer.</li>
                <li>Use Text Magnifier, Reading Lens, Big Cursor, Reading Mask, and Reading Guide over the table and form labels.</li>
              </ol>
            </aside>
          </section>
        </main>

        <footer id="footer" className="site-footer reveal">
          <p>Built for local QA under the `firefam` organization.</p>
          <a href="https://github.com/firefam/react-accessibility-widget">github.com/firefam/react-accessibility-widget</a>
        </footer>
      </div>

      <AccessibilityWidget
        title={widgetTitle}
        accentColor={accentColor}
        position={position}
        size={size}
        lang={lang}
        colorScheme={colorScheme}
        triggerScheme={triggerScheme}
        theme={widgetTheme}
      />
    </>
  )
}
