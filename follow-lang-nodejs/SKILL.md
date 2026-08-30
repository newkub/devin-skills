---
name: follow-lang-nodejs
description: ใช้ Node.js JavaScript runtime สำหรับพัฒนาและรันโปรเจกต์ JavaScript/TypeScript ด้วย ecosystem
related:
  - follow-lang-bun
  - follow-lang-javascript
  - follow-lang-kotlin
  - follow-best-practice
  - setup-cicd
  - use-scripts
---

## Goal

ใช้ Node.js JavaScript runtime สำหรับพัฒนาและรันโปรเจกต์ JavaScript/TypeScript ด้วย ecosystem ที่ใหญ่ที่สุด

## Scope

ใช้สำหรับโปรเจกต์ที่ต้องการ ecosystem ที่ใหญ่และ mature หรือต้องการ compatibility สูง

## Execute

### 1. Setup Project

> Goal: ตั้งค่าโปรเจกต์ Node.js

1. ทำตาม `workflows/setup-project.md` สำหรับตั้งค่าโปรเจกต์
2. ใช้ `npm`, `pnpm`, หรือ `yarn` สำหรับ package management (เลือกตาม project)
3. ใช้ TypeScript หรือ JavaScript ตาม project requirements (แนะนำ TypeScript สำหรับ large projects)

### 2. Understand Core Concepts

> Goal: เข้าใจพื้นฐาน Node.js

1. อ่าน `references/index.md` สำหรับภาพรวม
2. อ่าน `references/nodejs-globals.md` สำหรับ global APIs
3. อ่าน `references/nodejs-modules.md` สำหรับ module system

### 3. Use CLI And Resources

> Goal: ใช้ CLI และเอกสารอย่างมีประสิทธิภาพ

1. ดู `references/nodejs-cli.md` สำหรับคำสั่ง CLI
2. ดู `references/nodejs-resources.md` สำหรับเอกสารอย่างเป็นทางการ

### 4. Migrate Versions

> Goal: migrate ระหว่าง Node.js versions

1. ทำตาม `workflows/migrate-version.md` สำหรับ migrate ระหว่าง versions

## Rules

- ใช้ `npm`, `pnpm`, หรือ `yarn` สำหรับ package management
- ใช้ `npx` หรือ `pnpm dlx` สำหรับ run packages แบบ one-off
- ใช้ CommonJS หรือ ES Modules ตามความเหมาะสม
- แนะนำ TypeScript สำหรับ large projects, JavaScript สำหรับ scripts/prototyping
- ใช้ proper error handling
- ใช้ async/await สำหรับ async operations

- ใช้ /follow-lang-bun ถ้าจำเป็น
- ใช้ /follow-lang-javascript ถ้าจำเป็น
- ใช้ /follow-lang-kotlin ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น

## Expected Outcome

- Projects ที่ compatible กับ ecosystem ที่ใหญ่
- Development ที่ stable ด้วย mature runtime
- Integration ที่ smooth กับ Node.js ecosystem
