# How It Works

## Overview

คณิตศาสตร์สำหรับการพัฒนาซอฟต์แวร์ประกอบด้วย 5 สาขาหลักที่เชื่อมโยงกัน:

```
┌─────────────────────────────────────────────────────────────────┐
│              Mathematics for Software Development               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │  Computation   │  ← Algorithm Analysis & Complexity          │
│   └──────┬───────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌──────────────┐     ┌──────────────┐                        │
│   │ Discrete Math │ ←→ │Information Th.│                        │
│   └──────┬───────┘     └──────┬───────┘                        │
│          │                    │                                  │
│          └────────┬──────────┘                                  │
│                   ▼                                              │
│   ┌──────────────────────────────────────────┐                  │
│   │         Linear Algebra & Set Theory       │                  │
│   │   (Vectors, Matrices, Sets, Relations)   │                  │
│   └──────────────────────────────────────────┘                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Connections Between Fields

### Computation → Discrete Math

```
┌────────────────────────────────────────────────────────────┐
│                  Computation → Discrete Math                │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   Algorithm Complexity (Big O)                               │
│         │                                                   │
│         ▼                                                   │
│   ┌─────────────────────────────────────────────────┐    │
│   │  Time Complexity: O(n log n)                     │    │
│   │         │                                        │    │
│   │         ▼                                        │    │
│   │  Recurrence Relations ← Discrete Math           │    │
│   └─────────────────────────────────────────────────┘    │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Discrete Math → Information Theory

```
┌────────────────────────────────────────────────────────────┐
│              Discrete Math → Information Theory              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   Boolean Logic ────────────────────→ Entropy               │
│         │                              │                    │
│         ▼                              ▼                    │
│   Logic Gates                    Shannon's Theorem          │
│         │                              │                    │
│         ▼                              ▼                    │
│   Binary Systems ──────────────→ Data Compression         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Linear Algebra → All Fields

```
┌────────────────────────────────────────────────────────────┐
│                   Linear Algebra (Hub)                       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│   Vectors ────→ ML/AI ────→ Neural Networks                │
│                  │                                          │
│   Matrices ─────┼──→ Graphics ───→ Transformations         │
│                  │                                          │
│   Eigenvalues ───┴──→ Data Analysis ───→ PCA              │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Problem Solving Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      Problem Solving Flow                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. Understand Problem                                          │
│  ┌─────────────────┐                                             │
│  │  - What is input? │                                           │
│  │  - What is output? │                                           │
│  │  - Constraints?    │                                           │
│  └────────┬────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  2. Identify Math Domain                                         │
│  ┌─────────────────┐                                             │
│  │  - Search/Sort? → Computation                                │
│  │  - Graph/Tree? → Discrete Math                                │
│  │  - Compression? → Information Theory                          │
│  │  - ML/Graphics? → Linear Algebra                              │
│  │  - Filtering? → Set Theory                                    │
│  └────────┬────────┘                                             │
│           │                                                        │
│           ▼                                                        │
│  3. Apply Solution                                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - Use established algorithms                            │   │
│  │  - Apply mathematical formulas                           │   │
│  │  - Implement with appropriate libraries                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Practical Applications

| สาขา | ใช้ในงาน | ตัวอย่าง |
|------|----------|----------|
| **Computation** | Algorithm design | Sorting, Searching, Graph algorithms |
| **Discrete Math** | Data structures | Trees, Hash tables, Sets |
| **Information Theory** | Data handling | Compression, Encoding, Cryptography |
| **Linear Algebra** | ML/Graphics | Neural networks, 3D transformations |
| **Set Theory** | Database queries | SQL, Filtering, Joins |
