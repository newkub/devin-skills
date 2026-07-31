---
name: biome
description: "Guide for using Biome - a fast, all-in-one toolchain for web development with formatting,..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Biome สำหรับ formatting, linting, และ code analysis ใน web projects


## Scope

ใช้สำหรับ setting up formatting และ linting สำหรับ web projects, migrating จาก ESLint + Prettier, fast code quality tools, และ automating code quality ใน CI/CD


## Execute

- ติดตั้ง Biome ด้วย `bun add -D @biomejs/biome`
- Format source files
- Lint source files
- รัน format และ lint พร้อมกัน
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `key-concepts/formatter.md` สำหรับแนวคิด formatter
- อ่าน `key-concepts/linter.md` สำหรับแนวคิด linter
- อ่าน `key-concepts/import-organization.md` สำหรับแนวคิด import organization
- อ่าน `principles/performance.md` สำหรับหลักการ performance
- อ่าน `principles/safety.md` สำหรับหลักการ safety
- อ่าน `principles/simplicity.md` สำหรับหลักการ simplicity
- อ่าน `workflows/setup-biome.md` สำหรับการ setup
- อ่าน `workflows/use-biome.md` สำหรับการใช้งาน
- อ่าน `references/cli.md` สำหรับ CLI commands
- อ่าน `references/configuration.md` สำหรับ configuration options
- อ่าน `references/website.md` สำหรับ official documentation


## Rules

- ใช้ `bun add -D @biomejs/biome` สำหรับ installation
- ใช้ `bunx biome format --write` สำหรับ formatting
- ใช้ `bunx biome lint` สำหรับ linting
- ใช้ `bunx biome check --write` สำหรับ format + lint
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Code formatting ที่ consistent
- Linting ที่ fast
- Code quality ที่ automated
- Migration จาก ESLint + Prettier ที่ smooth
