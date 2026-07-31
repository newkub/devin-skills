---
name: oxlint
description: "แนวทางการใช้งาน Oxlint - Blazing fast JavaScript linter ที่เขียนด้วย Rust"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Oxlint สำหรับ linting JavaScript/TypeScript ที่เร็วกว่า ESLint


## Scope

ใช้สำหรับ linter ที่เร็วกว่า ESLint, ESLint compatibility, type-aware linting, multi-file analysis, และ CI/CD integration


## Execute

- ติดตั้ง Oxlint
- Initialize config
- รัน lint
- Auto-fix
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

- ใช้ `bun add -D oxlint` สำหรับ installation
- ใช้ `oxlint --init` สำหรับ initialize
- ใช้ `oxlint` สำหรับ lint
- ใช้ `oxlint --fix` สำหรับ auto-fix
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Linting ที่เร็วกว่า ESLint
- ESLint compatibility ที่ maintained
- Type-aware linting ที่ accurate
- Multi-file analysis ที่ comprehensive
