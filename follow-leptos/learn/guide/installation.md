# Installation

## Requirements

- Rust 1.70+
- wasm-pack
- wasm-bindgen
- cargo-generate (optional)

## Create New Project

```bash
cargo install cargo-leptos
cargo generate gh:leptos-rs/leptos-template
cd my-app
```

## Manual Setup

```bash
cargo new my-app
cd my-app
```

### Cargo.toml

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
leptos = "0.6"
leptos_router = "0.6"
wasm-bindgen = "0.2"

[dev-dependencies]
wasm-bindgen-test = "0.3"

[profile.release]
opt-level = "s"
lto = true
```

## Verify Installation

```bash
cargo leptos watch
```

เปิด http://localhost:3000
