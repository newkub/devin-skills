---
name: follow-service-vercel-verify-connection
description: ยืนยัน Vercel connection — CLI auth, project linked, env vars ครบ
argument-hint: "[project]"
related:
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง setup/config ว่า Vercel เชื่อมต่อได้จริง — CLI authenticated, project linked, env vars sync ครบ

## Scope

- ใช้เมื่อ `/follow-service-vercel` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ deploy หรือแก้ env

## Execute

### 1. Check CLI Auth

> Goal: vercel login และ scope ถูก

1. `vercel whoami` — ต้องคืน user/team
2. ตรวจ scope ตรงกับ project owner (personal vs team) — `vercel teams ls` ถ้าจำเป็น
3. auth fail → แนะนำ `subskills/setup-vercel/SKILL.md` — ไม่ login เอง

### 2. Check Project Link

> Goal: local project link กับ Vercel project ถูกต้อง

1. ตรวจ `.vercel/project.json` — `projectId`/`orgId` มีและตรง project ที่คาด
2. `vercel project ls` หา project — flag ถ้า link ชี้ project ผิด
3. `vercel env ls` — env vars ที่ code ต้องการมีบน Vercel ครบ (เทียบ `.env.example`)

### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `not-linked` / `env-missing`

## Rules

- ใช้ ls/inspect commands เท่านั้น — ห้าม deploy/env add
- ไม่ print env var values — แสดงแค่ names ที่ขาด
- not-linked → รายงานให้รัน `vercel link` ผ่าน setup subskill

## Expected Outcome

- Verdict พร้อม project/org + env coverage evidence
