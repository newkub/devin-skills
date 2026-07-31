# Quick Start

## Description

เริ่มต้นใช้งาน Playwright อย่างรวดเร็ว

## Steps

### 1. Create Test

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
```

### 2. Run Tests

```bash
bunx playwright test
```

### 3. UI Mode

```bash
bunx playwright test --ui
```

### 4. Debug Mode

```bash
bunx playwright test --debug
```

## Best Practices

1. **Start Simple**: เริ่มจาก tests ง่ายๆ
2. **Use UI Mode**: ใช้ UI mode สำหรับ debugging
3. **Test Locally**: Test locally ก่อน CI
4. **Use Page Object**: ใช้ page object pattern
