# CLI Frameworks Reference (Rust and Bun)

## Overview

This reference covers CLI creation frameworks for both Rust and Bun, used when deciding a stack for building CLI applications.

---

## Rust CLI: clap

### Install

```sh
cargo add clap --features derive
```

### Version

- Latest: `4.6.6`
- License: MIT OR Apache-2.0
- MSRV: 1.74
- Docs: https://docs.rs/clap

### Basic Example (Derive API)

```rust
use clap::Parser;

#[derive(Parser)]
#[command(name = "mycli")]
#[command(version = "1.0")]
#[command(about = "A CLI tool", long_about = None)]
struct Cli {
    /// Output directory
    #[arg(short, long)]
    out: Option<String>,

    /// Enable verbose output
    #[arg(short, long)]
    verbose: bool,

    /// Input files
    files: Vec<String>,
}

fn main() {
    let cli = Cli::parse();
    println!("out: {:?}, verbose: {}, files: {:?}", cli.out, cli.verbose, cli.files);
}
```

### Subcommands (Derive API)

```rust
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "git")]
#[command(about = "A git-like CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Add files to staging
    Add { files: Vec<String> },
    /// Commit changes
    Commit {
        #[arg(short, long)]
        message: String,
    },
    /// Push to remote
    Push,
}

fn main() {
    let cli = Cli::parse();
    match cli.command {
        Commands::Add { files } => println!("Adding: {:?}", files),
        Commands::Commit { message } => println!("Commit: {}", message),
        Commands::Push => println!("Pushing"),
    }
}
```

### Builder API

```rust
use clap::{Arg, ArgAction, Command};

fn main() {
    let matches = Command::new("mycli")
        .version("1.0")
        .about("A CLI tool")
        .arg(
            Arg::new("out")
                .short('o')
                .long("out")
                .help("Output directory")
                .num_args(1),
        )
        .arg(
            Arg::new("verbose")
                .short('v')
                .long("verbose")
                .action(ArgAction::SetTrue)
                .help("Verbose output"),
        )
        .get_matches();

    let out = matches.get_one::<String>("out");
    let verbose = matches.get_flag("verbose");
}
```

### Cargo.toml

```toml
[dependencies]
clap = { version = "4.6", features = ["derive"] }
```

### Feature Flags

| Feature | Description |
|---------|-------------|
| `derive` | Derive macros for `Parser`, `Subcommand` |
| `cargo` | Pull metadata from `Cargo.toml` at compile time |
| `env` | Read default values from environment variables |
| `wrap_help` | Wrap help text to terminal width |
| `color` | Colored help output (default: auto) |

### Companion Crates

- `clap_complete` — shell completion generation
- `clap_mangen` — man page generation
- `clap-verbosity-flag` — verbose/quiet flag

---

## Bun CLI: cac + picocolors

### Install

```sh
bun add cac picocolors
bun add -d bunup
```

### Versions

- `cac`: `7.0.0` (ESM-only, Node.js >= 20.19.0 or Bun)
- `picocolors`: `1.1.1` (zero dependencies)
- `bunup`: `0.16.32` (bundler built on Bun's native bundler)

### CLI Entry Point

```ts
import cac from "cac";
import pc from "picocolors";

const cli = cac("mycli");

cli
  .command("build [project]", "Build a project")
  .option("--out <dir>", "Output directory")
  .option("--minimize", "Minimize output")
  .action((project, options) => {
    console.log(pc.green(`Building ${project || "default"}`));
    if (options.minimize) {
      console.log(pc.dim("Minimizing output"));
    }
  });

cli
  .command("deploy <folder>", "Deploy a folder")
  .option("--scale [level]", "Scaling level")
  .action((folder, options) => {
    console.log(`Deploying ${folder}`);
  });

cli.help();
cli.version("1.0.0");
cli.parse();
```

### bunup.config.ts

```ts
import { defineConfig } from "bunup";

export default defineConfig({
  dts: { splitting: true },
  packages: "bundle",
});
```

### package.json

```json
{
  "scripts": {
    "dev": "bun run src/presentation/cli.ts",
    "build": "bunx bunup",
    "build:watch": "bunx bunup --watch",
    "lint": "bunx tsc --noEmit && bunx biome lint --write",
    "test": "bun test"
  }
}
```

---

## Stack Selection Guide

| Criteria | Rust (clap) | Bun (cac) |
|----------|-------------|-----------|
| Distribution | Single binary | Requires Bun runtime |
| Performance | Highest | High |
| Type safety | Compile-time | TypeScript |
| Development speed | Slower compile | Fast iteration |
| Ecosystem | crates.io | npm |
| Team skills | Rust | TypeScript |

## Source

- clap docs: https://docs.rs/clap
- clap tutorial: https://docs.rs/clap/latest/clap/_tutorial/index.html
- cac: https://github.com/cacjs/cac
- picocolors: https://npmjs.com/package/picocolors
- bunup: https://npmjs.com/package/bunup
- Bun docs: https://bun.sh/docs
