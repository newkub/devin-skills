---
name: review-quality
description: Review code quality, best practices, naming, consistency, bug-prone patterns, and correctness
argument-hint: "[scope]"
related:
  - deep-validate
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-review-codebase
  - use-astgrep
  - report
  - suggest-next-action
  - review-test
  - review-security
  - review-stability
---
  - check-error-coverage
  - check-types-coverage
  - report-scan-todo
  - check-test-isolation
  - check-unused
  - check-merge-conflicts

## Goal

Review คุณภาพ code โดยรวม ครอบคลุม code quality, bug-prone patterns, correctness, time complexity, tech debt, และ overall quality score

## Scope

- code, configuration, rule files, workflows, และ skills
- ทบทวนตาม `references/code-quality.md`, `references/bug-prone.md`, `references/correctness.md`, `references/best-practices.md`, `references/naming.md`, `references/consistency.md`, `references/time-complexity.md`, `references/tech-debt.md`, และ `references/scoring.md`

- ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Prepare

> Goal: เข้าใจ project structure, tools, scope

1. ทำ `/scan-codebase`
2. อ่าน `AGENTS.md`
3. ระบุ quality tools: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ถ้า project ไม่มี code ที่ต้อง review → stop และ report

### 2. Code Quality

> Goal: รวบรวม findings ด้าน static analysis, architecture, types, naming, readability, hardcode

ทำตาม `references/code-quality.md`

### 3. Best Practices, Naming, And Consistency

> Goal: ตรวจ best practices, naming, และ consistency

1. ทำตาม `references/best-practices.md` สำหรับ conventions, error handling, testing, security, performance
2. ทำตาม `references/naming.md` สำหรับ identifiers, files, skill names
3. ทำตาม `references/consistency.md` สำหรับ structure, formatting, terminology, references
4. บันทึก findings พร้อม severity และ evidence

### 4. Bug-Prone

> Goal: ระบุรูปแบบโค้ดที่มีแนวโน้มก่อให้เกิด bugs

ทำตาม `references/bug-prone.md`

### 5. Correctness

> Goal: ตรวจสอบ logic correctness, edge cases, และ invariant checks

ทำตาม `references/correctness.md`

### 6. Validate

> Goal: Findings ถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. ทำ `/deep-validate`
2. ตรวจสอบ time complexity ของ critical paths ทำตาม `references/time-complexity.md`
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives พร้อมเหตุผล
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 3

### 7. Simplify

> Goal: Findings กระชับ อ่านง่าย ไม่มี noise

1. ทำ section `## Fix` กับ findings
2. กรอง noise และ low-value findings
3. รวม findings ที่ซ้ำกัน
4. จัดกลุ่มที่เกี่ยวข้อง
5. พิจารณา tech debt ที่ควร simplify ทำตาม `references/tech-debt.md`

### 8. Report

> Goal: รายงานชัดเจน ครบทุก dimension พร้อม review score

1. ทำ `/report`
2. สร้าง Quality Metrics Summary, Findings by Category, Recommended Actions
3. คำนวณ review score ทำตาม `references/scoring.md`
4. ทำ `/suggest-next-action`

### 9. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/productionize-implementation`
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ทุก finding ต้องมี file path, line number, code snippet
- ระบุ false positives พร้อมเหตุผล
- ให้คะแนนตาม criteria ใน references ไม่ตามความชอบส่วนบุคคล
- ปฏิบัติตาม hardcode exclusions ใน `references/code-quality.md`
- รวม findings จากหลาย source เป็น single finding ถ้าซ้ำกัน
- ข้าม sub-workflow ที่ไม่เกี่ยวข้องกับ project
- ตรวจ pattern ทีใช้ว่าช่วย maintainability และ extensibility หรือไม่
- หลีกเลี่ยง anti-patterns ทีทำให้ code ซับซ้อนโดยไม่จำเป็น
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ tools, commands, paths, skill references
- รายงานเป็นตารางด้วย `/report`
- ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⚠️ มี warning

- ใช้ /deep-analyze ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-stability ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings หลังรายงาน — ข้ามถ้า scope เป็น review/report-only เช่นถูก dispatch จาก `/deep-review-codebase` หรือ `/review`

Merged from: improve-cli-ux, improve-consistency, improve-simplicity, optimize-imports

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. เลือก fix guide ที่ตรงกับ finding จากรายการด้านล่าง
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test-unit` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

- `references/fix-improve-cli-ux.md` — ปรับ CLI experience ทั้ง help text, output format, flags, prompts และ error messages
- `references/fix-improve-consistency.md` — ปรับ consistency ข้าม codebase — patterns, API shapes, error handling, config และ doc style
- `references/fix-improve-simplicity.md` — ปรับความกระชับ — ลดความซับซ้อนของ content, code, architecture, workflows หรือ skills
- `references/fix-optimize-imports.md` — จัดการ imports ทั้ง project ลบ unused, แก้ barrel files ที่ทำ tree-shaking พัง
## Expected Outcome

- รายงาน Quality Metrics Summary, Findings by Category, Recommended Actions
- Review score พร้อม grade และ progress bar ตาม `references/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
