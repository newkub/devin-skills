---
title: Autocommands Guide
description: คู่มือการใช้งาน Autocommands ใน Neovim
---

## Goal

ใช้งาน Autocommands ใน Neovim เพื่อ execute commands อัตโนมัติเมื่อเกิด events เช่น buffer operations, file I/O, UI changes

## Scope

ใช้สำหรับการตั้งค่า autocommands, augroups, และ event handlers

## Execute

### 1. What are Autocommands?

Autocommands เป็น commands ที่ execute อัตโนมัติเมื่อเกิด events ที่ระบุ:

- **Buffer events**: `BufRead`, `BufWrite`, `BufEnter`
- **File events**: `FileReadPost`, `FileWritePre`
- **UI events**: `VimResized`, `WinEnter`
- **Mode events**: `InsertEnter`, `InsertLeave`
- **Terminal events**: `TermOpen`, `TermClose`

### 2. Basic Syntax

ใช้ `vim.api.nvim_create_autocmd()` ใน Lua:

```lua
vim.api.nvim_create_autocmd('BufEnter', {
  pattern = '*.lua',
  callback = function()
    print('Lua file opened')
  end,
})
```

### 3. Common Events

ตาราง events ที่ใช้บ่อย:

| Event | Description | Example |
|-------|-------------|---------|
| `BufRead` | เมื่อ buffer ถูกอ่าน | Load filetype settings |
| `BufWritePre` | ก่อนบันทึก buffer | Format code |
| `BufWritePost` | หลังบันทึก buffer | Update timestamps |
| `BufEnter` | เมื่อเข้า buffer | Set window options |
| `BufLeave` | เมื่อออกจาก buffer | Save cursor position |
| `InsertEnter` | เมื่อเข้า Insert mode | Enable completion |
| `InsertLeave` | เมื่อออกจาก Insert mode | Disable completion |
| `VimResized` | เมื่อ resize window | Adjust layout |
| `TermOpen` | เมื่อ terminal เปิด | Set terminal options |

### 4. Pattern Matching

ใช้ patterns สำหรับ match files:

```lua
-- Match specific extension
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.lua',
  callback = function()
    print('Lua file')
  end,
})

-- Match multiple patterns
vim.api.nvim_create_autocmd('BufRead', {
  pattern = { '*.lua', '*.vim' },
  callback = function()
    print('Script file')
  end,
})

-- Match directory
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '/tmp/*',
  callback = function()
    print('Temp file')
  end,
})
```

### 5. Augroups

ใช้ augroups สำหรับ organize autocommands:

```lua
-- Create augroup
local mygroup = vim.api.nvim_create_augroup('MyGroup', { clear = true })

-- Add autocommand to group
vim.api.nvim_create_autocmd('BufRead', {
  group = mygroup,
  pattern = '*.lua',
  callback = function()
    print('Lua file in MyGroup')
  end,
})
```

### 6. Common Use Cases

#### Set Filetype Options

```lua
vim.api.nvim_create_autocmd('FileType', {
  pattern = 'python',
  callback = function()
    vim.opt_local.shiftwidth = 4
    vim.opt_local.tabstop = 4
  end,
})
```

#### Format on Save

```lua
vim.api.nvim_create_autocmd('BufWritePre', {
  pattern = '*.lua',
  callback = function()
    vim.lsp.buf.format()
  end,
})
```

#### Save Cursor Position

```lua
vim.api.nvim_create_autocmd('BufReadPost', {
  callback = function()
    local mark = vim.api.nvim_buf_get_mark(0, '"')
    local lcount = vim.api.nvim_buf_line_count(0)
    if mark[1] > 0 and mark[1] <= lcount then
      pcall(vim.api.nvim_win_set_cursor, 0, mark)
    end
  end,
})
```

#### Auto-compile

```lua
vim.api.nvim_create_autocmd('BufWritePost', {
  pattern = '*.tex',
  callback = function()
    vim.cmd('!pdflatex %')
  end,
})
```

### 7. Nested Autocommands

ใช้ `nested = true` สำหรับ autocommands ที่ trigger autocommands อื่น:

```lua
vim.api.nvim_create_autocmd('BufWritePost', {
  pattern = '*.lua',
  nested = true,
  callback = function()
    -- This might trigger other autocommands
    vim.cmd('edit')
  end,
})
```

### 8. Buffer-Local Autocommands

สร้าง autocommands สำหรับ buffer เฉพาะ:

```lua
vim.api.nvim_create_autocmd('BufEnter', {
  buffer = 0, -- Current buffer
  callback = function()
    print('Entered this buffer')
  end,
})
```

### 9. Once-Only Autocommands

ใช้ `once = true` สำหรับ execute ครั้งเดียว:

```lua
vim.api.nvim_create_autocmd('VimEnter', {
  once = true,
  callback = function()
    print('Neovim started')
  end,
})
```

### 10. Command vs Callback

ใช้ Vimscript commands หรือ Lua callbacks:

```lua
-- Using command (Vimscript)
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.lua',
  command = 'setlocal shiftwidth=2',
})

-- Using callback (Lua)
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.lua',
  callback = function()
    vim.opt_local.shiftwidth = 2
  end,
})
```

### 11. Advanced Patterns

ใช้ advanced patterns:

```lua
-- Match multiple filetypes
vim.api.nvim_create_autocmd('FileType', {
  pattern = { 'javascript', 'typescript', 'lua' },
  callback = function()
    print('Script file')
  end,
})

-- Match with regex
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.[ch]', -- .c or .h files
  callback = function()
    print('C/C++ file')
  end,
})
```

### 12. Troubleshooting

#### List Autocommands

```vim
:autocmd
```

#### List Autocommands for Group

```vim
:autocmd MyGroup
```

#### Debug Autocommands

```lua
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.lua',
  callback = function()
    print('Autocommand triggered', vim.debug.traceback())
  end,
})
```

## Rules

- ใช้ augroups สำหรับ organize autocommands
- ใช้ `clear = true` เมื่อสร้าง augroup เพื่อ prevent duplicates
- ใช้ callbacks แทน commands เมื่ะต้องการ logic ที่ซับซ้อน
- ใช้ `nested = true` เมื่อ autocommand อาจ trigger autocommands อื่น

## Expected Outcome

- Autocommands ทำงานอย่างถูกต้อง
- Events ถูก handle ตามต้องการ
- Configuration ถูก apply อัตโนมัติ
- ไม่มี duplicate autocommands
