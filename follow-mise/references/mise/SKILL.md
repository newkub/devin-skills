---
name: follow-mise\references\mise
description: Mise - Development environment manager สำหรับ manage tools และ versions
  ต่างๆ
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---
## Goal

จัดการ development environment และ tool versions อย่างมีประสิทธิภาพด้วย mise


## Scope

ใช้สำหรับจัดการ multiple tool versions, environment setup, และ automation สำหรับ development


## Execute

- ติดตั้ง mise ตาม guide/installation.md
- ตั้งค่า configuration ตาม guide/configuration.md
- ตรวจสอบ installation ด้วย `mise --version`
- สร้าง `.mise.toml` ใน project root
- กำหนด tools และ versions ที่ต้องการ
- ใช้ `mise use <tool>@<version>` สำหรับ quick setup
- ติดตั้ง tools ด้วย `mise install`
- ตรวจสอบ versions ด้วย `mise list`
- Switch versions ด้วย `mise use <tool>@<version>`
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

- ใช้ `.mise.toml` สำหรับ project config
- ใช้ `~/.config/mise/config.toml` สำหรับ global config
- กำหนด tools ใน `.mise.toml` สำหรับ consistency
- ใช้ `mise exec -- <command>` สำหรับรันใน mise environment
- ใช้ `mise env` สำหรับดู environment variables
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Development environment ที่ consistent ทั้ง team
- Tool versions ที่จัดการได้อัตโนมัติ
- Environment setup ที่รวดเร็วและ repeatable
- การจัดการ multiple versions ที่ง่ายและปลอดภัย
