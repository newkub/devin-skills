# Common Pitfalls

## 1. Type Coercion

```typescript
// Bad: Implicit coercion
const result = "10" + 5 // "105"

// Good: Explicit conversion
const result = Number("10") + 5 // 15
```

## 2. Any Type

```typescript
// Bad: Using any
function process(data: any) {
  return data.value
}

// Good: Using specific type
function process(data: { value: string }) {
  return data.value
}
```

## 3. Unsafe Rust

```rust
// Bad: Unsafe without justification
unsafe {
    let ptr = 0x1234 as *const i32;
    let value = *ptr;
}

// Good: Use safe alternatives
let value: i32 = 42;
```
