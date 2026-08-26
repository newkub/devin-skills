---
name: follow-math-algorithm-complexity
description: วิเคราะห์ Big O, Omega, Theta, recurrence และ Master theorem สำหรับ algorithms
argument-hint: "[code-or-algorithm]"
related:
  - follow-algorithms
  - follow-data-structures
  - follow-test
  - follow-math-concepts
---

## Goal

เข้าใจ algorithm complexity: Big O, Omega, Theta, recurrence relations, Master theorem และประยุกต์วิเคราะห์ code

## Scope

- ใช้สำหรับวิเคราะห์ time และ space complexity
- ครอบคลุม best/average/worst case, asymptotic notation
- ประยุกต์ใน loops, recursion, nested data structures

## Execute

### 1. Analyze Iterative Code

> Goal: หา complexity ของ loops

1. นับจำนวน operations ตาม input size `n`
2. สำหรับ nested loops คูณ complexity แต่ละชั้น
3. ลบ constant factors
4. เก็บเทอร์มทีโตเร็วทีสุด
5. ตัวอย่าง: `for` ซ้อน 2 ชั้น = `O(n^2)`

### 2. Analyze Recursive Code

> Goal: หา recurrence

1. เขียน recurrence: `T(n) = aT(n/b) + f(n)`
2. ใช้ Master theorem:
   - case 1: `f(n) < n^log_b(a)` → `O(n^log_b(a))`
   - case 2: `f(n) = n^log_b(a)` → `O(n^log_b(a) log n)`
   - case 3: `f(n) > n^log_b(a)` → `O(f(n))`
3. ใช้ recursion tree ถ้า Master theorem ไม่ตรง

### 3. Compare Complexities

> Goal: เลือก algorithm ทีดีกว่า

1. เรียงลำดับ: `O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n)`
2. ดู constants ถ้า `n` เล็ก
3. ดู space complexity ประกอบ
4. ดู hidden costs เช่น cache, allocations

### 4. Space Complexity

> Goal: วิเคราะห์ memory

1. นับ stack depth สำหรับ recursion
2. นับ auxiliary data structures
3. แยก in-place กับ extra space
4. ระวัง exponential space จาก backtracking

### 5. Map To Code

> Goal: ประยุกต์ในการ improve code

1. หา bottleneck ใน nested loops
2. เลือก data structure ตาม operation complexity
3. ตัด recursion depth ถ้า stack overflow risk
4. ใช้ benchmark ยืนยัน theoretical analysis

## Rules

### 1. Asymptotic Notation

- Big O = upper bound
- Omega = lower bound
- Theta = tight bound
- อย่าใช้ O เมื่อต้องการ Theta

### 2. Input Definition

- ระบุ `n` คืออะไร: length, size, nodes, etc.
- แยก best/average/worst case
- ไม่รวม lower-order terms

### 3. Code Mapping

- `Array.sort()` ปกติ `O(n log n)`
- `Map.get()` `O(1)` average
- nested `filter` + `map` อาจ `O(n^2)` ถ้าไม่ระวัง
- recursive หลาย branch อาจ exponential

## Expected Outcome

- สามารถวิเคราะห์ time/space complexity
- สามารถใช้ Master theorem
- สามารถเปรียบเทียบ algorithms
- สามารถระบุ bottleneck ใน code
