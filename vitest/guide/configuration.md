# Configuration

## Purpose

แนะนำการตั้งค่า Vitest ผ่าน vitest.config.ts

## Scope

- Basic Configuration
- Test Environments
- File Patterns
- Coverage Settings

## Basic Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ตั้งค่าพื้นฐาน
  },
})
```

## Test Environments

```typescript
export default defineConfig({
  test: {
    environment: 'node',
    globals: false,
    testTimeout: 5000,
    hookTimeout: 10000,
  },
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `environment` | string | `'node'` | Test environment |
| `globals` | boolean | `false` | Enable globals |
| `testTimeout` | number | `5000` | Test timeout in ms |
| `hookTimeout` | number | `10000` | Hook timeout in ms |

## File Patterns

```typescript
export default defineConfig({
  test: {
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: ['node_modules', 'dist', '**/*.d.ts'],
    watchExclude: ['**/node_modules/**', '**/dist/**'],
  },
})
```

## Coverage Configuration

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules', '**/*.d.ts', '**/*.test.ts'],
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

## Globals Mode

```typescript
export default defineConfig({
  test: {
    globals: true,
  },
})
```

```typescript
// ไม่ต้อง import เมื่อ globals: true
describe('Calculator', () => {
  it('adds numbers', () => {
    expect(1 + 1).toBe(2)
  })
})
```

## Watch Mode

```typescript
export default defineConfig({
  test: {
    watch: true,
    ui: false,
    open: false,
  },
})
```

## Pool Configuration

```typescript
export default defineConfig({
  test: {
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 2,
      },
    },
  },
})
```

| Pool | Description | Use Case |
|------|-------------|----------|
| `threads` | Workers in threads | Cross-platform |
| `forks` | Multiple processes | Best compatibility |
| `vmThreads` | Isolated VMs | Fast, memory-intensive |

## Type Checking

```typescript
export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
      tsconfigPath: './tsconfig.json',
      include: ['**/*.test.ts'],
      exclude: ['**/node_modules/**'],
    },
  },
})
```

## Environment Variables

```typescript
export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'test',
      API_URL: 'http://localhost:3000',
    },
    envFiles: ['.env.test', '.env.local'],
  },
})
```

## Alias Configuration

```typescript
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
```

## Summary

| Category | Key Options |
|----------|-------------|
| **Environment** | `environment`, `globals` |
| **Files** | `include`, `exclude`, `watchExclude` |
| **Coverage** | `provider`, `reporter`, `thresholds` |
| **Performance** | `pool`, `poolOptions` |
| **Type Check** | `typecheck.enabled`, `tsconfigPath` |