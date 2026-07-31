---
name: changesets
description: "แนวทางการใช้งาน Changesets สำหรับ version management และ release automation ใน monorepos"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Changesets สำหรับ version management และ release automation ใน monorepos


## Scope

ใช้สำหรับ version management ใน monorepos, automated changelog generation, release automation, และ semantic versioning


## Execute

- ติดตั้ง Changesets
- Initialize Changesets
- สร้าง changeset
- Version packages
- Publish
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

- ใช้ `bun add -D @changesets/cli` สำหรับ installation
- ใช้ `bunx changeset init` สำหรับ initialize
- ใช้ `bunx changeset` สำหรับ create changeset
- ใช้ `bunx changeset version` สำหรับ version packages
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Version management ที่ automated
- Changelog generation ที่ consistent
- Release automation ที่ streamlined
- Semantic versioning ที่ proper
