# Tool Cargo API & Dependencies

## Install

Cargo ships with the Rust toolchain — install Rust, not a `cargo` npm package:

```sh
# via rustup (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# or via mise
mise use -g rust
```

Note: the npm package `cargo` is an unrelated HTML5 web-storage module — do NOT install it.

## Version

- Cargo matches the Rust toolchain version — latest stable Rust: `1.98.1` (verified 2026-09-11)
- [Repository](https://github.com/rust-lang/cargo)
- [Docs](https://doc.rust-lang.org/cargo/)

## Dependencies

- Ships with Rust toolchain (`rustup` component); no external runtime deps.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `cargo new` / `cargo init` | Create project | binary crate | --lib, --bin, --name |
| `cargo build` | Compile project | dev profile | --release, --workspace, -p |
| `cargo run` | Build and run | dev profile | --release, --, --bin |
| `cargo test` | Run tests | all targets | --workspace, -p, --lib |
| `cargo clippy` | Lint via Clippy | all targets | --fix, -- -D warnings |
| `cargo fmt` | Format via rustfmt | in-place | --check |
| `cargo add` / `cargo remove` | Manage dependencies | latest version | --dev, --build, --features |
| `cargo update` | Update Cargo.lock | semver-compatible | -p, --dry-run |
| `cargo doc` | Build docs | local crates | --open, --no-deps |
| `cargo publish` | Publish to crates.io | dry-run first | --dry-run, --allow-dirty |

## Source

- Official docs: https://doc.rust-lang.org/cargo/
- Description: The Rust package manager and build tool.
