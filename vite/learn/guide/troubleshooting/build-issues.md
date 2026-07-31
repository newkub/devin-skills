# Build Issues

## 1. Build Fails

**Problem:**
Build process ล้มเหลว

**Solution:**
```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall dependencies
bun install

# Try building again
bun run build
```

## 2. Large Bundle Size

**Problem:**
Bundle size ใหญ่เกินไป

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          ui: ['element-plus'],
        },
      },
    },
  },
})
```

ใช้ `rollup-plugin-visualizer` เพื่อ analyze bundle

```bash
bun add -D rollup-plugin-visualizer
```

## 3. Sourcemap Issues

**Problem:**
Sourcemaps ไม่ทำงานใน production

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    sourcemap: true,
  },
})
```
