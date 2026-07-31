# Quick Start

## Purpose

คู่มือเริ่มต้นใช้งาน Vitest — สร้าง test แรกใน 5 นาที

## Scope

- Project Setup
- First Test
- Run Tests
- Next Steps

## Project Setup

### 1. Install Vitest

```bash
bun add -D vitest jsdom
```

### 2. Create Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
  },
})
```

### 3. Add Script

```json
// package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## First Test

### Create Test File

```typescript
// src/utils/sum.test.ts
import { describe, it, expect } from 'vitest'

// Function ที่ต้องการ test
function sum(a: number, b: number): number {
  return a + b
}

// Test
describe('sum', () => {
  it('adds two positive numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })

  it('adds negative numbers', () => {
    expect(sum(-1, -1)).toBe(-2)
  })

  it('adds zero', () => {
    expect(sum(5, 0)).toBe(5)
  })
})
```

### With Real Implementation

```typescript
// src/utils/sum.ts
export function sum(a: number, b: number): number {
  return a + b
}
```

```typescript
// src/utils/sum.test.ts
import { describe, it, expect } from 'vitest'
import { sum } from './sum'

describe('sum', () => {
  it('adds two numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
})
```

## Run Tests

### Watch Mode (Development)

```bash
bun test
# หรือ
vitest
```

Vitest จะ watch ไฟล์และรัน tests เมื่อมีการเปลี่ยนแปลง

### CI Mode (Run Once)

```bash
bun run test
# หรือ
vitest run
```

### With Coverage

```bash
vitest run --coverage
```

### Specific File

```bash
vitest run src/utils/sum.test.ts
```

## Common Matchers

```typescript
describe('Common Matchers', () => {
  it('equality', () => {
    expect(1 + 1).toBe(2)
    expect({ a: 1 }).toEqual({ a: 1 })
  })

  it('truthiness', () => {
    expect('hello').toBeTruthy()
    expect(null).toBeNull()
    expect('').toBeFalsy()
  })

  it('arrays', () => {
    expect([1, 2, 3]).toContain(2)
    expect([1, 2]).toHaveLength(2)
  })

  it('exceptions', () => {
    const throwError = () => { throw new Error('oops') }
    expect(throwError).toThrow()
    expect(throwError).toThrow('oops')
  })
})
```

## Test with Async/Await

```typescript
describe('Async', () => {
  it('async function', async () => {
    const result = await Promise.resolve(42)
    expect(result).toBe(42)
  })

  it('async with resolves', async () => {
    await expect(Promise.resolve(42)).resolves.toBe(42)
  })
})
```

## Mocking Example

```typescript
describe('Mocking', () => {
  it('mocks a function', () => {
    const mockFn = vi.fn(() => 42)
    
    const result = mockFn()
    
    expect(result).toBe(42)
    expect(mockFn).toHaveBeenCalled()
  })

  it('mocks a module', () => {
    vi.mock('./api', () => ({
      fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'John' }),
    }))
    
    // Test code that uses fetchUser
  })
})
```

## Next Steps

| Resource | Description |
|----------|-------------|
| [Features](features.md) | Features ทั้งหมดของ Vitest |
| [Best Practices](best-practices.md) | แนวทางการเขียน test ที่ดี |
| [Configuration](configuration.md) | การตั้งค่าเพิ่มเติม |
| [References](../references/) | API reference และ CLI commands |