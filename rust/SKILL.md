---
name: rust
description: "แนวทางการพัฒนา Rust ตาม best practices สำหรับ systems programming (Rust 1.85.0+, Edition 2024)"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

พัฒนา Rust ตาม best practices สำหรับ systems programming ที่เน้น memory safety, performance และ concurrency โดยไม่ต้องมี garbage collector โดยใช้ Rust 1.85.0+ และ Edition 2024


## Scope

ใช้สำหรับการพัฒนา Rust ทุกประเภท เช่น systems programming, WebAssembly, CLI tools, network services, async applications, และ embedded systems


## Execute

### 1. Install Rust Toolchain

ติดตั้ง Rust toolchain ด้วย rustup

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup update stable
```

ตรวจสอบ version ด้วย `rustc --version` (ควรเป็น 1.85.0 ขึ้นไป)

### 2. Create Project

สร้าง project ใหม่ด้วย cargo

```bash
cargo new project-name --edition 2024
cd project-name
```

ตั้งค่า `edition = "2024"` ใน Cargo.toml สำหรับใช้ features ล่าสุด

### 3. Learn Fundamentals

เรียนรู้พื้นฐาน Rust จาก `guide/` directory

- อ่าน `guide/getting-started/` สำหรับภาพรวมและการติดตั้ง
- อ่าน `guide/core-language/` สำหรับ language features
- อ่าน `key-concepts/` สำหรับ ownership, borrowing, lifetimes
- อ่าน `principles/` สำหรับ design principles

### 4. Write Code

เขียน code ตาม best practices

- ทำตาม `guide/best-practices/` สำหรับ code organization และ performance
- ทำตาม `guide/error-handling/` สำหรับ error handling
- ใช้ `Result<T, E>` สำหรับ recoverable errors
- ใช้ `Option<T>` สำหรับ optional values
- ใช้ `?` operator สำหรับ error propagation

### 5. Async Programming

เขียน async code ตาม production patterns

- ใช้ bounded channels (`mpsc::channel(N)`) สำหรับ backpressure
- ใช้ `JoinSet` สำหรับ structured concurrency
- ใช้ `tokio::spawn` ภายใน `JoinSet` เพื่อหลีกเลี่ยง orphan tasks
- ทำให้ `select!` arms เป็น cancellation-safe
- ใช้ `spawn_blocking` สำหรับ blocking operations
- ใช้ `tokio::sync::Mutex` ถ้า lock ข้าม `.await`
- เพิ่ม `#[tracing::instrument]` สำหรับ debugging

### 6. Test And Build

ทดสอบและ build project

```bash
cargo test
cargo test --release
cargo clippy
cargo check
cargo fmt
```

ใช้ `scripts/check.sh` และ `scripts/test.sh` สำหรับ automation

### 7. Use Workflows

ใช้ workflows สำหรับ development lifecycle

- อ่าน `workflows/setup-rust-project.md` สำหรับ setup project
- อ่าน `workflows/build-rust-project.md` สำหรับ build project
- อ่าน `workflows/test-rust-project.md` สำหรับ test project


## Rules

### Naming And Style

- ใช้ `let` สำหรับ immutable variables, `let mut` เฉพาะเมื่อจำเป็น
- ใช้ snake_case สำหรับ variables/functions, PascalCase สำหรับ types, SCREAMING_SNAKE_CASE สำหรับ constants
- ใช้ `#[expect]` แทน `#[allow]` เมื่อต้องการ lint warnings
- ใช้ rustfmt ด้วย style edition 2024 สำหรับ formatting ที่ทันสมัย

### Ownership And Memory

- ใช้ ownership rules อย่างเคร่งครัด, ใช้ borrowing สำหรับ temporary access
- ใช้ lifetimes annotations เมื่อจำเป็น, หลีกเลี่ยง cloning เมื่อเป็นไปได้
- ใช้ references แทน ownership transfer
- ใช้ `impl Trait + use<>` สำหรับ precise lifetime capturing (Rust 2024)
- หลีกเลี่ยง `ref` และ `&` ภายใน implicitly-borrowing patterns (Rust 2024)
- ใช้ `match` แทน `if let` เมื่อต้องการ preserve drop order (Rust 2024)
- ใช้ `&raw const` และ `&raw mut` สำหรับ explicit raw pointers (Rust 1.82+)

