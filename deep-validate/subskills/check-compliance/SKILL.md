---
name: deep-validate-check-compliance
description: Validate compliance dimension — requirements fit, conventions, regulatory
argument-hint: "[scope]"
related:
  - review-compliance
  - report
---

## Goal

ตรวจ compliance dimension ของ `/deep-validate` — ความเหมาะสมกับ requirements/context, project conventions (`AGENTS.md`) และ regulatory requirements

## Scope

- ใช้เมื่อ `/deep-validate` dispatch มาที่ dimension `compliance` หรือเรียกเดี่ยวๆ
- Read-only: บันทึก findings — ไม่แก้ไข

## Execute

### 1. Check Requirements Fit

> Goal: solution เหมาะกับ requirements และ context

1. ตรวจสอบความเหมาะสมกับ requirements หรือ context
2. ตรวจสอบความเหมาะสมกับ capabilities หรือ constraints
3. ตรวจสอบความเหมาะสมกับ scalability หรือ maintainability

### 2. Check Conventions And Regulatory

> Goal: สอดคล้องกับ standards ที่บังคับใช้

1. ตรวจสอบ compliance กับ project conventions (`AGENTS.md`)
2. ตรวจสอบ compliance กับ regulatory requirements ถ้ามี — ทำ `/review-compliance` ถ้าต้องการ deep pass
3. บันทึก findings พร้อม severity + evidence

### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Severity`, `Location`, `Recommendation`

## Rules

- regulatory violation = Critical/High; convention drift = Medium/Low
- ระบุ standard/rule ที่ใช้เป็นเกณฑ์ในแต่ละ finding

## Expected Outcome

- Findings ของ compliance dimension พร้อม severity และ evidence
