# Tool Nvim API & Dependencies

## Install

```sh
# Neovim เป็น system binary — ไม่ใช่ npm package
winget install Neovim.Neovim
# or
scoop install neovim
# or mise use -g neovim
```

## Version

- Latest: `0.12.5` (verified 2026-09-11)
- [Registry](https://neovim.io) — npm package `neovim` ไม่ใช่ตัวจริง
- [Repository](https://github.com/neovim/neovim)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install neovim in project | latest version | --save-dev, --save, --global |
| `neovim-node-host` | Run the neovim-node-host CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://neovim.io
- Description: Nvim msgpack API client and remote plugin provider
