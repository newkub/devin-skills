# Test Project

## Test Project ด้วย Cargo

## Run All Tests

```bash
cargo test
```

## Run Specific Test

```bash
cargo test test_name
```

## Run Tests in File

```bash
cargo test --test integration_test
```

## Run Unit Tests

```bash
cargo test --lib
```

## Run Doc Tests

```bash
cargo test --doc
```

## Run Tests with Output

```bash
cargo test -- --nocapture
```

## Run Tests with Single Thread

```bash
cargo test -- --test-threads=1
```

## Run Tests in Release Mode

```bash
cargo test --release
```

## Run Tests with Features

```bash
cargo test --features feature1
```

## Run Specific Module Tests

```bash
cargo test utils::
```

## Test Output

### Verbose Output

```bash
cargo test -vv
```

### Show Test Names

```bash
cargo test -- --list
```

## Test Coverage

### Install Tarpaulin

```bash
cargo install cargo-tarpaulin
```

### Generate Coverage

```bash
cargo tarpaulin --out Html
```

## Test Patterns

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }
}
```

### Integration Tests

```rust
// tests/integration_test.rs
use my_crate;

#[test]
fn test_integration() {
    // integration test
}
```

### Doc Tests

```rust
/// Adds two numbers.
///
/// ```
/// let result = add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

## Test Best Practices

### 1. Run Tests ก่อน Commit

```bash
cargo test
cargo clippy
cargo fmt -- --check
```

### 2. ใช้ Descriptive Names

```rust
#[test]
fn test_add_returns_correct_sum() {}
```

### 3. Test ทั้ง Success และ Failure

```rust
#[test]
fn test_success() {
    assert!(result.is_ok());
}

#[test]
fn test_failure() {
    assert!(result.is_err());
}
```

## Next Steps

- อ่าน [publish-crate.md](./publish-crate.md) สำหรับการ publish
