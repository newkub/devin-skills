---
description: Migration จาก Jest หรือ testing frameworks อื่น
---

## Migration from Jest

### 1. ติดตั้ง Vitest

```bash
bun add -D vitest @vitest/ui @vitest/coverage-v8
```

### 2. อัปเดต Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 3. สร้าง vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8'
    }
  }
})
```

### 4. อัปเดต Imports

```typescript
// Jest
import { describe, it, expect } from '@jest/globals'

// Vitest
import { describe, it, expect } from 'vitest'
// หรือใช้ globals: true ไม่ต้อง import
```

### 5. Mock Migration

```typescript
// Jest
jest.mock('./api', () => ({
  fetchData: jest.fn()
}))

// Vitest
vi.mock('./api', () => ({
  fetchData: vi.fn()
}))
```

### 6. Timer Migration

```typescript
// Jest
jest.useFakeTimers()
jest.advanceTimersByTime(1000)

// Vitest
vi.useFakeTimers()
vi.advanceTimersByTime(1000)
```

## Compatibility

Vitest เข้ากันได้กับ:
- Jest matchers (expect API)
- Jest globals (describe, it, expect)
- Jest mock functions
- Most Jest plugins

## Breaking Changes

- ไม่รองรับ `jest.mock` แบบ automatic
- ไม่รองรับ `jest.genMockFromModule`
- Environment setup ต่างกันเล็กน้อย

## Migration Tools

ใช้ `jest-codemods` สำหรับ automated migration:

```bash
npx jest-codemods
```
