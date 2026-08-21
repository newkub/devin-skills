---
name: review-formal-verification
description: Review invariants, contracts, property tests, exhaustive checks, static and runtime verification
---

## Goal

Review formal verification ครอบคลุม invariant verification, contract verification, property-based testing, exhaustive verification, static analysis, runtime verification พร้อม review score

## Scope

formal verification review สำหรับ: invariant verification (loop invariants, data invariants, state invariants, assertions), contract verification (preconditions, postconditions, Design by Contract), property-based testing (property coverage, generator quality, shrinking), exhaustive verification (exhaustive pattern matching, state machine completeness, never type), static analysis with formal guarantees (unreachable code, null safety, flow analysis, taint analysis), runtime verification (runtime assertions, invariant monitoring, fail-fast patterns) — ไม่รวม type system design (อยู่ใน `/review-codebase`) และ test coverage/quality (อยู่ใน `/review-codebase`)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ formal verification tools และ patterns ที่ใช้

1. ทำ `/scan-codebase` เพื่อเข้าใจ verification structure
2. ระบุ verification tools: property-based testing libraries (`fast-check`, `Hypothesis`, `QuickCheck`), assertion libraries, SMT solvers (`Z3`), static analyzers, runtime verification tools ที่ใช้
3. ระบุ verification patterns: assertions, invariants, contracts, property tests, exhaustive checks ที่มีใน codebase
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server

### 2. Deep Analyze

> Goal: ครอบคลุมทุก formal verification dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ verification patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Invariant And Contract Verification

> Goal: ครอบคลุม invariants, contracts, assertions, Design by Contract

1. ตรวจสอบ invariant verification: loop invariants (assertions ก่อน/หลัง loop), data invariants (object/array structure assumptions), state invariants (state machine valid states), class invariants (constructor + methods รักษา invariant)
2. ตรวจสอบ contract verification: preconditions (input validation ก่อน execute), postconditions (output guarantees หลัง execute), invariants (state ที่ต้องคงที่), function contracts (input → output mapping guarantees), API contracts (request/response guarantees)
3. ตรวจสอบ assertion usage: assertion coverage ใน critical paths, assertion messages (descriptive บอก what และ why), assertion vs throw (assert สำหรับ impossible states, throw สำหรับ expected errors), assertion stripping ใน production
4. ตรวจสอบ Design by Contract patterns: contract encoding (TypeScript branded types, runtime checks, `Zod` schemas), contract enforcement location (boundary vs internal), contract documentation, contract testing
5. Critical: missing invariant ใน critical path ที่ก่อให้เกิด data corruption, missing precondition ที่ก่อให้เกิด crash, broken contract ที่ก่อให้เกิด incorrect output, assertion ที่เป็น false negative
6. High: missing assertion ใน important path, weak invariant, missing postcondition, inconsistent contract enforcement, missing contract documentation

### 4. Property-Based Testing And Exhaustive Verification

> Goal: ครอบคลุม property-based testing, exhaustive checks, state machine completeness

1. ตรวจสอบ property-based testing: property test coverage (properties ที่ควร hold สำหรับทุก inputs), generator quality (generators ครอบคลุม edge cases, boundary values, random distributions), shrinking (minimizing failing cases), property test vs example test ratio, property test for pure functions และ stateful systems
2. ตรวจสอบ exhaustive verification: exhaustive pattern matching (ทุก case ใน union/enum มี handler), never type usage (default case ใช้ never เพื่อ enforce exhaustiveness), missing case detection (new union member ที่ไม่มี handler), exhaustive switch/if-else chains
3. ตรวจสอบ state machine completeness: state machine transitions (ทุก state มี transition ที่ valid), unreachable states (states ที่ไม่มีทางเข้า), missing transitions (states ที่ไม่มีทางออก), terminal states (states ที่ควรเป็น terminal แต่มี transition), state machine invariant (state ที่ไม่ควรเกิดพร้อมกัน)
4. Critical: missing property test สำหรับ critical function, non-exhaustive pattern matching ใน critical path, unreachable state ที่ก่อให้เกิด bug, missing state transition ที่ก่อให้เกิด stuck state
5. High: weak generator (missing edge cases), missing shrinking, missing exhaustive check ใน important path, incomplete state machine, missing state machine invariant

### 5. Static Analysis And Runtime Verification

> Goal: ครอบคลุม static analysis guarantees, runtime verification, fail-fast patterns

1. ตรวจสอบ static analysis with formal guarantees: unreachable code detection (code ที่ไม่มีทาง execute), null safety verification (null/undefined flow analysis, non-null guarantees), flow analysis (control flow correctness, dead code, redundant conditions), taint analysis (user input → sensitive sink tracking), type-level verification (type narrowing ที่รับประกัน runtime safety)
2. ตรวจสอบ runtime verification: runtime assertions (assertions ที่เช็คที่ runtime ไม่ใช่ compile-time), invariant monitoring (continuous invariant checking ใน hot path), runtime type checks (typeof, instanceof สำหรับ boundary validation), fail-fast patterns (early return/throw เมื่อ invariant เสีย), runtime contract enforcement
3. ตรวจสอบ fail-fast vs fail-safe: fail-fast ใน critical paths (เช็ค invariant แล้ว throw ทันที), fail-safe ใน non-critical paths (graceful degradation), error propagation (error ที่ควร propagate ไม่ใช่ swallow), error recovery (recovery ที่รักษา invariant)
4. Critical: unreachable code ใน critical path ที่ซ่อน bug, null safety gap ที่ก่อให้เกิด crash, taint analysis gap ที่ก่อให้เกิด security issue, missing runtime assertion ใน critical path ที่ก่อให้เกิด silent data corruption
5. High: missing fail-fast ใน important path, missing runtime invariant monitoring, inconsistent fail-fast/fail-safe, missing taint tracking, redundant dead code

### 6. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report-review` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี assertions หรือ invariants → ข้าม Step 3
- ถ้า project ไม่มี property-based testing → ข้าม Step 4 item 1
- ถ้า project ไม่มี state machines → ข้าม Step 4 item 3
- ถ้า project ไม่มี runtime verification → ข้าม Step 5 item 2

### 2. Severity Classification

- Critical: ตามที่ระบุใน Execute steps 3-5 (data corruption, crash, security issue, silent data corruption)
- High: ตามที่ระบุใน Execute steps 3-5 (missing assertion, weak invariant, incomplete state machine, missing fail-fast)
- Medium: missing contract documentation, suboptimal property test coverage, minor dead code, inconsistent fail-fast/fail-safe
- Low: cosmetic, minor assertion message, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ invariant, contract, property, state, หรือ assertion ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้า issue ซ้อนทับกับ `/review-codebase` (type system design) → อ้างอิงแทน ไม่ duplicate
- ถ้า issue ซ้อนทับกับ `/review-codebase` (test coverage/quality) → อ้างอิงแทน ไม่ duplicate

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก formal verification section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
