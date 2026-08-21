---
title: LSP Guide
description: คู่มือการใช้งาน LSP (Language Server Protocol) ใน Neovim
---

## Goal

ใช้งาน LSP ใน Neovim เพื่อเพิ่มประสิทธิภาพการเขียนโค้ดด้วย features เช่น autocomplete, go-to-definition, diagnostics, และอื่นๆ

## Scope

ใช้สำหรับการตั้งค่าและใช้งาน LSP clients ใน Neovim รวมถึงการติดตั้ง language servers, configuration, และ custom handlers

## Execute

### 1. What is LSP?

LSP (Language Server Protocol) เป็น protocol มาตรฐานสำหรับการสื่อสารระหว่าง editor และ language tools (language servers) Neovim มี built-in LSP client ที่รองรับ protocol นี้

**Benefits:**
- **IDE-like features**: autocomplete, go-to-definition, find references
- **Diagnostics**: errors, warnings, hints แบบ real-time
- **Code actions**: quick fixes, refactoring
- **Single implementation**: language server ตัวเดียวใช้ได้กับหลาย editors

### 2. Installation

ติดตั้ง language servers ที่ต้องการ:

```bash
# TypeScript/JavaScript
bun install -g typescript-language-server typescript

# Python
pip install python-lsp-server

# Go
go install golang.org/x/tools/gopls@latest

# Rust
rustup component add rust-analyzer

# Lua
luarocks install --server=https://luarocks.org/dev lua-language-server
```

### 3. Basic Setup

ตั้งค่า LSP client พื้นฐานใน `init.lua`:

```lua
local lspconfig = require('lspconfig')

-- Setup TypeScript LSP
lspconfig.tsserver.setup({
  on_attach = function(client, bufnr)
    -- Keybindings จะถูกตั้งค่าเมื่อ LSP attach
    local opts = { buffer = bufnr }
    vim.keymap.set('n', 'gD', vim.lsp.buf.declaration, opts)
    vim.keymap.set('n', 'gd', vim.lsp.buf.definition, opts)
    vim.keymap.set('n', 'K', vim.lsp.buf.hover, opts)
    vim.keymap.set('n', 'gi', vim.lsp.buf.implementation, opts)
    vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, opts)
  end,
})

-- Setup Python LSP
lspconfig.pyright.setup({})
```

### 4. Common LSP Servers

ตาราง language servers ที่นิยมใช้:

| Language | Server | Installation |
|----------|--------|--------------|
| TypeScript/JavaScript | `tsserver` | `bun install -g typescript-language-server` |
| Python | `pyright` | `bun install -g pyright` |
| Go | `gopls` | `go install golang.org/x/tools/gopls@latest` |
| Rust | `rust-analyzer` | `rustup component add rust-analyzer` |
| Lua | `lua_ls` | `luarocks install lua-language-server` |
| C/C++ | `clangd` | `brew install clangd` (macOS) |
| Java | `jdtls` | Download from eclipse.jdt.ls |
| JSON | `jsonls` | `bun install -g vscode-langservers-extracted` |

### 5. Key Features

#### Go to Definition

```lua
vim.keymap.set('n', 'gd', vim.lsp.buf.definition, { buffer = bufnr })
```

#### Hover Documentation

```lua
vim.keymap.set('n', 'K', vim.lsp.buf.hover, { buffer = bufnr })
```

#### Find References

```lua
vim.keymap.set('n', 'gr', vim.lsp.buf.references, { buffer = bufnr })
```

#### Code Actions

```lua
vim.keymap.set('n', '<leader>ca', vim.lsp.buf.code_action, { buffer = bufnr })
```

#### Rename

```lua
vim.keymap.set('n', '<leader>rn', vim.lsp.buf.rename, { buffer = bufnr })
```

### 6. Diagnostics Configuration

ตั้งค่าการแสดง diagnostics:

```lua
vim.diagnostic.config({
  virtual_text = true,
  signs = true,
  underline = true,
  update_in_insert = false,
  severity_sort = true,
})

-- Custom signs
local signs = { Error = '', Warn = '', Hint = '', Info = '' }
for type, icon in pairs(signs) do
  local hl = 'DiagnosticSign' .. type
  vim.fn.sign_define(hl, { text = icon, texthl = hl, numhl = hl })
end
```

### 7. Advanced Configuration

#### Custom Capabilities

```lua
local capabilities = vim.lsp.protocol.make_client_capabilities()
capabilities.textDocument.completion.completionItem.snippetSupport = true

lspconfig.tsserver.setup({
  capabilities = capabilities,
})
```

#### Custom Handlers

```lua
lspconfig.tsserver.setup({
  handlers = {
    ['textDocument/publishDiagnostics'] = function(_, result, ctx)
      -- Custom diagnostic handling
    end,
  },
})
```

#### On Attach Hook

```lua
local on_attach = function(client, bufnr)
  -- Disable formatting if you use another formatter
  if client.name == 'tsserver' then
    client.server_capabilities.documentFormattingProvider = false
  end
end

lspconfig.tsserver.setup({ on_attach = on_attach })
```

### 8. Null-ls Integration

ใช้ `null-ls` สำหรับ formatters และ linters:

```lua
local null_ls = require('null-ls')

null_ls.setup({
  sources = {
    null_ls.builtins.formatting.prettier,
    null_ls.builtins.diagnostics.eslint,
  },
})
```

### 9. Troubleshooting

#### Check LSP Status

```vim
:LspInfo
```

#### Restart LSP

```vim
:LspRestart
```

#### View Logs

```vim
:lua print(vim.inspect(vim.lsp.get_active_clients()))
```

## Rules

- ใช้ `lspconfig` สำหรับ setup language servers ทั่วไป
- ตั้งค่า keybindings ใน `on_attach` hook
- ใช้ `vim.diagnostic.config()` สำหรับ global diagnostic settings
- ใช้ `null-ls` สำหรับ non-LSP tools (formatters, linters)

## Expected Outcome

- LSP servers ทำงานได้อย่างถูกต้อง
- Keybindings สำหรับ LSP features พร้อมใช้งาน
- Diagnostics แสดงผลอย่างชัดเจน
- Code actions และ refactoring ทำงานได้
