---
title: Extensibility Principles
description: หลักการขยายความสามารถ Neovim ด้วย Plugins และ Lua
---

## Goal

ขยายความสามารถ Neovim ด้วย plugins, Lua scripts, และ custom configurations

## Scope

ใช้สำหรับการพัฒนา plugins, Lua scripts, และ custom configurations

## Execute

### 1. Plugin Management

#### Plugin Managers

ตาราง plugin managers ที่นิยม:

| Manager | Description | Features |
|---------|-------------|----------|
| `lazy.nvim` | Modern plugin manager | Lazy loading, profiling |
| `packer.nvim` | Lua plugin manager | Async, declarative |
| `vim-plug` | Vimscript plugin manager | Simple, lightweight |
| `paq-nvim` | Minimal plugin manager | Fast, simple |

#### Using lazy.nvim

ติดตั้งและใช้ lazy.nvim:

```lua
-- Install lazy.nvim
local lazypath = vim.fn.stdpath('data') .. '/lazy/lazy.nvim'
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    'git',
    'clone',
    '--filter=blob:none',
    'https://github.com/folke/lazy.nvim.git',
    '--branch=stable',
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

-- Setup plugins
require('lazy').setup({
  spec = {
    -- Add plugins here
    { 'nvim-lualine/lualine.nvim' },
    { 'nvim-telescope/telescope.nvim' },
  },
})
```

### 2. Lua Configuration

#### Init.lua Structure

โครงสร้าง init.lua:

```lua
-- 1. Basic settings
vim.opt.number = true
vim.opt.relativenumber = true

-- 2. Keybindings
vim.keymap.set('n', '<leader>w', ':w<CR>')

-- 3. Autocommands
vim.api.nvim_create_autocmd('BufWritePre', {
  callback = function()
    -- Format on save
  end,
})

-- 4. Plugin setup
require('plugins')
```

#### Modular Configuration

แยก configuration เป็น modules:

```lua
-- lua/config/options.lua
return {
  number = true,
  relativenumber = true,
}

-- lua/config/keymaps.lua
local keymap = vim.keymap.set
keymap('n', '<leader>w', ':w<CR>')

-- init.lua
local options = require('config.options')
for k, v in pairs(options) do
  vim.opt[k] = v
end
```

### 3. Plugin Development

#### Basic Plugin Structure

โครงสร้าง plugin พื้นฐาน:

```lua
-- plugin/myplugin.vim
if exists('g:loaded_myplugin')
  finish
endif
let g:loaded_myplugin = 1

" Plugin commands
command! MyCommand lua require('myplugin').run()
```

#### Lua Plugin

สร้าง Lua plugin:

```lua
-- lua/myplugin/init.lua
local M = {}

function M.setup(opts)
  -- Setup configuration
  M.config = vim.tbl_extend('force', {
    option = 'default',
  }, opts or {})
end

function M.run()
  print('MyPlugin running')
end

return M
```

### 4. API Usage

#### Buffer API

ใช้ buffer API:

```lua
-- Get current buffer
local buf = vim.api.nvim_get_current_buf()

-- Get buffer lines
local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)

-- Set buffer lines
vim.api.nvim_buf_set_lines(buf, 0, -1, false, { 'Hello', 'World' })
```

#### Window API

ใช้ window API:

```lua
-- Get current window
local win = vim.api.nvim_get_current_win()

-- Get window position
local pos = vim.api.nvim_win_get_position(win)

-- Set window height
vim.api.nvim_win_set_height(win, 20)
```

#### Command API

สร้าง custom commands:

```lua
vim.api.nvim_create_user_command('MyCommand', function(opts)
  print('Args:', opts.args)
  print('Range:', opts.line1, opts.line2)
end, {
  nargs = '?',
  range = true,
  complete = 'file',
})
```

### 5. Autocommand Development

#### Lua Autocommands

สร้าง autocommands ด้วย Lua:

```lua
local mygroup = vim.api.nvim_create_augroup('MyGroup', { clear = true })

vim.api.nvim_create_autocmd('BufRead', {
  group = mygroup,
  pattern = '*.lua',
  callback = function()
    print('Lua file opened')
  end,
})
```

### 6. Keybinding Development

#### Keymap API

สร้าง keybindings:

```lua
-- Normal mode
vim.keymap.set('n', '<leader>w', ':w<CR>')

-- Insert mode
vim.keymap.set('i', '<C-s>', '<Esc>:w<CR>a')

-- Visual mode
vim.keymap.set('v', '<leader>y', '"+y')

-- Command mode
vim.keymap.set('c', '<C-a>', '<Home>')
```

#### Which-key

ใช้ which-key สำหรับ keybinding help:

```lua
local wk = require('which-key')

wk.register({
  ['<leader>f'] = { name = 'File' },
  ['<leader>ff'] = { '<cmd>Telescope find_files<cr>', 'Find files' },
  ['<leader>fg'] = { '<cmd>Telescope live_grep<cr>', 'Grep' },
})
```

### 7. LSP Extensions

#### Custom LSP Handlers

สร้าง custom LSP handlers:

```lua
lspconfig.tsserver.setup({
  handlers = {
    ['textDocument/publishDiagnostics'] = function(_, result, ctx)
      -- Custom diagnostic handling
    end,
  },
})
```

#### Custom LSP Commands

สร้าง custom LSP commands:

```lua
vim.api.nvim_create_user_command('LspRename', function()
  vim.lsp.buf.rename()
end, {})
```

### 8. UI Extensions

#### Floating Windows

สร้าง floating windows:

```lua
local function open_float()
  local buf = vim.api.nvim_create_buf(false, true)
  local win = vim.api.nvim_open_win(buf, true, {
    relative = 'editor',
    width = 80,
    height = 20,
    row = 10,
    col = 10,
    style = 'minimal',
    border = 'rounded',
  })
end
```

#### Statusline

สร้าง custom statusline:

```lua
require('lualine').setup({
  sections = {
    lualine_a = { 'mode' },
    lualine_b = { 'filename' },
    lualine_c = { 'branch' },
  },
})
```

### 9. Testing

#### Plugin Testing

ทดสอบ plugins:

```lua
-- Using plenary.nvim
describe('myplugin', function()
  it('should do something', function()
    -- Test code
  end)
end)
```

### 10. Distribution

#### Publish Plugin

เผยแพร่ plugin:

1. สร้าง repository บน GitHub
2. เพิ่ม documentation
3. เพิ่ม tags/releases
4. ใช้ใน init.lua ด้วย URL

## Rules

- ใช้ lazy loading สำหรับ plugins
- แยก configuration เป็น modules
- ใช้ Lua API สำหรับ programmatic control
- ทดสอบ plugins อย่างสม่ำเสมอ

## Expected Outcome

- Plugins ทำงานได้อย่างถูกต้อง
- Configuration ที่ organized
- Custom features ที่ extend Neovim
- Plugin ที่ reusable และ shareable
