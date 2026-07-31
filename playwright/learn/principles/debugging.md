# Debugging

## Definition

Debugging Playwright tests ด้วย tools ต่างๆ

## Debugging Methods

### UI Mode

```bash
bunx playwright test --ui
```

### Debug Mode

```bash
bunx playwright test --debug
```

### Trace Viewer

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',
}
```

### Screenshots

```typescript
await page.screenshot({ path: 'screenshot.png' });
```

## Best Practices

1. **Use UI Mode**: ใช้ UI mode สำหรับ interactive debugging
2. **Use Traces**: ใช้ traces สำหรับ post-mortem debugging
3. **Screenshots**: ใช้ screenshots สำหรับ visual debugging
4. **Logs**: ใช้ logs สำหรับ debugging logic
