---
name: follow-create-nvim-plugin
description: ตั้งค่า Neovim plugins ด้วย lazy.nvim
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - deep-review
  - ship-to-dev-branch

---
## Goal

ตั้งค่าและจัดการ Neovim plugins ด้วย `lazy.nvim` ตาม best practices

## Scope

ใช้สำหรับ project ที่ต้องการสร้างหรือจัดการ Neovim plugins

- Packages: Neovim >= 0.8.0 + `lazy.nvim` — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)
- Neovim 0.12 มี `vim.pack` built-in plugin manager — ใช้เป็นทางเลือกแทน lazy.nvim ได้ถ้าไม่ต้องการ lazy-loading features ขั้นสูง

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create nvim plugins)

### 2. Prepare

> Goal: ตรวจสอบ requirements ก่อนเริ่ม

1. ติดตั้ง Neovim >= 0.8.0 (เช็คเวอร์ชันล่าสุดด้วย `/deep-research`)
2. ติดตั้ง Git >= 2.19.0
3. มี `init.lua` สำหรับ entry point

### 3. Config Structure

> Goal: สร้างโครงสร้าง config สำหรับ lazy.nvim

1. สร้าง `lua/plugins/` directory สำหรับ plugin specs
2. แยก plugin specs เป็นไฟล์ต่างๆ ตามหมวด — `lua/plugins/core.lua`, `ui.lua`, `lsp.lua`, `coding.lua`; ใน setup ใช้ `{ import = "plugins" }`
3. ใช้ `return {}` สำหรับแต่ละ plugin spec

### 4. Bootstrap lazy.nvim

> Goal: ติดตั้ง lazy.nvim ใน `init.lua`

1. Bootstrap ใน `lua/config/lazy.lua`: clone lazy.nvim ไป `vim.fn.stdpath("data") .. "/lazy/lazy.nvim"` ถ้ายังไม่มี แล้ว `vim.opt.rtp:prepend(lazypath)`
2. ตั้ง leader keys ก่อนโหลด lazy.nvim: `vim.g.mapleader = " "`, `vim.g.maplocalleader = "\\"`
3. ใช้ `require('lazy').setup({ import = "plugins" })` หรือ specs table โดยตรง

### 5. Plugin Specs

> Goal: กำหนด plugin specs

1. กำหนด plugin ด้วย URL (เช่น `github.com/user/plugin`)
2. ใช้ `lazy = true` เป็น default
3. ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers
4. ใช้ `opts` table แทน `config` function เมื่อเป็นไปได้ (lazy.nvim merge `opts` ให้ plugin ที่มี `setup()`); ใช้ `config` เฉพาะเมื่อต้อง custom logic
5. ใช้ `dependencies` สำหรับ plugin dependencies; `dev = true` + `dir` สำหรับ local plugin development; pin version ด้วย `version`/`tag`/`branch`/`commit` ตามต้องการ

### 6. Performance

> Goal: เพิ่มประสิทธิภาพ Neovim startup

1. ใช้ lazy loading สำหรับทุก plugin — จัดกลุ่มตามการใช้งานและตรวจ startup ด้วย `:Lazy profile`
2. หลีกเลี่ยงการโหลด plugin ที่ไม่จำเป็น
3. ใช้ `priority` สำหรับ plugins ที่ต้องโหลดก่อน
4. Commands: `:Lazy` (UI), `:Lazy install`, `:Lazy update`, `:Lazy sync`, `:Lazy clean`; troubleshoot ด้วย `:version`, `git --version`, `:Lazy` status

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship-to-dev-branch`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Management

- ใช้ `lazy.nvim` สำหรับ plugin management
- ทุก plugin lazy load เป็น default
- แยก plugin specs เป็นไฟล์ต่างๆ ใน `lua/plugins/`
- commit `lazy-lock.json` เข้า git สำหรับ reproducible setup

### 2. Performance

- ใช้ `ft`, `cmd`, `keys`, `event` สำหรับ lazy loading triggers
- หลีกเลี่ยงการโหลด plugin ที่ไม่จำเป็น
- Neovim startup time < 50ms (ตรวจด้วย `:Lazy profile`)

- ใช้ /follow-create-sdk ถ้าจำเป็น

## Expected Outcome

- Neovim plugins จัดการด้วย `lazy.nvim`
- ทุก plugin lazy load เป็น default
- Plugin specs แยกเป็นไฟล์ใน `lua/plugins/`
- Neovim startup < 50ms
- มี lockfile สำหรับ lock plugin versions

