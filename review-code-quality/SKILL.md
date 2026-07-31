---
name: review-code-quality
description: Review code quality ครอบคลุม static analysis, architecture, types, naming, readability, hardcode, refactor, testability, techstack, dependencies, consistency พร้อม health score
---

## Goal

Review code quality ครอบคลุมทุก dimension ผ่าน static analysis และ sub-workflows พร้อม aggregate findings, health score และ action items

## Scope

code quality review สำหรับ: static analysis (lint, typecheck, code smells, duplication, unused code, circular dependencies, file complexity, SRP violations, refactoring, testability, implementation completeness, missing features), architecture (patterns, boundaries, coupling, SOLID, design patterns, anti-patterns), types (generics, inference, discriminated unions, branded types, type narrowing, type safety, `as const`), naming (variable, function, class, file, directory, API endpoint, database, consistency), readability (function length, parameter count, nesting depth, cognitive complexity, naming clarity, self-documenting code, comment quality), hardcode (magic numbers, hardcoded strings, URLs, paths, secrets, business rules, feature flags), refactor, bug-prone, deprecation, realize implementation, techstack (framework, library, runtime, dependencies, versions, vulnerabilities, unused packages), consistency (cross-module patterns, coding style, folder structure, import/export)

## Execute

### 1. Prepare

เตรียมความพร้อมก่อน review

> Goal: เข้าใจ project structure, tools และ scope

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ tech stack
2. อ่าน `AGENTS.md` เพื่อทราบ tools ที่ใช้ใน project
3. ระบุ quality tools ที่มี: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`

### 2. Deep Analyze

รวบรวม metrics ผ่าน script automation และ sub-workflows

> Goal: รวบรวม findings จากทุก dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-codebase-health-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter @booking/tools-health health:json` เพื่อดึง health report พร้อม metrics
4. ทำ `/run-health` เพื่อรัน health CLI และดึง metrics ล่าสุด
5. Analyzer รัน static analysis tools แบบ lint, typecheck, ast-grep scan, knip, jscpd, madge
6. Analyzer วิเคราะห์ code smells: `any` type, `console.log`, TODO/FIXME/HACK, ignore comments
7. Analyzer ตรวจสอบ SRP violations, code duplication, long files, complex functions, และ coupling issues
8. Analyzer ตรวจสอบ TODO, FIXME, MOCK, STUB, placeholder patterns, และ unimplemented interfaces
9. Health CLI คำนวณ health score จาก health report
10. ถ้า health CLI ไม่ผ่าน → ทำ `/update-codebase-health-cli` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report
11. ทำ `/review-architecture` เพื่อ review patterns, boundaries, coupling, design patterns, anti-patterns, SOLID, concurrency, scalability
12. ทำ `/review-types` เพื่อ review type design: generics, type inference, discriminated unions, type narrowing, branded types, type safety, `as const`, exhaustive checks, `any` usage, type assertions, readonly/immutable patterns
13. ทำ `/review-naming` เพื่อ review naming conventions: variable, function, class, file, directory, API endpoint, database naming, prefix/suffix conventions, cross-layer consistency, naming clarity
14. Analyzer ตรวจสอบ readability: function length เกิน 50 บรรทัด, parameter count เกิน 4, nesting depth เกิน 3 ระดับ, cognitive complexity (chained ternary, nested conditions), naming clarity (`data`, `temp`, single-letter names), self-documenting code (magic numbers ไม่มี named constant, complex expressions ไม่มี intermediate variable), comment quality (redundant, stale, missing on complex logic), consistent patterns
15. Analyzer ตรวจสอบ hardcode: magic numbers ที่ไม่มี named constant (ไม่นับ 0, 1, -1), hardcoded strings ที่ไม่ใช่ user messages, hardcoded URLs/API endpoints ที่ควรเป็น env vars, hardcoded file paths, hardcoded secrets/API keys/tokens/credentials, hardcoded business rules (thresholds, limits, timeouts, rates), hardcoded feature flags
16. ทำ `/review-refactor` เพื่อ review SRP violations, duplication, complexity, coupling, dead code, code smells, testability (dependency injection, pure functions, side effect isolation, test setup complexity)
17. ทำ `/review-bug-prone` เพื่อ review null safety, type assertions, exhaustive control flow, async/promise bugs
18. ทำ `/review-delivery` เพื่อ review deprecation policy, backward compatibility, migration guides, breaking changes, และ JSDoc/TSDoc completeness, inline comment quality, public API documentation (Section 2: Documentation Review)
19. ทำ `/review-realize-implementation` เพื่อ review TODO, MOCK, STUB, placeholder, unfinished features, missing features (API/database มีแล้วแต่ UX/UI ยังไม่สมบูรณ์)
20. ทำ `/review-techstack` เพื่อ review framework, library, runtime compatibility, technology alignment, dependency versions, vulnerabilities, unused packages
21. ทำ `/review-lib` เพื่อ review library design, API surface, bundle size, tree-shaking, peer deps, semver, export strategy (ถ้า project เป็น library)
22. ทำ `/review-concurrency` เพื่อ review async/await, race conditions, deadlocks, parallel execution, shared state, timeout strategies
23. ทำ `/review-error-handling` เพื่อ review error boundaries, try-catch coverage, unhandled rejections, error messages, error recovery
24. ทำ `/review-config` เพื่อ review cross-module config consistency, coding style, import/export patterns, folder structure, directory organization, module boundaries, import paths

