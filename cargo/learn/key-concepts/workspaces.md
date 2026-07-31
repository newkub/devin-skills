# Workspaces

## แนวคิดเกี่ยวกับ Workspaces

Workspace คือ set ของ crates ที่ share dependencies และ configuration

## โครงสร้าง Workspace

```
workspace/
├── Cargo.toml (workspace root)
├── Cargo.lock
├── crates/
│   ├── core/
│   │   ├── Cargo.toml
│   │   └── src/
│   ├── api/
│   │   ├── Cargo.toml
│   │   └── src/
│   └── cli/
│       ├── Cargo.toml
│       └── src/
```

## Workspace Manifest

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "crates/core",
    "crates/api",
    "crates/cli",
]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"

[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
thiserror = "1.0"
```

## Workspace Members

### Explicit Members

```toml
[workspace]
members = [
    "crates/core",
    "crates/api",
]
```

### Glob Pattern

```toml
[workspace]
members = ["crates/*"]
```

### Exclude Members

```toml
[workspace]
members = ["crates/*"]
exclude = ["crates/old", "examples/*"]
```

## Shared Dependencies

ใช้ workspace dependencies:

```toml
[workspace.dependencies]
serde = "1.0"
tokio = "1.0"
```

ในแต่ละ crate:

```toml
[dependencies]
serde = { workspace = true }
tokio = { workspace = true }
```

## Workspace Resolver

### Resolver Version 1 (Legacy)

```toml
[workspace]
resolver = "1"
```

- แก้ปัญหา version conflicts ด้วยการเลือก version สูงสุด
- อาจมี duplicate dependencies

### Resolver Version 2 (Recommended)

```toml
[workspace]
resolver = "2"
```

- ใช้ PubGrub algorithm
- ลด duplicate dependencies
- ดีกว่าสำหรับ workspaces

## Workspace Commands

### Build All Members

```bash
cargo build --workspace
```

### Build Specific Member

```bash
cargo build -p core
```

### Test All Members

```bash
cargo test --workspace
```

### Clean All Members

```bash
cargo clean --workspace
```

## Workspace Benefits

### 1. Shared Dependencies

ทุก crates ใช้ version เดียวกัน:

```toml
[workspace.dependencies]
serde = "1.0"
```

### 2. Unified Versioning

```toml
[workspace.package]
version = "0.1.0"
```

### 3. Shared Configuration

```toml
[workspace.lints.rust]
warnings = "warn"
```

### 4. Faster Builds

- Build cache ระหว่าง crates
- Parallel compilation
- Shared dependencies

### 5. Easier Maintenance

- Update dependencies ที่เดียว
- Consistent toolchain
- Centralized configuration

## Workspace Patterns

### Monorepo Pattern

```
workspace/
├── crates/
│   ├── core/
│   ├── api/
│   ├── cli/
│   └── web/
```

### Library + Binary Pattern

```
workspace/
├── crates/
│   ├── lib/      # Library
│   └── bin/      # Binary
```

### Plugin Pattern

```
workspace/
├── crates/
│   ├── core/     # Core functionality
│   ├── plugin1/  # Plugin 1
│   └── plugin2/  # Plugin 2
```

## Virtual Workspace

Workspace ที่ไม่มี root package:

```toml
[workspace]
members = ["crates/*"]
resolver = "2"

[workspace.dependencies]
# shared dependencies
```

ไม่มี `[package]` ใน root `Cargo.toml`

## Workspace Limitations

### 1. No Nested Workspaces

```
workspace/
├── Cargo.toml
└── crates/
    └── nested/
        └── Cargo.toml  # ❌ Not allowed
```

### 2. Member Discovery

ต้องระบุ members อย่างชัดเจน

### 3. Lockfile Sharing

ทุก members ใช้ `Cargo.lock` เดียวกัน

## Best Practices

### 1. ใช้ Resolver 2

```toml
[workspace]
resolver = "2"
```

### 2. ใช้ Workspace Dependencies

```toml
[workspace.dependencies]
serde = "1.0"
```

### 3. จัดระเบียบ Crates

```
crates/
├── core/      # Core logic
├── api/       # API layer
├── cli/       # CLI interface
└── utils/     # Shared utilities
```

### 4. ใช้ Workspace Package

```toml
[workspace.package]
version = "0.1.0"
edition = "2021"
```

### 5. ทดสอบ Workspace

```bash
cargo test --workspace
cargo clippy --workspace
```
