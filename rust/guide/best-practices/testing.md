---
title: Rust Testing
description: การทดสอบโค้ด Rust ด้วย built-in test framework
---

## Testing

Rust มี built-in test framework ที่ powerful และ integrated กับ compiler

## Unit Tests

### Basic Test

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }

    #[test]
    fn test_multiply() {
        assert_eq!(multiply(3, 4), 12);
    }
}
```

### Assertions

```rust
#[test]
fn test_assertions() {
    assert_eq!(result, expected);
    assert_ne!(result, unexpected);
    assert!(condition);
    assert!(condition, "Custom message: {}", value);
}
```

### Should Panic

```rust
#[test]
#[should_panic(expected = "Expected panic message")]
fn test_panic() {
    panic!("Expected panic message");
}
```

### Result Tests

```rust
#[test]
fn test_result() -> Result<(), String> {
    let result = do_something()?;
    assert!(result.is_ok());
    Ok(())
}
```

## Integration Tests

สร้างไฟล์ใน `tests/` directory:

```rust
// tests/integration_test.rs
use my_crate;

#[test]
fn test_integration() {
    assert_eq!(my_crate::public_function(), expected);
}
```

## Documentation Tests

Tests ใน documentation comments:

```rust
/// Adds two numbers
///
/// # Examples
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Running Tests

```bash
# Run all tests
cargo test

# Run specific test
cargo test test_name

# Run tests in specific file
cargo test --lib
cargo test --bin binary_name

# Run with output
cargo test -- --nocapture

# Run tests in release mode
cargo test --release
```

## Test Organization

```
project/
├── src/
│   ├── lib.rs
│   └── module.rs
├── tests/
│   ├── integration_test.rs
│   └── another_test.rs
└── benches/
    └── benchmark.rs
```

## Best Practices

- เขียน tests พร้อมกับ code
- ใช้ descriptive test names
- Test edge cases และ error conditions
- Keep tests independent
- Use fixtures สำหรับ common setup
- Mock external dependencies

