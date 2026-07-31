# Testing Guide

คู่มือการทดสอบ oRPC procedures

## Unit Testing

ทดสอบ procedures แยก:

```typescript
import { describe, it, expect } from 'vitest'
import { appRouter } from './router'

describe('hello procedure', () => {
  it('should return greeting', async () => {
    const result = await appRouter.hello({
      input: { name: 'World' },
      context: {}
    })
    expect(result).toEqual({ message: 'Hello World!' })
  })
})
```

## Integration Testing

ทดสอบ client-server integration:

```typescript
import { describe, it, expect } from 'vitest'
import { orpcClient } from './client'

describe('hello integration', () => {
  it('should call procedure', async () => {
    const result = await orpcClient.hello.query({ name: 'World' })
    expect(result.message).toBe('Hello World!')
  })
})
```

## Mock Data

ใช้ mock data สำหรับ testing:

```typescript
import { vi } from 'vitest'

vi.mock('./db', () => ({
  getUser: vi.fn(() => ({ id: '1', name: 'John' }))
}))
```

## Test Error Handling

ทดสอบ error handling:

```typescript
it('should throw NOT_FOUND error', async () => {
  await expect(
    appRouter.users.get({ input: { id: '999' }, context: {} })
  ).rejects.toThrow('NOT_FOUND')
})
```

## Test Middleware

ทดสอบ middleware:

```typescript
it('should authenticate user', async () => {
  const result = await appRouter.protected.procedure({
    input: {},
    context: { user: { id: '1' } }
  })
  expect(result).toBeDefined()
})
```

## Test With Vitest

ตั้งค่า Vitest:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node'
  }
})
```
