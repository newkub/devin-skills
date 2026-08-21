---
name: follow-architecture
description: เลือก architecture pattern ตาม package manifest
related:
  - refactor-codebase
---

## Goal

เลือก architecture pattern ที่เหมาะสมกับโปรเจกต์ตาม package manifest

## Scope

- ใช้สำหรับเลือก architecture pattern ตาม framework, language, และ scale ของโปรเจกต์
- ใช้ภายใต้ `/refactor-codebase` เมื่องาน refactor ครบวงจร

## Execute

### 1. Analyze Project Type

ตรวจสอบประเภทของโปรเจกต์

> Goal: รู้ประเภทโปรเจกต์ framework และ runtime

1. ตรวจสอบ package manifest (`package.json`, `Cargo.toml`)
2. ระบุประเภทของโปรเจกต์จาก dependencies
3. ตรวจสอบ framework และ runtime ที่ใช้

### 2. Select Architecture Pattern

เลือก architecture pattern ตาม Detection Rules ในส่วน Rules

> Goal: เลือก architecture pattern ที่เหมาะสมกับ project type

1. ตรวจสอบ Detection Rules ตามลำดับ priority ใน Rules section
2. เลือก architecture workflow ที่ตรงกับ project type
3. ถ้าไม่ตรดเงื่อนไขใด → ใช้ `/follow-clean-architecture` เป็น default

### 3. Learn Architecture Pattern

เรียนรู้ architecture pattern ที่เลือกจาก official sources

> Goal: เข้าใจ pattern ที่เลือกอย่างลึกซึ้งก่อนนำไปใช้

1. ทำ `/learn-from-web` เพื่อศึกษา architecture pattern ที่เลือกจาก official documentation
2. อ่าน best practices และ anti-patterns ของ pattern นั้น
3. บันทึก code structure examples และ configuration examples

### 4. Setup Base Structure

ตั้งค่าโครงสร้างพื้นฐาน

> Goal: มีโครงสร้างพื้นฐานพร้อมใช้งานตาม pattern ที่เลือก

1. สร้างโครงสร้างพื้นฐานตาม pattern ที่เลือก
2. ตั้งค่า configuration files
3. รัน `/restructure` เพื่อ reorganize code

## Rules

### 1. Detection Rules

กำหนดหลักการตรวจจับประเภทโปรเจกต์ ตามลำดับ priority

| Detection | Method | Architecture |
|-----------|--------|--------------|
| Nuxt | `nuxt` in dependencies | `/follow-nuxt` |
| Next.js | `next` in dependencies | `/follow-nextjs-architecture` |
| Vue.js | `vue` in dependencies | `/follow-vue` |
| SolidJS | `solid-js` in dependencies | `/follow-solid-tanstack-architecture` |
| Svelte | `svelte` in dependencies | `/follow-svelte-kit-architecture` |
| Frontend ขนาดเล็ก-กลาง | 1-2 devs, frontend-only | `/follow-layered-architecture` |
| Rust | `Cargo.toml` exists | `/follow-clean-architecture` |
| Bun | `bun` in dependencies | `/follow-clean-architecture` |
| Monorepo | `workspaces` in `package.json` | `/follow-monorepo` |
| Medium scale | 3-5 devs, moderate complexity | `/follow-modular-monolith` |
| Microservices | distributed system | `/follow-microservices-architecture` |

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
