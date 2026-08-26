---
name: follow-set-theory
description: เข้าใจ set theory, operations, Venn diagrams และประยุกต์ใช้ใน programming
argument-hint: "[topic]"
related:
  - follow-predicate-logic
  - follow-propositional-logic
  - follow-math-concepts
  - debug
---

## Goal

เข้าใจ set theory: sets, elements, operations, Venn diagrams, power sets, และ cartesian products และประยุกต์ใช้ใน programming, data filtering, และ prompts

## Scope

- ใช้สำหรับวิเคราะห์ collections, unique values, filters, joins
- ครอบคลุม set operations: union, intersection, difference, complement
- ครอบคลุม subsets, power sets, cartesian products
- ไม่ลงลึก axiomatic set theory

## Execute

### 1. Define Sets

> Goal: ระบุ sets และ members

1. ระบุ set A, B, universe U
2. ระบุ elements: `x ∈ A`, `x ∉ A`
3. ใช้ roster notation `{1, 2, 3}` หรือ set-builder `{x | P(x)}`
4. ระบุ empty set `∅` และ singleton

### 2. Visualize With Venn Diagram

> Goal: เข้าใจ relationships

1. วาด circles สำหรับ A, B ภายใน U
2. ระบุ intersection `A ∩ B`, union `A ∪ B`
3. ระบุ difference `A \ B`, complement `A'`
4. ใช้สำหรับตรวจ logical equivalences

### 3. Apply Set Operations

> Goal: คำนวณ operations

1. Union: `A ∪ B = {x | x ∈ A หรือ x ∈ B}`
2. Intersection: `A ∩ B = {x | x ∈ A และ x ∈ B}`
3. Difference: `A \ B = {x | x ∈ A แต่ x ∉ B}`
4. Complement: `A' = {x | x ∈ U แต่ x ∉ A}`
5. Symmetric difference: `A Δ B = (A \ B) ∪ (B \ A)`

### 4. Use Set Relations

> Goal: เปรียบเทียบ sets

1. Subset: `A ⊆ B` ทุก elements ของ A อยู่ใน B
2. Proper subset: `A ⊂ B`
3. Equality: `A = B` เมื่อ `A ⊆ B` และ `B ⊆ A`
4. Disjoint: `A ∩ B = ∅`

### 5. Advanced Notions

> Goal: ใช้ power set และ cartesian product

1. Power set: `P(A) = {S | S ⊆ A}`
2. Cartesian product: `A × B = {(a, b) | a ∈ A, b ∈ B}`
3. ใช้ใน database joins, tuple types
4. ระบุ cardinality ของ set

### 6. Map To Programming

> Goal: ประยุกต์ใน code

1. ใช้ Set ใน JavaScript/TypeScript/Bun: `new Set()`
2. ใช้ filter/map/reduce สำหรับ set operations
3. ใช้ SQL `UNION`, `INTERSECT`, `EXCEPT`
4. ตรวจ duplicates, unique values, membership
5. ใช้ใน prompt: ระบุ groups, exclusions, inclusions

## Rules

### 1. Universe First

- ระบุ universe U เสมอ
- complement ต้องอ้างอิง U
- ไม่ลืม empty set `∅`

### 2. Operation Equivalences

- `A ∪ B` สอดคล้อง `A || B` ถ้ามองเป็น membership
- `A ∩ B` สอดคล้อง `A && B`
- `A'` สอดคล้อง `!A`
- ใช้ De Morgan's laws สำหรับ complements

### 3. Practical Mapping

- Sets = collections of unique values
- Subset = filter conditions
- Union/Intersection = combine datasets
- Difference = exclude

## Expected Outcome

- สามารถวาด Venn diagram และหา operations
- สามารถ map ไปยัง code และ SQL
- สามารถใช้ set relations ใน prompts
