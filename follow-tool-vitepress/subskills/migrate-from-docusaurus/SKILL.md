---
name: follow-tool-vitepress-migrate-from-docusaurus
description: ย้าย docs site จาก Docusaurus ไป VitePress — content, frontmatter, nav/sidebar
argument-hint: "[scope]"
related:
  - follow-tool-vitepress
  - follow-gitignore
  - run-docs
---

## Goal

ย้าย documentation site จาก Docusaurus ไป VitePress อย่างปลอดภัย — content markdown, frontmatter, sidebar/nav structure — พร้อม rollback path

## Scope

ใช้เมื่อ project มี Docusaurus site อยู่และต้องการเปลี่ยนเป็น VitePress — ไม่ครอบคลุม fresh setup (ดู `subskills/setup-vitepress/SKILL.md`) หรือ theme deep customization (ดู `subskills/config-theme/SKILL.md`)

## Execute

### 1. Plan Migration

> Goal: map from→to ก่อนลงมือ

1. อ่าน `docusaurus.config.ts`/`docusaurus.config.js` — บันทึก title, tagline, navbar items, footer, i18n locales, plugins ที่ใช้
2. อ่าน `sidebars.ts`/`sidebars.js` — map sidebar structure
3. Inventory content dirs: `docs/`, `blog/`, `src/pages/`, `static/` — ทำ `/deep-impact` หรือ `scan-codebase` ถ้า site ใหญ่
4. เขียน rollback path: เก็บ Docusaurus config/content ไว้จน verify VitePress ผ่าน — แยก branch/commit ต่อ step

### 2. Setup VitePress Skeleton

> Goal: สร้าง VitePress structure ข้างๆ Docusaurus

1. ทำตาม `subskills/setup-vitepress/SKILL.md` — สร้าง `docs/` + `.vitepress/` (ตั้งชื่อ dir ชั่วคราวถ้าชนกับ Docusaurus `docs/`)
2. Map `docusaurus.config` → `.vitepress/config.ts`: `title`/`tagline` → `title`/`description`, navbar → `themeConfig.nav`, footer → `themeConfig.footer` (ถ้า theme รองรับ)

### 3. Migrate Content

> Goal: ย้าย markdown content พร้อมแปลง frontmatter

1. คัดลอก `docs/` markdown files → VitePress content dir — frontmatter keys ส่วนใหญ่ compatible (`title`, `description`)
2. แปลง Docusaurus-specific frontmatter: `sidebar_position` → เรียงผ่าน `sidebar` config ใน `themeConfig` แทน; `slug` → โครงสร้าง path ไฟล์; `id` → ไม่มีตรงๆ ใน VitePress
3. แปลง Docusaurus admonitions `:::note`/`:::tip`/`:::warning`/`:::danger` → VitePress custom containers (`::: info`, `::: tip`, `::: warning`, `::: danger`) — ใช้ `/use-astgrep` สำหรับ bulk transform ถ้าจำนวนมาก
4. แปลง MDX-specific syntax (`<Tabs>`, `<TabItem>`, `import` components) → VitePress markdown/Vue equivalents — manual review ทีละไฟล์
5. ย้าย `static/` assets → VitePress `public/` ใน docs dir
6. Rebuild sidebar: Docusaurus `sidebars` → `themeConfig.sidebar` object; navbar → `themeConfig.nav`
7. Blog: VitePress ไม่มี blog plugin built-in — ตัดสินใจว่า migrate เป็น pages, ใช้ plugin/community solution, หรือแยก blog ออก — ถาม user ถ้าไม่ชัด

### 4. Migrate i18n (If Any)

> Goal: ย้าย locales

1. Docusaurus `i18n/<locale>` → VitePress `locales` config + content dirs ตาม path prefixes
2. ดูรายละเอียดใน `subskills/config-theme/SKILL.md` step i18n

### 5. Verify And Cutover

> Goal: ตรวจว่า site ใหม่ทำงานเทียบเท่าก่อนลบของเก่า

1. รัน `vitepress dev` + `vitepress build` — ตรวจทุกหน้าสำคัญ render ถูก, links ไม่ dead
2. ทำ `/check-repo-hygiene dead-link` บน site ใหม่
3. spot-check admonitions, code blocks, images, i18n routes
4. ผ่านแล้ว → ลบ Docusaurus deps/config ออก, แก้ deploy workflow เป็น VitePress build — ทำ `/update-references` และอัปเดต docs/README
5. ทำ `/report-before-after` แล้ว `/ship`

## Rules

### 1. Migration Discipline

- ทีละชั้น incremental: config → content → assets → deploy — แยก commit ต่อ step ให้ bisect ได้
- ห้ามผสม migration กับ content/feature work ใน commit เดียว
- เก็บ Docusaurus setup จน verify ผ่าน — rollback ได้เสมอ

### 2. Content Fidelity

- admonitions/MDX components ต้องแปลงหรือแทนที่ — ห้ามทิ้ง syntax พังไว้
- internal links ต้องทำงาน — Docusaurus slug ≠ VitePress path เสมอไป

### 3. Parity

- feature ที่ VitePress ไม่มีตรงๆ (blog, versioning, MDX plugins) → ระบุ gap ให้ user ตัดสินใจก่อนลงมือ

- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /check-repo-hygiene dead-link ถ้าจำเป็น

## Expected Outcome

- VitePress site render content เทียบเท่า Docusaurus เดิม
- Nav/sidebar/i18n migrated ครบ
- `vitepress build` ผ่าน, deploy workflow อัปเดต, Docusaurus ถูกลบออก
