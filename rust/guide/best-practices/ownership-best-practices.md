# Ownership Best Practices

```rust
// Prefer borrowing over ownership when possible
fn process(data: &[u8]) { }  // Good

// Use clone when you need to own data
let owned = data.to_vec();

// Use Arc for shared ownership across threads
use std::sync::Arc;
let shared = Arc::new(vec![1, 2, 3]);

// Use Rc for single-threaded shared ownership
use std::rc::Rc;
let shared = Rc::new(vec![1, 2, 3]);

// Minimize mutable references
let mut data = vec![1, 2, 3];
transform(&mut data);  // Only when necessary
```
