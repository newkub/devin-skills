# Features

## แนวคิดเกี่ยวกับ Features

Features คือ optional functionality ที่ enable/disable ได้

## Feature Declaration

```toml
[features]
default = ["std"]
std = []
no_std = []
serde = ["dep:serde"]
```

## Dependency Features

### Enable Features

```toml
[dependencies]
serde = { version = "1.0", features = ["derive"] }
```

### Optional Dependencies

```toml
[dependencies]
serde = { version = "1.0", optional = true }

[features]
serde = ["dep:serde"]
```

## Feature Composition

### Simple Features

```toml
[features]
feature_a = []
feature_b = []
```

### Feature Dependencies

```toml
[features]
feature_a = []
feature_b = ["feature_a"]
feature_c = ["feature_a", "feature_b"]
```

### Unified Features

```toml
[features]
default = ["full"]
full = ["std", "serde", "async"]
std = []
serde = ["dep:serde"]
async = ["dep:tokio"]
```

## Using Features

### Enable Features

```bash
cargo build --features feature_a,feature_b
```

### Default Features

```toml
[features]
default = ["std", "serde"]
```

### No Default Features

```bash
cargo build --no-default-features
```

## Conditional Compilation

### cfg Attribute

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

### cfg Macro

```rust
if cfg!(feature = "std") {
    // runtime check
}
```

## Feature Patterns

### Platform-Specific Features

```toml
[features]
default = ["std"]
std = []
```

```rust
#[cfg(feature = "std")]
use std::fs::File;

#[cfg(not(feature = "std"))]
// no_std implementation
```

### Optional Dependencies

```toml
[dependencies]
serde = { version = "1.0", optional = true }

[features]
serde = ["dep:serde"]
```

```rust
#[cfg(feature = "serde")]
use serde::{Serialize, Deserialize};
```

### Test Features

```toml
[features]
test-utils = []
```

```toml
[dev-dependencies]
my-crate = { path = ".", features = ["test-utils"] }
```

## Feature Best Practices

### 1. ใช้ Default Features อย่างระมัดระวัง

```toml
# ดี
[features]
default = []

# หลีกเลี่ยง
[features]
default = ["std", "serde", "async"]  # Too many
```

### 2. ตั้งชื่อ Features ให้ชัดเจน

```toml
# ดี
[features]
json = ["dep:serde"]
yaml = ["dep:serde-yaml"]

# หลีกเลี่ยง
[features]
f1 = []
f2 = []
```

### 3. ใช้ Feature Unification

```toml
[features]
full = ["std", "serde", "async"]
```

### 4. Document Features

```toml
# serde - Enable serialization support
# std - Enable std library support
# async - Enable async runtime support
```

## Feature Resolution

Cargo resolves features ใน workspace:

```toml
[workspace]
resolver = "2"
```

Resolver 2 จะ:
- Unify features ระหว่าง crates
- ลบ duplicate features
- Resolve conflicts อัตโนมัติ

## Feature Examples

### Library with Features

```toml
[package]
name = "my-lib"
version = "0.1.0"

[features]
default = ["std"]
std = []
serde = ["dep:serde"]

[dependencies]
serde = { version = "1.0", optional = true }
```

```rust
#[cfg(feature = "serde")]
use serde::{Serialize, Deserialize};

#[cfg(feature = "serde")]
#[derive(Serialize, Deserialize)]
pub struct Data {
    value: String,
}
```

### Binary with Features

```toml
[dependencies]
my-lib = { version = "0.1", features = ["serde"] }
```

## Feature Testing

```bash
# Test with features
cargo test --features feature_a

# Test all features
cargo test --all-features
```
