---
name: follow-service-cloudflare-config-bindings
description: ตั้งค่า wrangler bindings (KV, R2, D1, Durable Objects, vars) และ environments
argument-hint: "[binding-or-env]"
related:
  - follow-secret-manager
  - check-config-drift
  - report-before-after
  - use-wrangler
  - resolve-errors
  - learn-web
---

## Goal

ตั้งค่า/แก้ไข bindings และ environments ใน `wrangler.toml`/`wrangler.jsonc` ให้ Worker เชื่อม KV, R2, D1, Durable Objects และ vars ได้ถูกต้อง โดยไม่ clobber config เดิม

## Scope

- ครอบคลุม: `kv_namespaces`, `r2_buckets`, `d1_databases`, `durable_objects`, `vars`, `env.<name>` environments
- ไม่ครอบคลุม: install/auth (ใช้ `subskills/setup-wrangler`), deploy (ใช้ `subskills/deploy-worker`)

## Execute

### 1. Read Current Config

> Goal: เข้าใจ config เดิมก่อนแก้

1. อ่าน `wrangler.toml` หรือ `wrangler.jsonc` ที่มีอยู่ — ถ้าไม่พบ → ทำ `subskills/setup-wrangler` หรือ `wrangler init` ก่อน
2. ทำ `/check-config-drift` ถ้าสงสัยว่า config ไม่ตรงกับ resources จริง
3. ระบุ bindings ที่ต้องเพิ่ม/แก้ จาก argument หรือ code usage (`env.MY_KV` ฯลฯ)

### 2. Provision Resources

> Goal: สร้าง resources บน Cloudflare ก่อน bind

1. KV: `wrangler kv namespace create <NAME>` — เก็บ `id` ที่ได้
2. R2: `wrangler r2 bucket create <NAME>`
3. D1: `wrangler d1 create <NAME>` — เก็บ `database_id` ที่ได้
4. ถ้า resource มีอยู่แล้ว → list หา id (`wrangler kv namespace list`, `wrangler r2 bucket list`, `wrangler d1 list`)

### 3. Add Bindings

> Goal: merge bindings เข้า config โดยไม่ลบของเดิม

1. เพิ่มเฉพาะ keys ที่จำเป็นใน config:
   - KV → `[[kv_namespaces]]` กำหนด `binding`, `id`
   - R2 → `[[r2_buckets]]` กำหนด `binding`, `bucket_name`
   - D1 → `[[d1_databases]]` กำหนด `binding`, `database_name`, `database_id`
   - Durable Objects → `[[durable_objects.bindings]]` กำหนด `name`, `class_name` และ `[[migrations]]` สำหรับ class ใหม่
   - vars → `[vars]` สำหรับ non-secret values
2. binding name ต้องตรงกับที่ code อ้างผ่าน `env.*`
3. secrets ห้ามใส่ใน `vars` — ใช้ `wrangler secret put` ผ่าน `/follow-secret-manager`
4. ถ้าไม่แน่ใจ schema → ดู official docs ผ่าน `/learn-web` หรือ `/use-wrangler`

### 4. Configure Environments

> Goal: แยก staging/production ด้วย `env.*`

1. เพิ่ม `[env.staging]` / `[env.production]` (หรือ `env.staging` ใน jsonc)
2. แต่ละ env ต้องมี bindings ของตัวเอง — top-level bindings ไม่ inherit เข้า named environments
3. provision resources แยกต่อ env (เช่น `CACHE-staging`, `CACHE-production`)

### 5. Verify

> Goal: config valid และ types ตรง

1. รัน `wrangler types` เพื่อ regenerate `Env` interface
2. รัน `wrangler deploy --dry-run` เพื่อ validate config โดยไม่ deploy
3. ถ้าจำเป็น → รัน `wrangler dev` smoke test binding จริง
4. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว `/resolve-errors`; ผ่าน → `/report-before-after`

## Rules

### 1. Merge Not Overwrite

- แก้เฉพาะ keys ที่จำเป็น ห้าม rewrite config ทั้งไฟล์
- binding `name`/`binding` ต้องตรง code usage ทุกจุด

### 2. Secrets Separation

- secrets → `wrangler secret put` เท่านั้น ห้ามอยู่ใน config
- `vars` ใช้เฉพาะ non-secret values

### 3. Environment Isolation

- named environments ต้องประกาศ bindings เองครบ
- ใช้ชื่อ resource แยกต่อ env เพื่อ isolation

## Expected Outcome

- bindings ครบตาม code usage และ `wrangler types` ผ่าน
- environments แยก staging/production ถูกต้อง
- `wrangler deploy --dry-run` validate ผ่านโดยไม่ clobber config เดิม
