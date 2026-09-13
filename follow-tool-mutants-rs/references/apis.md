# Tool Mutants Rs API & Dependencies

## Install

```sh
cargo install --locked cargo-mutants   # or: cargo binstall cargo-mutants
```

## Version

- Latest: `cargo-mutants` 27.1.0 / `mutants` (attribute crate) 0.0.4 (verified 2026-09-13)
- [Package Registry](https://crates.io/crates/cargo-mutants)
- [Repository](https://github.com/sourcefrog/cargo-mutants)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install cargo-mutants in project | latest version | --save-dev, --save, --global |
| `cargo-mutants` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://crates.io/crates/mutants
- Description: Decorator attributes to be used with cargo-mutants
