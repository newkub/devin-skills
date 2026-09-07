---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม context — SRP, boundaries, style, consistency
argument-hint: "[@files... | scope]"
related:
  - refactor-workspace
  - relocation
  - update-references
  - run-verify
  - dont-over-engineer
  - ask-me
  - report
---

## Goal

Refactor ตาม context โดยเลือก scope ทีเหมาะสม: ไฟล์, workspace, codebase หรือ SRP แล้วดำเนินการจนผ่าน verify

## Scope

- ถ้า user ระบุ `@files...` → refactor เฉพาะไฟล์ โดยลงลึกถึง SRP/naming/structure
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ทำ SRP refactor
- ถ้าต้องการ refactor ทั้ม codebase → ทำ codebase refactor
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`

(merged from: `refactor-codebase`, `refactor-to-single-responsibility`, `refactor-files`)

## Execute

### 1. Detect Scope

> Goal: ระบุ scope ของ refactoring

1. ถ้ามี `@files...` → file refactor
2. ถ้าไม่มี `@files` แต่ context เป็น monorepo/workspace → workspace refactor
3. ถ้า project มีไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → SRP refactor
4. ถ้าต้องการ refactor ทั้ม codebase หรือไม่มี files/workspace context → codebase refactor
5. ถ้า user บอกว่าต้องการย้ายไฟล์ → ใช้ `/relocation`

### 2. File Refactor

> Goal: แก้ไขไฟล์ทีระบุ

ทำตาม [references/file-refactor.md](references/file-refactor.md)

### 3. Workspace Refactor

> Goal: จัดระเบียบ workspace หรือ monorepo

ทำตาม [references/workspace-refactor.md](references/workspace-refactor.md)

### 4. Codebase And SRP Refactor

> Goal: แก้ไขปัญหา SRP, long files, consistency ทั้ม codebase

ทำตาม [references/codebase-refactor.md](references/codebase-refactor.md)

### 5. Update References

> Goal: ไม่มี broken references

1. ทำ `/update-references` สำหรับ relative paths/imports
2. ทำ `/update-references` สำหรับ global references/skills
3. ถ้ามี broken references → ทำ `/resolve-errors`

### 6. Verify

> Goal: ตรวจสอบว่า refactor ผ่าน

ทำตาม [references/verify.md](references/verify.md)

### 7. Report

> Goal: สรุปผล

1. ทำ `/report` สรุป sub-skill/scope, การเปลี่ยนแปลง, status
2. ทำ `/report-before-after` ถ้ามี baseline
3. ทำ `/suggest-next-action`

## Rules

### 1. Context Aware

- ไม่เดา scope ถ้าไม่ชัด
- ถ้าไม่ชัดให้ทำ `/ask-me`
- ไม่ dispatch หลาย sub-skill พร้อมกัน — ทำทีละตัวตาม priority

### 2. Minimal Change

- ทำ `/dont-over-engineer`
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน

### 3. SRP And Consistency

- หนึ่ยง function ทำหนึ่ยง operation
- หนึ่ยง file ครอบคลุมหนึ่ยง concern
- ไฟล์ไม่เกิน 250 บรรทัด ยกเว้น barrel/index ทีจำเป็น
- รักษา naming, patterns, structure สอดคล้องกันทั้ง scope

### 4. Safety

- การย้าย/ลบ/rename ต้อง `/update-references`
- destructive actions ต้อง dry run + user confirmation
- ไม่ force push

### 5. Verification

- ทุก refactor ต้องผ่าน `/run-verify`
- ไม่มี broken references

## Expected Outcome

- Scope ทีเหมาะสมถูกเลือกและดำเนินการ
- ไฟล์/ packages มีขนาดเหมาะสม
- imports/exports สะอาด
- SRP ชัดเจน
- naming, patterns, structure สอดคล้อง
- ผ่าน lint/typecheck/test/build
- รายงาน before/after ครบ
