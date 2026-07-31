---
name: eslint
description: "ESLint เป็น linting tool สำหรับ JavaScript และ TypeScript ที่ช่วยตรวจสอบ code quality, find..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน ESLint สำหรับ linting JavaScript และ TypeScript


## Scope

ใช้สำหรับ static analysis ของ code, auto-fix ปัญหา, plugin system, ESLint Flat Config, extends จาก preset configs, severity levels, cache สำหรับ performance, และ output formats หลายแบบ


## Execute

- ติดตั้ง ESLint
- Initialize ESLint
- Lint files
- Auto-fix ปัญหา
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `guide/integration.md` สำหรับ tool integration
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป


## Rules

- ใช้ `bun add -D eslint` สำหรับ installation
- ใช้ `bunx eslint --init` สำหรับ initialize
- ใช้ `bunx eslint ./src` สำหรับ lint
- ใช้ `bunx eslint ./src --fix` สำหรับ auto-fix
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Code quality ที่ improved
- Bugs ที่ detected early
- Coding conventions ที่ enforced
- Auto-fix ที่ efficient
