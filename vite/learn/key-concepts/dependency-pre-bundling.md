# Dependency Pre-bundling

## Dependency Pre-bundling คืออะไร

Vite pre-bundle dependencies ด้วย esbuild เพื่อแปลง CommonJS/UMD เป็น ESM และ bundle รวม dependencies เพื่อความเร็ว

## ทำงานอย่างไร

### 1. Pre-bundling Process

```
node_modules/
  └── lodash/ (CommonJS)
      └── index.js
        ↓ esbuild
node_modules/.vite/
  └── deps/
      └── lodash.js (ESM, bundled)
```

### 2. Detection

Vite detect dependencies จาก imports

```javascript
// Vite detects this as a dependency
import _ from 'lodash'
```

### 3. Caching

Pre-bundled dependencies ถูก cache ไว้ใน `node_modules/.vite/`

```bash
node_modules/.vite/
├── deps/
│   ├── lodash.js
│   └── vue.js
└── _metadata.json
```

## ข้อดี

### 1. Performance

- **Fast Startup**: Dependencies ถูก bundle ไว้แล้ว
- **Fewer Requests**: Bundle รวม dependencies
- **Native Speed**: esbuild เร็วกว่า bundlers อื่นๆ

### 2. Compatibility

- **CommonJS Support**: แปลง CommonJS เป็น ESM
- **UMD Support**: แปลง UMD เป็น ESM
- **Module Resolution**: Handle complex resolution

### 3. Consistency

- **Predictable**: Dependencies ทำงานเหมือนกันทุกครั้ง
- **Debuggable**: Source maps สำหรับ debugging
- **Reliable**: Cache ทำให้ reliable

## Configuration

### 1. Include Dependencies

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['lodash', 'axios'],
  },
})
```

### 2. Exclude Dependencies

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['some-esm-only-lib'],
  },
})
```

### 3. Force Re-bundling

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    force: true,  // Force re-bundling
  },
})
```

## ตัวอย่างการใช้งาน

### 1. Default Behavior

```javascript
// Vite automatically pre-bundles this
import _ from 'lodash'
```

### 2. Manual Inclusion

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['my-custom-lib'],
  },
})
```

```javascript
// Now pre-bundled
import myLib from 'my-custom-lib'
```

### 3. Excluding ESM Libraries

```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['esm-only-lib'],
  },
})
```

## Troubleshooting

### 1. Dependencies Not Pre-bundled

**Problem:**
Dependencies ไม่ถูก pre-bundle

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['problematic-lib'],
  },
})
```

### 2. Cache Issues

**Problem:**
Cache ทำให้เกิดปัญหา

**Solution:**
```bash
# Clear cache
rm -rf node_modules/.vite
```

### 3. Slow Pre-bundling

**Problem:**
Pre-bundling ช้า

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['large-lib'],
  },
})
```

## Best Practices

### 1. Let Vite Handle It

```typescript
// Good - let Vite detect automatically
export default defineConfig({
  // No optimizeDeps config
})
```

### 2. Only Configure When Needed

```typescript
// Good - configure only when necessary
export default defineConfig({
  optimizeDeps: {
    include: ['problematic-lib'],
  },
})
```

### 3. Clear Cache When Issues

```bash
# Clear cache when facing issues
rm -rf node_modules/.vite
```

## สรุป

Dependency pre-bundling เป็น feature สำคัญของ Vite ที่:
- Pre-bundle dependencies ด้วย esbuild
- Convert CommonJS/UMD เป็น ESM
- Cache dependencies สำหรับ performance
- Auto-detect dependencies จาก imports

Feature นี้ทำให้ Vite มี performance ที่ดีใน development mode
