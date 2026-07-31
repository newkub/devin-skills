# Module Resolution Issues

## 1. Module Not Found

**Problem:**
```
Error: Cannot find module '@/components/Button'
```

**Solution:**
```typescript
// vite.config.ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 2. CSS Import Issues

**Problem:**
CSS ไม่ถูกโหลด

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
})
```

## 3. Asset Import Issues

**Problem:**
Assets ไม่ถูก process อย่างถูกต้อง

**Solution:**
```typescript
// vite.config.ts
export default defineConfig({
  assetsInclude: ['**/*.gltf'],
})
```
