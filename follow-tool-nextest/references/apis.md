# Tool Nextest API & Dependencies

## Install

```sh
cargo install cargo-nextest --locked   # or: cargo binstall cargo-nextest --secure
```

## Version

- Latest: `cargo-nextest` 0.9.144 (verified 2026-09-13)
- Note: the `nextest` crate (0.1.1) is a stub — install `cargo-nextest` instead
- [Package Registry](https://crates.io/crates/cargo-nextest)
- [Repository](https://github.com/nextest-rs/nextest)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install cargo-nextest in project | latest version | --save-dev, --save, --global |
| `cargo-nextest` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://crates.io/crates/nextest
- Description: Stub crate, you likely want cargo-nextest instead
