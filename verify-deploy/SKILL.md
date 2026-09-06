---
name: verify-deploy
description: Smoke checks หลัง deploy — health, key routes, version และ security headers ตรง release
argument-hint: "[url-or-environment]"
related:
  - watch-deploy
  - check-security-headers
  - run-test-api
  - ship-rollback
  - deploy-to-cloudflare
  - report-before-after
---

## Goal

ยืนยันว่า deployment สำเร็จจริงหลัง deploy — health endpoints ตอบ, routes สำคัญทำงาน, version ที่ deploy ตรงกับ release และไม่มี obvious regressions

## Scope

- ใช้หลัง `/deploy-*` หรือ `/ship` เสร็จ — ตรวจ deployed environment (staging หรือ production)
- ครอบคลุม: health checks, version match, key routes smoke test, security headers, error rate แรก
- Read-only ต่อ production: ตรวจสอบอย่างเดียว — rollback ผ่าน `/ship-rollback`

## Execute

### 1. Identify Deployment

> Goal: ระบุสิ่งที่ deploy ไป

1. หา target URL จาก argument, deploy output ล่าสุด หรือ platform dashboard
2. ระบุ expected version: git SHA, release tag หรือ version จาก manifest
3. เก็บ deploy metadata: เวลา, commit, environment

### 2. Health And Version Checks

> Goal: ยืนยัน service ขึ้นและ version ตรง

1. ตรวจ `/health`, `/healthz`, `/ready` — status 200 และ payload สมเหตุสมผล
2. เทียบ version ที่ expose (`/version`, response header, meta tag) กับ expected SHA/tag
3. ถ้า version ไม่ตรง → flag `stale deploy` หรือ rollback concern ทันที

### 3. Smoke Test Key Routes

> Goal: ทดสอบ critical paths ที่ deploy ไป

1. เลือก 3-5 routes/endpoints สำคัญ (homepage, main API, auth flow start)
2. ตรวจ status codes, response time พื้นฐาน และ content sanity (ไม่ใช่ error page)
3. ทำ `/run-test-api` สำหรับ API endpoints ที่สำคัญ
4. ทำ `/check-security-headers` บน deployed URL

### 4. Check Error Signals

> Goal: ดู error หลัง deploy ช่วงแรก

1. ดู platform logs/error rate ถ้าเข้าถึงได้ (`/watch-deploy`, dashboard, `wrangler tail`)
2. flag error spike, crash loops หรือ cold start anomalies
3. ถ้าเจอ critical → แนะนำ `/ship-rollback` พร้อม evidence

### 5. Report Verdict

> Goal: สรุปผล pass/fail ชัดเจน

1. Verdict: `healthy`, `degraded`, `failed` พร้อมเหตุผล
2. ใช้ `/report-before-after` หรือ table: `No.`, `Check`, `Expected`, `Actual`, `Status`
3. ถ้า failed → เสนอ rollback steps ทันที

## Rules

### 1. Read-Only On Production

- ห้าม mutate production ระหว่าง verify — GET/HEAD เท่านั้น
- mutation tests (write endpoints) ทำได้เฉพาะ staging หรือ test data ที่ชัดเจน

### 2. Evidence-Based

- ทุก check ต้องมี actual response/status — ไม่สรุปจาก deploy log ฝ่ายเดียว
- ระบุเวลาที่ verify เสมอ (deploy อาจยัง propagate ไม่ครบ)

### 3. Fail Loud

- check ใด fail → ระบุชัดเจน พร้อม next action (rollback, investigate, retry)
- ไม่รายงาน "ผ่าน" ถ้าบาง checks ไม่ได้ตรวจ

## Expected Outcome

- Deploy verification verdict พร้อมผลแต่ละ check
- Version confirmation ว่าตรงกับ release
- Early error detection พร้อม rollback recommendation ถ้าจำเป็น
