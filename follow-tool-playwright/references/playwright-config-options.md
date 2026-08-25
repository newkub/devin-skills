# Configuration Reference — Top-level & Use Options

## Purpose

Configuration options reference สำหรับ Playwright — Top-level Options และ Use Options

## Scope

- Top-level Options
- Use Options

## Top-level Options

### Basic Config

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
})
```

### All Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testDir` | string | `.` | Test directory |
| `testMatch` | string | `**/*.spec.{ts,js}` | Test file pattern |
| `testIgnore` | string | `[]` | Ignore patterns |
| `timeout` | number | `30000` | Test timeout |
| `retries` | number | `0` | Retry count |
| `workers` | number | `50%` | Parallel workers |
| `fullyParallel` | boolean | `false` | Run all in parallel |
| `forbidOnly` | boolean | `false` | Fail on test.only |
| `globalSetup` | string | - | Global setup file |
| `globalTeardown` | string | - | Global teardown file |
| `reporter` | array | `[['list']]` | Reporter options |
| `projects` | array | `[]` | Test projects |
| `use` | object | `{}` | Default options |
| `outputDir` | string | `test-results` | Output directory |

## Use Options

### Browser Options

```typescript
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },
})
```

### Context Options

```typescript
export default defineConfig({
  use: {
    contextOptions: {
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
      viewport: { width: 1280, height: 720 },
      locale: 'en-US',
    },
  },
})
```

### Action Options

```typescript
export default defineConfig({
  use: {
    actionTimeout: 10000,
    navigationTimeout: 30000,
  },
})
```

### Trace Options

```typescript
export default defineConfig({
  use: {
    trace: 'on-first-retry',
  },
})
```

| Value | Description |
|-------|-------------|
| `off` | Disable |
| `on` | Record all |
| `on-first-retry` | First retry only |
| `on-all-retries` | All retries |
| `retain-on-failure` | Keep on failure |

### Screenshot Options

```typescript
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
  },
})
```

| Value | Description |
|-------|-------------|
| `off` | Disable |
| `on` | Always capture |
| `only-on-failure` | On failure only |

### Video Options

```typescript
export default defineConfig({
  use: {
    video: 'on-first-retry',
  },
})
```

| Value | Description |
|-------|-------------|
| `off` | Disable |
| `on` | Always record |
| `on-first-retry` | First retry only |
| `retain-on-failure` | Keep on failure |

## See Also

- [Project, Reporter & CI Options](./playwright-config-projects.md) - Projects, reporters, timeouts, CI settings
- [CLI Test Commands](./playwright-commands-test.md) - playwright test options
- [API Reference](./playwright-api.md) - Programmatic API
