# usage-cli Reference

## Overview

Usage is a spec, CLI, and Rust framework for defining command-line interfaces. Arguments, flags, environment variables, and config files can all be described in a portable KDL spec. Think of it as OpenAPI for CLIs: one declaration can drive parsing and every user-facing artifact — shell completions, markdown documentation, manpages, type-safe SDKs, and more.

## Install

```bash
# mise-en-place (recommended)
mise use -g usage
# Cargo
cargo install usage-cli
cargo binstall usage-cli    # faster binary install
# Homebrew
brew install usage
# Arch Linux
pacman -S usage
```

Verify: `usage --version`

## Version Info

- Latest stable: `6.4.0`
- License: MIT
- Source: https://github.com/jdx/usage

## Peer Dependencies

No peer dependencies. The `usage` CLI is a standalone Rust binary. For Rust framework integration, add `usage-rs`:

```toml
[dependencies]
usage = { package = "usage-rs", version = "6" }
```

## Usage Spec Format

Usage specs are written in KDL, a document language combining the best of XML and JSON. The spec file is typically named `usage.kdl` or `cli.usage.kdl`.

### Metadata nodes

```kdl
name "My CLI"        // a friendly name for the CLI
bin "mycli"          // the name of the binary
about "some help"    // a short description of the CLI
version "1.0.0"      // the version of the CLI
author "nobody"      // the author of the CLI
license "MIT"        // license the CLI is released under
```

### Flags

```kdl
flag "-f --force"   help="Always do the thing"
flag "-v --version" help="Print the CLI version"
flag "-h --help"    help="Print the CLI help"
flag "-u --user <user>" help="User to run as"
flag "-v --verbose" help="Enable verbose logging" global=#true count=#true
flag "--clear" effect="destructive" help="Delete stored logs"
```

Key flag properties:
- `global=#true` — can be set on any subcommand
- `count=#true` — counts occurrences (e.g. `-vvv` = 3)
- `required=#true` — invocation must provide a value
- `default="value"` — default value for flag
- `effect="destructive"` — raises command effect when supplied
- `var=#true` — flag can be repeated
- `hide=#true` — hide from docs and completions
- `env="VAR_NAME"` — backed by an environment variable
- `negate="--no-color"` — creates a negation flag

### Arguments

```kdl
arg "<dir>"  help="The directory to use"     // required positional
arg "[file]" help="The file to read"         // optional positional
arg "<file>..."                              // variadic (shorthand for var=#true)
arg "<file>" default="file.txt"              // default value
arg "<file>" env="MY_FILE"                   // backed by env var
arg "<output>" effect="write"                // raises command effect when supplied
```

### Commands

```kdl
cmd "config" help="Manage the CLI config" {
  cmd "add" help="Add/set a config" {
    alias "set"
    arg "<key>" help="The key for the config"
    arg "<value>" help="The new config value"
    flag "-f --force" help="Overwrite existing config"
  }
  cmd "remove" help="Remove a thing" {
    alias "rm"
    alias "delete" hide=#true
    arg "<name>" help="The name of the thing"
  }
  cmd "list" help="List all things"
}
```

Key command properties:
- `hide=#true` — hide from docs and completions
- `subcommand_required=#true` — subcommand is not optional
- `effect="read|write|destructive"` — declares what running it does
- `deprecated="use build"` — marks command as deprecated

### Command effects

| Effect | Meaning |
|---|---|
| `read` | Only inspects state. Running it twice is the same as running it once |
| `write` | Creates or modifies state, but removes nothing the user cannot recreate |
| `destructive` | May delete or irreversibly overwrite something. Deserves a confirmation prompt |

`effect` is not inherited by subcommands. A command with no `effect` is unknown, not safe.

### Config binding

```kdl
flag "-u --user <user>" help="User to run as"
config {
  file ".mycli.toml" findup=#true
  prop "settings.user" type="string" default="admin" {
    cli "--user"
    env "MYCLI_USER"
  }
}
```

