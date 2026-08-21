# Configuration

## Turing Machine Configuration

### Formal Definition

```text
Turing Machine M = (Q, Σ, Γ, δ, q₀, B, F)

Components:
- Q: Finite set of states
- Σ: Input alphabet (does not include B)
- Γ: Tape alphabet (Σ ⊂ Γ)
- δ: Transition function Q × Γ → Q × Γ × {L, R}
- q₀: Initial state (∈ Q)
- B: Blank symbol (∈ Γ, B ∉ Σ)
- F: Final states (⊆ Q)
```

### Configuration Example

```text
Configuration: (q, w₁, w₂)

Where:
- q: Current state
- w₁: Content left of head
- w₂: Content right of head (including current symbol)

Example: (q₁, a, bc)
┌─────────────────────────────────────────┐
│ Tape: a b c _ _ _                        │
│           ▲                              │
│         Head at 'b'                      │
│ State: q₁                                │
└─────────────────────────────────────────┘
```

## Automata Configuration

### DFA Configuration

```text
DFA M = (Q, Σ, δ, q₀, F)

Configuration: (state, remaining_input)

Accept if: (q₀, w) ⊢* (q_f, ε) where q_f ∈ F
```

### PDA Configuration

```text
PDA M = (Q, Σ, Γ, δ, q₀, Z₀, F)

Configuration: (q, w, γ)

Where:
- q: Current state
- w: Remaining input
- γ: Current stack content (top at left)
```

## Grammar Configuration

### Chomsky Grammar Types

| Type | Production Rules | Example |
|------|------------------|---------|
| **Type 0** | α → β (α ≠ ε) | S → aSb \| ε |
| **Type 1** | αAβ → αγβ | S → AS \| a |
| **Type 2** | A → α | S → aSb |
| **Type 3** | A → aB or A → a | A → aB \| b |

### Context-Free Grammar

```text
G = (V, Σ, P, S)

Where:
- V: Non-terminal symbols
- Σ: Terminal symbols (V ∩ Σ = ∅)
- P: Production rules
- S: Start symbol (∈ V)

Example:
V = {S, A, B}
Σ = {a, b}
P = {
  S → aS b,
  S → aB,
  B → b
}
S = S
```

## Complexity Configuration

### Time Bounds

```text
O(1): Constant time
O(log n): Logarithmic
O(n): Linear
O(n log n): Linearithmic
O(n²): Quadratic
O(2ⁿ): Exponential

Examples:
- Array access: O(1)
- Binary search: O(log n)
- Linear search: O(n)
- Bubble sort: O(n²)
```

### Space Bounds

```text
S(n) = O(f(n))

Examples:
- In-place swap: O(1)
- Store array: O(n)
- Store n×n matrix: O(n²)
```