### 3. Validate Findings

ตรวจสอบความถูกต้องของ findings จากทุก source

> Goal: Findings ถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จาก script และ sub-workflows
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ระบุ false positives ที่พบ

### 4. Simplify Findings

ทำให้ findings อ่านง่าย ไม่ซ้ำซ้อน กรอง noise

> Goal: Findings กระชับ อ่านง่าย ไม่มี noise

1. ทำ `/simplify` กับ findings ก่อน report — ลดความซับซ้อนโดยไม่เสีย context สำคัญ
2. กรอง findings ที่เป็น noise หรือ low-value ออกจาก report หลัก
3. รวม findings ที่ซ้ำกันจากหลาย sub-workflows เป็น single finding
4. จัดกลุ่ม findings ที่เกี่ยวข้องเข้าด้วยกันเพื่ออ่านง่าย

### 5. Report

สร้างรายงานตารางตาม `/report-format-table`
> Goal: รายงานชัดเจน ครบทุก dimension พร้อม health score

1. ทำ `/report` พร้อม `/report-format-table`
2. สร้างตาราง Quality Metrics Summary: 14 metrics พร้อม count, threshold, status
3. สร้างตาราง Findings by Category: Category, Finding, Severity, Location, Recommendation
4. สร้างตาราง Recommended Actions: Priority, Action, Impact, Effort, Workflow
5. แสดง health score พร้อม progress bar และ grade
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 6. Implement All

ตรวจสอบว่า findings ที่พบสามารถ implement ได้จริง

> Goal: ไม่มี TODO, MOCK, STUB, placeholder ค้างอยู่หลัง review

1. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

### 1. Severity Classification

- Critical: blocking production, security risk, data loss, circular dependency, core feature not implemented, MOCK in production path, `any` in critical path, type safety bypass, unsafe assertion, hardcoded secrets/API keys/tokens/credentials, function เกิน 200 บรรทัด, nesting เกิน 5 ระดับ, logic ที่อ่านแล้วเข้าใจผิดได้ง่าย, inconsistent naming ที่ก่อให้เกิด bug, misleading name
- High: core functionality at risk, type safety violation, high duplication, long file ที่อ่านยาก, TODO in critical path, stub function in use, missing type constraint, poor generic design, missing discriminated union, hardcoded URLs/API endpoints, hardcoded business rules ที่ต้องเปลี่ยนตาม environment, hardcoded feature flags, function เกิน 50 บรรทัด, parameter เกิน 4 ตัว, naming ที่สื่อผิด, cognitive complexity สูงใน critical path, inconsistent convention across layer
- Medium: code quality issue, minor gap, not following best practice, code smell, moderate coupling, TODO in non-critical path, partial implementation, unnecessary assertion, missing branded type, suboptimal inference, magic numbers ที่ใช้ซ้ำในหลายที่, hardcoded strings ที่ควรเป็น constants, hardcoded file paths, function 30-50 บรรทัด, nesting 3-4 ระดับ, redundant comments, inconsistent pattern ในไฟล์เดียวกัน, minor naming inconsistency
- Low: cosmetic, naming, minor improvement, minor type improvement, magic numbers ที่ใช้ครั้งเดียวใน context ชัดเจน, naming ที่สื่อได้แต่ไม่ชัด, missing comment บน minor logic

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

### 3. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก fix process
- ถ้าต้องแก้ไข ให้ทำ `/resolve-errors` หลัง review

### 4. Health Score Formula

- 14 metrics หลัก แต่ละ metric มีน้ำหนักเท่ากัน
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Health score = (total score / 14) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

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
- ถ้าไม่มี TypeScript → ข้าม type design checks ใน Step 2 item 8
- ถ้าพบ critical issues ระหว่าง sub-workflow → หยุดและ validate ก่อนดำเนินต่อ

### 8. Report Format

- ใช้ `/report` และ `/report-format-table` สำหรับ structured output
- ตอบในแชทเท่านั้น ไม่สร้างไฟล์แยก
- ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⚠️ มี warning

### 9. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง Quality Metrics Summary พร้อม status indicators
- รายงาน Findings by Category พร้อม severity และ location
- รายงาน Recommended Actions พร้อม priority และ workflow
- Health score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
