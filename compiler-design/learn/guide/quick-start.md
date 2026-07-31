# Quick Start

## เริ่มต้นสร้าง Compiler อย่างรวดเร็ว

### Step 1: สร้าง Project Structure

```bash
mkdir simple-compiler
cd simple-compiler
mkdir src include tests build
```

### Step 2: สร้าง Lexer

**include/lexer.h**:
```c
#ifndef LEXER_H
#define LEXER_H

typedef enum {
    TOKEN_EOF,
    TOKEN_NUMBER,
    TOKEN_PLUS,
    TOKEN_MINUS,
    TOKEN_MULTIPLY,
    TOKEN_DIVIDE,
    TOKEN_LPAREN,
    TOKEN_RPAREN
} TokenType;

typedef struct {
    TokenType type;
    double value;
} Token;

Token* lex(const char* input);
void free_tokens(Token* tokens);

#endif
```

**src/lexer.c**:
```c
#include "lexer.h"
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

Token* lex(const char* input) {
    Token* tokens = malloc(100 * sizeof(Token));
    int pos = 0;
    int token_pos = 0;
    
    while (input[pos] != '\0') {
        // Skip whitespace
        if (isspace(input[pos])) {
            pos++;
            continue;
        }
        
        // Numbers
        if (isdigit(input[pos]) || input[pos] == '.') {
            char* end;
            double value = strtod(&input[pos], &end);
            tokens[token_pos].type = TOKEN_NUMBER;
            tokens[token_pos].value = value;
            token_pos++;
            pos = end - input;
            continue;
        }
        
        // Operators
        switch (input[pos]) {
            case '+':
                tokens[token_pos].type = TOKEN_PLUS;
                token_pos++;
                break;
            case '-':
                tokens[token_pos].type = TOKEN_MINUS;
                token_pos++;
                break;
            case '*':
                tokens[token_pos].type = TOKEN_MULTIPLY;
                token_pos++;
                break;
            case '/':
                tokens[token_pos].type = TOKEN_DIVIDE;
                token_pos++;
                break;
            case '(':
                tokens[token_pos].type = TOKEN_LPAREN;
                token_pos++;
                break;
            case ')':
                tokens[token_pos].type = TOKEN_RPAREN;
                token_pos++;
                break;
            default:
                pos++;
        }
        pos++;
    }
    
    tokens[token_pos].type = TOKEN_EOF;
    return tokens;
}

void free_tokens(Token* tokens) {
    free(tokens);
}
```

### Step 3: สร้าง Parser

**include/parser.h**:
```c
#ifndef PARSER_H
#define PARSER_H

#include "lexer.h"

typedef struct ASTNode {
    TokenType type;
    double value;
    struct ASTNode* left;
    struct ASTNode* right;
} ASTNode;

ASTNode* parse(Token* tokens);
double evaluate(ASTNode* node);
void free_ast(ASTNode* node);

#endif
```

**src/parser.c**:
```c
#include "parser.h"
#include <stdlib.h>

static int current_token = 0;
static Token* tokens;

ASTNode* parse_expression();
ASTNode* parse_term();
ASTNode* parse_factor();

ASTNode* parse(Token* input_tokens) {
    tokens = input_tokens;
    current_token = 0;
    return parse_expression();
}

ASTNode* parse_expression() {
    ASTNode* left = parse_term();
    
    while (tokens[current_token].type == TOKEN_PLUS || 
           tokens[current_token].type == TOKEN_MINUS) {
        ASTNode* node = malloc(sizeof(ASTNode));
        node->type = tokens[current_token].type;
        current_token++;
        node->left = left;
        node->right = parse_term();
        left = node;
    }
    
    return left;
}

ASTNode* parse_term() {
    ASTNode* left = parse_factor();
    
    while (tokens[current_token].type == TOKEN_MULTIPLY || 
           tokens[current_token].type == TOKEN_DIVIDE) {
        ASTNode* node = malloc(sizeof(ASTNode));
        node->type = tokens[current_token].type;
        current_token++;
        node->left = left;
        node->right = parse_factor();
        left = node;
    }
    
    return left;
}

ASTNode* parse_factor() {
    if (tokens[current_token].type == TOKEN_NUMBER) {
        ASTNode* node = malloc(sizeof(ASTNode));
        node->type = TOKEN_NUMBER;
        node->value = tokens[current_token].value;
        node->left = NULL;
        node->right = NULL;
        current_token++;
        return node;
    }
    
    if (tokens[current_token].type == TOKEN_LPAREN) {
        current_token++;
        ASTNode* node = parse_expression();
        current_token++; // skip RPAREN
        return node;
    }
    
    return NULL;
}

double evaluate(ASTNode* node) {
    if (!node) return 0;
    
    switch (node->type) {
        case TOKEN_NUMBER:
            return node->value;
        case TOKEN_PLUS:
            return evaluate(node->left) + evaluate(node->right);
        case TOKEN_MINUS:
            return evaluate(node->left) - evaluate(node->right);
        case TOKEN_MULTIPLY:
            return evaluate(node->left) * evaluate(node->right);
        case TOKEN_DIVIDE:
            return evaluate(node->left) / evaluate(node->right);
        default:
            return 0;
    }
}

void free_ast(ASTNode* node) {
    if (!node) return;
    free_ast(node->left);
    free_ast(node->right);
    free(node);
}
```

### Step 4: สร้าง Main Program

**src/main.c**:
```c
#include "lexer.h"
#include "parser.h"
#include <stdio.h>

int main() {
    char input[256];
    printf("Enter expression: ");
    fgets(input, sizeof(input), stdin);
    
    // Remove newline
    input[strcspn(input, "\n")] = '\0';
    
    // Lex
    Token* tokens = lex(input);
    
    // Parse
    ASTNode* ast = parse(tokens);
    
    // Evaluate
    double result = evaluate(ast);
    printf("Result: %f\n", result);
    
    // Cleanup
    free_ast(ast);
    free_tokens(tokens);
    
    return 0;
}
```

### Step 5: Build และ Run

```bash
# Build
gcc -o simple-compiler src/main.c src/lexer.c src/parser.c -Iinclude

# Run
./simple-compiler
Enter expression: 3 + 4 * 2
Result: 11.000000
```

### Step 6: เพิ่ม Features

เพิ่ม features ต่อไปนี้:
- Variables และ assignments
- Functions
- Control flow (if, while)
- Type checking
- Error handling
- Optimization passes

### Next Steps

1. อ่าน `key-concept.md` สำหรับ concepts เพิ่มเติม
2. ดู `how-it-works.md` สำหรับ pipeline อย่างละเอียด
3. ศึกษา `architecture.md` สำหรับ design patterns
4. ทำตาม `best-practices.md` สำหรับ production-ready code
