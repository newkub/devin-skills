---
title: Rust Performance
description: การเพิ่มประสิทธิภาพโค้ด Rust
---

## Performance Characteristics

### Zero-cost Abstractions

Rust ให้ high-level abstractions โดยไม่มี runtime cost:

```rust
// Iterators - compiled to efficient loops
let sum: i32 = (1..1000).filter(|x| x % 2 == 0).sum();

// Pattern matching - compiled to jump tables
match value {
    1 => do_one(),
    2 => do_two(),
    _ => do_default(),
}
```

### Memory Management

- **Stack Allocation** - default สำหรับ local variables
- **Heap Allocation** - explicit ด้วย `Box<T>`, `Vec<T>`, etc.
- **Copy-on-Write** - ใช้ `Cow<T>` สำหรับ smart cloning
- **Zero-copy** - slices และ references หลีกเลี่ยง copying

### Concurrency

- **No Data Races** - borrow checker ป้องกัน
- **Lock-free** - atomic types สำหรับ lock-free programming
- **Async/Await** - efficient async I/O
- **Channels** - message passing ที่ efficient

## Optimization Techniques

### Profile-Guided Optimization (PGO)

```bash
# Build with PGO
cargo build --release
cargo pgo

# Use pgo-optimized build
cargo build --release
```

### Link-Time Optimization (LTO)

```toml
[profile.release]
lto = true
codegen-units = 1
```

### Memory Layout

```rust
// Use structs with cache-friendly layout
#[repr(C)]
struct Data {
    a: u64,
    b: u64,
    c: u64,
}

// Use arrays instead of Vec when size known
let mut arr: [u8; 1024] = [0; 1024];
```

### Avoid Allocations

```rust
// Bad: allocates new String
let s = format!("{} {}", a, b);

// Good: uses existing capacity
let mut s = String::with_capacity(100);
write!(s, "{} {}", a, b);
```

## Benchmarking

ใช้ criterion สำหรับ benchmarking:

```toml
[dev-dependencies]
criterion = "0.5"
```

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        n => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("fib 20", |b| b.iter(|| fibonacci(black_box(20))));
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

## Performance Tools

- **cargo bench** - run benchmarks
- **cargo flamegraph** - flame graph profiling
- **valgrind** - memory profiling
- **perf** - Linux performance analysis
- **cargo pgo** - profile-guided optimization
