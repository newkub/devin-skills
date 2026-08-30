---
name: follow-math-propositional-logic
description: เข้าใจและใช้ตรรกศาสตร์ประพจน์ truth tables tautology boolean algebra ใน programming และ prompts
argument-hint: "[topic]"
related:
  - follow-math-predicate-logic
  - follow-math-concepts
  - follow-debugging
  - ask-me
---

## Goal

เข้าใจตรรกศาสตร์ประพจน์ (propositional logic) ได้แก่ propositions, truth values, logical operators, truth tables, tautology, contradiction, logical equivalences และประยุกต์ใช้ใน programming, debugging, และ prompts

## Scope

- ใช้สำหรับวิเคราะห์เงื่อนไข boolean, if/else, assertions, feature flags
- ครอบคลุม operators: NOT, AND, OR, XOR, IMPLIES, IFF
- ครอบคลุม truth tables, tautology, contradiction, contingency
- แนะนำ De Morgan's laws, distributive, associative, commutative laws
- ไม่ลงลึก quantifiers (ดู `/follow-math-predicate-logic`)

## Execute

### 1. Define Propositions

> Goal: ระบุ propositions จากปัญหา

1. ระบุ statements ทีมีค่าความจริง (true/false)
2. ตั้งชื่อตัวแปร เช่น `P = "user is logged in"`, `Q = "cart is not empty"`
3. แยก atomic propositions ออกจาก compound propositions
4. ระบุ operators ทีใช้

### 2. Build Truth Tables

> Goal: หาค่าความจริงของ compound propositions

1. สร้าง columns สำหรับทุก atomic proposition
2. สร้าง columns สำหรับทุก sub-expression
3. คำนวณค่า truth ทีละชั้น
4. ใช้เครื่องหมาย:
   - `¬P` หรือ `!P` สำหรับ NOT
   - `P ∧ Q` หรือ `P && Q` สำหรับ AND
   - `P ∨ Q` หรือ `P || Q` สำหรับ OR
   - `P → Q` สำหรับ implication
   - `P ↔ Q` สำหรับ equivalence

### 3. Identify Tautology Contradiction And Contingency

> Goal: หาสัจนิรันดร์ เอกฐานะ และเหตุบังเอิญ

1. ถ้าค่าทั้งหมดใน final column เป็น true → tautology (สัจนิรันดร์)
2. ถ้าค่าทั้งหมดเป็น false → contradiction (เอกฐานะ)
3. ถ้ามีทั้ง true และ false → contingency (เหตุบังเอิญ)
4. บันทึกผลลัพธ์พร้อมตัวอย่าง

### 4. Apply Logical Equivalences

> Goal: ลดความซับซ้อนของ expression

1. ใช้ De Morgan's laws:
   - `¬(P ∧ Q) ≡ ¬P ∨ ¬Q`
   - `¬(P ∨ Q) ≡ ¬P ∧ ¬Q`
2. ใช้ distributive, associative, commutative laws
3. ใช้ double negation: `¬¬P ≡ P`
4. ใช้ implication: `P → Q ≡ ¬P ∨ Q`
5. ใช้ equivalence: `P ↔ Q ≡ (P → Q) ∧ (Q → P)`

### 5. Map To Programming

> Goal: ประยุกต์ใช้ใน code

1. แปลง logical expression เป็น if/else, while, guard clauses
2. แปลงเป็น boolean algebra ใน code
3. ใช้ simplification เพื่อลด nested conditions
4. ตรวจสอบ assertions ด้วย truth table
5. ตรวจสอบว่า condition เป็น tautology หรือ dead code

### 6. Map To Prompts And Debugging

> Goal: ใช้ตรรกะใน prompt และ debug

1. ใน prompts: ระบุ conditions อย่างชัดเจนด้วย AND/OR/NOT
2. ใน debugging: สร้าง truth table ของ branches ทีเกิดขึ้น
3. หา edge cases จาก combination ของ boolean variables
4. ระบุสาเหตุของ bug จาก logical contradiction

## Rules

### 1. Truth Values Only

- ตัวแปรต้องมีค่า true/false เท่านั้น
- ไม่ใช้ quantifiers ในวิชานี้ (ใช้ `/follow-math-predicate-logic`)
- ห้ามเข้าใจผิดระหว่าง implication กับ causation

### 2. Operator Precedence

- NOT สูงสุด
- AND รองลงมา
- OR ต่ำกว่า AND
- ใช้ parentheses เพื่อความชัดเจน

### 3. Common Fallacies

- Affirming the consequent: `P → Q, Q ∴ P` ไม่ถูกต้อง
- Denying the antecedent: `P → Q, ¬P ∴ ¬Q` ไม่ถูกต้อง
- ตรวจสอบ valid inference rules ก่อนใช้

### 4. Programming Mapping

- `&&` = AND, `||` = OR, `!` = NOT
- `a ? b : c` เป็น conditional/ternary
- `==` ไม่ใช่ logical equivalence เสมอไป ต้องระวัง

- ใช้ /follow-math-concepts ถ้าจำเป็น
- ใช้ /follow-debugging ถ้าจำเป็น
- ใช้ /ask-me ถ้าจำเป็น

## Expected Outcome

- สามารถสร้าง truth table จาก propositions
- สามารถระบุ tautology, contradiction, contingency
- สามารถ simplify boolean expression
- สามารถ map ไปยัง if/else, assertions, feature flags
- สามารถใช้ใน prompts และ debugging
