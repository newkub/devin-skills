---
name: follow-lib-nitro-setup-nitro
description: ติดตั้ง Nitro — vite plugin, dev/build, portable .output, preset basics
argument-hint: "[preset]"
related:
  - follow-lib-nitro
  - follow-tool-vite
  - run-dev
  - run-build
  - resolve-errors
---

## Goal

ติดตั้ง Nitro เข้า Vite pipeline — build เป็น portable `.output/` รันได้ทุก runtime

## Scope

first-time Nitro setup ใน Vite-based app — routes/handlers → `define-routes`; deploy per provider → `deploy-preset`

## Execute

### 1. Install

```bash
bun i -D nitro
```

### 2. Configure Vite Plugin

```ts
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [frameworkPlugin(), nitro(), UnoCSS(), frameworkCompiler()],
})
```

- nitro v3 `nitro()` **ไม่รับ `preset` option** — ตั้งผ่าน `NITRO_PRESET` env หรือ `nitro.config.ts`
- เลือกวิธีเดียว (env หรือ config file) — ห้ามตั้งขัดกัน

```ts
process.env.NITRO_PRESET ??= 'bun'   // ใน vite.config.ts ก่อน defineConfig
```

### 3. Nitro Config (optional)

`nitro.config.ts` สำหรับ server options (`routeRules`, `storage`, `prerender`, `srcDir`) — detail ใน docs; app-level wiring ผ่าน `defineNitroConfig`

### 4. Dev And Build

1. `bun run dev` — nitro dev server ผ่าน vite pipeline (HMR + server auto-reload)
2. `bun run build` → `.output/server/index.mjs` + `.output/public/`
3. Run output: `bun .output/server/index.mjs` (preset `bun`) — ไม่ต้องพึ่ง dev toolchain

### 5. Verify

1. `/run-dev` — API routes respond
2. `/run-build` → `.output/` generated, `bun .output/server/index.mjs` serve จริง
3. fail → `/resolve-errors` max 3 รอบ

## Rules

- `.output/` generated — ห้าม commit, เพิ่มใน `.gitignore`
- `nitro()` v3 ไม่รับ `preset` ใน options
- ใช้ `/follow-lib-nitro` สำหรับ overview; preset ล่าสุด → `deploy-preset` workflow

## Expected Outcome

- `bun run build` → `.output/` พร้อม run
- Dev server HMR ทำงานครบทั้ง client+server
