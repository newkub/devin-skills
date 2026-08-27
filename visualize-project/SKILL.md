---
name: visualize-project
description: สร้าง Vite + Solid + TanStack project ชั่วคราวใน temp เพื่อ visualize
argument-hint: "[project-or-items]"
related:
  - taxonomy
  - follow-solid-tanstack
  - follow-framework-solidjs
  - follow-lib-unocss
  - follow-tool-vite
  - resolve-errors
  - open-web
---

## Goal

สร้าง temporary Vite + Solid + TanStack project บน OS temp directory สำหรับ visualize project ตาม taxonomy ที่สร้างจาก items หรือ domain ของ user โดยไม่ต้อง setup project ใหม่

## Scope

- ทำ `/taxonomy` ก่อนเพื่อได้หมวดหมู่และ items
- ใช้ Vite + SolidJS + TanStack Router ตาม `/follow-solid-tanstack`
- UX/UI เป็น 2 columns: ซ้าย `1/4` (taxonomy nav) ขวา `3/4` (scrollable content)
- ข้างขวา scroll แล้ว active item ข้างซ้ายเปลี่ยนตาม (scrollspy)
- Skill สร้าง `package.json`, `index.html`, `vite.config.ts`, `uno.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/styles.css` ทั้งหมด
- Output อยู่ใน OS temp directory เท่านั้น

## Execute

### 1. Run Taxonomy

> Goal: สร้าง taxonomy สำหรับ project ทีี่จะ visualize

1. รับ `project-or-items` จาก argument หรือ user context
2. ทำ `/taxonomy` เพื่อจัดหมวดหมู่ items (เช่น `components`, `api`, `data`, `routes`, `stores`)
3. ได้รับ categories, items, descriptions, และ hierarchy
4. ใช้ taxonomy นี้เป็นแหล่งข้อมูลหลักของ UI

### 2. Prepare Temp Directory

> Goal: สร้าง workspace ชั่วคราว

1. สร้าง `tempDir` ใน OS temp:
   - Windows: `$env:TEMP\visualize-project-<id>`
   - macOS/Linux: `tmp/visualize-project-<id>`
2. ไม่คัดลอกไฟล์จาก project ของ user

### 3. Generate Vite Project

> Goal: สร้าง project ตาม `/follow-solid-tanstack`

1. สร้าง `package.json` ด้วย dependencies:
   - `solid-js`, `vite`, `vite-plugin-solid`, `@tanstack/solid-router`
   - `unocss` และ `@iconify-json/mdi` ตาม `/follow-lib-unocss`
2. สร้าง `uno.config.ts` ตาม `/follow-lib-unocss`:
   ```ts
   import { defineConfig, presetWind4, presetIcons, transformerVariantGroup, transformerDirectives } from 'unocss'

   export default defineConfig({
     content: { filesystem: ['./src/**/*.{html,js,ts,jsx,tsx}'] },
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
3. สร้าง `vite.config.ts` ด้วย `vite-plugin-solid`, `UnoCSS()` จาก `unocss/vite`, `@tanstack/solid-router`
4. สร้าง `index.html` ด้วย `<div id="app"></div>` และ `<script type="module" src="/src/main.tsx"></script>`
5. สร้าง `src/main.tsx` เป็น entry point และ import `uno.css` หรือ `virtual:uno.css`
6. สร้าง `src/styles.css` ด้วย `@unocss all;` ถ้าใช้ CSS entry point แทน `virtual:uno.css`
7. สร้าง `src/App.tsx` ด้วย 2-col layout:
   - Left column (`w-1/4`): sidebar แสดง taxonomy tree/list พร้อม active state
   - Right column (`w-3/4`): scrollable content area แสดงรายละเอียดของแต่ละ item
8. สร้าง scrollspy: เมื่อ scroll ข้างขวา ให้ active item ข้างซ้ายเปลี่ยนตาม item ที่อยู่ใน viewport
9. Render items ตาม taxonomy:
   - `component`: render preview หรือ code snippet
   - `api`: render fetch tester
   - `data`: render table/chart
   - อื่นๆ: render description + metadata

### 4. Install And Run

> Goal: เปิด visualize project บน browser

1. รัน `bun install` ใน `tempDir`
2. รัน `bunx vite dev` หรือ `bun run dev`
3. รอ port พร้อมใช้
4. รัน `/open-web` หรือ `Start-Process <url>` เพื่อเปิด browser

### 5. Verify

> Goal: ยืนยัน project รันได้

1. ตรวจ dev server ไม่มี error
2. ตรวจ sidebar แสดง taxonomy ถูกต้อง
3. ตรวจ scrollspy ทำงานเมื่อ scroll ข้างขวา
4. ตรวจ UI แสดงรายละเอียดแต่ละ item ตาม taxonomy
5. ถ้า error → ทำ `/resolve-errors` แล้ว retry

## Rules

### 1. Full Vite + Solid Project

- Skill สร้าง `package.json`, `index.html`, `vite.config.ts`, `uno.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/styles.css` ทั้งหมด
- ไม่ต้องให้ user จัดเตรียม `package.json` หรือ `index.html`
- สร้าง project ตาม `/follow-solid-tanstack` โดยตรง

### 2. Temp Only

- สร้างและรันเฉพาะใน OS temp directory
- ไม่แก้ไข project directory ของ user
- ลบ temp dir เมื่องานเสร็จหรือ user บอก

### 3. Follow Solid TanStack Stack

- ทำตาม `/follow-solid-tanstack` สำหรับ `Vite`, `SolidJS`, `TanStack Router`, `Elysia/oRPC` ถ้าใช้
- ทำตาม `/follow-lib-unocss` สำหรับ styling
- ทำตาม `/follow-framework-solidjs` สำหรับ component patterns

### 4. No Report-HTML Dependency

- ไม่อ้างอิง `/report-html` หรือใช้ no-build HTML report pattern
- ใช้ Vite build และ Solid TSX ตาม `/follow-solid-tanstack`

### 5. Taxonomy First

- ต้องทำ `/taxonomy` ก่อน generate UI
- ใช้ categories จาก taxonomy เป็น sidebar items
- ใช้ items จาก taxonomy เป็น content sections

### 6. 2-Column Scrollspy Layout

- Left column กว้าง `25%` (`w-1/4`) แสดง taxonomy nav
- Right column กว้าง `75%` (`w-3/4`) แสดง scrollable content
- Scroll ข้างขวาแล้ว active item ข้างซ้ายเปลี่ยนอัตโนมัติ
- Click ข้างซ้ายแล้ว scroll ข้างขวาไปยัง item นั้น

## Expected Outcome

- Temp Vite + Solid + TanStack project รันบน browser ได้ พร้อม UnoCSS `presetWind4`
- Taxonomy ถูกแสดงบน sidebar ด้านซ้าย
- Content ของแต่ละ item แสดงในพื้นที่ด้านขวา
- Scrollspy ทำงานเมื่อ scroll ข้างขวา
- ไม่มี side effect ใน project directory
- สามารถปรับแต่งผ่าน config หรือ argument ได้
