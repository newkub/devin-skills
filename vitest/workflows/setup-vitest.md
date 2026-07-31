---
title: Setup Vitest
description: ติดตั้งและตั้งค่า Vitest ใน project
auto_execution_mode: 3
---

## Goal

ติดตั้งและตั้งค่า Vitest สำหรับ unit testing ใน Vite projects

## Scope

- ติดตั้ง Vitest ด้วย Bun
- ตั้งค่า vitest.config.ts
- เพิ่ม scripts ใน package.json
- ตั้งค่า TypeScript support
- ตั้งค่า coverage

## Execute

### 1. ติดตั้ง Vitest

```bash
# ติดตั้ง Vitest และ dependencies
bun add -D vitest @vitest/ui @vitest/coverage-v8
```

### 2. สร้าง vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mock/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### 3. เพิ่ม scripts ใน package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### 4. ตั้งค่า TypeScript

สร้าง `vitest.d.ts`:

```typescript
/// <reference types="vitest/globals" />
```

เพิ่มใน `tsconfig.json`:

```json
{
  "include": ["vitest.d.ts", "src/**/*.ts", "src/**/*.test.ts"]
}
```

### 5. สร้าง test แรก

สร้าง `src/example.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('Example', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2)
  })
})
```

### 6. รัน test

```bash
bun run test
```

## Rules

- ใช้ `globals: true` เพื่อให้ใช้ `describe`, `it`, `expect` โดยไม่ต้อง import
- ใช้ `environment: 'node'` สำหรับ backend หรือ `environment: 'jsdom'` สำหรับ frontend
- Coverage provider `v8` เร็วกว่า `istanbul`

## Expected Outcome

- Vitest ติดตั้งและตั้งค่าใน project
- Scripts สำหรับ run tests และ coverage พร้อมใช้งาน
- TypeScript support ตั้งค่าเรียบร้อย
- Test แรกสามารถรันได้สำเร็จ
