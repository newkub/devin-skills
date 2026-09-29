---
name: review-backend
description: Orchestrator backend review ครอบคลุม 7 sub-review workflows แบบ parallel
argument-hint: "[scope]"
related:
  - scan-codebase
  - deep-review
  - run-review
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Orchestrate backend review ครอบคลุม API, service, database, data flow, data fetching, data validation, integration ผ่าน 7 sub-review workflows แบบ parallel พร้อม validate findings และ review score

## Scope

ใช้สำหรับ backend review ทั้งหมด — เรียก sub-review workflows โดยตรง ไม่ทำ review เอง — ไม่รวม frontend, infrastructure, หรือ security reviews

ดูเพิ่มเติม: /deep-review

## Execute

### 1. Prepare And Update Rules

> Goal: rules และ analyzers ครอบคลุมล่าสุด

- ทำ `/scan-codebase` เพื่อเข้าใจ backend structure และ stack
- ระบุ API framework, service patterns, database engine, data fetching library, validation library, integration points
- ทำ `/deep-review` เพื่ออัปเดต rules
- รัน `bunx ast-grep scan --inspect summary`
- ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Run Backend Sub-Reviews

> Goal: ครอบคลุมทุก backend dimension แบบ parallel

ทำตาม references แต่ละ dimension:

- `api` → references/api.md
- `service` → references/service.md
- `database` → references/database.md
- `data-flow` → references/data-flow.md
- `data-fetching` → references/data-fetching.md
- `data-validation` → references/data-validation.md
- `integration` → references/integration.md
- `jobs` → references/jobs.md
- `resilience` → references/resilience.md
- `caching` → references/caching.md
- `concurrency` → references/concurrency.md

ข้าม sub-review ที่ไม่เกี่ยวข้องกับ project หรือพบ critical issues ให้หยุดทำ `/deep-validate` ก่อน

### 3. Jobs And Consumers

> Goal: coverage เพิ่มเติมของ domain — ทำตาม `references/jobs.md`

1. queue/job health — dead letters, retry policy, backlog alerts
2. idempotent consumers — redelivery ไม่ double-apply

### 4. Errors Resilience And Caching

> Goal: failure paths และ cache behavior ครบ — ทำตาม `references/resilience.md`, `references/caching.md`

1. error handling — typed errors, error boundaries, status mapping, ไม่ swallow errors
2. resilience — timeouts, retries+backoff, circuit breakers, bulkheads, graceful degradation
3. caching — cache strategy, invalidation, stampede protection, TTLs ต่อ data class

### 5. Concurrency And Transactions

> Goal: shared state ปลอดภัย — ทำตาม `references/concurrency.md`

1. race conditions — check-then-act, shared mutable state, async ordering
2. transactions — atomicity ข้าม writes, isolation levels, lock ordering, deadlocks
3. idempotency — retry-safe endpoints, idempotency keys, dedup

### 6. Validate And Report

> Goal: findings ถูก validate และรายงานเป็นตาราง

- ทำ `/deep-validate` เพื่อ validate findings
- จัดลำดับตาม severity: Critical → High → Medium → Low
- คำนวณ review score, dimension scores และ supplementary metrics ตาม references/scoring.md
- ทำ `/report`
- ทำ `/suggest-next-action`


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `jobs`, `workers`, `consumers` — retries, idempotency, DLQ | `subskills/check-jobs/SKILL.md` |
| `resilience`, `errors`, `caching` — timeouts, retries, breakers | `subskills/check-resilience/SKILL.md` |
| `transactions`, `concurrency` — atomicity, isolation, races | `subskills/check-transactions/SKILL.md` |

## Check: Async Misuse

### Goal

ตรวจหา async/await misuse ที่ทำให้เกิด unhandled rejections, race conditions หรือ fire-and-forget bugs — floating promises, missing `await`, `async` ใน forEach, promise executor anti-patterns

### Scope

- ตรวจ source files ที่มี `async`, `await`, `Promise`, `.then(`, `.catch(`
- Patterns: floating promises, `async` ใน `forEach`/`map` ที่ไม่ `Promise.all`, missing `await` บน promise-returning calls, `new Promise(async ...)`, unhandled `.then()` ไม่มี `.catch`
- Read-only: รายงานอย่างเดียว

