---
description: สร้าง parser สำหรับ compiler
---

## Goal

สร้าง parser (syntax analyzer) สำหรับตรวจสอบ grammar และสร้าง AST

## Scope

ใช้สำหรับสร้าง parser ใหม่ หรือปรับปรุง parser ที่มีอยู่

## Execute

### 1. กำหนด Grammar

กำหนด grammar สำหรับภาษา:

```
expression → term (op term)*
term → factor (op factor)*
factor → number | identifier | '(' expression ')'
```

### 2. ออกแบบ AST Structure

สร้าง structure สำหรับ AST nodes:

```c
typedef enum {
    NODE_NUMBER,
    NODE_IDENTIFIER,
    NODE_BINARY_OP,
    NODE_UNARY_OP,
    // ... เพิ่ม node types อื่นๆ
} NodeType;

typedef struct ASTNode {
    NodeType type;
    union {
        double number;
        char* identifier;
        struct {
            struct ASTNode* left;
            struct ASTNode* right;
            char* op;
        } binary;
    } value;
} ASTNode;
```

### 3. เลือก Parser Type

เลือก parser type:

- **Recursive Descent**: Simple, easy to implement
- **LL(k)**: Predictive, fast
- **LR(k)**: Complex, very fast
- **GLR**: Handles ambiguous grammars

### 4. Implement Parser

สร้าง parser function:

```c
ASTNode* parse(Token* tokens) {
    // 1. Initialize parser state
    // 2. Parse expressions
    // 3. Build AST
    // 4. Return AST
}
```

### 5. Test Parser

ทดสอบ parser กับ input ต่างๆ:

```c
void test_parser() {
    Token* tokens = lex("1 + 2 * 3");
    ASTNode* ast = parse(tokens);
    // Verify AST structure
}
```

## Rules

- ใช้ภาษาไทยในการอธิบาย
- ให้ code examples ที่ชัดเจนและใช้งานได้จริง
- อ้างอิง sources ที่เชื่อถือได้

## Expected Outcome

- Parser ที่สร้าง AST ได้อย่างถูกต้อง
- Error handling ที่ดีสำหรับ syntax errors
- Test coverage ที่เพียงพอ
