---
name: review-references
description: ตรวจสอบ references ระหว่าง devin global skills และ AGENTS.md ไม่ให้ขาด/ซ้ำ/วน
related:
  - update-reference
  - check-reference
  - list-devin-global-skills
  - scan-codebase
  - update-all-devin-global-skills
---

## Goal

ตรวจสอบ references ภายใน devin global skills, `AGENTS.md`, และ `global_rules.md` ให้ครบถ้วน ถูกต้อง ไม่ขาด ไม่ซ้ำ และไม่วนกลับ

## Scope

ใช้เมื่อต้องตรวจสอบความสัมพันธ์ระหว่าง skills หรือหลังมีการ rename/create/delete skills

## Execute

### 1. Inventory Skills

> Goal: รวบรวม skills ทีมีอยู่

1. ทำ `/list-devin-global-skills` หรือ `/scan-codebase`
2. บันทึก `name` และ `directory` ของแต่ละ skill
3. อ่าน `AGENTS.md` เพื่อดู catalog ปัจจุบัน

### 2. Check AGENTS.md

> Goal: ตรวจ catalog ไม่ให้ขาดหรือล้าหลัง

1. เปรียบเทียบรายการ skills กับ `AGENTS.md`
2. ระบุ skills ทีไม่อยู่ใน `AGENTS.md`
3. ระบุ entries ใน `AGENTS.md` ทีไม่มี skill directory ตรงกัน
4. ตรวจ category ว่าสอดคล้องกับ prefix/name

### 3. Check Frontmatter Related

> Goal: ตรวจ `related` ใน frontmatter

1. อ่าน `SKILL.md` แต่ละ skill
2. ดึง `related` list
3. ตรวจว่าแต่ละ `related` skill มีอยู่จริง
4. ระบุ `related` ทีชี้ไปยัง skill ทีไม่มีอยู่

### 4. Check In-Body References

> Goal: ตรวจอ้างอิงในเนื้อหา

1. ค้นหา backtick references เช่น `/skill-name`, `skill-name`, `update-reference`
2. ระบุ references ทีไม่มี skill ตรงกัน
3. ตรวจ `/command-name` ว่ามี skill หรือ command จริง
4. บันทึก false positives (เช่น tools/commands ทั่วไป)

### 5. Check Circular Dependencies

> Goal: ไม่ให้ skills อ้างอิงกันเป็นวงกลม

1. สร้าง graph จาก `related` และ in-body references
2. หา cycles (เช่น A → B → A)
3. หา self-references
4. รายงาน cycles พร้อม path

### 6. Check Global Rules References

> Goal: ตรวจสอบ global rules

1. อ่าน `global_rules.md`
2. ระบุ references ไปยัง skills ทีไม่มีอยู่
3. ระบุ skills ทีอ้างอิง `global_rules.md` แต่ไม่มี rule ตรงกัน

### 7. Report

> Goal: สรุปผล

1. ทำ `/report-table` คอลัมน์: Type, Source, Target, Severity, Suggested Action
2. เรียงตาม severity: Critical → High → Medium → Low
3. ระบุ auto-fixable vs manual
4. ทำ `/suggest-next-action`

## Rules

### 1. Reference Validation

- ทุก `related` ต้องมี skill ตรงกัน
- ทุก entry ใน `AGENTS.md` ต้องมี skill directory ตรงกัน
- ไม่ circular references
- ไม่ self-references ใน `related`

### 2. Prefix Consistency

- skill name ต้องตรง directory name
- `AGENTS.md` category ต้องสอดคล้องกับ name prefix
- เปลี่ยนชื่อ skill ต้อง update references ทั้งหมด

### 3. Safe Reporting

- ไม่ auto-delete references โดยไม่ถาม
- แยก false positives เช่น generic tools/commands
- รายงาน evidence พร้อม file path และ line

### 4. Auto-Fix Cautions

- auto-fix ได้เฉพาะ `AGENTS.md` หรือ `related` ทีชัดเจน
- ถ้ามีหลายทางเลือก ให้ถาม user
- เก็บ backup ก่อนแก้ไข

## Expected Outcome

- รายงาน references ทีขาด/ซ้ำ/วน/ล้าหลัง
- `AGENTS.md` sync กับ skills
- `related` ใน frontmatter ถูกต้อง
- ไม่ circular dependencies
- พร้อม action items สำหรับ `/update-reference`
