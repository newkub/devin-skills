---
name: follow-import-export
description: จัดการ import strategy และ barrel exports สำหรับ module public API
---

## Goal

จัดการ import และ export strategy สำหรับ TypeScript/JavaScript: barrel exports, import aliases, import ordering, type-only imports, circular dependency detection และ optimization

## Scope

ใช้สำหรับทุก workspace เมื่อสร้าง แก้ไข หรือ review:
- Barrel export files (`index.ts`, `index.tsx`, `__init__.py` หรือไฟล์ index ตาม convention ของภาษา)
- Import aliases และ import strategy ทั้งโปรเจกต์
- ใช้ภายใต้ `/refactor` เมื่องาน refactor ครบวงจร

## Execute

### 1. Analyze Module Structure And Import Landscape

> Goal: วิเคราะห์โครงสร้าง module และ import patterns ที่มีอยู่

1. อ่าน configuration files หลัก (`package.json`, `tsconfig.json`, `vite.config.ts`, `biome.jsonc`)
2. ระบุ files ทั้งหมดใน module ที่มี exports
3. แยก public API จาก internal implementation
4. ตรวจสอบ import aliases และ barrel exports ที่มีอยู่แล้ว
5. ค้นหา relative imports ที่ซับซ้อน (`../../../`) ด้วย `/scan-codebase`
6. ระบุ consumers ที่ import จาก module และ build tool ที่ใช้

### 2. Configure Import Aliases

> Goal: ตั้งค่า import aliases ใน configuration files

1. ตั้งค่า `paths` ใน `tsconfig.json` สำหรับ TypeScript (ทำ `/follow-lang-typescript`)
2. ตั้งค่า `resolve.alias` ใน `vite.config.ts` สำหรับ Vite
3. ตั้งค่า `imports` ใน `package.json` สำหรับ Bun
4. ตั้งค่า framework-specific aliases (Next.js, Nuxt, Solid, etc.)
5. ทำ `/follow-config` เพื่อตรวจสอบ consistency ระหว่าง configuration files
6. ใช้ naming conventions ที่สม่ำเสมอ: `#` prefix สำหรับ TypeScript, `@/` สำหรับ frameworks

### 3. Create Or Update Barrel File

> Goal: สร้างหรืออัปเดต barrel export file และเลือก export strategy

1. สร้าง `index.ts` ที่ root ของ module (ถ้ายังไม่มี)
2. Export เฉพาะ public API ที่ consumers ต้องการใช้
3. ใช้ named exports เป็นหลัก — กระชับ เข้าใจง่าย ตรวจสอบได้
4. ใช้ `export *` เฉพาะ schema files, type definition files หรือเมื่อทุก export เป็น public API
5. ใช้ `export type` สำหรับ type-only exports
6. ซ่อน internal symbols ที่ไม่ต้องเป็น public API
7. จัดเรียง exports ตาม source file ตามตัวอักษร

### 4. Replace Relative Imports And Enforce Ordering

> Goal: แทนที่ relative paths ที่ซับซ้อนด้วย import aliases และจัดเรียง imports ให้สม่ำเสมอ

1. ค้นหา relative imports ที่ซับซ้อน (`../../../`)
2. แทนที่ด้วย import alias ที่ตั้งค่าไว้
3. เปลี่ยน deep imports เป็น barrel imports
4. จัดเรียง imports ตามลำดับ: external → internal alias → relative → type-only
5. จัดกลุ่ม imports ด้วย blank lines และใช้ Biome `organizeImports` สำหรับ auto-sorting
6. ใช้ type-only imports สำหรับ types (ถ้าภาษารองรับ)
7. ตรวจสอบว่าไม่มี deep imports ที่ข้าม module boundary และไม่มี duplicate imports จาก same module
8. ถ้าต้อง rename identifier ขณะ update consumers → ทำ `/rename` เพื่อ rename อย่างปลอดภัยด้วย ast-grep
9. ถ้ามีไฟล์มากกว่า 10 ไฟล์ → ทำ `/use-scripts` สำหรับ automation (ดู Rules: Automation)

### 5. Detect Circular Dependencies

> Goal: ตรวจจับและแก้ไข circular dependencies

1. ทำ `/check-circular-dependencies` เพื่อตรวจจับและแก้ไข circular dependencies
2. รัน `madge --circular --extensions ts,tsx` เพื่อตรวจสอบ
3. ยืนยันว่าไม่มี circular dependencies เหลืออยู่

### 6. Verify And Optimize

> Goal: ตรวจสอบว่า import และ export strategy ทำงานได้ถูกต้องและมีประสิทธิภาพ

