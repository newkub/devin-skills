# Rust Crate Reference

## Official Sources

- Cargo Book: https://doc.rust-lang.org/cargo/
- Rustdoc: https://doc.rust-lang.org/rustdoc/what-is-rustdoc.html
- crates.io publishing: https://doc.rust-lang.org/cargo/reference/publishing.html
- The Rust Reference: https://doc.rust-lang.org/reference/

## Cargo.toml Template

```toml
[package]
name = "my-crate"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"
description = "A concise description"
license = "MIT OR Apache-2.0"
repository = "https://github.com/user/my-crate"
keywords = ["my", "crate"]
categories = ["command-line-utilities"]

[dependencies]
thiserror = "2.0"
serde = { version = "1.0", features = ["derive"] }

[dev-dependencies]
anyhow = "1.0"

[lib]
name = "my_crate"
crate-type = ["lib"]

[profile.dev]
debug = "line-tables-only"

[profile.release]
lto = true
opt-level = "z"
strip = true
codegen-units = 1
panic = "abort"
```

## lib.rs Example

```rust
//! My crate does something useful.
//!
//! # Examples
//!
//! ```
//! use my_crate::greet;
//!
//! assert_eq!(greet("world"), "Hello, world!");
//! ```

pub mod utils;

pub use utils::greet;

/// Greet someone.
pub fn greet(name: &str) -> String {
    format!("Hello, {name}!")
}
```

## Module File Organization

- edition 2024 ใช้ `src/{module}.rs` โดยไม่ต้องมี `mod.rs`
- ถ้ายังใช้ `mod.rs` ได้ แต่ `src/{module}.rs` แนะนำ

## Testing

```bash
cargo test
cargo test --doc
cargo test --all-features
```

## Clippy And Format

```bash
cargo clippy -- -D warnings
cargo fmt --check
```

## Documentation

```bash
cargo doc --no-deps
cargo doc --open
```

## Publishing

1. ตรวจสอบ `Cargo.toml` fields ครบ
2. สร้าง git tag `v0.1.0`
3. รัน `cargo publish --dry-run`
4. รัน `cargo publish`

## justfile

```makefile
dev:
    cargo watch -x check

build:
    cargo build --release

lint:
    cargo clippy -- -D warnings && cargo fmt --check

test:
    cargo nextest run && cargo test --doc

doc:
    cargo doc --no-deps

publish:
    cargo publish
```

## CI Template

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - run: cargo test --all-features
      - run: cargo clippy -- -D warnings
      - run: cargo fmt --check
      - run: cargo doc --no-deps
```

## Best Practices

- Keep public API small
- Use `#[derive(Debug)]` for public types
- Prefer `&str` over `String` for inputs
- Use `thiserror` for error types
- Document panics, errors, and examples
