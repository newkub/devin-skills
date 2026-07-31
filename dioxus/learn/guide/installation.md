# Installation

## Requirements

- Rust 1.70+
- Cargo
- For web: `wasm32-unknown-unknown` target

## Create New Project

### Web App

```bash
cargo install dioxus-cli
cargo new my-app
cd my-app
dx init --platform web
```

### Desktop App

```bash
cargo install dioxus-cli
cargo new my-app --template app
cd my-app
dx serve --platform desktop
```

### Manual Setup

```bash
# Add dependencies
cargo add dioxus --features web
cargo add dioxus-router
cargo add wasm-bindgen
```

### Cargo.toml

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[dependencies]
dioxus = { version = "0.52", features = ["web"] }
dioxus-router = "0.52"

[target.'cfg(not(target_arch = "wasm32"))'.dependencies]
dioxus = { version = "0.52", features = ["desktop"] }

[profile.release]
opt-level = "s"
lto = true
```

## Verify Installation

```bash
dx serve --platform web
```

เปิด http://localhost:8080