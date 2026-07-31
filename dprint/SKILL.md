---
name: dprint
description: "Dprint เป็น pluggable and configurable code formatting platform ที่รวดเร็วมาก ใช้ Rust และ..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Dprint สำหรับ code formatting ที่รวดเร็วและ configurable


## Scope

ใช้สำหรับ code formatting ที่รวดเร็ว, pluggable and configurable formatting, รองรับหลายภาษา (TypeScript, JavaScript, JSON, Markdown, TOML, Rust), และ Rust และ WebAssembly


## Execute

- ติดตั้ง Dprint
- Initialize Dprint
- Format ทุกไฟล์
- ตรวจสอบ formatting
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

- ใช้ `bun add -D dprint` สำหรับ installation
- ใช้ `dprint init` สำหรับ initialize
- ใช้ `dprint fmt` สำหรับ format
- ใช้ `dprint check` สำหรับ check formatting
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Code formatting ที่ consistent
- Performance ที่รวดเร็ว
- Configuration ที่ flexible
- Multi-language support ที่ comprehensive
