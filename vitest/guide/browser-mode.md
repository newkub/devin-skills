# Browser Mode

Browser Mode ใน Vitest ใช้สำหรับ component testing ใน real browser environment

## Overview

Browser Mode ช่วยให้รัน tests ใน real browser ด้วย Playwright, WebdriverIO, หรือ preview mode

## Setup

ติดตั้ง dependencies:

```bash
bun add -D @vitest/browser
```

ตั้งค่าใน `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      provider: 'playwright',
    },
  },
})
```

## Usage

เขียน browser tests:

```typescript
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'

test('button click', async () => {
  await page.goto('/')
  await page.getByRole('button').click()
  expect(page.getByText('Clicked')).toBeVisible()
})
```

## Best Practices

- ใช้ Browser Mode สำหรับ component testing ใน CI/CD
- Test user interactions แทน internal implementation
- Test accessibility (keyboard navigation, ARIA attributes)
- Mock external dependencies ด้วย MSW
- ใช้ meaningful test descriptions

## Providers

- `playwright` - default, รองรับ Chrome, Firefox, Safari
- `webdriverio` - ใช้ WebdriverIO
- `preview` - ใช้ built-in preview mode
