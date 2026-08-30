---
name: follow-math-proofs
description: ใช้ proof techniques induction, contradiction, contrapositive ในการตรวจ invariants และ correctness
argument-hint: "[statement]"
related:
  - follow-math-propositional-logic
  - follow-math-predicate-logic
  - follow-test
  - follow-tdd
  - follow-deterministic
  - follow-math-concepts
---

## Goal

เข้าใจ proof techniques: direct proof, proof by contradiction, contrapositive, mathematical induction, strong induction และประยุกต์ใช้ตรวจ correctness, invariants, algorithms

## Scope

- ใช้สำหรับ verify invariants, loop correctness, algorithm correctness
- ครอบคลุม direct, contradiction, contrapositive, induction
- ประยุกต์ใน formal reasoning และ prompts

## Execute

### 1. Choose Proof Technique

> Goal: เลือกวิธีทีเหมาะสม

1. Direct proof: สรุปจาก assumptions ไป conclusion โดยตรง
2. Contradiction: สมมติ conclusion ผิด แสดงว้า contradiction
3. Contrapositive: แสดง `¬Q → ¬P` แทน `P → Q`
4. Induction: สำหรับ statements บน natural numbers/structures

### 2. Proof By Induction

> Goal: พิสูจน์สำหรับทุก n

1. Base case: พิสูจน์ P(0) หรือ P(1)
2. Inductive hypothesis: สมมติ P(k)
3. Inductive step: แสดง P(k) → P(k+1)
4. สรุป P(n) สำหรับทุก n
5. Strong induction: สมมติ P(0)...P(k) แล้วแสดง P(k+1)

### 3. Loop Invariants

> Goal: ตรวจ correctness ของ loop

1. ระบุ invariant: เงื่อนไขทีเป็นจริงก่อน loop, ทุ้ก iteration, และหลัง loop
2. Initialization: invariant เป็นจริงก่อน loop
3. Maintenance: ถ้า invariant เป็นจริงก่อน iteration จะเป็นจริงหลัง iteration
4. Termination: เมื่อ loop จบ invariant ให้คุณสมบัติทีต้องการ

### 4. Contradiction In Code

> Goal: ใช้ contradiction ใน debugging

1. สมมติสาเหตุของ bug ผิด
2. แสดงว่าถ้าสมมตินั้นจริง จะเกิด contradiction
3. สรุปสาเหตุต้องถูก
4. ใช้กับ unit tests ทีทำลาย assumption

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. พิสูจน์ algorithm ที correct (binary search, sorting)
2. ตรวจ loop invariants ก่อน refactor
3. ใช้ induction พิสูจน์ recursive function
4. ใช้ proof ใน formal verification / prompts

## Rules

### 1. Base Case Matters

- ตรวจ base case ใน induction
- ระวัง off-by-one
- ทดสอบ base case ด้วย code/test

### 2. Clear Assumptions

- ระบุ assumptions ให้ชัด
- ห้ามใช้ conclusion ของ theorem ก่อนพิสูจน์
- แยก given กับ to-prove

### 3. Code Mapping

- invariants = assertions ก่อน/ใน/หลัง loop
- ใช้ property-based testing ยืนยัน invariants
- ใช้ formal methods ถ้าจำเป็น

- ใช้ /follow-math-propositional-logic ถ้าจำเป็น
- ใช้ /follow-math-predicate-logic ถ้าจำเป็น
- ใช้ /follow-test ถ้าจำเป็น
- ใช้ /follow-tdd ถ้าจำเป็น
- ใช้ /follow-deterministic ถ้าจำเป็น
- ใช้ /follow-math-concepts ถ้าจำเป็น

## Expected Outcome

- สามารถเลือก proof technique ทีเหมาะสม
- สามารถใช้ induction กับ natural numbers และ data structures
- สามารถตรวจ loop invariants
- สามารถใช้ proof ใน code correctness
