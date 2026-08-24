# Rust Language and Cargo Workspace Reference

## Install

Install Rust via `rustup` (recommended):

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

On Windows, download and run `rustup-init.exe` from https://win.rustup.rs then follow on-screen instructions. The MSVC build tools for Visual Studio 2013 or later are required.

Update an existing installation:

```bash
rustup update stable
```

Verify installation:

```bash
rustc --version
cargo --version
```

## Version Info

- Latest stable: `1.98.0` (as of 2025)
- Rust has a 6-week rapid release process
- Channels: `stable`, `beta`, `nightly`
- Tools installed to `~/.cargo/bin` (Unix) or `%USERPROFILE%\.cargo\bin` (Windows)

## Cargo Workspace Configuration

A workspace is a collection of one or more packages managed together. All packages share a common `Cargo.lock` and output directory (`target/`).

### Virtual Workspace

Root `Cargo.toml` with no `[package]`:

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["hello_world"]
resolver = "3"
```

```toml
# [PROJECT_DIR]/hello_world/Cargo.toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2024"
```

### Root Package Workspace

```toml
[workspace]

[package]
name = "hello_world"
version = "0.1.0"
```

### Members and Exclude

```toml
[workspace]
members = ["member1", "path/to/member2", "crates/*"]
exclude = ["crates/foo", "path/to/other"]
```

The `members` list supports globs (`*` and `?`). Path dependencies inside the workspace directory automatically become members.

### Default Members

```toml
[workspace]
members = ["path/to/member1", "path/to/member2", "path/to/member3/*"]
default-members = ["path/to/member2", "path/to/member3/foo"]
```

## Workspace Package Inheritance (MSRV 1.64+)

Define shared keys in `workspace.package` and inherit in members:

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["bar"]

[workspace.package]
version = "1.2.3"
authors = ["Nice Folks"]
description = "A short description of my package"
documentation = "https://example.com/bar"
```

```toml
# [PROJECT_DIR]/bar/Cargo.toml
[package]
name = "bar"
version.workspace = true
authors.workspace = true
description.workspace = true
documentation.workspace = true
```

Supported inheritable keys: `authors`, `categories`, `description`, `documentation`, `edition`, `exclude`, `homepage`, `include`, `keywords`, `license`, `license-file`, `publish`, `readme`, `repository`, `rust-version`, `version`.

## Workspace Dependencies (MSRV 1.64+)

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["bar"]

[workspace.dependencies]
cc = "1.0.73"
rand = "0.8.5"
regex = { version = "1.6.0", default-features = false, features = ["std"] }
```

```toml
# [PROJECT_DIR]/bar/Cargo.toml
[package]
name = "bar"
version = "0.2.0"

[dependencies]
regex = { workspace = true, features = ["unicode"] }

[build-dependencies]
cc.workspace = true

[dev-dependencies]
rand.workspace = true
```

## Workspace Lints (MSRV 1.74+)

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["crates/*"]

[workspace.lints.rust]
unsafe_code = "forbid"
```

```toml
# [PROJECT_DIR]/crates/bar/Cargo.toml
[package]
name = "bar"
version = "0.1.0"

[lints]
workspace = true
```

## Cargo Profiles

Profiles alter compiler settings. Cargo only looks at profile settings in the root `Cargo.toml`.

### Default `dev` Profile

```toml
[profile.dev]
opt-level = 0
debug = true
split-debuginfo = '...'  # Platform-specific.
strip = "none"
debug-assertions = true
overflow-checks = true
lto = false
panic = 'unwind'
incremental = true
codegen-units = 256
rpath = false
```

### Default `release` Profile

```toml
[profile.release]
opt-level = 3
debug = false
split-debuginfo = '...'  # Platform-specific.
strip = "none"
debug-assertions = false
overflow-checks = false
lto = false
panic = 'unwind'
incremental = false
codegen-units = 16
rpath = false
```

### Custom Profile Example

```toml
[profile.dev]
opt-level = 1
overflow-checks = false
```

### `opt-level` Values

- `0`: no optimizations
- `1`: basic optimizations
- `2`: some optimizations
- `3`: all optimizations
- `"s"`: optimize for binary size
- `"z"`: optimize for binary size, turn off loop vectorization

### `debug` Values

- `0`, `false`, or `"none"`: no debug info (default for `release`)
- `"line-tables-only"`: minimal debug info for backtraces
- `1` or `"limited"`: debug info without type/variable info
- `2`, `true`, or `"full"`: full debug info (default for `dev`)

### `lto` Values

- `true` or `"fat"`: fat LTO across all crates
- `"thin"`: thin LTO, faster than fat
- `false`: thin local LTO only
- `"off"`: disables LTO

### `panic` Values

- `"unwind"`: unwind the stack upon panic
- `"abort"`: terminate the process upon panic

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
