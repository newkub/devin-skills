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
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

> Goal: เตรียม And Scan
1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/deep-review` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation And Web Presence

> Goal: Documentation And Web Presence
- ตรวจ documentation ใน `references/docs.md`
- ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ แล้วรวม findings

### 3. Experience And Insights

> Goal: Experience And Insights
- ตรวจ DX ใน `references/dx.md`
- ตรวจ analytics ใน `references/analytics.md`

### 4. Quality

> Goal: Quality
- ตรวจ testing ใน `references/testing.md`
- ตรวจ PR ใน `references/pr-review.md`

### 5. Operations

> Goal: Operations
- ตรวจ logging และ debugging ใน `references/logging-debugging.md`
- ตรวจ versioning ใน `references/versioning.md`

### 6. Build And Configuration

> Goal: สร้าง And Configuration
- ตรวจ build efficiency ใน `references/efficiency.md`
- ตรวจ config health ใน `references/config.md`

### 7. Infrastructure And Pipeline

> Goal: Infrastructure And Pipeline
- ตรวจ CI/CD pipeline ใน `references/ci-cd.md`
- ตรวจ infrastructure ใน `references/infrastructure.md`

### 8. Performance And Security

> Goal: Performance And Security
- ทำ `/review-performance` แล้วดู `references/performance.md` สำหรับรายละเอียด
- ตรวจ security ใน `references/security.md`

### 9. Validate And Report

> Goal: ยื่นยัน And Report
1. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity ตาม `references/scoring.md`
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report` และ `/suggest-next-action`

## Rules

- ข้าม dimension ใด ถ้า project ไม่มี — ดู criteria ในแต่ละ reference
- ทุก finding ต้องมี file path และ line number
- ใช้ tools สำหรับ verification ไม่เดา
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- คำนวณ score เป็น percentage (0-100) ตาม `references/scoring.md` แล้วเปรียบเทียบ before/after
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ `/report` สำหรับรายงาน findings, score, actions

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-quality ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: optimize-ci, optimize-docker

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-optimize-ci.md` — ลดเวลาและต้นทุน CI pipeline ด้วย cache, matrix tuning, path filters และ job splitting
- `references/fix-optimize-docker.md` — ลดขนาดและเวลา build ของ Docker image ด้วย multi-stage, layer cache และ base image tuning

## Verify

> ทำ section นี้เมื่อต้องการ verify email deliverability ของ domain/service (merged from: verify-email-deliverability)

1. ทำตาม `references/verify-email-deliverability.md`
2. ใช้ `/report` สรุป SPF, DKIM, DMARC, service config, test send
3. ถ้า broken → ระบุ exact DNS record values ที่ user ต้องใส่

## Expected Outcome

- ตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

