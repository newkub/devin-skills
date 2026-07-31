# Computability

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Computability

## Decidability (ความตัดสินได้)

```text
┌─────────────────────────────────────────────────┐
│            Decidability                         │
├─────────────────────────────────────────────────┤
│                                                  │
│   Decidable Problems (Recursive)                 │
│   ├── Emptiness of CFL                          │
│   ├── Equivalence of regular expressions        │
│   └── Membership in regular languages           │
│                                                  │
│   Undecidable Problems                          │
│   ├── Halting Problem                           │
│   ├── PCP (Post Correspondence Problem)          │
│   ├── Ambiguity of CFGs                        │
│   └── Equivalence of CFGs                      │
│                                                  │
│   Semidecidable (RE-complete)                   │
│   ├── Membership in any RE language              │
│   ├── Finiteness of CFL                        │
│   └── Whether TM accepts any input              │
│                                                  │
└─────────────────────────────────────────────────┘
```

## ปัญหา Halting

```text
Proof by Diagonalization:

Assume Halt(P) exists that decides if program P halts.

Construct:
  function Diagonal(P):
    if Halt(P) == halts:
      loop forever
    else:
      halt

Call Diagonal(Diagonal):
  - If halts → Halt(Diagonal) says loops → CONTRADICTION
  - If loops → Halt(Diagonal) says halts → CONTRADICTION

Therefore, Halt cannot exist.
```

## สรุป

- Decidable คือปัญหาที่มี algorithm ตอบได้
- Undecidable คือปัญหาที่ไม่มี algorithm ตอบได้
- Halting problem เป็นตัวอย่างของ undecidable
- บางปัญหา semidecidable (ตอบได้เฉพาะกรณี yes)
