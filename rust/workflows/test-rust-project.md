---
title: Test Rust Project
description: เขียนและรัน tests สำหรับ Rust project
---

## Goal

เขียน tests ที่ครอบคลุมและ maintainable

## Execute

### 1. Unit Tests

เขียน unit tests ในไฟล์เดียวกับ code

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_addition() {
        assert_eq!(add(2, 2), 4);
    }
}
```

### 2. Integration Tests

สร้าง integration tests ใน `tests/` directory

```rust
// tests/integration_test.rs
use project_name;

#[test]
fn test_integration() {
    let result = project_name::process();
    assert!(result.is_ok());
}
```

### 3. Run Tests

รัน tests ทั้งหมด

```bash
cargo test
```

รัน specific test

```bash
cargo test test_name
```

รัน tests ใน specific file

```bash
cargo test --lib file_name
```

### 4. Test Output

แสดง output จาก tests

```bash
cargo test -- --nocapture
```

### 5. Benchmark Tests

ใช้ criterion สำหรับ benchmarking

```toml
[dev-dependencies]
criterion = "0.5"
```

```rust
// benches/benchmark.rs
use criterion::{criterion_group, criterion_main, Criterion};

fn bench_function(c: &mut Criterion) {
    c.bench_function("function", |b| b.iter(|| function()));
}

criterion_group!(benches, bench_function);
criterion_main!(benches);
```

รัน benchmarks

```bash
cargo bench
```

## Expected Outcome

- Tests ที่ครอบคลุม code ทั้งหมด
- Integration tests ที่ test การทำงานร่วมกัน
- Benchmarks สำหรับ performance testing
- Tests ที่รันเร็วและ maintainable
