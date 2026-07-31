---
title: Performance Testing
description: Performance testing และ benchmarking
---

## Benchmarking Rust Code

```rust
#[cfg(test)]
mod benches {
    use super::*;
    use criterion::{black_box, criterion_group, criterion_main, Criterion};

    fn bench_function(c: &mut Criterion) {
        c.bench_function("my_function", |b| {
            b.iter(|| my_function(black_box(100)))
        });
    }

    criterion_group!(benches, bench_function);
    criterion_main!(benches);
}
```

Run with:
```bash
cargo bench
```
