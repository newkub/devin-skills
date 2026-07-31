# Configuration

## Cargo.toml

```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <you@example.com>"]
description = "A short description"
license = "MIT"
repository = "https://github.com/user/repo"
keywords = ["example", "library"]
categories = ["command-line-utilities"]

[dependencies]
# Core dependencies
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Dev dependencies
[dev-dependencies]
criterion = "0.5"

# Build dependencies
[build-dependencies]
syn = "1.0"

# Optional features
[features]
default = ["basic"]
advanced = ["advanced-feature"]

[profile.release]
lto = true
codegen-units = 1
```

## rust-toolchain.toml

```toml
[toolchain]
channel = "1.75"
components = ["rustfmt", "clippy"]
targets = ["x86_64-unknown-linux-gnu"]
```

## rustfmt.toml

```toml
max_width = 100
hard_tabs = false
tab_spaces = 4
newline_style = "Auto"
use_small_heuristics = "Default"
reorder_imports = true
reorder_modules = true
remove_nested_parens = true
format_strings = true
normalize_comments = true
```

## .cargo/config.toml

```toml
[build]
target = "x86_64-unknown-linux-gnu"

[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

## Cargo.lock

```toml
# Generated automatically - DO NOT EDIT
# Use `cargo update` to update

[[package]]
name = "serde"
version = "1.0.195"
source = "registry+..."
```

## Cargo.lock Management

```powershell
# Update dependencies
cargo update

# Update specific package
cargo update -p serde

# Remove Cargo.lock
rm Cargo.lock

# Recreate Cargo.lock
cargo generate-lockfile
```

## Workspace Configuration

```toml
# Cargo.toml (workspace root)
[workspace]
members = [
    "crates/core",
    "crates/cli",
    "crates/lib",
]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2021"
authors = ["Your Name"]

[workspace.dependencies]
serde = "1.0"
tokio = { version = "1", features = ["full"] }
```

## Profile Settings

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

[profile.test]
opt-level = 0
debug = true
```

## Environment Variables

```powershell
# Set CARGO_HOME
$env:CARGO_HOME = "C:\cargo"

# Set RUSTUP_HOME
$env:RUSTUP_HOME = "C:\rustup"

# Enable sparse registry
$env:CARGO_HTTP_TIMEOUT = "10"

# Use vendored OpenSSL
$env:OPENSSL_DIR = "C:\openssl"
```