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

- merged from: `review-correctness` — correctness dimensions refs `references/correctness-*.md`

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

1. ทำ section `## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps (types/code quality)

1. types: เปิด strict flags ทีละตัว, `any`→`unknown`+narrowing, casts→guards, public APIs typed
2. consistency: patterns, API shapes, error handling, doc style ตาม fix guides
3. simplicity: ลดความซับซ้อน, imports สะอาด (unused ลบ, barrel files)
4. verify: `/run-typecheck` + tests ผ่าน — types only ห้ามเปลี่ยน runtime
## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (quality)
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
- ใช้ /deep-review-codebase ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-stability ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

### Fix Steps (types/code quality)

1. types: เปิด strict flags ทีละตัว, `any`→`unknown`+narrowing, casts→guards, public APIs typed
2. consistency: patterns, API shapes, error handling, doc style ตาม fix guides
3. simplicity: ลดความซับซ้อน, imports สะอาด (unused ลบ, barrel files)
4. verify: `/run-typecheck` + tests ผ่าน — types only ห้ามเปลี่ยน runtime
## References

- [Full-dimension checklist](references/checklist.md)

## Expected Outcome

- รายงาน Quality Metrics Summary, Findings by Category, Recommended Actions
- Review score พร้อม grade และ progress bar ตาม `references/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
