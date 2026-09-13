---
name: follow-tool-vitepress-config-theme
description: ตั้งค่า VitePress theme — `.vitepress/theme/`, CSS vars, i18n, nav/sidebar
argument-hint: "[scope]"
related:
  - follow-lang-typescript
  - follow-lib-unocss
  - run-docs
---

## Goal

ตั้งค่าและแก้ไข VitePress theme — `.vitepress/theme/index.ts`, CSS variables, custom components, i18n/locales, nav/sidebar — โดย merge กับ config เดิม

## Scope

ใช้เมื่อต้อง customize theme หรือเพิ่ม i18n — init/structure อยู่ใน `subskills/setup-vitepress/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `.vitepress/config.ts` และ `.vitepress/theme/index.ts` (ถ้ามี)
2. ถ้าไม่มี `.vitepress/` → ทำ `subskills/setup-vitepress/SKILL.md` ก่อน

### 2. Theme Entry

> Goal: สร้าง/แก้ `.vitepress/theme/index.ts`

1. `import DefaultTheme from 'vitepress/theme'` แล้ว `export default { extends: DefaultTheme, enhanceApp({ app }) {} }`
2. ใช้ `enhanceApp` register global Vue components
3. สร้าง `.vitepress/theme/style.css` — ตั้ง CSS variables ใน `:root` เช่น `--vp-c-brand`
4. custom layout ใช้ `Layout` slot หรือสร้าง `.vitepress/theme/Layout.vue` ถ้าต้องการ (ดู official docs)

### 3. Nav And Sidebar

> Goal: ปรับ navigation structure ใน `themeConfig`

1. `nav` — top-level links; ใช้ `items` สำหรับ dropdown groups (เช่น จัดกลุ่ม workspaces ตาม category ใน monorepo)
2. `sidebar` — object form `{ '/path/': [sections] }` สำหรับ per-section sidebars
3. ตั้ง `logo`, `siteTitle`, `socialLinks`, `editLink`, `lastUpdated` ตามต้องการ
4. `search` — `local` provider (built-in) หรือ algolia options ถ้ามี

### 4. i18n / Locales

> Goal: ตั้งค่า multi-language ถ้าต้องการ

1. เพิ่ม `locales` ใน `config.ts` — key เป็น path prefix เช่น `'/th/'` พร้อม `lang`, `label`, `link`, themeConfig overrides ต่อ locale
2. สร้าง content mirror: `docs/th/index.md` ฯลฯ ตาม locale paths
3. ตั้ง `themeConfig` ต่อ locale (nav, sidebar, labels) — ดู official docs สำหรับ keys ทั้งหมดที่ override ได้

### 5. Verify

> Goal: ตรวจ theme ทำงาน

1. รัน `vitepress dev` — ตรวจ nav/sidebar/theme แสดงถูกต้องทุก locale
2. รัน `vitepress build` — ผ่านไม่มี dead links ที่ไม่ตั้งใจ
3. ถ้าพัง → revert keys ที่แก้แล้ว report diff ด้วย `/report-before-after`

## Rules

### 1. Theme

- extend `DefaultTheme` เสมอ — ห้ามเขียน theme จาก scratch ถ้าไม่จำเป็น
- `enhanceApp` สำหรับ register components; CSS vars ใน `:root`
- Vue components (`.vue`) สำหรับ interactive content; `.md` pages ใช้ frontmatter + import components

### 2. i18n

- locale keys เป็น path prefixes ที่ตรงกับ directory structure จริง
- ทุก locale ต้องมี content mirror ที่ path นั้น — missing = 404

### 3. Merge Discipline

- แก้เฉพาะ keys ที่จำเป็นใน `config.ts` — ห้าม overwrite ทั้งไฟล์

- ใช้ /follow-lib-unocss ถ้าจำเป็น (ถ้าใช้ UnoCSS กับ theme)
- ใช้ /run-docs ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น

## Expected Outcome

- `.vitepress/theme/` พร้อม custom theme + CSS vars
- Nav/sidebar ถูกต้องตาม content structure
- i18n locales ทำงานครบทุกภาษาที่เปิด
- `vitepress build` ผ่าน
