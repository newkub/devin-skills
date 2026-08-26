# Bug-Prone Pattern Criteria

criteria สำหรับตรวจจับรูปแบบโค้ดที่มีแนวโน้มก่อให้เกิด bugs

## Null/Undefined Safety

- การเข้าถึงค่าที่อาจเป็น `null`/`undefined` โดยไม่มี fallback
- optional chaining ไม่มี fallback
- non-null assertions

## Type Assertions And Casting

- type assertions, `as`, `any`, unsafe narrowing
- type assertion ที่ bypass type safety

## Exhaustive Control Flow

- non-exhaustive `switch`/`if-else` หรือ discriminated unions ที่ขาด case
- missing default branch

## Numeric/Date/Arithmetic Operations

- off-by-one errors
- array indexing errors
- date/time calculation errors
- floating-point precision issues
- monetary calculation errors

## Mutable State And Side Effects

- mutable shared state, global state
- side effects ใน pure functions

## Async Promise Handling

- floating promises
- missing `await`
- `Promise` ใน boolean expression
- `await` ในเงื่อนไขที่ไม่เหมาะสม

## Parse/Serialize/Regex Safety

- `JSON.parse` ไม่มี `try-catch`
- unsafe `eval`
- regex ที่ไม่ validated

## Resource Cleanup And Assumptions

- event listeners, subscriptions, timers, intervals ที่ไม่ถูก cleanup
- implicit assumptions
- unsafe defaults

## Severity

- Critical: การเข้าถึง `null`/`undefined` ใน critical path, type assertion ที่ bypass type safety, floating promise ที่ lead to unhandled rejection, `JSON.parse`/`eval` ที่ไม่ผ่าน validation ใน critical path
- High: ขาด exhaustive handling, off-by-one ใน loop, unsafe default ใน critical path, missing resource cleanup ที่ก่อให้เกิด leak
- Medium: optional chaining ไม่มี fallback, regex ที่อันตราย, unsafe narrowing, implicit assumption ใน non-critical path
- Low: missing fallback, minor assumption, documentation gap

## Scope Boundaries

- ไม่ซ้ำกับ `update-review-cli-and-run` สำหรับ race condition, deadlock, parallel execution
- ไม่ซ้ำกับ `update-review-cli-and-run` สำหรับ error boundaries, error messages, graceful degradation
- ถ้าพบ issues ในหมวดเหล่านั้น ให้ส่งต่อไปยัง `/update-review-cli-and-run`
