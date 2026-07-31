# Performance Tips

```rust
// Preallocate vectors
let mut v = Vec::with_capacity(1000);

// Use iterators for lazy evaluation
let sum: i32 = (0..1000).filter(|x| x % 2 == 0).sum();

// Avoid unnecessary allocations
let s = format!("{} {}", a, b); // Allocates
let s = a.to_string() + " " + &b; // Also allocates

// Use const for compile-time computation
const fn square(x: i32) -> i32 { x * x }

// Profile before optimizing
// cargo flamegraph
```
