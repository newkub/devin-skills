---
title: Buffer and Window Guide
description: คู่มือการจัดการ Buffers และ Windows ใน Neovim
---

## Goal

จัดการ Buffers และ Windows ใน Neovim เพื่อ workflow ที่ efficient

## Scope

ใช้สำหรับการสร้าง, จัดการ, และ navigate buffers และ windows

## Execute

### 1. What are Buffers and Windows?

**Buffer**: ข้อความใน memory (file หรือ empty document)

**Window**: Viewport ที่แสดง buffer

**Relationships**:
- 1 buffer สามารถแสดงในหลาย windows
- 1 window แสดง 1 buffer
- Windows ถูกจัดเรียงใน tree structure

### 2. Buffer Operations

#### Create Buffer

```vim
:new " Create new buffer
:enew " Edit new buffer in current window
```

#### Open File

```vim
:e filename.txt " Edit file
:split filename.txt " Open in horizontal split
:vsplit filename.txt " Open in vertical split
:tabnew filename.txt " Open in new tab
```

#### Save Buffer

```vim
:w " Save current buffer
:w filename.txt " Save as
:wa " Save all buffers
```

#### Close Buffer

```vim
:q " Close window (if only 1 window, close buffer)
:bd " Delete buffer
:bd! " Delete buffer without saving
:bw " Wipeout buffer (remove from list)
```

### 3. Buffer Navigation

#### List Buffers

```vim
:ls " List all buffers
:ls! " List all including unlisted
```

#### Navigate Buffers

```vim
:bnext " Next buffer
:bprevious " Previous buffer
:bfirst " First buffer
:blast " Last buffer
:b 3 " Go to buffer 3
```

#### Keybindings

```lua
-- Buffer navigation
vim.keymap.set('n', '<leader>bn', ':bnext<CR>', { desc = 'Next buffer' })
vim.keymap.set('n', '<leader>bp', ':bprevious<CR>', { desc = 'Previous buffer' })
vim.keymap.set('n', '<leader>bd', ':bd<CR>', { desc = 'Delete buffer' })
```

### 4. Buffer States

Buffers มีหลาย states:

| State | Description | Command |
|-------|-------------|---------|
| Active | แสดงใน window | - |
| Hidden | Loaded แต่ไม่แสดง | `:hide` |
| Unloaded | ไม่ loaded | - |
| Listed | อยู่ใน buffer list | default |
| Unlisted | ไม่อยู่ใน buffer list | `:set nobuflisted` |

### 5. Buffer Options

ตั้งค่า buffer options:

```lua
-- Set buffer-local option
vim.opt_local.buftype = 'nofile'
vim.opt_local.bufhidden = 'wipe'
vim.opt_local.swapfile = false
```

**Common Options**:
- `buftype`: `nofile`, `nowrite`, `acwrite`, `help`, `terminal`
- `bufhidden`: `hide`, `wipe`, `delete`
- `buflisted`: `true`/`false`
- `swapfile`: `true`/`false`

### 6. Window Operations

#### Split Windows

```vim
:split " Horizontal split
:vsplit " Vertical split
:split filename.txt " Split with file
```

#### Resize Windows

```vim
:resize 30 " Set height to 30
:vertical resize 80 " Set width to 80
```

#### Move Between Windows

```vim
<C-w>h " Move left
<C-w>j " Move down
<C-w>k " Move up
<C-w>l " Move right
<C-w>w " Move to next window
<C-w>W " Move to previous window
```

#### Close Windows

```vim
:close " Close current window
:only " Close all other windows
```

### 7. Window Keybindings

ตั้งค่า keybindings สำหรับ windows:

