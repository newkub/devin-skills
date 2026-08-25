# Unlighthouse CLI (Site-Wide Lighthouse Audit)

## Source

- Installation: https://unlighthouse.dev/guide/getting-started/installation
- CLI Integration: https://unlighthouse.dev/integrations/cli
- CI Integration: https://unlighthouse.dev/integrations/ci
- Configuration: https://unlighthouse.dev/guide/guides/config

## Version

- `unlighthouse`: `0.18.0` (latest stable)
- Requires: Node.js 22.18+
- Chrome: Uses system Chrome; downloads Chromium automatically if missing

## Installation

### One-Time Run (No Install)

```bash
npx unlighthouse --site https://mysite.com
# or: pnpm dlx unlighthouse --site https://mysite.com
# or: yarn dlx unlighthouse --site https://mysite.com
# or: bunx unlighthouse --site https://mysite.com
```

### Global Install

```bash
bun add -g unlighthouse
unlighthouse --site example.com
```

### CI Installation (Requires Puppeteer for Chromium)

```bash
bun add -g @unlighthouse/cli puppeteer
```

Puppeteer downloads a compatible Chromium binary automatically.

## CLI Usage

### Development Scan

```bash
# Basic scan — opens dashboard at http://localhost:5678
unlighthouse --site https://example.com

# Debug mode
unlighthouse --site https://example.com --debug

# Advanced: no cache, throttle, multiple samples
unlighthouse --site https://example.com --no-cache --throttle --samples 3
```

### CI Mode

```bash
# Fail if any score < 75
unlighthouse-ci --site https://example.com --budget 75

# Generate static HTML report
unlighthouse-ci --site https://example.com --build-static

# Both: budget check + report
unlighthouse-ci --site https://example.com --budget 75 --build-static
```

Exit code 0 = all pages passed. Exit code 1 = budget failed.

## CLI Options

| Option | Description |
|--------|-------------|
| `-v, --version` | Display version number |
| `--site <url>` | Host URL to scan |
| `--root <path>` | Define project root |
| `--config-file <path>` | Path to config file |
| `--output-path <path>` | Path to save client and reports |
| `--cache` / `--no-cache` | Enable/disable caching |
| `--desktop` | Simulate desktop device |
| `--mobile` | Simulate mobile device (default) |
| `--budget <n>` | Minimum score to pass (1-100) |
| `--build-static` | Generate shareable HTML report |
| `--reporter <type>` | Report format: `json`, `jsonExpanded`, `csv`, `csvExpanded`, `lighthouseServer` |
| `--debug` | Verbose logging |
| `--throttle` | Simulate real network conditions |
| `--samples <n>` | Number of Lighthouse runs per page |

## Configuration File

Create `unlighthouse.config.ts` in project root:

```ts
import { defineUnlighthouseConfig } from 'unlighthouse/config'

export default defineUnlighthouseConfig({
  site: 'https://example.com',
  scanner: {
    samples: 3,           // Run each page 3x and average
    throttle: true,       // Simulate real network
    exclude: ['/admin/*', '/api/*'],
  },
})
```

Config file lookup order: `unlighthouse.config.ts` → `unlighthouse.config.js` → `unlighthouse.config.mjs`

### Per-Category CI Budgets

```ts
import { defineUnlighthouseConfig } from 'unlighthouse/config'

export default defineUnlighthouseConfig({
  site: 'https://example.com',
  ci: {
    budget: {
      'performance': 70,
      'accessibility': 90,
      'best-practices': 80,
      'seo': 90,
    },
    buildStatic: true,
  },
})
```

### Desktop Instead of Mobile

```ts
export default defineUnlighthouseConfig({
  scanner: { device: 'desktop' },
})
```

### Protected Sites (Auth)

```ts
export default defineUnlighthouseConfig({
  auth: {
    username: process.env.AUTH_USER,
    password: process.env.AUTH_PASS,
  },
  cookies: [
    { name: 'session', value: process.env.SESSION_TOKEN, domain: '.example.com' },
  ],
})
```

### Lighthouse Options

```ts
export default defineUnlighthouseConfig({
  lighthouseOptions: {
    onlyCategories: ['performance', 'accessibility'],
    skipAudits: ['uses-http2'],
    throttlingMethod: 'devtools',
  },
})
```

### Environment-Based Config

```ts
export default defineUnlighthouseConfig(() => {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    site: isProd ? 'https://mysite.com' : 'http://localhost:3000',
    scanner: { samples: isProd ? 3 : 1, throttle: isProd },
  }
})
```

## `package.json` Scripts

```json
{
  "scripts": {
    "audit": "bunx unlighthouse --site ${APP_URL:-http://localhost:3000}",
    "audit:ci": "bunx unlighthouse-ci --site ${APP_URL:-http://localhost:3000} --budget 75",
    "audit:ci:strict": "bunx unlighthouse-ci --site ${APP_URL:-http://localhost:3000} --budget 90 --build-static"
  }
}
```

## Report Formats

| Format | Flag | Use Case |
|--------|------|----------|
| `json` | `--reporter json` | Simple scores for CI parsing |
| `jsonExpanded` | `--reporter jsonExpanded` | Full metrics breakdown |
| `csv` | `--reporter csv` | Spreadsheet analysis |
| `csvExpanded` | `--reporter csvExpanded` | Full data in CSV |
| `lighthouseServer` | `--reporter lighthouseServer` | Upload to LHCI server |
| HTML dashboard | `--build-static` | Shareable interactive report |

Static reports output to `.unlighthouse/` folder. Upload to any static host.

## LHCI Server Upload

```bash
unlighthouse-ci --site example.com \
  --reporter lighthouseServer \
  --lhci-host https://lhci.yourcompany.com \
  --lhci-build-token $LHCI_TOKEN
```

## Default Categories

Unlighthouse scans: `performance`, `accessibility`, `best-practices`, `seo`. The performance category measures Core Web Vitals (LCP, CLS, INP).
