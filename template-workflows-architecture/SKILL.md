---
name: template-workflows-architecture
description: Template สำหรับสร้าง follow-*-architecture workflows ที่จัดโครงสร้าง project
---

## Goal

Template สำหรับสร้าง `follow-*-architecture` workflows ที่จัดโครงสร้าง project ตาม best practices พร้อม file structure และ patterns

## Scope

ใช้สำหรับ workflows ที่กำหนด architecture เช่น `follow-solid-tanstack-architecture`, `follow-nuxt-architecture`, `follow-nextjs-architecture`, `follow-svelte-kit-architecture`

## Execute

### 1. Detect Stack

ตรวจจับ tech stack ของ project

> Goal: รู้ว่าใช้ framework อะไร version ใด และมี `follow-*` workflows อะไรเกี่ยวข้อง

1. อ่าน `package.json`, อ่าน dependency manifest, ตรวจสอบ standalone หรือ monorepo
2. ระบุ framework, meta-framework, และ key dependencies
3. ระบุ tech stack `follow-*` workflows ที่เกี่ยวข้อง (เช่น `/follow-nextjs`, `/follow-vue`, `/follow-pinia`, `/follow-vite`, `/follow-vitest`)
4. ถ้าไม่พบ framework → stop และ report

### 2. Define Structure

กำหนด file structure ตาม best practices

> Goal: มี file structure ที่เหมาะสม รองรับ modules/ และ monorepo

1. กำหนด directories หลัก, กำหนด module structure, กำหนด shared package structure ถ้าเป็น monorepo
2. Module structure: `src/modules/<feature>/` พร้อม `components/`, `hooks/`, `schemas/`, `utils/`, `types/`, `index.ts`
3. สร้าง file structure diagram ทั้ง standalone และ monorepo

### 3. Define Patterns

กำหนด patterns เฉพาะของ framework

> Goal: ใช้ framework patterns ถูกต้อง

1. กำหนด routing conventions, กำหนด server functions / API patterns, กำหนด rendering modes (SSR, CSR, SSG)
2. กำหนด state management patterns
3. กำหนด component organization

### 4. Define Rules

กำหนด rules สำหรับ architecture

> Goal: Rules ชัดเจน บังคับได้ ไม่ขัด best practices

1. กำหนด routing rules
2. กำหนด module boundary rules
3. กำหนด import/export rules — ทำ `/follow-import-export`
4. กำหนด monorepo rules ถ้าเกี่ยวข้อง
5. กำหนด configuration rules

### 5. Validate

ตรวจสอบว่า architecture ทำงานได้

> Goal: Architecture สมบูรณ์ ไม่มี conflicts

1. ตรวจสอบว่า structure ไม่ทับซ้อนกับ workflows อื่น
2. ทำ `/restructure` ถ้าจำเป็น, ทำ `/refactor-packages` ถ้า modules ใหญ่เกินไป, รัน typecheck, รัน lint
3. ทำ `/suggest-next-action`

## Rules

### 1. Generality

- ไม่ผูกกับชื่อ project หรือ scope เฉพาะ
- ใช้ `@<scope>/shared` แทนชื่อจริง
- รองรับทั้ง standalone และ monorepo

### 2. Tech Stack References

- `related` ใน frontmatter ต้องมี `follow-*` workflows ของ tech stack ที่เกี่ยวข้อง
- ตัวอย่าง: Next.js → `/follow-nextjs`, `/follow-vite`, `/follow-vitest`
- ตัวอย่าง: Nuxt → `/follow-nuxtjs`, `/follow-vue`, `/follow-pinia`, `/follow-nitro`
- ตัวอย่าง: SvelteKit → `/follow-svelte`, `/follow-vite`, `/follow-vitest`
- ตัวอย่าง: SolidJS+TanStack → `/follow-solidjs`, `/follow-tanstack-start`, `/follow-tanstack-router`, `/follow-tanstack-query`
- รวม `/follow-vite` และ `/follow-vitest` เสมอเพราะเป็น build และ test tools ที่ใช้ร่วมกัน

### 3. Module Boundaries

- แต่ละ module มี `index.ts` เป็น public API
- เก็บ internal code private
- ไม่มี circular dependencies

### 4. File Structure

- แสดง file structure diagram
- ระบุ file patterns เป็นตาราง
- ไม่เกิน 250 บรรทัดต่อ workflow

### 5. Monorepo

- อย่า share route tree ข้าม package boundary
- Share components, hooks, schemas, utils แทน
- ทำ `/follow-monorepo` สำหรับ validation

## Expected Outcome

- Architecture ที่ชัดเจนพร้อม file structure diagram
- Module boundaries และ patterns ที่ทำตามได้
- รองรับทั้ง standalone และ monorepo
- ไม่ผูกกับ project เฉพาะ

## Example Template

```markdown
---
title: Follow Nextjs Architecture
description: จัดโครงสร้าง Next.js App Router ตาม best practices
auto_execution_mode: 3
related:
  - /follow-nextjs
  - /follow-vite
  - /follow-vitest
  - /follow-import-export
  - /follow-monorepo
---

## Goal
จัดโครงสร้าง Next.js project ตาม App Router best practices

## Scope
ใช้สำหรับ Next.js projects ที่ใช้ App Router

## Execute

### 1. Detect Stack
ตรวจจับ Next.js และ dependencies

> Goal: รู้ framework version และ related workflows

1. อ่าน `package.json`, ตรวจสอบ monorepo
2. ระบุ tech stack `follow-*` workflows

### 2. Define Structure
กำหนด file structure

> Goal: Structure รองรับ modules/ และ monorepo

1. กำหนด `src/modules/`, กำหนด `app/` directory
2. สร้าง file structure diagram

### 3. Define Patterns
กำหนด Next.js patterns

> Goal: ใช้ Next.js patterns ถูกต้อง

1. กำหนด routing, กำหนด server components, กำหนด client components

### 4. Define Rules
กำหนด rules

> Goal: Rules ชัดเจน บังคับได้

1. กำหนด module boundary rules
2. ทำ `/follow-import-export`

### 5. Validate
ตรวจสอบ

> Goal: Architecture สมบูรณ์

1. รัน typecheck, รัน lint
2. ทำ `/suggest-next-action`

## Rules

### 1. Module Boundaries
- แต่ละ module มี `index.ts`
- ไม่มี circular dependencies

### 2. Tech Stack References
- `related` ต้องมี `/follow-nextjs`, `/follow-vite`, `/follow-vitest`

## Expected Outcome
- Next.js architecture พร้อม file structure และ patterns
```