```lua
-- Window navigation
vim.keymap.set('n', '<C-h>', '<C-w>h', { desc = 'Move left' })
vim.keymap.set('n', '<C-j>', '<C-w>j', { desc = 'Move down' })
vim.keymap.set('n', '<C-k>', '<C-w>k', { desc = 'Move up' })
vim.keymap.set('n', '<C-l>', '<C-w>l', { desc = 'Move right' })

-- Window resizing
vim.keymap.set('n', '<C-w>+', '<C-w>+', { desc = 'Increase height' })
vim.keymap.set('n', '<C-w>-', '<C-w>-', { desc = 'Decrease height' })
vim.keymap.set('n', '<C-w>>', '<C-w>>', { desc = 'Increase width' })
vim.keymap.set('n', '<C-w><', '<C-w><', { desc = 'Decrease width' })
```

### 8. Floating Windows

สร้าง floating windows:

```lua
local function open_float_win()
  local buf = vim.api.nvim_create_buf(false, true)
  local width = 80
  local height = 20
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
end

vim.keymap.set('n', '<leader>fw', open_float_win, { desc = 'Float window' })
```

### 9. Tab Pages

จัดการ tab pages:

```vim
:tabnew " New tab
:tabclose " Close tab
:tabnext " Next tab
:tabprevious " Previous tab
:tabfirst " First tab
:tablast " Last tab
:tabmove N " Move tab to position N
```

### 10. Buffer API

ใช้ Lua API สำหรับ buffers:

```lua
-- Get current buffer
local buf = vim.api.nvim_get_current_buf()

-- Get buffer name
local name = vim.api.nvim_buf_get_name(buf)

-- Get buffer lines
local lines = vim.api.nvim_buf_get_lines(buf, 0, -1, false)

-- Set buffer lines
vim.api.nvim_buf_set_lines(buf, 0, -1, false, { 'Hello', 'World' })

-- Check if buffer is loaded
local loaded = vim.api.nvim_buf_is_loaded(buf)

-- Delete buffer
vim.api.nvim_buf_delete(buf, { force = true })
```

### 11. Window API

ใช้ Lua API สำหรับ windows:

```lua
-- Get current window
local win = vim.api.nvim_get_current_win()

-- Get window buffer
local buf = vim.api.nvim_win_get_buf(win)

-- Set window buffer
vim.api.nvim_win_set_buf(win, other_buf)

-- Get window position
local pos = vim.api.nvim_win_get_position(win)

-- Set window height
vim.api.nvim_win_set_height(win, 20)

-- Set window width
vim.api.nvim_win_set_width(win, 80)
```

### 12. Advanced Buffer Management

#### Auto-save

```lua
vim.api.nvim_create_autocmd('BufLeave', {
  callback = function()
    if vim.bo.modifiable and vim.bo.modified then
      vim.cmd('silent write')
    end
  end,
})
```

#### Auto-close empty buffers

```lua
vim.api.nvim_create_autocmd('BufEnter', {
  callback = function()
    if vim.api.nvim_buf_line_count(0) == 1 and vim.api.nvim_buf_get_lines(0, 0, -1, false)[1] == '' then
      vim.cmd('bd')
    end
  end,
})
```

### 13. Quickfix and Location Lists

ใช้ quickfix และ location lists:

```vim
:copen " Open quickfix window
:lopen " Open location list
:cnext " Next quickfix item
:cprevious " Previous quickfix item
```

### 14. Troubleshooting

#### View Buffer Info

```vim
:echo bufnr('%') " Current buffer number
:echo bufname('%') " Current buffer name
:echo bufloaded('%') " Is buffer loaded?
```

#### View Window Info

```vim
:echo winnr() " Current window number
:echo win_getid() " Current window ID
:echo winbufnr('%') " Buffer in current window
```

#### Reset Window Layout

```vim
:only " Close all other windows
:wincmd = " Make windows equal size
```

## Rules

- ใช้ `<C-w>` prefix สำหรับ window operations
- ใช้ buffer lists สำหรับ manage multiple files
- ใช้ floating windows สำหรับ temporary UI
- ใช้ Lua API สำหรับ programmatic control

## Expected Outcome

- Buffer และ window management ที่ efficient
- Navigation ที่รวดเร็ว
- Layout ที่ flexible
- Integration กับ workflows ต่างๆ
