# Features

## Features ทั้งหมดของ Cargo

## Project Management

### cargo new

สร้าง project ใหม่:

```bash
cargo new my-project
cargo new my-project --lib
cargo new my-project --bin
cargo new my-project --name custom-name
```

### cargo init

Initialize project ใน directory ที่มีอยู่:

```bash
cargo init
cargo init --lib
```

## Building

### cargo build

Build project:

```bash
cargo build
cargo build --release
cargo build --target x86_64-unknown-linux-gnu
cargo build -p package-name
cargo build --features feature1,feature2
cargo build --all-targets
cargo build --workspace
```

### cargo check

Type check อย่างรวดเร็ว:

```bash
cargo check
cargo check --all-targets
cargo check -p package-name
cargo check --release
```

## Running

### cargo run

Build และ run:

```bash
cargo run
cargo run --release
cargo run --bin binary-name
cargo run --example example-name
cargo run --features feature1
cargo run -- --arg1 --arg2
```

## Testing

### cargo test

Run tests:

```bash
cargo test
cargo test --lib
cargo test --bin binary-name
cargo test test_name
cargo test -- --nocapture
cargo test -- --test-threads=1
cargo test --release
cargo test --doc
```

### cargo test --workspace

Run tests ทั้ง workspace:

```bash
cargo test --workspace
```

## Documentation

### cargo doc

Generate documentation:

```bash
cargo doc
cargo doc --open
cargo doc --no-deps
cargo doc -p package-name
cargo doc --all-features
```

## Dependency Management

### cargo add

เพิ่ม dependency:

```bash
cargo add serde
cargo add serde --features derive
cargo add serde@1.0.0
cargo add serde --dev
cargo add serde --build
cargo add serde --rename new-name
```

### cargo remove

ลบ dependency:

```bash
cargo remove serde
cargo remove serde --dev
```

### cargo update

Update dependencies:

```bash
cargo update
cargo update -p package-name
cargo update -p package-name --precise 1.0.0
```

### cargo tree

แสดง dependency tree:

```bash
cargo tree
cargo tree --depth 1
cargo tree --invert package-name
cargo tree --no-dedupe
cargo tree -p package-name
```

## Publishing

### cargo publish

Publish ไป crates.io:

```bash
cargo publish
cargo publish --dry-run
cargo publish --registry custom-registry
cargo publish --token token
```

### cargo login

Login ไป registry:

```bash
cargo login
cargo login --registry custom-registry
```

### cargo owner

Manage crate owners:

```bash
cargo owner --add username
cargo owner --remove username
cargo owner --list
```

## Installation

### cargo install

Install binary crate:

```bash
cargo install ripgrep
cargo install --force ripgrep
cargo install --version 1.0.0 ripgrep
cargo install --path ./local-crate
cargo install --git https://github.com/user/repo
```

### cargo uninstall

Uninstall binary:

```bash
cargo uninstall ripgrep
```

## Code Quality

### cargo clippy

Lint code:

```bash
cargo clippy
cargo clippy --fix
cargo clippy -- -W clippy::all
cargo clippy -- -D warnings
```

### cargo fmt

Format code:

```bash
cargo fmt
cargo fmt --check
cargo fmt -- --emit=stdout
```

## Benchmarking

### cargo bench

Run benchmarks:

```bash
cargo bench
cargo bench --bench benchmark-name
cargo bench -- --save-baseline baseline
cargo bench -- --baseline baseline
```

## Cleaning

### cargo clean

Clean build artifacts:

```bash
cargo clean
cargo clean -p package-name
cargo clean --release
```

## Metadata

### cargo metadata

Output project metadata (JSON):

```bash
cargo metadata
cargo metadata --format-version 1
cargo metadata --no-deps
```

### cargo info

Show package info:

```bash
cargo info serde
cargo info serde@1.0.0
```

## Search

### cargo search

Search crates.io:

```bash
cargo search serde
cargo search serde --limit 10
```

## Vendor

### cargo vendor

Vendor dependencies:

```bash
cargo vendor
cargo vendor --sync Cargo.lock
```

## Package

### cargo package

Package for publishing:

```bash
cargo package
cargo package --allow-dirty
cargo package --list
```

## Verify

### cargo verify-project

Verify project structure:

```bash
cargo verify-project
```

## Generate Lockfile

### cargo generate-lockfile

Generate Cargo.lock:

```bash
cargo generate-lockfile
```

## Fetch

### cargo fetch

Fetch dependencies:

```bash
cargo fetch
```

## Version

### cargo version

Show cargo version:

```bash
cargo version
```

## Configuration

### Aliases

สร้าง command aliases:

```toml
[alias]
b = "build"
t = "test"
r = "run"
c = "check"
```

## Environment Variables

```bash
CARGO_HOME=/path/to/cargo
CARGO_TARGET_DIR=/path/to/target
RUSTFLAGS="-C target-cpu=native"
```

## Next Steps

- อ่าน [patterns.md](./patterns.md) สำหรับ patterns ทั่วไป
- อ่าน [best-practices.md](./best-practices.md) สำหรับ best practices
