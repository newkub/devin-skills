---
name: follow-architecture
description: เลือก architecture pattern ตาม package manifest แล้วส่งต่อไปยัง follow-*-architecture skill ที่เหมาะสม
related:
  - follow-clean-architecture
  - follow-layered-architecture
  - follow-microservices-architecture
  - follow-nextjs-architecture
  - follow-solid-tanstack-architecture
  - follow-monorepo
  - follow-framework-nuxt
  - follow-framework-svelte-kit
  - follow-lib-vue
  - restructure
  - learn-from-web
---

## Goal

เลือก architecture pattern ที่เหมาะสมกับโปรเจกต์ตาม package manifest แล้วส่งต่อไปยัง `follow-*-architecture` skill ที่เหมาะสม พร้อมจัดเรียงส่วนประกอบตามหลัก Order Theory

## Scope

- ใช้สำหรับเลือก architecture pattern ตาม framework, language, scale ของโปรเจกต์
- ส่งต่อไปยัง `follow-*-architecture` skill เพื่อ implement pattern จริง
- ใช้ภายใต้ `/refactor` เมื่องาน refactor ครบวงจร
- ใช้สำหรับจัดเรียงรายการ ไฟล์ หรือ tasks ใน project ให้เป็นระบบตาม Order Theory

## Execute

### 1. Analyze Project Type

> Goal: ตรวจสอบประเภทของโปรเจกต์

1. ตรวจสอบ package manifest (`package.json`, `Cargo.toml`)
2. ระบุประเภทของโปรเจกต์จาก dependencies
3. ตรวจสอบ framework และ runtime ที่ใช้

### 2. Select Architecture Pattern

> Goal: เลือก architecture pattern ตาม Detection Rules

1. ตรวจสอบ Detection Rules ตามลำดับ priority ใน Rules section
2. เลือก architecture pattern ที่ตรงกับ project type
3. ส่งต่อไปยัง `follow-*-architecture` skill ที่เลือก
4. ถ้าไม่ตรงเงื่อนไขใด → ใช้ `/follow-clean-architecture` เป็น default

### 3. Order Components And Tasks

> Goal: จัดเรียงส่วนประกอบและ tasks ตาม Order Theory

1. กำหนดรายการทั้งหมดที่ต้องเรียงลำดับ (Set) และความสัมพันธ์สำหรับการเปรียบเทียบ (Order Relation)
2. ตรวจสอบว่าความสัมพันธ์เป็น order relation (Reflexive, Antisymmetric, Transitive)
3. เลือก Total Order (ทุกรายการเปรียบเทียบได้) หรือ Partial Order (บางรายการเปรียบเทียบไม่ได้)
4. ใช้ Topological Order สำหรับความสัมพันธ์ขึ้นต่อกัน (dependencies)
5. ใช้ primary relation ถ้าเท่ากัน ใช้ secondary relation
6. ตรวจสอบว่าลำดับสอดคล้องกับ relation อ่านง่าย และค้นหาได้ง่าย

## Rules

### 1. Detection Rules

กำหนดหลักการตรวจจับประเภทโปรเจกต์ ตามลำดับ priority

| Detection | Method | Architecture |
|-----------|--------|--------------|
| Nuxt | `nuxt` in dependencies | `/follow-framework-nuxt` |
| Next.js | `next` in dependencies | `/follow-nextjs-architecture` |
| Vue.js | `vue` in dependencies | `/follow-lib-vue` |
| SolidJS | `solid-js` in dependencies | `/follow-solid-tanstack-architecture` |
| Svelte | `svelte` in dependencies | `/follow-framework-svelte-kit` |
| Frontend ขนาดเล็ก-กลาง | 1-2 devs, frontend-only | `/follow-layered-architecture` |
| Rust | `Cargo.toml` exists | `/follow-clean-architecture` |
| Bun | `bun` in dependencies | `/follow-clean-architecture` |
| Monorepo | `workspaces` in `package.json` | `/follow-monorepo` |
| Microservices | distributed system | `/follow-microservices-architecture` |

### 2. Priority Rules

ตรวจจับตามลำดับ หยุดที่เงื่อนไขแรกที่ match

- Framework-specific patterns (Nuxt, Next.js, Vue.js, SolidJS, Svelte)
- Frontend small-medium (Layered Architecture)
- Language-specific patterns (Rust, Bun)
- Scale patterns (Monorepo, Modular Monolith, Microservices)
- Default: `/follow-clean-architecture`

### 3. Decision Matrix

เงื่อนไขการตัดสินใจ

| Project Size | Complexity | Recommended Architecture |
|---------------|------------|--------------------------|
| Small (1-2 devs) | Simple | Framework default or Layered |
| Medium (3-5 devs) | Moderate | Modular Monolith + Clean |
| Large (5+ devs) | Complex | Monorepo + Modular Monolith + Clean |
| Enterprise | High | Microservices + Clean |

### 4. Ordering Principles

หลักการจัดเรียงส่วนประกอบตาม Order Theory:

- ใช้ alphabetical order เป็น default เมื่อไม่มีลำดับที่ชัดเจน
- ใช้ Topological Order สำหรับ dependencies (dependency ก่อน dependent)
- ตรวจสอบ Reflexive, Antisymmetric, Transitive ของ order relation
- เลือก Total Order สำหรับรายการที่เปรียบเทียบได้ทั้งหมด, Partial Order สำหรับบางรายการ
- ลำดับต้องอ่านง่าย ค้นหาได้ง่าย และสอดคล้องกับวัตถุประสงค์

## Expected Outcome

- Architecture pattern ที่เหมาะสมกับโปรเจกต์
- ส่งต่อไปยัง `follow-*-architecture` skill ที่ถูกต้อง
- ส่วนประกอบและ tasks เรียงลำดับตาม Order Theory อ่านง่ายและค้นหาได้ง่าย
