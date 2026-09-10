---
name: review-deploy
description: Review deployment readiness ก่อน deploy และ verify หลัง deploy
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - run-deploy
  - follow-deploy
  - watch-deploy
  - check-security-headers
  - run-test-api
  - ship-rollback
  - scan-codebase
  - report
  - report-before-after
  - suggest-next-action
---

## Goal

Review deployment readiness ก่อนเริ่ม deploy เพื่อยืนยันว่า env vars, secrets, config, build artifacts, health checks, rollback plan, DNS/CDN, SSL, migration scripts และ zero-downtime strategy ครบถ้วน

## Scope

ใช้ก่อนเรียก `run-deploy`, `deploy-to-railway`, `deploy-to-cloudflare`, `follow-service-vercel`, `follow-deploy`, หรือ `run-preview` — ตรวจ deployment readiness ครอบคลุม env, secrets, build, health, rollback, DNS, SSL, migration, zero-downtime แล้วสรุป deploy readiness score พร้อม go/no-go recommendation

## Execute

### 1. Prepare Context

> Goal: เข้าใจ deployment target และ project context

- ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ deployment config
- ระบุ deployment platform: Vercel, Cloudflare, Railway, หรืออื่น
- ตรวจ deployment config files: `vercel.json`, `wrangler.jsonc`, `railway.json`, `Dockerfile`
- ตรวจ CI/CD workflow files: `.github/workflows/deploy*.yml`
- ถ้าไม่พบ deployment config → stop และ report

### 2. Check Env Vars And Secrets

> Goal: ตรวจ env vars และ secrets ครบถ้วน

ทำตาม references/env-secrets.md

### 3. Check Build Artifacts And Config

> Goal: ตรวจ build artifacts และ config ถูกต้อง

ทำตาม references/build-artifacts.md

### 4. Check Health And Rollback

> Goal: ตรวจ health checks และ rollback plan

ทำตาม references/health-rollback.md

### 5. Check Zero-Downtime And Migration

> Goal: ตรวจ zero-downtime strategy และ migration scripts

ทำตาม references/zero-downtime.md

### 6. Score And Report

> Goal: สรุป deploy readiness score และ go/no-go

ทำตาม references/scoring.md

- คำนวณ deploy readiness score, grade และ supplementary metrics
- ทำ `/report` สรุป category, status, findings, score
- สร้าง go/no-go checklist
- ทำ `/suggest-next-action`

## Rules

1. Review Independence
   - ทำ review เท่านั้น ไม่ deploy ระหว่าง review
   - ทุก finding ต้องมี file path และ evidence (deploy)
2. Evidence-Based Findings
   - ใช้ `Grep` และ `scan-codebase` สำหรับ verification
   - ตรวจ config files และ env files แบบ cross-reference
   - จัดลำดับตาม severity
3. Scoring
   - คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
   - Deploy readiness score = (total score / total categories) × 100%
   - Grade A-F ตาม thresholds ใน references/scoring.md
   - Score < 70 → No-Go แนะนำให้แก้ก่อน deploy
4. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report`

- ใช้ /follow-secret-manager ถ้าจำเป็น
- ใช้ /open-web-for-config-secret ถ้าจำเป็น (deploy)

## Verify

> ทำ section นี้เมื่อต้องการ verify deployment หลัง deploy เสร็จ (merged from: verify-deploy)

1. ทำตาม `references/verify-deploy.md`
2. ใช้ `/watch-deploy` ดู logs/error rate ช่วงแรก
3. ทำ `/run-test-api` สำหรับ endpoints สำคัญ
4. ทำ `/check-security-headers` บน deployed URL
5. ใช้ `/report-before-after` หรือ `/report` สรุป pass/fail
6. ถ้า failed → แนะนำ `/ship-rollback` พร้อม evidence

- ถ้า pass → deploy ถ้า fail → ทำ `/resolve-errors` ก่อน deploy ใหม่

## Expected Outcome

- รายงาน Deploy Readiness Summary พร้อม score และ grade
- รายงาน Go/No-Go Checklist
- รายงาน Blockers พร้อม action required
- Go/no-go recommendation
- Deploy readiness score
- แนะนำ action ถัดไป
