# Testing Strategy

## หลักการ Testing ใน Cargo

## Test Types

### Unit Tests

Test functions และ modules แยก

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

Test การทำงานร่วมกันของ components

```
tests/
├── integration_test.rs
└── api_test.rs
```

```rust
// tests/integration_test.rs
use my_crate;

#[test]
fn test_integration() {
    // integration test
}
```

### Documentation Tests

Test ใน doc comments

```rust
/// Adds two numbers.
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

## Test Organization

### Test Module Structure

```rust
#[cfg(test)]
mod tests {
    use super::*;

    mod utils {
        use super::super::utils;

        #[test]
        fn test_util() {}
    }

    mod models {
        use super::super::models;

        #[test]
        fn test_model() {}
    }
}
```

### Test File Organization

```
tests/
├── common/
│   └── mod.rs      # Test utilities
├── integration/
│   └── test.rs     # Integration tests
└── api/
    └── test.rs     # API tests
```

## Test Best Practices

### 1. เขียน Tests ที่ครอบคลุม

```rust
#[test]
fn test_basic() {}
#[test]
fn test_edge_case() {}
#[test]
fn test_error_case() {}
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

### 4. ใช้ Test Helpers

```rust
#[cfg(test)]
mod helpers {
    pub fn setup() -> TestData {
        // setup code
    }

    pub fn teardown(data: TestData) {
        // teardown code
    }
}
```

## Test Configuration

### Test Profile

```toml
[profile.test]
opt-level = 0
debug = true
```

### Test Dependencies

```toml
[dev-dependencies]
criterion = "0.5"
proptest = "1.0"
mockall = "0.11"
```

## Running Tests

### Run All Tests

```bash
cargo test
```

### Run Specific Test

```bash
cargo test test_name
```

### Run Tests in File

```bash
cargo test --test integration_test
```

### Run Tests with Output

```bash
cargo test -- --nocapture
```

### Run Tests with Single Thread

```bash
cargo test -- --test-threads=1
```

## Test Coverage

### Tarpaulin

```bash
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

### Coverage Configuration

```toml
[coverage]
```

## Test Patterns

### Property-Based Testing

```toml
[dev-dependencies]
proptest = "1.0"
```

```rust
proptest! {
    #[test]
    fn test_add(a in any::<i32>(), b in any::<i32>()) {
        assert_eq!(add(a, b), a + b);
    }
}
```

### Benchmarking

```toml
[dev-dependencies]
criterion = "0.5"
```

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("add", |b| {
        b.iter(|| add(black_box(2), black_box(3)))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

## Test Best Practices

### 1. Run Tests ก่อน Commit

```bash
cargo test
cargo clippy
cargo fmt -- --check
```

### 2. ใช้ CI/CD สำหรับ Automated Tests

```yaml
- run: cargo test
```

### 3. ตั้งค่า Test Timeouts

```bash
cargo test -- --test-threads=1
```

### 4. ใช้ Mocking สำหรับ External Dependencies

```toml
[dev-dependencies]
mockall = "0.11"
```

### 5. Document Test Cases

```rust
/// Test case for user creation
#[test]
fn test_create_user() {
    // Given
    let name = "Alice";

    // When
    let user = User::new(name);

    // Then
    assert_eq!(user.name(), name);
}
```
