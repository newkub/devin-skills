# Best Practices

## Purpose

Best practices สำหรับการใช้งาน Rolldown ใน production

## Scope

- Configuration patterns
- Performance optimization
- Code organization
- Common pitfalls

## Configuration Best Practices

### 1. Use TypeScript Config

ใช้ TypeScript สำหรับ config file เพื่อ type safety:

```typescript
// rolldown.config.ts
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
  },
})
```

### 2. Separate Dev and Prod Configs

แยก config สำหรับ development และ production:

```typescript
// rolldown.config.ts
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

### 3. Use Environment Variables

ใช้ environment variables สำหรับ configuration:

```typescript
// rolldown.config.ts
import { defineConfig } from 'rolldown'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.API_URL': JSON.stringify(process.env.API_URL),
  },
})
```

### 4. External Large Dependencies

External dependencies ที่ใหญ่:

```typescript
export default defineConfig({
  external: ['react', 'react-dom', 'lodash', 'moment'],
})
```

### 5. Configure Tree Shaking

ตั้งค่า tree-shaking อย่างเหมาะสม:

```typescript
export default defineConfig({
  treeshake: {
    moduleSideEffects: 'no-external',
    treeshakeLiterals: true,
    treeshakeClassStaticBlocks: true,
  },
})
```

## Performance Best Practices

### 1. Enable Incremental Builds

ใช้ watch mode สำหรับ development:

```bash
bunx rolldown --watch
```

### 2. Use Parallel Processing

Rolldown ใช้ parallel processing อัตโนมัติ แต่สามารถ optimize ได้:

```typescript
export default defineConfig({
  // Rolldown ใช้ parallel อัตโนมัติ
  // ไม่ต้อง configure เพิ่มเติม
})
```

### 3. Optimize Module Resolution

กำหนด extensions และ aliases:

```typescript
export default defineConfig({
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': './src',
    },
  },
})
```

### 4. Use Code Splitting

แบ่ง code เป็น chunks:

```typescript
export default defineConfig({
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
    },
  },
})
```

### 5. Minify in Production Only

Minify เฉพาะ production:

```typescript
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  output: {
    minify: isProd,
  },
})
```

## Code Organization Best Practices

### 1. Use Barrel Files

ใช้ barrel files สำหรับ clean imports:

```typescript
// src/index.ts
export * from './utils'
export * from './components'
export * from './types'
```

### 2. Organize by Feature

จัดระเบียบ code ตาม features:

```
src/
  auth/
    login.ts
    register.ts
  dashboard/
    analytics.ts
    reports.ts
  shared/
    utils.ts
    types.ts
```

### 3. Use Absolute Imports

ใช้ absolute imports ด้วย aliases:

```typescript
// Good
import Button from '@/components/Button'

// Bad
import Button from '../../../components/Button'
```

### 4. Separate Entry Points

แยก entry points สำหรับ different bundles:

```typescript
export default defineConfig({
  input: {
    main: 'src/main.ts',
    worker: 'src/worker.ts',
  },
})
```

## Common Pitfalls

### 1. Circular Dependencies

**Problem:**
```typescript
// a.ts
import { b } from './b'

// b.ts
import { a } from './a'
```

**Solution:** Refactor เพื่อลบ circular dependencies

### 2. Side Effects in Modules

**Problem:**
```typescript
console.log('Side effect')
export const value = 'value'
```

**Solution:** หลีกเลี่ยง side effects หรือ annotate:

```json
{
  "sideEffects": false
}
```

### 3. Over-splitting Chunks

**Problem:** แบ่ง chunks เกินไป ทำให้หลาย requests

**Solution:** รวม related modules เป็น chunk เดียว

### 4. Not External Large Libraries

**Problem:** Bundle large libraries เข้าไปใน bundle

**Solution:** External large libraries:

```typescript
external: ['react', 'react-dom', 'lodash']
```

### 5. Ignoring Source Maps

**Problem:** ไม่มี source maps ใน production

**Solution:** เปิด source maps:

```typescript
output: {
  sourcemap: true,
}
```

## Testing Best Practices

### 1. Test Bundle Output

ตรวจสอบ bundle output:

```bash
bunx rolldown --config rolldown.config.ts
node dist/main.js
```

### 2. Test Tree Shaking

ตรวจสอบว่า code ที่ไม่ถูกใช้ถูกลบ:

```typescript
// unused.ts
export const unused = 'unused'

// main.ts
// ไม่ import unused
```

### 3. Test Code Splitting

ตรวจสอบ chunks ที่ถูกสร้าง:

```bash
ls dist/
# main.js
# vendor.js
# chunk-abc.js
```

## Deployment Best Practices

### 1. Use Content Hashing

ใช้ content hashing สำหรับ caching:

```typescript
export default defineConfig({
  output: {
    entryFileNames: '[name]-[hash].js',
    chunkFileNames: '[name]-[hash].js',
  },
})
```

### 2. Generate Source Maps

สร้าง source maps สำหรับ production debugging:

```typescript
export default defineConfig({
  output: {
    sourcemap: true,
  },
})
```

### 3. Optimize for Target Environment

ตั้งค่า target environment:

```typescript
export default defineConfig({
  target: 'es2020',
})
```

## Monitoring Best Practices

### 1. Monitor Bundle Size

ตรวจสอบขนาด bundle:

```bash
bunx rolldown --config rolldown.config.ts
ls -lh dist/
```

### 2. Monitor Build Time

ตรวจสอบ build time:

```bash
time bunx rolldown
```

### 3. Monitor Chunk Sizes

ตรวจสอบขนาด chunks:

```bash
bunx rolldown-plugin-visualizer
```

## Summary

| Category | Best Practice |
|----------|--------------|
| **Configuration** | Use TypeScript, separate dev/prod |
| **Performance** | Enable incremental builds, code splitting |
| **Organization** | Use barrel files, absolute imports |
| **Pitfalls** | Avoid circular dependencies, side effects |
| **Testing** | Test bundle output, tree shaking |
| **Deployment** | Use content hashing, source maps |

## See Also

- [Getting Started](../guide/getting-started.md)
- [Configuration Reference](../../references/configuration.md)
- [Performance Tips](./performance-tips.md)
