# Framework Leptos API & Dependencies

## Install

```sh
# Add the framework crate
cargo add leptos

# Install the build tool
cargo install --locked cargo-leptos
# or faster prebuilt binary
cargo binstall cargo-leptos

# Required for client-side WASM builds
rustup target add wasm32-unknown-unknown
```

## Version

- Latest stable: 0.8.20 (`leptos` crate); `0.9.0-beta` available as pre-release
- MSRV: Rust 1.88
- [Package Registry](https://crates.io/crates/leptos)
- [CLI Registry](https://crates.io/crates/cargo-leptos)
- [Repository](https://github.com/leptos-rs/leptos)

## Dependencies

- `leptos` re-exports the ecosystem: `leptos_dom`, `leptos_server`, `leptos_macro`, `reactive_graph`, `tachys`.
- Rendering features are mutually exclusive per crate graph: `csr` (client-side), `ssr` (server-side), `hydrate` (SSR + client interactivity), `islands`.
- Full-stack apps pair with an integration: `axum` (`leptos_axum`), `actix-web` (`leptos_actix`), plus `wasm-bindgen`/`wasm-pack` handled by `cargo-leptos`.
- Optional: `nightly` feature enables function-call syntax for signal getters/setters.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `cargo leptos new` | Create project from cargo-generate template | interactive template pick | `--git <template>`, `--name`, `--branch` |
| `cargo leptos watch` | Rebuild on change with browser live-reload | watches `src/` + `style/` | `--hot-reload`, config via `[package.metadata.leptos]` |
| `cargo leptos build` | Build server binary + WASM frontend | debug profile | `--release` |
| `cargo leptos serve` | Build and run the server | after `build` | `--release` |
| `cargo leptos test` | Run lib/bin package tests | workspace tests | `--release` |
| `cargo leptos check` | Check project for compile issues | workspace check | (none) |
| `cargo leptos end-to-end` | Build, run server, execute e2e hook | `end2end-cmd` (e.g. `npx playwright test`) | `end2end-dir` config |
| `cargo leptos clean` | Clean generated site artifacts | `target/site` | (none) |
| `trunk serve` | Alternative dev tool for pure CSR apps | `index.html` entry | `--port`, `--open`, `--release` |
| `leptos::mount::mount_to_body` | Mount app to `<body>` (CSR/hydrate entry) | `leptos` prelude | `hydrate_body` for SSR hydration |
| `#[component]` / `view!` | Component + RSX-like markup macros | `leptos::prelude::*` | `signal`, `RwSignal`, `Memo`, `Effect`, `Resource`, `use_context`, `provide_context` |
| `#[server]` | Server function RPC macro | server-side execution | `#[server(Name, "/api")]` endpoint prefix |

## Source

- Official docs: https://leptos.dev/
- Leptos book: https://book.leptos.dev/
- cargo-leptos: https://github.com/leptos-rs/cargo-leptos
- API docs: https://docs.rs/leptos/latest/leptos/
- Description: Leptos — full-stack, fine-grained reactive web framework written in Rust.
