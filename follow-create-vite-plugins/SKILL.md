---
name: follow-create-vite-plugins
description: สร้าง Vite plugins ด้วย Plugin API มาตรฐาน
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'write', 'grep', 'glob', 'exec', 'ask_user_question']
---

สร้าง Vite plugins ตามมาตรฐาน Plugin API จาก vite.dev/guide/api-plugin

## Goal

สร้าง Vite plugins ด้วย Plugin API มาตรฐาน พร้อมรองรับ Rolldown compatibility

## Execute

### 1. Setup

1. สร้างโครงสร้างโฟลเดอร์ `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย dependencies และ scripts
3. สร้าง `tsconfig.json` สำหรับ TypeScript configuration

### 2. Create Plugin

1. สร้าง `src/index.ts` พร้อม plugin implementation
2. กำหนด plugin function ที่ return object ด้วย hooks
3. ใช้ TypeScript สำหรับ type safety

### 3. Configure Build

1. สร้าง `vite.config.ts` สำหรับ library mode build
2. ตั้งค่า build.lib ด้วย entry, name, fileName
3. external vite จาก bundle

### 4. Add Examples

1. สร้าง `examples/basic/` พร้อมตัวอย่างพื้นฐาน
2. สร้าง `examples/advanced/` พร้อมตัวอย่างขั้นสูง
3. ทดสอบ examples ว่าทำงานได้จริง

### 5. Add Tests

1. สร้าง `test/` ด้วย unit และ integration tests
2. รัน `build` เพื่อตรวจสอบ build process
3. รัน `test` เพื่อตรวจสอบ functionality

## Rules

### 1. Plugin Naming

- ใช้ `vite-plugin-{name}` สำหรับ Vite-specific plugins
- ใช้ `rolldown-plugin-{name}` สำหรับ Rolldown compatible plugins
- ใช้ `vite-plugin-{framework}-{name}` สำหรับ framework-specific plugins

### 2. Universal Hooks

- ใช้ Rolldown compatible hooks สำหรับ dev และ build
- Hooks: options, buildStart, resolveId, load, transform, buildEnd, closeBundle
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode

### 3. Vite Specific Hooks

- ใช้ Vite-specific hooks เฉพาะเมื่อจำเป็น
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

- ใช้ Vite library mode สำหรับ building plugins
- ตั้งค่า build.lib ด้วย entry, name, fileName
- ใช้ formats: ['es', 'cjs']
- external vite จาก bundle

## Expected Outcome

- Plugin สร้างขึ้นด้วย naming convention ถูกต้อง
- Plugin ใช้ universal hooks สำหรับ Rolldown compatibility
- Plugin build ด้วย library mode สำเร็จ
- Examples และ tests สร้างขึ้นครบถ้วน