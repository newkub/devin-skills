# Key Mappings

## Definition

Key mappings คือการ custom key bindings:
- Map keys ไปยัง commands
- Create shortcuts
- Improve workflow
- Personalize editor

## Mapping Modes

### Normal Mode
```lua
vim.keymap.set("n", "<leader>f", ":Telescope find_files<CR>")
```

### Insert Mode
```lua
vim.keymap.set("i", "jj", "<Esc>")
```

### Visual Mode
```lua
vim.keymap.set("v", "<leader>y", '"+y')
```

### Command Mode
```lua
vim.keymap.set("c", "<leader>w", "<C-w>")
```

## Mapping Examples

### Leader Key
```lua
vim.g.mapleader = " "
vim.keymap.set("n", "<leader>w", ":w<CR>")
vim.keymap.set("n", "<leader>q", ":q<CR>")
```

### Navigation
```lua
vim.keymap.set("n", "<C-h>", "<C-w>h")
vim.keymap.set("n", "<C-j>", "<C-w>j")
vim.keymap.set("n", "<C-k>", "<C-w>k")
vim.keymap.set("n", "<C-l>", "<C-w>l")
```

### Buffers
```lua
vim.keymap.set("n", "<leader>bn", ":bnext<CR>")
vim.keymap.set("n", "<leader>bp", ":bprevious<CR>")
```

## Best Practices

1. **Use Leader Key**: ใช้ leader key สำหรับ custom mappings
2. **Avoid Conflicts**: ไม่ map keys ที่ conflict กับ default
3. **Document**: Document key mappings
4. **Consistent**: ใช้ patterns ที่ consistent
5. **Test**: Test mappings หลังเพิ่ม
