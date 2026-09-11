# Tool Hk API & Dependencies

## Install

```sh
mise use -g hk
# or ตาม https://hk.jdx.dev/getting_started.html (brew, cargo-binstall)
```

## Version

- Latest: `1.58.1` (verified 2026-09-11)
- [Registry](https://hk.jdx.dev) — npm package `hk` ไม่ใช่ตัวจริง
- [Repository](https://github.com/jdx/hk)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install hk in project | latest version | --save-dev, --save, --global |
| `hk` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://hk.jdx.dev
- Description: Git hooks manager by jdx (alternative to Lefthook/pre-commit)
