# Configuration Reference

Configuration options สำหรับ Dioxus

## Cargo.toml

```toml
[dependencies]
dioxus = { version = "0.52", features = ["web", "desktop"] }
dioxus-router = "0.52"
serde = { version = "1.0", features = ["derive"] }

[dev-dependencies]
dioxus-html = "0.52"

[package.metadata.dioxus]
# Platform specific
default-platform = "web"

[profile.release]
opt-level = "s"
lto = true
```

## Dioxus Config

```rust
// dioxus.toml
[web.app]
title = "My App"

[web.watcher]
watch-path = ["src"]

[web.resource]
style = ["style.css"]

[web.routing]
base-path = "/"
```

## Environment Variables

```bash
# .env
DIOXUS_BASE_PATH=/
RUST_LOG=info
```