# Setup Project

## สร้างและตั้งค่า Project ใหม่

## สร้าง Binary Project

```bash
cargo new my-app
cd my-app
```

## สร้าง Library Project

```bash
cargo new my-lib --lib
cd my-lib
```

## ตั้งค่า Cargo.toml

### Basic Configuration

```toml
[package]
name = "my-crate"
version = "0.1.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"
description = "Description"
repository = "https://github.com/user/repo"
readme = "README.md"

[dependencies]
# dependencies here
```

### Workspace Configuration

```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2021"

[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
```

## ตั้งค่า .cargo/config.toml

### Build Configuration

```toml
[build]
jobs = 4
target-dir = "target"
```

### Aliases

```toml
[alias]
b = "build"
t = "test"
r = "run"
c = "check"
l = "clippy"
fmt-check = "fmt -- --check"
```

### Registry Configuration

```toml
[source.crates-io]
replace-with = "sparse+https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
```

## ตั้งค่า .gitignore

```
/target/
**/*.rs.bk
Cargo.lock
```

## ตั้งค่า Pre-commit Hooks

### ใช้ Husky

```bash
cargo install cargo-husky
cargo husky install
```

```bash
# .husky/pre-commit
cargo fmt
cargo clippy
cargo test
```

### ใช้ Lefthook

```yaml
# lefthook.yml
pre-commit:
  commands:
    fmt:
      run: cargo fmt
      glob: "*.rs"
    clippy:
      run: cargo clippy
      glob: "*.rs"
    test:
      run: cargo test
```

## ตั้งค่า CI/CD

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
          components: rustfmt, clippy
      - run: cargo test
      - run: cargo clippy -- -D warnings
      - run: cargo fmt -- --check
```

## ตั้งค่า IDE

### VS Code

ติดตั้ง extensions:
- rust-analyzer
- CodeLLDB
- Even Better TOML

`.vscode/settings.json`:

```json
{
  "rust-analyzer.cargo.loadOutDirsFromCheck": true,
  "rust-analyzer.checkOnSave.command": "clippy"
}
```

## ตั้งค่า Toolchain

### Install Stable

```bash
rustup install stable
rustup default stable
```

### Install Components

```bash
rustup component add rustfmt
rustup component add clippy
rustup component add rust-analyzer
```

### Install Targets

```bash
rustup target add x86_64-unknown-linux-musl
rustup target add wasm32-unknown-unknown
```

## ตั้งค่า Profiles

### Release Profile

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
strip = true
panic = "abort"
```

### Dev Profile

```toml
[profile.dev]
opt-level = 0
debug = true
incremental = true
```

## ตั้งค่า Features

```toml
[features]
default = ["std"]
std = []
serde = ["dep:serde"]

[dependencies]
serde = { version = "1.0", optional = true }
```

## ตั้งค่า Linting

```toml
[lints.rust]
warnings = "warn"

[lints.clippy]
all = "warn"
pedantic = "warn"
```

## ตั้งค่า Environment Variables

```bash
export CARGO_BUILD_JOBS=4
export RUSTFLAGS="-C target-cpu=native"
export CARGO_TARGET_DIR=/path/to/target
```

## ตั้งค่า Documentation

### README.md

```markdown
# My Crate

Description

## Installation

```toml
[dependencies]
my-crate = "0.1.0"
```

## Usage

```rust
use my_crate;

fn main() {
    // code
}
```

## License

MIT OR Apache-2.0
```

## ตั้งค่า Testing

### Test Dependencies

```toml
[dev-dependencies]
criterion = "0.5"
proptest = "1.0"
mockall = "0.11"
```

## ตั้งค่า Benchmarking

```toml
[dev-dependencies]
criterion = "0.5"
```

```rust
use criterion::{black_box, criterion_group, criterion_main, Criterion};

fn criterion_benchmark(c: &mut Criterion) {
    c.bench_function("bench", |b| {
        b.iter(|| function(black_box(42)))
    });
}

criterion_group!(benches, criterion_benchmark);
criterion_main!(benches);
```

## ตั้งค่า Publishing

### Prepare for Publishing

```bash
cargo publish --dry-run
```

### API Token

```bash
cargo login
```

## Next Steps

- อ่าน [build-project.md](./build-project.md) สำหรับการ build
- อ่าน [add-dependency.md](./add-dependency.md) สำหรับการเพิ่ม dependencies
