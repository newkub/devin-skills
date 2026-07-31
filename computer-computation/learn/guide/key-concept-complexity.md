# Complexity Classes

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Complexity Classes

## ปัญหา P vs NP

```text
┌─────────────────────────────────────────────────┐
│            Complexity Classes                    │
├─────────────────────────────────────────────────┤
│                                                  │
│   P (Polynomial Time)                           │
│   ├── Problems solvable in O(nᵏ) time          │
│   ├── Examples:                                 │
│   │   - Sorting (O(n log n))                    │
│   │   - Shortest path (O(V log E))              │
│   │   - Graph connectivity                      │
│   │                                           │
│   ▼                                            │
│   NP (Nondeterministic Polynomial Time)         │
│   ├── Solutions verifiable in O(nᵏ) time       │
│   ├── Examples:                                 │
│   │   - SAT (Boolean Satisfiability)           │
│   │   - Hamiltonian Path                        │
│   │   - Subset Sum                              │
│   │                                           │
│   ▼                                            │
│   NP-Complete                                   │
│   ├── Hardest problems in NP                    │
│   ├── All reduce to each other                  │
│   └── SAT, 3-SAT, TSP, Knapsack                 │
│   │                                           │
│   ▼                                            │
│   NP-Hard                                       │
│   ├── At least as hard as NP-complete          │
│   └── Can include undecidable problems         │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Complexity Classes ทั่วไป

| Class | Description | Example |
|-------|-------------|---------|
| P | Polynomial time | Sorting |
| NP | Verifiable in poly time | SAT |
| NP-Complete | Hardest in NP | 3-SAT, TSP |
| PSPACE | Polynomial space | QBF |
| EXPTIME | Exponential time | Chess |
| UNDECIDABLE | No algorithm | Halting problem |

## สรุป

- P คือปัญหาที่แก้ได้ในเวลา polynomial
- NP คือปัญหาที่ verify ได้ในเวลา polynomial
- NP-Complete คือปัญหาที่ยากที่สุดใน NP
- P vs NP เป็นปัญหาเปิดที่สำคัญที่สุด
