---
name: lefthook
description: "แนวทางการใช้งาน Lefthook สำหรับจัดการ Git hooks อย่างมีประสิทธิภาพ"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Lefthook สำหรับจัดการ Git hooks อย่างมีประสิทธิภาพ


## Scope

ใช้สำหรับจัดการ Git hooks อย่างมีประสิทธิภาพ, automate code quality checks, enforce commit message standards, และ run tests ก่อน push


## Execute

- ติดตั้ง Lefthook
- Initialize ใน project
- รัน hooks ด้วยตนเอง
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

- ใช้ `bun add -D lefthook` สำหรับติดตั้ง
- ใช้ `bunx lefthook install` สำหรับ initialize
- ใช้ `bunx lefthook run` สำหรับรัน hooks
- กำหนด hooks ใน `lefthook.yml`
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Git hooks ที่ automated
- Code quality ที่ enforced
- Commit messages ที่ standardized
- Tests ที่ run ก่อน push
