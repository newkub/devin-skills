---
name: update-devin-global-rules
description: ทำให้ global rules สอดคล้องกับ skills และ global subagents ไม่ขัดแย้ง
related:
  - update-all-devin-global-skills
  - update-devin-global-subagents
  - use-in-another-skills
  - follow-global-rules
  - report-idea
  - list-devin-global-skills
  - scan-codebase
---

## Goal

ตรวจสอบ วิเคราะห์ และอัปเดต `global_rules.md` ให้สอดคล้องกับ `devin global skills` และ `devin global subagents` ลดความซ้ำซ้อน และไม่ให้เกิดข้อขัดแย้ง

## Scope

ใช้เมื่อ global rules ดูอัปเดตช้ากว่า skills/subagents หรือเมื่อพบ rules ซ้ำซ้อนระหว่าง layers

## Execute

### 1. Inventory Global Rules

> Goal: เข้าใจ global rules ปัจจุบัน

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. แยก sections: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. สร้าง index ของ rules ทีมีอยู่

### 2. Inventory Skills And Subagents

> Goal: รวบรวม rules ทีกระจายอยู่

1. ทำ `/list-devin-global-skills` หรือ `/scan-codebase`
2. ทำ `/list-devin-global-subagents`
3. อ่าน `SKILL.md` และ `AGENT.md` ทีมี rules
4. ระบุ rules ทีซ้ำกับ global rules หรือควรย้ายขึ้นไป global

### 3. Detect Misalignment And Duplication

> Goal: หาจุดขัดแย้งและซ้ำซ้อน

1. เปรียบเทียบ rules ใน global vs skills vs subagents
2. ระบุ:
   - `duplicate` — กฎซ้ำทั้งโครงสร้างและ intent
   - `conflict` — กฎทีสั่นให้ทำต่างกัน
   - `missing-in-global` — กฎควรอยู่ global แต่ยังอยู่ใน skills
   - `outdated` — global rules ล้าหลัง skills
3. ให้คะแนนความเสี่ยง: High/Medium/Low

### 4. Propose Move To Global

> Goal: วางแผนย้ายกฎขึ้น global

1. สำหรับ rules ทีซ้ำหรือควรเป็น global → สรุป draft สำหรับ `global_rules.md`
2. ระบุ skills/subagents ทีต้องลบหรืออ้างอิงแทน
3. ทำ `/report-table` คอลัมน์: Rule, Source, Target, Risk, Action
4. ถ้าต้องสร้าง rule ใหม่ → ทำ `/report-idea`

### 5. Apply Changes

> Goal: อัปเดต files

1. สำรอง `global_rules.md` ก่อนแก้ไข
2. แก้ไข `global_rules.md` โดยใช้ `edit` หรือ `write` ตาม draft
3. หรือใช้ `/follow-global-rules` เพื่อ sync global rules กับ skills
4. อัปเดต skills ทีมี rules ซ้ำโดยลบหรือเปลี่ยนเป็น reference
5. อัปเดต subagents ที่จำเป็น
6. ใช้ `/update-references` เพื่อ sync

### 6. Validate Alignment

> Goal: ตรวจสอบว่าทุก layer สอดคล้อง

1. ทำ `/deep-validate` สำหรับ global rules และ skills
2. ตรวจหา circular references
3. ตรวจ line count ไม่เกิน 250
4. ตรวจชื่อ skills/subagents ตรง directory

### 7. Report

> Goal: สรุปผล

1. ทำ `/report-table` คอลัมน์: Layer, Status, Changes
2. ระบุ rules ทีย้าย, ลบ, หรือเพิ่ม
3. ทำ `/suggest-next-action`

## Rules

### 1. Preserve Skills Autonomy

- ย้ายขึ้น global เฉพาะ rules ทีทุก skill/subagent ควรทำ
- เก็บ skill-specific rules ไว้ใน skill
- ไม่ลบ context เฉพาะของ skill

### 2. No Silent Overwrite

- สำรอง `global_rules.md` ก่อนแก้ไข
- ทำ dry run ก่อนย้าย rules จากหลาย files
- ถาม user ก่อนลบ rules จาก skills

### 3. Conflict Resolution

- ถ้ากฎขัดแย้ง → ให้ global rules มีลำดับสูงสุด
- ถ้า skills ต้องการ exception → ระบุ condition ชัดเจน
- ไม่ให้ subagents ขัดแย้งกับ global rules

### 4. Track Changes

- เก็บบันทึก rules ทีย้าย/ลบ/เพิ่ม
- อัปเดต `AGENTS.md` ถ้ามี skill ใหม่
- อัปเดต `related` ใน frontmatter ของ skills ที่เกี่ยวข้อง

- ใช้ /update-all-devin-global-skills ถ้าจำเป็น
- ใช้ /update-devin-global-subagents ถ้าจำเป็น
- ใช้ /use-in-another-skills ถ้าจำเป็น

## Expected Outcome

- `global_rules.md` สอดคล้องกับ skills และ subagents
- ไม่มี rules ซ้ำซ้อนระหว่าง layers
- ไม่มีข้อขัดแย้งระหว่าง global rules และ skill rules
- มีรายงานการเปลี่ยนแปลง
- ผ่าน validation
