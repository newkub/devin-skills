---
name: check-rate-limiting
description: ตรวจ endpoints ที่ขาด rate limiting — abuse, brute force และ cost exposure
argument-hint: "[routes-or-framework]"
related:
  - review-security
  - report-table
---

## Goal

ตรวจว่า API endpoints มี rate limiting ครอบคลุมหรือไม่ — โดยเฉพาะ auth, expensive operations และ public endpoints ที่เสี่ยง abuse/brute force/cost

## Scope

- ตรวจ route definitions และ middleware chain ของ framework ที่ใช้ (Elysia, Express, Hono, Next.js, Fastify)
- ครอบคลุม: login/auth endpoints, password reset, expensive queries, file uploads, AI/LLM endpoints, public APIs
- Read-only: รายงาน gaps — เพิ่ม rate limiting ผ่าน `/review-security`

## Execute

### 1. Map Endpoints

> Goal: รวบรวม routes ทั้งหมดพร้อมความเสี่ยง

1. ใช้ `scan-codebase`/`use-astgrep` หา route registrations ทั้งหมด
2. จัดประเภทความเสี่ยง:
   - `auth`: login, signup, password reset, OTP — brute force target
   - `expensive`: reports, exports, AI calls, heavy queries — cost target
   - `public`: unauthenticated endpoints ทั้งหมด — abuse target
   - `internal`: authenticated CRUD ทั่วไป
3. flag mutation methods (POST/PUT/DELETE) เป็นพิเศษ

### 2. Detect Existing Protection

> Goal: หา rate limiting ที่มีอยู่

1. ค้น middleware/plugins: `rateLimit`, `rate-limit`, `throttle`, `slowDown`, platform-level (Cloudflare rules, API gateway)
2. ตรวจว่า apply global หรือ per-route — global limit อาจ loose เกินสำหรับ auth endpoints
3. ตรวจ keyed-by: IP, user, API key — per-IP alone bypass ได้ง่าย

### 3. Evaluate Coverage

> Goal: เทียบความเสี่ยงกับ protection

1. flag endpoints ความเสี่ยงสูงที่ไม่มี limit เลย
2. flag limits ที่ loose เกิน (เช่น login 1000/min)
3. flag missing: lockout, exponential backoff, CAPTCHA escalation สำหรับ auth flows
4. ตรวจ response: มี `429` + `Retry-After` headers ถูกต้องไหม

### 4. Report

> Goal: สรุป coverage gaps พร้อม severity

1. ใช้ `/report-table` คอลัมน์: `No.`, `Endpoint`, `Risk Type`, `Current Limit`, `Severity`, `Recommendation`
2. Severity: `critical` (auth ไม่มี limit), `high` (expensive/public ไม่มี), `medium` (limit loose), `info` (มีแล้ว)
3. แนะนำ limits ที่เหมาะต่อประเภท endpoint

## Rules

### 1. Evidence-Based

- ทุก finding ต้องอิง route definition และ middleware chain จริง
- ระบุว่า protection อยู่ระดับไหน (app middleware vs platform/edge)

### 2. Read-Only

- ไม่แก้ rate limiting — รายงานแล้วทำ `/review-security`
- ไม่ยิง endpoints จริงเพื่อทดสอบ limits — ใช้ `/run-load-test` แยกถ้าต้องการ

### 3. Context Aware

- Internal/admin endpoints อาจไม่ต้องการ rate limit — flag info ไม่ใช่ violation
- Platform-level limiting (Cloudflare) นับเป็น protection — ระบุชัดว่าอยู่ชั้นไหน

## Expected Outcome

- ตาราง endpoints พร้อม risk level และ current limits
- Gaps ที่ critical โดยเฉพาะ auth และ expensive endpoints
- คำแนะนำ rate limit policy ต่อประเภท
