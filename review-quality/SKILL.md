---
name: review-quality
description: Review code quality, best practices, naming, consistency, bug-prone patterns, and correctness
argument-hint: "[scope]"
related:
  - deep-validate
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-review
  - use-astgrep
  - report
  - suggest-next-action
  - review-test
  - review-security
  - review-stability
---

## Goal

Review คุณภาพ code โดยรวม ครอบคลุม code quality, bug-prone patterns, correctness, time complexity, tech debt, และ overall quality score

## Scope

- code, configuration, rule files, workflows, และ skills
- ทบทวนตาม `references/code-quality.md`, `references/bug-prone.md`, `references/correctness.md`, `references/best-practices.md`, `references/consistency.md`, `references/time-complexity.md`, `references/tech-debt.md`, และ `references/scoring.md`
- ไม่รวม naming conventions deep review (identifiers, files, exports) → ใช้ `/review-writing` (`references/naming.md` ใน skill นี้เหลือไว้เป็น checklist เบาสำหรับ code review เท่านั้น)

- ดูเพิ่มเติม: /deep-review

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

### 6. Tech Debt And Complexity

> Goal: รู้ debt และ hotspots ที่ต้อง monitor

1. ทำตาม `references/tech-debt.md` — TODO/FIXME density, deprecated usage, dead code, duplication hotspots
2. ตรวจสอบ time complexity ของ critical paths ทำตาม `references/time-complexity.md`

### 7. Validate

> Goal: Findings ถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. ทำ `/deep-validate`
2. จัดลำดับ findings ตาม severity — ตาม `../shared/review-rules.md` Severity Classification
3. ระบุ false positives พร้อมเหตุผล
4. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 3

### 8. Simplify

> Goal: Findings กระชับ อ่านง่าย ไม่มี noise

1. รวม findings ที่ซ้ำกันเป็น single finding พร้อม evidence ทั้งหมด
2. ลบ findings ที่ไม่มีผลต่อ quality จริง (noise, style-only ที่ไม่มี convention)
3. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `complexity` — metrics hotspots, duplication, churn | `subskills/check-complexity/SKILL.md` |
| `debt`, `tech-debt` — TODO/deprecated/workaround inventory | `subskills/check-debt/SKILL.md` |
| Apply type findings — strict flags, any→unknown (user confirm) | `subskills/improve-types/SKILL.md` |

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
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-stability ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps (types/code quality)

1. types: เปิด strict flags ทีละตัว, `any`→`unknown`+narrowing, casts→guards, public APIs typed
2. complexity: แบ่ง functions ยาวตาม `/follow-single-responsibility`, early return/guard clauses ลด nesting, รวม logic ซ้ำเป็น helper — hot-path algorithmic issues เปลี่ยน data structure/algorithm ก่อน micro-opts — scope ใหญ่ → `/refactor` แยก commits ไม่ผสม behavior change
3. imports: `knip`/lint auto-fix ลบ unused (ระวัง side-effect/decorator imports — typecheck ทุก batch), barrels `export *` → named/subpath imports + `sideEffects: false`, heavy libs → subpath/dynamic import หรือทางเลือกผ่าน `/review-dependencies`
4. consistency: patterns, API shapes, error handling, doc style
5. verify: `/run-typecheck` + `/run-lint` + tests ผ่าน — types only ห้ามเปลี่ยน runtime; bundle เทียบด้วย `/check-bundle-regression` หรือ `/report-before-after`; เปลี่ยน paths → `/update-references`

## References

- [Full-dimension checklist](references/checklist.md)
- [Code quality](references/code-quality.md)
- [Best practices](references/best-practices.md)
- [Naming](references/naming.md)
- [Consistency](references/consistency.md)
- [Bug-prone patterns](references/bug-prone.md)
- [Correctness](references/correctness.md)
- [Tech debt](references/tech-debt.md)
- [Time complexity](references/time-complexity.md)
- [Scoring](references/scoring.md)

## Expected Outcome

- รายงาน Quality Metrics Summary, Findings by Category, Recommended Actions
- Review score พร้อม grade และ progress bar ตาม `references/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
