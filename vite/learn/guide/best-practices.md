# Best Practices

## Purpose

แนวทางปฏิบัติที่ดีในการใช้งาน Vite เพื่อให้ได้ประสิทธิภาพและความปลอดภัยที่ดีที่สุด

## Scope

- Performance
- Security
- Code Quality
- Common Pitfalls

## Performance

### 1. Dependency Pre-bundling

ใช้ `optimizeDeps` สำหรับ dependencies ที่ใช้บ่อย:

```typescript
export default defineConfig({
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'vue',
      'lodash',
    ],
  },
})
```

### 2. Build Target

ตั้ง target ให้เหมาะสมกับ browsers ที่ต้องการรองรับ:

```typescript
export default defineConfig({
  build: {
    target: 'es2020',  // หรือ 'chrome100', 'firefox100', etc.
  },
})
```

### 3. Code Splitting

ใช้ manual chunks สำหรับ vendor code:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vendor-vue'
            if (id.includes('react')) return 'vendor-react'
            return 'vendor'
          }
        },
      },
    },
  },
})
```

### 4. CSS Code Splitting

เปิด CSS code splitting สำหรับ lazy-loaded components:

```typescript
export default defineConfig({
  build: {
    cssCodeSplit: true,
  },
})
```

## Security

### 1. Environment Variables

ใช้ prefix `VITE_` สำหรับ public variables เท่านั้น:

```env
# Public (ไปถึง client)
VITE_API_URL=https://api.example.com

# Secret (server-side only)
# ไม่ prefix ด้วย VITE_ จะไม่ expose ไป client
DATABASE_URL=postgresql://...
```

### 2. Avoid eval()

หลีกเลี่ยงการใช้ `eval()` และ `new Function()`:

```typescript
// ไม่แนะนำ
const fn = new Function('return ' + code)

// แนะนำ
import code from './code.js'
```

### 3. Input Sanitization

ตรวจสอบ user input ก่อนใช้ใน dynamic imports:

```typescript
// ไม่แนะนำ - potential path traversal
const module = await import(`./modules/${userInput}`)

// แนะนำ - whitelist approach
const modules = { home, about, contact }
const moduleName = modules[userInput] || 'home'
const module = await import(`./modules/${moduleName}`)
```

## Code Quality

### 1. TypeScript Configuration

ใช้ strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 2. Plugin Order

ใส่ plugins ตามลำดับที่ถูกต้อง:

```typescript
export default defineConfig({
  plugins: [
    vue(),          // ก่อน
    reactRefresh(), // หลัง react
  ],
})
```

### 3. vite-env.d.ts

เพิ่ม Vite type references:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}
```

## Common Pitfalls

### 1. Circular Dependencies

ระวัง circular imports ที่ทำให้เกิดปัญหา HMR:

```text
# ไม่แนะนำ
a.ts --> b.ts --> c.ts --> a.ts

# แนะนำ
a.ts --> b.ts --> c.ts
                   |
                   +---> (use dynamic import if needed)
```

### 2. CJS Dependencies

บาง packages เป็น CJS เท่านั้น ต้องใช้ `optimizeDeps`:

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['some-cjs-package'],
  },
})
```

### 3. CSS Modules

CSS modules ต้องมี naming convention ให้ถูกต้อง:

```css
/* MyComponent.module.css */
.button { }
```

```typescript
import styles from './MyComponent.module.css'
// styles.button
```

### 4. Dynamic Imports

ใช้ static strings สำหรับ dynamic imports:

```typescript
// ไม่แนะนำ
const page = userRoute // dynamic string

// แนะนำ
const pages = { home: () => import('./pages/Home'), about: () => import('./pages/About') }
```

## Summary

| Category | Best Practice |
|----------|---------------|
| **Performance** | optimizeDeps, target, code splitting |
| **Security** | VITE_ prefix, avoid eval, whitelist inputs |
| **Code Quality** | strict TS, plugin order, vite-env.d.ts |
| **Pitfalls** | circular deps, CJS packages, CSS modules |
