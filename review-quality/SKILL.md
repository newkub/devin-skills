---
name: review-quality
description: Review code quality, bug-prone patterns, correctness, and overall quality with score
related:
  - review-correctness
  - validate
  - deep-validate
  - scan-codebase
  - deep-analyze
  - run-review
  - update-review-codebase-cli-and-run
  - use-ast-grep
  - report-table
  - suggest-next-action
  - review-test
  - review-performance
  - review-security
  - review-stability
  - review-uxui
---

## Goal

Review คุณภาพ code โดยรวม ครอบคลุม static analysis, architecture, types, naming, readability, hardcode, bug-prone patterns, logic correctness, edge cases, และ invariant checks พร้อม aggregate findings, review score และ action items

## Scope

quality review สำหรับ code, configuration, rule files, workflows, และ skills ครอบคลุม:

- code quality: static analysis (lint, typecheck, code smells, duplication, unused code, circular dependencies, file complexity, SRP violations), architecture (patterns, boundaries, coupling, SOLID, design patterns, anti-patterns), types (generics, inference, discriminated unions, branded types, type narrowing, type safety, `as const`), naming (variable, function, class, file, directory, API endpoint, database), readability (function length, parameter count, nesting depth, cognitive complexity, naming clarity, comment quality), hardcode (magic numbers, hardcoded strings, URLs, paths, secrets, business rules, feature flags)
- bug-prone patterns: null/undefined safety, type assertions, exhaustive control flow, arithmetic bugs, mutable shared state, async/promise bugs, unsafe parse/regex, resource cleanup, implicit assumptions, unsafe defaults
- correctness: logic correctness, edge cases, invariant checks, validation, calculations, transformations, data mappings, error handling
- time complexity: Big O analysis, data structure selection, input bounds validation, benchmark verification
- general quality: simplicity, redundancy, consistency, refactor readiness, deprecation, techstack alignment

ดูรายละเอียดใน `references/code-quality.md`, `references/bug-prone.md`, `references/correctness.md`, `references/time-complexity.md`, และ `references/scoring.md`

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ project structure, tools และ scope

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, dependencies, tech stack และ conventions
2. อ่าน `AGENTS.md` เพื่อทราบ tools ที่ใช้ใน project
3. ระบุ quality tools ที่มี: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ถ้า project ไม่มี code ที่ต้อง review → stop และ report

### 2. Code Quality Review

> Goal: รวบรวม findings ด้าน static analysis, architecture, types, naming, readability, hardcode

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer รัน static analysis tools แบบ lint, typecheck, `ast-grep` scan, `knip`, `jscpd`, `madge`
6. ทำ `/update-review-codebase-cli-and-run` เพื่อ review patterns, boundaries, coupling, design patterns, anti-patterns, SOLID
7. ทำ `/update-review-codebase-cli-and-run` เพื่อ review type design: generics, type inference, discriminated unions, type narrowing, branded types, type safety, `as const`, exhaustive checks, `any` usage, type assertions
8. ทำ `/update-review-codebase-cli-and-run` เพื่อ review naming conventions: variable, function, class, file, directory, API endpoint, database naming, cross-layer consistency
9. Analyzer ตรวจสอบ readability: function length เกิน 50 บรรทัด, parameter count เกิน 4, nesting depth เกิน 3 ระดับ, cognitive complexity, naming clarity, comment quality
10. Analyzer ตรวจสอบ hardcode: magic numbers, hardcoded strings, URLs, file paths, secrets, business rules, feature flags
11. ตรวจสอบ simplicity: over-engineering, YAGNI, premature optimization, unnecessary abstraction
12. ตรวจสอบ redundancy: duplicate code, content duplication, unused exports, circular dependencies
13. ตรวจสอบ consistency: cross-module patterns, coding style, folder structure, import/export patterns
14. ดู criteria ใน `references/code-quality.md`

### 3. Bug-Prone Review

> Goal: ระบุรูปแบบโค้ดที่มีแนวโน้มก่อให้เกิด bugs

1. Analyzer ตรวจสอบ `null`/`undefined` safety: unsafe access, optional chaining ไม่มี fallback, non-null assertions
2. Analyzer ตรวจสอบ type assertions, `as`, `any`, และ unsafe narrowing
3. Analyzer ตรวจสอบ exhaustive handling: `switch`/`if-else` ที่ไม่ครอบคลุมทุก case, missing default branch
4. Analyzer ตรวจสอบ arithmetic bugs: off-by-one, array indexing, date/time calculation, floating-point, monetary calculation
5. Analyzer ตรวจสอบ mutable shared state, global state, และ side effects ใน pure functions
6. Analyzer ตรวจสอบ async/promise bugs: floating promises, missing `await`, `Promise` ใน boolean expression
7. Analyzer ตรวจสอบ unsafe parse/regex: `JSON.parse` ไม่มี `try-catch`, unsafe `eval`, regex ที่ไม่ validated
8. Analyzer ตรวจสอบ resource cleanup: event listeners, subscriptions, timers, intervals ที่ไม่ถูก cleanup
9. Analyzer ตรวจสอบ implicit assumptions และ unsafe defaults
10. ดู criteria ใน `references/bug-prone.md`

