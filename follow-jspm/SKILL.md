---
name: follow-jspm
description: "JSPM เป็น ES Module Package Manager และ CDN ที่ใช้มาตรฐาน native ES modules พร้อม import maps"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน JSPM สำหรับ ES Module Package Manager และ CDN


## Scope

ใช้สำหรับ native ES modules โดยไม่ต้อง bundle, import maps สำหรับ module resolution, zero config, TypeScript support, hot reloading, และ CDN integration


## Execute

- ติดตั้ง JSPM globally
- Initialize project
- Start development server
- Build for production
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

- ใช้ `bun add -g jspm` สำหรับ installation
- ใช้ `jspm init` สำหรับ initialize
- ใช้ `jspm serve` สำหรับ development server
- ใช้ `jspm build` สำหรับ production build
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- ES modules ที่ native และ efficient
- Import maps ที่ configured อย่างถูกต้อง
- Development ที่ fast ด้วย hot reloading
- CDN integration ที่ seamless
