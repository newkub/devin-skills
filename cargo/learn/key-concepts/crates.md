# Crates

## แนวคิดเกี่ยวกับ Crates

Crate คือ unit พื้นฐานของ compilation ใน Rust

## ประเภทของ Crates

### Binary Crate

สร้าง executable หรือ binary file

```bash
cargo new my-app --bin
```

โครงสร้าง:
```
my-app/
├── Cargo.toml
└── src/
    └── main.rs
```

ต้องมี:
- `fn main()` function
- สร้าง executable ที่ run ได้

### Library Crate

สร้าง library ที่ใช้ reuse ได้

```bash
cargo new my-lib --lib
```

โครงสร้าง:
```
my-lib/
├── Cargo.toml
└── src/
    └── lib.rs
```

มี:
- Public functions, types, modules
- ใช้เป็น dependency ของ crates อื่น

## Crate Root

ไฟล์ entry point ของ crate:

- Binary: `src/main.rs`
- Library: `src/lib.rs`

## Module System

แต่ละ crate มี module hierarchy:

```rust
// src/lib.rs
pub mod utils;
pub mod models;

// src/utils.rs
pub fn helper() {}

// src/models.rs
pub struct User {}
```

## Crate Visibility

### Public Crate

```rust
// ใช้ได้จาก crates อื่น
pub fn public_function() {}
```

### Private Crate

```rust
// ใช้ได้เฉพาะภายใน crate
fn private_function() {}
```

## Crate Types

### Library Crate Types

```toml
[lib]
name = "my_lib"
path = "src/lib.rs"
crate-type = ["lib", "cdylib", "staticlib"]
```

| Type | Description |
|------|-------------|
| `lib` | Rust library (.rlib) |
| `cdylib` | C-compatible library (.so/.dll/.dylib) |
| `staticlib` | Static library (.a) |

## Crate Metadata

```toml
[package]
name = "my_crate"
version = "0.1.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"
description = "Description"
repository = "https://github.com/user/repo"
```

## Crate Dependencies

```toml
[dependencies]
other_crate = "1.0"
```

```rust
use other_crate::SomeType;
```

## Crate Publishing

```bash
cargo publish
```

ต้องมี:
- Unique name บน crates.io
- Valid version
- Documentation
- License

## Crate Features

```toml
[features]
default = ["std"]
std = []
no_std = []
```

```bash
cargo build --features std
```

## การใช้ Crates

### ใน Project เดียวกัน

```rust
mod utils;  // Local module
```

### จาก External Crate

```toml
[dependencies]
serde = "1.0"
```

```rust
use serde::{Serialize, Deserialize};
```

### จาก Workspace

```toml
[workspace]
members = ["core", "utils"]
```

```toml
# core/Cargo.toml
[dependencies]
utils = { path = "../utils" }
```

## Best Practices

### ตั้งชื่อ Crate

- ใช้ snake_case
- สั้นและชัดเจน
- ไม่ซ้ำกับ crates ที่มีอยู่

### Crate Responsibility

- แต่ละ crate ควรมี single responsibility
- แยก logic ออกเป็น libraries
- ใช้ workspace สำหรับ projects ขนาดใหญ่

### Versioning

- ใช้ semantic versioning
- อัปเดต version อย่างระมัดระวัง
- ทำ breaking changes ใน major versions
