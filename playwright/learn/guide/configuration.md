# Configuration

## Description

ตั้งค่า Playwright ผ่าน playwright.config.ts

## Config File

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

## Configuration Options

### Base URL

```typescript
use: {
  baseURL: 'http://localhost:3000',
}
```

### Trace

```typescript
use: {
  trace: 'on-first-retry',
}
```

### Screenshot

```typescript
use: {
  screenshot: 'only-on-failure',
}
```

## Best Practices

1. **Use Projects**: ใช้ projects สำหรับ multiple browsers
2. **Configure Workers**: Configure workers ตาม CI capabilities
3. **Use Trace**: ใช้ trace สำหรับ debugging
4. **Version Control**: Commit config file
