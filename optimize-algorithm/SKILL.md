---
name: optimize-algorithm
description: ปรับปรุง algorithms: time complexity, space complexity, data structures, hot paths
argument-hint: "[function-or-module]"
related:
  - run-test
---

## Goal

ปรับปรุง algorithms: time complexity, space complexity, data structures, hot paths

## Scope

ใช้กับ functions/modules ทีมี performance bottleneck โดย profile แล้ว refactor

## Execute

### 1. Identify Hot Paths

> Goal: Identify Hot Paths

1. ใช้ profiler หรือ logs
2. ระบุ functions ที call บ่อยหรือ slow
3. หา nested loops, O(n^2) patterns

### 2. Choose Better Data Structures

> Goal: Choose Better Data Structures

1. ใช้ `Map`/`Set` แทน arrays สำหรับ lookup
2. ใช้ sorted arrays ถ้าจำเป็นต้อง search
3. ใช้ `Int32Array` ถ้าเหมาะสม

### 3. Reduce Complexity

> Goal: Reduce Complexity

1. ลด nested loops
2. ใช้ memoization สำหรับ repeated calculations
3. ใช้ early exit
4. ใช้ binary search แทน linear search

### 4. Profile And Compare

> Goal: Profile And Compare

1. วัด baseline
2. วัดหลัง optimize
3. ใช้ benchmarks ถ้าจำเป็น

### 5. Validate

> Goal: Validate

1. รัน `/run-test`
2. ตรวจว่า output เหมือนเดิม
3. ทำ `/report-table` สรุป

## Rules

- วัดก่อน/หลัง
- รักษา correctness
- ไม่ over-optimize cold paths

## Expected Outcome

- Time complexity ลดลง
- Space complexity ลดลง
- Hot paths เร็วขึ้น
