# React Accessibility Widget

`React Accessibility Widget` is a lightweight React accessibility widget published under the `firefam` GitHub organization. It ships a Vite-powered demo page for local visual testing.

## Features

- Accessibility profiles for seizure safety, low vision, ADHD, cognitive support, keyboard navigation, color blindness, and dyslexia
- Content controls for font size, line height, letter spacing, text alignment, legible fonts, page structure, text magnifier, reading lens, and title/link highlighting
- Color controls for dark, light, and high contrast, plus monochrome, invert colors, and color-blind filtering
- First-class React API

## Installation

```bash
npm install @firefam/react-accessibility-widget
```

## Local Demo

```bash
npm install
npm run dev
```

Vite serves the demo page on the first available port, typically [http://localhost:5173](http://localhost:5173).

## Usage

### React

```tsx
import { AccessibilityWidget } from '@firefam/react-accessibility-widget'

export default function App() {
  return (
    <>
      <YourApp />
      <AccessibilityWidget
        title="React Accessibility Widget"
        accentColor="#17313f"
        position="bottom-right"
        size="S"
        colorScheme="light"
        lang="en"
      />
    </>
  )
}
```

## Public API

Common config options:

- `title`: override the widget title shown in the panel header and accessibility labels.
- `accentColor`: override the widget accent color used for the header, selected tools, and level indicators.
- `theme`: lower-level theme override for `primary`, `background`, and `text`; `accentColor` takes precedence over `theme.primary`.

### Exports

- `AccessibilityWidget`
- `ReactAccessibilityWidget`
- `useAccessibilityWidget`
- `AccessifyWidget`
- `useAccessify`

## Scripts

```bash
npm run dev         # Vite demo page
npm run dev:lib     # tsup watch build for the library
npm run build       # library build
npm run build:demo  # static demo build to demo-dist
npm run test
npm run lint
```
