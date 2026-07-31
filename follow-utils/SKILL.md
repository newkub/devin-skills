---
name: follow-utils
description: แนวทางการเขียนและจัดโครงสร้าง utils functions
---

## Goal

เขียนและจัดโครงสร้าง utils functions ตาม Pure Functional Programming principles

## Scope

ใช้สำหรับ project ที่มี utils functions ที่ต้องจัดโครงสร้างและ quality

## Execute

### 1. Folder Rules

จัดโครงสร้าง utils เป็น subfolders ตามหมวดหมู่

> Goal: utils แบ่งตามหมวดหมู่ชัดเจน

1. แบ่ง subfolders: `format`, `validation`, `conversion`, `math`, `string`, `array`, `date`
2. ใช้ชื่อ folder ที่สื่อความหมายเป็นภาษาอังกฤษ

### 2. Import Rules

จัดลำดับ imports อย่างเป็นระบบ

> Goal: imports เรียงลำดับชัดเจน

1. เรียง: external libraries → internal modules → relative imports
2. แบ่ง groups ด้วยบรรทัดว่าง
3. ใช้ `import type` สำหรับ type-only imports

### 3. Function Rules

เขียน functions ตาม Pure FP principles

> Goal: functions เป็น pure, type-safe, และ testable

1. เขียน pure functions — no side effects, no state mutation, deterministic
2. ตั้งชื่อด้วย verb หรือ verb+noun (เช่น `formatDate`, `validateEmail`)
3. เขียน JSDoc สำหรับ functions ที่ซับซ้อน (`@param`, `@returns`, `@example`)
4. จัดการ error ด้วย Result pattern หรือ custom error types
5. เขียน unit tests ครอบคลุม happy paths, edge cases, error cases
6. ใช้ TypeScript types — type inference, generics, type guards
7. Validate inputs ก่อนประมวลผล — ใช้ `zod` สำหรับ complex validations
8. จำกัด function size ไม่เกิน 20-30 lines — extract helpers ถ้าจำเป็น

### 4. Export Rules

จัดการ exports อย่างเป็นระบบ

> Goal: exports ใช้ named exports และมี index file

1. ใช้ named exports เป็นหลัก
2. สร้าง `index.ts` เพื่อรวบรวม exports ในแต่ละ folder
3. ใช้ `export * from` สำหรับ re-export จาก subfolders

### 5. Performance

ใช้ optimization เมื่อจำเป็น

> Goal: functions มี performance ที่เหมาะสม

1. ใช้ memoization สำหรับ functions ที่คำนวณซ้ำ
2. ใช้ lazy evaluation สำหรับข้อมูลจำนวนมาก
3. ใช้ caching สำหรับ functions ที่มี cost สูง

## Rules

- ใช้ Pure Functional Programming principles — no side effects, no mutation, deterministic
- จัดโครงสร้าง utils เป็น subfolders ตามหมวดหมู่
- เรียง imports: external → internal → relative
- ใช้ `import type` สำหรับ type-only imports
- ตั้งชื่อ function ด้วย verb หรือ verb+noun
- จำกัด function size ไม่เกิน 20-30 lines
- ใช้ named exports เป็นหลัก
- สร้าง `index.ts` ในแต่ละ folder

## Expected Outcome

- utils แบ่งเป็น subfolders ตามหมวดหมู่
- functions เป็น pure, type-safe, และมี unit tests
- imports เรียงลำดับชัดเจน
- exports ใช้ named exports พร้อม index files
