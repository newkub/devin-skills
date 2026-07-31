# Church-Turing Thesis

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Church-Turing Thesis

## ข้อความของ Church-Turing Thesis

```text
┌─────────────────────────────────────────────────┐
│            Church-Turing Thesis                  │
├─────────────────────────────────────────────────┤
│                                                  │
│   "Any computable function can be computed       │
│    by a Turing machine."                        │
│                                                  │
│   Equivalences:                                  │
│   - λ-calculus (Church)                        │
│   - μ-recursive functions                       │
│   - Standard register machines                  │
│   - Any reasonable programming language          │
│                                                  │
│   Implication:                                  │
│   - All models of computation are equivalent    │
│   - "Computable" = "Turing-computable"          │
│   - Limits of Turing machine = limits of        │
│     any computer                                │
│                                                  │
└─────────────────────────────────────────────────┘
```

## พื้นฐาน Lambda Calculus

```text
Variables: x, y, z
Abstraction: λx.M (function with parameter x)
Application: (M N) (apply M to N)

Examples:
- Identity: λx.x
- Constant: λx.λy.x
- Application: (λx.x) y → y
- Church numerals:
  - 0: λf.λx.x
  - 1: λf.λx.f x
  - 2: λf.λx.f (f x)
```

## สรุป

- Church-Turing thesis บอกว่า TM เทียบเท่ากับทุก model
- λ-calculus เป็น formalism ที่เทียบเท่ากับ TM
- μ-recursive functions ก็เทียบเท่าเช่นกัน
- ทุก reasonable programming language เทียบเท่ากับ TM
