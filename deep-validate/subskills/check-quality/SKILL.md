---
name: deep-validate-check-quality
description: Validate quality dimension — readability, consistency, docs, best practices
argument-hint: "[scope]"
related:
  - review-quality
  - report
---

## Goal

ตรวจ quality dimension ของ `/deep-validate` — readability, completeness, consistency, documentation, best practices, naming

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `quality` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings — ไม่ refactor

## Execute

### 1. Check Code Quality

> Goal: คุณภาพโดยรวมตาม standards

1. ทำ `/review-quality` เพื่อตรวจสอบ code quality
2. ตรวจสอบ readability, completeness, consistency
3. ตรวจสอบมี documentation เพียงพอหรือ clear

### 2. Check Conventions

> Goal: สอดคล้องกับ project conventions

1. ตรวจสอบใช้ best practices และไม่มี redundancy
2. ตรวจสอบ naming conventions สม่ำเสมอ
3. บันทึก findings พร้อม severity + evidence

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`
2. ระบุสิ่งที่ดีอยู่แล้วเสมอ

## Rules

- quality findings default severity Medium/Low — ยกเป็น High เมื่อกระทบ maintainability จริง
- ไม่ flag style ที่ formatter/linter จัดการได้แล้ว

## Expected Outcome

- Findings ของ quality dimension พร้อม severity และ evidence
