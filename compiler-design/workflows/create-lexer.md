---
description: สร้าง lexer สำหรับ compiler
---

## Goal

สร้าง lexer (lexical analyzer) สำหรับแปลง source code เป็น tokens

## Scope

ใช้สำหรับสร้าง lexer ใหม่ หรือปรับปรุง lexer ที่มีอยู่

## Execute

### 1. กำหนด Token Types

กำหนด token types ที่จำเป็นสำหรับภาษา:

```c
typedef enum {
    TOKEN_EOF,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_KEYWORD,
    TOKEN_OPERATOR,
    TOKEN_PUNCTUATION,
    // ... เพิ่ม token types อื่นๆ ตามต้องการ
} TokenType;
```

### 2. ออกแบบ Token Structure

สร้าง structure สำหรับเก็บ token information:

```c
typedef struct {
    TokenType type;
    char* value;
    int line;
    int column;
} Token;
```

### 3. เลือก Lexer Implementation

เลือกวิธี implementation:

- **Hand-written lexer**: Flexible, control สูง
- **Generated lexer** (Flex/Lex): Fast, maintainable
- **Table-driven lexer**: Compact, fast lookups

### 4. Implement Lexer

สร้าง lexer function:

```c
Token* lex(const char* input) {
    // 1. Initialize lexer state
    // 2. Loop through characters
    // 3. Classify characters
    // 4. Build tokens
    // 5. Return token stream
}
```

### 5. Test Lexer

ทดสอบ lexer กับ input ต่างๆ:

```c
void test_lexer() {
    Token* tokens = lex("int x = 42;");
    // Verify tokens
}
```

## Rules

- ใช้ภาษาไทยในการอธิบาย
- ให้ code examples ที่ชัดเจนและใช้งานได้จริง
- อ้างอิง sources ที่เชื่อถือได้

## Expected Outcome

- Lexer ที่แปลง source code เป็น tokens ได้อย่างถูกต้อง
- Error handling ที่ดีสำหรับ invalid input
- Test coverage ที่เพียงพอ
