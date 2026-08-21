# Performance Tips

## Purpose

เทคนิคการ optimize performance สำหรับ Rolldown

## Scope

- Build performance
- Runtime performance
- Bundle size optimization
- Caching strategies

## Build Performance

### 1. Use Watch Mode

Watch mode ใช้ incremental builds เพื่อลด build time:

```bash
bunx rolldown --watch
```

**Benefits:**
- Rebuild เฉพาะ files ที่เปลี่ยน
- Parallel module loading
- AST caching

### 2. Enable Build Cache

Rolldown ใช้ build cache อัตโนมัติใน watch mode:

```typescript
export default defineConfig({
  // Cache enabled automatically in watch mode
})
```

### 3. Use Native Binding

Rolldown ใช้ native Rust binding สำหรับ performance สูงสุด:

```bash
# Native binding ถูกใช้โดย default
bunx rolldown
```

### 4. Optimize Module Resolution

กำหนด extensions และ aliases เพื่อลด resolution time:

```typescript
export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js'],  // จำกัด extensions
    alias: {
      '@': './src',              // ใช้ aliases
    },
  },
})
```

### 5. Disable Source Maps in Dev

ปิด source maps ใน development เพื่อลด build time:

```typescript
export default defineConfig({
  output: {
    sourcemap: false,  // faster builds
  },
})
```

## Runtime Performance

### 1. Use Code Splitting

แบ่ง code เป็น chunks เพื่อ load on-demand:

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
    },
  },
})
```

**Benefits:**
- ลด initial bundle size
- Load code on-demand
- Better caching

### 2. Tree Shake Unused Code

ตั้งค่า tree-shaking อย่างเหมาะสม:

```typescript
export default defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    treeshakeLiterals: true,
  },
})
```

### 3. Minify Output

Minify code ใน production:

```typescript
export default defineConfig({
  output: {
    minify: true,
  },
})
```

### 4. Use Modern JavaScript

Target modern JavaScript เพื่อลบ polyfills:

```typescript
export default defineConfig({
  target: 'es2020',
})
```

### 5. External Large Libraries

External libraries ที่ใหญ่:

```typescript
export default defineConfig({
  external: ['react', 'react-dom', 'lodash'],
})
```

## Bundle Size Optimization

### 1. Analyze Bundle Size

ใช้ bundle analyzer:

```bash
bunx rolldown-plugin-visualizer
```

### 2. Remove Unused Dependencies

ตรวจสอบ dependencies ที่ไม่ถูกใช้:

```bash
bunx depcheck
```

### 3. Use Smaller Alternatives

ใช้ libraries ที่เล็กกว่า:

```typescript
// Instead of lodash
import { debounce } from 'lodash-es'  // tree-shakeable

// Or use native
const debounce = (fn, delay) => { /* ... */ }
```

### 4. Compress Assets

Compress assets ด้วย compression:

```typescript
export default defineConfig({
  output: {
    // Rolldown uses oxc_minifier for compression
    minify: true,
  },
})
```

### 5. Use Dynamic Imports

Load code on-demand:

```typescript
const loadModule = async () => {
  const module = await import('./heavy-module')
  module.doSomething()
}
```

## Caching Strategies

### 1. Content Hashing

ใช้ content hashing สำหรับ long-term caching:

```typescript
export default defineConfig({
  output: {
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
    assetFileNames: '[name]-[hash][extname]',
  },
})
```

### 2. Separate Vendor Chunks

แยก vendor chunks เพื่อ better caching:

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
    },
  },
})
```

### 3. Use Immutable Caching

ใช้ immutable caching สำหรับ vendor code:

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

### 4. Cache Busting

ใช้ cache busting สำหรับ updates:

```typescript
export default defineConfig({
  output: {
    entryFileNames: '[name]-[contenthash].js',
  },
})
```

## Memory Optimization

### 1. Limit Parallel Processing

จำกัด parallel processing สำหรับ large projects:

```typescript
export default defineConfig({
  // Rolldown จัดการ memory อัตโนมัติ
  // ไม่ต้อง configure เพิ่มเติม
})
```

### 2. Use Incremental Builds

ใช้ incremental builds เพื่อลด memory usage:

```bash
bunx rolldown --watch
```

### 3. Clean Output Directory

ลบ output directory ก่อน build:

```typescript
export default defineConfig({
  clear: true,
})
```

## Monitoring Performance

### 1. Measure Build Time

วัด build time:

```bash
time bunx rolldown
```

### 2. Profile Build

Profile build ด้วย diagnostics:

```bash
ROLLDOWN_DEBUG=1 bunx rolldown
```

### 3. Monitor Memory Usage

ตรวจสอบ memory usage:

```bash
# Use system monitoring tools
# Rolldown ใช้ memory อย่างมีประสิทธิภาพ
```

## Common Performance Issues

### 1. Slow Initial Build

**Cause:** Large project หรือ complex dependencies

**Solution:**
- ใช้ watch mode สำหรับ incremental builds
- External large dependencies
- Optimize module resolution

### 2. Large Bundle Size

**Cause:** ไม่มี code splitting หรือ tree-shaking

**Solution:**
- เปิด tree-shaking
- ใช้ code splitting
- External large libraries

### 3. Slow Watch Mode

**Cause:** หลาย files ถูก watch

**Solution:**
- จำกัด watch scope
- ใช้ `.gitignore` patterns
- Optimize file watching

## Performance Benchmarks

Rolldown vs Other Bundlers:

| Operation | Rolldown | Rollup | esbuild |
|-----------|----------|--------|---------|
| Cold Build | 10-100x faster | Baseline | 2-5x faster |
| Watch Mode | 10-50x faster | Baseline | 2-3x faster |
| Tree Shaking | Advanced | Advanced | Basic |
| Minification | Advanced | Basic | Advanced |

## Summary

| Category | Tip |
|----------|-----|
| **Build** | Use watch mode, optimize resolution |
| **Runtime** | Code splitting, tree shaking, minify |
| **Bundle Size** | Analyze, remove unused, use alternatives |
| **Caching** | Content hashing, separate vendor chunks |
| **Memory** | Incremental builds, clean output |

## See Also

- [Best Practices](./best-practices.md)
- [Code Splitting](../key-concepts/code-splitting.md)
- [Tree Shaking](../key-concepts/tree-shaking.md)
