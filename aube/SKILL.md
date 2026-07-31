---
name: aube
description: "Package manager สำหรับ Node.js ที่เร็วที่สุด รองรับ lockfiles หลายรูปแบบ มี security defaults..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Aube สำหรับ package management ใน Node.js projects


## Scope

ใช้สำหรับ package management สำหรับ Node.js, จัดการ lockfiles หลายรูปแบบ, security defaults ที่ดีที่สุด, และ global content-addressable store


## Execute

- ติดตั้ง Aube ด้วย `bunx`
- จัดการ dependencies
- รัน scripts ด้วย auto-install
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

- ใช้ `aube add` สำหรับเพิ่ม dependencies
- ใช้ `aube install` สำหรับติดตั้ง dependencies
- ใช้ `aube ci` สำหรับ CI mode
- ใช้ `aube test` สำหรับรัน scripts พร้อม auto-install
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Package management ที่รวดเร็ว
- Lockfiles ที่ compatible หลายรูปแบบ
- Security defaults ที่ดีที่สุด
- Disk usage ที่น้อย
