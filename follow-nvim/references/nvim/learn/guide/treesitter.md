---
title: Treesitter Guide
description: คู่มือการใช้งาน Treesitter ใน Neovim
---

## Goal

ใช้งาน Treesitter ใน Neovim เพื่อ syntax highlighting, code folding, และ text objects ที่ accurate กว่า regex-based

## Scope

ใช้สำหรับการติดตั้ง parsers, configuration, และใช้งาน Treesitter features

## Execute

### 1. What is Treesitter?

Treesitter เป็น parsing tool ที่ใช้ incremental parsing สำหรับ understand code structure มีประโยชน์สำหรับ:

- **Syntax highlighting**: accurate กว่า regex
- **Code folding**: fold ตาม code structure
- **Text objects**: select ตาม syntax (function, class, etc.)
- **Indentation**: auto-indent ที่ accurate

### 2. Installation

ติดตั้ง `nvim-treesitter` plugin:

```lua
use({
  'nvim-treesitter/nvim-treesitter',
  run = function()
    require('nvim-treesitter.install').update({ with_sync = true })
  end,
})
```

### 3. Basic Setup

ตั้งค่า Treesitter พื้นฐาน:

```lua
require('nvim-treesitter.configs').setup({
  ensure_installed = {
    'lua',
    'vim',
    'vimdoc',
    'javascript',
    'typescript',
    'python',
    'go',
    'rust',
  },
  sync_install = false,
  auto_install = true,
  highlight = {
    enable = true,
    additional_vim_regex_highlighting = false,
  },
  indent = {
    enable = true,
  },
})
```

### 4. Supported Languages

ตาราง parsers ที่นิยมใช้:

| Language | Parser Name |
|----------|-------------|
| Lua | `lua` |
| Vim | `vim` |
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| Python | `python` |
| Go | `go` |
| Rust | `rust` |
| C | `c` |
| C++ | `cpp` |
| HTML | `html` |
| CSS | `css` |
| JSON | `json` |
| Markdown | `markdown` |
| YAML | `yaml` |

### 5. Syntax Highlighting

ตั้งค่า syntax highlighting:

```lua
require('nvim-treesitter.configs').setup({
  highlight = {
    enable = true,
    disable = function(lang, buf)
      local max_filesize = 100 * 1024 -- 100 KB
      local ok, stats = pcall(vim.loop.fs_stat, vim.api.nvim_buf_get_name(buf))
      if ok and stats and stats.size > max_filesize then
        return true
      end
    end,
    additional_vim_regex_highlighting = false,
  },
})
```

### 6. Code Folding

ตั้งค่า code folding:

```lua
require('nvim-treesitter.configs').setup({
  fold = {
    enable = true,
    foldmethod = 'expr',
    foldexpr = 'nvim_treesitter#foldexpr()',
  },
})

-- Keybindings for folding
vim.keymap.set('n', 'zR', require('nvim-treesitter.fold').open, { desc = 'Open all folds' })
vim.keymap.set('n', 'zM', require('nvim-treesitter.fold').close, { desc = 'Close all folds' })
```

### 7. Text Objects

ใช้ Treesitter text objects:

```lua
require('nvim-treesitter.configs').setup({
  textobjects = {
    select = {
      enable = true,
      lookahead = true,
      keymaps = {
        ['af'] = '@function.outer',
        ['if'] = '@function.inner',
        ['ac'] = '@class.outer',
        ['ic'] = '@class.inner',
      },
    },
    move = {
      enable = true,
      set_jumps = true,
      goto_next_start = {
        [']m'] = '@function.outer',
        [']]'] = '@class.outer',
      },
      goto_next_end = {
        [']M'] = '@function.outer',
        [']['] = '@class.outer',
      },
    },
  },
})
```

### 8. Indentation

ตั้งค่า indentation:

```lua
require('nvim-treesitter.configs').setup({
  indent = {
    enable = true,
    disable = { 'python' }, -- Python ใช้ built-in indent
  },
})
```

### 9. Incremental Selection

ตั้งค่า incremental selection:

```lua
require('nvim-treesitter.configs').setup({
  incremental_selection = {
    enable = true,
    keymaps = {
      init_selection = '<CR>',
      node_incremental = '<CR>',
      scope_incremental = '<TAB>',
      node_decremental = '<S-TAB>',
    },
  },
})
```

### 10. Query Editing

ใช้ Treesitter queries สำหรับ custom highlighting:

```lua
vim.cmd([[highlight TSError guifg=#ff0000 guibg=#000000]])

require('nvim-treesitter.query').set_query('lua', 'highlights', [[
  [
    (function_call)
    (method_call)
  ] @function.call
]])
```

### 11. Troubleshooting

#### Check Parser Status

```vim
:TSInstallInfo
```

#### Install Specific Parser

```vim
:TSInstall python
```

#### Update Parsers

```vim
:TSUpdate
```

#### Uninstall Parser

```vim
:TSUninstall python
```

#### Toggle Highlighting

```vim
:TSBufToggle highlight
```

## Rules

- ใช้ `ensure_installed` สำหรับ parsers ที่ต้องการ
- ปิด regex highlighting เมื่อใช้ Treesitter (`additional_vim_regex_highlighting = false`)
- ใช้ text objects สำหรับ selection ที่ accurate กว่า
- ปิด Treesitter สำหรับไฟล์ขนาดใหญ่เพื่อ performance

## Expected Outcome

- Syntax highlighting ที่ accurate
- Code folding ตาม structure
- Text objects ที่ smart
- Indentation ที่ถูกต้อง
