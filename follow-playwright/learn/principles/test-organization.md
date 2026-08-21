# Test Organization

## Definition

Test organization คือการจัดเรียง Playwright tests:
- Logical grouping
- Page object pattern
- Test data management
- Reusable utilities

## Page Object Pattern

### Page Object

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
```

### Using Page Object

```typescript
// tests/login.spec.ts
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login success', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```

## Test Data

### Fixtures

```typescript
// tests/fixtures.ts
import { test as base } from '@playwright/test';

type TestFixtures = {
  testData: {
    username: string;
    password: string;
  };
};

export const test = base.extend<TestFixtures>({
  testData: async ({}, use) => {
    use({ username: 'test@example.com', password: 'password' });
  },
});
```

## Best Practices

1. **Use Page Objects**: ใช้ page object pattern
2. **Group Tests**: Group tests ตาม feature
3. **Reusable Utilities**: ใช้ reusable utilities
4. **Test Data Separation**: Separate test data จาก tests