### Error Handling

- ใช้ `Result<T, E>` สำหรับ recoverable errors, `Option<T>` สำหรับ optional values
- ใช้ `?` operator สำหรับ error propagation, ใช้ `unwrap()` เฉพาะใน tests
- ใช้ custom error types สำหรับ specific errors
- ใช้ `core::error` module สำหรับ error handling ที่ดีขึ้น (Rust 1.81+)
- ใช้ `Result::inspect` และ `Option::inspect` สำหรับ debugging (Rust 1.76+)
- ใช้ `Option::is_none_or` สำหรับ concise optional checks (Rust 1.82+)

### Concurrency

- ใช้ threads สำหรับ parallel execution, channels สำหรับ message passing
- ใช้ mutex สำหรับ shared state, atomic types สำหรับ lock-free programming
- หลีกเลี่ยง data races
- ใช้ bounded channels (`mpsc::channel(N)`) สำหรับ backpressure
- ใช้ `JoinSet` สำหรับ structured concurrency
- ใช้ `tokio::spawn` ภายใน `JoinSet` เพื่อหลีกเลี่ยง orphan tasks
- ใช้ `spawn_blocking` สำหรับ blocking operations
- ใช้ `tokio::sync::Mutex` ถ้า lock ข้าม `.await`

### Async Patterns

- ทำให้ `select!` arms เป็น cancellation-safe
- เพิ่ม `#[tracing::instrument]` สำหรับ debugging async code
- ใช้ `async fn` และ `impl Trait` ใน traits สำหรับ async programming
- ใช้ async closures `async || {}` สำหรับ borrowing from closure captures (Rust 1.85+)
- ใช้ `AsyncFn`, `AsyncFnMut`, `AsyncFnOnce` traits สำหรับ async closures (Rust 1.85+)
- ใช้ `Future` และ `IntoFuture` จาก prelude (Rust 2024)
- ใช้ `std::task::Waker::noop` สำหรับ no-op wakers (Rust 1.85+)

### Standard Library Features

- ใช้ `let_chains` สำหรับ conditional logic ที่กระชับ (Rust 1.88+)
- ใช้ `HashMap::extract_if` สำหรับ conditional removal (Rust 1.88+)
- ใช้ `Arc::unwrap_or_clone` สำหรับ efficient cloning (Rust 1.76+)
- ใช้ `Cell::update`, `HashSet::extract_if` (Rust 1.88+)
- ใช้ `core::error` module สำหรับ error handling ที่ดีขึ้น (Rust 1.81+)
- ใช้ `LazyCell` สำหรับ lazy initialization (Rust 1.80+)
- ใช้ `impl IntoIterator for Box<[T]>` (Rust 1.80+)
- ใช้ `&raw const` และ `&raw mut` operators (Rust 1.82+)
- ใช้ floating-point arithmetic ใน `const fn` (Rust 1.82+)
- ใช้ `#[target_feature]` บน safe functions (Rust 1.86+)

### Unsafe Code

- ใช้ `unsafe extern` blocks สำหรับ FFI (Rust 2024)
- ใช้ `unsafe` keyword สำหรับ `export_section` และ `no_mangle` attributes (Rust 2024)
- ใช้ `std::env::set_var`, `std::env::remove_var` ด้วย `unsafe` (Rust 2024)
- ตรวจสอบ `unsafe_op_in_unsafe_fn` lint warnings (Rust 2024)

### Cargo Configuration

- ตั้งค่า `rust-version` ใน Cargo.toml สำหรับ dependency resolution ที่ดีขึ้น (Rust 2024)
- ใช้ `config include` key สำหรับ sharing configurations (Rust 1.80+)
- ตรวจสอบ `default-features = false` กับ workspace dependencies (Rust 2024)


## Expected Outcome

- Rust code ที่เป็นมาตรฐานและ maintainable
- Memory safety ที่รับประกันโดย compiler
- High performance ด้วย zero-cost abstractions
- Fearless concurrency
- Error handling ที่เหมาะสม
- Code ที่ผ่านการทดสอบและ debug แล้ว
- Understanding ที่ลึกซึ้งเกี่ยวกับ ownership, borrowing, และ lifetimes
