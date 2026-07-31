# Test Context

Test Context ใน Vitest ใช้สำหรับ pass data ระหว่าง fixtures และ tests

## Overview

Test context เป็น object ที่ pass เข้าไปใน test function ผ่าน fixtures

## Basic Usage

Test context ถูก pass ผ่าน parameters:

```typescript
import { test } from 'vitest'

test.extend<{
  foo: string
}>({
  foo: async ({}, use) => {
    await use('bar')
  },
})

test('uses context', ({ foo }) => {
  expect(foo).toBe('bar')
})
```

## Built-in Context

Vitest มี built-in context:

```typescript
test('built-in context', ({ expect, task }) => {
  expect(task.name).toBe('built-in context')
})
```

## Context In Fixtures

Fixtures สามารถ access context จาก fixtures อื่น:

```typescript
test.extend<{
  db: Database
  user: User
}>({
  db: async ({}, use) => {
    await use(new Database())
  },
  user: async ({ db }, use) => {
    const user = await db.getUser()
    await use(user)
  },
})
```

## Context Modifiers

ใช้ context กับ test modifiers:

```typescript
test.concurrent('concurrent with context', ({ foo }) => {
  expect(foo).toBeDefined()
})
```

## Best Practices

- ใช้ context สำหรับ pass data ระหว่าง fixtures
- ใช้ context แทน global variables
- ใช้ TypeScript สำหรับ type-safe context
- ตั้งชื่อ context ที่ชัดเจน
