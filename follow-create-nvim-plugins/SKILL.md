---
name: follow-create-nvim-plugins
description: ตั้งค่า Neovim plugins ด้วย lazy.nvim
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - ship-code
---

## Goal

ตั้งค่าและจัดการ Neovim plugins ด้วย `lazy.nvim` ตาม best practices

## Scope

ใช้สำหรับ project ที่ต้องการสร้างหรือจัดการ Neovim plugins

## Execute

### 1. เตรียมความพร้อม

> Goal: ตรวจสอบ requirements ก่อนเริ่ม
> Goal: มี requirements ครบก่อนเริ่ม

1. ติดตั้ง Neovim 0.9+
2. ติดตั้ง Git
3. มี `init.lua` สำหรับ entry point

### 2. Config Structure

> Goal: สร้างโครงสร้าง config สำหรับ lazy.nvim
> Goal: มีโครงสร้าง config ที่ถูกต้อง

1. สร้าง `lua/plugins/` directory สำหรับ plugin specs
2. แยก plugin specs เป็นไฟล์ต่างๆ ตามหมวด
3. ใช้ `return {}` สำหรับแต่ละ plugin spec

### 3. Bootstrap lazy.nvim

> Goal: ติดตั้ง lazy.nvim ใน `init.lua`
> Goal: lazy.nvim ติดตั้งและทำงานได้

1. Bootstrap lazy.nvim ใน `init.lua`
2. ตั้งค่า `lazy.nvim` พร้อม plugin specs
3. ใช้ `require('lazy').setup(specs)`

### 4. Plugin Specs

> Goal: กำหนด plugin specs
> Goal: plugin specs ชัดเจนและ lazy load ถูกต้อง

1. กำหนด plugin ด้วย URL (เช่น `github.com/user/plugin`)
2. ใช้ `lazy = true` เป็น default
3. ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers
4. ใช้ `config` function สำหรับ plugin configuration
5. ใช้ `dependencies` สำหรับ plugin dependencies

### 5. Performance

> Goal: เพิ่มประสิทธิภาพ Neovim startup
> Goal: Neovim startup < 50ms

1. ใช้ lazy loading สำหรับทุก plugin
2. หลีกเลี่ยงการโหลด plugin ที่ไม่จำเป็น
3. ใช้ `priority` สำหรับ plugins ที่ต้องโหลดก่อน

### Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

- ใช้ `lazy.nvim` สำหรับ plugin management
- ทุก plugin lazy load เป็น default
- แยก plugin specs เป็นไฟล์ต่างๆ ใน `lua/plugins/`
- ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers
- ใช้ `lockfile` สำหรับ lock plugin versions
- Neovim startup time < 50ms

## Expected Outcome

- Neovim plugins จัดการด้วย `lazy.nvim`
- ทุก plugin lazy load เป็น default
- Plugin specs แยกเป็นไฟล์ใน `lua/plugins/`
- Neovim startup < 50ms
- มี lockfile สำหรับ lock plugin versions

### 1. เตรียมความพร้อม

### 1.1 ตรวจสอบ requirements

- Neovim >= 0.8.0 (ต้อง build ด้วย LuaJIT)
- Git >= 2.19.0 (สำหรับ partial clones)
- Nerd Font (optional)

### 1.2 สร้าง config structure

```text
~/.config/nvim/
├── init.lua
├── lua/
│   ├── config/
│   │   ├── lazy.lua
│   │   ├── options.lua
│   │   └── keymaps.lua
│   └── plugins/
│       ├── core.lua
│       ├── ui.lua
│       └── lsp.lua
```
