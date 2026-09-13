---
name: follow-create-plugins-nitro
description: สร้าง Nitro plugin สำหรับ Nuxt ด้วย defineNitroPlugin และ hooks
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - follow-create-web
  - follow-create-web
  - follow-lang-typescript
  - run-test
  - review-dependencies
  - report
---
## Goal

สร้าง Nitro plugin package สำหรับ Nuxt/Nitro ด้วย `definePlugin` (v3) / `defineNitroPlugin` (v2), hooks, middleware, storage, และ tests

## Scope

ใช้สำหรับสร้าง plugin ที extend Nitro runtime ใน Nuxt 3/4 หรือ standalone Nitro project รองรับทั้ง project plugin (`server/plugins/`) และ npm package

- Latest: `nitropack@2.13.4` stable; `nitro@3.0.260903-beta` (v3 beta, npm tag `latest` ของ package `nitro`) (verified 2026-09-12)
- Nitro v3 breaking changes: package `nitropack` → `nitro`, `defineNitroPlugin` → `definePlugin`, auto-imports ถูกลบ (ต้อง explicit import จาก `nitro/*`), H3 v2 (`defineHandler`, `HTTPError`, `event.req` web APIs), Node.js >= 20

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/review-dependencies` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-dependencies` เพื่อ review tech stack, dependencies, และ library design (create nitro plugin)
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create nitro plugin)

### 2. Choose Plugin Type

> Goal: ระบุวิธีใช้ plugin

1. ถ้าใช้เฉพาะ project: สร้าง `server/plugins/{name}.ts` ใน Nuxt project
2. ถ้าใช้เป็น package: สร้าง `packages/{plugin-name}/` แยกออกมา
3. ระบุ hooks ทีต้องการ `render:html`, `request`, `close`, หรือ custom hooks

### 3. Setup Package

> Goal: สร้างโครงสร้าง plugin package

1. สร้าง `package.json` ด้วย `name: nitro-{name}`
2. ใส่ `nitro` (v3) หรือ `nitropack` (v2) ใน `peerDependencies` ตาม major version ที่รองรับ
3. สร้าง `tsconfig.json`, `src/index.ts`, `test/plugin.test.ts`
4. ติดตั้ง `unbuild` หรือ `tsup` สำหรับ build

### 4. Implement Plugin

> Goal: เขียน Nitro plugin

1. สร้าง `src/index.ts`:
   - v3: `import { definePlugin } from "nitro"` แล้ว `export default definePlugin((nitroApp) => { ... })`
   - v2: `export default defineNitroPlugin((nitroApp) => { ... })`
2. ใช้ `nitroApp.hooks.hook('render:html', (html, { event }) => { ... })` สำหรับ modify HTML
3. ใช้ `nitroApp.hooks.hook('close', async () => { ... })` สำหรับ cleanup
4. ถ้าใช้ storage ให้ใช้ `useStorage()` ภายใน hook (v3: `import { useStorage } from "nitro/storage"` — auto-imports ถูกลบใน v3)

### 5. Register Middleware Or Handlers

> Goal: เพิ่ม middleware หรือ route handlers

1. ใช้ `nitroApp.h3App.use(...)` สำหรับ global middleware
2. หรือสร้าง `server/middleware/` และ `server/routes/` แยกใน Nuxt project
3. หลีกเลี่ยงทำ side effects นอก `defineNitroPlugin` callback

### 6. Configure Types

> Goal: รองรับ TypeScript types

1. ใช้ types จาก `nitropack/types` (v2) หรือ `nitro` (v3)
2. ถ้า module ต้องการ options ใช้ `ModuleOptions` type
3. ส่ง generic ผ่าน `NitroApp` ถ้าจำเป็น
4. ระบุ runtime types ด้วย `declare module 'nitropack'` (v2) หรือ `declare module 'nitro'` (v3) ถ้ามี custom hooks

### 7. Build Package

> Goal: build plugin สำหรับ npm

1. สร้าง `build.config.ts` หรือ `tsup.config.ts` สำหรับ ESM/CJS
2. external `nitro`/`nitropack`
3. รัน `bun run build`
4. ตรวจสอบ `dist/index.mjs` และ `dist/index.d.ts`

### 8. Test

> Goal: ทดสอบ plugin

1. สร้าง Nuxt fixture หรือ Nitro fixture
2. ใช้ `await $fetch('/')` ผ่าน `setup` ของ `@nuxt/test-utils`
3. ตรวจสอบ HTML, headers, หรือ storage
4. รัน `bun test`

### 9. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ `definePlugin` จาก `nitro` (v3) หรือ `defineNitroPlugin` จาก `nitropack/runtime` (v2)
- Plugin function synchronous แต่ hooks สามารถ async ได้
- ไม่ทำ side effects เป้น global นอก callback
- ใช้ `useRuntimeConfig()` ภายใน hooks ไม่ใช้ใน plugin body (v3: `import { useRuntimeConfig } from "nitro/runtime-config"`)
- ระบุ `nitro` หรือ `nitropack` เป็น peer dependency ตาม version
- v3: import utilities แบบ explicit เสมอ เช่น `defineHandler`, `HTTPError` จาก `nitro`; `useDatabase` จาก `nitro/database`; `defineTask` จาก `nitro/task`

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-web nextjs ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น

## Expected Outcome

- Nitro plugin register hooks ได้
- Middleware หรือ handlers ทำงาน
- Package build ผ่าน
- Tests ผ่าน
- ใช้ใน Nuxt project ได้

