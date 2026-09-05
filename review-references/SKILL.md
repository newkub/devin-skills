---
name: review-references
description: ตรวจสอบ references ระหว่าง devin global skills และ AGENTS.md ไม่ให้ขาด/ซ้ำ/วน
argument-hint: "[scope]"
related:
  - update-references
  - check-reference
  - list-devin-global-skills
  - check-backward-compatibility
  - scan-codebase
  - delete
  - check-circular-dependencies
---

## Goal

ตรวจสอบ references ภายใน devin global skills, `AGENTS.md`, และ `global_rules.md` ให้ครบถ้วน ถูกต้อง ไม่ขาด ไม่ซ้ำ และไม่วนกลับ

## Scope

ใช้เมื่อต้องตรวจสอบความสัมพันธ์ระหว่าง skills หรือหลังมีการ rename/create/delete skills

## Execute

### 1. Inventory Skills
> Goal: Inventory Skills
ทำตาม [references/inventory-skills.md](references/inventory-skills.md)

### 2. Check AGENTS.md
> Goal: ตรวจสอบ AGENTS md
ทำตาม [references/check-agentsmd.md](references/check-agentsmd.md)

### 3. Check Frontmatter Related
> Goal: ตรวจสอบ Frontmatter Related
ทำตาม [references/check-frontmatter-related.md](references/check-frontmatter-related.md)

### 4. Check In-Body References
> Goal: ตรวจสอบ In Body References
ทำตาม [references/check-in-body-references.md](references/check-in-body-references.md)

### 5. Check Circular Dependencies
> Goal: ตรวจสอบ Circular Dependencies
ทำตาม [references/check-circular-dependencies.md](references/check-circular-dependencies.md)

### 6. Check Global Rules References
> Goal: ตรวจสอบ Global Rules References
ทำตาม [references/check-global-rules-references.md](references/check-global-rules-references.md)

### 7. Score And Report
> Goal: รายงาน Score And Report
คำนวณ score/grade ตาม [references/scoring.md](references/scoring.md) แล้วทำ `/report-table` และ `/suggest-next-action`

## Rules

- ทุก `related` ต้องมี skill ตรงกัน
- ทุก entry ใน `AGENTS.md` ต้องมี skill directory ตรงกัน
- ไม่ circular references
- ไม่ self-references ใน `related`
- skill name ต้องตรง directory name
- ไม่ auto-delete references โดยไม่ถาม
- ห้ามใช้ bold markers — ใช้ backticks สำหรับ emphasis

- ใช้ /check-reference ถ้าจำเป็น
- ใช้ /list-devin-global-skills ถ้าจำเป็น
- ใช้ /check-backward-compatibility ถ้าจำเป็น
- ใช้ /scan-codebase ถ้าจำเป็น

## Expected Outcome

- รายงาน references ทีขาด/ซ้ำ/วน/ล้าหลัง
- `AGENTS.md` sync กับ skills
- `related` ใน frontmatter ถูกต้อง
- ไม่ circular dependencies
- พร้อม action items สำหรับ `/update-references`
