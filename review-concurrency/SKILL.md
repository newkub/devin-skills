---
name: review-concurrency
description: Review async/await, race conditions, shared state, atomic operations, deadlock prevention, timeout, parallel execution safety
---

## Goal

Review concurrency ครอบคลุม async/await, race conditions, shared state, deadlocks, parallel execution พร้อม health score

## Scope

concurrency review สำหรับ: async/await patterns, promise handling, race conditions, shared state access, atomic operations, deadlock prevention, lock ordering, timeout strategies, parallel execution safety, concurrent resource access, worker threads, shared memory, mutex/semaphore patterns, concurrent rate limiting

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ concurrency patterns ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ concurrency structure
2. ระบุ async patterns, concurrency primitives (Promise.all, Promise.race, AbortController), worker setup, shared state mechanisms ที่ใช้
3. ถ้า project ไม่มี async operations → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก concurrency dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ concurrency patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Async And Promise Review

> Goal: ครอบคลุม async/await, promise handling, race conditions

1. ตรวจสอบ async/await patterns: missing await, unhandled promise rejection, async error propagation, async void, async function return type, await in loop (sequential vs parallel)
2. ตรวจสอบ promise handling: Promise.all vs Promise.allSettled, Promise.race usage, unhandled rejection, floating promises, promise chain readability, promise cancellation
3. ตรวจสอบ race conditions: shared state mutation, read-then-write patterns, check-then-act patterns, TOCTOU (time-of-check to time-of-use), concurrent modification, stale closure in async
4. ตรวจสอบ AbortController: cancellation support, abort signal propagation, abort on unmount, abort on timeout, cleanup on abort
5. Critical: race condition ใน critical path, missing await ที่ก่อให้เกิด error, unhandled rejection ใน critical path, floating promise ใน critical path
6. High: missing await ใน non-critical path, missing cancellation, stale closure, sequential await ที่ควรเป็น parallel, missing AbortController

### 4. Shared State, Deadlock And Parallel Execution Review

> Goal: ครอบคลุม shared state, deadlock, parallel execution, timeout

1. ตรวจสอบ shared state access: shared mutable state, concurrent state mutation, state isolation, immutable state patterns, atomic state updates, state synchronization
2. ตรวจสอบ deadlock prevention: lock ordering, nested locks, lock timeout, deadlock detection, circular wait prevention, resource ordering
3. ตรวจสอบ atomic operations: atomic read-modify-write, compare-and-swap patterns, atomic flag, transaction isolation, optimistic concurrency control
4. ตรวจสอบ timeout strategies: timeout on async operations, timeout on external calls, timeout on locks, timeout propagation, timeout vs cancellation
5. ตรวจสอบ parallel execution safety: Promise.all error handling, partial failure handling, parallel resource access, worker thread safety, shared array buffer safety
6. ตรวจสอบ concurrent rate limiting: concurrent request limits, semaphore patterns, backpressure handling, queue depth limits
7. Critical: deadlock risk, shared mutable state ที่ break ใน multi-instance, race condition ใน critical path, no timeout on lock, unbounded parallel execution
8. High: missing timeout on external call, shared state mutation, missing concurrent rate limiting, missing backpressure, partial failure ที่ไม่ handle

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี async operations → ข้ามทั้งหมด
- ถ้า project ไม่มี shared state → ข้าม Step 4 item 1
- ถ้า project ไม่มี locks → ข้าม Step 4 item 2
- ถ้า project ไม่มี parallel execution → ข้าม Step 4 item 5
- ถ้า project ไม่มี worker threads → ข้าม worker thread checks

### 2. Severity Classification

- Critical: race condition ใน critical path, missing await ที่ก่อให้เกิด error, unhandled rejection ใน critical path, deadlock risk, shared mutable state ที่ break ใน multi-instance, no timeout on lock, unbounded parallel execution
- High: missing await ใน non-critical path, missing cancellation, stale closure, sequential await ที่ควรเป็น parallel, missing AbortController, missing timeout, shared state mutation, missing concurrent rate limiting
- Medium: suboptimal parallel execution, minor race condition ใน non-critical path, missing backpressure, suboptimal cancellation
- Low: cosmetic, minor async improvement, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ async function, promise chain, หรือ shared state ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก concurrency section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
