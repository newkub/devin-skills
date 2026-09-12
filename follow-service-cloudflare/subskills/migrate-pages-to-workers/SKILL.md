---
name: follow-service-cloudflare-migrate-pages-to-workers
description: Migrate Cloudflare Pages → Workers (static assets + functions) พร้อม rollback plan
argument-hint: "[project-path]"
related:
  - plan
  - ask-me
  - learn-web
  - use-wrangler
  - resolve-errors
  - update-references
  - report-before-after
---

## Goal

ย้ายโปรเจกต์จาก Cloudflare Pages ไป Workers (Static Assets + Worker script) อย่างปลอดภัย — เว็บทำงานเหมือนเดิมและ rollback ได้

## Scope

- ครอบคลุม: Pages static site → Workers Static Assets, Pages Functions (`functions/`) → Worker routes, `_redirects`/`_headers`, cutover และ rollback
- ไม่ทำพร้อม feature work — migration แยก commit ต่อ step ให้ bisect ได้

## Execute

### 1. Plan Migration

> Goal: map from→to ชัดเจนก่อนเริ่ม

1. ทำ `/plan`: ระบุสิ่งที่ Pages ใช้อยู่ — static output dir, `functions/` routes, `_redirects`, `_headers`, env vars/secrets, custom domains
2. อ่าน official migration guide (Workers Static Assets docs) — ถ้าไม่แน่ใจทำ `/learn-web`
3. เขียน rollback path: Pages project เดิมยังอยู่จนกว่า cutover สำเร็จ — กลับได้ด้วยการชี้ domain กลับ
4. ถ้า scope ไม่ชัดหรือกระทบ production domain → `/ask-me`

### 2. Create Worker Config

> Goal: `wrangler.jsonc`/`wrangler.toml` สำหรับ Workers + assets

1. กำหนด `name`, `main` (worker entry), `compatibility_date` เป็นวันปัจจุบัน
2. ตั้ง `assets` ชี้ไป static output dir เดิมของ Pages (ดู official docs สำหรับ assets config fields ล่าสุด)
3. ย้าย vars จาก Pages settings → `vars` และ secrets → `wrangler secret put`
4. รัน `wrangler types` หลังตั้ง config

### 3. Migrate Functions To Worker

> Goal: `functions/` handlers ทำงานใน Worker

1. map แต่ละ `functions/<route>.ts` → route ใน Worker `fetch` handler
2. ย้าย `context.env` bindings → `env` ของ Worker — bindings ต้องตรง (ดู `subskills/config-bindings`)
3. แปลง `_redirects`/`_headers` → logic ใน Worker หรือ assets config ตาม official docs
4. test local ด้วย `wrangler dev` ทุก route ที่ migrate
5. ถ้า routes fail → `/resolve-errors`

### 4. Deploy And Verify

> Goal: Workers ใหม่ live และเทียบผลกับ Pages เดิม

1. deploy ไป staging env ก่อนด้วย `wrangler deploy --env staging` (ดู `subskills/deploy-worker`)
2. smoke test เทียบทุก route กับ Pages URL เดิม — status, headers, content ต้องเท่ากัน
3. deploy production ด้วย `wrangler deploy` แล้วชี้ custom domain/routes ไป Worker
4. verify domain จริง แล้วเก็บ Pages project เดิมไว้เป็น rollback จนกว่า stable

### 5. Cleanup

> Goal: ปิดของเก่าหลัง stable

1. หลัง production stable (user confirm window) → disable/delete Pages project
2. ลบ config ที่ไม่ใช้แล้ว และทำ `/update-references` ถ้ามีไฟล์ย้าย
3. ทำ `/report-before-after` สรุป URLs, routes และ bindings ที่เปลี่ยน

## Rules

### 1. Rollback First

- Pages project เดิมต้องพร้อม rollback จนกว่า Workers ใหม่ stable — ห้ามลบก่อน confirm
- แยก commit ต่อ migration step ให้ bisect/revert ได้

### 2. Parity Check

- ทุก route/redirect/header ต้องเทียบกับ Pages เดิม — ห้ามสันนิษฐาน
- bindings และ env vars ต้องครบก่อน deploy

### 3. Docs First

- fields ของ assets config และ limits เปลี่ยนได้ — อ้าง official docs ผ่าน `/use-wrangler` แทนการเดา

## Expected Outcome

- site ทำงานบน Workers ครบทุก route/redirect เท่า Pages เดิม
- custom domain ชี้ไป Worker แล้ว และ rollback path (Pages เดิม) พร้อม
- รายงาน before/after ชัดเจน
