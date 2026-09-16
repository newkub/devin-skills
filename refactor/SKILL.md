---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม context — SRP, boundaries, style, consistency
argument-hint: "[@files... | scope]"
related:
  - follow-review
  - refactor-workspace
  - update-references
  - update-tests
  - run-verify
  - check-backward-compatibility
  - use-astgrep
  - migration-by-astgrep
  - check-code-structure
  - check-function-quality
  - check-long-files
  - check-single-responsibility
  - resolve-errors
  - dont-over-engineer
  - use-lib-effective
  - follow-single-of-source
---

## Goal

Refactor ตาม context โดยเลือก scope ที่เหมาะสม: ไฟล์, workspace, codebase หรือ SRP แล้วดำเนินการจนผ่าน verify

## Scope

- ถ้า user ระบุ `@files...` → refactor เฉพาะไฟล์ โดยลงลึกถึง SRP/naming/structure
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ทำ SRP refactor
- ถ้าต้องการ refactor ทั้ง codebase → ทำ codebase refactor ตาม `references/codebase-refactor.md` (deep procedure: baseline → impact → batches → validation)
- ถ้า context คือเตรียมเพิ่ม feature → preparatory refactor ("make the change easy, then make the easy change") — refactor แยก commit ก่อน feature เสมอ
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`

(merged from: `refactor-codebase`, `refactor-to-single-responsibility`, `refactor-files`, `deep-refactor-codebase`, `deep-refactor`)

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

ทำตาม [references/file-refactor.md](references/file-refactor.md)

### 3. Workspace Refactor

> Goal: จัดระเบียบ workspace หรือ monorepo

ทำตาม [references/workspace-refactor.md](references/workspace-refactor.md)

### 4. Codebase And SRP Refactor

> Goal: แก้ไขปัญหา SRP, long files, consistency ทั้ง codebase ด้วย baseline, impact analysis, incremental batches (merged from: `deep-refactor-codebase`)

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

### 1. Preserve Behavior

- refactor = เปลี่ยน structure โดยไม่เปลี่ยน observable behavior — ห้าม mix feature change/bug fix ใน commit เดียวกับ refactor (Two Hats rule)
- ถ้าเจอ bug ระหว่าง refactor → commit fix แยกก่อน แล้วค่อย refactor ต่อ
- public API และ behavior ที่ consumer เห็นต้องเหมือนเดิม — ตรวจด้วย `/check-backward-compatibility` เมื่อแตะ exported API

### 2. Safety Net First

- ห้าม refactor code ที่ไม่มี test coverage โดยไม่มี safety net — ถ้าไม่มี tests → ทำ `/update-tests` เขียน characterization tests ล็อก behavior ปัจจุบันก่อน
- tests ต้องเขียวก่อน refactor และเขียวหลัง refactor — test เขียวที่ pass ก่อนแก้ต้อง pass หลังแก้เหมือนเดิม
- ถ้า test suite ใหญ่และสงสัยว่าจับ regression ได้จริง → `/run-test` (mutation) วัดความแข็งแรงของ tests ก่อนเชื่อถือ

### 3. Small Steps

- ทำทีละ refactoring เดียว (extract, rename, move) แล้ว verify green ก่อน step ถัดไป — ห้ามรวมหลาย transformation ใน step เดียว
- commit checkpoint ด้วย `/git-commit` หลังทุก batch ที่เขียว — rollback ได้ทุกจุด
- mechanical refactor ขนาดใหญ่ (rename/move/pattern change หลายไฟล์) → ใช้ `/use-astgrep` หรือ `/migration-by-astgrep` แทนการแก้มือ

### 4. Context Aware

- ไม่เดา scope ถ้าไม่ชัด
- ถ้าไม่ชัดให้ทำ `/ask-me`
- ไม่ dispatch หลาย sub-skill พร้อมกัน — ทำทีละตัวตาม priority

### 5. Minimal Change

- ทำ `/dont-over-engineer`
- ทำ `/use-lib-effective` เมื่อเจอ code ที่อาจ reinvent dep ที่มีอยู่ — แทนด้วย lib ใน manifest หรือ catalog แทนการเขียนเอง
- หลีกเลี่ยง abstraction ที่ไม่จำเป็น
- รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
- dead code ที่เจอระหว่าง refactor → ลบด้วย `/check-repo-hygiene unused` ยืนยันก่อน
- เลือก technique จาก `references/code-smells.md` — smell → technique ตรง root cause
- แก้ที่ root cause เสมอ ห้าม patch symptom — ถ้า fix ทำให้ต้องแก้หลายจุดซ้ำ (shotgun surgery) → รวมไป canonical source เดียว
- ห้าม perf tuning ใน refactor pass — optimization เปลี่ยน behavior/timing เสี่ยง regression; ถ้าเจอ perf issue → note ไว้แยก commit ต่างหาก (`/review-performance`)

### 6. SRP And Consistency

- หนึ่ง function ทำหนึ่ง operation
- หนึ่ง file ครอบคลุมหนึ่ง concern
- ไฟล์ไม่เกิน 250 บรรทัด ยกเว้น barrel/index ที่จำเป็น — ตรวจด้วย `/check-long-files` (Rust CLI, default threshold 250)
- รักษา naming, patterns, structure สอดคล้องกันทั้ง scope
- หนึ่ง fact มี canonical source เดียว — เจอ constants/config/logic ที่ duplicate → extract ไป source เดียวตาม `/follow-single-of-source`

### 7. Safety

- การย้าย/ลบ/rename ต้อง `/update-references`
- destructive actions ต้อง dry run + user confirmation
- ไม่ force push

### 8. Verification

- ทุก refactor ต้องผ่าน `/run-verify`
- ไม่มี broken references

## Expected Outcome

- Scope ที่เหมาะสมถูกเลือกและดำเนินการ
- ไฟล์/ packages มีขนาดเหมาะสม
- imports/exports สะอาด
- SRP ชัดเจน
- naming, patterns, structure สอดคล้อง
- ผ่าน lint/typecheck/test/build
- รายงาน before/after ครบ
