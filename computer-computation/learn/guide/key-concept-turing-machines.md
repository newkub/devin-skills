# Turing Machines

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Turing Machines

## Turing Machine คืออะไร

```text
┌─────────────────────────────────────────────────┐
│            Turing Machine Model                  │
├─────────────────────────────────────────────────┤
│                                                  │
│   ┌─────────────────────────────────────────┐  │
│   │              Tape (Infinite)             │  │
│   │  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┐  │  │
│   │  │ _ │ B │ 1 │ 0 │ 1 │ 1 │ _ │ _ │ _ │  │  │
│   │  └───┴───┴───┴───┴───┴───┴───┴───┴───┘  │  │
│   │       ▲                                  │  │
│   │       │                                  │  │
│   │  ┌────┴───┐                              │  │
│   │  │  Head  │                              │  │
│   │  └────────┘                              │  │
│   └─────────────────────────────────────────┘  │
│                                                  │
│   Components:                                   │
│   - Infinite tape with cells                   │
│   - Read/write head that moves                 │
│   - State register                             │
│   - Transition function (δ)                   │
│   - Finite set of states                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

## นิยามเชิงรูป

```text
Turing Machine M = (Q, Σ, Γ, δ, q₀, B, F)

Where:
- Q = Finite set of states
- Σ = Input alphabet
- Γ = Tape alphabet (includes Σ)
- δ : Q × Γ → Q × Γ × {L, R}  (Transition function)
- q₀ = Initial state
- B = Blank symbol (∈ Γ but not ∈ Σ)
- F = Final/accepting states (⊆ Q)
```

## ตัวอย่าง: Palindrome Checker

```text
Transition δ(q₀, 1) → (q₁, X, R)   // Mark 1 with X, move right
Transition δ(q₀, 0) → (q₃, X, R)   // Mark 0 with X, move right
Transition δ(q₁, 1) → (q₁, 1, R)    // Skip 1s
Transition δ(q₁, 0) → (q₁, 0, R)    // Skip 0s
Transition δ(q₁, X) → (q₁, X, R)    // Skip Xs
Transition δ(q₁, Y) → (q₁, Y, R)    // Skip Ys
Transition δ(q₁, 1) → (q₂, Y, L)    // Found 1, mark Y, go left
Transition δ(q₂, 1) → (q₂, 1, L)    // Skip 1s
Transition δ(q₂, 0) → (q₂, 0, L)    // Skip 0s
// ... more transitions ...
Accept state when head finds leftmost unmarked symbol
```

## สรุป

- Turing Machine เป็น universal model ของ computation
- มี infinite tape, read/write head, และ state register
- Transition function กำหนดการทำงาน
- สามารถ simulate ทุก computational model อื่นๆ
