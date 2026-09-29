---
name: review-code-quality
description: Review code quality, best practices, correctness, tech debt และ pre-refactor baseline targets
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
  - use-subagents
---

## Goal

Review คุณภาพ code โดยรวม ครอบคลุม code quality, bug-prone patterns, correctness, time complexity, tech debt, และ overall quality score — domain checklist อยู่ใน `subagents/quality-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

- code, configuration, rule files, workflows, และ skills
- ทบทวนตาม `subagents/quality-reviewer/code-quality.md`, `subagents/quality-reviewer/bug-prone.md`, `subagents/quality-reviewer/correctness.md`, `subagents/quality-reviewer/best-practices.md`, `subagents/quality-reviewer/consistency.md`, `../shared/time-complexity.md`, `subagents/quality-reviewer/tech-debt.md`, และ `subagents/quality-reviewer/scoring.md`
- ไม่รวม naming conventions deep review (identifiers, files, exports) → ใช้ `/review-writing` (`subagents/quality-reviewer/naming.md` ใน skill นี้เหลือไว้เป็น checklist เบาสำหรับ code review เท่านั้น)

- ดูเพิ่มเติม: /deep-review

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ project structure, tools, scope และเก็บ baseline

1. ทำ `/scan-codebase`
2. อ่าน `AGENTS.md`
3. ระบุ quality tools: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ทำ `/run-review` + `/deep-analyze` เก็บ analyzer baseline (ใช้เป็น findings-file ให้ subagent cross-check)
5. ถ้า project ไม่มี code ที่ต้อง review → stop และ report

### 2. Dispatch Quality-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ตาม Domain Checks ด้านล่าง)
2. Spawn `subagents/quality-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Validate

> Goal: findings รวมกันถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. ทำ `/deep-validate`
3. จัดลำดับ findings ตาม severity — ตาม `../shared/review-rules.md` Severity Classification
4. ระบุ false positives พร้อมเหตุผล — ถ้า validation ไม่ผ่าน → กลับไป Step 2
5. ลบ findings ที่ไม่มีผลต่อ quality จริง (noise, style-only ที่ไม่มี convention)

### 4. Report

> Goal: รายงานครบทุก dimension พร้อม next actions

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้; ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `complexity` — metrics hotspots, duplication, churn | `subskills/check-complexity/SKILL.md` |
| `debt`, `tech-debt` — TODO/deprecated/workaround inventory | `subskills/check-debt/SKILL.md` |
| Apply type findings — strict flags, any→unknown (user confirm) | `subskills/improve-types/SKILL.md` |

## Review Before Refactor
ทำตาม [subagents/quality-reviewer/review-before-refactor.md](subagents/quality-reviewer/review-before-refactor.md)

## Check: Function Quality
ทำตาม [subagents/quality-reviewer/check-function-quality.md](subagents/quality-reviewer/check-function-quality.md)

## Check: Single Responsibility
ทำตาม [subagents/quality-reviewer/check-single-responsibility.md](subagents/quality-reviewer/check-single-responsibility.md)

## Check: File Relations
ทำตาม [subagents/quality-reviewer/check-file-relations.md](subagents/quality-reviewer/check-file-relations.md)

## Check: Deprecated APIs
ทำตาม [subagents/quality-reviewer/check-deprecated-apis.md](subagents/quality-reviewer/check-deprecated-apis.md)

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `refactor`, `baseline` | `## Review Before Refactor` |
| `function-quality` | `## Check: Function Quality` |
| `single-responsibility` | `## Check: Single Responsibility` |
| `file-relations` | `## Check: File Relations` |
| `deprecated-apis` | `## Check: Deprecated APIs` |

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (quality)
- ทุก finding ต้องมี file path, line number, code snippet
- ระบุ false positives พร้อมเหตุผล
- ให้คะแนนตาม criteria ใน `subagents/quality-reviewer/` ไม่ตามความชอบส่วนบุคคล
- ปฏิบัติตาม hardcode exclusions ใน `subagents/quality-reviewer/code-quality.md`
- รวม findings จากหลาย source เป็น single finding ถ้าซ้ำกัน
- ข้าม sub-workflow ที่ไม่เกี่ยวข้องกับ project
- ตรวจ pattern ทีใช้ว่าช่วย maintainability และ extensibility หรือไม่
- หลีกเลี่ยง anti-patterns ทีทำให้ code ซับซ้อนโดยไม่จำเป็น
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ tools, commands, paths, skill references
- รายงานเป็นตารางด้วย `/report`
- ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⚠️ มี warning
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/quality-reviewer/` เท่านั้น

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
5. verify: `/run-typecheck` + `/run-lint` + tests ผ่าน — types only ห้ามเปลี่ยน runtime; bundle เทียบด้วย `/review-bundle` หรือ `/report-before-after`; เปลี่ยน paths → `/update-references`

## References

- [Full-dimension checklist](subagents/quality-reviewer/checklist.md)
- [Code quality](subagents/quality-reviewer/code-quality.md)
- [Best practices](subagents/quality-reviewer/best-practices.md)
- [Naming](subagents/quality-reviewer/naming.md)
- [Consistency](subagents/quality-reviewer/consistency.md)
- [Bug-prone patterns](subagents/quality-reviewer/bug-prone.md)
- [Correctness](subagents/quality-reviewer/correctness.md)
- [Tech debt](subagents/quality-reviewer/tech-debt.md)
- [Time complexity](../shared/time-complexity.md)
- [Scoring](subagents/quality-reviewer/scoring.md)

## Expected Outcome

- รายงาน Quality Metrics Summary, Findings by Category, Recommended Actions
- Review score พร้อม grade และ progress bar ตาม `subagents/quality-reviewer/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
