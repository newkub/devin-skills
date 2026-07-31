/**
 * Simple Lexer Template
 * 
 * Template สำหรับสร้าง lexer พื้นฐาน
 * แก้ไข token types และ rules ตามภาษาที่ต้องการ
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

typedef enum {
    TOKEN_EOF,
    TOKEN_IDENTIFIER,
    TOKEN_NUMBER,
    TOKEN_STRING,
    TOKEN_PLUS,
    TOKEN_MINUS,
    TOKEN_MULTIPLY,
    TOKEN_DIVIDE,
    TOKEN_ASSIGN,
    TOKEN_SEMICOLON,
    TOKEN_LPAREN,
    TOKEN_RPAREN,
    TOKEN_LBRACE,
    TOKEN_RBRACE,
    // เพิ่ม token types อื่นๆ ตามต้องการ
} TokenType;

typedef struct {
    TokenType type;
    char* value;
    int line;
    int column;
} Token;

typedef struct {
    const char* input;
    int position;
    int line;
    int column;
} Lexer;

Lexer* create_lexer(const char* input) {
    Lexer* lexer = malloc(sizeof(Lexer));
    lexer->input = input;
    lexer->position = 0;
    lexer->line = 1;
    lexer->column = 1;
    return lexer;
}

char peek(Lexer* lexer) {
    return lexer->input[lexer->position];
}

char advance(Lexer* lexer) {
    char c = lexer->input[lexer->position];
    lexer->position++;
    if (c == '\n') {
        lexer->line++;
        lexer->column = 1;
    } else {
        lexer->column++;
    }
    return c;
}

Token* create_token(TokenType type, char* value, int line, int column) {
    Token* token = malloc(sizeof(Token));
    token->type = type;
    token->value = value;
    token->line = line;
    token->column = column;
    return token;
}

Token* lex_number(Lexer* lexer) {
    int start_line = lexer->line;
    int start_column = lexer->column;
    
    char buffer[256];
    int i = 0;
    
    while (isdigit(peek(lexer))) {
        buffer[i++] = advance(lexer);
    }
    buffer[i] = '\0';
    
    char* value = malloc(strlen(buffer) + 1);
    strcpy(value, buffer);
    
    return create_token(TOKEN_NUMBER, value, start_line, start_column);
}

Token* lex_identifier(Lexer* lexer) {
    int start_line = lexer->line;
    int start_column = lexer->column;
    
    char buffer[256];
    int i = 0;
    
    while (isalnum(peek(lexer)) || peek(lexer) == '_') {
        buffer[i++] = advance(lexer);
    }
    buffer[i] = '\0';
    
    char* value = malloc(strlen(buffer) + 1);
    strcpy(value, buffer);
    
    // Check for keywords
    if (strcmp(buffer, "int") == 0) {
        // เพิ่ม keyword checks อื่นๆ ตามต้องการ
    }
    
    return create_token(TOKEN_IDENTIFIER, value, start_line, start_column);
}

Token* lex(Lexer* lexer) {
    while (peek(lexer) != '\0') {
        char c = peek(lexer);
        
        // Skip whitespace
        if (isspace(c)) {
            advance(lexer);
            continue;
        }
        
        // Numbers
        if (isdigit(c)) {
            return lex_number(lexer);
        }
        
        // Identifiers
        if (isalpha(c) || c == '_') {
            return lex_identifier(lexer);
        }
        
        // Operators and punctuation
        switch (c) {
            case '+':
                advance(lexer);
                return create_token(TOKEN_PLUS, NULL, lexer->line, lexer->column);
            case '-':
                advance(lexer);
                return create_token(TOKEN_MINUS, NULL, lexer->line, lexer->column);
            case '*':
                advance(lexer);
                return create_token(TOKEN_MULTIPLY, NULL, lexer->line, lexer->column);
            case '/':
                advance(lexer);
                return create_token(TOKEN_DIVIDE, NULL, lexer->line, lexer->column);
            case '=':
                advance(lexer);
                return create_token(TOKEN_ASSIGN, NULL, lexer->line, lexer->column);
            case ';':
                advance(lexer);
                return create_token(TOKEN_SEMICOLON, NULL, lexer->line, lexer->column);
            case '(':
                advance(lexer);
                return create_token(TOKEN_LPAREN, NULL, lexer->line, lexer->column);
            case ')':
                advance(lexer);
                return create_token(TOKEN_RPAREN, NULL, lexer->line, lexer->column);
            case '{':
                advance(lexer);
                return create_token(TOKEN_LBRACE, NULL, lexer->line, lexer->column);
            case '}':
                advance(lexer);
                return create_token(TOKEN_RBRACE, NULL, lexer->line, lexer->column);
            default:
                printf("Unknown character: %c\n", c);
                advance(lexer);
        }
    }
    
    return create_token(TOKEN_EOF, NULL, lexer->line, lexer->column);
}

int main() {
    const char* input = "int x = 42;";
    Lexer* lexer = create_lexer(input);
    
    Token* token;
    while ((token = lex(lexer))->type != TOKEN_EOF) {
        printf("Token: %d, Value: %s, Line: %d, Column: %d\n",
               token->type, token->value, token->line, token->column);
    }
    
    return 0;
}
