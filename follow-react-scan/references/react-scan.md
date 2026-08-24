# react-scan (React Performance Issue Detector)

## Source

- GitHub: https://github.com/aidenybai/react-scan
- README: https://github.com/aidenybai/react-scan/blob/main/packages/scan/README.md
- Installation Docs: https://github.com/aidenybai/react-scan/tree/main/docs/installation

## Version

- `react-scan`: `0.5.7` (latest stable)
- Peer: React 16+ (works with React 19)

## Installation

### Auto Init (Recommended)

```bash
npx -y react-scan@latest init
```

Automatically detects your framework, installs `react-scan`, and sets up your project.

### Manual Installation

```bash
npm install -D react-scan
# or: pnpm add react-scan / yarn add react-scan / bun add react-scan
```

### CDN (Script Tag)

```html
<!-- paste this BEFORE any scripts in index.html -->
<script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
```

Alternative CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/react-scan/dist/auto.global.js"></script>
```

## Usage

### NPM Import

**Important**: `react-scan` must be imported BEFORE React and React DOM.

```ts
// src/index.tsx — must be first import
import { scan } from 'react-scan'
import React from 'react'
import ReactDOM from 'react-dom/client'

scan({
  enabled: process.env.NODE_ENV === 'development',
})
```

For production scanning (not recommended):

```ts
import { scan } from 'react-scan/all-environments'
```

### Next.js (App Router)

```tsx
import Script from "next/script"

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### Vite (Script Tag)

```html
<!doctype html>
<html lang="en">
  <head>
    <script src="https://unpkg.com/react-scan/dist/auto.global.js"></script>
    <!-- rest of your scripts go under -->
  </head>
  <body><div id="root"></div></body>
</html>
```

### Vite (Module Import)

```ts
// src/main.tsx
import { scan } from "react-scan"
import React from "react"

scan({ enabled: true })
```

### SSR (useScan Hook)

```tsx
import { useScan } from 'react-scan'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    useScan({ enabled: true })
  }, [])
  return <div>My App</div>
}
```

### CLI

```bash
# Scan a local site
npx react-scan@latest http://localhost:3000

# Scan any website
npx react-scan@latest https://react.dev
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "scan": "next dev & npx react-scan@latest localhost:3000"
  }
}
```

## API Reference

### `Options`

```ts
export interface Options {
  enabled?: boolean;                          // default: true
  dangerouslyForceRunInProduction?: boolean;  // default: false
  log?: boolean;                              // default: false (adds overhead)
  showToolbar?: boolean;                      // default: true
  animationSpeed?: "slow" | "fast" | "off";   // default: "fast"
  trackUnnecessaryRenders?: boolean;          // default: false (adds overhead)
  onCommitStart?: () => void;
  onRender?: (fiber: Fiber, renders: Array<Render>) => void;
  onCommitFinish?: () => void;
  onPaintStart?: (outlines: Array<Outline>) => void;
  onPaintFinish?: (outlines: Array<Outline>) => void;
}
```

### Functions

| Function | Description |
|----------|-------------|
| `scan(options: Options)` | Imperative API to start scanning |
| `useScan(options: Options)` | Hook API for SSR apps (call in `useEffect`) |
| `getReport()` | Get a report of all renders |
| `setOptions(options: Options)` | Set options at runtime |
| `getOptions()` | Get current options |
| `onRender(Component, onRender)` | Hook into a specific component's renders |

### `react-scan/lite` (Headless Instrumentation)

```ts
import { instrument } from "react-scan/lite"

const handle = instrument({
  onEvent: (event) => console.log(event),
  endpoint: "http://127.0.0.1:54321/ingest/abc123",
  sessionId: "abc123",
  recordChangeDescriptions: true,
  includeFiberSource: true,
  includeFiberIdentity: true,
})

handle.subscribe((event) => {
  if (event.kind === "commit") {
    // event.tree[] = per-fiber render data
  }
})

handle.stop() // idempotent
```

Must run before `react-dom` mounts. SSR-safe (noop in Node).

## Visual Cues

- Component outline = render occurred
- Outline color and thickness = severity of the issue
- Render count number = number of times rendered
- Gray outlines = unnecessary renders (when `trackUnnecessaryRenders` is enabled)

## Production Safety

- Set `enabled: false` in production builds
- Avoid `dangerouslyForceRunInProduction` except for debugging
- Use build tool plugins to strip `react-scan` code in production
- Verify bundle size does not increase from `react-scan` code
