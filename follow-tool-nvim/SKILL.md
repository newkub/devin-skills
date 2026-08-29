---
name: follow-tool-nvim
description: ตั้งค่า Neovim configuration ด้วย lazy.nvim ตาม best practices
related:
  - follow-lang-lua
  - follow-tool-formatter
  - follow-create-nvim-plugins
  - follow-test
---

## Goal

ตั้งค่า Neovim configuration ที modular, lazy-loaded และ maintainable ด้วย `lazy.nvim`

## Scope

ใช้สำหรับสร้างหรือ refactor Neovim config บน `~/.config/nvim` หรือ project-specific config

## Execute

### 1. Install Neovim

> Goal: ติดตั้ง Neovim ก่อนตั้งค่า lazy.nvim

1. ติดตั้ง Neovim >= 0.8.0 (build ด้วย LuaJIT):
   - Windows: ดาวน์โหลดจาก [Neovim releases](https://github.com/neovim/neovim/releases) หรือ `scoop install neovim`
   - macOS: `brew install neovim`
   - Linux: `sudo apt install neovim` หรือ `sudo pacman -S neovim`
   - mise: `mise use -g neovim` (ถ้าใช้ mise)
2. ติดตั้ง Git >= 2.19.0 (lazy.nvim ใช้ partial clones)
3. ตรวจสอบ `nvim --version` ก่อนดำเนินการต่อ
4. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 2. Bootstrap lazy.nvim

> Goal: ติดตั้ง lazy.nvim plugin manager

1. สร้าง `init.lua` ที `~/.config/nvim/init.lua`
2. สร้าง `lua/config/lazy.lua` เพื่อ clone stable branch ของ `lazy.nvim`
3. ใช้ `require("config.lazy")` ใน `init.lua`
4. รัน `:checkhealth lazy` เพื่อตรวจสอบ
5. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 3. Structure Config

> Goal: แยกไฟล์ config ตาม responsibility

1. สร้าง `lua/core/options.lua` สำหรับ `vim.opt`
2. สร้าง `lua/core/keymaps.lua` สำหรับ keymaps
3. สร้าง `lua/core/autocmds.lua` สำหรับ autocommands
4. สร้าง `lua/plugins/*.lua` สำหรับ plugin specs
5. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 4. Add Plugins

> Goal: เพิ่ม plugins ด้วย lazy loading

1. ใช้ `lazy = true` เป็น default
2. ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy-loading
3. ใช้ `dependencies` สำหรับ plugin dependencies
4. ใช้ `version`, `tag`, `branch` หรือ `commit` เพื่อ pin version
5. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 5. Configure LSP and Formatting

> Goal: ตั้งค่า LSP, formatter และ linting

1. ติดตั้ง `nvim-lspconfig`, `mason.nvim` และ null-ls/formatter ที project ต้องการ
2. ตั้งค่า auto format on save ผ่าน autocommand
3. ใช้ `stylua` สำหรับ format Lua
4. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 6. Add Tests

> Goal: เขียน tests สำหรับ utility functions

1. ติดตั้ง `plenary.nvim`
2. สร้าง `tests/utils_spec.lua` สำหรับ unit tests
3. รัน `:PlenaryBustedFile %` หรือ `:PlenaryBustedDirectory tests/`
4. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

### 7. CI and Quality

> Goal: ตั้งค่า automated checks

1. ใช้ GitHub Actions รัน `stylua --check .`
2. รัน Plenary tests ด้วย `nvim --headless -c "PlenaryBustedDirectory tests/ { minimal_init = 'init.lua' }"`
3. ตรวจ startup time ให้ < 50ms
4. ดูรายละเอียดใน [references/lazy-nvim.md](references/lazy-nvim.md)

## Rules

### 1. Structure

- `init.lua` ทำหน้าที bootstrap `lazy.nvim` เท่านั้น
- แยก `options.lua`, `keymaps.lua`, `autocmds.lua`, plugins เป็นไฟล์ย่อย
- ทุก plugin มี lazy loading ยกเว้น colorscheme ทีต้อง load on startup

### 2. Performance

- ใช้ `ft`, `cmd`, `keys`, `event` เพื่อ lazy load
- ตรวจ startup time ด้วย `vim-startuptime` หรือ `:StartupTime`
- เป้าหมาย startup time < 50ms

### 3. Code Quality

- ใช้ `stylua` สำหรับ format Lua
- ใช้ `plenary.nvim` เขียน unit tests สำหรับ utilities
- ใส่ `desc` ในทุก keymap เพื่อ `which-key`

### 4. Maintenance

- pin plugin versions เมื่อต้องการ stability
- อัปเดต plugins ผ่าน `:Lazy update`
- ตรวจ `lazy-lock.json` หลังอัปเดต

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- Neovim config เป็น modular และ easy to maintain
- ทุก plugin lazy load เป็น default
- LSP, formatter และ linter ทำงานได้
- Unit tests สำหรับ utilities รันได้
- CI ตรวจ format และ tests อัตโนมัติ
