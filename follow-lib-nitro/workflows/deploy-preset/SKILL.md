---
name: follow-lib-nitro-deploy-preset
description: Deploy Nitro ด้วย preset — bun/node/cloudflare/deno/vercel/netlify + provider config, bindings, rollback
argument-hint: "[provider]"
related:
  - follow-lib-nitro
  - follow-service-cloudflare
  - run-build
  - resolve-errors
  - report
---

## Goal

Deploy Nitro `.output` ไป provider ตาม preset — เลือก preset, provider config, secrets/bindings, verify live

## Scope

deploy path ของ Nitro app — ทำหลัง `setup-nitro`; Cloudflare-specific deploy depth → `/follow-service-cloudflare` (`deploy-worker` workflow)

## Execute

### 1. Pick Preset

> Goal: preset ตรง deploy target

| Preset | Output | Run/Deploy |
|---|---|---|
| `bun` | `.output/server/index.mjs` | `bun .output/server/index.mjs` |
| `node-server` | `.output/server/index.mjs` | `node .output/server/index.mjs` |
| `cloudflare-module` | Worker module | `wrangler deploy` |
| `deno-server` | `.output/server/index.ts` | `deno run` |
| `vercel` / `netlify` | provider bundle | provider CLI/git push |

- ตั้งผ่าน `NITRO_PRESET` env หรือ `nitro.config.ts` `preset` — เลือกวิธีเดียว ห้ามขัดกัน
- Full list: https://nitro.build/deploy — presets เพิ่มบ่อย ตรวจล่าสุดก่อน

### 2. Provider Config

> Goal: provider-specific wiring ครบ

1. **Cloudflare**: preset `cloudflare-module` + `wrangler.jsonc` (bindings/secrets) → `/follow-service-cloudflare` สำหรับ d1/kv/r2 + deploy
2. **Vercel/Netlify**: preset generates provider layout — ตรวจ `vercel.json`/`netlify.toml` requirements
3. **Self-host (bun/node)**: process manager (pm2/systemd/docker) + `PORT`/`HOST` env
4. Statics: `.output/public/` serve อัตโนมัติทุก preset — หรือ CDN แยก

### 3. Secrets And Bindings

1. Secrets → env/`wrangler secret put`/provider dashboard — ห้ามใน config repo
2. Bindings (KV/D1/R2) → `wrangler.jsonc` + `wrangler types` → `worker-configuration.d.ts`
3. `runtimeConfig` overrides → `NITRO_*` env vars บน provider

### 4. Build, Deploy, Verify

1. `NITRO_PRESET=<target> bun run build` → inspect `.output/`
2. Deploy ตาม provider path → smoke test health/critical routes
3. Rollback path: เก็บ previous `.output` หรือ provider version
4. fail → `/resolve-errors` max 3 รอบ → report URL + version

## Rules

- Preset คือ build-time — เปลี่ยน provider = rebuild ด้วย preset ใหม่ (ไม่ใช่ runtime switch)
- ตรวจ preset maturity — beta presets เทสก่อน production
- `.output/` portable ภายใต้ preset เดียวกัน — ไม่ใช่ข้าม preset
- Secrets/env ตาม provider mechanism — บาง presets ไม่มี `.env` loading

## Expected Outcome

- Build ตาม preset ถูกต้อง + deploy สำเร็จบน target
- Bindings/secrets เข้าถึงใน handlers; rollback path พร้อม
