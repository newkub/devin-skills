---
title: Build Project
description: Build a project with Rolldown
auto_execution_mode: 3
---

## Goal

Build a project efficiently with Rolldown

## Scope

- Development build
- Production build
- Watch mode
- Build options

## Execute

### 1. Development Build

Build for development:

```bash
bun run build
```

Or:

```bash
bunx rolldown
```

### 2. Production Build

Build for production with minification:

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

Watch mode for development:

```bash
bun run dev
```

Or:

```bash
bunx rolldown --watch
```

### 4. Build with Config

Build with a specific config file:

```bash
bunx rolldown --config rolldown.config.ts
```

### 5. Build with Custom Entry

Build with a custom entry:

```bash
bunx rolldown --input src/main.ts
```

## Build Options

### Sourcemap

Generate a sourcemap:

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

Delete the output directory before build:

```typescript
export default defineConfig({
  clear: true,
})
```

### Tree Shaking

Configure tree-shaking:

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

- Use `bun run build` for the standard build
- Use `--watch` for development
- Use `NODE_ENV=production` for a production build
- Set `minify: true` for production

## Expected Outcome

- Build output in the `dist/` directory
- An optimized bundle for the target environment
- Sourcemaps for debugging (when enabled)
- Minified code for production (when enabled)
