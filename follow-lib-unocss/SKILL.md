---
name: follow-lib-unocss
description: ติดตั้งและตั้งค่า UnoCSS v66 พร้อม presetWind4 และ transformers
related:
  - follow-lib-unocss-theme
  - follow-lib-css
  - follow-tool-formatter
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

สร้าง UnoCSS configuration ที่พร้อมใช้งานด้วย `presetWind4`, transformers, และ framework integration แบบปัจจุบัน

## Scope

ใช้สำหรับติดตั้งและตั้งค่า UnoCSS v66+ บน Vite, Nuxt, Next.js, Astro, CLI, และ CDN Runtime

## Execute

### 1. Prepare

> Goal: ตรวจสอบ framework และ environment ก่อนติดตั้ง

1. ตรวจสอบ framework ที่ใช้ (`Vite`, `Nuxt`, `Next.js`, `Astro`, `HTML/CLI`)
2. อ่าน config ที่มีอยู่แล้ว (`uno.config.*`, `vite.config.*`, `nuxt.config.*`, `postcss.config.*`, `astro.config.*`)
3. ระบุ CSS entry point (`main.ts`, `app/globals.css`, `src/style.css`, ฯลฯ)
4. ตรวจสอบ UnoCSS version ที่ install (ควรเป็น v66+; ล่าสุด v66.10.0)

### 2. Install Dependencies

> Goal: ติดตั้ง UnoCSS และ framework-specific packages

1. ติดตั้ง `unocss` package:

   ```bash
   bun add -D unocss
   ```

2. ติดตั้ง `presetWind4` แยกถ้าจำเป็น:

   ```bash
   bun add -D @unocss/preset-wind4
   ```

3. สำหรับ Next.js ติดตั้ง:

   ```bash
   bun add -D @unocss/postcss
   ```

4. สำหรับ Nuxt ติดตั้ง:

   ```bash
   bun add -D @unocss/nuxt
   ```

5. สำหรับ Astro ติดตั้ง:

   ```bash
   bun add -D @unocss/astro
   ```

6. สำหรับ Icons ติดตั้ง iconify collections:

   ```bash
   bun add -D @iconify-json/mdi
   ```

### 3. Configure

> Goal: สร้าง `uno.config.ts` พร้อม `presetWind4` และ transformers

1. สร้าง `uno.config.ts` พื้นฐาน:

   ```ts
   import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

   export default defineConfig({
     presets: [
       presetWind4(),
       presetIcons({
         collections: {
           mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
         },
       }),
     ],
     transformers: [
       transformerVariantGroup(),
       transformerDirectives(),
     ],
   })
   ```

2. ใช้ `presetWind4` options ตามต้องการ:

   ```ts
   presetWind4({
     preflights: {
       reset: true,           // built-in CSS reset
       theme: 'on-demand',    // generate theme CSS vars on demand (default)
       property: true,        // @property rules for optimization (default)
     },
     dark: 'class',           // 'class' | 'media' | { dark, light }
   })
   ```

3. ถ้า auto-scan ไม่ครอบคลุม ให้เพิ่ม `content.filesystem`:

   ```ts
   content: { filesystem: ['./src//*.{html,js,ts,jsx,tsx,vue,svelte,astro}'] }
   ```

### 4. Setup Framework Integration

> Goal: เชื่อมต่อ UnoCSS เข้ากับ framework ที่ใช้

1. Vite: เพิ่ม `UnoCSS()` plugin ใน `vite.config.ts` และ `import 'virtual:uno.css'` ใน `main.ts`
2. Nuxt: เพิ่ม `@unocss/nuxt` ใน `modules` ของ `nuxt.config.ts`; `uno.css` ถูก inject อัตโนมัติ
3. Next.js: สร้าง `postcss.config.mjs` ด้วย `@unocss/postcss` และใส่ `@unocss all;` ใน `app/globals.css`
4. Astro: เพิ่ม `UnoCSS()` integration ใน `astro.config.mjs`; ใช้ `injectReset: true` หรือติดตั้ง `@unocss/reset` ถ้าต้องการ reset
5. CLI: ติดตั้ง `@unocss/cli` ถ้าจำเป็น; ใช้ `unocss --preset wind4` เมื่อไม่มี config; รองรับ `--watch`, `--out-file`, `--rewrite`
6. CDN / Runtime: ใช้ `@unocss/runtime` หรือ `@unocss/reset` ตามต้องการ

### 5. Use Transformers

> Goal: ใช้ transformers สำหรับ functionality เพิ่มเติม

1. `transformerVariantGroup`: group utilities เช่น `hover:(bg-gray-400 font-medium)`
2. `transformerDirectives`: ใช้ `@apply`, `@screen`, `theme()`, `icon()` ใน CSS
3. `transformerAttributifyJsx`: ใช้ valueless attributes ใน JSX/TSX
4. `transformerCompileClass`: สร้าง short class names สำหรับ production (optional)

