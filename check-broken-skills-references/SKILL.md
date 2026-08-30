---
name: check-broken-skills-references
description: ตรวจหา broken skill references ใน SKILL.md ของ devin skills repo ด้วย Bun/TypeScript
argument-hint: "[path]"
related:
  - check-reference
  - check-skills-related
  - deep-validate
  - check-backward-compatibility
  - review-security
  - update-references
  - review-devin-global-skills
---

## Goal

ตรวจหา broken skill references ใน `SKILL.md` ของ devin skills repo โดยเปรียบเทียบ references ที่อ้างถึงกับ skills ที่มีอยู่จริง

## Scope

ใช้สำหรับ scan devin skills repo เพื่อหา references ไปยัง skills ที่ไม่มีอยู่ ครอบคลุมทั้ง `/skill-name` patterns ใน prompt body และ `related` fields ใน frontmatter ไม่รวมการแก้ไข (ใช้ `/update-references` สำหรับแก้)

## Execute

### 1. Run Checker

> Goal: รัน checker เพื่อ scan broken references

1. เปลี่ยน working directory ไปยัง skill directory `check-broken-skills-references`
2. รันคำสั่ง `bun src/index.ts [PATH]`
3. ถ้าไม่ระบุ `PATH` จะใช้ `%APPDATA%\devin\skills` (Windows) หรือ `$HOME/.devin/skills` (Unix)
4. รับผลลัพธ์: ตาราง broken references แยกตาม Critical/Warning

## Rules

### 1. TypeScript / Bun CLI

- รันผ่าน `bun src/index.ts [path]` โดยไม่ต้อง build
- รองรับ Unicode content ใน SKILL.md
- ใช้ `Bun.Glob` สำหรับ scan files
- ใช้ regex สำหรับหา `/skill-name` patterns

### 2. Filter False Positives

- URL fragments (`https://...`) ไม่ใช่ skill references
- File paths (`references/foo.md`) ไม่ใช่ skill references
- npm packages (`@capacitor/...`) ไม่ใช่ skill references
- Generic placeholders (`/skill-name`, `/some-skill`) ไม่ใช่ skill references

### 3. Severity Classification

- Critical: broken `related` field reference
- Warning: broken body `/skill-name` reference

### 4. No Auto-Fix

- `check-broken-skills-references` ตรวจและรายงานเท่านั้น
- ถ้าต้องการแก้ → ทำ `/update-references` หลังจากนี้

- ใช้ /check-reference ถ้าจำเป็น
- ใช้ /check-skills-related ถ้าจำเป็น
- ใช้ /deep-validate ถ้าจำเป็น
- ใช้ /check-backward-compatibility ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-devin-global-skills ถ้าจำเป็น

## Expected Outcome

- รายงาน broken references ครบถ้วน พร้อม skill name, reference, type, severity
- สถิติ: total skills, total references checked, broken count
- ถ้ามี Critical → แนะนำ next action (`/update-references` หรือ `/resolve-errors`)
- ถ้าไม่พบ → "no broken references found"
