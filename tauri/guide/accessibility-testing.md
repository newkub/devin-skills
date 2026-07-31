---
title: Accessibility Testing
description: Accessibility testing ด้วย Playwright
---

```bash
bun install -D @axe-core/playwright
```

```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('accessibility', async ({ page }) => {
  await page.goto('http://localhost:1420')
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
  expect(accessibilityScanResults.violations).toEqual([])
})
```
