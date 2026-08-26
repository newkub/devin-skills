---
name: follow-math-numerical-methods
description: จัดการ floating point, rounding, approximation และ precision ใน numerical computing
argument-hint: "[problem]"
related:
  - follow-debugging
  - follow-test
  - follow-math-concepts
---

## Goal

เข้าใจ numerical methods: floating point representation, rounding errors, approximation, interpolation และประยุกต์ใช้ใน code เพื่อความถูกต้องทางคณิตศาสตร์

## Scope

- ใช้สำหรับ financial calc, physics simulation, scientific computing
- ครอบคลุม IEEE 754, epsilon comparison, numerical stability
- แนะนำ Newton-Raphson, bisection, interpolation

## Execute

### 1. Understand Floating Point

> Goal: รู้ข้อจำกัดของ float

1. ตัวเลขทศนิยมใน binary อาจเป็นค่าประมาณ
2. `0.1 + 0.2 !== 0.3` ใน floating point
3. มี single (32-bit) และ double (64-bit) precision
4. มี special values: NaN, Infinity, -0

### 2. Compare Floating Point

> Goal: เปรียบเทียบอย่างปลอดภัย

1. ใช้ absolute epsilon: `abs(a - b) < epsilon`
2. ใช้ relative epsilon ถ้าค่าใหญ่: `abs(a - b) < epsilon * max(abs(a), abs(b))`
3. ใช้ `Number.EPSILON` สำหรับ comparisons ใกล้ 1
4. ระวัง `NaN !== NaN`

### 3. Reduce Rounding Errors

> Goal: ทำให้คำนวณเสถียร

1. บวกเล็กไปก่อน ค่อยบวกใหญ่ (Kahan summation)
2. หลีกเลี่ยง subtraction ของจำนวนใกล้เคียง
3. ใช้ `BigInt` หรือ decimal library สำหรับ financial
4. ใช้ fixed-point arithmetic ถ้าเหมาะสม

### 4. Approximation Methods

> Goal: หาค่าประมาณ

1. Bisection: หารากของฟังก์ชัน
2. Newton-Raphson: เร็วกว่าถ้ามี derivative
3. Linear interpolation: ประมาณค่าระหว่าง 2 จุด
4. Taylor series: ประมาณ functions

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. ใช้ `decimal.js` หรือ `BigNumber` สำหรับเงิน
2. ใช้ epsilon ใน assertions ของ float
3. ใช้ numerical integration สำหรับ simulation
4. ตรวจ overflow/underflow

## Rules

### 1. Never Use Exact Equality For Floats

- `===` กับ float อาจทำให้ test ผิด
- ใช้ epsilon comparison เสมอ

### 2. Choose Right Type

- double precision สำหรับทั่วไป
- decimal/rational สำหรับ financial
- fixed-point สำหรับ embedded

### 3. Code Mapping

- `Math.abs(a - b) < 1e-9` แทน `a === b`
- `Number.isNaN()` สำหรับตรวจ NaN
- ใช้ libraries สำหรับ decimal ถ้าจำเป็น

## Expected Outcome

- สามารถอธิบาย floating point errors
- สามารถเปรียบเทียบ floats อย่างปลอดภัย
- สามารถเลือก type/library ทีเหมาะสม
- สามารถใช้ approximation methods พื้นฐาน
