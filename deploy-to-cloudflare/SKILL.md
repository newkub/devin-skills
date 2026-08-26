---
name: deploy-to-cloudflare
description: Deploy Workers, Pages, หรือ Nitro ไปยัง Cloudflare ด้วย wrangler จน live
related:
  - follow-service-cloudflare
  - watch-cloudflare
  - watch-cloudflare-and-fix-in-computer
  - run-build
  - git-commit
  - resolve-errors
  - loop-until-complete
---

## Goal

Deploy application ไปยัง Cloudflare Workers, Pages, หรือ Nitro ด้วย wrangler ตั้งแต่ build, deploy, watch, และ fix จนสำเร็จ

## Scope

รองรับ Cloudflare Workers, Pages, Nitro preset และ framework ทั่วไป ใช้ wrangler CLI เป็นหลัก

## Execute

### 1. Detect Project Type

> Goal: ระบุ Workers, Pages หรือ Nitro

1. ตรวจไฟล์ `wrangler.toml`, `wrangler.jsonc`, `wrangler.json`
2. ถ้ามี `nitro.config.ts` → ใช้ Nitro preset
3. ถ้ามี `pages_build_output_dir` หรือ `_worker.js` → ใช้ Pages
4. ถ้าเป็น raw Workers → ใช้ `wrangler deploy`

### 2. Verify And Build

> Goal: ตรวจสอบและ build

1. ทำ `/run-verify`
2. ทำ `/run-build` หรือ `bun run build` / `bunx nitro build`
3. ตรวจสอบ `.output/server` หรือ build output

### 3. Authenticate

> Goal: ตรวจสอบ Wrangler auth

1. รัน `wrangler whoami`
2. ถ้ายังไม่ auth → รัน `wrangler login` หรือตั้ง `CLOUDFLARE_API_TOKEN`

### 4. Setup Nitro Config (if Nitro)

> Goal: ตั้งค่า Nitro สำหรับ Cloudflare Workers

1. สร้างหรืออัปเดต `nitro.config.ts`
2. ตั้งค่า `preset: "cloudflare_module"`
3. ตั้งค่า `cloudflare.deployConfig: true` สำหรับ auto-generate wrangler config
4. ตั้งค่า `cloudflare.nodeCompat: true` ถ้าใช้ Node.js APIs
5. ตั้งค่า `compatibilityDate` ให้เหมาะสม เช่น `"2024-09-19"`

### 5. Deploy

> Goal: ส่ง deployment ไป Cloudflare

1. Nitro → `wrangler deploy --config .output/server/wrangler.json` หรือ `wrangler deploy`
2. Workers raw → `wrangler deploy`
3. Pages → `wrangler pages deploy <output-dir>`
4. บันทึก deployment URL

### 6. Watch And Fix

> Goal: ยืนยันว่า live

1. ทำ `/watch-cloudflare` หรือ `/watch-cloudflare-and-fix-in-computer`
2. ถ้า fail → ใช้ `/resolve-errors` หา root cause แล้วแก้ไข source
3. ใช้ `/loop-until-complete` วนซ้ำ deploy และ watch จนสำเร็จ

### 7. Commit And Push

> Goal: sync กับ git

1. ทำ `/git-commit`
2. ทำ `/git-push`

### 8. Report

> Goal: สรุปผล

1. รายงาน project type, worker name, URL, status
2. ระบุ environment

## Rules

- ตรวจ project type ก่อน deploy
- build สำเร็จก่อน deploy
- ใช้ `wrangler` CLI
- Nitro ใช้ `cloudflare_module` preset และ `compatibilityDate` เหมาะสม
- หาก fail → ใช้ `/watch-cloudflare` หา root cause แล้ว fix
- ไม่ commit ก่อน deploy สำเร็จ

## Expected Outcome

- Deploy ไป Cloudflare สำเร็จ
- Worker/Pages URL ใช้งานได้
- Git sync เรียบร้อย
- ไม่มี errors เหลือ
