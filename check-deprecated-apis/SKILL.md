---
name: check-deprecated-apis
description: หา code ที่ใช้ deprecated APIs, functions และ dependencies ที่จะถูกลบ
argument-hint: "[path]"
related:
  - use-astgrep
  - report
---

## Goal

ตรวจหา usages ของ deprecated APIs ทั้งใน code เอง (`@deprecated` JSDoc), framework APIs ที่เลิกใช้ และ dependencies เวอร์ชันที่ deprecate แล้ว — ก่อนที่มันจะถูกลบจริง

## Scope

- ครอบคลุม: `@deprecated` annotations ใน project, deprecated APIs ของ frameworks/libs ที่ใช้, deprecated npm packages, Node/platform APIs ที่เลิกรองรับ
- Read-only: รายงาน usages + migration path — แก้ผ่าน `/refactor` หรือ `/update-version-to-latest`

## Execute

### 1. Find Deprecation Markers

> Goal: รวบรวมสิ่งที่ถูก deprecate

1. ใช้ `search-files-patterns`/`use-astgrep` หา `@deprecated` tags, `deprecated` warnings ใน project เอง
2. รัน typecheck/lint ดู deprecation diagnostics (TS แสดง strikethrough/warnings)
3. ตรวจ `package.json` deps เทียบ registry — deprecated packages (`npm view <pkg> deprecated`)
4. ตรวจ runtime deprecation warnings จาก `NODE_OPTIONS=--trace-deprecation` หรือ logs

### 2. Map Usages

> Goal: หาจุดที่เรียกใช้ deprecated things

1. สำหรับแต่ละ deprecated symbol → หา call sites ทั้งหมด
2. นับ usage count ต่อ symbol — เรียง impact
3. แยก internal deprecated (ของ project เอง) ออกจาก external (ของ deps/framework)

### 3. Determine Migration Path

> Goal: หา replacement ของแต่ละตัว

1. อ่าน deprecation message — ส่วนใหญ่บอก replacement (`use X instead`)
2. สำหรับ deps: หา successor package หรือ migration guide
3. ถ้าไม่มี replacement ชัด → flag เป็น `needs-decision`

### 4. Report

> Goal: สรุป deprecation debt พร้อมแผน

1. ใช้ `/report` คอลัมน์: `No.`, `Deprecated`, `Type`, `Usages`, `Replacement`, `Severity`
2. Severity: `high` (EOL/removal announced, security-related), `medium` (มี replacement ชัด), `low` (deprecated แต่ยัง maintain)
3. จัดกลุ่มเป็น batches ที่ migrate พร้อมกันได้

## Rules

### 1. Evidence-Based

- ทุก finding ต้องมี deprecation source (annotation, registry, runtime warning)
- usage count ต้องมาจากการ scan จริง ไม่ใช่ประมาณ

### 2. Read-Only

- ไม่ migrate code — รายงานและเสนอ path
- อย่า flag deprecated ที่ยังไม่มีทางเลือกว่าเป็น "ต้องแก้ด่วน" — ระบุตามจริง

### 3. Context Aware

- Test code/examples ที่ใช้ deprecated APIs อาจตั้งใจ — flag แยก
- Deprecated ของ project เอง = ความรับผิดชอบภายใน, ของ deps = ตาม timeline ของ upstream

## Expected Outcome

- รายการ deprecated usages พร้อม counts และ replacements
- Deprecation debt แยก internal vs external
- Migration batches ที่ทำได้ทีละชุด
