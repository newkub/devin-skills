## Project Structure

```text
project/
├── src/
│   └── cli/
│       └── mod.rs
│       └── args.rs
│       └── commands.rs
│   └── services/
│       └── mod.rs
│   └── types/
│       └── mod.rs
│   └── utils/
│       └── mod.rs
│   └── main.rs
│   └── lib.rs
├── tests/
│   └── integration.rs
├── benches/
│   └── benchmark.rs
├── .cargo/
│   └── config.toml
├── .gitignore
├── Cargo.toml
├── justfile
├── rust-toolchain.toml
└── README.md
```

## Configuration Files

### Cargo.toml

```toml
[package]
name = "project"
version = "0.1.0"
edition = "2024"
rust-version = "1.85"
license = "MIT"
authors = ["Wrikka"]
description = ""

[dependencies]
clap = { version = "4", features = ["derive", "env"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
anyhow = "1"
thiserror = "2"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
colored = "2"
indicatif = "0.17"
dialoguer = "0.11"
comfy-table = "7"

[dev-dependencies]
assert_cmd = "2"
predicates = "3"
pretty_assertions = "1"

[profile.dev]
debug = "line-tables-only"
incremental = true

[profile.dev.package."*"]
debug = false

[profile.release]
lto = true
opt-level = "z"
strip = true
codegen-units = 1
panic = "abort"
```

### justfile

```justfile
# Development: watch and run
dev:
    cargo watch -x run

# Build release binary
build:
    cargo build --release

# Run the CLI
run *ARGS:
    cargo run -- {{ARGS}}

# Lint and format check
lint:
    cargo clippy -- -D warnings
    cargo fmt --check

# Fix formatting
fmt:
    cargo fmt

# Run tests
test:
    cargo nextest run
    cargo test --doc

# Clean build artifacts
clean:
    cargo clean

# Install the binary
install:
    cargo install --path .

# Build shell completions
completions:
    cargo run -- completions
```

### rust-toolchain.toml

```toml
[toolchain]
channel = "stable"
components = ["rustfmt", "clippy"]
```

### src/main.rs

```rust
use clap::Parser;
use anyhow::Result;

mod cli;
mod services;
mod types;
mod utils;

use cli::args::Cli;

fn main() -> Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env(),
        )
        .init();

    let cli = Cli::parse();
    cli::commands::execute(cli)
}
```

### src/cli/args.rs

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(version, about, long_about = None)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,

    /// Enable verbose output
    #[arg(short, long)]
    pub verbose: bool,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Run a specific task
    Run {
        /// Task name
        #[arg(short, long)]
        name: String,
    },

    /// List available tasks
    List,

    /// Generate shell completions
    Completions {
        /// Shell type (bash, zsh, fish, powershell)
        #[arg(short, long)]
        shell: String,
    },
}
```

## Reference

- CLI: `cargo new --help`
- [clap Documentation](https://docs.rs/clap)
- [Rust CLI Book](https://rust-cli.github.io/book)
- [Rust Documentation](https://doc.rust-lang.org)
