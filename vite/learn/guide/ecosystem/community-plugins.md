# Popular Community Plugins

## 1. Build Optimization

### vite-plugin-compression

Compress assets ใน production build

```bash
bun add -D vite-plugin-compression
```

```typescript
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
})
```

### rollup-plugin-visualizer

Visualize bundle size

```bash
bun add -D rollup-plugin-visualizer
```

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({ open: true }),
  ],
})
```

## 2. CSS Optimization

### vite-plugin-purgecss

Remove unused CSS

```bash
bun add -D vite-plugin-purgecss
```

```typescript
import { purgeCss } from 'vite-plugin-purgecss'

export default defineConfig({
  plugins: [
    purgeCss({
      content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    }),
  ],
})
```

### vite-plugin-sass-dts

Generate TypeScript definitions for SCSS

```bash
bun add -D vite-plugin-sass-dts
```

## 3. Development Tools

### vite-plugin-inspect

Inspect Vite plugins และ internals

```bash
bun add -D vite-plugin-inspect
```

```typescript
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
  plugins: [
    Inspect(),
  ],
})
```

### vite-plugin-remix-routes

Generate routes สำหรับ Remix

```bash
bun add -D vite-plugin-remix-routes
```

## 4. Testing

### vite-plugin-vitest

Integrate Vitest กับ Vite

```bash
bun add -D vitest @vitest/ui
```

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
  },
})
```

## 5. UI Components

### unplugin-vue-components

Auto-import Vue components

```bash
bun add -D unplugin-vue-components unplugin-auto-import
```

```typescript
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    Components({
      dts: true,
    }),
    AutoImport({
      dts: true,
    }),
  ],
})
```