### 4. Correctness Review

> Goal: ตรวจสอบ logic correctness, edge cases, และ invariant checks

1. ตรวจสอบว่า code/config ทำงานตาม requirements และ criteria ที่ระบุ
2. ตรวจสอบ calculations, transformations, data mappings, serialization
3. ตรวจสอบ control flow: `if/else`, `switch`, loops ว่า complete และ correct
4. ตรวจสอบ boolean expressions, conditions, short-circuit, ordering, sequencing
5. ตรวจสอบ edge cases: `null`/`undefined`, empty, zero, negative, boundary values, unexpected states
6. ตรวจสอบ concurrency, race conditions, timeouts, async cancellation
7. ตรวจสอบ input/output validation, schema validation, sanitization, type coercion
8. ตรวจสอบ error handling, defaults, assumptions, invariants, recovery paths
9. ตรวจสอบ references, links, และ configuration values
10. ดู criteria ใน `references/correctness.md`

### 5. Validate Findings

> Goal: Findings ถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จาก script และ sub-workflows
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 6. Simplify Findings

> Goal: Findings กระชับ อ่านง่าย ไม่มี noise

1. ทำ `/simplify` กับ findings ก่อน report — ลดความซับซ้อนโดยไม่เสีย context สำคัญ
2. กรอง findings ที่เป็น noise หรือ low-value ออกจาก report หลัก
3. รวม findings ที่ซ้ำกันจากหลาย sub-workflows เป็น single finding
4. จัดกลุ่ม findings ที่เกี่ยวข้องเข้าด้วยกันเพื่ออ่านง่าย

### 7. Report

> Goal: รายงานชัดเจน ครบทุก dimension พร้อม review score

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Quality Metrics Summary: metrics พร้อม count, threshold, status
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
5. คำนวณ review score ตาม `references/scoring.md` พร้อม progress bar และ grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 8. Implement All

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Scope

- ทำ review เท่านั้น ไม่แก้ไข code หรือเนื้อหาระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง review
- ไม่ครอบคลุม `review-delivery`

### 2. Severity

- Critical: blocking production, security risk, data loss, circular dependency, `any` ใน critical path, type safety bypass, unsafe assertion, hardcoded secrets, logic ที่อ่านแล้วเข้าใจผิดได้ง่าย, `null`/`undefined` access ใน critical path, floating promise ที่ lead to unhandled rejection
- High: core functionality at risk, type safety violation, high duplication, missing type constraint, hardcoded URLs/business rules, function เกิน 50 บรรทัด, parameter เกิน 4, off-by-one ใน loop, missing resource cleanup ที่ก่อให้เกิด leak
- Medium: code quality issue, minor gap, code smell, moderate coupling, optional chaining ไม่มี fallback, magic numbers ที่ใช้ซ้ำ, function 30-50 บรรทัด, nesting 3-4 ระดับ, implicit assumption ใน non-critical path
- Low: cosmetic, naming, minor improvement, missing fallback, documentation gap

### 3. Evidence

- ทุก finding ต้องมี file path, line number และ code snippet
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `grep`, `jscpd`, `knip`, `madge`)
- ระบุ false positives ที่พบพร้อมเหตุผล

### 4. Objectivity

- ให้คะแนนตาม criteria ที่กำหนด ไม่ตามความชอบส่วนตัว
- ระบุความไม่แน่ใจ ถ้า abstraction จำเป็นหรือไม่ชัดเจน
- ทุก recommendation ต้อง concrete และ actionable

### 5. Hardcode Exclusions

- ไม่นับค่า 0, 1, -1 เป็น magic numbers
- ไม่นับ user-facing messages และ UI labels เป็น hardcoded strings
- ไม่นับ test fixtures และ test data เป็น hardcode
- ไม่นับ type definitions และ interface defaults เป็น hardcode
- ไม่นับ constants ที่มีอยู่แล้วใน constants files

### 6. Aggregation

- รวม findings จาก script และ sub-workflows เป็น single report
- ไม่ duplicate findings — ถ้าหลาย source เจอ issue เดียวกัน ให้รวมเป็นหนึ่ง
- จัดลำดับ findings ตาม severity และ impact

### 7. Skip Conditions

- ข้าม sub-workflow ที่ไม่เกี่ยวข้องกับ project
- ถ้าไม่มี TypeScript → ข้าม type design checks
- ถ้าไม่มี generics → ข้าม generics checks
- ถ้าไม่มี discriminated unions → ข้าม exhaustive union checks
- ถ้า project ไม่มี skill files → ข้าม skill file structure checks
- ถ้าพบ critical issues ระหว่าง sub-workflow → หยุดและ validate ก่อนดำเนินต่อ

### 8. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
- ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⚠️ มี warning
- ตอบในแชทเท่านั้น ไม่สร้างไฟล์แยก

## Expected Outcome

- รายงานตาราง Quality Metrics Summary พร้อม status indicators
- รายงาน Findings by Category พร้อม severity และ location
- รายงาน Recommended Actions พร้อม priority และ workflow
- Review score พร้อม grade และ progress bar ตาม `references/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
