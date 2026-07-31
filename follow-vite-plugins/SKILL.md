---
name: follow-vite-plugins
description: แนวทางการใช้งานและสร้าง Vite plugins อย่างมีประสิทธิภาพ
---

## Goal

ใช้งาน community plugins และสร้าง Vite plugins ตาม Plugin API มาตรฐาน พร้อมประเมิน performance และ security

## Scope

ใช้สำหรับ project ที่ใช้ Vite และต้องการเลือก ปรับแต่ง หรือสร้าง plugins

## Execute

### 1. Using Vite Plugins

ติดตั้งและตั้งค่า plugins ตาม use cases

Framework Plugins:
- Vue: `@vitejs/plugin-vue`, `@vitejs/plugin-vue-jsx`
- React: `@vitejs/plugin-react`
- Solid: `vite-plugin-solid`
- Svelte: `@sveltejs/vite-plugin-svelte`

Build Optimization:
- `@vitejs/plugin-legacy` - สำหรับ legacy browser support
- `vite-plugin-pwa` - PWA support
- `rollup-plugin-visualizer` - bundle analysis

Development Experience:
- `vite-plugin-checker` - TypeScript/ESLint checking (ทำ `/follow-vite-plugin-checker`)
- `vite-plugin-inspect` - plugin inspection และ transform timing
- `unplugin-auto-import` - auto import APIs

CSS/Styling:
- `unocss/vite` - UnoCSS integration (ทำ `/follow-unocss`)
- LightningCSS - สำหรับ native CSS processing (เร็วกว่า PostCSS)

Utility:
- `unplugin-vue-components` - auto component registration
- `unplugin-icons` - icon auto import

### 2. Plugin Performance and Security Audit

1. Audit plugins: ตรวจสอบว่า community plugins ไม่ทำงานหนักใน `buildStart`, `config`, `configResolved` hooks
2. Reduce resolve operations: ใช้ explicit import paths เช่น `import './Component.jsx'` แทน `import './Component'`
3. Avoid barrel files: import จากไฟล์ตรงๆ เช่น `import { slash } from './utils/slash.js'` แทน `import { slash } from './utils'`
4. Warm up files: ใช้ `server.warmup.clientFiles` สำหรับไฟล์ที่ใช้บ่อยและ transform ช้า
5. Use lesser or native tooling: ใช้ CSS แทน Sass/Less เมื่อได้ และ import SVG เป็น string/URL แทน component
6. TypeScript: เปิด `moduleResolution: "bundler"` และ `allowImportingTsExtensions: true`
7. Optimize deps: ใช้ `optimizeDeps.include` สำหรับ deps ที่ Vite อาจ miss และ `optimizeDeps.exclude` สำหรับ ESM deps
8. Profile: ใช้ `vite --profile` แล้วกด `p + enter` สำหรับบันทึก `.cpuprofile`

### 3. Authoring Vite Plugins

#### 1. Setup

1. สร้างโครงสร้างโฟลเดอร์ `packages/{plugin-name}/`
2. สร้าง `package.json` ด้วย dependencies และ scripts
3. สร้าง `tsconfig.json` สำหรับ TypeScript configuration

#### 2. Create Plugin

1. สร้าง `src/index.ts` พร้อม plugin implementation
2. กำหนด plugin function ที่ return object ด้วย hooks
3. ใช้ TypeScript สำหรับ type safety

#### 3. Configure Build

1. สร้าง `vite.config.ts` สำหรับ library mode build
2. ตั้งค่า `build.lib` ด้วย `entry`, `name`, `fileName`
3. external `vite` จาก bundle

#### 4. Add Examples

1. สร้าง `examples/basic/` พร้อมตัวอย่างพื้นฐาน
2. สร้าง `examples/advanced/` พร้อมตัวอย่างขั้นสูง
3. ทดสอบ examples ว่าทำงานได้จริง

#### 5. Add Tests

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
- Hooks: `options`, `buildStart`, `resolveId`, `load`, `transform`, `buildEnd`, `closeBundle`
- หลีกเลี่ยง `moduleParsed` hook ใน dev mode

### 3. Vite Specific Hooks

- ใช้ Vite-specific hooks เฉพาะเมื่อจำเป็น
- Hooks: `config`, `configResolved`, `configureServer`, `transformIndexHtml`, `handleHotUpdate`

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
- ตั้งค่า `build.lib` ด้วย `entry`, `name`, `fileName`
- ใช้ formats: `['es', 'cjs']`
- external `vite` จาก bundle

### 7. Performance and Audit

- Audit plugins สำหรับ performance impact ใน `buildStart`, `config`, `configResolved`
- ใช้ explicit import paths พร้อม extension
- หลีกเลี่ยง barrel files
- ใช้ native tooling เมื่อได้
- เปิด `moduleResolution: "bundler"` และ `allowImportingTsExtensions: true`

## Expected Outcome

- เลือกและตั้งค่า plugins ได้ถูกต้องตาม use case
- Plugin audit ระบุปัญหา performance และ security
- Plugin สร้างขึ้นด้วย naming convention ถูกต้อง
- Plugin ใช้ universal hooks สำหรับ Rolldown compatibility
- Plugin build ด้วย library mode สำเร็จ
- Examples และ tests สร้างขึ้นครบถ้วน
