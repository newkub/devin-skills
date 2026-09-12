---
name: follow-lib-unocss-setup-unocss
description: ติดตั้ง UnoCSS — install, uno.config.ts, presets, framework integration
argument-hint: "[framework]"
related:
  - follow-lib-unocss
  - follow-lib-css
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

ติดตั้ง UnoCSS ใน project — `unocss` package, `uno.config.ts` พร้อม `presetWind4` และ framework integration ขั้นต่ำที่ทำงานได้

## Scope

ใช้เมื่อต้อง setup UnoCSS ครั้งแรกบน Vite, Nuxt, Next.js, Astro หรือ CLI — ครอบคลุม install, config file พื้นฐาน และ smoke test (first-time setup ไม่ใช่ theme customization — ใช้ `config-theme` สำหรับ theme)

## Execute

### 1. Prepare

> Goal: ตรวจสอบ framework และ current state ก่อนติดตั้ง

1. ตรวจ framework จาก `package.json` และ config files (`vite.config.*`, `nuxt.config.*`, `astro.config.*`, `postcss.config.*`)
2. ตรวจว่ามี `uno.config.*` หรือ `unocss` อยู่แล้วหรือไม่ — ถ้า setup ไปแล้ว → verify เท่านั้น
3. ระบุ CSS entry point (`main.ts`, `app/globals.css`, `src/style.css`)

### 2. Install Dependencies

> Goal: ติดตั้ง `unocss` และ framework package ที่ต้องใช้

1. Core: `bun add -D unocss` (ใช้ package manager ที่ project ใช้)
2. Framework-specific ตามต้องการ: `@unocss/nuxt` (Nuxt), `@unocss/postcss` (Next.js), `@unocss/astro` (Astro), `@unocss/cli` (CLI)
3. Icons (optional): `bun add -D @iconify-json/mdi` สำหรับ `presetIcons`
4. ถ้าไม่แน่ใจ version → ดู official docs ที่ `https://unocss.dev`

### 3. Create uno.config.ts

> Goal: สร้าง config ขั้นต่ำที่ทำงานได้ก่อน

```ts
import { defineConfig, presetWind4 } from 'unocss'

export default defineConfig({
  presets: [presetWind4()],
})
```

1. เริ่มด้วย `presetWind4()` เท่านั้น — ค่อยเพิ่ม `presetIcons`, transformers ทีหลัง
2. ตั้ง `dark: 'class'` ใน `presetWind4` options ถ้าต้องการ class-based dark mode
3. เพิ่ม `content.filesystem` เฉพาะเมื่อ auto-scan ไม่ครอบคลุม
4. สำหรับ theme/shortcuts/rules → ทำ subskill `config-theme`

### 4. Wire Framework Integration

> Goal: เชื่อม UnoCSS เข้า framework ที่ใช้

1. Vite: เพิ่ม `UnoCSS()` plugin ใน `vite.config.ts` ก่อน framework plugin และ `import 'virtual:uno.css'` ใน entry
2. Nuxt: เพิ่ม `@unocss/nuxt` ใน `modules` — CSS inject อัตโนมัติ
3. Next.js: `postcss.config.mjs` ด้วย `@unocss/postcss` และ `@unocss all;` ใน globals.css
4. Astro: `UnoCSS()` integration ใน `astro.config.mjs`
5. รายละเอียดเต็มตาม `/follow-lib-unocss` step 4

### 5. Verify

> Goal: smoke test ว่า UnoCSS generate CSS ได้

1. รัน `/run-dev` แล้วทดสอบ utilities เช่น `flex`, `bg-blue-500`, `text-center`
2. ตรวจ output CSS ว่ามี rules generate จริง
3. รัน build เพื่อยืนยันไม่มี error
4. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ `presetWind4` เป็น preset หลัก — ห้ามใช้ `presetWind`/`presetUno` รุ่นเก่าสำหรับ setup ใหม่
- ติดตั้งเป็น devDependencies — UnoCSS เป็น build-time tool
- config ขั้นต่ำก่อน เพิ่ม options ทีหลัง — ห้าม copy config ใหญ่โดยไม่เข้าใจ
- ใช้ `/follow-lib-unocss` สำหรับ full reference และ transformers
- ใช้ `/follow-lib-css` ถ้าจำเป็น

## Expected Outcome

- `uno.config.ts` พร้อม `presetWind4` ทำงานได้
- Framework integration เชื่อมถูกต้อง (virtual module / postcss / nuxt module / astro integration)
- Utilities generate CSS จริงใน dev และ build ผ่าน
