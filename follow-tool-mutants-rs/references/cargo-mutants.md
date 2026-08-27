# cargo-mutants (Mutation Testing for Rust) Reference

## Install

Install from source:

```bash
cargo install --locked cargo-mutants
```

Or use `cargo-binstall` for prebuilt binaries:

```bash
cargo binstall cargo-mutants
```

Binaries are also attached to GitHub releases.

## Version Info

- Repository: https://github.com/sourcefrog/cargo-mutants
- Manual: https://mutants.rs/
- Requires a reasonably recent stable (or nightly/beta) Rust toolchain to build
- Can run tests under any toolchain, even old ones, using the `+` option

## Prerequisites

The project must have reliable, non-flaky tests that run under `cargo test` or `cargo nextest`:

```bash
cargo test
# or
cargo nextest run
```

Cross-compilation is not supported. The tree must be buildable on the host platform.

## Quick Start

Run in a Rust source directory:

```bash
cargo mutants
```

Generate mutants in only one file:

```bash
cargo mutants -f src/something.rs
```

Run with a specific toolchain:

```bash
cargo +1.48 mutants
```

## Example Output

```
Found 14 mutants to test
Copy source to scratch directory ... 0 MB in 0.0s
Unmutated baseline ... ok in 1.6s build + 0.3s test
Auto-set test timeout to 20.0s
src/lib.rs:386: replace <impl Error for Error>::source -> Option<&(dyn std::error::Error + 'static)> with Default::default() ... NOT CAUGHT in 0.6s build + 0.3s test
src/lib.rs:485: replace copy_symlink -> Result<()> with Ok(Default::default()) ... NOT CAUGHT in 0.5s build + 0.3s test
14 mutants tested in 0:08: 2 missed, 9 caught, 3 unviable
```

## Mutant Outcomes

- `caught`: A test failed with this mutant applied. Good sign about test coverage.
- `missed`: No test failed with this mutation applied. Indicates a gap in test coverage.
- `unviable`: The attempted mutation does not compile. Inconclusive, no action needed.
- `timeout`: The mutation caused the test suite to hang. Investigate or skip the function.

By default only missed mutants and timeouts are printed to stdout. Show others with:

```bash
cargo mutants --caught
cargo mutants --unviable
```

## Configuration with `mutants.toml`

```toml
[mutants]
timeout = 20.0
```

## Skipping with `#[mutants::skip]`

Add a dependency on the `mutants` crate (version `0.0.3`+). This must be a regular `dependency`, not a `dev-dependency`:

```toml
[dependencies]
mutants = "0.0.3"
```

Mark items to skip:

```rust
/// Returns true if the program should stop
#[cfg_attr(test, mutants::skip)] // Returning false would cause a hang
fn should_stop() -> bool {
    true
}
```

`#[mutants::skip]` can be placed on:
- Functions
- `impl` blocks
- `trait` blocks
- `mod` blocks
- Files (as inner attribute `#![mutants::skip]`)
- `const` and `static` items
- Expressions that can carry an outer attribute

## Excluding Specific Mutations

Use `#[mutants::exclude_re("pattern")]` (requires `mutants` crate `0.0.5`+):

```rust
#[mutants::exclude_re("with 0")]
fn do_something(x: i32) -> i32 {
    x + 1
}
```

Multiple attributes can be applied:

```rust
#[mutants::exclude_re("with 0")]
#[mutants::exclude_re("with 1")]
fn compute(a: i32, b: i32) -> i32 {
    a + b
}
```

## Iterating on Coverage

After addressing missed mutants, re-test only changed files:

```bash
cargo mutants --file src/something.rs
```

Preview all filters with `--list`:

```bash
cargo mutants --list
```

## CI Integration

```yaml
- name: Run mutation testing
  run: cargo mutants
```

For incremental testing of pull requests and full testing of the development branch, see the manual at https://mutants.rs/ci.html.

## CLI Commands

```bash
cargo mutants                    # Run mutation testing
cargo mutants -f src/file.rs     # Test mutants in one file
cargo mutants --caught           # Show caught mutants
cargo mutants --unviable         # Show unviable mutants
cargo mutants --list             # List mutants without running
cargo mutants --diff             # Show diffs of applied mutations
cargo +1.48 mutants              # Use a specific toolchain
```

## Source

- https://mutants.rs/
- https://mutants.rs/installation.html
- https://mutants.rs/getting-started.html
- https://mutants.rs/using-results.html
- https://mutants.rs/skip.html
- https://mutants.rs/attrs.html
- https://github.com/sourcefrog/cargo-mutants
