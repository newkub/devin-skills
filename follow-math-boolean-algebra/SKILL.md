---
name: follow-math-boolean-algebra
description: เข้าใจและ simplify boolean expressions, logic gates, Karnaugh maps ใน programming
argument-hint: "[expression]"
related:
  - follow-math-propositional-logic
  - follow-math-concepts
  - follow-debugging
  - follow-software-engineering
---

## Goal

เข้าใจ boolean algebra ลด/simplify boolean expressions ใช้ De Morgan, distributive, absorption และ Karnaugh maps เพื่อลด complexity ของ conditions

## Scope

- ใช้กับ if/else, guard clauses, assertions, feature flags
- ครอบคลุบ AND, OR, NOT, XOR, NAND, NOR, XNOR
- ใช้ laws: identity, null, idempotent, inverse, commutative, associative, distributive, absorption, De Morgan
- แนะนำ Karnaugh map สำหรับ 2-4 variables

## Execute

### 1. Parse Expression

> Goal: แปลง expression เป็น canonical form

1. ระบุ variables เช่น `A`, `B`, `C`
2. ระบุ operators ทีใช้: `&&`, `||`, `!`, `^`
3. สร้าง truth table ถ้าจำเป็น
4. แปลงเป็น minterms หรือ maxterms

### 2. Apply Boolean Laws

> Goal: ลด expression

1. ใช้ De Morgan: `!(A && B) = !A || !B`, `!(A || B) = !A && !B`
2. ใช้ absorption: `A || (A && B) = A`, `A && (A || B) = A`
3. ใช้ distributive: `A && (B || C) = (A && B) || (A && C)`
4. ลบ double negation: `!!A = A`
5. ใช้ consensus theorem: `(A && B) || (!A && C) || (B && C) = (A && B) || (!A && C)`

### 3. Karnaugh Map Simplification

> Goal: หา minimal expression

1. วาด K-map ตามจำนวน variables
2. ลงค่า 1 จาก truth table
3. จับกลุ่ม 1s เป็นกลุ่มของ 2, 4, 8
4. อ่าน product term ของแต่ละกลุ่ม
5. OR terms ทั้งหมด

### 4. Map To Code

> Goal: แปลงเป็น code

1. แปลง `A || (!A && B)` → `A || B`
2. แปลง `if (cond1 && cond2) || (cond1 && !cond2)` → `if (cond1)`
3. ใช้ guard clauses แทน nested if
4. ใช้ boolean algebra ตรวจ dead code

## Rules

### 1. Operator Precedence

- `!` > `&&` > `||` > `^`
- ใช้ parentheses เพื่อความชัดเจน

### 2. Laws

- ไม่ลืม De Morgan เมื่อ negate AND/OR
- ตรวจ absorption ก่อน split
- ใช้ K-map ถ้ามี 4 variables ขึ้นไป

### 3. Code Mapping

- `&&` = AND, `||` = OR, `!` = NOT, `^` = XOR
- ternary `? :` เป็น multiplexer
- ห้าม over-simplify จนทำให้คนอ่านไม่เข้าใจ

## Expected Outcome

- สามารถลด boolean expression ให้ minimal
- สามารถใช้ K-map สำหรับ 2-4 variables
- สามารถ map ไปยัง if/else / guard clauses
- สามารถตรวจ dead code / tautology ใน conditions
