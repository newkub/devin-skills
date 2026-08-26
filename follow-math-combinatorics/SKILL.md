---
name: follow-math-combinatorics
description: ใช้ permutations, combinations, counting principles ใน test cases และ algorithms
argument-hint: "[problem]"
related:
  - follow-math-probability
  - follow-math-algorithm-complexity
  - follow-test
  - follow-algorithms
  - follow-math-concepts
---

## Goal

ใช้ combinatorics เพื่อนับจำนวนวิธี สร้าง test cases วิเคราะห์ brute-force bounds และจัดการ permutations/combinations ใน code

## Scope

- ใช้สำหรับ counting, permutations, combinations, pigeonhole principle
- ครอบคลุม factorial, binomial coefficients, product rule, sum rule
- ประยุกต์ใน test data generation, search space, subsets

## Execute

### 1. Identify Counting Problem

> Goal: รู้ว่าต้องนับอะไร

1. ระบุ objects และจำนวน
2. ระบุว่า order มีความสำคัญหรือไม่
3. ระบุว่า repetition อนุญาตหรือไม่
4. เลือกสูตรทีเหมาะสม

### 2. Apply Formulas

> Goal: คำนวณจำนวน

1. Permutations without repetition: `n!`
2. Permutations with repetition: `n^k`
3. Combinations without repetition: `C(n, k) = n! / (k!(n-k)!)`
4. Combinations with repetition: `C(n+k-1, k)`
5. Product rule: ทำสิ่ง A แล้ว B = `|A| * |B|`
6. Sum rule: A หรือ B = `|A| + |B|`

### 3. Use Pigeonhole Principle

> Goal: หา guarantee / bound

1. ถ้ามี `n` items ใส่ `m` bins และ `n > m` ต้องมี bin ใดมีอย่างน้อย 2 items
2. ใช้ตรวจสอบว่า test ต้องมี duplicate
3. ใช้หา minimum collisions ใน hashing

### 4. Map To Code

> Goal: ประยุกต์ใน code

1. สร้าง test cases ครอบคลุม combination ของ inputs
2. คำนวณ brute-force search space size
3. ใช้ backtracking สำหรับ permutations/combinations
4. ใช้ binomial coefficients ใน dynamic programming

## Rules

### 1. Problem Classification

- ถ้า order สำคัญ → permutation
- ถ้า order ไม่สำคัญ → combination
- ถ้าเลือกได้ซ้ำ → with repetition
- ถ้าเลือกไม่ซ้ำ → without repetition

### 2. Avoid Overflow

- ใช้ `BigInt` หรือ modular arithmetic ถ้าตัวเลขใหญ่
- ใช้ multiplicative formula ของ `C(n,k)` แทน factorial โดยตรง

### 3. Practical Mapping

- `Array.prototype.permutation` สร้างได้ด้วย recursion
- ใช้ bitmask สำหรับ subset/combination ถ้า `n` เล็ก
- ใช้ library ถ้า `n` ใหญ่

## Expected Outcome

- สามารถเลือกสูตร counting ทีเหมาะสม
- สามารถสร้าง test cases จาก combinations/permutations
- สามารถประเมิน search space size
- สามารถใช้ pigeonhole principle ใน debugging
