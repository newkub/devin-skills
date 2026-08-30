---
name: follow-lib-jspm
description: JSPM เป็น ES Module Package Manager และ CDN ที่ใช้มาตรฐาน native ES modules พร้อม import maps
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้งาน JSPM สำหรับ ES Module Package Manager และ CDN

## Scope

ใช้สำหรับ native ES modules โดยไม่ต้อง bundle, import maps สำหรับ module resolution, zero config, TypeScript support, hot reloading, และ CDN integration

## Execute

### 1. Install

> Goal: ติดตั้ง JSPM

1. ติดตั้ง JSPM globally ด้วย `bun add -g jspm`
2. อ่าน `guide/installation.md` สำหรับการติดตั้งและ setup

### 2. Initialize Project

> Goal: เริ่มต้น project

1. รัน `jspm init` สำหรับ initialize
2. อ่าน `guide/quick-start.md` สำหรับเริ่มต้นใช้งาน

### 3. Start Development Server

> Goal: เริ่ม development server

1. รัน `jspm serve` สำหรับ development server
2. อ่าน `guide/key-concept.md` สำหรับแนวคิดหลัก
3. อ่าน `guide/how-it-works.md` สำหรับวิธีการทำงาน

### 4. Build For Production

> Goal: สร้าง production build

1. รัน `jspm build` สำหรับ production build

### 5. Apply Patterns And Best Practices

> Goal: ใช้ patterns และ best practices

1. อ่าน `guide/features.md` สำหรับ features ที่มี
2. อ่าน `guide/patterns.md` สำหรับ patterns ทั่วไป
3. อ่าน `guide/best-practices.md` สำหรับ best practices

### 6. Integrate And Troubleshoot

> Goal: integrate กับ tools และแก้ปัญหา

1. อ่าน `guide/integration.md` สำหรับ tool integration
2. อ่าน `guide/architecture.md` สำหรับ system architecture
3. อ่าน `guide/structure.md` สำหรับ project structure
4. อ่าน `guide/troubleshooting.md` สำหรับปัญหาทั่วไป

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
