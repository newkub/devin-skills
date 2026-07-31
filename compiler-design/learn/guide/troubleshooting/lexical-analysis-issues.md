# Lexical Analysis Issues

## Problem: Lexer Hangs or Crashes

**Symptoms**:
- Lexer ไม่ return
- Segmentation fault
- Infinite loop

**Causes**:
1. ไม่ handle EOF อย่างถูกต้อง
2. Buffer overflow
3. ไม่ skip whitespace อย่างถูกต้อง

**Solutions**:

```c
// ✅ Good: Handle EOF properly
Token* lex(const char* input) {
    while (input[pos] != '\0') {  // Check for EOF
        // ... process tokens
    }
    
    // Always return EOF token
    tokens[token_pos].type = TOKEN_EOF;
    return tokens;
}

// ❌ Bad: No EOF handling
Token* lex(const char* input) {
    while (true) {  // Infinite loop!
        // ... process tokens
    }
}
```

## Problem: Incorrect Tokenization

**Symptoms**:
- Tokens ไม่ถูกต้อง
- Keywords ถูก treat เป็น identifiers

**Causes**:
1. Token precedence ผิด
2. ไม่ handle multi-character operators
3. ไม่ distinguish keywords จาก identifiers

**Solutions**:

```c
// ✅ Good: Check keywords before identifiers
if (is_keyword(input)) {
    tokens[token_pos].type = TOKEN_KEYWORD;
} else if (is_identifier(input)) {
    tokens[token_pos].type = TOKEN_IDENTIFIER;
}

// ❌ Bad: Check identifiers first
if (is_identifier(input)) {
    tokens[token_pos].type = TOKEN_IDENTIFIER;  // "if" becomes identifier
}
```
