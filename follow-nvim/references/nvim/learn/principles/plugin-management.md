# Plugin Management

## Definition

Plugin management คือการจัดการ Neovim plugins:
- Install plugins
- Configure plugins
- Update plugins
- Manage plugin dependencies

## Plugin Managers

### lazy.nvim (Recommended)
```lua
-- init.lua
require("lazy").setup({
  "tpope/vim-fugitive",
  "nvim-telescope/telescope.nvim",
})
```

### packer.nvim (Legacy)
```lua
-- init.lua
require("packer").startup(function()
  use "tpope/vim-fugitive"
  use "nvim-telescope/telescope.nvim"
end)
```

### vim-plug (Legacy)
```vim
" init.vim
call plug#begin()
Plug "tpope/vim-fugitive"
Plug "nvim-telescope/telescope.nvim"
call plug#end()
```

## lazy.nvim Features

### Lazy Loading
```lua
{
  "nvim-telescope/telescope.nvim",
  cmd = "Telescope",
  keys = "<leader>f",
}
```

### Dependencies
```lua
{
  "hrsh7th/nvim-cmp",
  dependencies = {
    "hrsh7th/cmp-buffer",
    "hrsh7th/cmp-path",
  },
}
```

### Configuration
```lua
{
  "nvim-telescope/telescope.nvim",
  config = function()
    require("telescope").setup({})
  end,
}
```

## Best Practices

1. **Use lazy.nvim**: ใช้ lazy.nvim เป็น plugin manager หลัก
2. **Lazy Load**: Lazy load plugins เพื่อ startup time
3. **Document**: Document ว่าแต่ละ plugin ทำอะไร
4. **Update Regularly**: Update plugins เป็นประจำ
5. **Remove Unused**: ลบ plugins ที่ไม่ใช้
