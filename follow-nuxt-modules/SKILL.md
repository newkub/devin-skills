---
name: follow-nuxt-modules
description: สร้าง Nuxt modules ตาม best practices และมาตรฐาน
---

## Goal

สร้าง Nuxt modules ตาม best practices และมาตรฐาน

## Execute

### 1. Plan Module

1. ระบุ features และ scope ของ module
2. กำหนด runtime vs build-time code ที่ต้องแยก
3. ตรวจสอบ module name ไม่ซ้ำกับที่มีอยู่

### 2. Setup Structure

1. ทำ `/monorepo` สำหรับ module structure ใน monorepo
2. สร้าง `src/module.ts` เป็น main entry point
3. แยก runtime code ไว้ใน `src/runtime/`

### 3. Configure Build

1. ทำ `/tsconfig-json` สำหรับ TypeScript configuration
2. ทำ `/tsdown` สำหรับ build configuration พร้อม plugin vue
3. ทำ `/biome` สำหรับ linting และ formatting
4. ตั้งค่า `meta.compatibility` สำหรับ version constraints

### 4. Implement Best Practices

1. ใช้ lifecycle hooks (`onInstall`, `onUpgrade`) สำหรับ one-time setup
2. ใช้ ESM syntax สำหรับทุกไฟล์
3. Prefix exports ด้วย module name
4. Expose TypeScript types สำหรับ users

### 5. Add Documentation

1. เขียน README.md พร้อม usage examples
2. สร้าง playground หรือ StackBlitz demo
3. เพิ่ม JSDoc comments สำหรับ public APIs

### 6. Test And Verify

1. ทำ `/vitest` สำหรับ testing setup
2. รัน `bun run build` ตรวจสอบ build
3. รัน `bun run dev` ตรวจสอบ module load

## Rules

### 1. Directory Structure

สร้างโครงสร้างไฟล์ตามมาตรฐาน Nuxt module development:

- แยก runtime code ไว้ใน `src/runtime/`
- แยก build-time code ไว้ใน `src/module.ts`
- สร้าง playground สำหรับ development
- เพิ่ม test directory สำหรับ testing
- เพิ่ม docs directory สำหรับ documentation

```
module-name/
├── src/
│   ├── module.ts              # Main entry point
│   ├── runtime/              # Runtime code (client/server)
│   │   ├── components/       # Vue components
│   │   ├── composables/      # Vue composables
│   │   ├── plugins/         # Nuxt plugins
│   │   ├── middleware/      # Nuxt middleware
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── index.ts              # Re-exports
├── playground/               # Development playground
│   ├── app.vue
│   ├── nuxt.config.ts
│   └── package.json
├── test/                    # Test files
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
├── docs/                    # Documentation
│   ├── README.md
│   ├── guide/
│   └── api/
├── package.json             # Module package.json
├── tsdown.config.ts        # Tsdown build config
├── tsconfig.json           # TypeScript config
├── nuxt.config.ts          # Nuxt config for development
├── biome.jsonc             # Biome linting config
├── vitest.config.ts        # Vitest test config
└── README.md               # Module documentation
```

### 2. Module Definition

ใช้ `defineNuxtModule` และ lifecycle hooks สำหรับ module setup:

- ใช้ `onInstall` สำหรับ one-time setup (generate config, setup database)
- ใช้ `onUpgrade` สำหรับ version-specific migrations
- ตั้งค่า `meta.compatibility` สำหรับ Nuxt version constraints
- ใช้ `meta.name` และ `meta.version` สำหรับ module metadata
- Prefix exports ด้วย module name เพื่อหลีกเลี่ยง conflicts

### 3. TypeScript And ESM

ใช้ TypeScript และ ESM syntax สำหรับ module development:

- Expose TypeScript types สำหรับ users แม้ไม่ใช้ TypeScript
- ใช้ ESM syntax สำหรับทุกไฟล์ (no CommonJS)
- ตั้งค่า `tsconfig.json` สำหรับ module development
- Export types ผ่าน `export type` สำหรับ tree-shaking
- ใช้ JSDoc comments สำหรับ public APIs

### 4. Documentation

เขียน documentation ครบถ้วนสำหรับ module:

- เขียน `README.md` พร้อม usage examples และ features
- สร้าง `playground/` หรือ StackBlitz demo สำหรับ testing
- เพิ่ม API reference ใน `docs/api/`
- อธิบาย why, how, และ what ของ module
- Link ไปที่ integration website และ documentation

### 5. Async And Prefixing

จัดการ async behavior และ prefix exports อย่างถูกต้อง:

- Defer time-consuming logic ไป Nuxt hooks แทน module setup
- Prefix exports ด้วย module name เพื่อหลีกเลี่ยง conflicts
- Prefix server routes ด้วย `_` เช่น `/api/_foo/track`
- Prefix components, composables, plugins ด้วย module name
- ระวัง async setup ที่อาจ block development server

### 6. Starter Conventions

ทำตาม conventions จาก module starter:

- ใช้ default tools จาก module starter (ESLint, etc.)
- รักษา coding style ที่สอดคล้องกับ community modules
- ทำให้ง่ายสำหรับ others ที่จะ contribute

## Expected Outcome

- Nuxt module ที่มีโครงสร้างสมบูรณ์
- ใช้ Tsdown สำหรับ build module พร้อม plugin vue
- Runtime code แยกจาก build-time code อย่างชัดเจน
- รองรับ TypeScript และ type declarations
- พร้อมใช้งานใน monorepo
