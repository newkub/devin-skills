---
name: follow-deploy-verify-deploy
description: ยืนยัน deployment live จริงหลัง deploy — URL, version, health, logs, rollback readiness
argument-hint: "[url-or-platform]"
related:
  - run-verify
  - resolve-errors
  - follow-secret-manager
  - report
---

## Goal

ยืนยันหลัง deploy ว่า application live จริงและถูก version — shared verification สำหรับทุก platform subskill ของ `/follow-deploy`

## Scope

- ใช้เมื่อ `/follow-deploy` dispatch มาที่ `verify` หรือเรียกหลัง deploy เสร็จ
- ครอบคลุม: URL reachability, expected version/commit, health endpoint, error logs, rollback readiness
- Read-only: ตรวจสอบ — ไม่ redeploy หรือ rollback อัตโนมัติ

## Execute

### 1. Confirm Deployment Exists

> Goal: deployment ล่าสุดมีจริงและเป็น version ที่คาด

1. ดึง deployment ล่าสุดจาก platform:
   - Cloudflare: `wrangler deployments list`
   - Vercel: `vercel ls --prod` หรือ `vercel inspect`
   - Railway: `railway status` / `railway deployment list`
2. เทียบ deployed commit/version กับ `git rev-parse HEAD` — flag ถ้า deploy stale version

### 2. Check URL And Health

> Goal: app ตอบกลับจริง

1. `curl -sI <url>` → status 200/3xx ที่คาดหวัง ไม่ใช่ 5xx
2. ถ้ามี health endpoint (`/health`, `/api/health`) → ตรวจ response ถูกต้อง
3. ตรวจ critical routes ที่ deploy แตะต้อง (เช่น route ที่เพิ่งเปลี่ยน)

### 3. Check Logs And Errors

> Goal: ไม่มี runtime errors หลัง deploy

1. ดู logs ช่วง 5-10 นาทีหลัง deploy:
   - Cloudflare: `wrangler tail`
   - Vercel: `vercel logs`
   - Railway: `railway logs`
2. flag: uncaught exceptions, 5xx spikes, missing env var errors

### 4. Confirm Rollback Path

> Goal: rollback พร้อมถ้าจำเป็น

1. ระบุ previous deployment/version ที่ rollback ไปได้
2. ระบุ rollback command ของ platform — แต่ไม่รัน

### 5. Report

> Goal: สรุป deployment health

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`, `Notes`
2. Verdict: `healthy` / `degraded` / `failed` + rollback command ที่พร้อมใช้

## Rules

- ถ้า check ใด fail → report ทันทีพร้อม rollback command — ไม่แก้ไขเอง
- ใช้ staging URL ถ้า parent deploy ไป staging — ระบุ environment ในรายงานเสมอ
- secrets/credentials ผ่าน `/follow-secret-manager` เท่านั้น

## Expected Outcome

- Deployment ยืนยัน live + ถูก version หรือ report failure พร้อม rollback path
- ตาราง checks พร้อม evidence
