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
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

ArkType ต้องการ `strict` หรือ `strictNullChecks` เปิดไว้ และแนะนำให้เปิด `exactOptionalPropertyTypes` และ `skipLibCheck`

### VSCode Settings

```json
{
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "typescript.preferences.autoImportSpecifierExcludeRegexes": [
    "^(node:)?os$"
  ]
}
```

## Build Configuration

### Vite

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ["arktype"],
  },
})
```

### Rollup

```javascript
// rollup.config.js
export default {
  external: ["arktype"],
}
```

## Development Configuration

### Vitest

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
  },
})
```

## Sources

- https://arktype.io/docs/intro/setup
- https://www.typescriptlang.org/tsconfig
