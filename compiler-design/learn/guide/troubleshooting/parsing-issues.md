# Parsing Issues

## Problem: Parse Errors

**Symptoms**:
- Syntax errors ที่ไม่คาดคิด
- Parser ไม่ recognize valid syntax

**Causes**:
1. Grammar rules ผิด
2. Left recursion ไม่ถูก handle
3. Precedence ผิด

**Solutions**:

```c
// ✅ Good: Eliminate left recursion
// Before: expr → expr + term
// After:  expr → term expr'
//         expr' → + term expr' | ε

// ❌ Bad: Left recursion causes infinite loop
ASTNode* parse_expression() {
    ASTNode* left = parse_expression();  // Infinite recursion!
    // ...
}
```

## Problem: Ambiguous Grammar

**Symptoms**:
- Parser สร้าง AST ที่ผิด
- Multiple parse trees สำหรับ input เดียวกัน

**Causes**:
1. Grammar ไม่ unambiguous
2. Operator precedence ไม่ชัดเจน

**Solutions**:

```c
// ✅ Good: Define precedence explicitly
typedef struct {
    TokenType type;
    int precedence;
} OperatorInfo;

OperatorInfo operators[] = {
    {TOKEN_MULTIPLY, 2},
    {TOKEN_PLUS, 1}
};

// ❌ Bad: No precedence definition
// Parser doesn't know which operator binds tighter
```
