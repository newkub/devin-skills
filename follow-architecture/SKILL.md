---
name: follow-architecture
description: เลือก architecture pattern ตาม package manifest
---

## Goal

เลือก architecture pattern ที่เหมาะสมกับโปรเจกต์ตาม package manifest

## Scope

- ใช้สำหรับเลือก architecture pattern ตาม framework, language, และ scale ของโปรเจกต์
- ใช้ภายใต้ `/refactor-codebase` เมื่องาน refactor ครบวงจร

## Execute

### 1. Analyze Project Type

> Goal: ตรวจสอบประเภทของโปรเจกต์

1. ตรวจสอบ package manifest (`package.json`, `Cargo.toml`)
2. ระบุประเภทของโปรเจกต์จาก dependencies
3. ตรวจสอบ framework และ runtime ที่ใช้

### 2. Select Architecture Pattern

> Goal: เลือก architecture pattern ตาม Detection Rules ในส่วน Rules

1. ตรวจสอบ Detection Rules ตามลำดับ priority ใน Rules section
2. เลือก architecture pattern ที่ตรงกับ project type
3. อ่าน reference file ของ pattern ที่เลือกจาก `references/patterns/`
4. ถ้าไม่ตรดเงื่อนไขใด → ใช้ Clean Architecture (`references/patterns/clean-architecture.md`) เป็น default

### 3. Learn Architecture Pattern

> Goal: เรียนรู้ architecture pattern ที่เลือกจาก reference files และ official sources

1. อ่าน reference file ของ pattern ที่เลือกใน `references/patterns/<pattern>.md`
2. ทำ `/learn-from-web` เพื่อศึกษา architecture pattern ที่เลือกจาก official documentation เพิ่มเติม
3. อ่าน best practices และ anti-patterns ของ pattern นั้น
4. บันทึก code structure examples และ configuration examples

### 4. Setup Base Structure

> Goal: ตั้งค่าโครงสร้างพื้นฐาน

1. สร้างโครงสร้างพื้นฐานตาม pattern ที่เลือก
2. ตั้งค่า configuration files
3. รัน `/restructure` เพื่อ reorganize code

## Rules

### 1. Detection Rules

กำหนดหลักการตรวจจับประเภทโปรเจกต์ ตามลำดับ priority

| Detection | Method | Architecture |
|-----------|--------|--------------|
| Nuxt | `nuxt` in dependencies | `/follow-nuxt` |
| Next.js | `next` in dependencies | `references/patterns/nextjs-architecture.md` |
| Vue.js | `vue` in dependencies | `/follow-vue` |
| SolidJS | `solid-js` in dependencies | `references/patterns/solid-tanstack-architecture.md` |
| Svelte | `svelte` in dependencies | `/follow-svelte-kit` |
| Frontend ขนาดเล็ก-กลาง | 1-2 devs, frontend-only | `references/patterns/layered-architecture.md` |
| Rust | `Cargo.toml` exists | `references/patterns/clean-architecture.md` |
| Bun | `bun` in dependencies | `references/patterns/clean-architecture.md` |
| Monorepo | `workspaces` in `package.json` | `/follow-monorepo` |
| Medium scale | 3-5 devs, moderate complexity | `/follow-modular-monolith` |
| Microservices | distributed system | `references/patterns/microservices-architecture.md` |

### 2. Priority Rules

ตรวจจับตามลำดับ หยุดที่เงื่อนไขแรกที่ match

- Framework-specific patterns (Nuxt, Next.js, Vue.js, SolidJS, Svelte)
- Frontend small-medium (Layered Architecture)
- Language-specific patterns (Rust, Bun)
- Scale patterns (Monorepo, Modular Monolith, Microservices)
- Default: Clean Architecture

### 3. Decision Matrix

เงื่อนไขการตัดสินใจ

| Project Size | Complexity | Recommended Architecture |
|---------------|------------|--------------------------|
| Small (1-2 devs) | Simple | Framework default or Layered |
| Medium (3-5 devs) | Moderate | Modular Monolith + Clean |
| Large (5+ devs) | Complex | Monorepo + Modular Monolith + Clean |
| Enterprise | High | Microservices + Clean |

## Expected Outcome

- Architecture pattern ที่เหมาะสมกับโปรเจกต์
- โครงสร้างพื้นฐานที่ถูกต้อง
- Configuration files ที่สมบูรณ์
- Code organization ตามมาตรฐาน
