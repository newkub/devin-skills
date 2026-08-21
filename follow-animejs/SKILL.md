---
name: follow-animejs
description: JavaScript animation library สำหรับสร้าง animation ที่รวดเร็ว มีประสิทธิภาพ
  และใช้งานง่าย
triggers:
- user
- model
allowed-tools:
- read
- edit
- grep
- glob
- exec
---
## Goal

ใช้ Anime.js สร้าง animation ที่รวดเร็ว มีประสิทธิภาพ และใช้งานง่ายในโปรเจกต์


## Scope

ใช้สำหรับสร้าง CSS/JS animations ด้วย Anime.js


## Execute

- ติดตั้ง Anime.js ด้วย `bun add animejs`
- อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
- อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน
- อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
- อ่าน `key-concepts/timeline.md` สำหรับระบบ timeline
- อ่าน `key-concepts/easing.md` สำหรับ easing functions
- อ่าน `key-concepts/staggering.md` สำหรับ staggering animations
- อ่าน `key-concepts/callbacks.md` สำหรับ callbacks และ event handling
- อ่าน `guide/features.md` สำหรับ features ที่มี
- อ่าน `guide/configuration.md` สำหรับการตั้งค่า
- อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
- อ่าน `guide/best-practices.md` สำหรับ best practices
- อ่าน `principles/performance-first.md` สำหรับ performance
- อ่าน `principles/accessibility.md` สำหรับ accessibility
- อ่าน `guide/performance.md` สำหรับ optimization techniques
- อ่าน `guide/integration.md` สำหรับการ integrate กับ frameworks
- อ่าน `guide/architecture.md` สำหรับ system architecture
- อ่าน `guide/structure.md` สำหรับ project structure
- อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป
- อ่าน `references/api.md` สำหรับ API documentation
- อ่าน `references/configuration.md` สำหรับ configuration reference


## Rules

- ใช้ `bun add animejs` สำหรับ installation
- ใช้ `bun add -D animejs` สำหรับ dev dependencies
- ใช้ backticks สำหรับ `anime()`, `timeline()`, commands
- ใช้ code blocks สำหรับ animation examples
- ใช้ ansi markdown diagrams สำหรับ flow และ architecture
- ใช้ `transform` แทน `position` เมื่อเป็นไปได้
- ใช้ `will-change` สำหรับ elements ที่จะ animate
- หลีกเลี่ยง animate properties ที่ trigger layout
- ให้ผู้ใช้ปิด animations ได้ด้วย `prefers-reduced-motion`
- ใช้ animations เพื่อเสริม UX ไม่ใช่ distraction
- ให้ feedback ชัดเจนเมื่อ animation เสร็จ


## Expected Outcome

- Animation ที่รวดเร็วและมีประสิทธิภาพ
- Code ที่ maintainable และ consistent
- UX ที่ดีและ accessible
- Performance ที่ optimized
