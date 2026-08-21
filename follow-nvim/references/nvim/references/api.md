# Programmatic API

Neovim Lua API for scripting and plugins

## Lua Basics

```lua
-- Print
print("Hello")

-- Variables
local name = "Neovim"
local count = 42
```

## Vim API

### Options

```lua
vim.opt.number = true           -- Set option
vim.opt.number                 -- Get option value
vim.opt.tabstop = {2, 4}      -- Array option

-- Global
vim.g.mapleader = " "
vim.g.loaded_netrw = 1
```

### Commands

```lua
vim.cmd("edit file.txt")       -- Execute command
vim.cmd("set number")          -- Set option
vim.cmd("highlight! link DiffText Error")  -- Highlight
```

## Buffer API

```lua
-- Current buffer
local buf = vim.api.nvim_get_current_buf()

-- Buffer methods
vim.api.nvim_buf_get_lines(buf, 0, -1, false)
vim.api.nvim_buf_set_lines(buf, 0, -1, false, {"line"})
vim.api.nvim_buf_set_var(buf, "my_var", "value")
```

## Window API

```lua
-- Current window
local win = vim.api.nvim_get_current_win()

-- Window methods
vim.api.nvim_win_get_cursor(win)
vim.api.nvim_win_set_cursor(win, {row, col})
vim.api.nvim_win_set_height(win, 20)
```

## Tabpage API

```lua
-- Current tabpage
local tab = vim.api.nvim_get_current_tabpage()

-- Tabpage methods
vim.api.nvim_tabpage_list_wins(tab)
vim.api.nvim_tabpage_get_var(tab, "my_var")
```

## Keymap API

```lua
-- Set keymap
vim.keymap.set('n', '<leader>f', function()
  print("Pressed")
end)

-- Set with options
vim.keymap.set('n', 'gd', vim.lsp.buf.definition, {
  buffer = true,
  silent = true
})
```

## Autocmd API

```lua
-- Create autocmd
vim.api.nvim_create_autocmd("BufEnter", {
  pattern = "*.lua",
  callback = function(args)
    print("Entered: " .. args.file)
  end
})

-- Group
vim.api.nvim_create_augroup("MyGroup", { clear = true })
vim.api.nvim_create_autocmd("BufEnter", {
  group = "MyGroup",
  callback = function() end
})
```

## LSP API

```lua
-- Setup LSP
local lspconfig = require('lspconfig')
lspconfig.tsserver.setup {}

-- LSP methods
vim.lsp.buf.definition()
vim.lsp.buf.hover()
vim.lsp.buf.rename()
vim.lsp.buf.format()
```

## Examples

```lua
-- Create a function
local function greet(name)
  print("Hello, " .. name)
end

greet("Neovim")

-- Table operations
local config = {
  key = "value",
  numbers = {1, 2, 3}
}
config.key = "new value"
table.insert(config.numbers, 4)
```

## See Also

- [Configuration](../guide/configuration.md) - Configuration options
- [Installation](../guide/installation.md) - Installation guide
