---
name: follow-moonrepo\references\moonrepo
description: แนวทางการใช้งาน moonrepo สำหรับ monorepo management และ task running
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

ใช้งาน moonrepo สำหรับ monorepo management และ task running


## Scope

ใช้สำหรับจัดการ monorepo อย่างมีประสิทธิภาพ, run tasks ข้าม multiple projects, ใช้ smart hashing และ caching, และตรวจสอบ affected projects


## Execute

- ติดตั้ง moonrepo ตาม guide/installation.md
- ตั้งค่า moonrepo ตาม guide/configuration.md
- รัน tasks ข้าม multiple projects
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

- ใช้ smart hashing สำหรับ efficiency
- ใช้ caching เพื่อ performance
- จัดกลุ่ม projects สำหรับ organization
- ใช้ backticks สำหรับ commands
- ใช้ code blocks สำหรับ examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture


## Expected Outcome

- Monorepo ที่จัดการอย่างมีประสิทธิภาพ
- Tasks ที่รันข้าม multiple projects
- Smart hashing และ caching ที่ optimized
- Affected projects ที่ตรวจสอบได้
