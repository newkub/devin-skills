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
