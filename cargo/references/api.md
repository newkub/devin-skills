# Programmatic API

Cargo มี CLI commands สำหรับ Rust package management:

## Basic Commands

```bash
# Create new project
cargo new my-project

# Initialize in existing directory
cargo init

# Build project
cargo build

# Build for release
cargo build --release

# Run project
cargo run

# Run release build
cargo run --release
```

## Testing

```bash
# Run tests
cargo test

# Run specific test
cargo test test_name

# Run tests with output
cargo test -- --nocapture
```

## Dependency Management

```bash
# Add dependency
cargo add serde

# Add dev dependency
cargo add --dev clap

# Remove dependency
cargo remove serde

# Update dependencies
cargo update
```

## Publishing

```bash
# Check if package can be published
cargo publish --dry-run

# Publish to crates.io
cargo publish
```

## Configuration (Cargo.toml)

```toml
[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = "1.0"

[dev-dependencies]
clap = "4.0"
```

ดูรายละเอียดเพิ่มเติมที่: [Cargo Documentation](https://doc.rust-lang.org/cargo/)
