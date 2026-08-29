# Cargo Clippy CLI

## Install

```sh
rustup component add clippy
```

## Version

- Latest with Rust
- Repository: https://github.com/rust-lang/rust-clippy
- Docs: https://doc.rust-lang.org/clippy/usage.html

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `cargo clippy` | Run clippy on current package | -- -W clippy::all, -- -D warnings, --all-targets, --all-features |
| `cargo clippy --fix` | Apply auto-fixable suggestions | --allow-dirty, --allow-staged, --broken-code |
| `cargo clippy --tests` | Lint tests | -- -D clippy::pedantic |
## Examples

```sh
cargo clippy -- -D warnings
```
```sh
cargo clippy --fix --allow-dirty
```
