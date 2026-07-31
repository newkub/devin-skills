# Code Splitting

## Purpose

เข้าใจวิธีการ code splitting ใน Rolldown เพื่อแบ่ง code เป็น chunks และ load on-demand

## Scope

- Automatic code splitting
- Manual code splitting
- Dynamic imports
- Chunk naming

## Overview

Code splitting คือการแบ่ง bundle เป็น chunks หลายๆ ชิ้น เพื่อ:
- ลดขนาด initial bundle
- Load code on-demand
- Improve loading performance
- Enable better caching

```typescript
// Before: Single bundle
main.js (500KB)

// After: Split bundles
main.js (100KB)
chunk-vendor.js (300KB)
chunk-utils.js (100KB)
```

## Automatic Code Splitting

Rolldown แบ่ง code อัตโนมัติตาม entry points:

```typescript
export default defineConfig({
  input: {
    main: 'src/main.ts',
    worker: 'src/worker.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

**Output:**
```
dist/
  main.js      // main entry chunk
  worker.js    // worker entry chunk
```

### Shared Chunks

Code ที่ใช้ร่วมกันจะถูกแยกเป็น shared chunk:

```typescript
// main.ts
import { shared } from './shared'

// worker.ts
import { shared } from './shared'
```

**Output:**
```
dist/
  main.js        // main entry
  worker.js      // worker entry
  chunk-abc.js   // shared chunk (contains shared)
```

## Manual Code Splitting

### Manual Chunks Option

แบ่ง modules เป็น chunks ตาม pattern:

```typescript
export default defineConfig({
  output: {
    dir: 'dist',
    format: 'esm',
    manualChunks: {
      vendor: ['react', 'react-dom'],
      utils: ['lodash', 'date-fns'],
    },
  },
})
```

**Output:**
```
dist/
  main.js        // application code
  vendor.js      // react + react-dom
  utils.js       // lodash + date-fns
```

### Function Manual Chunks

ใช้ function สำหรับ dynamic chunking:

```typescript
export default defineConfig({
  output: {
    dir: 'dist',
    format: 'esm',
    manualChunks: (id) => {
      if (id.includes('node_modules')) {
        return 'vendor'
      }
      if (id.includes('src/utils')) {
        return 'utils'
      }
    },
  },
})
```

## Dynamic Imports

Dynamic imports สร้าง chunks แยกต่างหาก:

```typescript
// main.ts
const loadModule = async () => {
  const module = await import('./heavy-module')
  module.doSomething()
}
```

**Output:**
```
dist/
  main.js        // main entry
  chunk-abc.js   // heavy-module chunk
```

### Dynamic Import with Prefetch

```typescript
// Prefetch chunk
const loadModule = () => import(/* webpackPrefetch: true */ './heavy-module')
```

### Dynamic Import with Preload

```typescript
// Preload chunk
const loadModule = () => import(/* webpackPreload: true */ './heavy-module')
```

## Chunk Naming

### Entry File Names

```typescript
export default defineConfig({
  output: {
    entryFileNames: 'entries/[name].js',
  },
})
```

**Output:**
```
dist/entries/
  main.js
  worker.js
```

### Chunk File Names

```typescript
export default defineConfig({
  output: {
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
})
```

**Output:**
```
dist/chunks/
  vendor-abc123.js
  utils-def456.js
```

### Asset File Names

```typescript
export default defineConfig({
  output: {
    assetFileNames: 'assets/[name]-[hash][extname]',
  },
})
```

**Output:**
```
dist/assets/
  image-abc123.png
  style-def456.css
```

## Code Splitting Strategies

### Vendor Splitting

แยก vendor libraries เป็น chunk แยก:

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom', 'lodash'],
    },
  },
})
```

**Benefits:**
- Vendor changes ไม่ทำให้ application hash เปลี่ยน
- Better caching สำหรับ vendor code
- Faster rebuilds

### Route-based Splitting

แยก code ตาม routes:

```typescript
// routes/index.ts
export const routes = {
  home: () => import('./pages/home'),
  about: () => import('./pages/about'),
  contact: () => import('./pages/contact'),
}
```

### Feature-based Splitting

แยก code ตาม features:

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      auth: ['src/auth/login', 'src/auth/register'],
      dashboard: ['src/dashboard/analytics', 'src/dashboard/reports'],
    },
  },
})
```

## Chunk Loading

### ESM Loading

```html
<script type="module" src="/main.js"></script>
```

Browser จะ load chunks อัตโนมัติเมื่อต้องการ

### Preload Chunks

```html
<link rel="modulepreload" href="/chunk-abc.js">
```

### Prefetch Chunks

```html
<link rel="prefetch" href="/chunk-abc.js">
```

## Best Practices

1. **Split Vendor Code**: แยก vendor libraries
   ```typescript
   manualChunks: { vendor: ['react', 'react-dom'] }
   ```

2. **Use Dynamic Imports**: Load code on-demand
   ```typescript
   const module = await import('./heavy-module')
   ```

3. **Name Chunks Meaningfully**: ตั้งชื่อ chunks ให้สื่อความหมาย
   ```typescript
   chunkFileNames: 'chunks/[name]-[hash].js'
   ```

4. **Avoid Over-splitting**: ไม่แบ่ง chunks เกินไป
   - มากเกินไป = หลาย requests
   - น้อยเกินไป = bundle ใหญ่

5. **Monitor Chunk Sizes**: ตรวจสอบขนาด chunks
   ```bash
   bunx rolldown --config rolldown.config.ts
   ```

## Common Issues

### Circular Dependencies

Circular dependencies อาจทำให้ chunking ไม่ทำงาน:

```typescript
// a.ts
import { b } from './b'

// b.ts
import { a } from './a'
```

**Solution:** Refactor เพื่อลบ circular dependencies

### Shared Dependencies

Dependencies ที่ใช้ร่วมกันอาจถูก duplicate:

```typescript
// chunk-a.ts
import { lodash } from 'lodash'

// chunk-b.ts
import { lodash } from 'lodash'
```

**Solution:** ใช้ `manualChunks` เพื่อรวม shared dependencies

## Debugging

### Visualize Chunks

ตรวจสอบ chunks ที่ถูกสร้าง:

```bash
bunx rolldown --config rolldown.config.ts
```

### Analyze Bundle Size

ใช้ bundle analyzer:

```bash
bunx rolldown-plugin-visualizer
```

## Summary

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Automatic** | แบ่งตาม entry points | Multi-entry projects |
| **Manual** | แบ่งตาม pattern | Vendor splitting |
| **Dynamic** | Load on-demand | Route-based splitting |

## See Also

- [Three-Stage Pipeline](./three-stage-pipeline.md)
- [Tree Shaking](./tree-shaking.md)
- [Configuration Reference](../../references/configuration.md)
