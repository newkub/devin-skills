# Fix Guide

(merged from: improve-test-data)

## Goal

ปรับ test data quality — fixtures ที่ realistic, factories ที่ composable, deterministic seeds และลบ data duplication ที่ทำ tests เปราะ

## Scope

- ตรวจ test fixtures, factories, seed data, mock responses, snapshot data
- ครอบคลุม: hardcoded objects ซ้ำๆ, unrealistic data, shared mutable fixtures, missing edge cases, brittle snapshots, non-deterministic data (dates, random)
- Action-oriented: แก้ test data จริง — tests ต้องผ่านเหมือนเดิม

## Execute

### 1. Inventory Test Data

> Goal: map fixtures/factories ที่มีอยู่

1. หา test data sources: `fixtures/`, `factories/`, `__mocks__/`, inline test objects, `*.json` test data
2. นับ duplication — object literals เดิมที่ copy ข้าม test files
3. flag shared mutable state: fixtures ที่ tests แก้ไขแล้ว leak ข้าม test

### 2. Evaluate Quality

> Goal: flag test data issues

1. Duplication: objects ซ้ำใน 3+ tests → ควรเป็น factory/fixture
2. Unrealistic: `test@test.com`, `'foo'`, `'asdf'` ที่ไม่ represent domain
3. Brittle: full-object assertions เมื่อ test สนแค่บาง fields
4. Non-deterministic: `Date.now()`, `Math.random()` ไม่มี seed → flaky
5. Missing edges: ไม่มี empty/null/boundary cases
6. Over-mocked: mocks ที่ต่างจาก reality จน test ไม่มีค่า

### 3. Apply Improvements

> Goal: refactor test data ตาม issues

1. Factories: สร้าง factory functions ด้วย defaults + overrides (`makeUser({ role: 'admin' })`)
2. Deterministic: fixed dates (frozen time), seeded random — ทำ `/follow-lib-fast-check` สำหรับ property-based edge cases
3. Realistic: data ที่ตรง domain invariants (valid formats, realistic ranges)
4. Isolate: fixture ต่อ test หรือ immutable shared fixtures — ไม่มี mutation leaks
5. Edge cases: เพิ่ม empty, boundary, invalid inputs สำหรับ paths สำคัญ
6. API mocks: ใช้ `/follow-tool-msw` สำหรับ HTTP mocks ที่สมจริงแทน inline stubs

### 4. Verify

> Goal: tests ผ่านและเข้าใจง่ายขึ้น

1. `/run-test` ต้องผ่านทั้งหมด — behavior coverage เหมือนเดิมหรือดีขึ้น
2. ตรวจ determinism: รัน suite ซ้ำ 3 ครั้ง ผลต้องเหมือนกัน
3. ใช้ `/report-table` สรุป: `No.`, `Area`, `Change`, `Tests Affected`

## Rules

### 1. Deterministic

- test data ต้อง deterministic — frozen time, seeded random, stable ordering
- ไม่มี shared mutable fixtures ที่ tests แก้ไข

### 2. Preserve Coverage

- ห้ามลบ test cases เพื่อให้ data จัดการง่าย — เพิ่มได้ ลดไม่ได้โดยไม่บอก user
- tests ต้องยังตรวจ behavior เดิม

### 3. Realistic

- data ต้อง represent domain จริง — ไม่ใช่ `'test'`/`'foo'` ทุกที่
- mocks ต้องตรงกับ real contract มากที่สุดเท่าที่เป็นไปได้

## Expected Outcome

- Test data ผ่าน factories/fixtures ที่ reuse ได้
- Tests deterministic — รันซ้ำผลเหมือนเดิม
- Edge cases ครอบคลุมมากขึ้น
- Duplication ลดลงพร้อมตัวเลข
