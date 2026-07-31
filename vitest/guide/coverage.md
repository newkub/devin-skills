# Coverage

Code coverage ใน Vitest รองรับ v8 และ istanbul

## Setup

ติดตั้ง dependencies:

```bash
bun add -D @vitest/coverage-v8
# หรือ
bun add -D @vitest/coverage-istanbul
```

ตั้งค่าใน `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/'],
    },
  },
})
```

## Run Coverage

```bash
bun run test --coverage
```

## Providers

- `v8` - default, AST-based coverage remapping, เร็วและแม่นยำ
- `istanbul` - compatible กับ Istanbul tools

## Configuration

ตั้งค่า thresholds:

```typescript
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

## Ignore Comments

ใช้ `/* v8 ignore next */` สำหรับ v8:

```typescript
/* v8 ignore next */
function uncovered() {
  return 'not covered'
}
```

ใช้ `/* istanbul ignore next */` สำหรับ istanbul
