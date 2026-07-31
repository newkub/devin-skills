---
name: read-related
description: อ่านและสรุป skills และ workflows ที่เกี่ยวข้องแบบ recursive
---

## Goal

อ่านและสรุป skills และ workflows ที่เกี่ยวข้องกับงานปัจจุบันแบบ recursive เพื่อเข้าใจ dependencies และหลีกเลี่ยงการซ้ำซ้อน

## Scope

ใช้ก่อนเขียนหรือแก้ไข workflow/skill เพื่อรวบรวม context ที่จำเป็น — ไม่ทับซ้อนกับ `/read-related-skills` หรือ `/read-related-workflows` เพราะเป็น orchestrator เรียกทั้งสอง

## Execute

### 1. Read Related Workflows

อ่าน workflows ที่เกี่ยวข้อง

> Goal: รู้ dependencies และขั้นตอนของ workflows ทั้งหมด

1. ทำ `/read-related-workflows` เพื่อสร้าง dependency graph และสรุป workflows

### 2. Read Related Skills

อ่าน skills ที่เกี่ยวข้อง

> Goal: รู้ guidelines และ instructions ของ skills ทั้งหมด

1. ทำ `/read-related-skills` เพื่อสร้าง dependency graph และสรุป skills

### 3. Synthesize And Report

รวมผลลัพธ์และรายงาน

> Goal: ผู้ใช้ได้ภาพรวมของ related context พร้อมดำเนินการต่อ

1. รวม dependency graphs จาก workflows และ skills
2. ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งกัน
3. ทำ `/report-format-table` เพื่อจัดรูปแบบ output
4. ทำ `/suggest-next-action` เพื่อแนะนำ step ถัดไป

## Rules

### 1. Orchestration Only

- เป็น orchestrator เรียก `/read-related-skills` และ `/read-related-workflows` โดยตรง — ไม่ทำงานของทั้งสองซ้ำ
- ไม่ใช้ `/improve-redundancy` เพราะจะซ้ำซ้อนกับการอ่าน related context
- ไม่ duplicate เนื้อหาของ `/read-related-skills` หรือ `/read-related-workflows`

### 2. Output

- แสดง dependency graph แบบ tree structure
- ระบุ tasks ที่ต้องทำตามลำดับ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้ง

## Expected Outcome

- Dependency graph ของ workflows และ skills ที่เกี่ยวข้อง
- สรุป tasks และ guidelines ที่ต้องปฏิบัติ
- ระบุสิ่งที่ซ้ำซ้อนหรือขัดแย้งระหว่าง skills/workflows
- แนะนำ action ถัดไป
