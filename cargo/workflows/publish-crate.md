# Publish Crate

## Publish Crate ไป crates.io

## ตรวจสอบ Package

```bash
cargo package
cargo package --list
```

## Dry Run

```bash
cargo publish --dry-run
```

## Publish

```bash
cargo publish
```

## Login

```bash
cargo login
```

## Publish with Registry

```bash
cargo publish --registry custom-registry
```

## Publish with Token

```bash
cargo publish --token token
```

## ตรวจสอบ Package Name

ตรวจสอบว่าชื่อไม่ซ้ำ:

```bash
cargo search my-crate
```

## ตั้งค่า Package Metadata

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
keywords = ["keyword1", "keyword2"]
categories = ["category"]
```

## ตั้งค่า License

ใช้ SPDX identifiers:

```toml
[package]
license = "MIT"
license = "MIT OR Apache-2.0"
```

## ตั้งค่า Categories

ดู categories ที่ crates.io:

```toml
[package]
categories = ["development-tools", "web-programming"]
```

## Exclude Files

```toml
[package]
exclude = ["tests/*", "examples/*"]
```

## Publishing Best Practices

### 1. ใช้ Semantic Versioning

```toml
version = "0.1.0"
```

### 2. Document Public APIs

```rust
/// Function documentation
pub fn function() {}
```

### 3. Run Tests ก่อน Publish

```bash
cargo test
cargo clippy
```

### 4. Generate Documentation

```bash
cargo doc --no-deps
```

### 5. ใช้ cargo-release

```bash
cargo install cargo-release
cargo release patch
```

## Publishing Workflow

```bash
# 1. Update version
# 2. Update CHANGELOG
# 3. Run tests
cargo test
# 4. Dry run
cargo publish --dry-run
# 5. Publish
cargo publish
# 6. Tag release
git tag v0.1.0
git push origin v0.1.0
```

## Next Steps

- อ่าน [setup-project.md](./setup-project.md) สำหรับการ setup
