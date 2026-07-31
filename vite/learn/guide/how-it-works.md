# How It Works

## Purpose

อธิบายการทำงานภายในของ Vite เพื่อให้เข้าใจกลไกและ flow การทำงาน

## Scope

- Dev Server Flow
- Build Pipeline
- Module Graph
- HMR Update Propagation
- Dependency Optimization

## Dev Server Flow

Vite dev server ใช้ Native ESM ทำให้เริ่มทำงานได้ทันทีโดยไม่ต้อง bundle

```
+------------------+     +------------------+     +------------------+
|  Browser         | --> |  Vite Dev Server | --> |  File System     |
|  (ESM requests)  |     |  (transform)     |     |  (source files)  |
+------------------+     +------------------+     +------------------+
                                  |
                         +------------------+
                         |  esbuild         |
                         |  (pre-bundle     |
                         |   dependencies)  |
                         +------------------+
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Output |
|---------|----------|--------|
| **1. Start Server** | เริ่มต้น dev server พร้อม config | HTTP server |
| **2. Pre-bundle Deps** | esbuild bundle node_modules dependencies | `.vite/deps/` |
| **3. Serve HTML** | Serve `index.html` เป็น entry point | HTML file |
| **4. Transform** | แปลง modules ตาม request (on-demand) | ESM modules |
| **5. Module Graph** | สร้าง module graph จาก imports | Dependency tree |

## Build Pipeline

Production build ใช้ Rollup (หรือ Rolldown) เพื่อ bundle และ optimize

```
+------------------+     +------------------+     +------------------+
|  Source Files    | --> |  Plugin Pipeline | --> |  Rollup/Rolldown |
|  (ESM + Config)  |     |  (transform,     |     |  (bundle +       |
+------------------+     |   resolve)       |     |   optimize)      |
                         +------------------+     +------------------+
                                                          |
                         +------------------+     +------------------+
                         |  dist/           | <-- |  Code Split      |
                         |  (production)    |     |  Tree Shake      |
                         +------------------+     |  Minify          |
                                                  +------------------+
```

### ขั้นตอนการทำงาน

| ขั้นตอน | คำอธิบาย | Tool |
|---------|----------|------|
| **1. Resolve Config** | อ่าน vite.config.ts | `defineConfig()` |
| **2. Run Plugins** | เรียก plugin hooks ตามลำดับ | Plugin pipeline |
| **3. Bundle** | Rollup bundle source files | Rollup/Rolldown |
| **4. Optimize** | Code split, tree shake, minify | Built-in |
| **5. Output** | เขียนไฟล์ลง output directory | `dist/` |

## Module Graph

Vite สร้าง module graph เพื่อติดตาม dependencies ทั้งหมด

```
+--------------------------------------------------+
|                Module Graph                       |
+--------------------------------------------------+
|                                                   |
|  index.html                                       |
|    ├── src/main.ts                                |
|    │     ├── src/App.vue                          |
|    │     │     ├── src/components/Header.vue      |
|    │     │     ├── src/components/Footer.vue      |
|    │     │     └── src/styles/main.css            |
|    │     ├── src/router.ts                        |
|    │     │     └── src/views/*.vue                |
|    │     └── src/store.ts                         |
|    │           └── src/api.ts                     |
|    └── node_modules/.vite/deps/                   |
|          ├── vue.js (pre-bundled)                 |
|          └── vue-router.js (pre-bundled)          |
|                                                   |
+--------------------------------------------------+
```

| Feature | คำอธิบาย |
|---------|----------|
| **Import Analysis** | วิเคราะห์ import statements ทุก module |
| **Lazy Discovery** | ค้นหา dependencies แบบ lazy ตาม request |
| **HMR Boundary** | ใช้ graph หาขอบเขต HMR update |
| **Circular Detection** | ตรวจจับ circular dependencies |

## HMR Update Propagation

เมื่อไฟล์เปลี่ยน Vite จะค้นหา HMR boundary ที่ใกล้ที่สุดใน module graph

```
+--------------------------------------------------+
|             HMR Update Flow                       |
+--------------------------------------------------+
|                                                   |
|  File changed: src/components/Header.vue          |
|                                                   |
|  1. Header.vue has HMR accept?                    |
|     ├── Yes → Update Header.vue only              |
|     └── No  → Check parent: App.vue               |
|           ├── App.vue has HMR accept?             |
|           │   ├── Yes → Update App.vue            |
|           │   └── No  → Check parent: main.ts     |
|           │         └── No HMR accept             |
|           │               → Full page reload      |
|                                                   |
+--------------------------------------------------+
```

| ขั้นตอน | คำอธิบาย |
|---------|----------|
| **1. Detect Change** | File watcher ตรวจจับไฟล์ที่เปลี่ยน |
| **2. Find Boundary** | ค้นหา module ที่มี `hot.accept()` |
| **3. Send Update** | ส่ง HMR update ผ่าน WebSocket |
| **4. Apply Patch** | Browser apply module ใหม่ |
| **5. Fallback** | Full reload ถ้าไม่มี HMR boundary |

## Dependency Optimization

Vite pre-bundle dependencies ด้วย esbuild เพื่อแปลงเป็น ESM

```
+------------------+     +------------------+     +------------------+
|  Scan Imports    | --> |  esbuild Bundle  | --> |  .vite/deps/     |
|  (bare imports)  |     |  (CJS → ESM)     |     |  (cached ESM)    |
+------------------+     +------------------+     +------------------+
        |                         |                        |
        v                         v                        v
  Find all bare          Bundle + flatten          Serve as native
  imports in source      into single files         ESM to browser
```

| ขั้นตอน | คำอธิบาย | Cache |
|---------|----------|-------|
| **1. Scan** | สแกน bare imports ใน source files | No |
| **2. Resolve** | Resolve package.json exports/imports | No |
| **3. Bundle** | esbuild bundle + minify dependencies | Yes |
| **4. Cache** | เก็บผลลัพธ์ใน `.vite/deps/` | Yes |
| **5. Invalidate** | ลบ cache เมื่อ dependencies เปลี่ยน | Auto |

## Summary

| กลไก | ประโยชน์ |
|-------|---------|
| **ESM Dev Server** | เริ่มทำงานทันที ไม่ต้อง bundle ล่วงหน้า |
| **Rollup Build** | Production bundle ที่ optimized |
| **Module Graph** | ติดตาม dependencies สำหรับ HMR |
| **HMR Propagation** | อัพเดทเฉพาะส่วนที่เปลี่ยน |
| **Dependency Pre-bundling** | แปลง CJS/UMD เป็น ESM อัตโนมัติ |
