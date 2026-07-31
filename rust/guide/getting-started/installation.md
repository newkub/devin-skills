# Installation

## Install Rust

### Windows (Recommended)

```powershell
# Download and run rustup-init.exe from https://rustup.rs/
# Or via PowerShell:
irm https://rustup.rs | iex
```

### Verify Installation

```powershell
# After installation, verify:
rustc --version
cargo --version
```

### Update Rust

```powershell
rustup update
```

## Cargo Commands

```powershell
# Create new project
cargo new my-project
cargo new --lib my-library

# Build project
cargo build
cargo build --release

# Run project
cargo run
cargo run --release

# Run tests
cargo test

# Check code (faster than build)
cargo check

# Build documentation
cargo doc --open

# Clean build artifacts
cargo clean
```

## Essential Tools

### rustfmt (Code Formatting)

```powershell
# Format code
cargo fmt

# Check formatting (CI/CD)
cargo fmt -- --check

# Configure via rustfmt.toml
echo '[tabular]' > rustfmt.toml
echo 'decimal_literal = true' >> rustfmt.toml
```

### clippy (Linter)

```powershell
# Run clippy linter
cargo clippy

# Run with specific lint level
cargo clippy -- -W clippy::pedantic

# Allow specific lint
cargo clippy -- -A unused_variables
```

### rust-analyzer (Language Server)

```powershell
# VS Code: Install "rust-analyzer" extension
# Neovim: Add to init.lua
```

## VS Code Configuration

```json
// .vscode/settings.json
{
    "rust-analyzer.checkOnSave.command": "clippy",
    "rust-analyzer.cargo.loadOutDirsFromCheck": true,
    "rust-analyzer.procMacro.enable": true
}
```

## Cross-Compilation

```powershell
# Install target
rustup target add x86_64-pc-windows-gnu

# Build for specific target
cargo build --target x86_64-pc-windows-gnu
```

## Essential Crates

```toml
[dependencies]
# Web framework
axum = "0.7"

# Async runtime
tokio = { version = "1", features = ["full"] }

# Serialization
serde = { version = "1", features = ["derive"] }
serde_json = "1"

# Database
sqlx = { version = "0.7", features = ["runtime-tokio", "postgres"] }

# Logging
tracing = "0.1"
tracing-subscriber = "0.3"
```

## Development Tools

| Tool | Purpose | Install |
|------|---------|---------|
| rustfmt | Code formatting | Built-in (rustup) |
| clippy | Linter | Built-in (rustup) |
| rust-analyzer | Language server | VS Code/Marketplace |
| miri | Undefined behavior detection | `rustup component add miri` |
| cargo-watch | Auto-rebuild | `cargo install cargo-watch` |
| cargo-expand | Macro expansion | `cargo install cargo-expand` |