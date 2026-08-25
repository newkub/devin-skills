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
