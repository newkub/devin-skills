# Best Practices

## Best Practices สำหรับ Compiler Design

### Architecture Principles

### 1. Separation of Concerns

แยก compiler เป็น phases ที่ชัดเจน:

```c
// ✅ Good: แยก lexer, parser, semantic analysis
Token* lex(const char* input);
ASTNode* parse(Token* tokens);
bool analyze_semantics(ASTNode* ast);

// ❌ Bad: รวมทุกอย่างใน function เดียว
void compile(const char* input) {
    // lex, parse, analyze, generate all in one
}
```

### 2. Modular Design

ใช้ modules ที่แยกกัน:

```
src/
├── lexer/
│   ├── lexer.c
│   └── lexer.h
├── parser/
│   ├── parser.c
│   └── parser.h
├── semantic/
│   ├── analyzer.c
│   └── analyzer.h
└── codegen/
    ├── generator.c
    └── generator.h
```

### 3. Data-Driven Design

ใช้ data structures แทน hard-coded logic:

```c
// ✅ Good: Data-driven
typedef struct {
    TokenType type;
    int precedence;
    bool is_right_associative;
} OperatorInfo;

OperatorInfo operators[] = {
    {TOKEN_PLUS, 1, false},
    {TOKEN_MINUS, 1, false},
    {TOKEN_MULTIPLY, 2, false},
    {TOKEN_DIVIDE, 2, false}
};

// ❌ Bad: Hard-coded
int get_precedence(TokenType type) {
    if (type == TOKEN_PLUS) return 1;
    if (type == TOKEN_MINUS) return 1;
    if (type == TOKEN_MULTIPLY) return 2;
    // ...
}
```

### Error Handling

### 4. Clear Error Messages

ให้ error messages ที่ชัดเจนและ actionable:

```c
// ✅ Good: Clear error message
report_error(node->location, 
    "Type mismatch: expected 'int', got 'string'");

// ❌ Bad: Vague error
report_error(node->location, "Type error");
```

### 5. Error Recovery

ใช้ strategies สำหรับ error recovery:

```c
// Panic mode: skip to synchronization point
void synchronize(Parser* parser) {
    while (parser->current_token.type != TOKEN_SEMICOLON &&
           parser->current_token.type != TOKEN_EOF) {
        advance(parser);
    }
}
```

### 6. Error Context

ให้ context ใน error messages:

```c
// ✅ Good: With context
report_error(location, 
    "Undefined variable '%s' at line %d, column %d",
    var_name, location.line, location.column);

// ❌ Bad: No context
report_error(location, "Undefined variable");
```

### Performance

### 7. Efficient Data Structures

ใช้ data structures ที่เหมาะสม:

```c
// ✅ Good: Hash table for symbol table
typedef struct {
    Symbol** buckets;
    int size;
} SymbolTable;

// ❌ Bad: Linear search
Symbol* find_symbol(SymbolTable* table, const char* name) {
    for (int i = 0; i < table->count; i++) {
        if (strcmp(table->symbols[i].name, name) == 0) {
            return &table->symbols[i];
        }
    }
    return NULL;
}
```

### 8. Memory Management

จัดการ memory อย่างระมัดระวัง:

```c
// ✅ Good: Clear ownership
ASTNode* create_node(NodeType type) {
    ASTNode* node = malloc(sizeof(ASTNode));
    node->type = type;
    return node;
}

void free_ast(ASTNode* node) {
    if (!node) return;
    free_ast(node->left);
    free_ast(node->right);
    free(node);
}

// ❌ Bad: Memory leaks
ASTNode* create_node(NodeType type) {
    return malloc(sizeof(ASTNode));
    // Never freed
}
```

### 9. Incremental Compilation

สนับสนุน incremental compilation:

```c
// Track file dependencies
typedef struct {
    char* source_file;
    time_t last_modified;
    char** dependencies;
    int dep_count;
} CompilationUnit;

bool needs_recompile(CompilationUnit* unit) {
    for (int i = 0; i < unit->dep_count; i++) {
        if (is_modified(unit->dependencies[i])) {
            return true;
        }
    }
    return false;
}
```

