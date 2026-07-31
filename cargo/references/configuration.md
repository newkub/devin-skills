# configuration

## index.md

# Configuration Reference

## Cargo.toml

### Package

```toml
[package]
name = "my-crate"
version = "1.0.0"
edition = "2021"
authors = ["Name <email>"]
license = "MIT OR Apache-2.0"
readme = "README.md"
homepage = "https://example.com"
repository = "https://github.com/user/repo"
documentation = "https://docs.rs/my-crate"
description = "Description"
rust-version = "1.56"
keywords = ["keyword"]
categories = ["category"]
exclude = ["*.md"]
include = ["src/*.rs"]
```

### Dependencies

```toml
[dependencies]
# Simple
crate = "1.0"

# With version
crate = "1.0.0"
crate = "^1.0"
crate = "~1.0"
crate = ">1.0"

# With features
crate = { version = "1.0", features = ["feature1"] }

# Optional
crate = { version = "1.0", optional = true }

# Git
crate = { git = "url", branch = "main" }
crate = { git = "url", tag = "v1.0" }
crate = { git = "url", rev = "hash" }

# Local
crate = { path = "../crate" }
```

### Features

```toml
[features]
default = ["default"]
default = []
feature_a = []
feature_b = ["feature_a"]
optional = ["crate"]

# Unified
unified = ["feature_a", "feature_b"]
```

### Profile

```toml
[profile.dev]
opt-level = 0
debug = true

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
strip = true

[profile.bench]
inherits = "release"
debug = true

[profile.test]
inherits = "dev"
opt-level = 0
```

## .cargo/config.toml

### Build

```toml
[build]
jobs = 4
rustc-wrapper = "sccache"
target-dir = "target"

[target.x86_64-unknown-linux-gnu]
linker = "clang"

[target.wasm32-unknown-unknown]
rustflags = ["-C", "target-feature=-simd256"]
```

### Environment

```toml
[env]
RUST_BACKTRACE = "1"
MY_VAR = "value"
```

### Alias

```toml
[alias]
b = "build"
t = "test"
r = "run"
c = "check"
l = "clippy"
fmt-check = "fmt -- --check"
```

### Net

```toml
[net]
retry = 3
git-fetch-with-cli = true

[http]
timeout = 60
```

### Registry

```toml
[source.crates-io]
replace-with = "vendored"

[source.vendored]
directory = "vendor"
```

## Workspace

```toml
[workspace]
members = ["crates/*"]
exclude = ["crates/old"]
resolver = "2"

[workspace.package]
version = "1.0.0"
edition = "2021"

[workspace.dependencies]
serde = "1.0"
thiserror = "1.0"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CARGO_HOME` | ~/.cargo | Cargo home directory |
| `CARGO_TARGET_DIR` | target | Target directory |
| `CARGO_MANIFEST_DIR` | - | Manifest directory |
| `CARGO_PROFILE_*` | - | Override profile settings |
| `RUSTUP_TOOLCHAIN` | stable | Override toolchain |
| `CARGO_NET_GIT_FETCH_WITH_CLI` | false | Use git CLI |

## Schema

### Package Schema

```rust
struct Package {
    name: String,
    version: Version,
    edition: String,
    authors: Vec<String>,
    license: Option<String>,
    description: Option<String>,
    documentation: Option<String>,
    homepage: Option<String>,
    repository: Option<String>,
    readme: Option<String>,
    keywords: Vec<String>,
    categories: Vec<String>,
    exclude: Vec<String>,
    include: Vec<String>,
    rust_version: Option<String>,
}
```

### Dependency Schema

```rust
struct Dependency {
    version: Option<String>,
    registry: Option<String>,
    branch: Option<String>,
    tag: Option<String>,
    rev: Option<String>,
    path: Option<String>,
    git: Option<String>,
    features: Vec<String>,
    optional: bool,
    default_features: bool,
    package: Option<String>,
}
```

## Profiles

| Profile | Optimizations | Debug |
|---------|---------------|-------|
| dev | None | Full |
| release | Full | None |
| test | None | Full |
| bench | Full | Limited |

---

