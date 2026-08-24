---
name: improve-rules
description: ปรับปรุงคุณภาพ .devin/rules และ ast-grep rules ให้ถูกต้อง ครบถ้วน และไม่ซ้ำซ้อน
---

## Goal

ปรับปรุง rules ทั้งใน `.devin/rules/` และ root `rules/` ให้ถูกต้อง ไม่ซ้ำซ้อน และสอดคล้องกัน

## Scope

ใช้สำหรับ project ที่มี `.devin/rules/`, `rules/`, หรือ `sgconfig.yml`

## Execute

### 1. Scan Existing Rules

> Goal: ค้นหา rules ทั้งหมด
> Goal: รู้ scope และปัญหาของ rules ปัจจุบัน

1. ใช้ `/scan-codebase` ใน `.devin/rules/` และ `rules/`
2. ระบุ duplicate rules (เช่น `import-alias` vs `import-aliases`)
3. ระบุ rules ทีขาด frontmatter หรือ metadata ไม่ครบ
4. บันทึก findings

### 2. Check Alignment

> Goal: ตรวจสอบความสอดคล้อง
> Goal: ระบุ misalignment และ gaps

1. เปรียบเทียบ `.devin/rules` กับ ast-grep `rules/`
2. ตรวจสอบว่า frontmatter ถูกต้อง (`trigger: always_on`, `model_decision`, `glob`)
3. ตรวจสอบ filenames ใช้ kebab-case
4. ตรวจสอบ `ruleDirs` ใน `sgconfig.yml`

### 3. Fix Issues

> Goal: แก้ไขปัญหาทีพบ
> Goal: rules ถูกต้อง ไม่ซ้ำ และสอดคล้อง

1. ลบ duplicate rules หลัง user confirm
2. เพิ่ม missing rules ตาม `.devin/rules`
3. แก้ frontmatter ให้ถูกต้อง
4. อัปเดต `sgconfig.yml` ให้ match directory structure

### 4. Validate

> Goal: ตรวจสอบผลลัพธ์
> Goal: rules ผ่าน scan และ validation

1. รัน `ast-grep scan` หรือ `bun run scan`
2. ทำ `/validate` เพื่อ verify rule files
3. ทำ `/check-reference` เพื่อตรวจ broken references

### 5. Report

> Goal: สรุปการปรับปรุง
> Goal: รายงานผลและ next actions

1. รายงาน rules ทีแก้ไข
2. รายงาน rules ทียังเหลือ
3. แนะนำ next actions

## Rules

### 1. No Duplicates

- ไม่เก็บ rules ซ้ำซ้อน
- ถ้ามีหลาย rules คล้ายกัน ให้ merge หรือเลือก canonical

### 2. Frontmatter Standard

- `trigger: always_on`, `model_decision`, หรือ `glob`
- `title` Title Case
- `description` ไม่เกิน 100 ตัวอักษร

### 3. Safety

- ไม่ลบ rule โดยไม่ user confirm
- ไม่เปลี่ยน rule intent โดยไม่ record

## Expected Outcome

- `.devin/rules` และ `rules/` sync กัน
- ไม่มี duplicate rules
- ไม่มี broken references
- `ast-grep scan` ผ่าน
