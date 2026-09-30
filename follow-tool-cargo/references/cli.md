| key | value |
|---|---|
| install | `rustup component add cargo` |
| repository | https://github.com/rust-lang/cargo |
| docs | https://doc.rust-lang.org/cargo/commands/index.html |

| commands | description | default | options |
|---|---|---|---|
| `cargo build` | Compile current package | — | --release, --features, --all-features, --no-default-features, --target, --workspace |
| `cargo test` | Run tests | — | --release, --features, --package, --lib, --bin, --no-fail-fast, -- --nocapture |
| `cargo run` | Build and run bin | — | --release, --bin, --example, --features |
| `cargo check` | Check package without building | — | --release, --features, --all-targets |
| `cargo clippy` | Run clippy lints | — | -- -D warnings, --fix, --allow-dirty, --allow-staged |
| `cargo fmt` | Format code | — | --check, --all, -- --config |
| `cargo new <name>` | Create new package | — | --lib, --bin |
| `cargo add <dep>` | Add dependency | — | --dev, --build, --features |
| `cargo publish` | Publish to crates.io | — | --dry-run, --allow-dirty |
| `cargo install <crate>` | Install binary crate | — | --version, --locked, --force |
