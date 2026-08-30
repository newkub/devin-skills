---
name: follow-create-vite-plugins
description: สร้าง Vite plugins ด้วย Plugin API มาตรฐาน
related:
  - follow-create-sdk
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-vite
  - ship
---
## Goal

สร้าง Vite plugins ด้วย Plugin API มาตรฐาน พร้อมรองรับ Rolldown compatibility

## Scope

ใช้ `follow-create-vite-plugins` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup

> Goal: เตรียมโครงสร้างโฟลเดอร์และ config เริ่มต้น

1. สร้างโครงสร้างโฟลเดอร์ `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย dependencies และ scripts
3. สร้าง `tsconfig.json` สำหรับ TypeScript configuration

### 3. Create Plugin

> Goal: สร้าง plugin implementation ด้วย hooks ตาม [references/plugin-api.md](references/plugin-api.md)

1. สร้าง `src/index.ts` พร้อม plugin implementation
2. กำหนด plugin function ที่ return object ด้วย hooks
3. ใช้ TypeScript สำหรับ type safety

### 4. Configure Build

> Goal: ตั้งค่า library mode build ตาม [references/library-mode.md](references/library-mode.md)

1. สร้าง `vite.config.ts` สำหรับ library mode build
2. ตั้งค่า build.lib ด้วย entry, name, fileName
3. external vite จาก bundle

### 5. Add Examples

> Goal: สร้างตัวอย่างการใช้งานพื้นฐานและขั้นสูง

1. สร้าง `examples/basic/` พร้อมตัวอย่างพื้นฐาน
2. สร้าง `examples/advanced/` พร้อมตัวอย่างขั้นสูง
3. ทดสอบ examples ว่าทำงานได้จริง

### 6. Add Tests

> Goal: สร้าง unit และ integration tests สำหรับ plugin

1. สร้าง `test/` ด้วย unit และ integration tests
2. รัน `build` เพื่อตรวจสอบ build process
3. รัน `test` เพื่อตรวจสอบ functionality

### 7. Ship

> Goal: ส่งมอบงาน

1. ทำ `/ship`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Naming

- ใช้ `vite-plugin-{name}` สำหรับ Vite-specific plugins
- ใช้ `rolldown-plugin-{name}` สำหรับ Rolldown compatible plugins
- ใช้ `vite-plugin-{framework}-{name}` สำหรับ framework-specific plugins

### 2. Universal Hooks

- ใช้ Rolldown compatible hooks สำหรับ dev และ build ดู [references/plugin-api.md](references/plugin-api.md)
- Hooks: options, buildStart, resolveId, load, transform, buildEnd, closeBundle
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode

### 3. Vite Specific Hooks

- ใช้ Vite-specific hooks เฉพาะเมื่อจำเป็น ดู [references/plugin-api.md](references/plugin-api.md)
- Hooks: config, configResolved, configureServer, transformIndexHtml, handleHotUpdate

### 4. Plugin Ordering

- ใช้ `enforce: 'pre'` สำหรับก่อน Vite core plugins
- ใช้ `enforce: 'post'` สำหรับหลัง Vite build plugins
- ไม่กำหนดสำหรับระหว่าง Vite core และ build plugins

### 5. Conditional Application

- ใช้ `apply: 'build'` สำหรับ build-only plugins
- ใช้ `apply: 'serve'` สำหรับ dev-only plugins
- ใช้ function สำหรับ logic ที่ซับซ้อน

### 6. Library Mode

- ใช้ Vite library mode สำหรับ building plugins ดู [references/library-mode.md](references/library-mode.md)
- ตั้งค่า build.lib ด้วย entry, name, fileName
- ใช้ formats: ['es', 'cjs']
- external vite จาก bundle

## Expected Outcome

- Plugin สร้างขึ้นด้วย naming convention ถูกต้อง
- Plugin ใช้ universal hooks สำหรับ Rolldown compatibility
- Plugin build ด้วย library mode สำเร็จ
- Examples และ tests สร้างขึ้นครบถ้วน