### Testing

### 10. Comprehensive Testing

ทดสอบทุก phases:

```c
// Test lexer
void test_lexer() {
    Token* tokens = lex("1 + 2");
    assert(tokens[0].type == TOKEN_NUMBER);
    assert(tokens[1].type == TOKEN_PLUS);
    assert(tokens[2].type == TOKEN_NUMBER);
}

// Test parser
void test_parser() {
    Token tokens[] = {TOKEN_NUMBER, TOKEN_PLUS, TOKEN_NUMBER, TOKEN_EOF};
    ASTNode* ast = parse(tokens);
    assert(ast->type == TOKEN_PLUS);
}

// Test code generation
void test_codegen() {
    // Generate code and verify output
}
```

### 11. Property-Based Testing

ใช้ property-based testing:

```c
// Property: (a + b) * c == a * c + b * c
void test_distributive_property() {
    for (int i = 0; i < 1000; i++) {
        int a = rand();
        int b = rand();
        int c = rand();
        
        double left = evaluate(parse("(a + b) * c"));
        double right = evaluate(parse("a * c + b * c"));
        
        assert(fabs(left - right) < 0.001);
    }
}
```

### Code Quality

### 12. Consistent Naming

ใช้ naming conventions ที่สม่ำเสมอ:

```c
// ✅ Good: Consistent naming
Token* lex(const char* input);
ASTNode* parse(Token* tokens);
bool validate(ASTNode* ast);
IRNode* generate(ASTNode* ast);

// ❌ Bad: Inconsistent naming
Token* tokenize(const char* str);
ASTNode* buildAST(Token* toks);
bool check(ASTNode* tree);
IRNode* emit(ASTNode* node);
```

### 13. Documentation

Document ทุก functions และ data structures:

```c
/**
 * Lexical analysis phase
 * 
 * @param input Source code string
 * @return Array of tokens, terminated by TOKEN_EOF
 * @note Caller must free returned array with free_tokens()
 */
Token* lex(const char* input);
```

### 14. Code Review

ทำ code review อย่างเป็นระบบ:

- Review ทุก changes
- Focus บน correctness, performance, maintainability
- Use automated tools (linters, static analysis)

### Optimization

### 15. Profile Before Optimizing

ใช้ profiling ก่อน optimize:

```bash
# Profile with gprof
gcc -pg source.c
./a.out
gprof a.out gmon.out > analysis.txt
```

### 16. Measure Impact

วัดผลของแต่ละ optimization:

```c
// Before optimization
double time_before = benchmark();

// Apply optimization
enable_optimization();

// After optimization
double time_after = benchmark();

printf("Speedup: %.2fx\n", time_before / time_after);
```

### 17. Gradual Optimization

ทำ optimization ทีละขั้น:

```c
// Phase 1: Basic optimizations
apply_constant_folding();
apply_dead_code_elimination();

// Phase 2: Advanced optimizations
apply_loop_optimizations();
apply_inlining();

// Phase 3: Machine-specific optimizations
apply_vectorization();
apply_register_allocation();
```

### Security

### 18. Input Validation

ตรวจสอบ input อย่างระมัดระวัง:

```c
// ✅ Good: Validate input
if (input_length > MAX_INPUT_SIZE) {
    report_error("Input too large");
    return ERROR;
}

// ❌ Bad: No validation
char* buffer = malloc(input_length);  // Could overflow
```

### 19. Buffer Overflow Prevention

ป้องกัน buffer overflow:

```c
// ✅ Good: Safe string operations
strncpy(buffer, input, sizeof(buffer) - 1);
buffer[sizeof(buffer) - 1] = '\0';

// ❌ Bad: Unsafe
strcpy(buffer, input);  // Could overflow
```

### 20. Sandboxing

ใช้ sandboxing สำหรับ untrusted code:

```c
// Run compiled code in sandbox
run_in_sandbox(compiled_code, memory_limit, time_limit);
```
