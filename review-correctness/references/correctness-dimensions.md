# Correctness Review Dimensions

## Goal

Reference สำหรับ dimensions ทีต้องตรวจสอบใน `/review-correctness`

## Scope

ครอบคลุม requirements, contracts, types, logic, concurrency, data transformations, และ tests

## Requirements And Contracts

1. เปรียบเทียบ expected behavior จาก requirements กับ code
2. ตรวจ preconditions และ postconditions ของ functions
3. ตรวจ invariants ของ data structures และ state machines
4. ตรวจ business rules, validation rules, authorization rules
5. ตรวจ API contracts: request/response schemas, status codes, error payloads

## Type And Static Correctness

1. รัน typecheck ให้ผ่าน
2. ตรวจ `any`, `as`, `!`, unsafe narrowing
3. ตรวจ generic constraints และ type inference
4. ตรวจ discriminated unions และ exhaustive checks
5. ตรวจ `null`/`undefined` safety ก่อน access

## Logic And Edge Cases

1. ตรวจ `if/else`, `switch`, loops ว่าครอบคลุมทุก case
2. ตรวจ calculations, rounding, floating-point, date/time
3. ตรวจ boundary values: min, max, min-1, max+1, zero, negative, empty
4. ตรวจ default values และ fallback paths
5. ตรวจ error handling: catch, finally, recovery

## Concurrency And State

1. ตรวจ race conditions บน shared mutable state
2. ตรวจ atomicity ของ read-modify-write
3. ตรวจ async cancellation, timeouts, resource cleanup
4. ตรวจ ordering ของ events และ side effects
5. ตรวจ deadlocks, livelocks, starvation

## Data Transformation And Serialization

1. ตรวจ schema validation ก่อนใช้ข้อมูล
2. ตรวจ input sanitization และ type coercion
3. ตรวจ serialization/deserialization ระหว่าง layers
4. ตรวจ idempotency และ consistency
5. ตรวจ migrations และ backwards compatibility

## Test Correctness

1. ตรวจว่า tests ตรงกับ requirements
2. ตรวจว่า assertions ตรวจสิ่งที่ต้องการ
3. ตรวจ edge cases ใน tests
4. ตรวจ regression tests สำหรับ bugs เก่า
5. ตรวจว่า tests ไม่ tautological

## Severity Mapping

- Critical: wrong business logic, broken invariant, data loss, unsafe type bypass on critical path, race condition on critical state
- High: off-by-one, missing edge case, incorrect transformation, incomplete control flow, wrong assertion
- Medium: implicit assumption, missing boundary check, weak validation, missing fallback on non-critical path
- Low: naming causing misunderstanding, documentation gap, minor improvement

## Rules

- ทุก dimension ต้องมี evidence จาก code หรือ test
- ข้าม dimension ที่ไม่เกี่ยวข้องกับ project
- ไม่ซ้ำซ้อนกับ `/review-security`, `/review-performance`, `/review-stability`

## Expected Outcome

- ระบุ gaps ของ correctness ทุก dimension
- ระบุ severity และ recommendation ชัดเจน
