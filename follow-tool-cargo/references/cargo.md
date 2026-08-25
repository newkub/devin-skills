# Cargo Lint Rules and Workspace Lint Configuration Reference

## Install

Cargo is included with the Rust toolchain. Install Rust via `rustup`:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Verify:

```bash
cargo --version
```

## Version Info

- Cargo ships with every Rust release (6-week cycle)
- Latest stable Rust: `1.98.0` (as of Aug 2026)
- Workspace lint inheritance requires MSRV `1.74+`
- Workspace package/dependency inheritance requires MSRV `1.64+`

## Lints Section in `Cargo.toml`

Lints can be allowed/denied using the `[lints]` section in `Cargo.toml`:

```toml
[lints.clippy]
enum_glob_use = "deny"
```

Lint levels: `"allow"`, `"warn"`, `"deny"`, `"forbid"`.

## Rust Lint Categories

```toml
[lints.rust]
unused_extern_crates = "warn"
unused_import_braces = "warn"
unused_qualifications = "warn"
variant_size_differences = "warn"
missing_docs = "warn"
unsafe_code = "forbid"
```

## Clippy Lint Categories

```toml
[lints.clippy]
all = "warn"
pedantic = "warn"
nursery = "warn"
```

## Workspace Lint Configuration

### Define Workspace Lints

Set lint rules at the workspace level in the root `Cargo.toml`:

```toml
# [PROJECT_DIR]/Cargo.toml
[workspace]
members = ["crates/*"]

[workspace.lints.rust]
unused_extern_crates = "warn"
unused_import_braces = "warn"
unused_qualifications = "warn"
unsafe_code = "forbid"

[workspace.lints.clippy]
all = "warn"
pedantic = "warn"
```

### Inherit Workspace Lints in Member Crates

Each member crate inherits with `workspace = true`:

```toml
# [PROJECT_DIR]/crates/bar/Cargo.toml
[package]
name = "bar"
version = "0.1.0"

[lints]
workspace = true
```

### Override Individual Lints

Member crates can override specific rules while inheriting the rest:

```toml
[lints]
workspace = true

[lints.clippy]
pedantic = "allow"
```

## Command Line Lint Flags

Allow or warn on lints during a Clippy run:

```bash
cargo clippy -- -A clippy::lint_name    # Allow a lint
cargo clippy -- -W clippy::lint_name    # Warn on a lint
cargo clippy -- -D clippy::lint_name    # Deny a lint
cargo clippy -- -W clippy::pedantic     # Warn on all pedantic lints
cargo clippy -- -A clippy::all -W clippy::useless_format
```

## Pre-commit Hooks with `lefthook`

```yaml
# lefthook.yml
pre-commit:
  commands:
    check:
      run: cargo check --all-targets
    clippy:
      run: cargo clippy --all-targets -- -D warnings
    fmt:
      run: cargo fmt --check
```

## Verification Commands

```bash
cargo check --all-targets                          # Check compilation
cargo clippy --all-targets -- -D warnings          # Run linter with warnings as errors
cargo fmt --check                                  # Check formatting
cargo test                                         # Run tests
```

## Source

- https://doc.rust-lang.org/cargo/reference/workspaces.html
- https://doc.rust-lang.org/clippy/configuration.html
