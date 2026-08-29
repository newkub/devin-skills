---
name: watch-cd-and-resolve
argument-hint: "[url-or-target]"
description: ติดตาม deployment/release หลัง trigger จน live หรือ healthy พร้อม resolve และ re-deploy
related:
  - watch-deploy
  - watch-cloudflare
  - watch-vercel
  - watch-release
  - run-deploy
  - deploy-to-cloudflare
  - deploy-to-vercel
  - deploy-to-railway
  - run-release
  - ship-release
  - resolve-errors
  - report-table
  - suggest-next-action
---

## Goal

ติดตาม CD/deployment หลังจากถูก trigger ตรวจสอบวา live/healthy หรือ release สำเร็จ ถ้าไม่ผ่านให้ resolve และ re-deploy จนกว่าจะผ่าน

## Scope

ใช้หลังจาก `/run-deploy`, `/deploy-to-cloudflare`, `/deploy-to-vercel`, `/ship-release`, `/run-release` หรือเมื่อรับ `url-or-target` จาก argument

ครอบคลุม Cloudflare Pages, Vercel, Railway, Render, Fly.io, Netlify, custom domain, และ release/tag

สำหรับ platform เฉพาะจะส่งต่อไป `/watch-cloudflare`, `/watch-vercel` หรือ `/watch-release`
สำหรับ generic URL จะใช้ `/watch-deploy`

ไม่ครอบคลุม: CI pipeline เบื้องต้น — ใช้ `/watch-ci-and-resolve`
ไม่รวม trigger deploy ครั้งแรก ต้องถูก trigger โดย `/run-deploy` หรือ `/deploy-to-*` ก่อน

## Execute

### 1. Detect CD Target

> Goal: ระบุ deployment target และ URL

1. ถ้าได้รับ `url-or-target` จาก argument → ใช้ค่านั้น
2. ถ้าไม่มี → ค้นหาจาก:
   - environment variable `DEPLOY_URL`, `PREVIEW_URL`, `VERCEL_URL`, `CF_PAGES_URL`
   - output ของคำสั่ง deploy ล่าสุด
   - CI/CD log ทีมี URL
   - file `references/targets.md` ใน `watch-deploy`
3. ถ้ายังไม่ชัด → ทำ `/ask-me`

### 2. Determine Platform

> Goal: เลือก skill ที่เหมาะกับ CD target

1. Cloudflare Pages: URL มี `.pages.dev` หรือ `wrangler` อยู่ใน output → ใช้ `/watch-cloudflare`
2. Vercel: URL มี `.vercel.app` หรือ `vercel` อยู่ใน output → ใช้ `/watch-vercel`
3. Release/tag: ถ้า `url-or-target` เป็น version tag, release name, หรือ GitHub release → ใช้ `/watch-release`
4. Generic URL (Railway, Render, Fly.io, Netlify, custom domain) → ใช้ `/watch-deploy`

### 3. Watch Until Healthy

> Goal: ติดตาม deployment จนกว่าจะ live หรือ release สำเร็จ

1. เรียก skill ตาม platform ทีเลือกไว้
2. ถ้า success → ไปขั้นตอน Report
3. ถ้า fail, timeout, หรือ unhealthy → ไปขั้นตอน Resolve

### 4. Resolve And Re-deploy

> Goal: แก้ไขปัญหา CD แล้ว trigger ใหม่

1. บันทึก `LAST_GREEN_SHA` ด้วย `git rev-parse HEAD` ถ้ายังไม่มี
2. ทำ `/resolve-errors` วิเคราะห์ deploy logs, URL errors, config
3. ถ้าปัญหามาจาก code หรือ config → แก้ไขน้อยที่สุด
4. ถ้าปัญหามาจาก infra/secret/platform → ทำ `/review-deploy`, `/follow-secret-manager`, หรือ `/setup-ci-cd` ตามลักษณะ
5. Re-deploy ตาม platform:
   - Cloudflare → `/deploy-to-cloudflare`
   - Vercel → `/deploy-to-vercel`
   - Railway → `/deploy-to-railway` หรือ `/run-deploy`
   - Generic URL / หลาย platform → `/run-deploy`
   - Release → `/run-release`
6. ถ้า re-deploy ไม่ได้ → stop และ report
7. กลับไปขั้นตอน 3 เพื่อ watch ใหม่
8. วนซ้ำสูงสุด 5 รอบ ถ้าเกิน → stop และ report

### 5. Report Result

> Goal: สรุปผล CD

1. ถ้า deployment healthy/release สำเร็จ → report platform, URL, duration, status
2. ถ้ายังไม่ผ่าน → report failures ที่เหลือ, root cause, last green SHA, next step
3. ใช้ `/report-table` ด้วยคอลัมน์: No., Platform, Target, Status, Duration, Root Cause, Action
4. ทำ `/suggest-next-action`

## Rules

### 1. Platform Detection

- ตรวจหา platform จาก URL pattern หรือ deploy output ก่อนเดา
- ถ้าไม่ชัด → ใช้ `/watch-deploy` แบบ generic URL polling
- ถ้าเป็น release อย่างเดียว (ไม่มี URL) → ใช้ `/watch-release`

### 2. No Initial Deploy

- `watch-cd-and-resolve` ไม่ trigger deploy ครั้งแรกเอง
- ต้องถูกเรียกหลังจาก `/run-deploy`, `/deploy-to-*`, หรือ `/run-release` แล้ว
- ถ้ายังไม่มี deployment ให้ทำ `/run-deploy` ก่อน

### 3. Resolve And Retry

- วน loop จนกว่า CD จะผ่านหรือถึงขีดจำกัด
- สูงสุด 5 รอบ ถ้าเกิน → stop และ report
- ถ้า failure เดิมเกิดซ้ำ 3 ครั้งขึ้นไป → circuit breaker, แนะนำ rollback

### 4. Safety

- บันทึก `LAST_GREEN_SHA` ก่อนแก้ไขทุกรอบ
- ถ้า fix สร้าง failure ใหม่หลัง 3 รอบ → แนะนำ revert กลับไป last green SHA
- ห้าม force-push หรือ rewrite history
- ห้าม deploy ซ้ำแบบไร้เงื่อนไข (ต้องมี root cause ก่อน re-deploy)

### 5. Rollback Recommendation

- ถ้า timeout หรือไม่ผ่านหลัง 5 รอบ → แนะนำ rollback command เฉพาะ platform
- ไม่ rollback อัตโนมัติ รอ user ตัดสินใจ
- ระบุ platform-specific rollback จาก `watch-deploy/references/targets.md`

### 6. Per-Round Timeout

- `perRoundTimeout` = 300 วินาที สำหรับ resolve + re-deploy
- `cdWatchTimeout` = 600 วินาที สำหรับ watch ทีช้า (เช่น Cloudflare propagation)
- ถ้าเกิน timeout → stop และ report

## Expected Outcome

- Deployment URL healthy หรือ release สำเร็จ
- รายงาน `/report-table` สมบูรณ์
- ระบุ next step ผ่าน `/suggest-next-action`
- ไม่มี auto-rollback โดยไม่แจ้ง user
- ถ้าไม่ผ่าน มี last green SHA และ rollback recommendation ชัดเจน
