# Patterns

## Patterns ทั่วไปในการใช้ Cargo

## Project Structure Patterns

### Single Binary Project

```
my-app/
├── Cargo.toml
├── src/
│   └── main.rs
└── tests/
    └── integration_test.rs
```

### Binary + Library Project

```
my-app/
├── Cargo.toml
├── src/
│   ├── main.rs
│   └── lib.rs
└── tests/
    └── integration_test.rs
```

### Workspace Pattern

```
workspace/
├── Cargo.toml (workspace)
├── crates/
│   ├── core/
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── cli/
│   │   ├── Cargo.toml
│   │   └── src/
│   └── utils/
│       ├── Cargo.toml
│       └── src/
└── Cargo.lock
```

## Dependency Patterns

### Optional Dependencies

```toml
[dependencies]
serde = { version = "1.0", optional = true }

[features]
default = []
serde = ["dep:serde"]
```

```rust
#[cfg(feature = "serde")]
use serde::{Deserialize, Serialize};
```

### Dev Dependencies

```toml
[dev-dependencies]
criterion = "0.5"
proptest = "1.0"
```

### Build Dependencies

```toml
[build-dependencies]
cc = "1.0"
```

### Git Dependencies with Branch

```toml
[dependencies]
my-crate = { git = "https://github.com/user/repo", branch = "main" }
```

### Path Dependencies

```toml
[dependencies]
local-crate = { path = "../local-crate" }
```

## Feature Patterns

### Default Features

```toml
[features]
default = ["std", "serde"]
std = []
serde = ["dep:serde"]
```

### Feature Unification

```toml
[features]
default = ["full"]
full = ["std", "async", "serde"]
std = []
async = ["dep:tokio"]
serde = ["dep:serde"]
```

### Conditional Compilation

```rust
#[cfg(feature = "std")]
fn use_std() {
    // std code
}

#[cfg(not(feature = "std"))]
fn no_std() {
    // no_std code
}
```

## Profile Patterns

### Optimized Release

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

### Fast Development

```toml
[profile.dev]
opt-level = 0
debug = true
incremental = true
```

### Custom Profile

```toml
[profile.profiling]
inherits = "release"
debug = true
strip = false
```

## Workspace Patterns

### Shared Dependencies

```toml
[workspace]
members = ["crates/*"]

[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
thiserror = "1.0"
```

ใช้ในแต่ละ crate:

```toml
[dependencies]
serde = { workspace = true }
```

### Workspace Members

```toml
[workspace]
members = [
    "crates/core",
    "crates/cli",
    "crates/utils",
]
exclude = ["examples/*"]
```

## Build Script Patterns

### Conditional Compilation

```rust
fn main() {
    #[cfg(target_os = "windows")]
    {
        println!("cargo:rustc-link-lib=kernel32");
    }
}
```

### Code Generation

```rust
fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rustc-env=MY_VAR=value");
}
```

### Out-of-Dir Build

```rust
fn main() {
    let out_dir = std::env::var("OUT_DIR").unwrap();
    // Generate code to out_dir
}
```

## Testing Patterns

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

### Documentation Tests

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

## Documentation Patterns

### Module Documentation

```rust
//! # My Crate
//!
//! This crate provides...
```

### Function Documentation

```rust
/// Adds two numbers together.
///
/// # Arguments
///
/// * `a` - First number
/// * `b` - Second number
///
/// # Returns
///
/// Sum of `a` and `b`
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

## Publishing Patterns

### Versioning

```toml
[package]
name = "my-crate"
version = "0.1.0"
```

### Metadata

```toml
[package]
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"
repository = "https://github.com/user/repo"
documentation = "https://docs.rs/my-crate"
keywords = ["keyword1", "keyword2"]
categories = ["category"]
```

### Exclude Files

```toml
[package]
exclude = ["tests/*", "examples/*"]
```

## CI/CD Patterns

### GitHub Actions

```yaml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - run: cargo test
      - run: cargo clippy
      - run: cargo fmt -- --check
```

## Next Steps

- อ่าน [best-practices.md](./best-practices.md) สำหรับ best practices
- อ่าน [integration.md](./integration.md) สำหรับ tool integration
