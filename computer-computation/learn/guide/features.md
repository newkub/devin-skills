# Features

## Computation Models

| Model | Type | Power |
|-------|------|-------|
| **Finite Automaton** | Deterministic/Nondeterministic | Regular Languages |
| **Pushdown Automaton** | PDA | Context-Free Languages |
| **Linear Bounded Automaton** | LBA | Context-Sensitive Languages |
| **Turing Machine** | Universal | Recursively Enumerable |
| **Universal Turing Machine** | UTM | Simulates any TM |

## Turing Machine Variants

| Variant | Description |
|---------|-------------|
| **Multi-tape TM** | Multiple tapes, equivalent to single-tape |
| **Non-deterministic TM** | Multiple transitions, equivalent to DTM |
| **Enumerators** | Enumerate strings in a language |
| **Alternating TM** | Universal + existential states |

## Complexity Classes

### Time Complexity

| Class | Bound | Examples |
|-------|-------|----------|
| **L** | O(log n) | Connectivity |
| **NL** | O(log² n) | Reachability |
| **P** | O(nᵏ) | Sorting, shortest path |
| **NP** | O(nᵏ) verifier | SAT, Hamilton Path |
| **PSPACE** | O(nᵏ) space | QBF, Go |
| **EXPTIME** | O(2^{nᵏ}) | Chess, general games |

### Space Complexity

| Class | Description |
|-------|-------------|
| **DSPACE(f(n))** | Deterministic space |
| **NSPACE(f(n))** | Nondeterministic space |

## Automata Features

### DFA (Deterministic Finite Automaton)

```text
M = (Q, Σ, δ, q₀, F)

- Q: Finite set of states
- Σ: Input alphabet
- δ: Q × Σ → Q (transition function)
- q₀: Initial state
- F: Final/accepting states
```

### NFA (Nondeterministic FA)

```text
M = (Q, Σ, δ, q₀, F)

- δ: Q × Σ → P(Q) (power set)
- May have ε-transitions
- Can be converted to DFA
```

### PDA (Pushdown Automaton)

```text
M = (Q, Σ, Γ, δ, q₀, Z₀, F)

- Γ: Stack alphabet
- Z₀: Initial stack symbol
- δ: Q × (Σ ∪ {ε}) × Γ → P(Q × Γ*)
```

## Formal Languages

### Chomsky Hierarchy

| Type | Grammar | Automaton | Example |
|------|---------|-----------|---------|
| **Type 3** | Regular | DFA/NFA | a*b |
| **Type 2** | Context-Free | PDA | aⁿbⁿ |
| **Type 1** | Context-Sensitive | LBA | aⁿbⁿcⁿ |
| **Type 0** | Phrase-Structure | TM | {aⁿbⁿcⁿ...} |

## Decidability Features

| Problem | Decidable | Complexity |
|---------|-----------|------------|
| **Regular language membership** | ✅ | O(n) |
| **CFL membership** | ✅ | O(n³) CYK |
| **CSL membership** | ✅ | PSPACE |
| **RE language membership** | ⏳ | Semi-decidable |
| **Halting problem** | ❌ | Undecidable |
