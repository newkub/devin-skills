---
name: read-related
description: อ่านและสรุป skills ที่เกี่ยวข้องแบบ recursive
argument-hint: "[skill-name]"
related:
  - check-skills-related
  - report-table
  - suggest-next-action
  - review-quality
---

## Goal

อ่านและสรุป skills ที่เกี่ยวข้องกับงานปัจจุบันแบบ recursive เพื่อเข้าใจ dependencies และหลีกเลี่ยงการซ้ำซ้อน

## Scope

ใช้ก่อนเขียนหรือแก้ไข skill เพื่อรวบรวม context ที่จำเป็น

## Execute

### 1. Read Related Skills

> Goal: อ่าน skills ที่เกี่ยวข้อง

1. ทำ `/check-skills-related` เพื่อสร้าง dependency graph และสรุป skills

### 2. Synthesize And Report

> Goal: รวมผลลัพธ์และรายงาน

1. รวบรวม guidelines และ instructions จาก skills ที่อ่าน
2. ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งกัน
3. ทำ `/report-table` เพื่อจัดรูปแบบ output
4. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Orchestration Only

- เป็น orchestrator เรียก `/check-skills-related` โดยตรง — ไม่ทำงานซ้ำ
- ไม่ใช้ `/review-quality` เพราะจะซ้ำซ้อนกับการอ่าน related context
- ไม่ duplicate เนื้อหาของ `/check-skills-related`

### 2. Output

- แสดง dependency graph แบบ tree structure
- ระบุ tasks ที่ต้องทำตามลำดับ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้ง

## Expected Outcome

- Dependency graph ของ skills ที่เกี่ยวข้อง
- สรุป tasks และ guidelines ที่ต้องปฏิบัติ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งระหว่าง skills
- แนะนำ action ถัดไป
