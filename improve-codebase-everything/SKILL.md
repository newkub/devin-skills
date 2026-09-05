---
name: improve-codebase-everything
description: ปรับปรุง codebase ทั้งหมด: UX/UI, SEO, data validation, API, database, security
argument-hint: "[area-or-pattern]"
related:
  - ship
  - improve-uxui
  - improve-seo
  - improve-data-validation
  - improve-api
  - improve-database
  - improve-test-everything
  - improve-review-cli
  - optimize-codebase-everything
  - follow-monorepo
  - run-build
  - run-verify
  - report-table
  - suggest-next-action
---

## Goal

ปรับปรุง codebase ทั้งหมด: UX/UI, SEO, data validation, API, database, security และ platform

## Scope

ใช้กับ monorepo หรือ project ใหญ่ทีต้องการ improve หลาย layer โดย dispatch ไปยัง improve-* skills ทีเหมาะสม

## Execute

### 1. Run Review CLI

> Goal: รู้จุดทีต้องปรับปรุง

1. ทำ `/improve-review-cli` เพื่อ scan codebase ด้วย `tools/review-codebase`
2. วิเคราะห์ findings ตาม domains
3. จัดลำดับ areas ทีต้อง improve

### 2. Improve UX/UI

> Goal: ปรับปรุง user interface และ experience

1. ทำ `/improve-uxui` สำหรับหน้าจอทีจำเป็น
2. Capture before/after screenshots
3. ใช้ `/review-by-stakeholder` เพื่อรับ feedback
4. Implement changes และ validate

### 3. Improve SEO

> Goal: ปรับปรุง SEO

1. ทำ `/improve-seo`
2. ตรวจ meta tags, Open Graph, sitemap, robots
3. Implement fixes ทีละ route

### 4. Improve Data Validation

> Goal: ปรับปรุง validation

1. ทำ `/improve-data-validation`
2. ตรวจ schemas, API inputs, forms
3. เพิ่ม security validation

### 5. Improve API

> Goal: ปรับปรุง API endpoints

1. ทำ `/improve-api`
2. ปรับ performance, caching, error handling
3. ตรวจ security

### 6. Improve Database

> Goal: ปรับปรุง DB

1. ทำ `/improve-database`
2. แก้ slow queries, N+1, indexes
3. ตรวจ migrations

### 7. Improve Tests

> Goal: ปรับปรุง test coverage

1. ทำ `/improve-test-everything`
2. ทำ `/improve-test-coverage` ถ้าจำเป็น
3. เพิ่ม tests สำหรับ critical paths

### 8. Verify And Report

> Goal: ยืนยันว่าทุก area ผ่าน

1. รัน `/run-build`
2. รัน `/run-verify`
3. รัน `/improve-review-cli` อีกครั้ง
4. ทำ `/report-table` สรุป improvements
5. ทำ `/suggest-next-action`

## Rules

### 1. Layered Approach

- ทำทีละ layer: UX/UI → SEO → validation → API → database → tests
- ไม่ทำทุกอย่างพร้อมกัน
- แก้ layer หนึ่ง แล้ว verify ก่อน

### 2. Evidence-Based

- ใช้ review CLI เป็นต้นทาง
- ทุก improvement ต้องมี metrics before/after
- ไม่แก้โดยไม่มีเหตุผล

### 3. Minimal Changes

- แก้เฉพาะ findings ที่ review ระบุ
- ไม่ over-engineer
- ไม่เปลี่ยน architecture ถ้าไม่จำเป็น

### 4. No Regression

- ทุก improvement ต้องผ่าน build, typecheck, lint, tests
- ไม่ลด security
- ไม่ลด performance

## Expected Outcome

- UX/UI ปรับปรุงตาม stakeholder feedback
- SEO ครบถ้วน
- Data validation แข็งแรง
- API มี performance ดีขึ้น
- Database queries ลดลง
- Tests ครอบคลุมมากขึ้น
- Review score ดีขึ้น
