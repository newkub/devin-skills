# Configuration

## dioxus.toml

```toml
[web.app]
title = "My Dioxus App"
base-path = "/"

[web.watcher]
watch-path = ["src", "public"]
hr = true

[web.resource]
style = ["style.css"]
script = ["index.js"]

[web.build]
target = "web"
outdir = "dist"
```

## Cargo.toml Features

```toml
[dependencies]
# Web support
dioxus = { version = "0.52", features = ["web"] }

# Desktop support (Tauri/wry)
dioxus = { version = "0.52", features = ["desktop"] }

# Mobile support
dioxus = { version = "0.52", features = ["mobile"] }

# SSR support
dioxus = { version = "0.52", features = ["ssr"] }
```

## Environment Variables

```bash
# .env
DIOXUS_BASE_PATH=/
DIOXUS_SITE_ROOT=dist
RUST_LOG=dioxus=debug
```

## Platform-Specific

### Web (dioxus.toml)

```toml
[web.app]
title = "My App"
base-path = "/"

[web.build]
minify = true
sourcemap = false

[web.resource]
inline = true
```

### Desktop (Cargo.toml)

```toml
[dependencies]
tauri = { version = "1", features = ["shell-open"] }
```