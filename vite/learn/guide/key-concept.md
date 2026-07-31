# Key Concept

## Purpose

อธิบาย core concepts สำคัญของ Vite เพื่อเป็นพื้นฐานในการใช้งาน

## Scope

- Native ESM
- Dependency Pre-bundling
- Hot Module Replacement (HMR)
- Rollup-based Build
- Plugin System

## Core Concepts

### 1. Native ESM

Vite ใช้ Native ES Modules ใน development ทำให้ไม่ต้อง bundle ทั้งแอปตั้งแต่เริ่ม

```typescript
// Browser import โดยตรง ไม่ต้อง bundle
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

| แนวคิด | คำอธิบาย | ประโยชน์ |
|--------|----------|----------|
| **ESM Dev Server** | Serve modules เป็น ESM โดยตรง | Instant server start |
| **On-demand Transform** | แปลงไฟล์เมื่อถูก request เท่านั้น | เร็วขึ้นมาก |
| **Module Graph** | ติดตาม dependencies ระหว่าง modules | HMR แม่นยำ |

### 2. Dependency Pre-bundling

Vite ใช้ esbuild เพื่อ pre-bundle dependencies ที่ไม่ใช่ ESM ให้เป็น ESM

```
+------------------+     +------------------+     +------------------+
|  node_modules    | --> |  esbuild         | --> |  .vite/deps/     |
|  (CJS/UMD)       |     |  (pre-bundle)    |     |  (ESM format)    |
+------------------+     +------------------+     +------------------+
```

| องค์ประกอบ | คำอธิบาย |
|------------|----------|
| **esbuild** | Bundler ที่เขียนด้วย Go เร็วกว่า JS bundler 10-100x |
| **Auto-detect** | ตรวจจับ dependencies อัตโนมัติ |
| **Cache** | Cache ผลลัพธ์ใน `.vite/deps/` |
| **Force re-bundle** | ใช้ `--force` หรือ `optimizeDeps.force` |

### 3. Hot Module Replacement (HMR)

Vite มี HMR API ที่เร็วมาก ใช้ ESM-based update propagation

```typescript
// HMR API ใน module
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Handle updated module
  })

  import.meta.hot.dispose((data) => {
    // Cleanup before module is replaced
  })
}
```

| Feature | คำอธิบาย |
|---------|----------|
| **Instant Update** | อัพเดทเฉพาะ module ที่เปลี่ยน ไม่ reload ทั้งหน้า |
| **HMR API** | `accept`, `dispose`, `decline`, `invalidate` |
| **CSS HMR** | CSS changes apply ทันทีโดยไม่ refresh |
| **Framework HMR** | React Fast Refresh, Vue SFC HMR อัตโนมัติ |

### 4. Rollup-based Build

Production build ใช้ Rollup (หรือ Rolldown ใน Vite 7+) เพื่อสร้าง optimized assets

```
+------------------+     +------------------+     +------------------+
|  Source Files    | --> |  Rollup/Rolldown | --> |  dist/           |
|  (ESM)           |     |  (bundle)        |     |  (optimized)     |
+------------------+     +------------------+     +------------------+
         |                        |
         v                        v
  vite.config.ts          Code splitting
                          Tree shaking
                          Minification
```

| Feature | คำอธิบาย |
|---------|----------|
| **Code Splitting** | แบ่ง chunks อัตโนมัติจาก dynamic imports |
| **Tree Shaking** | ลบ dead code ที่ไม่ได้ใช้ |
| **Asset Handling** | Optimize images, fonts, CSS อัตโนมัติ |
| **Minification** | ใช้ esbuild หรือ terser สำหรับ minify |

### 5. Plugin System

Vite มี plugin system ที่ทรงพลัง รองรับทั้ง Vite plugins และ Rollup plugins

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    react(),     // React Fast Refresh + JSX transform
    vue(),       // Vue SFC support
  ],
})
```

| Plugin Type | คำอธิบาย | ตัวอย่าง |
|-------------|----------|----------|
| **Vite Plugin** | ใช้ Vite-specific hooks | `@vitejs/plugin-react` |
| **Rollup Plugin** | ใช้ใน production build | `rollup-plugin-visualizer` |
| **Virtual Module** | สร้าง module จำลอง | `vite-plugin-pwa` |

## Summary

| Concept | ความสำคัญ | ระดับ |
|---------|-----------|-------|
| **Native ESM** | พื้นฐานความเร็วใน development | พื้นฐาน |
| **Pre-bundling** | แปลง CJS dependencies เป็น ESM | พื้นฐาน |
| **HMR** | อัพเดท UI ทันทีเมื่อ code เปลี่ยน | พื้นฐาน |
| **Rollup Build** | Production build ที่ optimized | ปานกลาง |
| **Plugin System** | Extend functionality ได้ไม่จำกัด | ปานกลาง |
