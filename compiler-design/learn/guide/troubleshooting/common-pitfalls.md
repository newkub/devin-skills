# Common Pitfalls

## 1. Memory Leaks

```c
// ✅ Good: Free all allocations
Token* tokens = lex(input);
// ... use tokens
free_tokens(tokens);

// ❌ Bad: Memory leak
Token* tokens = lex(input);
// ... use tokens
// Never freed!
```

## 2. Buffer Overflows

```c
// ✅ Good: Check bounds
if (pos < buffer_size) {
    buffer[pos++] = c;
}

// ❌ Bad: No bounds checking
buffer[pos++] = c;  // Could overflow
```

## 3. Undefined Behavior

```c
// ✅ Good: Initialize variables
int value = 0;

// ❌ Bad: Uninitialized
int value;  // Undefined value
```
