---
name: follow-tool-vite
description: ตั้งค่าและใช้ Vite 7+ สำหรับ modern web applications
related:
  - follow-tool-vitest
  - follow-tool-rolldown
  - follow-tool-tsdown
  - follow-tool-vitepress
  - follow-tool-biome
  - follow-lang-typescript
---

## Goal

ตั้งค่าและใช้ Vite 7+ สำหรับ development และ production builds ทั้ง single project และ monorepo

## Scope

ใช้สำหรับ modern web applications ทีใช้ Vite เป็น build tool และ dev server

## Execute

### 1. Installation

> Goal: ติดตั้ง Vite และ verify environment

1. ตรวจสอบ Node.js version ไม่ต่ำกว่า 20.19 หรือ 22.12
2. ติดตั้ม Vite ด้วย `bun add -D vite`
3. ตรวจสอบ version ด้วย `bunx vite --version`
4. ดูรายละเอียดใน [references/vite.md](references/vite.md)

### 2. Configuration

> Goal: สร้าง `vite.config.ts`

1. สร้าง `vite.config.ts` ที root
2. ใช้ `defineConfig` จาก `vite`
3. ตั้งค่า plugins สำหรับ framework ทีใช้
4. กำหนด `resolve.alias` ด้วย absolute paths
5. เปิดใช้ `resolve.tsconfigPaths: true`
6. ตั้งค่า `envPrefix` ถ้าจำเป็น
7. ดู config patterns ใน [references/vite.md](references/vite.md)

### 3. Development

> Goal: ตั้งค่า dev server และ HMR

1. รัน `bunx vite` หรือ `bun run dev`
2. ใช้ `server.proxy` สำหรับ API requests
3. ใช้ `.env` files ตาม mode
4. ตั้งค่า `server.warmup.clientFiles` สำหรับ pre-transform
5. ใช้ `server.open: true` เพื่อ warm up entry

### 4. Production Build

> Goal: build สำหรับ production

1. รัน `bunx vite build`
2. ใช้ `build.target: 'baseline-widely-available'`
3. เปิดใช้ `experimental.rolldown: true` ถ้า project พร้อม
4. ใช้ `build.rolldownOptions.output.manualChunks` สำหรับ vendor splitting
5. ใช้ `esbuild.drop: ['console', 'debugger']` ใน production
6. กำหนด `chunkSizeWarningLimit` สำหรับ monitor bundle size

### 5. Performance Optimization

> Goal: ปรับแต่ง performance

1. หลีกเลี่ยง barrel files; import จากไฟล์ตรง
2. ใช้ explicit import paths พร้อม extension
3. ใช้ `moduleResolution: "bundler"` ใน `tsconfig.json`
4. เปิด `optimizeDeps.include` สำหรับ deps ที Vite อาจ miss
5. ใช้ `vite --profile` สำหรับ profiling

### 6. Testing and Deployment

> Goal: integrate tests และ deploy

1. ทำ `/follow-tool-vitest` เพื่อ setup testing
2. รัน `bunx vitest run` หรือ `bun run test`
3. ตั้งค่า `base` ใน `vite.config.ts` สำหรับ public path
4. ใช้ `vite preview` เพื่อ test production build
5. deploy ไปยัง static host ที project ใช้

## Rules

### 1. Configuration

- ต้องมี `vite.config.ts` ที root
- ใช้ `defineConfig` เสมอ
- ใช้ conditional config ถ้ามี mode-specific options

### 2. Development

- ใช้ HMR สำหรับ instant updates
- ตั้งค่า `server.proxy` สำหรับ API
- ใช้ `.env.[mode]` files สำหรับ environment config

### 3. Build

- ใช้ `build.target: 'baseline-widely-available'`
- เปิด `experimental.rolldown` ถ้า compatible
- ใช้ `manualChunks` สำหรับ vendor splitting

### 4. Environment Variables

- ใช้ prefix `VITE_` หรือ `envPrefix` ทีกำหนด
- เข้าถึงผ่าน `import.meta.env.*`
- ไม่ hard-code secrets

### 5. Monorepo

- Vite ตรวจจับ linked packages อัตโนมัติ
- เพิ่ม linked deps ใน `optimizeDeps.include` ถ้าไม่ใช่ ESM
- ใช้ absolute paths สำหรับ `resolve.alias`

## Expected Outcome

- Vite 7+ ติดตั้มและทำงาน
- Dev server มี HMR และ warmup
- Production build optimized
- Test setup integrate กับ Vitest
- Deployment config ถูกต้อง
