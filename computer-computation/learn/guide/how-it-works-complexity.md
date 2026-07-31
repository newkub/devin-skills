# Complexity Analysis - การทำงาน

## Time Complexity (ความซับซ้อนของเวลา)

```text
┌─────────────────────────────────────────────────┐
│            Time Complexity Classes               │
├─────────────────────────────────────────────────┤
│                                                  │
│   O(1)      - Constant                           │
│   O(log n)  - Logarithmic                        │
│   O(n)      - Linear                             │
│   O(n log n) - Linearithmic                      │
│   O(n²)     - Quadratic                          │
│   O(n³)     - Cubic                              │
│   O(2ⁿ)     - Exponential                        │
│                                                  │
│   Examples:                                      │
│   ├── O(1): Array index access                  │
│   ├── O(log n): Binary search                   │
│   ├── O(n): Linear search                       │
│   ├── O(n log n): Merge sort                    │
│   ├── O(n²): Bubble sort                        │
│   └── O(2ⁿ): Subset generation                  │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Space Complexity (ความซับซ้อนของพื้นที่)

```text
┌─────────────────────────────────────────────────┐
│            Space Complexity Classes               │
├─────────────────────────────────────────────────┤
│                                                  │
│   Memory usage as function of input size         │
│                                                  │
│   Examples:                                      │
│   ├── O(1): In-place algorithms                 │
│   ├── O(log n): Recursion with logarithmic depth │
│   ├── O(n): Store all elements                  │
│   └── O(n²): Store n×n matrix                    │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Decidability (ความตัดสินได้)

### ปัญหาการตัดสิน

```text
┌─────────────────────────────────────────────────┐
│              Decision Problem Types              │
├─────────────────────────────────────────────────┤
│                                                  │
│   Decidable (Recursive):                         │
│   ├── Membership in regular languages           │
│   ├── Emptiness of CFL                          │
│   ├── Word problem for groups                   │
│   └── Primality testing                         │
│                                                  │
│   Semi-decidable (RE-complete):                 │
│   ├── Halting problem                           │
│   ├── Membership in RE languages                │
│   └── Whether TM accepts any input              │
│                                                  │
│   Undecidable:                                  │
│   ├── Halting problem                           │
│   ├── PCP (Post Correspondence Problem)          │
│   ├── Ambiguity of CFGs                        │
│   ├── Finiteness of CFL                        │
│   └── Equivalence of CFGs                      │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Reducibility (การลดรูป)

### Turing Reduction

```text
┌─────────────────────────────────────────────────┐
│              Turing Reduction                    │
├─────────────────────────────────────────────────┤
│                                                  │
│   Problem A ≤ₜ Problem B                        │
│                                                  │
│   Meaning:                                      │
│   If we can solve B, we can solve A              │
│   (using an algorithm + oracle for B)           │
│                                                  │
│   Examples:                                     │
│   ├── SAT ≤ₜ 3-SAT (convert formula to CNF)     │
│   ├── 3-SAT ≤ₜ CLIQUE (reduction via SAT)       │
│   └── CLIQUE ≤ₜ VERTEX-COVER (complement graph)  │
│                                                  │
│   NP-Complete: problems where all NP            │
│   problems reduce to them                       │
│                                                  │
└─────────────────────────────────────────────────┘
```

## ภูมิทัศน์ของ Computational Complexity

```text
┌─────────────────────────────────────────────────┐
│           Complexity Landscape                   │
├─────────────────────────────────────────────────┤
│                                                  │
│          PSPACE                                 │
│            │                                    │
│            │                                    │
│         EXPTIME                                 │
│            │                                    │
│            │                                    │
│         NEXPTIME                                │
│            │                                    │
│            │                                    │
│         PSPACE-complete                         │
│            │                                    │
│            │                                    │
│   ┌────────┴────────┐                          │
│   │     Π₂          │                          │
│   │       │         │                          │
│   │   Σ₂            │  (Polynomial Hierarchy)  │
│   │     │           │                          │
│   │   Π₁            │                          │
│   │     │           │                          │
│   │   Σ₁            │                          │
│   │     │           │                          │
│   │   NP-Complete   │                          │
│   │     │           │                          │
│   │   co-NP         │                          │
│   │     │           │                          │
│   └─────┴───────────┘                          │
│            │                                    │
│            │                                    │
│         P ⊆ NP ⊆ PSPACE                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

## สรุป

1. Time complexity วัดเวลาที่ algorithm ใช้
2. Space complexity วัดหน่วยความจำที่ใช้
3. Decidability จำแนกปัญหาที่ตัดสินได้และไม่ได้
4. Reducibility ใช้เปรียบเทียบความยากของปัญหา
5. Complexity landscape แสดงความสัมพันธ์ของ classes
