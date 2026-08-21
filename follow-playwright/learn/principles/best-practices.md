# Best Practices

## Definition

Best practices สำหรับการเขียน Playwright tests ที่ reliable, maintainable, และ efficient

## Locators

### Use Role-based Locators

```typescript
// Good
page.getByRole('button', { name: 'Submit' })

// Avoid
page.locator('button.submit')
```

### Use Text Locators

```typescript
// Good
page.getByText('Welcome')

// Avoid
page.locator('div').filter({ hasText: 'Welcome' })
```

### Use Test IDs

```typescript
// Good
page.getByTestId('submit-button')

// Avoid
page.locator('button[type="submit"]')
```

## Assertions

### Use Web-first Assertions

```typescript
// Good
await expect(page.getByText('Welcome')).toBeVisible();

// Avoid
await page.waitForSelector('text=Welcome');
```

### Be Specific

```typescript
// Good
await expect(page).toHaveURL(/dashboard/);

// Avoid
await expect(page.url()).toContain('dashboard');
```

## Test Organization

### Page Object Pattern

```typescript
// Good
const loginPage = new LoginPage(page);
await loginPage.login('user', 'pass');

// Avoid
await page.goto('/login');
await page.getByLabel('Username').fill('user');
await page.getByLabel('Password').fill('pass');
await page.getByRole('button').click();
```

### Group Tests

```typescript
// Good
test.describe('Authentication', () => {
  test('login success', async ({ page }) => {
    // test
  });

  test('login failure', async ({ page }) => {
    // test
  });
});
```

## Performance

### Use Parallel Execution

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,
});
```

### Block Unnecessary Resources

```typescript
// Block images for faster tests
await page.route('**/*.{png,jpg,jpeg}', route => route.abort());
```

## Reliability

### Use Auto-waiting

```typescript
// Good - Playwright waits automatically
await page.getByRole('button').click();

// Avoid - Manual waits
await page.waitForTimeout(1000);
await page.getByRole('button').click();
```

### Handle Dynamic Content

```typescript
// Good
await expect(page.getByText('Loading')).not.toBeVisible();

// Avoid
await page.waitForTimeout(2000);
```

## Maintenance

### Use Descriptive Test Names

```typescript
// Good
test('user can login with valid credentials', async ({ page }) => {
  // test
});

// Avoid
test('test 1', async ({ page }) => {
  // test
});
```

### Reuse Fixtures

```typescript
// Good
test('authenticated user can view profile', async ({ page, authenticatedPage }) => {
  // test
});

// Avoid
test('authenticated user can view profile', async ({ page }) => {
  await page.goto('/login');
  await page.login('user', 'pass');
  // test
});
```

## Debugging

### Use UI Mode

```bash
# Interactive debugging
bunx playwright test --ui
```

### Use Traces

```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry',
}
```

## Best Practices Summary

1. **Use Role-based Locators**: ใช้ role-based locators ส่วนใหญ่
2. **Web-first Assertions**: ใช้ web-first assertions
3. **Page Object Pattern**: ใช้ page object pattern
4. **Parallel Execution**: ใช้ parallel execution
5. **Auto-waiting**: ใช้ auto-waiting แทน manual waits
6. **Descriptive Names**: ใช้ descriptive test names
7. **UI Mode**: ใช้ UI mode สำหรับ debugging
8. **Traces**: ใช้ traces สำหรับ post-mortem debugging
