---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม context — SRP, boundaries, style, consistency
argument-hint: "[@files... | scope]"
related:
  - refactor-workspace
  - update-references
  - update-tests
  - run-verify
  - check-backward-compatibility
  - use-astgrep
  - check-code-structure
  - check-function-quality
  - check-long-files
  - check-single-responsibility
  - resolve-errors
  - dont-over-engineer
  - use-lib-effective
  - follow-single-of-source
  - follow-reusable
  - edit-with-astgrep
  - migration-by-astgrep
---

## Goal

Refactor ตาม context โดยเลือก scope ที่เหมาะสม: ไฟล์, workspace, codebase หรือ SRP แล้วดำเนินการจนผ่าน verify

## Scope

- ถ้า user ระบุ `@files...` → refactor เฉพาะไฟล์ โดยลงลึกถึง SRP/naming/structure
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ทำ SRP refactor
- ถ้าต้องการ refactor ทั้ง codebase → ทำ codebase refactor ตาม `references/scope-codebase.md` (deep procedure: baseline → impact → batches → validation)
- ถ้า context คือเตรียมเพิ่ม feature → preparatory refactor ("make the change easy, then make the easy change") — refactor แยก commit ก่อน feature เสมอ
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`
- mechanical refactor หลายไฟล์ (rename/pattern/batch transform) → ใช้ `/edit-with-astgrep` (dry-run + confirm ก่อนเขียนทับเสมอ); migration ทั้ง codebase ด้วย rule file → `/migration-by-astgrep`
(merged from: `refactor-codebase`, `refactor-to-single-responsibility`, `refactor-files`, `deep-refactor-codebase`)

## Execute

### 1. Detect Scope

> Goal: ระบุ scope ของ refactoring

1. ทำ `/follow-review` ก่อน refactor เสมอ — เลือกและรัน `review-*` ที่ตรง context ก่อนลงมือ
2. ถ้ามี `@files...` → file refactor
3. ถ้าไม่มี `@files` แต่ context เป็น monorepo/workspace → workspace refactor
4. ถ้า project มีไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → SRP refactor
5. ถ้าไม่มี scope ชัดเจน → หา hotspots ด้วย evidence ก่อนเลือก target: `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` (churn สูง × complexity สูง = คุ้มสุด)
6. เก็บ evidence ด้วย check skills ก่อนเลือก target — `/check-long-files` (ไฟล์เกิน 250 บรรทัด), `/check-code-structure` (file-level symbols/exports), `/check-single-responsibility` (SRP counts), `/check-function-quality` (function metrics) — ใช้ findings เป็น baseline และเลือก target ที่ severity สูงสุด
7. ถ้าต้องการ refactor ทั้ง codebase หรือไม่มี files/workspace context → codebase refactor
8. ถ้า user บอกว่าต้องการย้ายไฟล์ → ใช้ `/relocation`

### 2. File Refactor

> Goal: แก้ไขไฟล์ที่ระบุ

ทำตาม [references/scope-file.md](references/scope-file.md)

### 3. Workspace Refactor

> Goal: จัดระเบียบ workspace หรือ monorepo

ทำตาม [references/scope-workspace.md](references/scope-workspace.md)

### 4. Codebase And SRP Refactor

> Goal: แก้ไขปัญหา SRP, long files, consistency ทั้ง codebase ด้วย baseline, impact analysis, incremental batches (merged from: `deep-refactor-codebase`)

ทำตาม [references/scope-codebase.md](references/scope-codebase.md)

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

Checklist สั้น — detail ฉบับเต็มของแต่ละ rule อยู่ที่ `references/principles.md`

### 1. Preserve Behavior

- ห้าม mix feature/bug fix กับ refactor ใน commit เดียว (Two Hats) — public API/behavior เหมือนเดิมเสมอ

### 2. Safety Net First

- ไม่มี tests → เขียน characterization tests ก่อน (`/update-tests`); tests เขียวก่อนและหลัง

### 3. Small Steps

- ทีละ transformation เดียว → verify green → `/git-commit` checkpoint ทุก batch
- mechanical batch หลายไฟล์ → `/edit-with-astgrep` (dry-run+confirm); rule-file migration → `/migration-by-astgrep`

### 4. Context Aware

- ไม่เดา scope — ไม่ชัดให้ `/ask-me`; ทำทีละ sub-skill ตาม priority

### 5. Minimal Change

- `/dont-over-engineer` + `/follow-reusable` (reuse > extend > extract > create); แก้ root cause ตาม `references/code-smells.md`; ห้าม perf tuning ใน refactor pass

### 6. SRP And Consistency

- ไฟล์ ≤250 บรรทัด (`/check-long-files`); หนึ่ง fact หนึ่ง source (`/follow-single-of-source`); naming/patterns สอดคล้อง

### 7. Safety

- ย้าย/ลบ/rename → `/update-references`; destructive → dry run + confirm; ไม่ force push

### 8. Verification

- ผ่าน `/run-verify`; ไม่มี broken references

## Expected Outcome

- Scope ที่เหมาะสมถูกเลือกและดำเนินการ
- ไฟล์/ packages มีขนาดเหมาะสม
- imports/exports สะอาด
- SRP ชัดเจน
- naming, patterns, structure สอดคล้อง
- ผ่าน lint/typecheck/test/build
- รายงาน before/after ครบ
