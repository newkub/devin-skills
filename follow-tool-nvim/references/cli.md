# Neovim CLI

## Install

```sh
bun add -D neovim # or system package manager
```

## Version

- Latest
- Repository: https://github.com/neovim/neovim
- Docs: https://neovim.io/doc/user/starting.html

## Commands

| commands | description | default | options |
|---|---|---|---|
| `nvim` | Start editor | — | -u, --cmd, -S, -c, --startuptime |
| `nvim <file>` | Open file | — | +<cmd>, -o, -O, -p, -d, -R |
| `nvim --version` | Print version | — | (none) |
| `nvim --headless` | Run headless | — | +<cmd>, -c, -u |
## Examples

```sh
nvim init.lua
```
```sh
nvim --headless -c "Lazy sync" -c "qa"
```
