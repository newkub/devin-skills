# Performance Issues

## 1. Slow Dev Server

**Problem:**
Dev server ช้าเกินไป

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  optimizeDeps: {
    include: ['vue', 'vue-router'],
  },
})
```

## 2. Slow Build

**Problem:**
Build ใช้เวลานาน

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'esbuild',  // Use esbuild instead of terser
  },
})
```

## 3. Memory Issues

**Problem:**
Out of memory errors

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun run build
```
