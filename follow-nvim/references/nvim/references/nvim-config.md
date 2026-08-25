# Configuration

Configuration files and options for Neovim

## Config Files

| File | Path | Description |
|------|------|-------------|
| `init.lua` | `~/.config/nvim/` | Main Lua config |
| `init.vim` | `~/.config/nvim/` | Vimscript config |
| `init.yaml` | `~/.config/nvim/` | YAML config |

## init.lua Structure

```lua
-- ~/.config/nvim/init.lua

-- Options
vim.opt.number = true

-- Keymaps
vim.keymap.set('n', 'leader', ' ')

-- Plugins
require('plugins')
```

## Global Options

### General

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `clipboard` | string | `""` | Clipboard integration |
| `mouse` | string | `""` | Mouse support |
| `hidden` | boolean | `false` | Hide buffers |
| `history` | number | `10000` | Command history |

### UI

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `number` | boolean | `false` | Line numbers |
| `relativenumber` | boolean | `false` | Relative numbers |
| `cursorline` | boolean | `false` | Highlight cursor line |
| `signcolumn` | string | `"auto"` | Sign column |
| `termguicolors` | boolean | `false` | True colors |

### Indentation

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tabstop` | number | `8` | Tab width |
| `softtabstop` | number | `0` | Soft tab width |
| `shiftwidth` | number | `8` | Indent width |
| `expandtab` | boolean | `false` | Spaces |
| `autoindent` | boolean | `false` | Auto indent |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `XDG_CONFIG_HOME` | Config directory |
| `XDG_DATA_HOME` | Data directory |
| `XDG_STATE_HOME` | State directory |
| `MYVIMRC` | Init file path |

## API

### Get Options

```lua
vim.opt.number              -- boolean
vim.opt.tabstop             -- number
vim.opt.expandtab           -- boolean

-- Global option
vim.g.mapleader             -- any
vim.g.loaded_netrw          -- number
```

### Set Options

```lua
-- Lua style
vim.opt.number = true
vim.opt.tabstop = 2

-- Vim style
vim.cmd('set number')
vim.cmd('set tabstop=2')
```

## See Also

- [Installation](../knowledge/guide/installation.md) - Installation guide
- [CLI](./cli.md) - CLI commands
- [Configuration Guide](../knowledge/guide/configuration.md) - Configuration guide
