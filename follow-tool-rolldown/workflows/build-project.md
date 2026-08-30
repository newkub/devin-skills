---
title: Build Project
description: Build project ด้วย Rolldown
auto_execution_mode: 3
---

## Goal

Build project ด้วย Rolldown อย่างมีประสิทธิภาพ

## Scope

- Development build
- Production build
- Watch mode
- Build options

## Execute

### 1. Development Build

Build สำหรับ development:

```bash
bun run build
```

หรือ:

```bash
bunx rolldown
```

### 2. Production Build

Build สำหรับ production ด้วย minification:

rolldown.config.ts:
```typescript
import { defineConfig } from 'rolldown'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: !isProd,
    minify: isProd,
  },
})
```

Build:

```bash
NODE_ENV=production bun run build
```

### 3. Watch Mode

Watch mode สำหรับ development:

```bash
bun run dev
```

หรือ:

```bash
bunx rolldown --watch
```

### 4. Build with Config

Build ด้วย config file เฉพาะ:

```bash
bunx rolldown --config rolldown.config.ts
```

### 5. Build with Custom Entry

Build ด้วย custom entry:

```bash
bunx rolldown --input src/main.ts
```

## Build Options

### Sourcemap

สร้าง sourcemap:

```typescript
export default defineConfig({
  output: {
    sourcemap: true,       // linked
    sourcemap: 'inline',   // inline
    sourcemap: 'hidden',   // hidden
  },
})
```

### Minify

Minify output:

```typescript
export default defineConfig({
  output: {
    minify: true,
  },
})
```

### Clear Output

ลบ output directory ก่อน build:

```typescript
export default defineConfig({
  clear: true,
})
```

### Tree Shaking

ตั้งค่า tree-shaking:

```typescript
export default defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    treeshakeLiterals: true,
  },
})
```

## Output Formats

### ESM

```typescript
export default defineConfig({
  output: {
    dir: 'dist/esm',
    format: 'esm',
  },
})
```

### CJS

```typescript
export default defineConfig({
  output: {
    dir: 'dist/cjs',
    format: 'cjs',
  },
})
```

### IIFE

```typescript
export default defineConfig({
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'MyLibrary',
  },
})
```

### UMD

```typescript
export default defineConfig({
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MyLibrary',
  },
})
```

## Code Splitting

### Manual Chunks

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
    },
  },
})
```

### Function Chunks

```typescript
export default defineConfig({
  output: {
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'vendor'
      }
    },
  },
})
```

## Rules

- ใช้ `bun run build` สำหรับ standard build
- ใช้ `--watch` สำหรับ development
- ใช้ `NODE_ENV=production` สำหรับ production build
- ตั้งค่า `minify: true` สำหรับ production

## Expected Outcome

- Build output ใน `dist/` directory
- Optimized bundle สำหรับ target environment
- Sourcemap สำหรับ debugging (ถ้าเปิด)
- Minified code สำหรับ production (ถ้าเปิด)
