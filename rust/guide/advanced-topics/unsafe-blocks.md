# Unsafe Blocks

### Unsafe Blocks

```rust
// Use unsafe for raw pointer operations
let mut value = 5i32;
let r1 = &mut value as *mut i32;
unsafe {
    *r1 = 10;
}

// Extern functions
extern "C" {
    fn c_function(arg: i32) -> i32;
}
```
