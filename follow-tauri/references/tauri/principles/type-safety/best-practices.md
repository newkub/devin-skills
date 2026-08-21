# Best Practices

## 1. Use Types Instead of Primitives

```rust
// Bad: Primitive types
fn process_user(id: u32, name: String) {
    // ...
}

// Good: Custom types
type UserId = u32;
type UserName = String;

fn process_user(id: UserId, name: UserName) {
    // ...
}
```

## 2. Newtype Pattern

```rust
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct UserId(u32);

impl UserId {
    fn new(id: u32) -> Self {
        Self(id)
    }

    fn value(&self) -> u32 {
        self.0
    }
}

fn process_user(id: UserId) {
    // Type-safe user ID
}
```

## 3. Exhaustive Pattern Matching

```rust
enum Status {
    Active,
    Inactive,
    Pending,
}

fn handle_status(status: Status) {
    match status {
        Status::Active => println!("Active"),
        Status::Inactive => println!("Inactive"),
        Status::Pending => println!("Pending"),
        // Compiler warns if case missing
    }
}
```

## 4. Type-Level Constraints

```rust
fn divide<N: Into<u32>, D: Into<u32>>(numerator: N, denominator: D) -> Result<f64, String> {
    let n = numerator.into();
    let d = denominator.into();

    if d == 0 {
        return Err("Division by zero".to_string());
    }

    Ok(n as f64 / d as f64)
}
```
