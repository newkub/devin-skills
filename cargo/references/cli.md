# cli

## index.md

# CLI Reference

## Installation

```bash
# Via rustup (Recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Via package manager
brew install rust
choco install rust
```

## Main Commands

### cargo new

Create new project:

```bash
cargo new <name>
cargo new <name> --lib
cargo new <name> --bin
cargo new <name> --name <crate-name>
```

### cargo build

Build project:

```bash
cargo build
cargo build --release
cargo build --target <target>
cargo build -p <package>
cargo build --features <features>
```

### cargo run

Run binary:

```bash
cargo run
cargo run -- <args>
cargo run --example <name>
cargo run --bin <name>
cargo run --features <features>
```

### cargo test

Run tests:

```bash
cargo test
cargo test <test-name>
cargo test --doc
cargo test --lib
cargo test --test <name>
cargo test -- --nocapture
```

### cargo check

Type check:

```bash
cargo check
cargo check -p <package>
cargo check --all-targets
```

### cargo clippy

Lint:

```bash
cargo clippy
cargo clippy --fix
cargo clippy -- -W clippy::all
```

### cargo fmt

Format:

```bash
cargo fmt
cargo fmt --check
cargo fmt -- --emit=stdout
```

### cargo doc

Documentation:

```bash
cargo doc
cargo doc --open
cargo doc --no-deps
cargo doc -p <package>
```

### cargo publish

Publish:

```bash
cargo publish
cargo publish --dry-run
cargo publish --registry <registry>
```

### cargo install

Install binary:

```bash
cargo install <crate>
cargo install --force <crate>
cargo install --version <ver> <crate>
cargo install --path <path>
```

## Dependency Commands

### cargo add

Add dependency:

```bash
cargo add serde
cargo add serde --features derive
cargo add serde@1.0
cargo add serde --dev
cargo add serde --build
```

### cargo remove

Remove dependency:

```bash
cargo remove serde
cargo remove serde --dev
```

### cargo update

Update dependencies:

```bash
cargo update
cargo update -p <package>
cargo update -p <package> --precise <version>
```

### cargo tree

Dependency tree:

```bash
cargo tree
cargo tree --depth <n>
cargo tree --invert
cargo tree --no-dedupe
```

## Other Commands

| Command | Description |
|---------|-------------|
| `cargo bench` | Run benchmarks |
| `cargo clean` | Clean build artifacts |
| `cargo fetch` | Fetch dependencies |
| `cargo generate-lockfile` | Generate lock file |
| `cargo info` | Show package info |
| `cargo login` | Login to registry |
| `cargo logout` | Logout from registry |
| `cargo metadata` | Output project metadata |
| `cargo package` | Package for publishing |
| `cargo search` | Search crates.io |
| `cargo uninstall` | Uninstall binary |
| `cargo vendor` | Vendor dependencies |
| `cargo verify-project` | Verify project |
| `cargo version` | Show version |

## Global Options

| Option | Description |
|--------|-------------|
| `-h, --help` | Show help |
| `-V, --version` | Show version |
| `-v, --verbose` | Verbose output |
| `-q, --quiet` | Quiet output |
| `--color <when>` | Color: auto, always, never |
| `--list` | List installed commands |
| `--explain <code>` | Explain error code |

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Build failed |
| 2 | Usage error |
| 3 | Internal error |

## Configuration

```toml
# .cargo/config.toml
[alias]
b = "build"
t = "test"
r = "run"

[build]
jobs = 4
target-dir = "target"
```

## Common Workflows

### Development

```bash
cargo check     # Quick type check
cargo build     # Build
cargo run       # Run
cargo test      # Test
```

### Release

```bash
cargo build --release
cargo test --release
cargo bench
cargo doc --no-deps
```

### Publishing

```bash
cargo publish --dry-run
cargo publish
```

---

