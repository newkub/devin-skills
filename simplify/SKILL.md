---
name: simplify
description: ลดความซับซ้อนของ content code architecture และ workflows
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - update-references
---

## Goal

ลดความซับซ้อนของ content, code, architecture, และ workflows

## Scope

ใช้สำหรับทุกการลดความซับซ้อนใน project

## Execute

### 1. Analyze

> Goal: Analyze

วิเคราะห์ความซับซ้อนก่อนลงมือ

1. ระบุสิ่งที่ซับซ้อนเกินไป: functions ยาว, nested logic, duplication, abstractions ที่ไม่จำเป็น
2. ถ้าไม่พบปัญหา → stop และ report

### 2. Simplify

> Goal: Simplify

ลดความซับซ้อน

1. แบ่ง functions ยาว, ลด nested logic, ใช้ early return
2. ลด duplication, แยก concerns, ปรับ naming
3. ลบ code, abstractions และ hard code ที่ไม่จำเป็น
4. ถ้ามี file operations → ทำ `/update-references`

## Rules

- ใช้ minimal changes เสมอ
- การเปลี่ยนแปลงต้องไม่ทำลาย functionality
- ถ้า fail ที่ step ไหน → stop และ report พร้อมสาเหตุ
- ลดความซ้ำซ้อนได้เฉพาะเมื่อไม่สูญเสีย context เนื้อหาหลักต้องยังอยู่ครบ

## Expected Outcome

- ความซับซ้อนลดลง
- Code อ่านง่าย ฟังก์ชันสั้นชัดเจน
- ไม่มีสิ่งที่ไม่จำเป็นเหลืออยู่