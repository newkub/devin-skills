## 2. ติดตั้ง lazy.nvim

### 2.1 Bootstrap lazy.nvim

สร้างไฟล์ `lua/config/lazy.lua`:

```lua
-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"

if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = "https://github.com/folke/lazy.nvim.git"
  local out = vim.fn.system({
    "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath
  })

  if vim.v.shell_error ~= 0 then
    vim.api.nvim_echo({
      { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
      { out, "WarningMsg" },
      { "\nPress any key to exit..." },
    }, true, {})
    vim.fn.getchar()
    os.exit(1)
  end
end

vim.opt.rtp:prepend(lazypath)

-- ตั้งค่า leader keys ก่อนโหลด lazy.nvim
vim.g.mapleader = " "
vim.g.maplocalleader = "\\"
```

### 2.2 Setup lazy.nvim

เพิ่มใน `lua/config/lazy.lua`:

```lua
-- Setup lazy.nvim
require("lazy").setup({
  spec = {
    { "import", "plugins" },
  },
  install = {
    colorscheme = { "habamax" },
  },
  checker = {
    enabled = true,
  },
  change_detection = {
    notify = false,
  },
})
```
