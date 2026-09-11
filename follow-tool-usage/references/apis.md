# Tool Usage API & Dependencies

## Install

```sh
mise use -g usage
# or
mise use usage
```

## Version

- Latest: `6.8.0` (usage CLI โดย jdx, verified 2026-09-11)
- [Registry](https://usage.jdx.dev) — npm package `usage` ไม่ใช่ตัวจริง
- [Repository](https://github.com/jdx/usage)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install usage in project | latest version | --save-dev, --save, --global |
| `usage` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://usage.jdx.dev
- Description: CLI spec tool by jdx — generate completions/docs/SDK from usage.kdl
