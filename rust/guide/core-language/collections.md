# Collections

```rust
fn main() {
    // Vector
    let mut v: Vec<i32> = Vec::new();
    v.push(1);
    v.push(2);
    v.push(3);

    // Array literal
    let v2 = vec![1, 2, 3];

    // HashMap
    use std::collections::HashMap;
    let mut scores = HashMap::new();
    scores.insert("Blue", 10);
    scores.insert("Yellow", 50);
}
```
