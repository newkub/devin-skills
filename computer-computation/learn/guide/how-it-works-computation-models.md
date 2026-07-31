# Computation Models - การทำงาน

ภาพรวมการทำงานของ Computation Models

## ภาพรวม Computation Models

```text
┌─────────────────────────────────────────────────────────────────┐
│               Computation Models                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   Turing Machine                         │   │
│   │                                                         │   │
│   │    ┌─────────────────────────────────────────────────┐  │   │
│   │    │  Tape: _ _ 1 0 1 1 _ _ _                        │  │   │
│   │    │            ▲                                    │  │   │
│   │    │   ┌────────────────────┐                        │  │   │
│   │    │   │      Head         │                        │  │   │
│   │    │   │  State Register   │                        │  │   │
│   │    │   │  Transition δ     │                        │  │   │
│   │    │   └────────────────────┘                        │  │   │
│   │    └─────────────────────────────────────────────────┘  │   │
│   │                                                         │   │
│   │   Universal: Can simulate any other computation model  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │                   λ-Calculus                            │   │
│   │                                                         │   │
│   │   Terms: M ::= x | λx.M | (M N)                        │   │
│   │                                                         │   │
│   │   Rules:                                                │
│   │   ├── α-conversion: λx.M = λy.M[x/y]                   │   │
│   │   ├── β-reduction: (λx.M)N → M[x/N]                    │   │
│   │   └── η-reduction: λx.Mx = M (if x not free in M)      │   │
│   │                                                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## การทำงานของ Turing Machine

### ขั้นตอนการทำงาน

```text
Input: "110" (binary, check if divisible by 3)

Step 1: Initial State
┌────────────────────────────────────────────────┐
│ Tape: _ 1 1 0 _                                │
│        ▲                                       │
│ State: q₀ (start)                              │
└────────────────────────────────────────────────┘

Step 2: Read 1, move right
┌────────────────────────────────────────────────┐
│ Tape: _ 1 1 0 _                                │
│          ▲                                     │
│ State: q₁ (remainder 1)                       │
└────────────────────────────────────────────────┘

Step 3: Read 1, move right
┌────────────────────────────────────────────────┐
│ Tape: _ 1 1 0 _                                │
│             ▲                                  │
│ State: q₂ (remainder 2)                       │
└────────────────────────────────────────────────┘

Step 4: Read 0, move right
┌────────────────────────────────────────────────┐
│ Tape: _ 1 1 0 _                                │
│               ▲                                │
│ State: q₀ (remainder 0 = divisible)           │
└────────────────────────────────────────────────┘

Step 5: Accept (in final state q₀ with blank)
```

### Universal Turing Machine

```text
┌─────────────────────────────────────────────────┐
│            Universal Turing Machine              │
├─────────────────────────────────────────────────┤
│                                                  │
│   Simulates any Turing machine M on input w:    │
│                                                  │
│   ┌─────────────────────────────────────────┐  │
│   │ Tape contains:                           │  │
│   │                                          │  │
│   │ [Description of M] [Separator] [Input w] │  │
│   │                                          │  │
│   │ Example:                                │  │
│   │ [M encoding] [,] [1,0,1]                │  │
│   └─────────────────────────────────────────┘  │
│                                                  │
│   Universal machine interprets M and applies    │
│   transition rules to w                         │
│                                                  │
└─────────────────────────────────────────────────┘
```

## การคำนวณด้วย Lambda Calculus

### กระบวนการประเมิน

```text
┌─────────────────────────────────────────────────┐
│              Lambda Evaluation                   │
├─────────────────────────────────────────────────┤
│                                                  │
│   Example: (λx.λy.y x) (λz.z) (λw.w)            │
│                                                  │
│   Step 1: β-reduction of first application      │
│   (λx.λy.y x) (λz.z)                           │
│   = λy.y (λz.z)                                │
│                                                  │
│   Step 2: β-reduction of second application    │
│   (λy.y (λz.z)) (λw.w)                         │
│   = (λz.z) (λw.w)                              │
│                                                  │
│   Step 3: Final application                    │
│   (λz.z) (λw.w)                                │
│   = λw.w                                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Church Numerals

```text
┌─────────────────────────────────────────────────┐
│              Church Numerals                     │
├─────────────────────────────────────────────────┤
│                                                  │
│   0 = λf.λx.x                                  │
│   1 = λf.λx.f x                                │
│   2 = λf.λx.f (f x)                            │
│   3 = λf.λx.f (f (f x))                        │
│   n = λf.λx.fⁿx                               │
│                                                  │
│   Addition:                                     │
│   plus = λm.λn.λf.λx.m f (n f x)              │
│                                                  │
│   Multiplication:                               │
│   times = λm.λn.λf.m (n f)                     │
│                                                  │
│   Example: plus 2 3                            │
│   = (λm.λn.λf.λx.m f (n f x)) 2 3             │
│   = λf.λx.2 f (3 f x)                          │
│   = λf.λx.2 f (f (f (f x)))                    │
│   = λf.λx.f (f (f (f (f (f x)))))             │
│   = 5                                          │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Recursive Functions

### μ-Recursive Functions

```text
┌─────────────────────────────────────────────────┐
│           μ-Recursive Functions                  │
├─────────────────────────────────────────────────┤
│                                                  │
│   Base Functions:                                │
│   ├── Zero: z(x₁,...,xₙ) = 0                   │
│   ├── Successor: s(x) = x + 1                  │
│   └── Projection: uⁿᵢ(x₁,...,xₙ) = xᵢ          │
│                                                  │
│   Operations:                                    │
│   ├── Composition: f(g₁(x),...,gₘ(x))          │
│   ├── Primitive Recursion:                       │
│   │   f(0,x) = g(x)                            │
│   │   f(n+1,x) = h(n, f(n,x), x)               │
│   └── Minimization: f(x) = μy.g(x,y) = 0       │
│                                                  │
│   All μ-recursive functions are Turing-         │
│   computable, and vice versa                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

## สรุป

1. Turing Machine เป็น universal model ที่ compute ได้ทุกอย่าง
2. Lambda calculus เทียบเท่ากับ Turing machine
3. μ-recursive functions อีก formalism ที่เทียบเท่า
4. Complexity classes จำแนกปัญหาตามทรัพยากร
5. Reducibility ใช้พิสูจน์ NP-completeness
6. Church-Turing thesis บอกว่าทุก model เทียบเท่ากัน
