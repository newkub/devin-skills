---
name: review-references
description: ตรวจสอบ references ระหว่าง devin global skills และ AGENTS.md ไม่ให้ขาด/ซ้ำ/วน
related:
  - update-references
  - check-reference
  - list-devin-global-skills
  - check-backward-compatibility
  - scan-codebase
---

## Goal

ตรวจสอบ references ภายใน devin global skills, `AGENTS.md`, และ `global_rules.md` ให้ครบถ้วน ถูกต้อง ไม่ขาด ไม่ซ้ำ และไม่วนกลับ

## Scope

ใช้เมื่อต้องตรวจสอบความสัมพันธ์ระหว่าง skills หรือหลังมีการ rename/create/delete skills

## Execute

### 1. Inventory Skills

> Goal: รวบรวม skills ทีมีอยู่

1. ดูรายละเอียดใน [references/inventory-skills.md](references/inventory-skills.md)
2. บันทึก findings พร้อม severity และ evidence

### 2. Check AGENTS.md

> Goal: ตรวจ catalog ไม่ให้ขาดหรือล้าหลัง

1. ดูรายละเอียดใน [references/check-agentsmd.md](references/check-agentsmd.md)
2. บันทึก findings พร้อม severity และ evidence

### 3. Check Frontmatter Related

> Goal: ตรวจ `related` ใน frontmatter

1. ดูรายละเอียดใน [references/check-frontmatter-related.md](references/check-frontmatter-related.md)
2. บันทึก findings พร้อม severity และ evidence

### 4. Check In-Body References

> Goal: ตรวจอ้างอิงในเนื้อหา

1. ดูรายละเอียดใน [references/check-in-body-references.md](references/check-in-body-references.md)
2. บันทึก findings พร้อม severity และ evidence

### 5. Check Circular Dependencies

> Goal: ไม่ให้ skills อ้างอิงกันเป็นวงกลม

1. ดูรายละเอียดใน [references/check-circular-dependencies.md](references/check-circular-dependencies.md)
2. บันทึก findings พร้อม severity และ evidence

### 6. Check Global Rules References

> Goal: ตรวจสอบ global rules

1. ดูรายละเอียดใน [references/check-global-rules-references.md](references/check-global-rules-references.md)
2. บันทึก findings พร้อม severity และ evidence

### 7. Report

> Goal: สรุปผล

1. ดูรายละเอียดใน [references/report.md](references/report.md)
2. บันทึก findings พร้อม severity และ evidence

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
- พร้อม action items สำหรับ `/update-references`
