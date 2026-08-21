---
title: Diagnostics Guide
description: คู่มือการใช้งาน Diagnostic System ใน Neovim
---

## Goal

ใช้งาน Diagnostic System ใน Neovim เพื่อแสดง errors, warnings, hints จาก linters, LSP, และ tools อื่นๆ

## Scope

ใช้สำหรับการตั้งค่า diagnostics, custom handlers, และ integration กับ external tools

## Execute

### 1. What is Diagnostics?

Diagnostic System เป็น framework สำหรับแสดง feedback จาก external tools:

- **Errors**: ปัญหาที่ต้องแก้ไข
- **Warnings**: ปัญหาที่ควรแก้ไข
- **Hints**: ข้อเสนอแนะ
- **Information**: ข้อมูลเพิ่มเติม

**Features:**
- Virtual text (inline diagnostics)
- Signs (gutter icons)
- Underlines
- Floating windows
- Namespace-based (multiple sources)

### 2. Basic Configuration

ตั้งค่า diagnostics พื้นฐาน:

```lua
vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  underline = true,
  update_in_insert = false,
  severity_sort = true,
  float = {
    focusable = false,
    style = 'minimal',
    border = 'rounded',
    source = 'always',
    header = '',
    prefix = '',
  },
})
```

### 3. Custom Signs

ตั้งค่า custom signs:

```lua
local signs = {
  Error = '',
  Warn = '',
  Hint = '',
  Info = '',
}

for type, icon in pairs(signs) do
  local hl = 'DiagnosticSign' .. type
  vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
end
```

### 4. Severity Levels

ตาราง severity levels:

| Level | Value | Description |
|-------|-------|-------------|
| Error | 1 | Errors that prevent execution |
| Warn | 2 | Warnings that should be addressed |
| Info | 3 | Informational messages |
| Hint | 4 | Suggestions for improvement |

### 5. Keybindings

ตั้งค่า keybindings สำหรับ diagnostics:

```lua
-- Go to next diagnostic
vim.keymap.set('n', '[d', vim.diagnostic.goto_prev, { desc = 'Previous diagnostic' })
vim.keymap.set('n', ']d', vim.diagnostic.goto_next, { desc = 'Next diagnostic' })

-- Open diagnostic float
vim.keymap.set('n', '<leader>e', vim.diagnostic.open_float, { desc = 'Open diagnostic' })

-- Set diagnostic location list
vim.keymap.set('n', '<leader>q', vim.diagnostic.setloclist, { desc = 'Diagnostics to loclist' })
```

### 6. Namespace Configuration

ตั้งค่า diagnostics ตาม namespace:

```lua
-- Disable virtual text for LSP
vim.diagnostic.config({
  virtual_text = false,
}, 'lsp')

-- Enable virtual text for linters
vim.diagnostic.config({
  virtual_text = true,
}, 'lint')
```

### 7. Custom Handlers

สร้าง custom handlers:

```lua
vim.diagnostic.config({
  handlers = {
    -- Disable virtual text for errors
    ['text'] = function(diagnostics, opts, bufnr)
      local filtered = {}
      for _, d in ipairs(diagnostics) do
        if d.severity ~= vim.diagnostic.severity.ERROR then
          table.insert(filtered, d)
        end
      end
      vim.diagnostic.handlers.text(filtered, opts, bufnr)
    end,
  },
})
```

### 8. Filtering Diagnostics

กรอง diagnostics:

```lua
-- Filter by severity
local function filter_diagnostics(bufnr)
  local diagnostics = vim.diagnostic.get(bufnr)
  local filtered = {}
  for _, d in ipairs(diagnostics) do
    if d.severity >= vim.diagnostic.severity.WARN then
      table.insert(filtered, d)
    end
  end
  return filtered
end
```

### 9. LSP Integration

LSP diagnostics จะถูกจัดการอัตโนมัติ:

```lua
-- LSP client จะส่ง diagnostics ผ่าน namespace
-- ใช้ vim.lsp.diagnostic สำหรับ LSP-specific functions

-- Convert LSP diagnostics to Neovim diagnostics
vim.lsp.diagnostic.on_publish_diagnostics(
  err,
  result,
  ctx,
  { virtual_text = true, signs = true }
)
```

### 10. Null-ls Integration

ใช้ `null-ls` สำหรับ non-LSP diagnostics:

```lua
local null_ls = require('null-ls')

null_ls.setup({
  sources = {
    null_ls.builtins.diagnostics.eslint,
    null_ls.builtins.diagnostics.flake8,
    null_ls.builtins.diagnostics.mypy,
  },
})
```

### 11. Advanced Configuration

#### Disable in Insert Mode

```lua
vim.diagnostic.config({
  update_in_insert = false,
})
```

#### Severity Sorting

```lua
vim.diagnostic.config({
  severity_sort = true,
})
```

#### Custom Float Configuration

```lua
vim.diagnostic.config({
  float = {
    border = 'single',
    focusable = true,
    style = 'minimal',
    source = 'if_many',
    header = ' Diagnostics ',
    prefix = ' ',
  },
})
```

### 12. Troubleshooting

#### View All Diagnostics

```vim
:lua print(vim.inspect(vim.diagnostic.get()))
```

#### Clear Diagnostics

```vim
:lua vim.diagnostic.reset()
```

#### Disable for Buffer

```vim
:lua vim.diagnostic.disable(0)
```

#### Enable for Buffer

```vim
:lua vim.diagnostic.enable(0)
```

## Rules

- ใช้ `vim.diagnostic.config()` สำหรับ global settings
- ใช้ namespaces สำหรับ isolate diagnostics จาก sources ต่างกัน
- ใช้ handlers สำหรับ custom rendering
- ใช้ `null-ls` สำหรับ non-LSP diagnostics

## Expected Outcome

- Diagnostics แสดงผลอย่างชัดเจน
- Multiple diagnostic sources ทำงานร่วมกันได้
- Custom rendering ตามต้องการ
- Performance ดีเมื่อมี diagnostics จำนวนมาก
