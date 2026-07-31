# Actionability

## Definition

Actionability คือ checks ที่ Playwright ทำก่อน interact กับ elements:
- Element is visible
- Element is stable (not moving)
- Element is enabled
- Element is not obscured
- Element receives events

## Actionability Checks

### Visibility Check

```typescript
// Element must be visible
await page.getByRole('button', { name: 'Submit' }).click();
// Playwright waits until button is visible
```

### Stability Check

```typescript
// Element must not be moving
await page.locator('.loading').click();
// Playwright waits until element stops moving
```

### Enabled Check

```typescript
// Element must be enabled
await page.getByRole('button', { name: 'Submit' }).click();
// Playwright waits until button is enabled
```

### Receives Events Check

```typescript
// Element must receive events
await page.locator('.overlay').click();
// Playwright waits until element is not obscured
```

## Actionability Options

### Force Click

```typescript
// Skip actionability checks
await page.getByRole('button').click({ force: true });
```

### Trial Run

```typescript
// Check if actionable without performing action
await page.getByRole('button').click({ trial: true });
```

### Timeout

```typescript
// Set custom timeout
await page.getByRole('button').click({ timeout: 5000 });
```

## Best Practices

1. **Let Playwright Wait**: ให้ Playwright wait automatically
2. **Avoid Force**: หลีกเลี่ยง force click เมื่อเป็นไปได้
3. **Use Specific Locators**: ใช้ locators ที่ specific
4. **Handle Dynamic Content**: ใช้ waiting strategies สำหรับ dynamic content
