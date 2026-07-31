# Architecture

## Compiler Architecture Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend                              │
├─────────────────────────────────────────────────────────┤
│  Source Code → Lexer → Parser → Semantic Analysis       │
│                                                          │
│  Output: Typed AST + Symbol Table                       │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Middle End                            │
├─────────────────────────────────────────────────────────┤
│  AST → IR Generation → Optimization Passes              │
│                                                          │
│  Output: Optimized IR                                   │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    Backend                               │
├─────────────────────────────────────────────────────────┤
│  IR → Instruction Selection → Register Allocation       │
│      → Code Scheduling → Assembly Generation            │
│                                                          │
│  Output: Machine Code / Assembly                         │
└─────────────────────────────────────────────────────────┘
```

### Frontend Architecture

### Lexer Architecture

```
┌──────────────┐
│  Input       │
│  Stream      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Character   │
│  Classifier  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Token       │
│  Builder     │
└──────┬───────┘
       ↓
┌──────────────┐
│  Token       │
│  Stream      │
└──────────────┘
```

**Implementation Strategies**:

1. **Hand-written Lexer**: Flexible, control over error handling
2. **Generated Lexer** (Flex/Lex): Fast, maintainable for complex grammars
3. **Table-driven Lexer**: Compact, fast lookups

### Parser Architecture

```
┌──────────────┐
│  Token       │
│  Stream      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Lookahead   │
│  Buffer      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Grammar     │
│  Rules       │
└──────┬───────┘
       ↓
┌──────────────┐
│  AST         │
│  Builder     │
└──────┬───────┘
       ↓
┌──────────────┐
│  AST         │
└──────────────┘
```

**Parser Types**:

| Type | Complexity | Speed | Use Case |
|------|------------|-------|----------|
| **Recursive Descent** | Low | Fast | Simple grammars |
| **LL(k)** | Medium | Fast | Predictive grammars |
| **LR(k)** | High | Very Fast | Complex grammars |
| **GLR** | Very High | Medium | Ambiguous grammars |

### Semantic Analysis Architecture

```
┌──────────────┐
│  AST         │
└──────┬───────┘
       ↓
┌──────────────┐
│  Symbol      │
│  Table       │
└──────┬───────┘
       ↓
┌──────────────┐
│  Type        │
│  Checker     │
└──────┬───────┘
       ↓
┌──────────────┐
│  Scope       │
│  Resolver    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Typed AST   │
└──────────────┘
```

**Symbol Table Design**:

```c
typedef struct {
    char* name;
    Type type;
    int scope_level;
    bool is_mutable;
} Symbol;

typedef struct {
    Symbol** buckets;
    int size;
    int count;
} SymbolTable;
```

### Middle End Architecture

### IR Design

```
┌──────────────┐
│  AST         │
└──────┬───────┘
       ↓
┌──────────────┐
│  IR          │
│  Generator   │
└──────┬───────┘
       ↓
┌──────────────┐
│  IR          │
│  (SSA)       │
└──────┬───────┘
       ↓
┌──────────────┐
│  Optimizer   │
│  Passes      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Optimized   │
│  IR          │
└──────────────┘
```

**IR Types**:

1. **Three-Address Code (TAC)**: Simple, easy to optimize
2. **Static Single Assignment (SSA)**: Enables powerful optimizations
3. **Control Flow Graph (CFG)**: Represents control flow
4. **LLVM IR**: Industry-standard, portable

**Optimization Passes**:

```
Pass Manager
    ↓
┌──────────────┐
│  Pass 1      │
│  Constant    │
│  Folding     │
└──────┬───────┘
       ↓
┌──────────────┐
│  Pass 2      │
│  Dead Code   │
│  Elimination │
└──────┬───────┘
       ↓
┌──────────────┐
│  Pass 3      │
│  Loop        │
│  Optimizations│
└──────┬───────┘
       ↓
┌──────────────┐
│  Pass N      │
│  ...         │
└──────────────┘
```

### Backend Architecture

### Code Generation Pipeline

```
┌──────────────┐
│  IR          │
└──────┬───────┘
       ↓
┌──────────────┐
│  Instruction │
│  Selection  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Register    │
│  Allocation  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Code        │
│  Scheduling  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Assembly    │
│  Generation  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Machine     │
│  Code        │
└──────────────┘
```

**Register Allocation Strategies**:

1. **Graph Coloring**: Optimal, but slow
2. **Linear Scan**: Fast, suitable for JIT
3. **Iterative Coalescing**: Balance between quality and speed

### Multi-Target Architecture

```
┌─────────────────────────────────────┐
│         Target-Independent IR        │
└──────────────┬──────────────────────┘
               ↓
    ┌──────────┴──────────┐
    ↓                     ↓
┌─────────┐          ┌─────────┐
│ x86-64  │          │  ARM64  │
│ Backend │          │ Backend │
└────┬────┘          └────┬────┘
     ↓                    ↓
┌─────────┐          ┌─────────┐
│ x86-64  │          │  ARM64  │
│ Code    │          │  Code   │
└─────────┘          └─────────┘
```

### Plugin Architecture

```
┌─────────────────────────────────────┐
│         Compiler Core               │
└──────────────┬──────────────────────┘
               ↓
    ┌──────────┴──────────┐
    ↓                     ↓
┌─────────┐          ┌─────────┐
│ Plugin  │          │ Plugin  │
│  A      │          │   B     │
└─────────┘          └─────────┘
```

**Plugin Types**:

1. **Lexer Plugins**: Custom tokenizers
2. **Parser Plugins**: Grammar extensions
3. **Optimization Plugins**: Custom passes
4. **Backend Plugins**: New targets

### Error Handling Architecture

```
┌──────────────┐
│  Error       │
│  Detector    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Error       │
│  Classifier  │
└──────┬───────┘
       ↓
┌──────────────┐
│  Error       │
│  Reporter    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Error       │
│  Recovery    │
└──────────────┘
```

### Build System Integration

```
┌──────────────┐
│  Build       │
│  System      │
└──────┬───────┘
       ↓
┌──────────────┐
│  Dependency  │
│  Analysis    │
└──────┬───────┘
       ↓
┌──────────────┐
│  Incremental │
│  Compilation│
└──────┬───────┘
       ↓
┌──────────────┐
│  Parallel    │
│  Execution   │
└──────────────┘
```
