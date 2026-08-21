# Configuration

## Configuration Files

| File | Description |
|------|-------------|
| `init.lua` | Main Lua config (recommended) |
| `init.vim` | Vimscript config |
| `init.yaml` | YAML config (deprecated) |

## Basic init.lua

```lua
-- Set options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.termguicolors = true

-- Key mappings
vim.keymap.set('n', '<leader>w', '<cmd>w<cr>')
vim.keymap.set('n', '<leader>q', '<cmd>q<cr>')

-- Set leader key
vim.g.mapleader = ' '
vim.g.maplocalleader = ' '
```

## Essential Options

### General

```lua
vim.opt.clipboard = 'unnamedplus'  -- System clipboard
vim.opt.mouse = 'a'                -- Mouse support
vim.opt.hidden = true              -- Hide buffers
vim.opt.wildmenu = true            -- Command completion
```

### UI

```lua
vim.opt.number = true              -- Line numbers
vim.opt.relativenumber = true      -- Relative numbers
vim.opt.cursorline = true          -- Highlight cursor line
vim.opt.signcolumn = 'yes'         -- Sign column
vim.opt.splitright = true          -- Split right
vim.opt.splitbelow = true           -- Split below
```

### Indentation

```lua
vim.opt.tabstop = 2                -- Tab size
vim.opt.softtabstop = 2            -- Soft tab
vim.opt.shiftwidth = 2             -- Indent width
vim.opt.expandtab = true           -- Spaces
vim.opt.autoindent = true          -- Auto indent
```

## Plugin Manager

### lazy.nvim (Recommended)

```lua
-- ~/.config/nvim/lua/plugins/init.lua
return {
  {
    'nvim-telescope/telescope.nvim',
    dependencies = { 'nvim-lua/plenary.nvim' }
  },
  {
    'neovim/nvim-lspconfig',
    config = function()
      require('lspconfig').tsserver.setup({})
    end
  }
}
```

## LSP Configuration

```lua
-- Set up built-in LSP
local lspconfig = require('lspconfig')

lspconfig.lua_ls.setup {
  settings = {
    Lua = {
      diagnostics = {
        globals = { 'vim' }
      }
    }
  }
}
```

## Keymappings

```lua
-- Better window navigation
vim.keymap.set('n', '<C-h>', '<C-w>h')
vim.keymap.set('n', '<C-j>', '<C-w>j')
vim.keymap.set('n', '<C-k>', '<C-w>k')
vim.keymap.set('n', '<C-l>', '<C-w>l')

-- Resize windows
vim.keymap.set('n', '<C-Up>', ':resize +2<CR>')
vim.keymap.set('n', '<C-Down>', ':resize -2<CR>')
vim.keymap.set('n', '<C-Left>', ':vertical resize -2<CR>')
vim.keymap.set('n', '<C-Right>', ':vertical resize +2<CR>')
```

## See Also

- [Installation](./installation.md) - Installation guide
- [CLI](../references/cli.md) - CLI commands
- [API](../references/api.md) - Lua API