### Execute

#### 1. Detect Tooling

> Goal: เลือกเครื่องมือตาม ecosystem

1. TypeScript + ESLint → เช็คว่ามี `@typescript-eslint/no-floating-promises` เปิดอยู่ไหม (`/run-lint`)
2. Biome → `lint/nursery/noFloatingPromises`
3. ถ้าไม่มี typed lint → ใช้ `/use-astgrep` สแกน patterns โดยตรง

#### 2. Scan Patterns

> Goal: หา misuse patterns

1. Expression statements ที่ return promise แต่ไม่ `await`/ไม่ `.catch` → floating promise
2. `forEach(async ...)`, `array.map(async ...)` ที่ไม่ `Promise.all` → ไม่รอผล
3. `new Promise(async (resolve) => ...)` → async executor anti-pattern
4. `await` ใน loop ที่ไม่ขึ้นต่อกัน → sequential โดยไม่จำเป็น (perf note)
5. `.then()` chains ที่ไม่มี `.catch`/`try-catch` → unhandled rejection

#### 3. Report

> Goal: สรุปตาม bug risk

1. ใช้ `/report` คอลัมน์: `No.`, `File:Line`, `Pattern`, `Risk`, `Severity`, `Fix`
2. Severity: `critical` (floating promise ใน request handler), `warning` (missing await), `info` (sequential await)
3. แนะนำ `/follow-asynchronous` สำหรับวิธีแก้แต่ละ pattern

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี `file:line` และ code snippet
- Floating promise ต้อง confirm ว่า return type เป็น promise จริง — ถ้า infer ไม่ได้ให้ mark `needs-typecheck`

#### 2. Read-Only

- ไม่แก้ code — แนะนำ `/follow-asynchronous` หรือ lint autofix

#### 3. Context Aware

- `void promise` / `promise.catch(noop)` = intentional fire-and-forget → ไม่ flag หรือ flag `info`
- Top-level promise ใน entrypoint ที่มี `.catch(process.exit)` → acceptable

- ใช้ /follow-asynchronous สำหรับ best practices
- ใช้ /run-lint รัน linter ที่มีอยู่
- ใช้ /review-stability สำหรับ error handling gaps

### Expected Outcome

- รายการ async misuse พร้อม risk level ต่อ finding
- สรุป lint rules ที่ควรเปิดถ้ายังไม่มี

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `async-misuse` | `## Check: Async Misuse` |

## Rules

1. Delegation
   - Orchestrator เรียก sub-review workflows โดยตรง
   - checklist ของแต่ละ dimension อยู่ใน `references/`
   - ข้าม dimension ที่ project ไม่มี
2. Skip Conditions
   - ข้าม API, service, database, data-flow, data-fetching, data-validation, integration, jobs, resilience, caching, concurrency ตามที่ project ไม่มี
3. Severity Classification
   - Critical: data loss, broken endpoint, unauthenticated endpoint, missing input validation, connection leak
   - High: missing rate limiting, N+1 query, missing DI, race condition
   - Medium: inconsistent naming, suboptimal schema
   - Low: cosmetic, documentation gap
4. Evidence-Based Findings
   - ทุก finding ต้องมี file path และ line number (backend)
5. Review Independence
   - ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (backend)
6. Formatting
   - ห้ามใช้ bold markers — ใช้ backticks
   - รายงานเป็นตารางด้วย `/report`

- ใช้ /review-api ถ้าจำเป็น
- ใช้ /review-database ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-performance ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. จัดลำดับ findings ตาม severity — canonical steps ที่ `../shared/review-fix.md`
2. แก้ตาม finding ด้าน API, service, database, data flow (backend)
3. preserve behavior + verify + report — canonical ที่ `../shared/review-fix.md`

## References

- [Full-dimension checklist](references/checklist.md)

## Expected Outcome

- Findings และ recommendations จาก 7 backend sub-review workflows
- Issues ที่พบถูก validate ตาม severity
- Review score ต่อ dimension และ overall ตาม references/scoring.md
- รายงานในแชทเป็นตาราง
- แนะนำ action ถัดไป
