---
name: knip
description: "แนวทางการใช้งาน Knip สำหรับหา unused files, dependencies และ exports"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Knip สำหรับหา unused files, dependencies และ exports


## Scope

ใช้สำหรับหา unused files, หา unused dependencies, หา unused exports, และ TypeScript/JavaScript projects


## Execute

- ติดตั้ง Knip
- รัน Knip
- รันใน watch mode
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

- ใช้ `bun add -D knip` สำหรับติดตั้ง
- ใช้ `bunx knip` สำหรับรัน
- ใช้ `--watch` สำหรับ watch mode
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Unused files ที่ถูกค้นหา
- Unused dependencies ที่ detected
- Unused exports ที่ identified
- Codebase ที่ clean และ maintainable
