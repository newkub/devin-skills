---
name: review-deploy
description: Review deployment readiness ก่อน deploy
---

## Goal

Review deployment readiness ก่อนเริ่ม deploy เพื่อยืนยันว่า env vars, secrets, config, build artifacts, health checks, rollback plan, DNS/CDN, SSL, migration scripts และ zero-downtime strategy ครบถ้วน

## Scope

ใช้ก่อนเรียก `run-deploy`, `deploy-to-railway`, `follow-deploy-to-cloudflare`, `follow-vercel`, `follow-vercel-cli`, `follow-deploy`, หรือ `run-preview` — ตรวจ deployment readiness ครอบคลุม env, secrets, build, health, rollback, DNS, SSL, migration, zero-downtime แล้วสรุป deploy readiness score พร้อม go/no-go checklist

## Execute

### 1. Prepare Context

> Goal: เข้าใจ deployment target และ project context

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ deployment config
2. ระบุ deployment platform: Vercel, Cloudflare, Railway, หรืออื่น
3. ตรวจ deployment config files: `vercel.json`, `wrangler.jsonc`, `railway.json`, `Dockerfile`
4. ตรวจ CI/CD workflow files: `.github/workflows/deploy*.yml`
5. ถ้าไม่พบ deployment config → stop และ report

### 2. Check Env Vars And Secrets

> Goal: ตรวจ env vars และ secrets ครบถ้วน

1. ตรวจ `.env.example` มี variables ที่จำเป็นทั้งหมด
2. ตรวจ secrets ตั้งค่าใน platform: `NPM_TOKEN`, `DATABASE_URL`, `API_KEY`
3. ตรวจไม่มี secrets ใน codebase หรือ config files
4. ตรวจ env vars แยก environment: dev, staging, production
5. ดูรายละเอียดใน [references/env-secrets.md](references/env-secrets.md)

### 3. Check Build Artifacts And Config

> Goal: ตรวจ build artifacts และ config ถูกต้อง

1. ตรวจ build command ทำงานได้: `bun run build`, `nitro build`
2. ตรวจ output directory ถูกต้อง: `dist`, `build`, `.next`, `.output`
3. ตรวจ platform config ถูกต้อง: `vercel.json`, `wrangler.jsonc`, `railway.json`
4. ตรวจ `.dockerignore` และ `.gitignore` ครบถ้วน
5. ดูรายละเอียดใน [references/build-artifacts.md](references/build-artifacts.md)

### 4. Check Health And Rollback

> Goal: ตรวจ health checks และ rollback plan

1. ตรวจ health endpoint มีและทำงานได้
2. ตรวจ readiness probes ตั้งค่าถูกต้อง
3. ตรวจ rollback procedure ชัดเจนก่อน deploy
4. ตรวจ backup strategy ตรวจสอบก่อน deploy
5. ดูรายละเอียดใน [references/health-rollback.md](references/health-rollback.md)

### 5. Check Zero-Downtime And Migration

> Goal: ตรวจ zero-downtime strategy และ migration scripts

1. ตรวจ deployment strategy: blue-green, canary, หรือ phased
2. ตรวจ database migration scripts พร้อมและ test แล้ว
3. ตรวจ DNS/CDN config ถูกต้อง
4. ตรวจ SSL certificates ตั้งค่าอัตโนมัติ
5. ดูรายละเอียดใน [references/zero-downtime.md](references/zero-downtime.md)

### 6. Score And Report

> Goal: สรุป deploy readiness score และ go/no-go checklist

1. คำนวณ deploy readiness score จาก [references/deploy-readiness-score.md](references/deploy-readiness-score.md)
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Deploy Readiness Summary: Category, Status, Findings, Score
4. สร้างตาราง Go/No-Go Checklist: Item, Status, Action Required
5. สร้างตาราง Blockers: Blocker, Severity, Action Required
6. แสดง go/no-go recommendation พร้อมเหตุผล
7. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Independence

- ทำ review เท่านั้น ไม่ deploy ระหว่าง review
- ถ้าต้อง deploy ให้ใช้ `run-deploy` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Evidence-Based Findings

- ใช้ `Grep` และ `scan-codebase` สำหรับ verification
- ตรวจ config files และ env files แบบ cross-reference
- จัดลำดับตาม severity: Critical → High → Medium → Low

### 3. Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Deploy readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → No-Go แนะนำให้แก้ก่อน deploy

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Deploy Readiness Summary พร้อม score และ grade
- รายงาน Go/No-Go Checklist พร้อม status
- รายงาน Blockers พร้อม action required
- Go/no-go recommendation พร้อมเหตุผล
- Deploy readiness score พร้อม progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
