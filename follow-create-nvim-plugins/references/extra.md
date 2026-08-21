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

## 3. จัดการ Plugins

### 3.1 สร้าง plugin specs

สร้างไฟล์ `lua/plugins/core.lua`:

```lua
return {
  -- Colorscheme
  {
    "folke/tokyonight.nvim",
    lazy = false,
    priority = 1000,
    config = function()
      vim.cmd([[colorscheme tokyonight]])
    end,
  },

  -- Which key
  {
    "folke/which-key.nvim",
    event = "VeryLazy",
    opts = {},
  },

  -- Dev icons
  {
    "nvim-tree/nvim-web-devicons",
    lazy = true,
  },
}
```

### 3.2 Plugin lazy loading

ใช้ lazy loading ตามประเภท:

```lua
-- Event-based
{
  "stevearc/dressing.nvim",
  event = "VeryLazy",
}

-- Filetype-based
{
    "nvim-neorg/neorg",
    ft = "norg",
    opts = {
      load = {
        ["core.defaults"] = {},
      },
    },
}

-- Command-based
{
  "dstein64/vim-startuptime",
  cmd = "StartupTime",
}

-- Key-based
{
  "Wansmer/treesj",
  keys = {
    { "J", "<cmd>TSJToggle<cr>", desc = "Join Toggle" },
  },
}
```

## 4. Plugin Configuration

### 4.1 ใช้ opts แทน config

```lua
-- ถูกต้อง - ใช้ opts
{
  "folke/todo-comments.nvim",
  opts = {
    signs = true,
  },
}

-- หลีกเลี่ยง - ใช้ config
{
  "folke/todo-comments.nvim",
  config = function()
    require("todo-comments").setup({
      signs = true,
    })
  end,
}
```

### 4.2 Dependencies

```lua
{
  "hrsh7th/nvim-cmp",
  event = "InsertEnter",
  dependencies = {
    "hrsh7th/cmp-nvim-lsp",
    "hrsh7th/cmp-buffer",
  },
  opts = {},
}
```

## 5. Advanced Features

### 5.1 Local plugins

```lua
-- Plugin ในเครื่อง
{
  dir = "~/projects/secret.nvim",
}

-- Development mode
{
  "folke/noice.nvim",
  dev = true,
}
```

### 5.2 Versioning

```lua
{
  "neovim/nvim-lspconfig",
  version = "^1.0.0", -- Semver
  tag = "v1.0.0",     -- Specific tag
  commit = "abc123",  -- Specific commit
  branch = "stable",  -- Specific branch
}
```

## 6. Plugin Management

### 6.1 คำสั่งพื้นฐาน

- `:Lazy` - เปิด UI
- `:Lazy install` - ติดตั้ง plugins
- `:Lazy update` - อัปเดต plugins
- `:Lazy sync` - ติดตั้งและอัปเดต
- `:Lazy clean` - ลบ plugins ที่ไม่ใช้

### 6.2 Performance optimization

- ใช้ lazy loading เพื่อเพิ่ม startup speed
- จัดกลุ่ม plugins ตามการใช้งาน
- ตรวจสอบด้วย `:Lazy profile`

## 7. Best Practices

### 7.1 แยก config files

- `lua/plugins/core.lua` - plugins หลัก
- `lua/plugins/ui.lua` - UI plugins
- `lua/plugins/lsp.lua` - LSP plugins
- `lua/plugins/coding.lua` - coding plugins

### 7.2 ใช้ import pattern

```lua
-- ใน lazy setup
require("lazy").setup({
  spec = {
    { "import", "plugins.core" },
    { "import", "plugins.ui" },
    { "import", "plugins.lsp" },
  },
})
```

### 7.3 Lockfile

- `lazy-lock.json` เก็บ plugin versions
- commit ไฟล์นี้ใน git
- ใช้สำหรับ reproducible setup

## 8. Troubleshooting

### 8.1 ปัญหาทั่วไป

- ตรวจสอบ Neovim version: `:version`
- ตรวจสอบ Git version: `git --version`
- ตรวจสอบ plugin status: `:Lazy`

### 8.2 Debug mode

```lua
-- เปิด debug ใน lazy setup
require("lazy").setup({
  spec = { ... },
  debug = true,
})
```

## 9. Resources

- [Official Documentation](https://lazy.folke.io/)
- [Plugin Examples](https://lazy.folke.io/spec/examples)
- [Awesome Neovim](https://github.com/rockerBOO/awesome-neovim)
- [Neovim Craft](https://neovimcraft.com)
