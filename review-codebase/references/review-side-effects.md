---
name: review-side-effects
description: Review side effects, purity, state management, and functional patterns with severity scoring
related:
  - scan-codebase
  - deep-analyze
  - update-create-review-cli
  - update-rules
  - run-review
  - deep-validate
  - validate
  - report
  - report-table
  - suggest-next-action

---


## Goal

Review side effects, purity, functional core/shell separation, state management, and dependency injection พร้อม review score

## Scope

side effects review สำหรับ: database operations, API calls, file I/O, logging, external state mutations, time operations, randomness, environment access, browser storage, timers, pure/impure separation, functional core and imperative shell, dependency injection, service abstractions, resource management, caching, testability, immutability, state management and predictable behavior

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ side effects patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อหา side effects
2. ระบุ patterns: database, logging, time, randomness, external APIs, file I/O, browser storage, timers, environment, global state mutations
3. ถ้า project ไม่มี side effects → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก side effect dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ side effects
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Side Effects Inventory And Classification Review

> Goal: ครอบคลุมประเภทและตำแหน่งของ side effects

1. ตรวจสอบ database operations: direct queries, ORM calls, transaction boundaries, connection leaks
2. ตรวจสอบ API calls: HTTP clients, external service dependencies, timeout, retry, error handling
3. ตรวจสอบ file I/O: read/write, stream handling, path validation, resource cleanup
4. ตรวจสอบ logging: `console.log` usage, structured logging, log levels, sensitive data logging
5. ตรวจสอบ time and randomness: `Date.now()`, `Math.random()`, hardcoded time, non-deterministic values
6. ตรวจสอบ environment access: `process.env`, global config access, environment coupling
7. ตรวจสอบ browser storage and timers: `localStorage`, `sessionStorage`, `IndexedDB`, `setTimeout`, `setInterval`
8. Critical: side effects in pure business logic, uncontrolled external state mutation, resource leak, missing cleanup
9. High: side effects scattered across core logic, missing timeout/retry, unhandled I/O errors, missing structured logging

### 4. Purity And Core/Shell Separation Review

> Goal: ครอบคลุม pure/impure separation และ functional core

1. ตรวจสอบ pure functions: no side effects, same input/output, no external state read/write
2. ตรวจสอบ impure function boundaries: side effects isolated in shell layer
3. ตรวจสอบ functional core, imperative shell pattern: business logic in core, I/O in shell
4. ตรวจสอบ dependency injection: `Date`, `Math.random`, `Logger`, `Clock`, `Random`, `Env` injectable
5. ตรวจสอบ query vs execution separation: query building pure, query execution impure
6. Critical: business logic mixed with side effects, hidden global state mutation, non-deterministic pure function
7. High: missing dependency injection for impure dependencies, impure function called from pure core, no clear shell boundary

### 5. State Management Review

> Goal: ครอบคลุม state mutation, external state, and predictability

1. ตรวจสอบ external state mutation: global variables, shared mutable state, module-level state
2. ตรวจสอบ input mutation: function parameters mutated, `Readonly<>` missing
3. ตรวจสอบ state ownership: state passed explicitly vs read from global
4. ตรวจสอบ state synchronization: cross-component/cross-tab state sync, cache invalidation
5. ตรวจสอบ predictable state: deterministic state changes, action traceability
6. Critical: hidden global state mutation causing bugs, shared mutable state in concurrent context, state mutation inside pure functions
7. High: missing immutability, deep state mutation, uncontrolled cache invalidation, side effects inside state reducers

### 6. Functional Patterns And Abstractions Review

> Goal: ครอบคลุม service abstractions, resource management, caching, testability

1. ตรวจสอบ service abstractions: `Clock`, `Random`, `Env`, `Logger` interfaces, thin wrappers
2. ตรวจสอบ functional patterns: `Result`/`Either` for error handling, retry, timeout, typed errors
3. ตรวจสอบ resource management: RAII, database/file handle close, timer/interval cleanup, event listener removal
4. ตรวจสอบ caching: memoization for pure functions, TTL, deterministic cache keys, cache invalidation
5. ตรวจสอบ testability: pure functions testable with input/output, impure dependencies mockable
6. ตรวจสอบ immutability: `Readonly<>`, spread instead of mutation, non-mutating array methods
7. Critical: resource leak, untestable side effects, missing cleanup causing crash, hardcoded impure dependency
8. High: missing service abstraction, missing retry/timeout, missing cache invalidation, mixed mutation with spread

### 7. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี side effects → ข้ามทั้งหมด
- ถ้า project ไม่มี database → ข้าม Step 3 item 1
- ถ้า project ไม่มี external API → ข้าม Step 3 item 2
- ถ้า project ไม่มี file I/O → ข้าม Step 3 item 3
- ถ้า project ไม่มี browser context → ข้าม Step 3 item 7
- ถ้า project ไม่มี global/shared state → ข้าม Step 5

### 2. Severity Classification

- Critical: side effects in pure business logic, hidden global state mutation, resource leak, non-deterministic pure function, missing cleanup causing crash, hardcoded impure dependency, state mutation inside pure functions
- High: missing dependency injection, impure function called from pure core, no clear shell boundary, missing timeout/retry, missing structured logging, missing immutability, missing service abstraction, missing cache invalidation
- Medium: suboptimal side effect location, minor non-determinism, missing RAII, partial error handling
- Low: cosmetic, minor naming, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ function, service, side effect type, หรือ state field ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้า issue ซ้อนทับกับ `/review-state-management` หรือ `/review-codebase` → อ้างอิงแทน ไม่ duplicate

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก side effect section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
