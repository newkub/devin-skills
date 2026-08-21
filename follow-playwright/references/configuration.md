# Configuration Reference

## Purpose

Configuration options reference สำหรับ Playwright

## Scope

- Top-level Options
- Use Options
- Project Options
- Reporter Options

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

## Project Options

### Single Browser

```typescript
export default defineConfig({
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
})
```

### Multiple Browsers

```typescript
export default defineConfig({
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
})
```

### Mobile Devices

```typescript
export default defineConfig({
  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 375, height: 812 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
})
```

### Predefined Devices

```typescript
import { devices } from '@playwright/test'

export default defineConfig({
  projects: [
    { name: 'iPhone 12', use: { ...devices['iPhone 12'] } },
    { name: 'iPad', use: { ...devices['iPad (gen 7)'] } },
  ],
})
```

## Reporter Options

### Built-in Reporters

```typescript
export default defineConfig({
  reporter: [
    ['list'],
    ['line'],
    ['dot'],
    ['html'],
    ['json'],
    ['junit'],
  ],
})
```

### Reporter Properties

| Reporter | Description |
|----------|-------------|
| `list` | Default list format |
| `line` | Single line |
| `dot` | Dot notation |
| `html` | HTML report |
| `json` | JSON output |
| `junit` | JUnit XML |

### Custom Reporter

```typescript
export default defineConfig({
  reporter: [
    ['html', { outputFolder: 'reports' }],
    ['json', { outputFile: 'results.json' }],
  ],
})
```

## Timeout Options

### Test Timeout

```typescript
export default defineConfig({
  timeout: 30000,
})
```

### Action Timeout

```typescript
export default defineConfig({
  use: {
    actionTimeout: 10000,
  },
})
```

### Navigation Timeout

```typescript
export default defineConfig({
  use: {
    navigationTimeout: 30000,
  },
})
```

## CI Options

### GitHub Actions

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  forbidOnly: !!process.env.CI,
})
```

### Sharding

```typescript
export default defineConfig({
  workers: 4,
  shard: '1/4',
})
```

## Summary

| Category | Options |
|----------|---------|
| **Test** | testDir, testMatch, timeout |
| **Browser** | headless, viewport, locale |
| **Trace** | trace, screenshot, video |
| **Reporter** | list, html, json |
| **CI** | retries, workers, forbidOnly |
