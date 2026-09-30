---
name: follow-create-vite-plugin
description: สร้าง Vite plugins ด้วย Plugin API มาตรฐาน
argument-hint: "[scope]"
related:
  - follow-create-sdk
  - deep-review
  - follow-tool-vite
  - ship-to-dev-branch

---
## Goal

สร้าง Vite plugins ด้วย Plugin API มาตรฐาน พร้อมรองรับ Rolldown compatibility

## Scope

ใช้ `follow-create-vite-plugins` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม (create vite plugins)

- Packages: `vite` (8.x ใช้ Rolldown เป็น bundler default — universal hooks เป็น per-environment ผ่าน `this.environment`), `rolldown`, `typescript` — ยืนยันเวอร์ชันล่าสุดด้วย `/deep-research` + `/follow-best-practice` ทุกครั้ง (ไม่ pin ในไฟล์ — ตาม `/update-devin-global-skills`)

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/deep-research` + `/follow-best-practice` เพื่อยืนยันเวอร์ชันและ pattern ล่าสุด จากนั้นทำ `/deep-review` เพื่อสรุป tech stack
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป (create vite plugins)

### 2. Setup

> Goal: เตรียมโครงสร้างโฟลเดอร์และ config เริ่มต้น

1. สร้างโครงสร้างโฟลเดอร์ `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย dependencies และ scripts
3. สร้าง `tsconfig.json` สำหรับ TypeScript configuration

### 3. Create Plugin

> Goal: สร้าง plugin implementation ด้วย hooks ตาม Vite Plugin API (Rolldown-compatible)

1. สร้าง `src/index.ts` พร้อม plugin implementation — plugin object ต้องมี `name` (required ใช้ใน error/debugging), optional `enforce`/`apply`
2. กำหนด plugin function ที่ return object ด้วย hooks
3. ใช้ TypeScript สำหรับ type safety

### 4. Configure Build

> Goal: ตั้งค่า library mode build ตาม Vite `build.lib`

1. สร้าง `vite.config.ts` สำหรับ library mode build — `build.lib`: `entry` (`resolve(import.meta.dirname, 'lib/main.ts')` หรือ map หลาย entries), `name` (UMD global), `fileName`; default formats: single entry = `es`+`umd`, multi entries = `es`+`cjs`
2. external deps ที่ไม่ต้องการ bundle ผ่าน `build.rolldownOptions.external` (+ `output.globals` สำหรับ UMD)
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

1. ทำ `/ship-to-dev-branch`
2. ถ้า `ship` ไม่ผ่าน → report สถานะ

## Rules

### 1. Plugin Naming

- ใช้ `vite-plugin-{name}` สำหรับ Vite-specific plugins
- ใช้ `rolldown-plugin-{name}` สำหรับ Rolldown compatible plugins
- ใช้ `vite-plugin-{framework}-{name}` สำหรับ framework-specific plugins

### 2. Universal Hooks

- ใช้ Rolldown compatible hooks สำหรับ dev และ build
- Hooks: options, buildStart, resolveId, load, transform, buildEnd, closeBundle
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode (Vite ไม่ทำ full AST parse; output generation hooks ยกเว้น `closeBundle` ไม่ถูกเรียกใน dev)
- ใช้ hook filters (Rolldown/Rollup 4.38+) ลด overhead ระหว่าง Rust↔JS runtime
- ใช้ `normalizePath` จาก `vite` แปลง path เป็น POSIX separators
- เช็ค runtime ด้วย `this.meta.viteVersion` และ `this.meta.rolldownVersion` (Rolldown-powered Vite 8+)

### 3. Vite Specific Hooks

- ใช้ Vite-specific hooks เฉพาะเมื่อจำเป็น
- Hooks: config, configResolved, configureServer, configurePreviewServer, closeServer (`{ reason: 'restart' | 'close' }` — dispose resources จาก `configureServer`), transformIndexHtml, handleHotUpdate
- ใช้ `hotUpdate` hook (per-environment, รับ `HotUpdateOptions` ที่มี `type: 'create' | 'update' | 'delete'`) สำหรับ HMR ใหม่ — `handleHotUpdate` มีแผน deprecate
- Universal hooks เป็น per-environment — เข้าถึง environment ปัจจุบันผ่าน `this.environment` ใน hook

### 4. Plugin Ordering

- ใช้ `enforce: 'pre'` สำหรับก่อน Vite core plugins
- ใช้ `enforce: 'post'` สำหรับหลัง Vite build plugins
- ไม่กำหนดสำหรับระหว่าง Vite core และ build plugins

### 5. Conditional Application

- ใช้ `apply: 'build'` สำหรับ build-only plugins
- ใช้ `apply: 'serve'` สำหรับ dev-only plugins
- ใช้ function `(config, { command }) => command === 'build'` สำหรับ logic ที่ซับซ้อน

### 6. Library Mode

- ใช้ Vite library mode สำหรับ building plugins (browser-oriented) — non-browser/advanced ใช้ `tsdown` หรือ Rolldown โดยตรง
- ตั้งค่า build.lib ด้วย entry, name, fileName (+ `cssFileName` ถ้ามี CSS — export `"./style.css"` ใน package.json)
- ใช้ formats: ['es', 'cjs'] — `.js` output กลายเป็น `.mjs` และ `.cjs` กลายเป็น `.js` ตาม `type: module`
- `package.json`: `"files": ["dist"]`, subpath `exports` ต่อ entry (`import`/`require`); types build แยกด้วย `tsc --emitDeclarationOnly` (Vite ไม่ emit declarations)
- `import.meta.env.*` ถูก static-replace ตอน build แต่ `process.env.*` ไม่ — ถ้าต้องการ ให้กำหนดใน `define` config
- external vite จาก bundle

- ใช้ /follow-create-sdk ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น

## Expected Outcome

- Plugin สร้างขึ้นด้วย naming convention ถูกต้อง
- Plugin ใช้ universal hooks สำหรับ Rolldown compatibility
- Plugin build ด้วย library mode สำเร็จ
- Examples และ tests สร้างขึ้นครบถ้วน
