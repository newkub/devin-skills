---
name: update-devin-harness
description: อัปเดต global rules, global skills และ global subagents ให้สอดคล้องกัน
related:
  - update-devin-global-rules
  - update-all-devin-global-skills
  - update-devin-global-subagents
  - review-devin-global-subagents
  - list-devin-global-skills
  - list-devin-global-subagents
---

## Goal

ทำให้ `global_rules.md`, `devin global skills`, และ `devin global subagents` มี alignment ทีตรงกัน สอดคล้องกัน และไม่ขัดแย้งกัน

## Scope

ใช้เมื่อต้อง sync ทั้งสาม layer ของ devin ecosystem โดยเฉพาะหลังมีการ rename, merge, หรือสร้าง skills/subagents จำนวนมาก

## Execute

### 1. Inventory All Layers

> Goal: รวบรวมข้อมูลจากทุก layer

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. ทำ `/list-devin-global-skills`
3. ทำ `/list-devin-global-subagents`
4. บันทึก versions, last updated, และ critical rules

### 2. Run Update Workflows

> Goal: อัปเดตแต่ละ layer

1. ทำ `/update-devin-global-rules` เพื่อ sync global rules
2. ทำ `/update-all-devin-global-skills` เพื่อ audit และอัปเดต skills
3. ทำ `/update-devin-global-subagents` เพื่ออัปเดต subagents
4. บันทึก output ของแต่ละ step

### 3. Detect Cross-Layer Misalignment

> Goal: หาความไม่สอดคล้อง

1. เปรียบเทียบ rules จาก global rules vs skills vs subagents
2. ตรวจ references: ชื่อ skills/subagents ใน AGENTS.md, global rules, และ skill `related`
3. หา circular dependencies หรือ broken references
4. ระบุ skills/subagents ทีล้าหลัง global rules

### 4. Resolve Conflicts

> Goal: แก้ไขความขัดแย้ง

1. ถ้า global rules กับ skill ขัดแย้ง → ปรับ skill หรือ update global rules
2. ถ้า subagent เรียก skill ทีไม่มี → อัปเดต subagent
3. ถ้า skill อ้างอิง rules ทีไม่มี → เพิ่มหรือลบ reference
4. ใช้ `/consider-use-in-another-skills` เพื่อหา overlaps

### 5. Validate Harness

> Goal: ตรวจสอบความสมบูรณ์

1. ทำ `/validate` กับ global rules
2. ตรวจ frontmatter ของ skills ทั้งหมด
3. ตรวจ `AGENT.md` ของ subagents
4. รัน `/check-reference`
5. รัน `git diff --check`

### 6. Report

> Goal: สรุป alignment status

1. ทำ `/report-markdown-table` คอลัมน์: Layer, Status, Changes, Issues
2. ระบุสิ่งที่ยังค้าง
3. ทำ `/suggest-next-action`

## Rules

### 1. Run In Order

- อัปเดต global rules ก่อน skills ก่อน subagents
- ถ้ามี dependency loop → แก้ loop ก่อน
- ไม่ข้าม layer

### 2. Minimal Scope

- แก้เฉพาะสิ่งที่ขัดแย้งหรือล้าหลัง
- ไม่เปลี่ยนโครงสร้างใหญ่ถ้าไม่จำเป็น
- เก็บ intent เดิมของแต่ละ layer

### 3. Cross-Reference Integrity

- `name` ใน frontmatter ต้องตรง directory
- `related` ต้องมีอยู่จริง
- `AGENTS.md` ต้อง sync

### 4. Backup

- สำรอง `global_rules.md` ก่อนแก้ไข
- สำรอง `AGENTS.md` ถ้ามีการเปลี่ยนแปลงใหญ่
- ใช้ `git commit` ทีละ layer

## Expected Outcome

- global rules, global skills, global subagents สอดคล้องกัน
- ไม่มี broken references
- ไม่มี rules ซ้ำซ้อนหรือขัดแย้ง
- มีรายงาน alignment status
- ผ่าน validation
