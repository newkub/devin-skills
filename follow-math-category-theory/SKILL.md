---
name: follow-math-category-theory
description: เข้าใจ categories, functors, monads และประยุกต์ใน functional programming และ type systems
argument-hint: "[topic]"
related:
  - follow-programming-paradigm
  - follow-math-set-theory
  - follow-math-concepts
---

## Goal

เข้าใจ category theory: categories, objects, morphisms, functors, natural transformations, monads และประยุกต์ใช้ใน functional programming, type systems, composition

## Scope

- ใช้สำหรับเข้าใจ composition, types, functors, monads
- ครอบคลุม categories, morphisms, composition laws
- แนะนำ functors, applicatives, monads ใน code

## Execute

### 1. Understand Categories

> Goal: รู้ concept พื้นฐาน

1. แต่ละ category มี objects และ morphisms (arrows)
2. Morphism สามารถ compose: `f: A → B`, `g: B → C` → `g ∘ f: A → C`
3. มี identity morphism `id_A` สำหรับทุก object
4. ต้องสอดคล้อง associativity และ identity laws

### 2. Types As Objects

> Goal: แปลง type system เป็น category

1. Types เป็น objects
2. Functions เป็น morphisms
3. Function composition เป็น morphism composition
4. Identity function เป็น identity morphism

### 3. Functors

> Goal: เข้าใจ mapping ระหว่าง categories

1. Functor แปลง object → object และ morphism → morphism
2. รักษา identity และ composition
3. `Array.map` เป็น functor (lift function into context)
4. `Option/Maybe` เป็น functor

### 4. Monads

> Goal: ใช้ monads ใน code

1. Monad เป็น functor พร้อม `return` (unit) และ `bind` (flatMap)
2. ใช้สำหรับ sequence computations ทีมี context (Promise, Maybe, Result)
3. Promise เป็น monad: `.then` คือ `map`, `.then` กับ function คืน Promise คือ `flatMap`
4. ใช้ monadic composition แทน nested callbacks

### 5. Map To Code

> Goal: ประยุกต์ใน FP

1. ใช้ `.map` สำหรับ pure transformations
2. ใช้ `.flatMap`/`chain` สำหรับ flatten nested context
3. ใช้ `Result`/`Either` จัดการ error ด้วย composition
4. ใช้ function composition แทน nested calls

## Rules

### 1. Composition Laws

- ต้อง preserve identity: `F(id) = id`
- ต้อง preserve composition: `F(g ∘ f) = F(g) ∘ F(f)`

### 2. Type Safety

- ห้าม unsafe cast
- ใช้ type system ของภาษาเพื่อ enforce laws
- ระวัง void/undefined ใน composition

### 3. Code Mapping

- `Array`, `Promise`, `Maybe`, `Either` มักเป็น functors/monads
- ใช้ `pipe`/`compose` สำหรับ function composition
- ใช้ library เช่น `fp-ts`, `effect` ถ้าจำเป็น

- ใช้ /follow-programming-paradigm ถ้าจำเป็น
- ใช้ /follow-math-set-theory ถ้าจำเป็น
- ใช้ /follow-math-concepts ถ้าจำเป็น

## Expected Outcome

- สามารถอธิบาย category, functor, monad
- สามารถ map type system ไป category
- สามารถใช้ monadic composition ใน code
- สามารถ refactor nested logic เป็น composed functions
