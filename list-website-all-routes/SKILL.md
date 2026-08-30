---
name: list-website-all-routes
description: รายการ routes ทั้งหมดใน website project สำหรับหลาย frameworks
related:
  - analyze-attack-surface
  - report-table
---

## Goal

รวบรวม routes ทั้งหมดใน website project ทั้ง page routes และ API routes พร้อมระบุ parameters และ dynamic segments

## Scope

ใช้สำหรับ website project ที่ใช้ file-based routing, config-based routing หรือ route table เช่น Next.js, Nuxt, SvelteKit, SolidStart, TanStack Start, Remix, Astro

## Execute

### 1. Detect Routing Framework

> Goal: ระบุ framework และ routing convention ที่ project ใช้

1. อ่าน `package.json` เพื่อดู dependencies เช่น `next`, `nuxt`, `svelte-kit`, `solid-start`, `@tanstack/start`, `react-router`, `astro`
2. ตรวจสอบ directory structure: `app/`, `src/app/`, `pages/`, `src/pages/`, `src/routes/`, `routes/`
3. ดู `references/frameworks.md` สำหรับ convention ของแต่ละ framework
4. ถ้า project มีหลาย routing pattern ให้ระบุทุก pattern

### 2. Scan Page Routes

> Goal: รายการ page routes ทั้งหมด

1. สแกน directory ที่เก็บ page files ตาม framework ที่ตรวจพบ
2. แปลง file path เป็น URL path โดยลบ extensions และตัวลงท้าย `index`, `page`, `layout`
3. ระบุ dynamic segments เช่น `[id]`, `[...slug]`, `($lang)`, `[[optional]]`
4. เก็บข้อมูล: method (GET), path, file, parameters, group/folder

### 3. Scan API Routes

> Goal: รายการ API routes ทั้งหมด

1. สแกน `app/api/`, `src/server/`, `src/routes/api/`, `pages/api/`, `src/pages/api/` ตาม framework
2. ระบุ HTTP method จากชื่อ file เช่น `+server.ts` ใน SvelteKit, `route.ts` ใน Next.js, `+page.server.ts`
3. เก็บข้อมูล: method, path, file, parameters, description ถ้ามี

### 4. Extract Route Metadata

> Goal: รวบรวม metadata สำหรับแต่ละ route

1. อ่านไฟล์ route เพื่อดู exports เช่น `meta`, `loader`, `action`, `handler`
2. ระบุ middleware หรือ guards ที่ใช้
3. ระบุ redirects, rewrites, หรือ catch-all routes
4. แยก public routes กับ routes ที่ต้อง authentication

### 5. Format Output

> Goal: แสดงผล routes ในรูปแบบทีอ่านง่าย

1. ใช้ `/report-table` เพื่อจัดรูปแบบตาราง
2. คอลัมน์: No, Type, Method, Path, File, Parameters, Notes
3. เรียงตาม path ตามตัวอักษร
4. แยก group: Page Routes, API Routes, Redirects, Catch-all

## Rules

### 1. Framework Detection

- ตรวจ dependencies ก่อนเดา convention
- รองรับหลาย routing pattern ใน project เดียว
- ถ้าไม่มั่นใจให้ report ความไม่แน่ใจ

### 2. Route Extraction

- แปลง file path เป็น URL path ตาม convention ของ framework
- ไม่รวม `layout`, `error`, `loading`, `template` files เป็น routes
- รวม dynamic segments ตามสัญลักษณ์จริง (`[]`, `()`, `[...]`)

### 3. API Route Handling

- ระบุ HTTP method ให้ถูกต้องตาม convention
- ถ้า file ไม่ระบุ method ให้ใช้ GET เป็นค่าเริ่มต้น
- แยก API routes ออกจาก page routes ชัดเจน

### 4. Reporting

- ใช้ `/report-table` สำหรับรายงาน
- ใช้ backticks สำหรับ paths และ method
- ระบุ routes ทีอาจ conflict หรือซ้ำซ้อน

- ใช้ /analyze-attack-surface ถ้าจำเป็น

## Expected Outcome

- รายการ page routes ทั้งหมดใน project
- รายการ API routes ทั้งหมดใน project
- Dynamic segments และ parameters ถูกระบุ
- Routes ถูกจัดกลุ่มและเรียงลำดับชัดเจน
- ไม่มี routes ทีหลงหายจาก file-based convention
