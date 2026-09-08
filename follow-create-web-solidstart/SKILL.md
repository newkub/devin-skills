---
name: follow-create-web-solidstart
description: "สร้าง SolidStart app SSR ผ่าน nitro/vite — streaming HTML, assets, hydration"
argument-hint: "[project-name]"
related:
  - follow-lib-solidjs
  - follow-create-nitro-plugin
  - follow-tool-vite
  - use-bun-native-api
  - follow-create-web
  - follow-my-tech-stack
---

## Goal

สร้าง SolidStart application ที่ทำ SSR ผ่าน Vite plugin `nitro/vite` ตาม pattern จาก nitro.build example `vite-ssr-solidstart` ให้ได้ streaming HTML, asset management และ client hydration

## Scope

ใช้สำหรับสร้าง SolidStart (SolidJS meta-framework) project ที่ใช้ Vite เป็น build tool และ Nitro เป็น server engine ผ่าน `@solidjs/start` v2 alpha + `nitro` — อ้างอิง https://nitro.build/examples/vite-ssr-solidstart

## Execute

### 1. Review Tech Stack

> Goal: ยืนยัน stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack
2. ยืนยันว่าใช้ SolidJS + SolidStart + Nitro + Vite
3. ทำ `/follow-lib-solidjs` สำหรับ component patterns

### 2. Setup Project

> Goal: สร้าง project structure และติดตั้ง dependencies

1. สร้าง `package.json` ด้วย `"type": "module"` และ scripts `dev: "vite dev"`, `build: "vite build"`
2. ติดตั้ง dependencies ด้วย `bun add @solidjs/start@alpha @solidjs/router @solidjs/meta solid-js nitro vite`
3. ตั้งค่า `engines.node >= 22`
4. ดูรายละเอียดใน [references/solid-start-nitro.md](references/solid-start-nitro.md)

### 3. Configure Vite And TypeScript

> Goal: ตั้งค่า `vite.config.ts` และ `tsconfig.json`

1. สร้าง `vite.config.ts` ด้วย plugins `solidStart()` จาก `@solidjs/start/config` และ `nitro()` จาก `nitro/vite`
2. ตั้งค่า `tsconfig.json` ด้วย `jsx: "preserve"`, `jsxImportSource: "solid-js"`, `moduleResolution: "bundler"`, `strict: true`
3. เพิ่ม `types: ["@solidjs/start/env"]` และ path alias `"~/*": ["./src/*"]`

### 4. Create App Shell

> Goal: สร้าง app component ที่รันทั้ง server และ client

1. สร้าง `src/app.tsx` ด้วย `Router` จาก `@solidjs/router` และ `FileRoutes` จาก `@solidjs/start/router`
2. Wrap root ด้วย `MetaProvider` + `Title` จาก `@solidjs/meta` และ `Suspense`
3. สร้าง `src/app.css` สำหรับ global styles

### 5. Create Server And Client Entries

> Goal: สร้าง entry points สำหรับ SSR และ hydration

1. สร้าง `src/entry-server.tsx` ด้วย `createHandler` + `StartServer` จาก `@solidjs/start/server` — render document shell พร้อม `assets`, `children`, `scripts`
2. สร้าง `src/entry-client.tsx` ด้วย `mount` + `StartClient` จาก `@solidjs/start/client` — hydrate ที่ `#app`
3. ใส่ `// @refresh reload` ที่บรรทัดแรกของทั้งสอง entry

### 6. Create Routes

> Goal: สร้าง file-based routes

1. สร้าง `src/routes/index.tsx` สำหรับ home page
2. สร้าง `src/routes/[...404].tsx` สำหรับ catch-all พร้อม `HttpStatusCode` จาก `@solidjs/start`
3. ใช้ `Title` จาก `@solidjs/meta` ในทุก route

### 7. Run And Verify

> Goal: dev server และ build ทำงาน

1. รัน `bun run dev` (หรือ `vite dev`) แล้วเปิด browser ตรวจ SSR HTML
2. รัน `bun run build` เพื่อสร้าง production output ผ่าน Nitro — output อยู่ที่ `.output/` รันด้วย `bun .output/server/index.mjs` ได้
3. ตรวจว่า hydration ทำงาน (view-source มี HTML จาก server)

## Rules

### 1. Entry Points

- `src/entry-server.tsx` ต้อง export `createHandler(() => <StartServer ... />)`
- `src/entry-client.tsx` ต้องเรียก `mount(() => <StartClient />, document.getElementById("app")!)`
- ใส่ `// @refresh reload` ที่บรรทัดแรกของทุก entry file

### 2. Plugins

- ใช้ `nitro()` จาก `nitro/vite` ใน `vite.config.ts` เสมอ — Nitro ทำหน้าที่ server engine
- ใช้ `solidStart()` จาก `@solidjs/start/config` คู่กับ `nitro()`
- ห้ามเพิ่ม dev server middleware นอก Nitro hooks — ดู `/follow-create-nitro-plugin`

### 3. SolidJS Patterns

- ทำตาม `/follow-lib-solidjs` สำหรับ reactivity (`createSignal`, `createStore`, `createResource`)
- ใช้ `FileRoutes` สำหรับ file-based routing ไม่สร้าง route config เอง
- ใช้ `Suspense` ใน root layout เสมอ

### 4. Bun Native APIs

- ใช้ Bun เป็น package manager และ script runner เสมอ (`bun install`, `bun run dev`, `bun run build`)
- ถ้าต้องเขียน server code เองนอก Nitro (เช่น scripts, tools) → ใช้ Bun native APIs ตาม `/use-bun-native-api` (`Bun.serve`, `Bun.file`, `Bun.spawn`, `$` shell)
- Nitro production output รันด้วย Bun ได้โดยตรง (`bun .output/server/index.mjs`)

### 5. Safety

- ไม่ commit secrets ลง repository — ใช้ environment variables
- ถ้ามี destructive changes → dry run ก่อน

- ใช้ /follow-lib-solidjs ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-create-nitro-plugin ถ้าจำเป็น
- ใช้ /follow-my-tech-stack ถ้าจำเป็น
- ใช้ /use-bun-native-api ถ้าต้องเขียน Bun APIs เพิ่มเติม

## Expected Outcome

- SolidStart + Nitro SSR project รัน dev server และ build ได้
- SSR streaming HTML ทำงาน และ client hydration สำเร็จ
- File-based routing พร้อม 404 catch-all route
- TypeScript strict mode พร้อม `~/*` alias