### 6. Use Additional Presets (Optional)

> Goal: ใช้ presets เพิ่มเติมตามความต้องการ

1. `presetWebFonts`: โหลด web fonts
2. `presetTypography`: prose styling
3. `presetAttributify`: attributify mode
4. `presetTagify`: tagify mode
5. `presetRemToPx`: แปลง rem เป็น px หรือใช้ `createRemToPxProcessor` ใน `presetWind4`

### 7. Setup IDE Support (Optional)

> Goal: ตั้งค่า IDE support

1. ติดตั้ง VS Code extension `antfu.unocss`
2. ใช้ `@unocss/language-server` สำหรับ LSP
3. ใช้ `@unocss/twoslash` สำหรับ TypeScript twoslash

### 8. Verify

> Goal: ตรวจสอบว่า UnoCSS ทำงานได้ถูกต้อง

1. รัน `bun run dev` (หรือ `bunx unocss --watch` สำหรับ CLI)
2. ทดสอบ utilities เช่น `flex`, `bg-blue-500`, `i-mdi-home`
3. ตรวจสอบ theme CSS variables ถูก generate ใน output
4. ตรวจสอบ dark mode ทำงานผ่าน class หรือ media query
5. ตรวจสอบ transformers ทำงาน (variant groups, directives)
6. รัน build เพื่อตรวจสอบว่าไม่มี error

## Rules

### Installation

- ใช้ `unocss` v66+ (latest v66.10.0)
- สำหรับ Next.js ติดตั้ง `@unocss/postcss`
- สำหรับ Nuxt ติดตั้ง `@unocss/nuxt`
- สำหรับ Astro ติดตั้ง `@unocss/astro`
- ใช้ package manager ที่ project ใช้ (`bun`, `pnpm`, `npm`, `yarn`)

### Configuration

- ใช้ `presetWind4` เป็น preset หลัก
- ใช้ `preflights.reset: true` แทนการ import `@unocss/reset/tailwind.css` เมื่อใช้ `presetWind4`
- ใช้ `preflights.theme: 'on-demand'` (default) เพื่อ generate theme CSS vars เฉพาะที่ใช้
- ใช้ `preflights.property: true` (default) เพื่อ generate `@property` rules
- ใช้ `presetIcons` สำหรับ icon bundler พร้อม collections import
- เพิ่ม transformers ตามต้องการ: `transformerVariantGroup`, `transformerDirectives`, `transformerAttributifyJsx`
- ตั้งค่า `content.filesystem` เมื่อ auto-scan ไม่ครอบคลุม

### Framework Integration

| Framework | Config Files | CSS Entry / Notes |
|-----------|--------------|-------------------|
| Vite | `vite.config.ts`, `uno.config.ts` | `import 'virtual:uno.css'` in `main.ts` |
| Nuxt | `nuxt.config.ts`, `uno.config.ts` | `uno.css` auto-injected |
| Next.js | `postcss.config.mjs`, `uno.config.ts` | `app/globals.css` ใส่ `@unocss all;` |
| Astro | `astro.config.mjs`, `uno.config.ts` | `UnoCSS()` integration, optional `injectReset` |
| CLI | `uno.config.ts` | `unocss --preset wind4 --watch` |

### Transformers

- `transformerVariantGroup`: group utilities
- `transformerDirectives`: `@apply`, `@screen`, `theme()`, `icon()`
- `transformerAttributifyJsx`: JSX attributify
- `transformerCompileClass`: compile class names (optional)

### Migration From PresetWind3

- Theme keys เปลี่ยน: `fontFamily` → `font`, `borderRadius` → `radius`, `boxShadow` → `shadow`, `breakpoints` → `breakpoint`, `easing` → `ease`, `transitionProperty` → `property`, size props → `spacing`
- ใช้ `preflights.reset` แทนการ import `@unocss/reset`
- Theme CSS variables generate แบบ on-demand ภายใต้ `theme` layer
- `@property` rules generate ภายใต้ `properties` layer

- ใช้ `/follow-lib-unocss-theme` ถ้าจำเป็น
- ใช้ `/follow-lib-css` ถ้าจำเป็น
- ใช้ `/follow-tool-formatter` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น

## Expected Outcome

1. UnoCSS v66+ ติดตั้งและทำงานได้พร้อม `presetWind4`
2. CSS reset ทำงานผ่าน preflights โดยไม่ต้อง import reset package ในกรณีทั่วไป
3. Theme variables generate แบบ on-demand เป็น CSS custom properties
4. Transformers ทำงานได้ (variant groups, directives, attributify JSX)
5. Dev server รันได้โดยไม่มี error
6. Utilities ใช้งานได้ทันที (e.g., `flex`, `bg-blue-500`, `i-mdi-home`)
7. Dark mode ทำงานผ่าน class หรือ media query
8. IDE support / twoslash ทำงาน (ถ้าติดตั้ง)
