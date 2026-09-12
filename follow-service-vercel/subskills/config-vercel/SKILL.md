---
name: follow-service-vercel-config-vercel
description: ตั้งค่า Vercel env vars และ vercel.json โดย merge กับ config เดิม
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - check-config-drift
  - report-config-files
  - deploy-to-vercel
  - run-verify
---

## Goal

ตั้งค่า/แก้ไข Vercel configuration — environment variables และ `vercel.json` (rewrites, headers, functions, crons) — โดยไม่ clobber settings เดิม

## Scope

- ครอบคลุม `vercel.json`, `vercel env` และ project settings
- ถ้ายังไม่ได้ link project → ทำ `subskills/setup-vercel/SKILL.md` ก่อน
- deploy จริง → `/deploy-to-vercel`

## Execute

### 1. Read Current Config

> Goal: รู้ config ปัจจุบันก่อนแก้

1. อ่าน `vercel.json`, `.vercel/project.json` และ env files ที่มีอยู่
2. รัน `bunx vercel pull` เพื่อ sync project settings ล่าสุดจาก dashboard
3. ทำ `/check-config-drift` หรือ `/report-config-files` ถ้าต้องรู้ drift

### 2. Configure Environment Variables

> Goal: env vars ถูกต้องต่อ environment

1. เพิ่ม key ด้วย `bunx vercel env add KEY_NAME` — เลือก environment (production/preview/development)
2. sync ลง local ด้วย `bunx vercel env pull .env.local`
3. secrets → `/follow-secret-manager` ก่อน แล้วค่อย push ขึ้น Vercel — ห้ามใส่ใน `vercel.json`

### 3. Configure vercel.json

> Goal: config file ถูกต้องตาม schema

1. แก้เฉพาะ keys ที่จำเป็นใน `vercel.json` — merge กับของเดิม ห้าม overwrite ทั้งไฟล์
2. keys ที่ใช้บ่อย: `rewrites`, `redirects`, `headers`, `functions`, `crons`, `regions`, `ignoreCommand`
3. ระบุ `buildCommand`/`outputDirectory` เฉพาะเมื่อ framework detection ไม่ตรง — ดู official docs https://vercel.com/docs/projects/project-configuration

### 4. Verify

> Goal: config ใช้ได้จริงก่อน deploy

1. รัน `bunx vercel build` เพื่อตรวจว่า config build ได้ local
2. ทำ `/run-verify` สำหรับ lint, typecheck
3. ถ้าพัง → revert key ที่เพิ่งแก้แล้ว report diff ด้วย `/report-before-after`

## Rules

- ห้ามใส่ secrets ใน `vercel.json` หรือ commit `.env.local`
- แก้ config แบบ incremental — เปลี่ยนทีละ key แล้ว verify
- ทุก env var ที่เพิ่มต้องระบุ target environment ชัดเจน

## Expected Outcome

- env vars sync ระหว่าง local กับ Vercel ถูกต้อง
- `vercel.json` ผ่าน schema และ `vercel build` สำเร็จ
- พร้อม deploy ด้วย `/deploy-to-vercel`
