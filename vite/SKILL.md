---
name: vite
description: "Modern frontend build tool with Native ESM, Rolldown bundler, and instant HMR"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้ Vite สำหรับ frontend build tool ด้วย Native ESM, Rolldown (Rust-based bundler), HMR ที่รวดเร็ว, และ Plugin API


## Scope

ใช้สำหรับ build และ development ของ frontend projects ด้วย Vite 8+


## Execute

### 1. Installation

ติดตั้ง Vite ด้วย `bun add -D vite`
ต้องการ Node.js ^20.19.0 หรือ >=22.12.0

### 2. Setup Project

ใช้ `workflows/setup-vite-project.md` สำหรับ setup project

### 3. Learn Core Concepts

อ่าน `learn/guide/` สำหรับ guides และ how-to
อ่าน `learn/key-concepts/` สำหรับแนวคิดหลัก
อ่าน `learn/principles/` สำหรับ principles และ design patterns

### 4. Configuration

อ่าน `references/configuration.md` สำหรับ configuration reference
ตั้งค่า `vite.config.ts`

### 5. Plugin API

ใช้ Plugin API สำหรับ extend functionality
ใช้ `workflows/add-plugin.md` สำหรับเพิ่ม plugins

### 6. Build Optimization

ใช้ `workflows/optimize-build.md` สำหรับ build optimization
ใช้ Rolldown สำหรับ production builds

### 7. References

อ่าน `references/api.md` สำหรับ API documentation
อ่าน `references/website.md` สำหรับ official documentation


## Rules

- ใช้ `bun add -D vite` สำหรับ installation
- ต้องใช้ Node.js ^20.19.0 หรือ >=22.12.0
- ใช้ Rolldown สำหรับ production builds (Vite 8+)
- ใช้ Oxc สำหรับ TypeScript transformation
- ใช้ lightningcss สำหรับ CSS transformation
- ใช้ Native ESM สำหรับ development mode
- ใช้ HMR สำหรับ instant updates
- ใช้ Plugin API ที่ compatible กับ Rollup/Rolldown
- ใช้ backticks สำหรับ `vite`, commands, plugins
- ใช้ code blocks สำหรับ configuration examples


## Expected Outcome

- Development ที่รวดเร็วด้วย Native ESM และ HMR
- Production builds ที่ optimized ด้วย Rolldown
- Plugin system ที่ flexible และ compatible กับ Rollup
- TypeScript support ด้วย Oxc Transformer
- CSS transformation ด้วย lightningcss
