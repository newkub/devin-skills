# Locators

## Definition

Locators คือวิธีค้นหา elements ใน page:
- Robust และ reliable
- Auto-waiting built-in
- Multiple strategies
- Role-based locators

## Locator Strategies

### Role-based Locators

```typescript
// Best practice
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Learn more' })
```

### Text Locators

```typescript
page.getByText('Submit')
page.getByText('Submit', { exact: true })
```

### Label Locators

```typescript
page.getByLabel('Username')
page.getByLabel('Password')
```

### Placeholder Locators

```typescript
page.getByPlaceholder('Search')
page.getByPlaceholder(/email/i)
```

### Alt Text Locators

```typescript
page.getByAltText('Logo')
page.getByAltText(/profile/i)
```

### Title Locators

```typescript
page.getByTitle('Close')
```

### Test ID Locators

```typescript
page.getByTestId('submit-button')
```

## Best Practices

1. **Use Role-based**: ใช้ role-based locators ส่วนใหญ่
2. **Avoid CSS/XPath**: หลีกเลี่ยง CSS/XPath selectors
3. **Use Text**: ใช้ text locators สำหรับ visible text
4. **Use Test IDs**: ใช้ test IDs สำหรับ dynamic content
