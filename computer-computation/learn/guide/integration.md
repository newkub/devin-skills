# Integration

## Programming Language Implementation

### Lexer (Regular Languages)

```text
Token patterns are regular languages:

Token Type    Regex Pattern
────────────────────────────
NUMBER        [0-9]+
IDENTIFIER    [a-zA-Z][a-zA-Z0-9]*
KEYWORD       if|else|while|for|...
OPERATOR      [+*-/=<>!&|]
WHITESPACE    [ \t\n]+
COMMENT       //.*|\/\*[\s\S]*?\*\/
```

### Parser (Context-Free Languages)

```text
Programming language syntax is CFL:

Grammar for simple expressions:
E → E + T | T
T → T * F | F
F → ( E ) | id

This is context-free, handled by PDA/LR parser
```

### Code Generation (Turing-complete)

```text
Any programming language is Turing-complete:

- Can express any computable function
- Compilation = Translation between TM-equivalent forms
- Bytecode = Another representation
```

## Compiler Construction

### Tool Chain

| Tool | Stage | Description |
|------|-------|-------------|
| **Lex** | Lexical analysis | RE → Tokens |
| **Yacc/Bison** | Parsing | CFG → Parse tree |
| **LLVM** | Optimization | IR transformations |
| **Assembly** | Code gen | Machine instructions |

### Phases

```text
Source Code
    ↓
┌─────────────────────────────────┐
│ 1. Lexical Analysis             │  → Tokens (Regular)
│    ↓                            │
│ 2. Syntax Analysis               │  → Parse Tree (CFG)
│    ↓                            │
│ 3. Semantic Analysis            │  → Annotated Tree
│    ↓                            │
│ 4. Intermediate Code            │  → IR (Three-address)
│    ↓                            │
│ 5. Optimization                 │  → Optimized IR
│    ↓                            │
│ 6. Code Generation              │  → Assembly/Machine
│    ↓                            │
│ 7. Assembly/Linking             │  → Executable
└─────────────────────────────────┘
```

## Algorithm Analysis

### Complexity Analysis

```text
Data Structure Operations:

| Operation | Array | Linked List | BST | Hash |
|-----------|-------|------------|-----|------|
| Search    | O(n)  | O(n)       | O(log n) | O(1) avg |
| Insert    | O(n)  | O(1)       | O(log n) | O(1) avg |
| Delete    | O(n)  | O(1)       | O(log n) | O(1) avg |
| Access    | O(1)  | O(n)       | O(log n) | O(n) |
```

### Graph Algorithms

```text
Complexity of graph algorithms:

| Algorithm | Time | Space | Type |
|-----------|------|-------|------|
| BFS | O(V+E) | O(V) | P |
| DFS | O(V+E) | O(V) | P |
| Dijkstra | O(V²) or O(E log V) | O(V) | P |
| Bellman-Ford | O(VE) | O(V) | P |
| Floyd-Warshall | O(V³) | O(V²) | P |
| Topological Sort | O(V+E) | O(V) | P |
```

## Formal Verification

### Model Checking

```text
Automata-based verification:

1. Model system as automata
2. Specify properties in temporal logic
3. Check product automaton
4. Extract counterexample if fails

Tools: Spin, NuSMV, UPPAAL
```

### Type Systems

```text
Type checking = Decision procedure:

- Regular languages: Lexer tokens
- Context-free: Parsing
- Context-sensitive: Type checking
- Turing-complete: May not terminate

Example:
int x = 5;      // Type check passes
x = "hello";   // Type check fails
```

## Database Theory

### Query Languages

```text
Relational algebra operations:

| Operation | Complexity | Equivalent |
|-----------|------------|------------|
| Selection (σ) | O(n) | WHERE |
| Projection (π) | O(n) | SELECT |
| Cross product (×) | O(n*m) | FROM |
| Union (∪) | O(n+m) | UNION |
| Difference (−) | O(n+m) | EXCEPT |

These are all in P (polynomial time)
```

### Normal Forms

```text
Normal forms = Grammar restrictions:

1NF: Atomic values
2NF: No partial dependencies
3NF: No transitive dependencies
BCNF: Determinant is candidate key

Each level = More restricted grammar
```

## Cryptography

### Complexity-based Cryptography

```text
Security based on hardness assumptions:

| Problem | Class | Security |
|---------|-------|----------|
| Integer factorization | NP (suspected) | RSA |
| Discrete log | NP (suspected) | DH, ElGamal |
| Lattice problems | NP-Hard | Post-quantum |
| Graph isomorphism | NP (suspected) | Some protocols |
```