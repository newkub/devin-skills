---
name: review-quality-fix-complexity
description: Reduce code complexity — long functions, nesting, duplication, excess abstractions
argument-hint: "[scope-or-findings]"
related:
  - review-quality
  - deep-analyze
  - scan-codebase
  - follow-single-responsibility
  - refactor
  - run-check
  - run-test
  - update-references
  - git-commit
  - ask-me
  - report
  - resolve-errors
---

## Goal

ลด complexity findings จาก `/review-quality` — functions ยาว, nested logic ลึก, duplication, abstractions เกินจำเป็น และ time complexity ที่ผิดปกติบน critical paths — โดยไม่เปลี่ยน behavior

## Scope

- ใช้กับ code ที่มี complexity findings: cyclomatic/cognitive complexity สูง, long functions/files, deep nesting, duplication, hot-path algorithmic issues
- ไม่ครอบคลุม import/dependency issues → ใช้ `subskills/fix-imports/SKILL.md`
- รายละเอียด fix guide ต้นฉบับ: `references/fix-improve-simplicity.md` และ `references/time-complexity.md`

## Execute

### 1. Identify Targets

> Goal: ระบุเป้าหมาย complexity ที่จะลดพร้อม evidence

1. รับ findings จาก `/review-quality` หรือ `scope` จาก argument — ถ้าไม่ระบุ → ถาม user ผ่าน `/ask-me`
2. ใช้ `/deep-analyze` และ complexity findings หา targets — เรียงตาม impact บน critical paths
3. ตรวจ time complexity ของ critical paths ตาม `references/time-complexity.md` — flag O(n²) ที่เป็น O(n) ได้
4. ถ้าไม่พบปัญหา → stop และ report

### 2. Reduce Function Complexity

> Goal: functions สั้นลง อ่านง่าย คง behavior เดิม

1. แบ่ง functions ยาว → หลาย functions สั้นตาม single responsibility (`/follow-single-responsibility`)
2. ใช้ early return และ guard clauses ลด nesting — แบน pyramid of doom
3. ลบ duplication — รวม logic ซ้ำเป็น helper ที่ typed
4. ปรับ naming ให้บอก intent — ลบ dead code ที่พบระหว่างแก้ (ทำ `/scan-codebase` ยืนยันไม่มี callers)
5. ถ้า scope ใหญ่ → ใช้ `/refactor` แยก commits ไม่ผสม refactor กับ behavior change

### 3. Reduce Structural Complexity

> Goal: coupling ลดลง concerns ไม่ซ้อนทับ

1. แยก concerns ที่ซ้อนทับใน module เดียว — extract ตาม boundaries เดิมของ project
2. ลด coupling ระหว่าง modules — รวม abstractions ที่ใกล้เคียง ลบ abstraction ที่ไม่ได้ใช้
3. แก้ hot-path algorithmic issues — เปลี่ยน data structure/algorithm ก่อน micro-optimizations

### 4. Validate

> Goal: behavior เดิม checks ผ่าน ไม่สูญเสีย logic สำคัญ

1. ทำ `/run-check` และ `/run-test` — ผ่านครบ behavior ไม่เปลี่ยน
2. รัน `git diff --check` — ไม่มี whitespace/merge artifacts
3. ถ้าย้าย/ลบไฟล์หรือเปลี่ยน paths → ทำ `/update-references` เสมอ

### 5. Commit And Report

> Goal: ส่งมอบพร้อม evidence

1. ทำ `/git-commit` แยกตามกลุ่ม fix ที่อิสระกัน
2. รายงานสิ่งที่ลด complexity พร้อม metrics (function length, nesting depth, complexity score) ผ่าน `/report`

## Rules

- ใช้ minimal changes เสมอ — ไม่เปลี่ยน public API หรือ expected behavior
- ห้ามผสม refactor กับ behavior change ใน commit เดียว
- ถ้าไม่แน่ใจว่าควรตัดทอน logic ใด → ถาม user ผ่าน `/ask-me` ก่อน
- logic สำคัญ (edge cases, error handling) ต้องอยู่ครบหลัง simplify
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- Complexity findings ลดลง — functions สั้น nesting ตื้น duplication หาย
- Behavior คงเดิม tests ผ่าน — metrics before/after ชัดเจน
- References อัปเดตถ้ามีการย้าย/ลบ — รายงาน next actions ชัดเจน

