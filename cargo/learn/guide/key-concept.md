# Key Concepts

## แนวคิดหลักของ Cargo

## Crates

**Crate** คือ unit ของ compilation ใน Rust มี 2 ประเภท:

### Binary Crate

- สร้าง executable หรือ binary
- ต้องมี `fn main()`
- สร้างด้วย `cargo new --bin`

### Library Crate

- สร้าง library ที่ใช้ reuse ได้
- ไม่มี `fn main()`
- สร้างด้วย `cargo new --lib`

## Workspaces

**Workspace** คือ set ของ crates ที่ share dependencies และ configuration

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "crates/core",
    "crates/utils",
    "crates/cli",
]

[workspace.dependencies]
serde = "1.0"
thiserror = "1.0"
```

### ประโยชน์ของ Workspace

- Share dependencies ระหว่าง crates
- Build ทั้ง workspace พร้อมกัน
- Unified versioning
- Shared configuration

## Manifest (Cargo.toml)

**Manifest** คือไฟล์ configuration ของ Cargo

```toml
[package]
name = "my-crate"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1.0"

[dev-dependencies]
criterion = "0.5"
```

## Dependencies

### Version Requirements

```toml
[dependencies]
# Exact version
crate = "1.0.0"

# Caret (^) - Compatible updates
crate = "^1.0"  # 1.0.0 <= version < 2.0.0

# Tilde (~) - Patch updates only
crate = "~1.0"  # 1.0.0 <= version < 1.1.0

# Comparison
crate = ">1.0"
crate = ">=1.0"
crate = "<2.0"
```

### Dependency Sources

```toml
[dependencies]
# crates.io
serde = "1.0"

# Git
my-crate = { git = "https://github.com/user/repo", branch = "main" }

# Local path
local-crate = { path = "../local-crate" }

# Multiple sources
my-crate = { version = "1.0", path = "../local-crate" }
```

## Features

**Features** คือ optional functionality ที่ enable/disable ได้

```toml
[features]
default = ["feature-a"]
feature-a = []
feature-b = ["feature-a"]
feature-c = ["dep:serde"]

[dependencies]
serde = { version = "1.0", optional = true }
```

### ใช้ Features

```bash
cargo build --features feature-a,feature-b
```

## Profiles

**Profiles** คือ configuration สำหรับ build modes ต่างๆ

```toml
[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
strip = true
```

### Built-in Profiles

| Profile | Use Case |
|---------|----------|
| `dev` | Development (default) |
| `release` | Production builds |
| `test` | Testing |
| `bench` | Benchmarking |

## Targets

**Targets** คือ output artifacts ที่ build ได้

### Binary Targets

```toml
[[bin]]
name = "my-bin"
path = "src/bin/main.rs"
```

### Library Targets

```toml
[lib]
name = "my_lib"
path = "src/lib.rs"
crate-type = ["lib", "cdylib"]
```

### Example Targets

```toml
[[example]]
name = "example1"
path = "examples/example1.rs"
```

## Build Scripts

**Build Scripts** คือ Rust code ที่ run ก่อน compilation

```toml
[package]
build = "build.rs"
```

`build.rs`:

```rust
fn main() {
    println!("cargo:rerun-if-changed=build.rs");
    println!("cargo:rustc-env=MY_VAR=value");
}
```

## Lockfile (Cargo.lock)

**Lockfile** คือไฟล์ที่ lock versions ของ dependencies

- Commit ไปกับ code สำหรับ binary crates
- ไม่ commit สำหรับ library crates
- ใช้ `cargo update` เพื่อ update versions

## Source Registry

**Registry** คือ source ของ packages

```toml
[source.crates-io]
replace-with = "my-registry"

[source.my-registry]
registry = "https://my-registry.com/index"
```

## Configuration Hierarchy

Cargo โหลด configuration จาก:

1. `.cargo/config.toml` (project)
2. `~/.cargo/config.toml` (user)
3. `/etc/cargo/config.toml` (system)

## Environment Variables

```bash
CARGO_HOME=/path/to/cargo/home
CARGO_TARGET_DIR=/path/to/target
RUSTFLAGS="-C target-cpu=native"
```

## Next Steps

- อ่าน [how-it-works.md](./how-it-works.md) สำหรับวิธีการทำงาน
- อ่าน [features.md](./features.md) สำหรับ features ทั้งหมด
