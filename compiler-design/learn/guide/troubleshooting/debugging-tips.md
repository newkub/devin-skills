# Debugging Tips

## 1. Enable Debug Output

```c
#define DEBUG_LEXER
#ifdef DEBUG_LEXER
    printf("Token: %d\n", token.type);
#endif
```

## 2. Use Debuggers

```bash
# GDB
gdb ./mycompiler
(gdb) break lexer.c:42
(gdb) run
(gdb) print token.type

# LLDB
lldb ./mycompiler
(lldb) breakpoint set --file lexer.c --line 42
(lldb) run
(lldb) frame variable token
```

## 3. Unit Testing

```c
void test_lexer() {
    Token* tokens = lex("1 + 2");
    assert(tokens[0].type == TOKEN_NUMBER);
    assert(tokens[1].type == TOKEN_PLUS);
    assert(tokens[2].type == TOKEN_NUMBER);
}
```

## 4. Integration Testing

```bash
# Test full compilation pipeline
./mycompiler test.c -o test
./test
```
