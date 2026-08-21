---
title: Completion
description: คำอธิบายเกี่ยวกับ Completion System ใน Neovim
---

## Goal

เข้าใจ Completion System ใน Neovim สำหรับ autocomplete

## Scope

ใช้สำหรับการตั้งค่า completion, completion sources, และ custom completions

## Execute

### 1. What is Completion?

Completion System ใน Neovim มีหลาย layers:

- **Built-in completion**: keyword completion, file completion
- **LSP completion**: language server-based completion
- **Snippet completion**: code snippets
- **Custom completion**: user-defined completion functions

### 2. Built-in Completion

ใช้ built-in completion modes:

```vim
<C-n> " Next completion match
<C-p> " Previous completion match
<C-x><C-n> " Keyword completion
<C-x><C-f> " File completion
<C-x><C-l> " Line completion
<C-x><C-d> " Definition completion
```

### 3. Completion Options

ตั้งค่า completion options:

```lua
-- Enable completion in insert mode
vim.opt.completeopt = { 'menu', 'menuone', 'noselect' }

-- Set completion menu
vim.opt.wildmenu = true

-- Set completion behavior
vim.opt.complete = '.' -- Complete from current buffer
```

**Completeopt values:**
- `menu`: Show completion menu
- `menuone`: Show menu even for single match
- `noselect`: Don't select first match automatically
- `noinsert`: Don't insert text until selected
- `preview`: Show preview window

### 4. LSP Completion

LSP ให้ completion อัตโนมัติ:

```lua
local lspconfig = require('lspconfig')

lspconfig.tsserver.setup({
  capabilities = require('cmp_nvim_lsp').default_capabilities(),
})
```

### 5. nvim-cmp

ใช้ `nvim-cmp` สำหรับ completion engine:

```lua
local cmp = require('cmp')

cmp.setup({
  sources = {
    { name = 'nvim_lsp' },
    { name = 'buffer' },
    { name = 'path' },
  },
  mapping = {
    ['<C-n>'] = cmp.mapping.select_next_item(),
    ['<C-p>'] = cmp.mapping.select_prev_item(),
    ['<CR>'] = cmp.mapping.confirm({ select = true }),
  },
})
```

### 6. Completion Sources

ตาราง completion sources ที่นิยม:

| Source | Description | Plugin |
|--------|-------------|--------|
| `nvim_lsp` | LSP completion | nvim-cmp |
| `buffer` | Buffer words | nvim-cmp |
| `path` | File paths | nvim-cmp |
| `cmdline` | Command-line | cmp-cmdline |
| `snippets` | Code snippets | Luasnip |
| `emoji` | Emoji completion | cmp-emoji |
| `calc` | Calculator | cmp-calc |

### 7. Snippet Completion

ใช้ snippets กับ completion:

```lua
local luasnip = require('luasnip')

cmp.setup({
  snippet = {
    expand = function(args)
      luasnip.lsp_expand(args.body)
    end,
  },
  sources = {
    { name = 'luasnip' },
  },
})
```

### 8. Custom Completion

สร้าง custom completion function:

```lua
vim.api.nvim_create_user_command('CompleteCustom', function()
  local items = { 'foo', 'bar', 'baz' }
  vim.fn.complete(vim.fn.col('.'), items)
end, {})
```

### 9. Completion Menu

ตั้งค่า completion menu:

```lua
-- Highlight groups
vim.cmd('highlight Pmenu guibg=#1e1e1e guifg=#ffffff')
vim.cmd('highlight PmenuSel guibg=#3e3e3e guifg=#ffffff')
vim.cmd('highlight PmenuSbar guibg=#2e2e2e')

-- Menu configuration
vim.opt.pumheight = 10 -- Max menu height
vim.opt.pumwidth = 30 -- Menu width
```

### 10. Completion Context

ตั้งค่า completion context:

```lua
cmp.setup({
  completion = {
    completeopt = 'menu,menuone,noselect',
    keyword_length = 2,
    keyword_pattern = [[\k\+]],
  },
})
```

### 11. Trigger Completion

Trigger completion ด้วย Lua:

```lua
-- Trigger LSP completion
vim.lsp.buf.complete()

-- Trigger omni completion
vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes('<C-x><C-o>', true, true, true), 'n', true)
```

### 12. Completion in Command-line

ใช้ completion ใน command-line:

```lua
local cmp = require('cmp')

cmp.setup.cmdline(':', {
  sources = cmp.config.sources({
    { name = 'path' },
    { name = 'cmdline' },
  }),
})
```

### 13. Performance Optimization

เพื่อ performance:

- จำกัด keyword length
- ใช้ fuzzy matching แทน exact matching
- จำกัดจำนวน sources
- ใช้ debounce สำหรับ async completion

### 14. Troubleshooting

#### Check Completion Status

```vim
:lua print(vim.inspect(vim.lsp.get_active_clients()))
```

#### Debug Completion

```lua
cmp.setup({
  debug = true,
})
```

#### Disable Specific Source

```lua
cmp.setup({
  sources = cmp.config.sources({
    { name = 'nvim_lsp' },
    { name = 'buffer', option = { keyword_pattern = [[\k\+]] } },
  }, {
    { name = 'path' },
  }),
})
```

## Rules

- ใช้ `nvim-cmp` สำหรับ modern completion
- ใช้ LSP completion สำหรับ language-aware completion
- ใช้ snippets สำหรับ code templates
- จำกัด sources สำหรับ performance

## Expected Outcome

- Completion ทำงานได้อย่างรวดเร็ว
- Multiple sources ทำงานร่วมกันได้
- Snippets พร้อมใช้งาน
- Performance ดีเมื่อมี completions จำนวนมาก
