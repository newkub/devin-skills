# Tool Nvim API & Dependencies

## Install

```sh
bun add -D neovim
# or
npm install --save-dev neovim
```

## Version

- Latest: 5.4.0
- [Package Registry](https://www.npmjs.com/package/neovim)
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
