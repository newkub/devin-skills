# Assertions

## Definition

Assertions คือการตรวจสอบ state ของ page:
- Auto-waiting built-in
- Multiple assertion types
- Retry logic
- Clear error messages

## Assertion Types

### Text Assertions

```typescript
await expect(page.getByText('Welcome')).toBeVisible();
await expect(page.getByText('Error')).not.toBeVisible();
```

### Locator Assertions

```typescript
await expect(page.locator('.header')).toBeVisible();
await expect(page.locator('.header')).toHaveCount(1);
```

### Page Assertions

```typescript
await expect(page).toHaveTitle(/Home/);
await expect(page).toHaveURL(/dashboard/);
```

### Element State

```typescript
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.getByRole('button')).toBeDisabled();
await expect(page.getByRole('button')).toBeChecked();
```

### Attribute Assertions

```typescript
await expect(page.locator('input')).toHaveAttribute('type', 'text');
await expect(page.locator('div')).toHaveClass(/active/);
```

## Best Practices

1. **Use Web-first Assertions**: ใช้ web-first assertions
2. **Wait Automatically**: ใช้ auto-waiting แทน manual waits
3. **Be Specific**: ใช้ assertions ที่ specific
4. **Test State**: Test state ไม่ใช่ implementation
