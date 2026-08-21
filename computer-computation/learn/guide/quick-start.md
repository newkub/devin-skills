# Quick Start

## 1. Understanding Turing Machine

```text
Basic Turing Machine:

┌─────────────────────────────────────────┐
│ Tape: _ 1 0 1 1 _ _ _                    │
│        ▲                                 │
│      Head                                │
│ State: q₀ (initial)                     │
│        ↓                                 │
│ Transition: δ(q₀, 1) → (q₁, X, R)      │
│        ↓                                 │
│ Result: _ X 0 1 1 _ _ _                  │
│             ▲                            │
│           New position                   │
└─────────────────────────────────────────┘
```

## 2. Automata Theory Basics

### Create a DFA for binary divisible by 3

```text
States:
- q₀: remainder 0
- q₁: remainder 1
- q₂: remainder 2

Transitions:
       0        1
→ q₀  q₀  ←←  q₁
   q₁  q₂  ←←  q₀
* q₂  q₁  ←←  q₂

Accept: q₀ (divisible by 3)
```

### Test Examples

| Input | Process | Result |
|-------|---------|--------|
| "0" | q₀→q₀ | Accept |
| "1" | q₀→q₁ | Reject |
| "00" | q₀→q₀→q₀ | Accept |
| "11" | q₀→q₁→q₀ | Accept |

## 3. Complexity Classes Quick Guide

```text
┌─────────────────────────────────────────┐
│         Complexity Quick Reference       │
├─────────────────────────────────────────┤
│                                          │
│   P ⊆ NP ⊆ PSPACE ⊆ EXPTIME            │
│                                          │
│   P:    Polynomial time (solvable)       │
│   NP:   Nondeterministic polynomial     │
│          (verifiable in poly time)       │
│   PSPACE: Polynomial space              │
│   EXPTIME: Exponential time              │
│                                          │
│   NP-Complete: SAT, 3-SAT, CLIQUE        │
│   PSPACE-Complete: QBF, Go             │
│                                          │
└─────────────────────────────────────────┘
```

## 4. Formal Languages Quick Reference

### Chomsky Hierarchy

```text
Type 3 (Regular)    →  DFA/NFA
         ↓
Type 2 (Context-Free) →  PDA
         ↓
Type 1 (Context-Sensitive) →  LBA
         ↓
Type 0 (Phrase-Structure) →  Turing Machine
```

### Common Patterns

| Language | Regex/Pattern |
|----------|---------------|
| Even number of 1s | (0*10*10*)* |
| Palindromes | Not regular (need PDA) |
| aⁿbⁿcⁿ | Not context-free (need LBA) |

## 5. Proving Techniques

### Proof by Construction

```text
1. Define the machine/grammar
2. Show it accepts exactly the desired language
3. Show correctness for all inputs
```

### Proof by Contradiction

```text
1. Assume the statement is false
2. Derive a contradiction
3. Conclude the statement is true

Example: Halting problem proof
```

### Proof by Induction

```text
Base case: Show for n=0
Inductive step: Assume true for n, prove for n+1

Example: Pumping lemma
```

## 6. Key Formulas

```text
Pumping Lemma (Regular):
∃p (pumping length) s.t. |s| ≥ p
s = xyz where:
- |xy| ≤ p
- |y| > 0
- xyⁱz ∈ L for all i ≥ 0

Pumping Lemma (CFL):
∃p s.t. |s| ≥ p
s = uvxyz where:
- |vxy| ≤ p
- |vy| > 0
- uvⁱxyⁱz ∈ L for all i ≥ 0
```
