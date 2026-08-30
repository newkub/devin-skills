---
name: follow-lib-animejs
description: JavaScript animation library สำหรับสร้าง animation ที่รวดเร็ว มีประสิทธิภาพ และใช้งานง่าย
related:
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-lib-css
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ Anime.js สร้าง animation ที่รวดเร็ว มีประสิทธิภาพ และใช้งานง่ายในโปรเจกต์

## Scope

ใช้สำหรับสร้าง CSS/JS animations ด้วย Anime.js

## Execute

### 1. Install And Setup

> Goal: ติดตั้ง Anime.js และเริ่มต้นใช้งาน

1. ติดตั้ง Anime.js ด้วย `bun add animejs`
2. อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup
3. อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 2. Learn Key Concepts

> Goal: เข้าใจแนวคิดหลักของ Anime.js

1. อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
2. อ่าน `key-concepts/timeline.md` สำหรับระบบ timeline
3. อ่าน `key-concepts/easing.md` สำหรับ easing functions
4. อ่าน `key-concepts/staggering.md` สำหรับ staggering animations
5. อ่าน `key-concepts/callbacks.md` สำหรับ callbacks และ event handling

### 3. Apply Patterns And Best Practices

> Goal: ใช้ patterns และ best practices

1. อ่าน `guide/features.md` สำหรับ features ที่มี
2. อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
3. อ่าน `guide/best-practices.md` สำหรับ best practices
4. อ่าน `principles/performance-first.md` สำหรับ performance
5. อ่าน `principles/accessibility.md` สำหรับ accessibility

### 4. Configure And Optimize

> Goal: ตั้งค่าและ optimize performance

1. อ่าน `guide/configuration.md` สำหรับการตั้งค่า
2. อ่าน `guide/performance.md` สำหรับ optimization techniques

### 5. Integrate With Frameworks

> Goal: integrate กับ frameworks

1. อ่าน `guide/integration.md` สำหรับการ integrate กับ frameworks
2. อ่าน `guide/architecture.md` สำหรับ system architecture
3. อ่าน `guide/structure.md` สำหรับ project structure

### 6. Reference And Troubleshoot

> Goal: อ้างอิง API และแก้ปัญหา

1. อ่าน `references/api.md` สำหรับ API documentation
2. อ่าน `references/configuration.md` สำหรับ configuration reference
3. อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป

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

- ใช้ /follow-lib-arktype ถ้าจำเป็น
- ใช้ /follow-lib-better-auth ถ้าจำเป็น
- ใช้ /follow-lib-css ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /use-my-packages-on-registry ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## Expected Outcome

- Animation ที่รวดเร็วและมีประสิทธิภาพ
- Code ที่ maintainable และ consistent
- UX ที่ดีและ accessible
- Performance ที่ optimized
