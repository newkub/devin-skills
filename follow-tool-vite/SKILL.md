---
name: follow-tool-vite
description: ตั้งค่าและใช้ Vite 8 (Rolldown bundler) สำหรับ modern web applications
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-tool-rolldown
  - follow-tool-tsdown
  - follow-tool-vitepress
  - follow-tool-vite-plugins
  - follow-create-plugins
  - follow-tool-biome
  - follow-lang-typescript

---

## Goal

ตั้งค่าและใช้ Vite 8+ (Rolldown เป็น bundler เดียว, Oxc สำหรับ transform/minify) สำหรับ development และ production builds ทั้ง single project และ monorepo

## Scope

ใช้สำหรับ modern web applications ทีใช้ Vite เป็น build tool และ dev server

- gzip/brotli pre-compression ดู `references/apis.md`

- Boundary: ใช้ Vite สำหรับ app dev server/build — library bundling ใช้ `/follow-tool-tsdown`; raw bundler internals ใช้ `/follow-tool-rolldown`; static docs site ใช้ `/follow-tool-vitepress`

## Execute

### 1. Installation

> Goal: ติดตั้ง Vite และ verify environment

1. ตรวจสอบ Node.js version ไม่ต่ำกว่า 20.19 หรือ 22.12
2. ติดตั้ง Vite ด้วย `bun add -D vite` (latest `8.3.1`, verified 2026-09-26)
3. ตรวจสอบ version ด้วย `bunx vite --version`
4. ดูรายละเอียดใน [references/apis.md](references/apis.md)

### 2. Configuration

> Goal: สร้าง `vite.config.ts`

1. สร้าง `vite.config.ts` ที root
2. ใช้ `defineConfig` จาก `vite`
3. ตั้งค่า plugins สำหรับ framework ทีใช้ — เลือกจาก `/follow-tool-vite-plugins` catalog
4. กำหนด `resolve.alias` ด้วย absolute paths
5. เปิดใช้ `resolve.tsconfigPaths: true`
6. ใช้ top-level `tsconfig` option (Vite 8.3+) ถ้าต้องการระบุ tsconfig ที่ Vite ใช้ resolve/transform
7. ตั้งค่า `envPrefix` ถ้าจำเป็น
8. ดู config patterns ใน [references/apis.md](references/apis.md)

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
3. Vite 8 ใช้ Rolldown เป็น bundler เดียวโดย default — ไม่ต้อง opt-in หรือใช้ `rolldown-vite` อีก (preview package เลิกใช้แล้ว); migrate จาก Vite ≤7 โดย upgrade `vite` ไป `^8` ตรงๆ
4. ใช้ `build.rolldownOptions.output.advancedChunks`/`manualChunks` สำหรับ vendor splitting
5. Drop console/debugger ด้วย `build.rolldownOptions.output.minify.compress` (`dropConsole`, `dropDebugger`) — ตัวเลือก `esbuild`/`esbuild.drop` deprecated แล้ว (`debugger` ถูกลบโดย default)
6. กำหนด `chunkSizeWarningLimit` สำหรับ monitor bundle size

### 5. Performance Optimization

> Goal: ปรับแต่ง performance

1. หลีกเลี่ยง barrel files; import จากไฟล์ตรง
2. ใช้ explicit import paths พร้อม extension
3. ใช้ `moduleResolution: "bundler"` ใน `tsconfig.json`
4. เปิด `optimizeDeps.include` สำหรับ deps ที Vite อาจ miss
5. ใช้ `vite --profile` สำหรับ profiling (Vite 8.3+ รองรับ `vite --profile <name>` สำหรับตั้งชื่อ CPU profile)

### 6. Testing and Deployment

> Goal: integrate tests และ deploy

1. ทำ `/follow-tool-vitest` เพื่อ setup testing — component tests ด้วย Testing Library → `workflows/testing-library/SKILL.md`
2. รัน `bunx vitest run` หรือ `bun run test`
3. ตั้งค่า `base` ใน `vite.config.ts` สำหรับ public path
4. ใช้ `vite preview` เพื่อ test production build
5. deploy ไปยัง static host ที project ใช้

### Workflows

> Goal: dispatch งานเฉพาะทางไป workflow ที่เหมาะสม

| Topic | Workflow |
|-------|----------|
| ตั้งค่า/แก้ `vite.config.ts` (plugins, resolve, build, server) | `workflows/config-vite/SKILL.md` |
| optimize build/bundle (chunk splitting, minify, sourcemap) | `workflows/optimize-build/SKILL.md` |
| migrate จาก Vite ≤7/`rolldown-vite` ไป Vite 8 | `workflows/migrate-to-vite8/SKILL.md` |
| component testing ด้วย Testing Library (setup + queries + user-event) | `workflows/testing-library/SKILL.md` |
| เลือก/setup plugins — unified + frontend-lib catalogs | `/follow-tool-vite-plugins` |
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
- Vite 8 ใช้ Rolldown + Oxc โดย default — ใช้ `oxc` option แทน `esbuild` (deprecated), `optimizeDeps.rolldownOptions` แทน `optimizeDeps.esbuildOptions`
- ใช้ `manualChunks`/`advancedChunks` สำหรับ vendor splitting

### 4. Environment Variables

- ใช้ prefix `VITE_` หรือ `envPrefix` ทีกำหนด
- เข้าถึงผ่าน `import.meta.env.*`
- ไม่ hard-code secrets

### 5. Monorepo

- Vite ตรวจจับ linked packages อัตโนมัติ
- เพิ่ม linked deps ใน `optimizeDeps.include` ถ้าไม่ใช่ ESM
- ใช้ absolute paths สำหรับ `resolve.alias`

- ใช้ /follow-tool-rolldown ถ้าจำเป็น
- ใช้ /follow-tool-vite-plugins สำหรับ plugin selection/setup
- ใช้ /follow-tool-tsdown ถ้าจำเป็น
- ใช้ /follow-tool-vitepress ถ้าจำเป็น
- ใช้ /follow-create-plugins (vite) ถ้าจำเป็น (tool vite)
- ใช้ /follow-tool-biome ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)

## File Structure

Canonical file structure + layer table: [templates/file-structure-web-vite-spa.md](templates/file-structure-web-vite-spa.md)

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- Vite 8 ติดตั้งและทำงาน
- Dev server มี HMR และ warmup
- Production build optimized
- Test setup integrate กับ Vitest
- Deployment config ถูกต้อง

