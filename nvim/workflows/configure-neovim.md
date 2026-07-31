# Configure Neovim

## Description

ตั้งค่า Neovim ด้วย init.lua

## Steps

### 1. Create init.lua

```bash
# Linux/macOS
touch ~/.config/nvim/init.lua

# Windows
type nul > %LOCALAPPDATA%\nvim\init.lua
```

### 2. Basic Configuration

```lua
-- init.lua
-- Basic options
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 4
vim.opt.shiftwidth = 4
vim.opt.expandtab = true
vim.opt.smartindent = true
vim.opt.wrap = false
vim.opt.swapfile = false
vim.opt.backup = false
vim.opt.undodir = os.getenv("HOME") .. "/.vim/undodir"
vim.opt.undofile = true
vim.opt.hlsearch = false
vim.opt.incsearch = true
vim.opt.termguicolors = true
vim.opt.scrolloff = 8
vim.opt.signcolumn = "yes"
vim.opt.updatetime = 50
vim.opt.colorcolumn = "80"
```

### 3. Key Mappings

```lua
-- Leader key
vim.g.mapleader = " "

-- Save and quit
vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")

-- Navigation
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")

-- Buffers
vim.keymap.set("n", "<leader>bn", ":bnext<CR>")
vim.keymap.set("n", "<leader>bp", ":bprevious<CR>")
```

### 4. Plugin Manager (lazy.nvim)

```lua
-- init.lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  "tpope/vim-fugitive",
  "nvim-telescope/telescope.nvim",
})
```

## Best Practices

1. **Modular Config**: แบ่ง configuration เป็น modules
2. **Document**: Document configuration choices
3. **Version Control**: Track config ใน Git
4. **Test**: Test configuration หลังเปลี่ยน
5. **Backup**: Backup configuration ก่อน major changes
