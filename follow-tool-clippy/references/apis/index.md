# Tool Clippy API & Dependencies

## Install

```sh
cargo add clippy
```

## Version

- Latest: 0.0.0
- [Package Registry](https://www.npmjs.com/package/clippy)
- [Repository](https://github.com/rust-lang/rust-clippy)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install clippy in project | latest version | --save-dev, --save, --global |
| `clippy` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://doc.rust-lang.org/clippy
- Description: a CLI library for filters