Priority: CLI flag > env var > config file > default.

## CLI Commands

### Top-level

```bash
usage --version              # Print version
usage --help                 # Print help
usage --usage-spec           # Output a usage.kdl spec for usage CLI itself
usage --completions bash     # Output completions for the usage CLI itself
```

### generate (alias: g)

Generate completions, documentation, and other artifacts from usage specs.

```bash
# Shell completions (bash, fish, nu, powershell, zsh)
usage generate completion bash mycli -f usage.kdl
usage generate completion zsh mycli -f usage.kdl --install

# Shell init script for usage shebang scripts (bash, fish, zsh)
usage generate completion-init bash

# Markdown documentation
usage generate markdown -f usage.kdl
usage generate markdown -f usage.kdl -m --out-dir ./docs

# Manpage
usage generate manpage -f usage.kdl -o mycli.1

# JSON representation of spec
usage generate json -f usage.kdl

# JSON Schema for config file
usage generate json-schema -f usage.kdl

# Fig completion spec
usage generate fig -f usage.kdl

# Go parse tables
usage generate go -f usage.kdl -o tables.go

# Type-safe SDK (typescript, python)
usage generate sdk -l typescript -o ./sdk -f usage.kdl
usage generate sdk -l python -o ./sdk -f usage.kdl
```

### lint

```bash
usage lint usage.kdl              # Lint a usage spec for common issues
usage lint usage.kdl -f json      # Output as JSON
usage lint usage.kdl -W           # Treat warnings as errors
usage lint usage.kdl --sorted     # Also check sorted order
```

### Other subcommands

```bash
usage exec <command> <bin> [args]...   # Execute script with parsed args (alias: x)
usage mcp -f mycli.usage.kdl           # Serve spec over MCP (alias: mcp-server)
usage bash <script> [args]...         # Run usage shebang script with bash
usage zsh <script> [args]...          # Run usage shebang script with zsh
usage fish <script> [args]...         # Run usage shebang script with fish
usage powershell <script> [args]...   # Run usage shebang script with powershell
usage diff <old> <new>                # Compare two usage specs
usage explain [argv]...               # Explain a command line against a spec
usage complete-word [words]...        # Complete current word (used by completion scripts)
```

## SDK Generation

Generate type-safe SDK client libraries from a Usage spec. The generated SDK is a subprocess wrapper — it invokes your CLI binary via `subprocess.run` (Python) or `child_process.spawn` (TypeScript).

| Language | Flag | Output Files |
|---|---|---|
| TypeScript | `-l typescript` | `types.ts`, `client.ts`, `runtime.ts`, `index.ts` |
| Python | `-l python` | `types.py`, `client.py`, `runtime.py`, `__init__.py` |
| Rust | Coming soon | |

Optional SDK flags: `-p --package-name <NAME>` (override package name), `--spec <SPEC>` (raw string spec input).

## Framework Integrations

Usage can scaffold a spec into existing CLI frameworks:

- clap (Rust) — `spec/integrations/clap`
- cobra, kong, urfave/cli (Go)
- commander.js, oclif, yargs (Node.js)
- argparse, typer, click (Python)
- picocli, JCommander (Java)
- Clikt (Kotlin)
- OptionParser (Ruby)

## Source

- https://usage.jdx.dev/
- https://usage.jdx.dev/cli/
- https://usage.jdx.dev/spec/
- https://usage.jdx.dev/cli/reference/
- https://usage.jdx.dev/cli/reference/generate
- https://usage.jdx.dev/cli/reference/generate/completion
- https://usage.jdx.dev/cli/reference/generate/markdown
- https://usage.jdx.dev/cli/reference/generate/sdk
- https://usage.jdx.dev/cli/reference/lint
- https://usage.jdx.dev/cli/reference/mcp
- https://usage.jdx.dev/spec/reference/arg
- https://github.com/jdx/usage
