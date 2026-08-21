---
name: follow-nvim
description: ตั้งค่า Neovim configuration ด้วย lazy.nvim ตาม best practices
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

ตั้งค่า Neovim configuration ที่ modular, performant, และ testable ด้วย `lazy.nvim`

## Scope

ใช้สำหรับ project ที่ตั้งค่า Neovim configuration

## Execute

### 1. หลักการสำคัญ (Core Principles)

- Modularity & Single Responsibility: แต่ละไฟล์ควรทำหน้าที่เพียงอย่างเดียว การตั้งค่าปลั๊กอิน, options, และ keymaps ควรแยกจากกันอย่างชัดเจน เพื่อให้ง่ายต่อการบำรุงรักษาและแก้ไข
- Performance First (Lazy Loading): ทุกปลั๊กอินควรถูก Lazy Load เป็นค่าเริ่มต้น โหลดเฉพาะเมื่อถูกใช้งานจริงผ่าน `ft`, `cmd`, `keys`, หรือ `event` เพื่อให้ Neovim เปิดได้เร็วที่สุด (< 50ms)
- Clarity and Explicitness: โค้ดต้องอ่านเข้าใจง่าย ตั้งชื่อตัวแปรและฟังก์ชันให้สื่อความหมาย หลีกเลี่ยงการใช้ Magic Numbers หรือ Strings
- Robustness through Testing: Utility functions ที่มีความซับซ้อนควรมี Unit Test เสมอ เพื่อรับประกันความถูกต้องและป้องกัน Regression
- Automated Quality Checks: ใช้ CI (เช่น GitHub Actions) เพื่อรัน formatter, linter, และ tests โดยอัตโนมัติทุกครั้งที่มีการเปลี่ยนแปลง

## 2. โครงสร้างโปรเจกต์ (Project Structure)

```plaintext
.config/nvim/
├── .github/workflows/ci.yml # CI Pipeline for quality checks
├── init.lua                 # Entry Point: Bootstraps lazy.nvim ONLY
├── lua/
│   ├── core/                # Core configuration (Non-plugins)
│   │   ├── options.lua      # Foundational Neovim settings
│   │   ├── keymaps.lua      # Global key mappings
│   │   └── autocmds.lua     # Global autocommands
│   ├── lazy_entry.lua         # lazy.nvim setup and plugin specifications
│   ├── plugins/             # All plugin configurations, one file per plugin/feature
│   │   ├── editor/          # Editing enhancements (completion, syntax, etc.)
│   │   ├── lsp/             # All LSP-related configs (lspconfig, mason, formatters)
│   │   ├── ui/              # UI elements (theme, statusline, icons)
│   │   └── ...
│   └── utils/               # Shared utility functions with their own tests
├── stylua.toml              # Formatter configuration for Lua
├── tests/                   # Tests for utility functions
│   └── utils_spec.lua
└── lazy-lock.json           # Managed by lazy.nvim
```

## 3. แนวทางปฏิบัติที่ดีที่สุดในแต่ละส่วน

### `options.lua`

- เป้าหมาย: ตั้งค่าพื้นฐานที่ส่งผลต่อประสบการณ์ใช้งานโดยรวม ควรเป็นค่าที่ไม่เปลี่ยนแปลงบ่อย
- ข้อควรระวัง: ใช้ `vim.opt` ซึ่งเป็น API ที่ทันสมัยและปลอดภัยกว่า `vim.o` หรือ `vim.g`

```lua
-- lua/core/options.lua
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.termguicolors = true
vim.opt.timeoutlen = 300
```

### `keymaps.lua`

- เป้าหมาย: รวมศูนย์ Keymap ทั้งหมดไว้ที่เดียวเพื่อให้ง่ายต่อการค้นหาและหลีกเลี่ยงการชนกัน
- ข้อควรระวัง: ใส่ `desc` ให้กับทุก keymap เพื่อให้ `which-key.nvim` ทำงานได้เต็มประสิทธิภาพ

```lua
-- lua/core/keymaps.lua
local map = vim.keymap.set

-- General
map('n', '<leader>pv', vim.cmd.Ex, { desc = 'Project Explorer' })

-- Window Management
map('n', '<leader>wv', '<C-w>v', { desc = 'Split Window Vertically' })
map('n', '<leader>wh', '<C-w>s', { desc = 'Split Window Horizontally' })
```

