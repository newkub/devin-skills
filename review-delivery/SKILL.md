---
name: review-delivery
description: "Review delivery: docs, DX, efficiency, config, CI/CD, infra, performance, security"
related:
  - review-performance
  - review-seo
  - review-security
  - review-quality
  - list-ci-configs
  - scan-codebase
  - deep-analyze
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everything` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation And Web Presence

- ตรวจ documentation ใน `references/docs.md`
- ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ แล้วรวม findings

### 3. Experience And Insights

- ตรวจ DX ใน `references/dx.md`
- ตรวจ analytics ใน `references/analytics.md`

### 4. Quality

- ตรวจ testing ใน `references/testing.md`
- ตรวจ PR ใน `references/pr-review.md`

### 5. Operations

- ตรวจ logging และ debugging ใน `references/logging-debugging.md`
- ตรวจ versioning ใน `references/versioning.md`

### 6. Build And Configuration

- ตรวจ build efficiency ใน `references/efficiency.md`
- ตรวจ config health ใน `references/config.md`

### 7. Infrastructure And Pipeline

- ตรวจ CI/CD pipeline ใน `references/ci-cd.md`
- ตรวจ infrastructure ใน `references/infrastructure.md`

### 8. Performance And Security

- ทำ `/review-performance` แล้วดู `references/performance.md` สำหรับรายละเอียด
- ตรวจ security ใน `references/security.md`

### 9. Validate And Report

1. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity ตาม `references/scoring.md`
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

- ข้าม dimension ใด ถ้า project ไม่มี — ดู criteria ในแต่ละ reference
- ทุก finding ต้องมี file path และ line number
- ใช้ tools สำหรับ verification ไม่เดา
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- คำนวณ score เป็น percentage (0-100) ตาม `references/scoring.md` แล้วเปรียบเทียบ before/after
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ `/report-table` สำหรับรายงาน findings, score, actions

## Expected Outcome

- ตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
