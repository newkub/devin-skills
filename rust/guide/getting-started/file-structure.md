---
title: Rust Project Structure
description: โครงสร้างโปรเจกต์ Rust มาตรฐาน
---

## Project Structure

โครงสร้างโปรเจกต์ Rust มาตรฐาน:

```
project-name/
├── Cargo.toml              # Project manifest
├── Cargo.lock              # Dependency versions
├── src/
│   ├── main.rs             # Binary entry point
│   ├── lib.rs              # Library entry point
│   └── ...                 # Other modules
├── tests/                  # Integration tests
├── benches/                # Benchmarks
├── examples/               # Example code
├── target/                 # Build output (generated)
└── .gitignore              # Git ignore rules
```

## Cargo.toml

```toml
[package]
name = "project-name"
version = "0.1.0"
edition = "2021"

[dependencies]
# Dependencies here

[dev-dependencies]
# Test dependencies here

[[bin]]
name = "binary-name"
path = "src/main.rs"

[lib]
name = "library-name"
path = "src/lib.rs"
```

## Workspace Structure

สำหรับ monorepo หรือ multi-package projects:

```
workspace/
├── Cargo.toml              # Workspace manifest
├── Cargo.lock              # Shared lock file
├── crates/
│   ├── crate-a/
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── crate-b/
│   │   ├── Cargo.toml
│   │   └── src/
│   └── ...
└── target/                 # Shared build output
```

## Module Organization

```
src/
├── main.rs                 # Entry point
├── lib.rs                  # Library root
├── mod.rs                  # Module declarations
├── types.rs                # Type definitions
├── utils.rs                # Utility functions
├── config.rs               # Configuration
├── error.rs                # Error types
└── api.rs                  # Public API
```

## Best Practices

- ใช้ `src/lib.rs` สำหรับ library code
- ใช้ `src/main.rs` สำหรับ binary entry point
- จัด modules ตาม functionality
- ใช้ `mod.rs` สำหรับ module exports
- แยก integration tests ไว้ใน `tests/`
- ใช้ `examples/` สำหรับ usage examples
