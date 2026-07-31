# Functions

```rust
fn add(a: i32, b: i32) -> i32 {
    a + b  // No semicolon = return value
}

fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let result = add(5, 3);
    greet("Rust");
    println!("Result: {}", result);
}
```
