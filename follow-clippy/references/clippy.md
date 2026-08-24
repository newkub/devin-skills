# Clippy (Rust Lint Tool) Reference

## Install

Clippy is included with the Rust toolchain via `rustup`:

```bash
rustup component add clippy
```

Verify:

```bash
cargo clippy --version
```

## Version Info

- Clippy ships with every Rust release (6-week cycle)
- Latest stable Rust: `1.98.0` (as of 2025)
- Total lints: 822 (stable)
- Lint groups: `default`, `cargo`, `complexity`, `correctness`, `nursery`, `pedantic`, `perf`, `restriction`, `style`, `suspicious`, `deprecated`

## Lint Categories and Default Levels

| Group | Default Level | Description |
|-------|--------------|-------------|
| `correctness` | `deny` | Catches bugs that are definitely wrong |
| `suspicious` | `warn` | Potential issues that may be bugs |
| `style` | `warn` | Code style consistency |
| `complexity` | `warn` | Simplify complex code |
| `perf` | `warn` | Performance optimizations |
| `restriction` | `allow` | Optional strict rules |
| `pedantic` | `allow` | Opinionated rules, prone to false positives |
| `nursery` | `allow` | Experimental lints |
| `cargo` | `warn` | Cargo manifest checks |

## Running Clippy

```bash
cargo clippy                              # Run Clippy on the current package
cargo clippy --all-targets                # Check all targets (tests, examples, benches)
cargo clippy --all-targets -- -D warnings # Treat all warnings as errors
cargo clippy --workspace                  # Run on all workspace members
cargo clippy -- -W clippy::pedantic       # Enable pedantic lints
cargo clippy --fix                        # Auto-fix machine-applicable lints
```

## Configuration via `clippy.toml`

Some lints can be configured in a TOML file named `clippy.toml` or `.clippy.toml`. Clippy searches starting from:
1. The directory specified by `CLIPPY_CONF_DIR` environment variable, or
2. The directory specified by `CARGO_MANIFEST_DIR`, or
3. The current directory.

If not found, Clippy walks up the directory tree until it finds one.

### Threshold Configuration

```toml
too-many-arguments-threshold = 7
type-complexity-threshold = 250
cognitive-complexity-threshold = 30
max-struct-bools = 3
max-fn-params-bools = 3
```

### Test Exceptions

```toml
allow-unwrap-in-tests = true
allow-panic-in-tests = true
allow-dbg-in-tests = true
allow-print-in-tests = true
allow-expect-in-tests = true
allow-mixed-uninlined-format-args = true
```

### MSRV Configuration

```toml
msrv = "1.30.0"
```

The MSRV can also be specified as an attribute:

```rust
#![clippy::msrv = "1.30.0"]
```

### Disallowed Names

```toml
disallowed-names = ["toto", "tata", "titi"]
```

Use `".."` to extend defaults instead of replacing:

```toml
disallowed-names = ["bar", ".."]
```

## Lint Attributes in Code

```rust
#![allow(clippy::all)]                              // Allow all warn-by-default lints
#![warn(clippy::all, clippy::pedantic)]             // Warn on all and pedantic
#![deny(clippy::single_match, clippy::box_vec)]     // Deny specific lints
#[allow(clippy::some_lint)]                         // Allow in a single function/module
```

## Lints Section in `Cargo.toml`

```toml
[lints.clippy]
enum_glob_use = "deny"
all = "warn"
pedantic = "warn"
nursery = "warn"
```

## Error Handling Lint Rules

```toml
[lints.clippy]
unwrap_used = "deny"
expect_used = "warn"
```

```toml
[lints.rust]
panic = "warn"
```

## Disabling Evaluation of Certain Code

Use conditional compilation to prevent Clippy from evaluating sections:

```rust
#[cfg(not(clippy))]
include!(concat!(env!("OUT_DIR"), "/my_big_function-generated.rs"));

#[cfg(clippy)]
fn my_big_function(_input: &str) -> Option<MyStruct> {
    None
}
```

## Source

- https://doc.rust-lang.org/clippy/configuration.html
- https://rust-lang.github.io/rust-clippy/