1. รัน `/run-typecheck` เพื่อตรวจสอบ type safety
2. รัน `/run-lint` เพื่อตรวจสอบ code quality และ unused imports
3. รัน build ตรวจสอบว่าไม่มี build errors
4. ตรวจสอบ unused exports โดยใช้ `/run-verify` หรือ `knip`
5. ตรวจสอบ tree-shaking: ไม่มี side effects ใน barrel file และใช้ named imports แทน namespace imports
6. ถ้าเหมาะสม → ใช้ dynamic imports สำหรับ code splitting และตรวจสอบ bundle size impact
7. ยืนยันว่า functionality ทั้งหมดยังทำงานได้ปกติ

## Rules

### Barrel Exports

- Barrel file มีเฉพาะ re-exports ไม่มี logic, ไม่มี side effects
- ใช้ `export ... from` เท่านั้น ไม่ import และ re-export ในบรรทัดเดียวกัน
- แยก `export type` จาก `export` ธรรมดาเพื่อ clarity
- ไม่ export default จาก barrel file ใช้ named exports เท่านั้น
- Export เฉพาะสิ่งที่ consumers ต้องการจริง ซ่อน implementation details และ internal helpers
- ถ้า module มี sub-modules ให้สร้าง barrel file ระดับกลาง
- หลีกเลี่ยง barrel file ที่ export ทุกอย่างแบบไม่เลือก

### Import Strategy

- ใช้ alias แทน relative paths ที่ซับซ้อน (`../../../`) เสมอ
- TypeScript: `#` prefix (เช่น `#domain`, `#shared`); frameworks: `@/` prefix
- ลำดับ: external → internal alias → relative → type-only
- จัดกลุ่มด้วย blank lines ใช้ Biome `organizeImports` สำหรับ auto-sorting
- หลีกเลี่ยงการ import ทั้ง folder โดยไม่จำเป็น
- ใช้รูปแบบ barrel export สม่ำเสมอทั่วทั้ง project

### Circular Dependency Prevention

- ไม่สร้าง barrel file ที่ import จากกันและกันระหว่าง sibling modules
- ถ้าเกิด circular dependency ให้แยก shared types ออกเป็นไฟล์ต่างหาก
- พิจารณาใช้ type-only imports สำหรับ types ที่ใช้ข้าม module
- ตรวจจับด้วย `madge --circular --extensions ts,tsx`
- ห้าม ignore warnings — ทำ `/check-circular-dependencies`

### Performance

- หลีกเลี่ยง `export *` จาก module ที่มี exports จำนวนมาก เพราะกระทบ tree-shaking
- ใช้ named exports เมื่อต้องการ granular control
- ตรวจสอบ bundle size หลังเปลี่ยน barrel export strategy
- พิจารณา dynamic imports สำหรับ large modules

### Automation

- ถ้ามีไฟล์มากกว่า 10 ไฟล์ → ทำ `/use-scripts`
- ast-grep: ใช้ pattern `import { $$$ } from "../../../$$"` rewrite เป็น alias path — ปลอดภัย ไม่ break syntax
- Bun script: ใช้ `Bun.Glob` scan ไฟล์ + `Bun.file()` + `Bun.write()` สำหรับ batch migration
- เพิ่ม `dryRun` option สำหรับ preview ก่อน apply
- เก็บ scripts ใน `$env:TEMP` และลบหลังใช้งาน

### Identifier Renaming

- ถ้าต้อง rename identifier ขณะ restructure imports/exports → ทำ `/rename` เพื่อ rename ด้วย ast-grep อย่างปลอดภัย
- ใช้ `/rename` เมื่อเปลี่ยนชื่อ export ที่ consumers อ้างอิงอยู่ เพื่อ update ทุก reference พร้อมกัน
- หลีกเลี่ยงการ rename manual หลายไฟล์ — ใช้ `/rename` ที่มี validation ครบ (typecheck, lint, test)

### Priority

- จัดลำดับ: circular dependencies > unused imports > barrel exports > alias migration > ordering

## Expected Outcome

- Barrel export files ที่รวบรวม public API ของ module ซ่อน internal implementation
- Import aliases สอดคล้องกันทุก configuration files
- ไม่มี relative paths ที่ซับซ้อน (`../../../`)
- Import ordering สม่ำเสมอทั้งโปรเจกต์
- ไม่มี circular dependencies จาก barrel exports
- ไม่มี unused imports และ unused exports
- Tree-shaking ทำงานได้อย่างมีประสิทธิภาพ
