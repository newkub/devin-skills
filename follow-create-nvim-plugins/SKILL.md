---
name: follow-create-nvim-plugins
description: ตั้งค่า Neovim plugins ด้วย lazy.nvim
---

## Goal

ตั้งค่าและจัดการ Neovim plugins ด้วย `lazy.nvim` ตาม best practices

## Scope

ใช้สำหรับ project ที่ต้องการสร้างหรือจัดการ Neovim plugins

## Execute

### 1. Prepare

> Goal: ตรวจสอบ requirements ก่อนเริ่ม

1. ติดตั้ง Neovim >= 0.8.0 (build ด้วย LuaJIT)
2. ติดตั้ง Git >= 2.19.0
3. มี `init.lua` สำหรับ entry point

### 2. Config Structure

> Goal: สร้างโครงสร้าง config สำหรับ lazy.nvim

1. สร้าง `lua/plugins/` directory สำหรับ plugin specs
2. แยก plugin specs เป็นไฟล์ต่างๆ ตามหมวด — ดู [references/plugin-configuration.md](references/plugin-configuration.md)
3. ใช้ `return {}` สำหรับแต่ละ plugin spec

### 3. Bootstrap lazy.nvim

> Goal: ติดตั้ง lazy.nvim ใน `init.lua`

1. Bootstrap lazy.nvim ใน `init.lua` — ดู [references/lazy-nvim-setup.md](references/lazy-nvim-setup.md)
2. ตั้งค่า `lazy.nvim` พร้อม plugin specs
3. ใช้ `require('lazy').setup(specs)`

### 4. Plugin Specs

> Goal: กำหนด plugin specs

1. กำหนด plugin ด้วย URL (เช่น `github.com/user/plugin`)
2. ใช้ `lazy = true` เป็น default
3. ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers
4. ใช้ `config` function สำหรับ plugin configuration
5. ใช้ `dependencies` สำหรับ plugin dependencies

### 5. Performance

> Goal: เพิ่มประสิทธิภาพ Neovim startup

1. ใช้ lazy loading สำหรับทุก plugin — ดู [references/plugin-management.md](references/plugin-management.md)
2. หลีกเลี่ยงการโหลด plugin ที่ไม่จำเป็น
3. ใช้ `priority` สำหรับ plugins ที่ต้องโหลดก่อน

### 6. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Management

- ใช้ `lazy.nvim` สำหรับ plugin management — ดู [references/lazy-nvim-setup.md](references/lazy-nvim-setup.md)
- ทุก plugin lazy load เป็น default
- แยก plugin specs เป็นไฟล์ต่างๆ ใน `lua/plugins/` — ดู [references/plugin-configuration.md](references/plugin-configuration.md)
- ใช้ `lockfile` สำหรับ lock plugin versions

### 2. Performance

- ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers — ดู [references/plugin-configuration.md](references/plugin-configuration.md)
- หลีกเลี่ยงการโหลด plugin ที่ไม่จำเป็น
- Neovim startup time < 50ms — ดู [references/plugin-management.md](references/plugin-management.md)

## Expected Outcome

- Neovim plugins จัดการด้วย `lazy.nvim`
- ทุก plugin lazy load เป็น default
- Plugin specs แยกเป็นไฟล์ใน `lua/plugins/`
- Neovim startup < 50ms
- มี lockfile สำหรับ lock plugin versions
