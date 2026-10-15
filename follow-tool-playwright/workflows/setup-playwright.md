# Setup Playwright

## Description

Setup Playwright in the project

## Steps

### 1. Install Playwright

```bash
bunx create-playwright
```

### 2. Configure

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

### 3. Create Test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Home/);
});
```

### 4. Run Test

```bash
bunx playwright test
```

## Best Practices

1. Use create-playwright: use create-playwright for easy setup
2. Configure Projects: Configure projects for multiple browsers
3. Use Base URL: Use a base URL for convenience
4. Version Control: Commit config file
