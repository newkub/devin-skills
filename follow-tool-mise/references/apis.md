# Tool Mise API & Dependencies

## Install

```sh
# mise เป็น system tool — install ตาม https://mise.jdx.dev/getting-started.html
winget install jdx.mise
# or
scoop install mise
```

## Version

- Latest: `2026.9.5` (verified 2026-09-11)
- [Registry](https://mise.jdx.dev) — npm package `mise` ไม่ใช่ตัวจริง
- [Repository](https://github.com/jdx/mise)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install mise in project | latest version | --save-dev, --save, --global |
| `mise` | Run the mise CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://mise.jdx.dev
- Description: Dev tools, env vars, and tasks in one CLI
