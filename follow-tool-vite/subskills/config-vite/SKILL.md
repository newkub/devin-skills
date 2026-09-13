---
name: follow-tool-vite-config-vite
description: ตั้งค่า vite.config.ts — structure, plugins, resolve/build/server options
argument-hint: "[config-topic]"
related:
  - follow-tool-vite
  - follow-tool-vitest
  - follow-lang-typescript
---

## Goal

เขียนและปรับ `vite.config.ts` ให้ถูกต้อง ครอบคลุม plugins, resolve, build, server options ตาม need ของ project โดยไม่ clobber config เดิม

## Scope

- ครอบคลุม `vite.config.ts` structure, `defineConfig`, conditional config by mode/command
- options หลัก: `plugins`, `resolve`, `build`, `server`, `preview`, `envPrefix`, `base`
- bundle optimization เชิงลึก → ใช้ `subskills/optimize-build/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้ current state ก่อนแก้

1. เปิดอ่าน `vite.config.ts`/`vite.config.js` ที่ root — ถ้าไม่มี → ไป step 2 เพื่อสร้างใหม่
2. ตรวจ framework ที่ใช้จาก `package.json` เพื่อเลือก official plugin (`@vitejs/plugin-react`, `@vitejs/plugin-vue`, ฯลฯ)
3. ถ้า config เดิมใหญ่ → ทำ `/check-config-drift` เพื่อดู options ที่ไม่จำเป็น

### 2. Config Structure

> Goal: ใช้ `defineConfig` pattern ที่ถูกต้อง

1. ใช้ `defineConfig` จาก `vite` เสมอเพื่อ type checking
2. ใช้ conditional config `defineConfig(({ command, mode }) => ({ ... }))` เมื่อ options ต่างตาม dev/build
3. ใช้ `loadEnv(mode, ...)` เมื่อต้องอ่าน env ใน config — อย่าพึ่ง `process.env` โดยตรง

### 3. Plugins

> Goal: เพิ่ม plugins ในลำดับที่ถูก

1. ใส่ official framework plugin เป็นอันดับแรกใน `plugins` array
2. plugin ที่มี `enforce: 'pre'/'post'` ให้เช็ค order ตาม docs ของ plugin นั้น
3. ถ้า option ของ plugin ไม่แน่ใจ → ดู official docs ของ plugin นั้น ห้ามเดา option names

### 4. Resolve Options

> Goal: ตั้ง path resolution ให้ถูก

1. ใช้ `resolve.alias` ด้วย absolute paths เช่น `fileURLToPath(new URL('./src', import.meta.url))`
2. เปิด `resolve.tsconfigPaths: true` ถ้าใช้ tsconfig paths
3. ตั้ง `resolve.extensions` เฉพาะเมื่อจำเป็น

### 5. Build Options

> Goal: ตั้ง build ขั้นพื้นฐาน

1. ตั้ง `build.target` ตาม browser support ของ project (เช่น `'baseline-widely-available'`)
2. ตั้ง `build.outDir`, `build.assetsDir` เฉพาะเมื่อต้องการ non-default
3. chunk splitting/minify/sourcemap → ทำตาม `subskills/optimize-build/SKILL.md`

### 6. Server Options

> Goal: ตั้ง dev server

1. ตั้ง `server.port`, `server.strictPort`, `server.open` ตาม need
2. ใช้ `server.proxy` สำหรับ API calls — ระบุ `target`, `changeOrigin` ให้ชัด
3. ใช้ `server.warmup.clientFiles` สำหรับ entry ที่ transform ช้า
4. ใช้ `preview.*` แยกสำหรับ `vite preview` ถ้า port/host ต่างจาก dev

### 7. Verify

> Goal: config ทำงานทั้ง dev และ build

1. รัน `bunx vite` → dev server ขึ้น ไม่มี config error
2. รัน `bunx vite build` → build ผ่าน
3. ถ้าพัง → revert key ล่าสุด แล้วทำ `/resolve-errors` max 3 รอบ

## Rules

### 1. Config

- ใช้ `defineConfig` เสมอ — ห้าม export plain object
- merge กับ config เดิม ห้าม overwrite ทั้งไฟล์ถ้าไม่จำเป็น
- secrets ห้ามใส่ใน config — ใช้ env files ตาม `envPrefix`

### 2. Options

- ใช้เฉพาะ options ที่อยู่ใน official docs (`vite.dev`) — ห้ามเดา option names
- ถ้าไม่แน่ใจ → ทำ `/learn` (web) ก่อนแก้

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น

## Expected Outcome

- `vite.config.ts` ครอบคลุม plugins/resolve/build/server ที่ project ต้องการ
- `vite` dev และ `vite build` ทำงานไม่มี config error
