---
name: review-update
description: Review drift between current and target state to determine update priority order
related:
  - update-version-latest
  - update-runtime-latest
  - update-dependencies-latest
  - check-should-update
  - report-table
  - scan-codebase
  - report
---

## Goal

Review drift ระหว่าง current state และ target state เพื่อระบุสิ่งที่ต้อง update และจัดลำดับ priority

## Scope

ใช้ก่อนเรียก `update-*` skills เพื่อทำความเข้าใจ drift และจัดลำดับการ update ครอบคลุม dependencies, runtimes, rules, docs, config, tests, features, subagents ไม่รวมการ update จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project state และ drift scope ก่อน review

1. ทำ `/check-should-update`
2. ทำ `/scan-codebase`
3. อ่าน `AGENTS.md`
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze Dependency And Runtime Drift

> Goal: ระบุ dependency และ runtime version drift

1. ทำตาม `references/dependency-drift.md`

### 3. Analyze Docs Drift

> Goal: ระบุ docs ที่ล้าหลัง source code

1. ทำตาม `references/docs-drift.md`

### 4. Analyze Config Drift

> Goal: ระบุ config และ gitignore drift

1. ทำตาม `references/config-drift.md`

### 5. Analyze Rules Drift

> Goal: ระบุ rules, ast-grep rules, devin-project-rules drift

1. ทำตาม `references/rules-drift.md`

### 6. Analyze Test Drift

> Goal: ระบุ test suite drift

1. ทำตาม `references/test-drift.md`

### 7. Analyze Features And Subagents Drift

> Goal: ระบุ features และ subagents drift

1. ทำตาม `references/features-drift.md`

### 8. Calculate Update Priority

> Goal: จัดลำดับ update priority ตาม drift severity และ dependencies

1. ทำตาม `references/update-priority.md`

### 9. Report

> Goal: รายงาน drift report และ update priority order

1. ทำตาม `references/scoring.md`
2. ทำ `/report` พร้อม `/report-table`
3. สร้างตาราง Drift Report และ Update Priority
4. ทำ `/suggest-next-action`

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่ update ไฟล์ระหว่าง review
- แยก review process จาก update process
- ถ้าต้อง update ให้ทำ `update-*` skills หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ evidence
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Drift Severity

- Critical: dependency มี security vulnerability, docs ผิดพื้นฐาน, rules ขาด critical coverage
- High: major version drift, docs ล้าหลัง source code มาก, rules ไม่ครอบคลุม tools
- Medium: minor/patch drift, docs ล้าหลังเล็กน้อย, config ไม่สอดคล้องบางส่วน
- Low: cosmetic drift, minor inconsistency

### 4. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Drift Report พร้อม severity และ evidence
- รายงานตาราง Update Priority พร้อม recommended update skills
- Update health score พร้อม grade
- ไม่มีการ update ไฟล์จริง — เป็น review เท่านั้น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
