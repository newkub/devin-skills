# Features

## Purpose

สรุป features ทั้งหมดของ Vite พร้อมตัวอย่างการใช้งาน

## Scope

- TypeScript & JSX
- CSS Preprocessors
- Static Assets
- SSR Support
- Library Mode
- Code Splitting
- Environment Variables
- HMR API

## Feature Overview

| Feature | คำอธิบาย | สถานะ |
|---------|----------|--------|
| **Native ESM** | Dev server ด้วย ES Modules โดยตรง | Stable |
| **TypeScript** | รองรับ TypeScript built-in ผ่าน esbuild | Stable |
| **JSX** | รองรับ JSX/TSX ผ่าน esbuild | Stable |
| **CSS Preprocessors** | SCSS, Sass, Less, Stylus | Stable |
| **Static Assets** | Import images, fonts, JSON, URL | Stable |
| **SSR** | Server-side rendering support | Stable |
| **Library Mode** | Build library สำหรับ publish | Stable |
| **HMR** | Hot Module Replacement | Stable |

## TypeScript & JSX

Vite รองรับ TypeScript และ JSX ผ่าน esbuild โดยไม่ต้อง plugin เพิ่มเติม

```typescript
// TypeScript - ไม่ต้องตั้งค่าเพิ่ม
interface User {
  id: number
  name: string
}

const greet = (user: User): string => `Hello, ${user.name}!`
```

```tsx
// JSX - ทำงานได้ทันที
function App() {
  return <h1>Hello Vite</h1>
}
```

| Feature | รายละเอียด |
|---------|-----------|
| **TypeScript Transform** | esbuild แปลง TS → JS เร็วกว่า tsc 20-30x |
| **JSX Transform** | esbuild แปลง JSX อัตโนมัติ |
| **Decorators** | รองรับ decorators ผ่าน esbuild |
| **Type Checking** | ใช้ `tsc --noEmit` หรือ `vue-tsc` แยก |

## CSS Preprocessors

```typescript
// vite.config.ts
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
})
```

| Preprocessor | Package | Config |
|-------------|---------|--------|
| **SCSS/Sass** | `sass-embedded` | `css.preprocessorOptions.scss` |
| **Less** | `less` | `css.preprocessorOptions.less` |
| **Stylus** | `stylus` | `css.preprocessorOptions.stylus` |
| **PostCSS** | `postcss` | `postcss.config.js` |

## Static Assets

Vite รองรับ import static assets หลายรูปแบบ

```typescript
// Import as URL
import logoUrl from './logo.png'

// Import as inline base64 (เล็กกว่า 4KB)
import smallImage from './small.svg'

// Import raw text
import text from './data.txt?raw'

// Import as URL (force)
import workerUrl from './worker.js?url'
```

| Asset Type | Behavior |
|-----------|----------|
| **Images** | `< 4KB` → inline base64, `>= 4KB` → URL |
| **Fonts** | Import as URL |
| **JSON** | Import as object, tree-shakeable |
| **Web Workers** | `new Worker(new URL('./worker.js', import.meta.url))` |

## SSR Support

```typescript
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: ['some-package'],
  },
})

// server.ts
import { createServer } from 'vite'

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})

const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
```

| Feature | คำอธิบาย |
|---------|----------|
| **Middleware Mode** | ใช้ Vite เป็น middleware ใน Express/Koa |
| **SSR Load Module** | โหลด modules สำหรับ SSR |
| **SSR Transform** | แปลง ESM เป็น CJS สำหรับ Node.js |
| **SSR External** | ควบคุม package ที่ bundle เข้า SSR |

## Library Mode

```typescript
// vite.config.ts
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: 'my-lib',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
```

| Option | คำอธิบาย |
|--------|----------|
| **entry** | Entry point ของ library |
| **name** | ชื่อ global variable สำหรับ UMD |
| **fileName** | ชื่อไฟล์ output (รองรับ formats) |
| **formats** | `es`, `cjs`, `umd`, `iife` |

## Code Splitting

Vite ทำ code splitting อัตโนมัติจาก dynamic imports

```typescript
// Dynamic import - แยก chunk อัตโนมัติ
const AdminPage = () => import('./pages/AdminPage.vue')

// Manual chunk splitting
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
        },
      },
    },
  },
})
```

## Environment Variables

Vite ใช้ `import.meta.env` สำหรับ environment variables

```typescript
// .env file
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App

// ใน code
const apiUrl = import.meta.env.VITE_API_URL
const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD
```

| Variable | คำอธิบาย |
|---------|----------|
| `VITE_*` | Expose ไปยัง client code |
| `import.meta.env.DEV` | `true` เมื่ออยู่ใน dev mode |
| `import.meta.env.PROD` | `true` เมื่ออยู่ใน production |
| `import.meta.env.MODE` | ชื่อ mode ปัจจุบัน |
| `import.meta.env.SSR` | `true` เมื่ออยู่ใน SSR context |

## HMR API

```typescript
// Accept updates for current module
import.meta.hot?.accept((newModule) => {
  // Apply new module
})

// Accept updates for specific dependency
import.meta.hot?.accept('./component.ts', (newModule) => {
  // Apply updated dependency
})

// Cleanup before module is replaced
import.meta.hot?.dispose((data) => {
  // Save state for next module
})

// Decline HMR - force full reload
import.meta.hot?.decline()

// Invalidate module
import.meta.hot?.invalidate()
```

## Summary

| Category | Features |
|----------|----------|
| **Language** | TypeScript, JSX, TSX, CSS preprocessors |
| **Assets** | Images, fonts, JSON, Web Workers, raw imports |
| **Build** | Code splitting, tree shaking, minification, library mode |
| **Runtime** | SSR, HMR API, environment variables |
| **Optimization** | Dependency pre-bundling, CSS code splitting |
