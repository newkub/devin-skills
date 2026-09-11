# Tool Loc API & Dependencies

## Install

```sh
cargo install loc
# or download binary จาก https://github.com/cgag/loc/releases
```

## Version

- Latest: `0.5.0` (crates.io, verified 2026-09-11)
- [Package Registry](https://crates.io/crates/loc)
- [Repository](https://github.com/cgag/loc)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install loc in project | latest version | --save-dev, --save, --global |
| `loc` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://github.com/cgag/loc
- Description: lightweight simple translation module with dynamic json storage
