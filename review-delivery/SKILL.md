---
name: review-delivery
description: "Review delivery: docs, DX, efficiency, config, CI/CD, infra, performance, security"
argument-hint: "[scope]"
related:
  - review-performance
  - review-seo
  - review-security
  - review-quality
  - scan-codebase
  - deep-analyze
  - report
  - run-watch
  - run-review
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

> Goal: เตรียม context และสแกน delivery setup
1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/deep-review` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation And Web Presence

> Goal: ตรวจ documentation และ web presence
- ตรวจ documentation ใน `references/docs.md`
- ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ แล้วรวม findings

### 3. Experience And Insights

> Goal: ตรวจ DX และ analytics
- ตรวจ DX ใน `references/dx.md`
- ตรวจ analytics ใน `references/analytics.md`

### 4. Quality

> Goal: ตรวจ testing และ PR process
- ตรวจ testing ใน `references/testing.md`
- ตรวจ PR ใน `references/pr-review.md`

### 5. Operations

> Goal: ตรวจ logging, debugging และ versioning
- ตรวจ logging และ debugging ใน `references/logging-debugging.md`
- ตรวจ versioning ใน `references/versioning.md`

### 6. Build And Configuration

> Goal: ตรวจ build efficiency และ config health
- ตรวจ build efficiency ใน `references/efficiency.md`
- ตรวจ config health ใน `references/config.md`

### 7. Infrastructure And Pipeline

> Goal: ตรวจ CI/CD pipeline และ infrastructure
- ตรวจ CI/CD pipeline ใน `references/ci-cd.md`
- ตรวจ infrastructure ใน `references/infrastructure.md`

### 8. Performance And Security

> Goal: ตรวจ performance และ security
- ทำ `/review-performance` แล้วดู `references/performance.md` สำหรับรายละเอียด
- ตรวจ security ใน `references/security.md`

### 9. Validate And Report

> Goal: validate findings และรายงาน
1. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity ตาม `references/scoring.md`
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report` และ `/suggest-next-action`

## Rules

- ข้าม dimension ใด ถ้า project ไม่มี — ดู criteria ในแต่ละ reference
- ทุก finding ต้องมี file path และ line number (delivery)
- ใช้ tools สำหรับ verification ไม่เดา
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- คำนวณ score เป็น percentage (0-100) ตาม `references/scoring.md` แล้วเปรียบเทียบ before/after
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (delivery)
- ใช้ `/report` สำหรับรายงาน findings, score, actions

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-quality ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps

1. baseline: run history จริง — duration/job, cache hit rate, flake rate
2. caching: lockfile keys, build cache, `--frozen-lockfile`
3. parallelism: matrix เฉพาะ axes จำเป็น, concurrency cancel, `needs:` graph, timeouts ครบ
4. reliability: path filters, flaky root-cause fixes
5. security: pin SHAs, least-privilege permissions, OIDC แทน long-lived keys
6. docker images: multi-stage, layer cache, minimal base
## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-watch ถ้าจำเป็น

## Expected Outcome

- ตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority (delivery)
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
