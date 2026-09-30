---
name: read-related
description: อ่านและสรุป skills ที่เกี่ยวข้องแบบ recursive
argument-hint: "[skill-name]"
related:
  - idea-use-skills-relations
  - review-devin-global-harness
  - report
  - suggest-next-action
  - deep-review
---

## Goal

อ่านและสรุป skills ที่เกี่ยวข้องกับงานปัจจุบันแบบ recursive เพื่อเข้าใจ dependencies และหลีกเลี่ยงการซ้ำซ้อน

## Scope

ใช้ก่อนเขียนหรือแก้ไข skill เพื่อรวบรวม context ที่จำเป็น

## Execute

### 1. Read Related Skills

> Goal: อ่าน skills ที่เกี่ยวข้อง

1. ทำ `/review-devin-global-harness` เพื่อสร้าง dependency graph และสรุป skills

### 2. Synthesize And Report

> Goal: รวมผลลัพธ์และรายงาน

1. รวบรวม guidelines และ instructions จาก skills ที่อ่าน
2. ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งกัน
3. ทำ `/report` เพื่อจัดรูปแบบ output
4. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Orchestration Only

- เป็น orchestrator เรียก `/review-devin-global-harness` โดยตรง — ไม่ทำงานซ้ำ
- ไม่ใช้ `/deep-review` เพราะจะซ้ำซ้อนกับการอ่าน related context
- ไม่ duplicate เนื้อหาของ `/review-devin-global-harness`

### 2. Output

- แสดง dependency graph แบบ tree structure
- ระบุ tasks ที่ต้องทำตามลำดับ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้ง

## Expected Outcome

- Dependency graph ของ skills ที่เกี่ยวข้อง
- สรุป tasks และ guidelines ที่ต้องปฏิบัติ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งระหว่าง skills
- แนะนำ action ถัดไป
