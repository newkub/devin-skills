# Tool Pitchfork API & Dependencies

## Install

```sh
mise use -g pitchfork
# or ตาม https://pitchfork.jdx.dev (brew, prebuilt binaries)
```

## Version

- Latest: `2.24.2` (verified 2026-09-11)
- [Registry](https://pitchfork.jdx.dev) — npm package `pitchfork` ไม่ใช่ตัวจริง
- [Repository](https://github.com/jdx/pitchfork)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install pitchfork in project | latest version | --save-dev, --save, --global |
| `pitchfork` | Run the pitchfork CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://pitchfork.jdx.dev
- Description: Daemon/process manager for project services by jdx
