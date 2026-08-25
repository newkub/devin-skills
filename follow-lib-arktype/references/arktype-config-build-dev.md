---
title: Configuration Reference - Build & Development
description: Build และ development configuration สำหรับ ArkType
---

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Definitions

```typescript
// Global type definitions
declare global {
  namespace ArkType {
    interface Config {
      // Custom config
    }
  }
}
```

## Build Configuration

### Bundler Configuration

#### Vite

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['arktype']
  }
})
```

#### Rollup

```javascript
// rollup.config.js
export default {
  external: ['arktype']
}
```

## Development Configuration

### Testing Configuration

#### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true
  }
})
```

### Linting Configuration

#### Biome

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      }
    }
  }
}
```

## ตารางสรุป Configuration Files

| File | Purpose | Example |
|------|---------|---------|
| tsconfig.json | TypeScript config | Strict mode |
| vite.config.ts | Vite config | Optimization |
| rollup.config.js | Rollup config | External deps |
| vitest.config.ts | Vitest config | Test globals |
| biome.json | Biome config | Linting rules |
