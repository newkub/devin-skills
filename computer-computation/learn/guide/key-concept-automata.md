# Automata Theory

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Automata Theory

## ประเภทของ Finite Automata

```text
┌─────────────────────────────────────────────────┐
│            Automata Hierarchy                   │
├─────────────────────────────────────────────────┤
│                                                  │
│   Regular Languages                             │
│   ├── DFA (Deterministic Finite Automaton)      │
│   ├── NFA (Nondeterministic Finite Automaton) │
│   └── Regular Expressions                       │
│   │                                             │
│   ▼                                             │
│   Context-Free Languages                        │
│   ├── PDA (Pushdown Automaton)                  │
│   └── CFG (Context-Free Grammar)               │
│   │                                             │
│   ▼                                             │
│   Context-Sensitive Languages                   │
│   └── LBA (Linear Bounded Automaton)           │
│   │                                             │
│   ▼                                             │
│   Recursively Enumerable Languages               │
│   └── Turing Machine                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

## ตัวอย่าง DFA: Binary หารด้วย 3

```text
States: q₀ (divisible), q₁ (remainder 1), q₂ (remainder 2)
Alphabet: {0, 1}
Final state: q₀

Transition Table:
         0      1
→ q₀    q₀     q₁
   q₁    q₂     q₀
* q₂    q₁     q₂

Diagram:
     ┌──────────────┐
     │              ▼
   (q₀) ──0──▶ (q₀)
     ▲           │
     │           │ 1
     │           ▼
     │         (q₁)
     │           │
     │     0     │ 1
     │     ▼     │
     │   (q₂) ◀──┘
     │     │ 0
     └─────┘
```

## เปรียบเทียบ NFA กับ DFA

```text
DFA (Deterministic):
- Exactly one transition per state/input
- Easier to implement
- Can be converted to DFA

NFA (Nondeterministic):
- Multiple possible transitions
- Easier to design
- Can have ε-transitions
- Can be converted to DFA via powerset construction
```

## สรุป

- Automata มีหลายประเภทตาม Chomsky hierarchy
- DFA และ NFA สำหรับ Regular Languages
- PDA สำหรับ Context-Free Languages
- LBA สำหรับ Context-Sensitive Languages
- Turing Machine สำหรับ Recursively Enumerable Languages
