# cargo-nextest Reference

## Overview

cargo-nextest is a next-generation test runner for Rust, up to 3x faster than `cargo test`. It uses a process-per-test execution model for better isolation and reliability, with a modern interface, per-test customization, retries, timeouts, JUnit output, archiving, partitioning, and first-class CI support.

## Install

Install via `cargo-binstall` (recommended):

```bash
cargo binstall cargo-nextest --secure
```

Install from source via `cargo install` (requires `--locked`):

```bash
cargo install cargo-nextest --locked
```

Install from pre-built binaries:

Linux:
```bash
curl -LsSf https://get.nexte.st/latest/linux | tar zxf - -C ${CARGO_HOME:-~/.cargo}/bin
```

macOS:
```bash
curl -LsSf https://get.nexte.st/latest/mac | tar zxf - -C ${CARGO_HOME:-~/.cargo}/bin
```

Windows (PowerShell):
```powershell
$tmp = New-TemporaryFile | Rename-Item -NewName { $_ -replace 'tmp$', 'zip' } -PassThru
Invoke-WebRequest -OutFile $tmp https://get.nexte.st/latest/windows
$outputDir = if ($Env:CARGO_HOME) { Join-Path $Env:CARGO_HOME "bin" } else { "~/.cargo/bin" }
$tmp | Expand-Archive -DestinationPath $outputDir -Force
$tmp | Remove-Item
```

Windows (winget):
```bash
winget install nextest.cargo-nextest
```

Self-update to the latest version:
```bash
cargo nextest self-update
```

## Version Info

- Latest stable: `0.9.143`
- License: `Apache-2.0`
- MSRV to build: `Rust 1.91`
- MSRV to run tests: `Rust 1.41`
- Source: https://nexte.st

## Peer Dependencies

- Rust toolchain (stable, managed via `rustup`)
- `cargo` build system
- Optional: `cargo-binstall` for binary install
- Optional: `cargo-llvm-cov` for test coverage integration

## Configuration

cargo-nextest uses repository-specific configuration at `.config/nextest.toml` from the Cargo workspace root. The location can be overridden with `--config-file`. Repository config is checked into version control and shared across all users. Personal preferences go in user config at `~/.config/nextest/config.toml`.

### Basic configuration with CI profile

```toml
[profile.ci]
# Run all tests regardless of failures
fail-fast = false
```

### Profile inheritance

```toml
[profile.ci]
fail-fast = false
slow-timeout = "60s"

[profile.ci-extended]
inherits = "ci"
slow-timeout = "300s"
```

All custom profiles inherit from `default` unless `inherits` specifies otherwise. The `default` profile cannot inherit from another profile.

### Retry and timeout configuration

```toml
[profile.default]
retries = 0
slow-timeout = "60s"
leak-timeout = "100ms"
```

### Test threads and failure handling

```toml
[profile.default]
test-threads = 4
fail-fast = true
# Or with max-fail:
# fail-fast = { max-fail = 5 }
```

### JUnit report configuration

```toml
[profile.ci]
junit.path = "junit.xml"
junit.report-name = "ci"
junit.store-success-output = true
junit.store-failure-output = true
```

### Hierarchical configuration resolution

Configuration is resolved in this order (higher overrides lower):
1. Command-line arguments (e.g. `--retries=3`)
2. Environment variables (e.g. `NEXTEST_RETRIES=4`)
3. Per-test overrides
4. Profile-specific configuration in `.config/nextest.toml`
5. Tool-specific configuration (via `--tool-config-file`)
6. Inheritance chain (always terminates at `default`)
7. Default embedded configuration

## CLI Commands

```bash
# Build and run all tests in the workspace
cargo nextest run

# Run tests for a specific package
cargo nextest run -p my-package

# Run tests matching names
cargo nextest run <test-name1> <test-name2>

# Run with a specific profile
cargo nextest run --profile ci

# Do not exit on first failure (alias --nff)
cargo nextest run --no-fail-fast

# Stop after N failures
cargo nextest run --max-fail=5

# List all tests in the workspace
cargo nextest list

# List tests with verbose output (binary paths, skipped tests)
cargo nextest list --verbose

# Run doctests separately (nextest does not support doctests)
cargo test --doc

# Show help for repository configuration
cargo nextest help repo-config

# Self-update to latest version
cargo nextest self-update
```

## CI Integration

GitHub Actions:
```yaml
- name: Run tests
  run: cargo nextest run --profile ci
```

Install via `cargo-binstall` in CI:
```yaml
- name: Install cargo-nextest
  run: cargo binstall cargo-nextest --secure
```

## Notes

- Doctests are not supported due to stable Rust limitations; run them separately with `cargo test --doc`
- Avoid naming custom profiles starting with `default-` to prevent conflicts with future embedded profiles
- Use `--no-fail-fast` or `--profile ci` with `fail-fast = false` in CI to run all tests regardless of failures
- Within the `0.9.x` series, the public API is append-only per the stability policy

## Source

- https://nexte.st/
- https://nexte.st/docs/installation/pre-built-binaries/
- https://nexte.st/docs/installation/from-source/
- https://nexte.st/docs/installation/updating/
- https://nexte.st/docs/running/
- https://nexte.st/docs/listing/
- https://nexte.st/docs/configuration/
- https://nexte.st/docs/configuration/reference/
- https://nexte.st/docs/stability/
- https://crates.io/crates/cargo-nextest
- https://github.com/nextest-rs/nextest
