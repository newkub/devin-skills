---
name: review-rate-limiting
description: Review checklist สำหรับ rate limiting, throttling, และ backoff พร้อม review score
---


## Goal

Review rate-limiting, throttling, และ backoff ของ project ให้ครอบคลุม พร้อม review score

## Scope

ใช้กับ rate limiting, throttling, และ backoff ใน project หรือ workspace ที่ต้องการ review

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจสถานะปัจจุบันของ rate limiting ใน codebase

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ rate limiter, throttling mechanism, และ backoff implementation ที่ใช้
4. ถ้าไม่พบ rate-limiting ที่เกี่ยวข้อง -> stop และ report

### 2. Review Rate Limiting, Throttling, And Backoff

> Goal: ตรวจสอบ rate limiting, throttling, และ backoff ตาม checklist

#### Rate Limiting

1. ตรวจสอบ rate limit configuration: window, threshold, per-route vs global, per-IP vs per-user
2. ตรวจสอบ rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`
3. ตรวจสอบ 429 Too Many Requests handling และ client guidance
4. ตรวจสอบ distributed rate limiting: shared store, Redis, race condition prevention
5. ตรวจสอบ bypass protection, whitelist safety, และ abuse prevention
6. ตรวจสอบ rate limiting บน critical endpoints, APIs, webhooks, และ queue producers

#### Throttling

1. ตรวจสอบ throttling mechanism: token bucket, leaky bucket, request rate, burst allowance
2. ตรวจสอบ client-side throttling: debounce, throttle, request batching
3. ตรวจสอบ server-side throttling: fair usage, per-tenant/account limits
4. ตรวจสอบ throttling กับ downstream services และ external APIs

#### Backoff

1. ตรวจสอบ retry/backoff strategy: exponential, linear, fixed, jitter
2. ตรวจสอบ max retry, max delay, และ timeout configuration
3. ตรวจสอบ circuit breaker, fallback, และ error handling
4. ตรวจสอบ backoff ใน queue workers, API clients, webhooks, และ background jobs
5. ตรวจสอบ thundering herd prevention และ retry budget

### 3. Validate And Report

> Goal: ยืนยันว่า findings ถูกต้องและรายงานผล

1. ทำ `/validate` หรือ `/run-check` เพื่อ validate findings
2. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
3. จัดลำดับ findings ตาม severity: Critical -> High -> Medium -> Low
4. คำนวณ review score: `(Critical=0, High=25, Medium=50, Low=75, Info=100)` -> weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Scope And Safety

- ทำ review เท่านั้น ไม่แก้ไข code
- ไม่แก้นอก scope rate limiting, throttling, backoff
- ถ้าไม่แน่ใจ -> stop และ `/ask-me`
- ห้ามลบไฟล์หรือ code (no deletions)

### 2. Skip Conditions

- ถ้า project ไม่มี rate-limiting ให้ stop และ report
- ถ้า project ไม่มี throttling ให้ข้าม throttling checklist
- ถ้า project ไม่มี retry/backoff ให้ข้าม backoff checklist
- ถ้า project ไม่มี distributed setup ให้ข้าม distributed rate limiting item

### 3. Severity Classification

- Critical: no rate limiting บน critical endpoint, bypassable rate limit, missing retry/backoff ที่ก่อให้เกิด data loss, thundering herd ที่ไม่มี protection
- High: missing rate limit headers, incorrect threshold, missing throttling, missing circuit breaker, suboptimal backoff
- Medium: inconsistent rate limit config, missing client guidance, missing per-tenant throttling
- Low: documentation gap, minor naming, cosmetic improvement

### 4. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ endpoint, handler, worker, หรือ client ที่เกี่ยวข้อง
- ไม่เดา ใช้ tools สำหรับ verification

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings จากทุก rate limiting, throttling, backoff section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
- ไม่มีการลบ code หรือไฟล์
