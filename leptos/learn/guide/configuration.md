# Configuration

## Cargo.toml

```toml
[dependencies]
leptos = { version = "0.6", features = ["serde", "fs"] }
leptos_router = "0.6"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```

## Server Config

```rust
// src/lib.rs
use leptos::*;

#[server]
async fn get_data() -> Result<Vec<String>, ServerFnError> {
    Ok(vec!["item1".to_string(), "item2".to_string()])
}
```

## Environment Variables

```bash
# .env
DATABASE_URL=postgresql://...
API_KEY=secret123
```

## Build Config

```toml
[package.metadata.leptos]
output_dir = "pkg"
site_root_dir = "dist"
```

## WASM Target

```bash
rustup target add wasm32-unknown-unknown
cargo build --target wasm32-unknown-unknown
```