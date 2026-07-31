# Formatting and Style

```rust
// Use rustfmt
// cargo fmt

// Avoid long lines (>100 chars)
fn very_long_function_name(
    parameter_one: Type,
    parameter_two: Type,
    parameter_three: Type,
) -> ReturnType {
    // ...
}

// Use meaningful names
let user_age = 25;      // Good
let a = 25;             // Bad

// Group imports
use std::collections::{HashMap, HashSet};
use std::io::{self, Write};
```
