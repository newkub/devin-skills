---
title: Performance Principles
description: หลักการปรับปรุง Performance ใน Neovim
---

## Goal

ปรับปรุง performance ของ Neovim configuration และ plugins

## Scope

ใช้สำหรับการ optimize startup time, runtime performance, และ memory usage

## Execute

### 1. Startup Performance

#### Profile Startup

Profile startup time:

```lua
-- Add to top of init.lua
local start_time = vim.loop.hrtime()

vim.api.nvim_create_autocmd('VimEnter', {
  callback = function()
    local end_time = vim.loop.hrtime()
    print('Startup time:', (end_time - start_time) / 1e6, 'ms')
  end,
})
```

#### Lazy Loading

ใช้ lazy loading สำหรับ plugins:

```lua
-- Lazy load plugin
use({
  'tpope/vim-fugitive',
  cmd = 'Git',
  config = function()
    -- Setup only when loaded
  end,
})
```

#### Disable Unused Features

ปิด features ที่ไม่ใช้:

```lua
-- Disable providers
vim.g.loaded_python3_provider = 0
vim.g.loaded_ruby_provider = 0
vim.g.loaded_perl_provider = 0

-- Disable built-in plugins
vim.g.loaded_gzip = 0
vim.g.loaded_tar = 0
vim.g.loaded_zip = 0
```

### 2. Runtime Performance

#### Optimize Autocommands

จำกัด autocommands:

```lua
-- Use pattern matching
vim.api.nvim_create_autocmd('FileType', {
  pattern = { 'lua', 'vim' },
  callback = function()
    -- Only run for specific filetypes
  end,
})

-- Use once if needed
vim.api.nvim_create_autocmd('VimEnter', {
  once = true,
  callback = function()
    -- Run only once
  end,
})
```

#### Optimize Highlighting

ปิด features สำหรับ large files:

```lua
vim.api.nvim_create_autocmd('BufReadPre', {
  callback = function()
    local size = vim.fn.getfsize(vim.fn.expand('%:p'))
    if size > 100 * 1024 then -- 100 KB
      vim.cmd('syntax off')
      vim.opt_local.foldmethod = 'manual'
    end
  end,
})
```

#### Optimize Treesitter

ปิด Treesitter สำหรับ large files:

```lua
require('nvim-treesitter.configs').setup({
  highlight = {
    disable = function(lang, buf)
      local max_filesize = 100 * 1024
      local ok, stats = pcall(vim.loop.fs_stat, vim.api.nvim_buf_get_name(buf))
      if ok and stats and stats.size > max_filesize then
        return true
      end
    end,
  },
})
```

### 3. Memory Management

#### Clear Unused Buffers

ลบ buffers ที่ไม่ใช้:

```lua
vim.api.nvim_create_autocmd('BufEnter', {
  callback = function()
    -- Close hidden buffers after some time
  end,
})
```

#### Limit Undo History

จำกัด undo history:

```lua
vim.opt.undolevels = 1000
vim.opt.undoreload = 10000
```

#### Disable Swap Files

ปิด swap files สำหรับ temp files:

```lua
vim.api.nvim_create_autocmd('BufWritePre', {
  pattern = '/tmp/*',
  callback = function()
    vim.opt_local.swapfile = false
  end,
})
```

### 4. Plugin Optimization

#### Use Lazy.nvim

ใช้ lazy loading framework:

```lua
require('lazy').setup({
  spec = {
    -- Lazy load plugins
    { 'nvim-lualine/lualine.nvim', event = 'VeryLazy' },
    { 'nvim-telescope/telescope.nvim', cmd = 'Telescope' },
  },
  performance = {
    rtp = {
      disabled_plugins = {
        'gzip',
        'tarPlugin',
        'tohtml',
        'tutor',
      },
    },
  },
})
```

#### Optimize LSP

จำกัด LSP capabilities:

```lua
lspconfig.tsserver.setup({
  capabilities = {
    textDocument = {
      completion = {
        completionItem = {
          snippetSupport = false, -- Disable if not needed
        },
      },
    },
  },
})
```

### 5. Filetype Detection

#### Optimize Filetype Detection

ตั้งค่า filetype detection:

```lua
-- Disable slow filetype detection
vim.g.do_filetype_lua = 1
vim.g.did_load_filetypes = 1

-- Manual filetype detection
vim.api.nvim_create_autocmd('BufRead', {
  pattern = '*.ext',
  callback = function()
    vim.bo.filetype = 'custom'
  end,
})
```

### 6. Search Performance

#### Use Ripgrep

ใช้ ripgrep แทน built-in grep:

```lua
vim.opt.grepprg = 'rg --vimgrep --no-heading'
vim.opt.grepformat = '%f:%l:%c:%m'
```

#### Optimize Search

ปิด highlight สำหรับ large searches:

```vim
:nohlsearch " Disable highlight
:set noincsearch " Disable incremental search
```

### 7. UI Performance

#### Disable UI Features

ปิด UI features ที่ไม่ใช้:

```lua
vim.opt.cursorline = false
vim.opt.signcolumn = 'no'
vim.opt.number = false
```

#### Optimize Redraw

จำกัด redraws:

```lua
vim.opt.lazyredraw = true
```

### 8. Event Loop Optimization

#### Use Async Operations

ใช้ async operations:

```lua
-- Use vim.loop for async
vim.loop.new_timer():start(1000, 0, function()
  print('Async operation')
end)
```

### 9. Profiling

#### Profile Scripts

Profile Lua scripts:

```vim
:profile start profile.log
:profile func *
" Do something
:profile stop
:e profile.log
```

#### Monitor Memory

Monitor memory usage:

```lua
vim.api.nvim_create_autocmd('VimResized', {
  callback = function()
    print('Memory:', collectgarbage('count'), 'KB')
  end,
})
```

### 10. Best Practices

- **Lazy load plugins**: Load เฉพาะเมื่อต้องการ
- **Disable unused features**: ปิด features ที่ไม่ใช้
- **Use modern tools**: ripgrep, fd, แทน built-in tools
- **Profile regularly**: Check performance อย่างสม่ำเสมอ
- **Limit scope**: จำกัด operations ตาม filetype, buffer size

## Rules

- Profile startup time อย่างสม่ำเสมอ
- Lazy load plugins ที่ไม่จำเป็นต้องใช้ทันที
- ปิด features สำหรับ large files
- ใช้ async operations สำหรับ blocking tasks

## Expected Outcome

- Startup time < 100ms
- Runtime performance ดี
- Memory usage ต่ำ
- Smooth editing experience
