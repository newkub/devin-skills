# Architecture Pattern Selection

(merged from: follow-architecture)

เลือก architecture pattern ที่เหมาะสมกับโปรเจกต์ตาม package manifest พร้อมจัดเรียงส่วนประกอบตามหลัก Order Theory

## Execute

### 1. Analyze Project Type

1. ตรวจสอบ package manifest (`package.json`, `Cargo.toml`)
2. ระบุประเภทของโปรเจกต์จาก dependencies
3. ตรวจสอบ framework และ runtime ที่ใช้

### 2. Select Architecture Pattern

1. ตรวจสอบ Detection Rules ตามลำดับ priority ด้านล่าง
2. เลือก architecture pattern ที่ตรงกับ project type
3. ถ้าไม่ตรงเงื่อนไขใด → ใช้ Clean Architecture (`references/patterns-clean-architecture.md`) เป็น default

### 3. Order Components And Tasks

1. กำหนดรายการทั้งหมดที่ต้องเรียงลำดับ (Set) และความสัมพันธ์สำหรับการเปรียบเทียบ (Order Relation)
2. ตรวจสอบว่าความสัมพันธ์เป็น order relation (Reflexive, Antisymmetric, Transitive)
3. เลือก Total Order (ทุกรายการเปรียบเทียบได้) หรือ Partial Order (บางรายการเปรียบเทียบไม่ได้)
4. ใช้ Topological Order สำหรับความสัมพันธ์ขึ้นต่อกัน (dependencies)
5. ใช้ primary relation ถ้าเท่ากัน ใช้ secondary relation
6. ตรวจสอบว่าลำดับสอดคล้องกับ relation อ่านง่าย และค้นหาได้ง่าย

## Detection Rules

กำหนดหลักการตรวจจับประเภทโปรเจกต์ ตามลำดับ priority

| Detection | Method | Architecture |
|-----------|--------|--------------|
| Nuxt | `nuxt` in dependencies | `/follow-create-web-nuxt` |
| Next.js | `next` in dependencies | `references/patterns-nextjs-architecture.md` |
| Vue.js | `vue` in dependencies | `/follow-lib-vue` |
| SolidJS | `solid-js` in dependencies | `/follow-create-web-solid-tanstack-router` |
| Svelte | `svelte` in dependencies | `/follow-create-web-svelte` |
| Frontend ขนาดเล็ก-กลาง | 1-2 devs, frontend-only | `references/patterns-layered-architecture.md` |
| Rust | `Cargo.toml` exists | `references/patterns-clean-architecture.md` |
| Bun | `bun` in dependencies | `references/patterns-clean-architecture.md` |
| Monorepo | `workspaces` in `package.json` | `/follow-monorepo` |
| Microservices | distributed system | `references/patterns-microservices-architecture.md` |

## Priority Rules

ตรวจจับตามลำดับ หยุดที่เงื่อนไขแรกที่ match

- Framework-specific patterns (Nuxt, Next.js, Vue.js, SolidJS, Svelte)
- Frontend small-medium (Layered Architecture)
- Language-specific patterns (Rust, Bun)
- Scale patterns (Monorepo, Modular Monolith, Microservices)
- Default: `references/patterns-clean-architecture.md`

## Decision Matrix

| Project Size | Complexity | Recommended Architecture |
|---------------|------------|--------------------------|
| Small (1-2 devs) | Simple | Framework default or Layered |
| Medium (3-5 devs) | Moderate | Modular Monolith + Clean |
| Large (5+ devs) | Complex | Monorepo + Modular Monolith + Clean |
| Enterprise | High | Microservices + Clean |

## Ordering Principles

หลักการจัดเรียงส่วนประกอบตาม Order Theory:

- ใช้ alphabetical order เป็น default เมื่อไม่มีลำดับที่ชัดเจน
- ใช้ Topological Order สำหรับ dependencies (dependency ก่อน dependent)
- ตรวจสอบ Reflexive, Antisymmetric, Transitive ของ order relation
- เลือก Total Order สำหรับรายการที่เปรียบเทียบได้ทั้งหมด, Partial Order สำหรับบางรายการ
- ลำดับต้องอ่านง่าย ค้นหาได้ง่าย และสอดคล้องกับวัตถุประสงค์

- ใช้ /restructure ถ้าจำเป็น
- ใช้ /learn-web ถ้าจำเป็น
- ใช้ /rethink ถ้าจำเป็น
