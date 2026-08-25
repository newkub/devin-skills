# Rust CLI Commands and Toolchain

## CLI Commands

```bash
cargo new my_project          # Create a new binary project
cargo new my_lib --lib        # Create a new library project
cargo build                   # Build the project (dev profile)
cargo build --release         # Build with release profile
cargo check                   # Check compilation without producing binary
cargo check --workspace       # Check all workspace members
cargo test                    # Run tests
cargo run                     # Run the binary
cargo fmt                     # Format code
cargo clippy                  # Run linter
cargo update                  # Update dependencies in Cargo.lock
cargo add serde               # Add a dependency
cargo doc --open              # Generate and open documentation
```

## `rust-toolchain.toml`

Pin the Rust version for a project:

```toml
[toolchain]
channel = "1.98.0"
components = ["rustfmt", "clippy"]
targets = ["wasm32-unknown-unknown"]
```

## Source

- https://www.rust-lang.org/tools/install
- https://doc.rust-lang.org/cargo/reference/workspaces.html
- https://doc.rust-lang.org/cargo/reference/profiles.html
