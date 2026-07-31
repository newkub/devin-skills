---
title: Quickfix
description: คำอธิบายเกี่ยวกับ Quickfix และ Location Lists ใน Neovim
---

## Goal

เข้าใจ Quickfix และ Location Lists ใน Neovim สำหรับ navigate errors และ search results

## Scope

ใช้สำหรับการสร้าง, navigate, และจัดการ quickfix และ location lists

## Execute

### 1. What are Quickfix and Location Lists?

**Quickfix List**: List ของ locations ที่ global (shared ทั่วทั้ง Neovim)

**Location List**: List ของ locations ที่ window-local (แต่ละ window มี list ของตัวเอง)

**Use Cases:**
- Compiler errors
- LSP diagnostics
- Search results
- Refactoring results

### 2. Quickfix Commands

ตาราง quickfix commands:

| Command | Description |
|---------|-------------|
| `:copen` | Open quickfix window |
| `:cclose` | Close quickfix window |
| `:cnext` | Go to next item |
| `:cprevious` | Go to previous item |
| `:cfirst` | Go to first item |
| `:clast` | Go to last item |
| `:cnfile` | Go to next file |
| `:cpfile` | Go to previous file |
| `:cc N` | Go to item N |

### 3. Location List Commands

ตาราง location list commands:

| Command | Description |
|---------|-------------|
| `:lopen` | Open location list window |
| `:lclose` | Close location list window |
| `:lnext` | Go to next item |
| `:lprevious` | Go to previous item |
| `:lfirst` | Go to first item |
| `:llast` | Go to last item |
| `:lnfile` | Go to next file |
| `:lpfile` | Go to previous file |
| `:ll N` | Go to item N |

### 4. Creating Quickfix List

สร้าง quickfix list:

```lua
-- From search results
vim.cmd('vimgrep /pattern/ **/*.lua')

-- From grep
vim.cmd('grep pattern file.txt')

-- From compiler
vim.cmd('make')
```

### 5. Creating Location List

สร้าง location list:

```lua
-- From search results (window-local)
vim.cmd('lvimgrep /pattern/ **/*.lua')

-- From grep (window-local)
vim.cmd('lgrep pattern file.txt')
```

### 6. Quickfix API

ใช้ Lua API สำหรับ quickfix:

```lua
-- Set quickfix list
vim.fn.setqflist({
  { filename = 'file.lua', lnum = 10, col = 5, text = 'Error' },
  { filename = 'file.lua', lnum = 20, col = 10, text = 'Warning' },
})

-- Get quickfix list
local items = vim.fn.getqflist()

-- Get current item
local item = vim.fn.getqflist({ idx = 0 })
```

### 7. Location List API

ใช้ Lua API สำหรับ location lists:

```lua
-- Set location list
vim.fn.setloclist(0, {
  { filename = 'file.lua', lnum = 10, col = 5, text = 'Error' },
})

-- Get location list
local items = vim.fn.getloclist(0)

-- Get current item
local item = vim.fn.getloclist(0, { idx = 0 })
```

### 8. Quickfix Item Structure

โครงสร้าง quickfix item:

```lua
{
  filename = 'file.lua',  -- File name
  lnum = 10,             -- Line number
  col = 5,               -- Column number
  text = 'Error',        -- Description
  type = 'E',            -- Type (E, W, I)
  valid = 1,             -- Is valid?
}
```

### 9. Navigation Keybindings

ตั้งค่า keybindings:

```lua
-- Quickfix navigation
vim.keymap.set('n', '<leader>qn', ':cnext<CR>', { desc = 'Next quickfix' })
vim.keymap.set('n', '<leader>qp', ':cprevious<CR>', { desc = 'Previous quickfix' })
vim.keymap.set('n', '<leader>qo', ':copen<CR>', { desc = 'Open quickfix' })
vim.keymap.set('n', '<leader>qc', ':cclose<CR>', { desc = 'Close quickfix' })

-- Location list navigation
vim.keymap.set('n', '<leader>ln', ':lnext<CR>', { desc = 'Next location' })
vim.keymap.set('n', '<leader>lp', ':lprevious<CR>', { desc = 'Previous location' })
vim.keymap.set('n', '<leader>lo', ':lopen<CR>', { desc = 'Open location' })
vim.keymap.set('n', '<leader>lc', ':lclose<CR>', { desc = 'Close location' })
```

### 10. LSP Integration

LSP ใช้ quickfix สำหรับ diagnostics:

```lua
-- Send diagnostics to quickfix
vim.lsp.diagnostic.set_loclist({ open_loclist_on_error = true })
```

### 11. Search Results

ใช้ quickfix สำหรับ search results:

```vim
" Search in files
:vimgrep /pattern/ **/*.lua

" Search in current buffer
:grep pattern %

" Search with ripgrep
:Rg pattern
```

### 12. Compiler Integration

ใช้ quickfix กับ compiler:

```lua
-- Set compiler
vim.cmd('compiler gcc')

-- Make
vim.cmd('make')

-- View errors
vim.cmd('copen')
```

### 13. Custom Quickfix

สร้าง custom quickfix:

```lua
local function add_to_quickfix(items)
  local current = vim.fn.getqflist()
  vim.fn.setqflist(vim.list_extend(current, items))
  vim.cmd('copen')
end

add_to_quickfix({
  { filename = 'file.lua', lnum = 10, text = 'Custom error' },
})
```

### 14. Filtering Quickfix

กรอง quickfix items:

```lua
local function filter_quickfix(pattern)
  local items = vim.fn.getqflist()
  local filtered = {}
  for _, item in ipairs(items) do
    if item.text:match(pattern) then
      table.insert(filtered, item)
    end
  end
  vim.fn.setqflist(filtered)
end

filter_quickfix('Error')
```

### 15. Troubleshooting

#### View Quickfix List

```vim
:echo getqflist()
```

#### Clear Quickfix

```vim
:cexpr []
```

#### View Location List

```vim
:echo getloclist(0)
```

#### Clear Location List

```vim
:lexpr []
```

## Rules

- ใช้ quickfix สำหรับ global lists (errors, search results)
- ใช้ location lists สำหรับ window-local lists
- ใช้ LSP integration สำหรับ diagnostics
- ใช้ keybindings สำหรับ quick navigation

## Expected Outcome

- Quickfix และ location lists ทำงานได้อย่างถูกต้อง
- Navigation ระหว่าง errors และ search results รวดเร็ว
- Integration กับ external tools (compiler, LSP)
- Custom quickfix lists สำหรับ specific use cases
