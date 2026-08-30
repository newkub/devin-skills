# Configuration Reference — Project, Reporter & CI Options

## Purpose

Configuration options reference สำหรับ Playwright — Project Options, Reporter Options, Timeout Options, CI Options

## Scope

- Project Options
- Reporter Options
- Timeout Options
- CI Options

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
| Test | testDir, testMatch, timeout |
| Browser | headless, viewport, locale |
| Trace | trace, screenshot, video |
| Reporter | list, html, json |
| CI | retries, workers, forbidOnly |

## See Also

- [Top-level & Use Options](./playwright-config-options.md) - Top-level config and use options
- [CLI Test Commands](./playwright-commands-test.md) - playwright test options
- [API Reference](./playwright-api.md) - Programmatic API
