---
name: github-actions
description: "แนวทางการใช้งาน GitHub Actions สำหรับ CI/CD"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

แนวทางการใช้งาน GitHub Actions สำหรับ CI/CD และ automation ภายใน GitHub


## Scope

ใช้สำหรับตั้งค่าและใช้งาน GitHub Actions ในโปรเจกต์


## Execute

- สร้าง `.github/workflows/` folder ใน root ของ repository
- สร้าง workflow files ด้วยนามสกุล `.yml` หรือ `.yaml`
- กำหนด triggers (on: push, pull_request, etc.)
- กำหนด jobs และ steps
- กำหนด `runs-on` (ubuntu-latest, windows-latest, macos-latest)
- เพิ่ม steps สำหรับ checkout, install, test, build
- ใช้ actions จาก GitHub Marketplace
- กำหนด dependencies ระหว่าง jobs ด้วย `needs`
- เพิ่ม secrets ใน repository settings
- ใช้ `${{ secrets.SECRET_NAME }}` ใน workflow
- ใช้ environment variables สำหรับค่าที่ไม่ sensitive
- ใช้ caching สำหรับ dependencies
- ใช้ matrix strategy สำหรับ test หลาย platforms
- ใช้ reusable workflows สำหรับ sharing logic
- ตรวจสอบ security ด้วย Dependabot
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

- ใช้ `bun add` หรือ `bun add -D` แทน `bun install` เสมอ
- ใช้ actions เวอร์ชันล่าสุด (v4, v5)
- ตั้งค่า permissions อย่างเหมาะสม
- ใช้ caching สำหรับ dependencies เสมอ
- ตรวจสอบ security vulnerabilities ด้วย Dependabot
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- CI/CD ที่ automated
- Testing ที่ comprehensive
- Deployment ที่ streamlined
- Security ที่ monitored
