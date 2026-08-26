---
name: deploy-to-cloudflare
description: Deploy application ไปยัง Cloudflare Workers หรือ Pages จนกว่าจะ live
related:
  - follow-service-cloudflare
  - follow-service-deploy-to-cloudflare
  - watch-cloudflare
  - watch-cloudflare-and-fix-in-computer
  - run-build
  - git-commit
---

## Goal

Deploy application ไปยัง Cloudflare Workers หรือ Pages ด้วย Wrangler ตั้งแต่ build, deploy, watch, และ fix จนสำเร็จ

## Scope

รองรับ Cloudflare Workers, Pages, Nitro preset และ framework ทั่วไป ใช้ Wrangler CLI เป็นหลัก

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
2. ทำ `/run-build`
3. ตรวจสอบ `.output/server` หรือ build output

### 3. Authenticate

> Goal: ตรวจสอบ Wrangler auth

1. รัน `wrangler whoami`
2. ถ้ายังไม่ auth → รัน `wrangler login` หรือตั้ง `CLOUDFLARE_API_TOKEN`

### 4. Deploy

> Goal: ส่ง deployment ไป Cloudflare

1. Nitro → ใช้ `/follow-service-deploy-to-cloudflare`
2. Workers raw → `wrangler deploy`
3. Pages → `wrangler pages deploy <output-dir>`
4. บันทึก deployment URL

### 5. Watch And Fix

> Goal: ยืนยันว่า live

1. ทำ `/watch-cloudflare` หรือ `/watch-cloudflare-and-fix-in-computer`
2. ถ้า fail → แก้ไข source และ redeploy
3. วนซ้ำจนสำเร็จ

### 6. Commit And Push

> Goal: sync กับ git

1. ทำ `/git-commit`
2. ทำ `/git-push`

### 7. Report

> Goal: สรุปผล

1. รายงาน project type, worker name, URL, status
2. ระบุ environment

## Rules

- ตรวจ project type ก่อน deploy
- build สำเร็จก่อน deploy
- ใช้ `wrangler` CLI
- หาก fail → ใช้ `/watch-cloudflare` หา root cause แล้ว fix
- ไม่ commit ก่อน deploy สำเร็จ

## Expected Outcome

- Deploy ไป Cloudflare สำเร็จ
- Worker/Pages URL ใช้งานได้
- Git sync เรียบร้อย
