---
name: implement-to-production-setup-infra
description: เตรียม infrastructure ให้พร้อม production — env vars, secrets, CI และ observability
argument-hint: "[scope]"
related:
  - check-env-vars
  - check-migrations
  - check-secrets-leak
  - follow-secret-manager
  - setup-cicd
  - review-observability
  - ask-me
---

## Goal

เตรียม infrastructure ทั้งหมดให้พร้อมก่อน production deploy — env vars, secrets, CI pipeline และ observability wiring ครบและ verify ได้

## Scope

- เป็น sub-flow ของ `/implement-to-production` step "Verify Infrastructure" — ใช้เมื่อพบ infra gaps ที่ต้อง setup
- ครอบคลุม: env vars, secrets management, CI readiness, observability (logging/metrics/tracing)
- ไม่ครอบคลุม deploy จริง (ใช้ `subskills/deploy-production`)

## Execute

### 1. Inventory Requirements

> Goal: รู้ว่า app ต้องการ infra อะไรบ้าง

1. ทำ `/check-env-vars` เทียบ `.env` / `.env.example` / code usage — list ตัวที่ขาด
2. ทำ `/check-migrations` เทียบ pending vs applied migrations
3. list external services ที่ใช้: credentials, API keys, endpoints, rate limits
4. list observability gaps: logging, metrics, error tracking

### 2. Setup Env Vars And Secrets

> Goal: env vars ครบและ secrets ปลอดภัย

1. สร้าง/อัปเดต `.env.example` ให้ครบทุก variable ที่ code ใช้
2. เก็บ secrets ผ่าน `/follow-secret-manager` — ห้าม commit
3. inject secrets เข้า platform ตาม target (เช่น `wrangler secret put`, platform dashboard, CI secrets)
4. ทำ `/check-secrets-leak` ยืนยันไม่มี secrets ใน code/config
5. ถ้าขาด credentials ที่ user ต้องให้ → `/ask-me` แล้ว stop รอ

### 3. Verify CI Readiness

> Goal: pipeline พร้อมรัน deploy/test

1. ทำ `/setup-cicd` หรือตรวจ workflows ที่มี — lint, typecheck, test, build jobs ต้องครบ
2. ตรวจ CI secrets ครบ (registry tokens, deploy tokens) ใน repo settings
3. ถ้า CI fail → แก้ให้เขียวก่อนไปต่อ

### 4. Wire Observability

> Goal: production ติดตามและ debug ได้

1. ทำ `/review-observability` เพื่อหา gaps ที่ต้อง wire
2. ตั้งค่า structured logging สำหรับ external calls
3. เพิ่ม metrics: response time, error rate และ correlation IDs สำหรับ tracing
4. ต่อ error tracking/alerting ตาม stack ที่มี — ถ้าไม่มี standard → `/ask-me`

### 5. Verify Readiness

> Goal: infra พร้อมจริงก่อนกลับไป parent flow

1. app รัน local ด้วย env จริงได้ — ไม่มี missing var errors
2. migrations applied และ external services เชื่อมได้
3. report readiness checklist — ถ้ายังมี gaps → list ชัดเจนแล้ว `/ask-me`

## Rules

### 1. Fail Fast

- ถ้า infra ไม่พร้อมและแก้เองไม่ได้ → stop, report options ให้ user เลือก (ตาม parent rule)
- ห้าม hardcode secrets เพื่อ "ให้ผ่าน" — ใช้ `/follow-secret-manager` เสมอ

### 2. No Production Mutation

- subskill นี้เตรียมความพร้อมเท่านั้น — ห้าม deploy หรือแก้ production resources
- secrets/credentials ใหม่ต้อง document ใน `.env.example` (ไม่ใส่ค่าจริง)

## Expected Outcome

- env vars/secrets ครบและไม่มี leak
- CI pipeline พร้อม (lint/typecheck/test/build เขียว)
- observability wired — logging, metrics, tracing, error tracking
- readiness checklist ชัดเจนก่อน deploy