### `autocmds.lua`

- เป้าหมาย: สร้าง Automation สำหรับเหตุการณ์ต่างๆ
- ข้อควรระวัง: จัดกลุ่ม `autocmd` ที่เกี่ยวข้องกันด้วย `vim.api.nvim_create_augroup` และใช้ `clear = true` เพื่อป้องกันการลงทะเบียนซ้ำซ้อน

```lua
-- lua/core/autocmds.lua
local augroup = vim.api.nvim_create_augroup
local autocmd = vim.api.nvim_create_autocmd

-- Highlight on yank
local yank_group = augroup('YankHighlight', { clear = true })
autocmd('TextYankPost', {
  group = yank_group,
  pattern = '*',
  callback = function()
    vim.highlight.on_yank({ higroup = 'IncSearch', timeout = 200 })
  end,
})
```

## 4. การตั้งค่า LSP และ Formatting ขั้นสูง

- เป้าหมาย: สร้างประสบการณ์ Code Intelligence ที่สมบูรณ์แบบและทำงานร่วมกับ Formatter อัตโนมัติ

```lua
-- lua/plugins/lsp/init.lua
return {
  'neovim/nvim-lspconfig',
  dependencies = { 'williamboman/mason.nvim', 'nvimtools/none-ls.nvim' },
  config = function()
    local on_attach = function(client, bufnr)
      -- Enable formatting on save
      if client.supports_method('textDocument/formatting') then
        autocmd('BufWritePre', {
          group = augroup('LspFormat', { clear = true }),
          buffer = bufnr,
          callback = function() vim.lsp.buf.format({ async = false }) end,
        })
      end
      -- ... other on_attach keymaps
    end

    -- Setup LSP servers
    local servers = { 'lua_ls', 'rust_analyzer' }
    require('mason-lspconfig').setup_handlers {
      function(server_name)
        require('lspconfig')[server_name].setup({ on_attach = on_attach })
      end,
    }

    -- Setup formatters (none-ls)
    local null_ls = require('null-ls')
    null_ls.setup({
      sources = {
        null_ls.builtins.formatting.stylua,
        null_ls.builtins.formatting.prettier,
      },
    })
  end,
}
```

## 5. กลยุทธ์การทดสอบ (Testing Strategy)

- เป้าหมาย: รับประกันว่า Utility functions ทำงานถูกต้องผ่าน Unit Test ด้วย `plenary.nvim`

```lua
-- tests/utils_spec.lua
local my_utils = require("utils.helpers")

describe("My Utility Functions", function()
  it("should correctly format a string", function()
    local input = "hello world"
    local expected = "Hello, World!"
    assert.are.equal(expected, my_utils.format_greeting(input))
  end)
end)
```

- Run Tests: `:PlenaryBustedFile %`

## 6. CI Workflow (GitHub Actions)

- เป้าหมาย: ตรวจสอบคุณภาพและความถูกต้องของ Config อัตโนมัติด้วย Formatter, Linter, และ Tests

```yaml
name: Neovim Config CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  lint_and_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Stylua (Formatter)
        uses: JohnnyMorganz/stylua-action@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          args: --check .

      - name: Setup Neovim
        uses: rhysd/action-setup-vim@v1
        with: { neovim: true }

      - name: Run Tests
        run: nvim --headless -c "PlenaryBustedDirectory tests/ { minimal_init = 'init.lua' }"
```

## Rules

- ใช้ `lazy.nvim` สำหรับ plugin management
- ทุก plugin ใช้ lazy loading เป็น default (`ft`, `cmd`, `keys`, `event`)
- แยกไฟล์: `options.lua`, `keymaps.lua`, `autocmds.lua`, plugins แยกตามหมวด
- ใช้ `stylua` สำหรับ formatting
- เขียน unit tests ด้วย `plenary.nvim` สำหรับ utility functions
- ใช้ CI (GitHub Actions) สำหรับ automated checks
- Neovim startup time < 50ms

## Expected Outcome

- Neovim config เป็น modular และ performant
- ทุก plugin lazy load เป็น default
- มี unit tests สำหรับ utility functions
- ใช้ `stylua` สำหรับ formatting
- CI รัน automated checks


## References

- `nvim` content: `references/nvim/`
