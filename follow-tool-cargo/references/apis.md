| key | value |
|---|---|
| install | `mise use -g rust` |
| repository | https://github.com/rust-lang/cargo |
| docs | https://doc.rust-lang.org/cargo/ |

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
