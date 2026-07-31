# Testing

## Testing ใน Vite Projects

Vite มี ecosystem สำหรับ testing ที่ครบถ้วนทั้ง unit และ E2E testing

## Unit Testing with Vitest

### 1. Installation

```bash
bun add -D vitest @vitest/ui
```

### 2. Configuration

สร้าง `vitest.config.ts` หรือใช้ `vite.config.ts`

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

### 3. Setup File

สร้าง `tests/setup.ts` สำหรับ global test configuration

```typescript
// tests/setup.ts
import { vi } from 'vitest'

// Mock global objects
global.fetch = vi.fn()
```

### 4. Writing Tests

```typescript
// tests/utils.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '../src/utils/date'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01')
    expect(formatDate(date)).toBe('2024-01-01')
  })

  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('Invalid date')
  })
})
```

### 5. Component Testing (Vue)

```typescript
// tests/components/Button.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../src/components/Button.vue'

describe('Button', () => {
  it('renders text correctly', () => {
    const wrapper = mount(Button, {
      props: { text: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event', async () => {
    const wrapper = mount(Button)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### 6. Component Testing (React)

```typescript
// tests/components/Button.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../src/components/Button'

describe('Button', () => {
  it('renders text correctly', () => {
    render(<Button text="Click me" />)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button text="Click me" onClick={handleClick} />)
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### 7. Running Tests

```bash
# Run all tests
bunx vitest

# Run tests in watch mode
bunx vitest --watch

# Run tests with UI
bunx vitest --ui

# Run tests with coverage
bunx vitest --coverage
```

## E2E Testing with Playwright

### 1. Installation

```bash
bun add -D @playwright/test
bunx playwright install
```

### 2. Configuration

สร้าง `playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' },
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' },
    },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 3. Writing E2E Tests

```typescript
// tests/e2e/example.spec.ts
import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Vite App/)
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  await page.click('text=About')
  await expect(page).toHaveURL(/.*about/)
})
```

### 4. Running E2E Tests

```bash
# Run all E2E tests
bunx playwright test

# Run tests headed
bunx playwright test --headed

# Run tests with UI
bunx playwright test --ui

# Run tests in debug mode
bunx playwright test --debug
```

## Testing Best Practices

### 1. Test Organization

```
tests/
├── unit/              # Unit tests
│   ├── utils/
│   └── components/
├── integration/       # Integration tests
└── e2e/              # E2E tests
```

### 2. Test Naming

```typescript
// Good - descriptive
it('should return formatted date when given valid date', () => {})

// Bad - vague
it('works', () => {})
```

### 3. AAA Pattern

```typescript
it('should calculate total', () => {
  // Arrange
  const price = 100
  const quantity = 2

  // Act
  const total = calculateTotal(price, quantity)

  // Assert
  expect(total).toBe(200)
})
```

### 4. Mocking

```typescript
import { vi } from 'vitest'

// Mock function
const mockFn = vi.fn()
mockFn('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')

// Mock module
vi.mock('../src/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'test' })),
}))
```

### 5. Async Testing

```typescript
it('should fetch data', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

it('should timeout', async () => {
  await expect(fetchData()).resolves.toBeDefined()
}, 5000)
```

## Coverage

### 1. Enable Coverage

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
})
```

### 2. Coverage Thresholds

```typescript
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
```

### 3. Running Coverage

```bash
bunx vitest --coverage
```

## CI/CD Integration

### 1. GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bunx vitest
      - run: bunx playwright test
```

### 2. GitLab CI

```yaml
# .gitlab-ci.yml
test:
  script:
    - bun install
    - bunx vitest
    - bunx playwright test
```

## Testing Checklist

### Unit Tests

- [ ] Install Vitest
- [ ] Configure vitest.config.ts
- [ ] Write unit tests for utilities
- [ ] Write component tests
- [ ] Enable coverage
- [ ] Set coverage thresholds

### E2E Tests

- [ ] Install Playwright
- [ ] Configure playwright.config.ts
- [ ] Write E2E tests for critical flows
- [ ] Test on multiple browsers
- [ ] Integrate with CI/CD

### Best Practices

- [ ] Use descriptive test names
- [ ] Follow AAA pattern
- [ ] Mock external dependencies
- [ ] Test edge cases
- [ ] Keep tests fast
- [ ] Run tests in CI/CD
