# Fixtures

Fixtures ใน Vitest ใช้สำหรับ dependency injection และ setup/teardown logic ที่ reusable

## Overview

Fixtures ช่วยให้สร้าง test context ที่ custom ได้ ด้วย `test.extend()`

## Basic Usage

สร้าง fixtures ด้วย `test.extend()`:

```typescript
import { test as base } from 'vitest'

const test = base.extend<{
  user: { id: number; name: string }
}>({
  user: async ({}, use) => {
    const user = { id: 1, name: 'Test User' }
    await use(user)
  },
})

test('uses user fixture', ({ user }) => {
  expect(user.name).toBe('Test User')
})
```

## Fixture Lifecycle

Fixtures มี lifecycle hooks:

```typescript
test.extend<{
  db: Database
}>({
  db: async ({}, use) => {
    const db = await connect()
    await use(db)
    await db.disconnect()
  },
})
```

## Async Fixtures

Fixtures สามารถเป็น async ได้:

```typescript
test.extend<{
  data: Promise<Data>
}>({
  data: async ({}, use) => {
    const data = await fetchData()
    await use(data)
  },
})
```

## Nested Fixtures

สามารถ extend fixtures ที่มีอยู่แล้ว:

```typescript
const testWithUser = base.extend<{ user: User }>({ user: setupUser })
const testWithAdmin = testWithUser.extend<{ admin: Admin }>({ admin: setupAdmin })
```

## Best Practices

- ใช้ fixtures สำหรับ shared setup/teardown logic
- ใช้ fixtures สำหรับ dependency injection
- Clean up resources ใน fixture teardown
- ใช้ fixtures แทน `beforeEach/afterEach` เมื่อมี complexity
