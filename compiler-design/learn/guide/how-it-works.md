# How It Works

## Compiler Pipeline อย่างละเอียด

### Phase 1: Lexical Analysis

**Process**:
1. อ่าน source code character ทีละตัว
2. Group characters เป็น tokens ตาม rules
3. Skip whitespace และ comments
4. Report lexical errors

**Implementation**:
```c
typedef enum {
    TOKEN_KEYWORD,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_OPERATOR,
    TOKEN_EOF
} TokenType;

typedef struct {
    TokenType type;
    char* value;
    int line;
    int column;
} Token;
```

### Phase 2: Syntax Analysis

**Parsing Strategies**:

| Strategy | Pros | Cons |
|----------|------|------|
| **Recursive Descent** | Simple, readable | Limited for left-recursive grammars |
| **LR Parsing** | Powerful, handles all CFGs | Complex to implement |
| **LL Parsing** | Predictive, efficient | Requires restrictive grammar |
| **Operator Precedence** | Simple for expressions | Limited scope |

**AST Structure**:
```c
typedef enum {
    NODE_PROGRAM,
    NODE_FUNCTION,
    NODE_RETURN,
    NODE_BINARY_OP,
    NODE_NUMBER
} NodeType;

typedef struct ASTNode {
    NodeType type;
    struct ASTNode** children;
    int child_count;
    void* data;
} ASTNode;
```

### Phase 3: Semantic Analysis

**Type Checking**:
```c
bool check_types(ASTNode* node, SymbolTable* table) {
    switch (node->type) {
        case NODE_BINARY_OP:
            Type left = get_type(node->children[0], table);
            Type right = get_type(node->children[1], table);
            return types_compatible(left, right);
        // ... other cases
    }
}
```

**Symbol Table**:
```c
typedef struct {
    char* name;
    Type type;
    int scope_level;
} Symbol;

typedef struct {
    Symbol* symbols;
    int count;
    int capacity;
} SymbolTable;
```

### Phase 4: Intermediate Representation

**Three-Address Code Example**:
```
Source: a = (b + c) * d - e

TAC:
t1 = b + c
t2 = t1 * d
t3 = t2 - e
a = t3
```

**SSA Transformation**:
```
Before SSA:
x = 1
x = x + 1
x = x * 2

After SSA:
x1 = 1
x2 = x1 + 1
x3 = x2 * 2
```

### Phase 5: Optimization

**Common Optimizations**:

1. **Constant Folding**:
```
Before: x = 3 + 4
After:  x = 7
```

2. **Dead Code Elimination**:
```
Before: x = 5; return 10;
After:  return 10;
```

3. **Loop Invariant Code Motion**:
```
Before:
for (i = 0; i < n; i++) {
    x = a + b;  // invariant
    arr[i] = x;
}

After:
x = a + b;
for (i = 0; i < n; i++) {
    arr[i] = x;
}
```

4. **Function Inlining**:
```
Before:
int square(int x) { return x * x; }
int y = square(5);

After:
int y = 5 * 5;
```

### Phase 6: Code Generation

**Register Allocation**:
- **Graph Coloring**: Treat registers as colors, assign to variables
- **Linear Scan**: Simple, fast, suitable for JIT
- **Spilling**: Move variables to memory when registers exhausted

**Instruction Selection**:
- **Pattern Matching**: Match IR patterns to machine instructions
- **Tree Covering**: Cover AST with instruction patterns
- **DAG-based**: Optimize instruction sequences

### Error Handling

**Error Types**:
1. **Lexical Errors**: Invalid characters, unclosed strings
2. **Syntax Errors**: Grammar violations
3. **Semantic Errors**: Type mismatches, undefined symbols
4. **Runtime Errors**: (ใน compiled code)

**Error Recovery Strategies**:
- **Panic Mode**: Skip to synchronization point
- **Error Productions**: Add grammar rules for errors
- **Global Correction**: Attempt to fix errors automatically
