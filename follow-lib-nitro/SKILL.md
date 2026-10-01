---
name: follow-lib-nitro
description: ใช้ Nitro เป็น server engine — vite plugin, presets (bun/node/cloudflare/deno), portable .output, deploy providers
argument-hint: "[scope]"
related:
  - follow-tool-vite
  - follow-solid-framework
  - follow-service-cloudflare
  - deep-research
  - run-dev
---

## Goal

ใช้ Nitro (https://nitro.build) เป็น production server layer ของ web app — build เป็น portable `.output/` ที่รันได้ทุก runtime (Bun, Node, Cloudflare Workers, Deno, edge providers)

## Scope

ใช้เมื่อ project ต้องการ:

- Portable production server — `bun .output/server/index.mjs` / `node .output/server/index.mjs`
- Deploy ไปยัง provider ผ่าน preset — https://nitro.build/deploy
- Server engine ให้ meta-framework (TanStack Start, Analog, Nuxt ใช้ Nitro อยู่แล้ว)

## Execute

### 1. Install

> Goal: เพิ่ม nitro เข้า Vite pipeline

```bash
bun i -D nitro
```

### 2. Configure Vite Plugin

> Goal: `nitro()` อยู่ในลำดับ plugins ที่ถูกต้อง

```ts
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [frameworkPlugin(), nitro(), UnoCSS(), frameworkCompiler()],
})
```

- nitro v3 `nitro()` **ไม่รับ `preset` option** — ตั้ง preset ผ่าน env `NITRO_PRESET` หรือ `nitro.config.ts`:
  ```ts
  process.env.NITRO_PRESET ??= 'bun'   // ใน vite.config.ts ก่อน defineConfig
  ```
- เลือกวิธีเดียว (env หรือ config file) — ห้ามตั้งขัดกัน

### 3. Pick Preset

> Goal: เลือก preset ตาม deploy target

| Preset | Output | Run/Deploy |
|---|---|---|
| `bun` | `.output/server/index.mjs` | `bun .output/server/index.mjs` |
| `node-server` | `.output/server/index.mjs` | `node .output/server/index.mjs` |
| `cloudflare-module` | Worker module | `wrangler deploy` — https://nitro.build/deploy/providers/cloudflare |
| `deno-server` | `.output/server/index.ts` | `deno run` |
| `vercel` / `netlify` / etc. | provider bundle | provider CLI |

- Statics ใน `.output/public/` serve อัตโนมัติ
- Full preset list: https://nitro.build/deploy — ทำ `/deep-research` ยืนยันชื่อ preset ล่าสุดก่อนใช้

### 4. Cloudflare Bindings (ถ้า preset cloudflare-*)

> Goal: env bindings เข้าถึงได้ใน handler

1. declare `d1_databases`/`kv_namespaces`/`r2_buckets` ใน `wrangler.jsonc`
2. code อ่านผ่าน `env.*` — gen types ด้วย `wrangler types` → `worker-configuration.d.ts`
3. ทำตาม `/follow-service-cloudflare` สำหรับ deploy/secrets/rollback

### 5. Custom Server Entry (optional)

> Goal: wrap fetch handler เมื่อต้อง middleware/custom logic

```ts
export default {
  fetch(request: Request, env: unknown, ctx: unknown) {
    // pre-processing → delegate to framework handler
  },
}
```

## Rules

- `nitro()` v3 ไม่รับ `preset` ใน options — ใช้ `NITRO_PRESET` env หรือ `nitro.config.ts`
- `.output/` เป็น generated artifact — ห้าม commit
- secrets ผ่าน env/`wrangler secret` เสมอ ห้าม hardcode ใน config
- เช็ค https://nitro.build หรือ `/deep-research` สำหรับ preset ชื่อและ provider docs ล่าสุด
- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- `bun run build` → `.output/` พร้อม run ตาม preset ที่เลือก
- Server ทำงานบน target runtime โดยไม่แก้ code
