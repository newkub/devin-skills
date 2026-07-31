---
name: follow-deterministic
description: พัฒนาโปรเจกต์ด้วย deterministic programming พร้อม predictable outputs, no randomness
---

## Goal

พัฒนาโปรเจกต์ด้วย deterministic programming เพื่อให้โค้ดให้ผลลัพธ์เหมือนกันเสมอเมื่อ input เดิม

## Execute

### 1. Use Pure Functions

เขียนฟังก์ชันที่ deterministic เสมอ

1. หลีกเลี่ยง `randomness`: `Math.random()`, `Date.now()`, external entropy
2. หลีกเลี่ยง `side effects`: I/O, network calls, mutations
3. Return ค่าเดิมเสมอเมื่อ input เดิม
4. ใช้ `seeded random` สำหรับ deterministic randomness
5. Isolate non-deterministic operations

### 2. Manage External State

จัดการ external state อย่างเหมาะสม

1. Inject external dependencies ผ่าน parameters
2. ใช้ dependency injection สำหรับ external services
3. Mock external state สำหรับ testing
4. ใช้ deterministic mocks สำหรับ non-deterministic operations
5. Document external dependencies อย่างชัดเจน

### 3. Control Time Dependencies

จัดการ time-dependent operations

1. ใช้ deterministic time sources สำหรับ testing
2. Inject time/clock dependencies
3. หลีกเลี่ยง reliance บน real-time
4. ใช้ virtual time สำหรับ async operations
5. Document time dependencies อย่างชัดเจน

### 4. Handle Concurrency

จัดการ concurrent operations อย่าง deterministic

1. ใช้ deterministic ordering สำหรับ async operations
2. หลีกเลี่ยง race conditions
3. ใช้ synchronization mechanisms อย่างชัดเจน
4. Test concurrent scenarios อย่างครบถ้วน
5. Document concurrency assumptions

### 5. Input Validation

ตรวจสอบ inputs อย่างเข้มงวด

1. Validate inputs ก่อน processing
2. ใช้ type validation สำหรับ type safety
3. Handle edge cases อย่างชัดเจน
4. Document input requirements
5. Return predictable errors สำหรับ invalid inputs

### 6. Error Handling

จัดการ errors อย่าง deterministic

1. Return consistent error types
2. ใช้ typed errors สำหรับ predictability
3. Document error scenarios
4. Handle errors อย่าง consistent
5. Test error paths อย่างครบถ้วน

### 7. Testing

เขียน tests สำหรับ deterministic behavior

1. Test input/output pairs
2. Test edge cases อย่างครบถ้วน
3. Mock external dependencies
4. ใช้ deterministic test data
5. Verify consistent outputs

## Rules

### Pure Functions

ฟังก์ชันต้อง deterministic เมื่อเป็นไปได้

- ไม่ใช้ `randomness`
- ไม่มี `side effects`
- Return ค่าเดิมเมื่อ `input` เดิม
- Isolate `non-deterministic` operations
- ใช้ `seeded random` เมื่อจำเป็น

### External State

จัดการ external state อย่างเหมาะสม

- Inject `dependencies`
- Use `dependency injection`
- Mock `external state`
- Document `dependencies`
- Isolate `non-deterministic` code

### Time Dependencies

จัดการ time-dependent operations

- Inject `time/clock`
- Use `deterministic time` สำหรับ testing
- Avoid `real-time` reliance
- Use `virtual time`
- Document `time dependencies`

### Concurrency

จัดการ concurrent operations อย่าง deterministic

- Use `deterministic ordering`
- Avoid `race conditions`
- Use `synchronization`
- Test `concurrent` scenarios
- Document `concurrency` assumptions

### Input Validation

ตรวจสอบ inputs อย่างเข้มงวด

- Validate `inputs`
- Use `type validation`
- Handle `edge cases`
- Document `requirements`
- Return `predictable errors`

### Error Handling

จัดการ errors อย่าง deterministic

- Return `consistent` error types
- Use `typed errors`
- Document `error scenarios`
- Handle `consistently`
- Test `error paths`

## Expected Outcome

- Functions ที่ deterministic
- Predictable outputs สำหรับ given inputs
- Consistent behavior ทุกครั้ง
- Tests ที่ reliable
- Error handling ที่ predictable
- Code ที่ debug ได้ง่าย
- Reproducible behavior
