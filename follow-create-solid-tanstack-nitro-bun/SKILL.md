---
name: follow-create-solid-tanstack-nitro-bun
description: Deploy TanStack Start (SolidJS) เป็น portable server ด้วย Nitro preset bun — `.output` build
argument-hint: "[project-name]"
related:
  - follow-create-solid-tanstack
  - follow-tool-vite
  - deploy-to-cloudflare
  - run-dev
  - ship

---

## Goal

ตั้งค่า production build ของ `/follow-create-solid-tanstack` project ให้ output เป็น portable server ผ่าน Nitro (`preset: bun`) แล้วรันด้วย `bun .output/server/index.mjs` — ไม่ผูกกับ platform เดียว

## Scope

ใช้เมื่อ project ที่สร้างด้วย `/follow-create-solid-tanstack` ต้องการ:

- Self-host production server ด้วย Bun runtime
- Portable build output (`.output/`) ที่ย้ายไป VPS, container, หรือ serverless ได้
- SSR/streaming และ server functions/server routes ทำงานบน production server

ไม่ใช้กับ SPA-only mode (`spa: { enabled: true }` ไม่ต้องมี server output) หรือ deploy เฉพาะ Cloudflare Workers → `/deploy-to-cloudflare`

## Execute

### 1. Verify Base Project

> Goal: project เป็น TanStack Start (SolidJS) ที่ build ได้ก่อนเพิ่ม Nitro

1. ทำ `/follow-create-solid-tanstack` ถ้ายังไม่มี project — หรือตรวจว่า `vite.config.ts` มี `tanstackStart()` อยู่แล้ว
2. รัน `bun run build` ให้ผ่านก่อน — แก้ error ของ base build ก่อนเพิ่ม Nitro
3. ยืนยัน SSR/streaming และ server functions ทำงานใน `bun run dev`

### 2. Install And Configure Nitro

> Goal: เพิ่ม Nitro plugin เข้า Vite pipeline

1. ติดตั้ง `bun i -D nitro`
2. แก้ `vite.config.ts` — เพิ่ม `nitro()` หลัง `tanstackStart()` และก่อน `viteSolid({ ssr: true })`:
   ```ts
   import { defineConfig } from 'vite'
   import { tanstackStart } from '@tanstack/solid-start/plugin/vite'
   import viteSolid from 'vite-plugin-solid'
   import { nitro } from 'nitro/vite'

   export default defineConfig({
     plugins: [
       tanstackStart(),
       nitro({ preset: 'bun' }),
       viteSolid({ ssr: true }),
     ],
   })
   ```
3. หรือตั้ง env `NITRO_PRESET=bun` แทนการ hardcode preset — เลือกวิธีเดียว ห้ามตั้งขัดกัน
4. ถ้าใช้ custom server entry (`src/server.ts`) → ยืนยัน `createServerEntry` export `{ fetch }` เพราะ Nitro เรียกผ่าน fetch handler

### 3. Build Production Output

> Goal: ได้ `.output/` ที่ runnable

1. รัน `bun run build` — Nitro เขียน output ลง `.output/`:
   - `.output/server/index.mjs` — server entry
   - `.output/public/` — client statics ที่ server serve เอง
2. ตรวจว่า `.output/` อยู่ใน `.gitignore`
3. ถ้า build fail → `/resolve-errors` (ส่วนมากคือ node-only API ที่ Nitro polyfill ไม่ได้ — แยกไว้ใน `.server.ts` หรือ dynamic import)

### 4. Run And Verify Locally

> Goal: production server ตอบถูกก่อน deploy

1. รัน `bun .output/server/index.mjs` — default port `3000` (override ด้วย `PORT` env)
2. ทดสอบ: page SSR มี hydration markers, server function (`/_serverFn/*`) ตอบ JSON, server route (`/api/*`) ตอบตาม handler
3. ตรวจ env vars ที่ runtime ต้องการ — Nitro ไม่ bundle `.env`; ต้อง export ให้ process ตอนรัน
4. ทำ `/run-dev` เทียบ behavior dev vs production ถ้า response ต่างกัน

### 5. Deploy

> Goal: ย้าย `.output/` ไปยัง target

1. Self-host/VPS → copy `.output/` ทั้งโฟลเดอร์แล้ว `bun server/index.mjs` (ต้องมี Bun บน target, เวอร์ชันใกล้กับ dev)
2. Container → `FROM oven/bun` + copy `.output/` + `CMD ["bun", "server/index.mjs"]`
3. Platform อื่น → เปลี่ยนเฉพาะ preset (`node-server`, `cloudflare-module`, `vercel` ฯลฯ) แล้วทำ `/deploy-to-cloudflare` หรือ deploy skill ของ platform นั้น
4. ทำ `/ship` เมื่อ production ตอบถูก

## Rules

### 1. Plugin Order

- `tanstackStart()` → `nitro()` → `viteSolid({ ssr: true })` — ผิดลำดับ = server functions/routes เพี้ยนหรือ SSR พัง
- ห้ามใส่ `nitro()` เมื่อ `spa: { enabled: true }` — ไม่มี server ให้ build

### 2. Preset Discipline

- เลือก preset เดียว: `bun` สำหรับ skill นี้ — platform อื่นให้เปลี่ยน preset ไม่ใช่เพิ่ม preset
- `NITRO_PRESET` env vs `nitro({ preset })` — ใช้วิธีเดียวต่อ project

### 3. Runtime Environment

- Bun runtime บน target ต้องตรงกับที่ build (Bun เวอร์ชันต่างกันมาก → polyfill/native API เพี้ยน)
- env vars ไม่ถูก bundle — inject ตอน runtime เสมอ; secrets ห้ามฝังใน `.output/`
- server-only code อยู่ใน `.server.ts` หรือ guard ด้วย `serverOnly()` ตาม `/follow-create-solid-tanstack`

### 4. Output Hygiene

- `.output/` เป็น build artifact — ห้าม commit, ห้ามแก้ไฟล์ในนั้นด้วยมือ
- ทุกปัญหา output แก้ที่ source/config แล้ว rebuild — ไม่ patch artifact

- ใช้ /follow-create-solid-tanstack ถ้าจำเป็น
- ใช้ /deploy-to-cloudflare ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น
- ใช้ /run-dev ถ้าจำเป็น

## Expected Outcome

- `bun run build` ผลิต `.output/server/index.mjs` + `.output/public/`
- `bun .output/server/index.mjs` serve SSR, server functions และ server routes ครบใน production mode
- `.output/` พร้อมย้ายไป target ที่มี Bun โดยไม่ต้องติดตั้ง dependencies เพิ่ม
- Deploy สำเร็จผ่าน `/ship`
