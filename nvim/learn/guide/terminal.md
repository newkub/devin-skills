---
title: Terminal Guide
description: คู่มือการใช้งาน Terminal Emulator ใน Neovim
---

## Goal

ใช้งาน Terminal Emulator ใน Neovim เพื่อ run shells, debuggers, และ interactive processes ภายใน editor

## Scope

ใช้สำหรับการเปิด terminal, configuration, และ integration กับ workflows

## Execute

### 1. What is Terminal Emulator?

Neovim มี built-in terminal emulator ที่ใช้ `libvterm`:

- **Run shells**: bash, zsh, fish
- **Run debuggers**: gdb, lldb
- **Run tests**: pytest, jest
- **Run REPLs**: python, node, irb
- **Integration**: ใช้ร่วมกับ buffers และ windows

### 2. Opening Terminal

เปิด terminal ด้วย command:

```vim
:terminal
```

หรือใช้ Lua API:

```lua
-- Open terminal in current buffer
vim.cmd('terminal')

-- Open terminal in new buffer
vim.cmd('vsplit | terminal')

-- Open terminal with specific command
vim.cmd('terminal bash')
```

### 3. Terminal Modes

Terminal มี 2 modes:

**Terminal Mode**:
- Input ถูกส่งไปยัง process
- Enter ด้วย `i`, `I`, `a`, `A`, หรือ `:startinsert`
- Exit ด้วย `<C-\><C-N>`

**Normal Mode**:
- Input ถูก interpret เป็น Vim commands
- Default mode เมื่อไม่ได้อยู่ใน terminal mode

### 4. Keybindings

ตั้งค่า keybindings สำหรับ terminal:

```lua
-- Toggle terminal
local function toggle_terminal()
  if vim.fn.bufexists('term://') == 1 then
    vim.cmd('close')
  else
    vim.cmd('terminal')
  end
end

vim.keymap.set('n', '<leader>t', toggle_terminal, { desc = 'Toggle terminal' })

-- Exit terminal mode
vim.keymap.set('t', '<Esc>', '<C-\\><C-N>', { desc = 'Exit terminal mode' })
```

### 5. Terminal Configuration

ตั้งค่า terminal options:

```lua
-- Set shell
vim.opt.shell = 'bash'

-- Set terminal options
vim.opt.termguicolors = true

-- Set scrollback
vim.opt.scrollback = 10000
```

### 6. Split Terminal

เปิด terminal ใน splits:

```lua
-- Horizontal split
vim.cmd('split | terminal')

-- Vertical split
vim.cmd('vsplit | terminal')

-- New tab
vim.cmd('tabnew | terminal')
```

### 7. Floating Terminal

สร้าง floating terminal:

```lua
local function open_float_term()
  local buf = vim.api.nvim_create_buf(false, true)
  local width = math.floor(vim.o.columns * 0.8)
  local height = math.floor(vim.o.lines * 0.8)
  local row = math.floor((vim.o.lines - height) / 2)
  local col = math.floor((vim.o.columns - width) / 2)

  vim.api.nvim_open_win(buf, true, {
    relative = 'editor',
    width = width,
    height = height,
    row = row,
    col = col,
    style = 'minimal',
    border = 'rounded',
  })

  vim.fn.termopen('bash')
  vim.cmd('startinsert')
end

vim.keymap.set('n', '<leader>ft', open_float_term, { desc = 'Float terminal' })
```

### 8. Terminal API

ใช้ `nvim_open_term()` API:

```lua
local buf = vim.api.nvim_create_buf(false, true)
local chan = vim.fn.termopen('bash', {
  on_stdout = function(_, data, _)
    print('stdout:', table.concat(data, '\n'))
  end,
  on_stderr = function(_, data, _)
    print('stderr:', table.concat(data, '\n'))
  end,
  on_exit = function(_, code, _)
    print('Process exited with code:', code)
  end,
})
```

### 9. Job Control

ใช้ terminal กับ jobs:

```lua
-- Run command in terminal
vim.fn.jobstart('pytest', {
  term = true,
  on_exit = function(_, code, _)
    print('Tests finished with code:', code)
  end,
})
```

### 10. Terminal Events

ใช้ terminal events:

```lua
vim.api.nvim_create_autocmd('TermOpen', {
  callback = function()
    -- Set terminal-specific options
    vim.opt_local.number = false
    vim.opt_local.relativenumber = false
  end,
})

vim.api.nvim_create_autocmd('TermClose', {
  callback = function()
    -- Clean up when terminal closes
    vim.cmd('close')
  end,
})
```

### 11. Termdebug Plugin

ใช้ `termdebug` สำหรับ debugging:

```vim
:Termdebug gdb
```

หรือ:

```vim
:packadd termdebug
:Termdebug python %
```

### 12. Common Use Cases

#### Run Tests

```lua
vim.keymap.set('n', '<leader>tt', function()
  vim.cmd('split | terminal pytest %')
end, { desc = 'Run tests' })
```

#### Run REPL

```lua
vim.keymap.set('n', '<leader>tr', function()
  vim.cmd('split | terminal python')
end, { desc = 'Python REPL' })
```

#### Run Git Commands

```lua
vim.keymap.set('n', '<leader>tg', function()
  vim.cmd('split | terminal lazygit')
end, { desc = 'Lazygit' })
```

### 13. Terminal Buffers

จัดการ terminal buffers:

```vim
:ls! " List all buffers including terminals
:b term:// " Switch to terminal buffer
:bd " Close terminal buffer
```

### 14. Scrolling

Scroll ใน terminal:

```vim
-- Normal mode
<C-e> " Scroll down
<C-y> " Scroll up
```

### 15. Copy from Terminal

Copy text จาก terminal:

```vim
-- Enter normal mode in terminal
<C-\><C-N>

-- Use normal yank commands
v " Enter visual mode
y " Yank selection
```

### 16. Troubleshooting

#### Check Terminal Status

```vim
:echo term_getstatus(bufnr('%'))
```

#### Kill Terminal Process

```vim
:call jobstop(b:terminal_job_id)
```

#### Restart Terminal

```vim
:call termopen('bash')
```

## Rules

- ใช้ `<C-\><C-N>` สำหรับ exit terminal mode
- ใช้ floating windows สำหรับ temporary terminals
- ใช้ autocommands สำหรับ terminal-specific configuration
- ใช้ job callbacks สำหรับ async operations

## Expected Outcome

- Terminal ทำงานได้อย่างราบรื่น
- Integration กับ workflows ที่หลากหลาย
- Keybindings สำหรับ terminal operations
- Floating terminals สำหรับ quick access
