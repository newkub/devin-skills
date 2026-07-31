# Best Practices

## Best Practices สำหรับการใช้ Cargo

## Project Structure

### ใช้ Workspace สำหรับ Projects ขนาดใหญ่

```toml
[workspace]
members = ["crates/*"]
resolver = "2"
```

ประโยชน์:
- Share dependencies
- Unified versioning
- Faster builds

### แยก Logic ออกเป็น Libraries

```
workspace/
├── crates/
│   ├── core/      # Core logic
│   ├── api/       # API layer
│   └── cli/       # CLI interface
```

### ใช้ `src/lib.rs` สำหรับ Reusable Code

```rust
// src/lib.rs
pub mod utils;
pub mod models;

pub fn core_function() -> i32 {
    42
}
```

## Dependency Management

### ใช้ Workspace Dependencies

```toml
[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
```

```toml
[dependencies]
serde = { workspace = true }
```

### ระบุ Version อย่างชัดเจน

```toml
[dependencies]
# ดี
serde = "1.0.150"

# หลีกเลี่ยง
serde = "1"
```

### ใช้ Features อย่างมีเหตุผล

```toml
[features]
default = ["std"]
std = []
no_std = []
```

### ลบ Dependencies ที่ไม่ใช้

```bash
cargo install cargo-udeps
cargo +nightly udeps
```

## Versioning

### ใช้ Semantic Versioning

```toml
[package]
version = "0.1.0"
```

- `0.0.x` - Initial development
- `0.x.0` - Pre-release
- `x.0.0` - Stable release

### ใช้ Cargo Release

```bash
cargo install cargo-release
cargo release minor
cargo release patch
```

## Testing

### เขียน Tests ที่ครอบคลุม

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_basic() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_edge_case() {
        assert_eq!(add(0, 0), 0);
    }
}
```

### ใช้ Integration Tests

```
tests/
├── integration_test.rs
└── api_test.rs
```

### Run Tests ก่อน Commit

```bash
cargo test
cargo clippy
cargo fmt -- --check
```

## Documentation

### Document Public APIs

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

### Generate Documentation

```bash
cargo doc --no-deps
cargo doc --open
```

## Code Quality

### ใช้ Clippy

```bash
cargo clippy
cargo clippy --fix
```

### ใช้ rustfmt

```bash
cargo fmt
cargo fmt --check
```

### ตั้งค่า Lint Levels

```toml
[lints]
workspace = true

[lints.clippy]
all = "warn"
pedantic = "warn"
```

## Performance

### ใช้ Release Profile สำหรับ Production

```bash
cargo build --release
```

### ตั้งค่า Profile ที่เหมาะสม

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
strip = true
```

### ใช้ Incremental Compilation

```toml
[profile.dev]
incremental = true
```

## Security

### ตรวจสอบ Dependencies

```bash
cargo install cargo-audit
cargo audit
```

### ใช้ Trusted Sources

```toml
[dependencies]
# ดี
serde = "1.0"

# ระมัดระวังกับ git dependencies
my-crate = { git = "https://github.com/trusted/repo" }
```

### ระบุ License

```toml
[package]
license = "MIT OR Apache-2.0"
```

## CI/CD

### ใช้ Pre-commit Hooks

```bash
cargo install cargo-husky
cargo husky install
```

### GitHub Actions Workflow

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
          components: rustfmt, clippy
      - run: cargo test
      - run: cargo clippy -- -D warnings
      - run: cargo fmt -- --check
```

## Publishing

### ทดสอบก่อน Publish

```bash
cargo publish --dry-run
```

### ตรวจสอบ Package

```bash
cargo package
cargo package --list
```

### ใช้ Changelog

```bash
cargo install cargo-changelog
cargo changelog
```

## Configuration

### ใช้ Config ที่เหมาะสม

```toml
# .cargo/config.toml
[build]
jobs = 4

[alias]
b = "build"
t = "test"
r = "run"
c = "check"
```

### ใช้ Environment Variables

```bash
export CARGO_BUILD_JOBS=4
export RUSTFLAGS="-C target-cpu=native"
```

## Troubleshooting

### Clean Build

```bash
cargo clean
cargo build
```

### Update Dependencies

```bash
cargo update
```

### Check Dependency Tree

```bash
cargo tree
cargo tree --duplicates
```

## Next Steps

- อ่าน [integration.md](./integration.md) สำหรับ tool integration
- อ่าน [architecture.md](./architecture.md) สำหรับ system architecture
