# Framework Dioxus API & Dependencies

## Install

```sh
# Add the framework crate to a Rust project
cargo add dioxus

# Install the Dioxus CLI (dx) — prebuilt binary (fast)
cargo binstall dioxus-cli
# or build from source
cargo install dioxus-cli --locked

# Required Rust setup for web builds
rustup target add wasm32-unknown-unknown
```

## Version

- Latest stable: 0.7.10 (`dioxus` crate); `0.8.0-alpha` available as pre-release
- MSRV: Rust 1.83+
- [Package Registry](https://crates.io/crates/dioxus)
- [CLI Registry](https://crates.io/crates/dioxus-cli)
- [Repository](https://github.com/DioxusLabs/dioxus)

## Dependencies

- `dioxus` is a facade crate: `dioxus-core`, `dioxus-signals`, `dioxus-rsx`, `dioxus-hooks`, `dioxus-document`, plus renderer crates (`dioxus-web`, `dioxus-desktop`, `dioxus-fullstack`, `dioxus-ssr`) gated by features.
- Cargo features select the platform: `web`, `desktop`, `mobile`, `fullstack`, `server`, `liveview`.
- `Dioxus.toml` configures the app bundle (title, assets, platform settings).
- Linux desktop builds need WebKitGTK (`libwebkit2gtk-4.1-dev`); Windows uses WebView2; macOS needs no extra deps.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `dx new <name>` | Create a new Dioxus project from template | interactive template pick | `--template`, `--subtemplate`, `--yes` |
| `dx init` | Init Dioxus project in current directory | keeps existing files | `--name`, `--yes` |
| `dx serve` | Build, watch & serve with hot-reload | platform from features | `--platform web|desktop|ios|android`, `--hot-reload`, `--open`, `--port`, `--addr` |
| `dx build` | Build project and all assets | debug profile | `--platform`, `--release`, `--package`, `--target`, `--features` |
| `dx bundle` | Bundle app into shippable package | platform default format | `--platform`, `--package-types appimage|dmg|msi|deb`, `--release` |
| `dx run` | Run the project without hot-reload | debug profile | `--platform`, `--release` |
| `dx check` | Check the project for issues | whole project | `--file`, project flags |
| `dx fmt` | Auto-format RSX macros | all rsx! blocks | `--file`, `--check`, `--raw` |
| `dx clean` | Clean build output artifacts | target/dx dirs | (none) |
| `dx translate` | Translate HTML source into RSX | stdin/file | `--file`, `--component` |
| `dx config` | Manage `Dioxus.toml` config | current file | `format-print`, `format-stdout`, `custom` |
| `dx doctor` | Diagnose installation/toolchain | all checks | (none) |
| `dioxus::launch(App)` | App entry point | platform launcher | `dioxus::launch`, `LaunchBuilder` for custom config |
| `#[component]` / `rsx!` | Component + markup macros | `dioxus::prelude::*` | `use_signal`, `use_context`, `use_resource`, `Signal`, `GlobalSignal`, `#[server]` |

## Source

- Official docs: https://dioxuslabs.com/learn/0.7/
- CLI guide: https://dioxuslabs.com/learn/0.7/cli/
- API docs: https://docs.rs/dioxus/latest/dioxus/
- Description: Dioxus — Rust framework for building web, desktop, and mobile apps from a single codebase.
