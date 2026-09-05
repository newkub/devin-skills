---
name: review-refactor
description: Review codebase before refactor to establish baseline and identify refactor targets
argument-hint: "[scope]"
related:
  - deep-review
  - review-quality
  - report
  - report-table
  - suggest-next-action
  - refactor
  - refactor-to-single-responsibility
---

## Goal

Review codebase BEFORE refactor to establish baseline metrics and identify prioritized refactor targets

## Scope

ใช้ก่อนเรียก `refactor`, `refactor-to-single-responsibility`, หรือ `refactor-workspace` เพื่อระบุเป้าหมาย refactor ครอบคลุม SRP violations, long files, function quality, imports/exports, package boundaries, code smells, dead code, anti-patterns ไม่รวมการ refactor จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure, tools และ scope ก่อน review

1. ทำตาม `references/prepare.md`

### 2. Analyze SRP Violations

> Goal: ระบุ units ที่ทำหลายหน้าที่

1. ทำตาม `references/srp-violations.md`

### 3. Analyze Long Files

> Goal: ระบุไฟล์ที่ยาวเกิน threshold

1. ทำตาม `references/long-files.md`

### 4. Analyze Function Quality

> Goal: ระบุ functions ที่มี quality issues

1. ทำตาม `references/function-quality.md`

### 5. Analyze Imports And Exports

> Goal: ระบุ import/export complexity

1. ทำตาม `references/imports-exports.md`

### 6. Analyze Package Boundaries

> Goal: ระบุ package/module boundary issues

1. ทำตาม `references/package-boundaries.md`

### 7. Analyze Code Smells And Dead Code

> Goal: ระบุ code smells, dead code, anti-patterns

1. ทำ `/deep-review`
2. ทำ `/review-quality`
3. รัน `knip` และ `jscpd`
4. บันทึก findings

### 8. Establish Baseline Metrics

> Goal: สร้าง baseline metrics table ก่อน refactor

1. ทำตาม `references/baseline-metrics.md#metrics-table-format`

### 9. Prioritize Refactor Targets

> Goal: จัดลำดับ refactor targets ตาม effort และ impact

1. ทำตาม `references/baseline-metrics.md#priority-formula`

### 10. Report

> Goal: รายงาน baseline และ refactor targets

1. ทำตาม `references/scoring.md`
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Baseline Metrics และ Refactor Targets
4. แสดง refactor health score
5. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก refactor process
- ถ้าต้อง refactor ให้ทำ `refactor`, `refactor-to-single-responsibility`, หรือ `refactor-workspace` หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Severity Classification

- Critical: circular dependency, cross-layer import, SRP violation ใน critical path, dead code ใน production path
- High: long file >250 lines, function >50 lines, parameter >4, high coupling, high duplication
- Medium: moderate coupling, code smell, naming inconsistency, 4-5 top-level symbols, pattern overuse ที่ซับซ้อนเกินจำเป็น
- Low: minor naming, cosmetic improvement, unused export ใน non-critical path

### 4. Baseline Metrics Scoring

- แต่ละ metric มีน้ำหนักเท่ากัน
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Refactor health score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Effort And Impact

- Effort: low (1 file, <30 min), medium (2-5 files, 30-120 min), high (>5 files, >120 min)
- Impact: critical (blocking production), high (core functionality at risk), medium (code quality), low (cosmetic)
- Priority order: high impact + low effort > high impact + high effort > low impact + any effort

### 6. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน Baseline Metrics
- รายงาน Refactor Targets
- Refactor health score
- ไม่มีการแก้ไข code
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
