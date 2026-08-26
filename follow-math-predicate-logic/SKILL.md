---
name: follow-math-predicate-logic
description: เข้าใจและใช้ predicate logic, quantifiers all/some, sets, และ inference ใน programming และ prompts
argument-hint: "[topic]"
related:
  - follow-math-propositional-logic
  - follow-math-concepts
  - follow-math-set-theory
  - debug
  - ask-me
---

## Goal

เข้าใจตรรกศาสตร์ปริมาณ (predicate logic / first-order logic) ได้แก่ predicates, quantifiers, domains, set theory, inference rules และประยุกต์ใช้ใน programming, debugging, database queries, และ prompts

## Scope

- ใช้สำหรับวิเคราะห์ statements ทีมี quantifiers: all, some, none, exactly one
- ครอบคลุม sets, membership, subset, union, intersection, complement
- ครอบคลุม predicates และ quantifiers: ∀ (forall), ∃ (exists), ∃! (exists unique)
- แนะนำ inference rules และ valid/invalid arguments
- ไม่ลงลึก propositional operators เบื้องต้น (ดู `/follow-math-propositional-logic`)

## Execute

### 1. Define Predicates And Domain

> Goal: ระบุ predicates และ domain

1. ระบุ domain ของ discourse เช่น users, orders, posts
2. สร้าง predicate `P(x)` เช่น `IsLoggedIn(x)`, `HasItem(x, y)`
3. แยก constants, variables, predicates
4. ระบุ n-ary predicates ถ้ามี เช่น `GreaterThan(x, y)`

### 2. Use Quantifiers

> Goal: แปลภาษาธรรมชาติเป็น predicate logic

1. `∀x P(x)` — ทุก x มีคุณสมบัติ P (all)
2. `∃x P(x)` — มี x บางตัวมีคุณสมบัติ P (some/exists)
3. `∃!x P(x)` — มี x ตัวเดียว (exists unique)
4. `¬∃x P(x)` ≡ `∀x ¬P(x)` — ไม่มี x ใด (none)
5. `¬∀x P(x)` ≡ `∃x ¬P(x)` — ไม่ใช่ทุก x (not all)
6. แปลงประโยคภาษาธรรมชาติ:
   - "ทุก user ต้องมี email" → `∀u (User(u) → HasEmail(u))`
   - "มี user บางคนเป็น admin" → `∃u (User(u) ∧ Admin(u))`

### 3. Work With Sets

> Goal: ประยุกต์ set theory

1. ระบุ sets: A, B, C, universe U
2. ใช้ operations:
   - union `A ∪ B` — สมาชิกอยู่ใน A หรือ B
   - intersection `A ∩ B` — สมาชิกอยู่ใน A และ B
   - complement `A'` หรือ `U \ A` — สมาชิกไม่อยู่ใน A
   - difference `A \ B` — สมาชิกใน A แต่ไม่อยู่ใน B
3. ใช้ Venn diagrams เพื่อ visualize
4. ระบุ subset, proper subset, equality
5. แปลง predicate เป็น set comprehension เมื่อเหมาะสม

### 4. Negate Quantified Statements

> Goal: หา negation ทีถูกต้อง

1. `¬∀x P(x)` ≡ `∃x ¬P(x)`
2. `¬∃x P(x)` ≡ `∀x ¬P(x)`
3. ใช้กับหลาย quantifiers จากขวาไปซ้าย:
   - `¬∀x ∃y P(x, y)` ≡ `∃x ∀y ¬P(x, y)`
4. ตรวจสอบว่า negation ถูกต้อง

### 5. Apply Inference Rules

> Goal: ให้เหตุผลอย่างถูกต้อง

1. Universal instantiation: จาก `∀x P(x)` สรุป `P(c)`
2. Universal generalization: จาก `P(c)` สำหรับ arbitrary c สรุป `∀x P(x)`
3. Existential instantiation: จาก `∃x P(x)` สรุป `P(c)` สำหรับบาง c (new constant)
4. Existential generalization: จาก `P(c)` สรุป `∃x P(x)`
5. ตรวจสอบ validity ของ argument ก่อนใช้

### 6. Map To Programming And Prompts

> Goal: ประยุกต์ใช้ใน code และ prompts

1. ใน programming:
   - `every` / `some` array methods
   - SQL `EXISTS`, `ALL`, `SOME/ANY`
   - type constraints: `forall` in generics/dependent types
   - loop invariants ด้วย quantifiers
2. ใน database:
   - `WHERE EXISTS (SELECT ...)`
   - `GROUP BY ... HAVING` กับ aggregate conditions
3. ใน prompts:
   - ระบุ constraints ด้วย "for all", "there exists", "none"
   - ตรวจ edge cases ด้วย quantifiers
4. ใน debugging:
   - หาค่า counterexample ของ `∀x P(x)`
   - หาค่า example ของ `∃x P(x)`

## Rules

### 1. Domain First

- ระบุ domain ก่อนใช้ quantifier
- ตัวแปรต้องมาจาก domain
- ห้ามใช้ quantifier กับ predicates ทีไม่ระบุ domain

### 2. Implication And Conjunction With Quantifiers

- `∀x (A(x) → B(x))` ใช้กับ "all A are B"
- `∃x (A(x) ∧ B(x))` ใช้กับ "some A are B"
- ไม่สลับ implication กับ conjunction โดยไม่ตั้งใจ

### 3. Negation Rules

- สลับ ∀ กับ ∃ เมื่อ negate
- เก็บ predicate ไว้หลัง negation
- ทำจากขวาไปซ้ายเมื่องานหลาย quantifiers

### 4. Set And Predicate Link

- `x ∈ A` สามารถเขียนเป็น predicate `A(x)`
- set operations สอดคล้องกับ logical operators
- ใช้ Venn diagram ตรวจความถูกต้อง

## Expected Outcome

- สามารถแปลงประโยคภาษาธรรมชาติเป็น predicate logic
- สามารถ negate quantifiers ได้
- สามารถใช้ set operations และ Venn diagram
- สามารถใช้ inference rules ให้เหตุผล
- สามารถ map ไปยัง programming, SQL, prompts
