---
title: Write Test
description: เขียน unit tests ด้วย Vitest
auto_execution_mode: 3
---

## Goal

เขียน unit tests ที่มีคุณภาพด้วย Vitest

## Scope

- เขียน test cases ด้วย describe/it
- ใช้ matchers สำหรับ assertions
- ใช้ hooks (beforeEach, afterEach)
- Mock functions และ modules
- Test async code

## Execute

### 1. Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('Calculator', () => {
  let calculator: Calculator

  beforeEach(() => {
    calculator = new Calculator()
  })

  describe('add', () => {
    it('should add two numbers', () => {
      expect(calculator.add(1, 2)).toBe(3)
    })

    it('should handle negative numbers', () => {
      expect(calculator.add(-1, -2)).toBe(-3)
    })
  })
})
```

### 2. Common Matchers

```typescript
// Equality
expect(value).toBe(3)
expect(value).toEqual({ a: 1 })

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeDefined()
expect(value).toBeNull()

// Numbers
expect(value).toBeGreaterThan(5)
expect(value).toBeLessThan(10)
expect(value).toBeCloseTo(0.3, 2)

// Strings
expect(str).toContain('hello')
expect(str).toMatch(/regex/)

// Arrays
expect(arr).toHaveLength(3)
expect(arr).toContain(item)
expect(arr).toEqual([1, 2, 3])

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toMatchObject({ a: 1 })
```

### 3. Hooks

```typescript
describe('Database', () => {
  beforeAll(() => {
    // Run once before all tests
    setupDatabase()
  })

  afterAll(() => {
    // Run once after all tests
    cleanupDatabase()
  })

  beforeEach(() => {
    // Run before each test
    seedDatabase()
  })

  afterEach(() => {
    // Run after each test
    clearDatabase()
  })
})
```

### 4. Async Testing

```typescript
// Promises
it('should fetch data', async () => {
  const data = await fetchData()
  expect(data).toBeDefined()
})

// Async/await
it('should handle async', async () => {
  await expect(asyncOperation()).resolves.toBe('result')
  await expect(failingOperation()).rejects.toThrow('error')
})

// Callbacks
it('should callback', (done) => {
  fetchData((err, data) => {
    expect(data).toBeDefined()
    done()
  })
})
```

### 5. Mocking Functions

```typescript
import { vi } from 'vitest'

// Mock function
const mockFn = vi.fn()
mockFn('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(1)

// Mock return value
mockFn.mockReturnValue(42)
mockFn.mockResolvedValue('async result')

// Mock implementation
mockFn.mockImplementation((a, b) => a + b)
```

### 6. Mocking Modules

```typescript
// Mock entire module
vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve('mocked'))
}))

// Mock specific function
import { fetchData } from './api'
vi.mocked(fetchData).mockResolvedValue('data')
```

## Rules

- ใช้ `describe` จัดกลุ่ม tests ที่เกี่ยวข้องกัน
- ใช้ `beforeEach` สำหรับ setup ที่ต้องการทุก test
- ใช้ `vi.fn()` สำหรับ mock functions
- ใช้ `vi.mock()` สำหรับ mock modules

## Expected Outcome

- Unit tests ที่มีโครงสร้างชัดเจน
- Test cases ที่ใช้ matchers ที่เหมาะสม
- Hooks สำหรับ setup และ cleanup ที่ proper
- Mock functions และ modules ที่ทำงานได้
- Async code ที่ test ได้อย่างถูกต้อง
