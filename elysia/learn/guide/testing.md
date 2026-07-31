# Testing

วิธีการทดสอบ Elysia applications

## Testing Tools

### Recommended Tools

- **Bun Test** - Built-in test runner สำหรับ Bun
- **Vitest** - Fast test runner สำหรับ TypeScript
- **@elysia/testing** - Official testing utilities

### Installation

```bash
# ใช้ Bun Test (built-in)
# ไม่ต้องติดตั้ง

# ใช้ Vitest
bun add -D vitest @vitest/ui

# ใช้ @elysia/testing
bun add -D @elysia/testing
```

## Unit Testing

### Test Route Handlers

```typescript
// test/routes.test.ts
import { describe, it, expect } from 'bun:test'
import { Elysia } from 'elysia'

describe('User Routes', () => {
  it('should return user list', async () => {
    const app = new Elysia()
      .get('/users', () => [{ id: 1, name: 'John' }])

    const response = await app.handle(new Request('http://localhost/users'))
    const data = await response.json()

    expect(data).toEqual([{ id: 1, name: 'John' }])
  })
})
```

### Test with @elysia/testing

```typescript
import { describe, it, expect } from 'bun:test'
import { Elysia } from 'elysia'
import { t } from 'elysia'

describe('User Routes', () => {
  it('should create user with validation', async () => {
    const app = new Elysia()
      .post('/users', ({ body }) => body, {
        body: t.Object({
          name: t.String(),
          email: t.String()
        })
      })

    const response = await app
      .handle(
        new Request('http://localhost/users', {
          method: 'POST',
          body: JSON.stringify({ name: 'John', email: 'john@example.com' }),
          headers: { 'Content-Type': 'application/json' }
        })
      )

    expect(response.status).toBe(200)
  })
})
```

## Integration Testing

### Test Database Integration

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { Database } from 'bun:sqlite'

describe('User Integration', () => {
  let db: Database

  beforeAll(() => {
    db = new Database(':memory:')
    db.exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)')
  })

  afterAll(() => {
    db.close()
  })

  it('should save user to database', async () => {
    const app = new Elysia()
      .derive(() => ({ db }))
      .post('/users', ({ body, db }) => {
        db.exec(`INSERT INTO users (name) VALUES ('${body.name}')`)
        return { success: true }
      })

    const response = await app.handle(
      new Request('http://localhost/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'John' }),
        headers: { 'Content-Type': 'application/json' }
      })
    )

    expect(response.status).toBe(200)
  })
})
```

## End-to-End Testing

### Using Playwright

```bash
bun add -D @playwright/test
bunx playwright install
```

```typescript
// test/e2e/app.spec.ts
import { test, expect } from '@playwright/test'

test('home page loads', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page).toHaveTitle('Elysia App')
})

test('user can create account', async ({ page }) => {
  await page.goto('http://localhost:3000/register')
  await page.fill('input[name="name"]', 'John')
  await page.fill('input[name="email"]', 'john@example.com')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('http://localhost:3000/dashboard')
})
```

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Bun Test Configuration

```typescript
// package.json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage"
  }
}
```

## Mocking

### Mock Database

```typescript
import { describe, it, expect } from 'bun:test'
import { Elysia } from 'elysia'

describe('User Service', () => {
  it('should return user from mock database', async () => {
    const mockDb = {
      getUser: (id: string) => ({ id, name: 'John' })
    }

    const app = new Elysia()
      .derive(() => ({ db: mockDb }))
      .get('/users/:id', ({ params, db }) => db.getUser(params.id))

    const response = await app.handle(new Request('http://localhost/users/1'))
    const data = await response.json()

    expect(data).toEqual({ id: '1', name: 'John' })
  })
})
```

### Mock External APIs

```typescript
import { describe, it, expect, spyOn } from 'bun:test'

describe('External API', () => {
  it('should call external API', async () => {
    const mockFetch = spyOn(global, 'fetch').mockResolvedValue({
      json: async () => ({ data: 'test' })
    } as Response)

    const app = new Elysia()
      .get('/external', async () => {
        const res = await fetch('https://api.example.com')
        return res.json()
      })

    await app.handle(new Request('http://localhost/external'))
    expect(mockFetch).toHaveBeenCalled()
    mockFetch.mockRestore()
  })
})
```

## Test Coverage

### Generate Coverage Report

```bash
# Bun Test
bun test --coverage

# Vitest
bunx vitest run --coverage
```

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
```

## Best Practices

- **Test Isolation**: แต่ละ test ควร independent
- **Clear Names**: ตั้งชื่อ test ให้ชัดเจน
- **Arrange-Act-Assert**: ใช้ pattern นี้ในทุก test
- **Mock External Dependencies**: mock external services
- **Test Edge Cases**: ทดสอบ edge cases และ error cases
- **Coverage Goals**: มี coverage อย่างน้อย 80%
- **CI Integration**: รัน tests ใน CI/CD
