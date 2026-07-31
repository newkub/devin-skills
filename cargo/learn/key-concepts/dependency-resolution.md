# Dependency Resolution

## แนวคิดเกี่ยวกับ Dependency Resolution

Cargo ใช้ algorithm ในการ resolve dependencies ให้ compatible

## Version Requirements

### Caret (^)

Compatible updates:

```toml
serde = "^1.0"  # 1.0.0 <= version < 2.0.0
```

### Tilde (~)

Patch updates only:

```toml
serde = "~1.0"  # 1.0.0 <= version < 1.1.0
```

### Comparison Operators

```toml
serde = ">1.0"
serde = ">=1.0"
serde = "<2.0"
serde = "=1.0.0"
```

### Wildcard

```toml
serde = "*"  # Any version
```

## Dependency Sources

### crates.io (Default)

```toml
[dependencies]
serde = "1.0"
```

### Git

```toml
[dependencies]
my-crate = { git = "https://github.com/user/repo" }
my-crate = { git = "https://github.com/user/repo", branch = "main" }
my-crate = { git = "https://github.com/user/repo", tag = "v1.0" }
my-crate = { git = "https://github.com/user/repo", rev = "abc123" }
```

### Path

```toml
[dependencies]
local-crate = { path = "../local-crate" }
```

### Registry

```toml
[dependencies]
my-crate = { version = "1.0", registry = "my-registry" }
```

## Dependency Resolution Algorithm

Cargo ใช้ PubGrub algorithm:

```
┌─────────────┐
│  Initial    │
│  Request    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Version    │
│  Selection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Conflict   │
│  Detection  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Backtrack  │
│  Search     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Solution   │
└─────────────┘
```

## Conflict Resolution

### Version Conflict

```
my-crate depends on:
  serde 1.0
  other-crate depends on serde 2.0
```

Cargo จะ:
1. พยายามหา version ที่ compatible
2. ถ้าไม่ได้ จะแจ้ง error
3. ให้ user แก้ version constraints

### Feature Conflict

```toml
[dependencies]
serde = { version = "1.0", features = ["std"] }
other-crate = { version = "1.0", default-features = false }
```

## Lockfile (Cargo.lock)

### Purpose

Lock versions ของ dependencies:

```toml
# Cargo.lock
[[package]]
name = "serde"
version = "1.0.150"
source = "registry+https://github.com/rust-lang/crates.io-index"
```

### When to Commit

- **Binary crates**: Commit `Cargo.lock`
- **Library crates**: ไม่ commit `Cargo.lock`

### Update Lockfile

```bash
cargo update
```

## Dependency Tree

### View Tree

```bash
cargo tree
```

Output:
```
my-crate v0.1.0
└── serde v1.0.150
    └── serde_derive v1.0.150
        └── proc-macro2 v1.0.50
```

### Check Duplicates

```bash
cargo tree --duplicates
```

### Invert Tree

```bash
cargo tree --invert serde
```

## Workspace Resolution

### Resolver Version 1

```toml
[workspace]
resolver = "1"
```

- แก้ conflicts ด้วย version สูงสุด
- อาจมี duplicates

### Resolver Version 2

```toml
[workspace]
resolver = "2"
```

- ใช้ PubGrub
- ลด duplicates
- ดีกว่าสำหรับ workspaces

## Dependency Updates

### Update All

```bash
cargo update
```

### Update Specific Package

```bash
cargo update -p serde
```

### Update to Specific Version

```bash
cargo update -p serde --precise 1.0.150
```

## Best Practices

### 1. ระบุ Version อย่างชัดเจน

```toml
# ดี
serde = "1.0.150"

# หลีกเลี่ยง
serde = "1"
```

### 2. ใช้ Workspace Dependencies

```toml
[workspace.dependencies]
serde = "1.0"
```

### 3. ตรวจสอบ Dependency Tree

```bash
cargo tree
cargo tree --duplicates
```

### 4. ลบ Dependencies ที่ไม่ใช้

```bash
cargo install cargo-udeps
cargo +nightly udeps
```

### 5. ใช้ Features อย่างมีเหตุผล

```toml
[features]
default = ["std"]
std = []
```
