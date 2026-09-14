---
name: update-vitepress-docs
description: สร้าง VitePress docs site — content จาก update-docs + setup จาก follow-tool-vitepress
argument-hint: "[scope]"
related:
  - update-docs
  - follow-tool-vitepress
  - check-should-update
  - check-monorepo
  - review-docs
  - run-docs
  - update-references
  - follow-gitignore
  - follow-lang-typescript
---

## Goal

สร้าง/อัปเดต VitePress documentation site — เนื้อหา markdown จาก `/update-docs` (pages + templates + type detection) บวก VitePress setup จาก `/follow-tool-vitepress` (config, theme, plugins, scripts, deploy)

## Scope

ใช้เมื่อ project ต้องการ docs site ที่ build/deploy ได้ — ถ้าต้องการแค่ `docs/` markdown ล้วน (อ่านบน GitHub) ให้ใช้ `/update-docs` แทน

- Composition: `/update-docs` = เนื้อหาและ page structure, `/follow-tool-vitepress` = tooling (`vitepress`, UnoCSS, Shiki Twoslash, Group Icons, theme, CI deploy)
- Skill นี้เก็บเฉพาะ nav/sidebar/homepage templates และ orchestration — ห้ามซ้ำ content rules ของ `update-docs` หรือ setup steps ของ `follow-tool-vitepress`

## Execute

### 1. Prepare

> Goal: ระบุ docs type และสถานะ docs/ ปัจจุบัน

1. ทำ `/check-should-update` ถ้ามี git changes
2. ทำ `/check-monorepo` เพื่อระบุ monorepo
3. ระบุ docs type (`product` / `open-source` / `cli`) ตาม detection ใน `update-docs/references/<type>.md`
4. ถ้ามี `docs/` อยู่แล้ว → ทำ `/review-docs` ก่อนเพื่อหา gaps

### 2. Ensure Content Pages

> Goal: markdown pages ครบก่อนตั้งค่า site

1. ทำ `/update-docs` เพื่อสร้าง/อัปเดต `docs/` structure และ content pages ทั้งหมด (index, project, getting-started, development, references, roadmap, workspaces สำหรับ monorepo)
2. `docs/index.md` จาก `/update-docs` จะถูกแทนด้วย `templates/homepage.md` (`layout: home`) ใน Step 5

### 3. VitePress Setup

> Goal: ติดตั้ง vitepress และ scaffolding พื้นฐาน

ทำตาม `/follow-tool-vitepress` (`subskills/setup-vitepress/SKILL.md`):

1. สร้าง `docs/.vitepress/` config directory
2. Monorepo: `docs/package.json` เป็น workspace เอง + เพิ่ม `docs` ใน root `workspaces`; single project: scripts ใน root `package.json`
3. ทำ `/follow-gitignore` — `docs/.gitignore` ครอบคลุม `.vitepress/dist/`, `.vitepress/cache/`
4. ทำ `/follow-lang-typescript` — `docs/tsconfig.json` สำหรับ `.vitepress/` config
5. ติดตั้ง `bun add -d vitepress` (version ตาม `/follow-tool-vitepress` — stable 1.x, `next` สำหรับ preview)

### 4. Site Config

> Goal: `docs/.vitepress/config.ts` มี nav และ sidebar ครบตาม type

1. สร้าง `config.ts` ด้วย `defineConfig` — full structure จาก `references/vitepress-config.md`
2. nav จาก `templates/nav-config.md` ตาม type — map มาจาก `## Index Links` ใน `update-docs/references/<type>.md`
3. sidebar จาก `templates/sidebar-<type>.md` — map มาจาก `## Page Groups` ใน `update-docs/references/<type>.md`; หมวด `/development/` ใช้ `templates/sidebar-development.md` ร่วมกันทุก type
4. ถ้า monorepo → เพิ่ม `templates/sidebar-monorepo.md` + dropdown nav (`items`) สำหรับ workspace pages
5. ใช้ `collapsed: true` เมื่อหมวดมี >5 หน้า; ใช้ relative path เริ่มต้นด้วย `/`
6. ถ้า multi-language → `references/i18n.md`

### 5. Homepage

> Goal: `docs/index.md` เป็น VitePress landing page

1. ใช้ `templates/homepage.md` — `layout: home`, hero (name/tagline จาก `package.json`), features 3-6 รายการจริง, actions
2. TOC แบบ markdown (จาก `/update-docs`) ให้ย้ายไป `docs/references/` index หรือ `project/overview.md` ถ้า site ใช้ `layout: home` แทน

### 6. Optional Enhancements

> Goal: theme, plugins, และ deploy ตาม `/follow-tool-vitepress`

1. Theme: `.vitepress/theme/index.ts` extends DefaultTheme + `style.css` CSS variables — `subskills/config-theme/SKILL.md`
2. UnoCSS: `docs/uno.config.ts` + `UnoCSS()` plugin + `virtual:uno.css` — ตาม `/follow-tool-vitepress` Step 3
3. Shiki Twoslash (`@shikijs/vitepress-twoslash`) และ Group Icons (`vitepress-plugin-group-icons`) เมื่อต้องการ
4. Vue components สำหรับ interactive content (FeaturesTable, TestResults, ReleaseTimeline) — เฉพาะเมื่อ project ต้องการจริง ไม่ใช่ default
5. GitHub Actions deploy workflow ตาม `/follow-tool-vitepress` Step 8

### 7. Validate

> Goal: site build และลิงก์ไม่เสีย

1. ทำ `/run-docs` — `vitepress dev` เห็นหน้าแรก, `vitepress build` ผ่านไม่มี dead-links error
2. ตรวจทุก sidebar/nav link มีไฟล์ `.md` จริง
3. ทำ `/update-references` — internal links, README ลิงก์ไป docs site

## Rules

### 1. Composition Over Duplication

- เนื้อหา/frontmatter/real-data rules อยู่ใน `/update-docs` — ห้ามคัดลอกมา
- install/theme/plugin/deploy steps อยู่ใน `/follow-tool-vitepress` — ห้ามคัดลอกมา
- skill นี้เก็บเฉพาะ nav/sidebar/homepage/config templates และ orchestration order

### 2. Config Standards

- `config.ts` ใช้ `defineConfig` เสมอ, `search.provider: 'local'`, `cleanUrls: true`, `lastUpdated: true`
- nav กำหนดจาก `templates/nav-config.md` เท่านั้น ไม่ซ้ำกำหนดใน sidebar templates
- ดู official resources ใน `references/website.md`

### 3. Markdown First

- default ใช้ markdown ธรรมดาตาม `/update-docs` rules — Vue components เฉพาะเมื่อจำเป็น (interactive features)
- ใช้ `:::` containers ของ VitePress ได้เมื่อจำเป็น (site pages ไม่จำเป็นต้อง render บน GitHub)

### 4. No Workspace Duplicates

- monorepo มี `docs/` เดียวที่ root เป็น workspace — ห้ามสร้าง `docs/` ในแต่ละ workspace
- workspace pages อยู่ `docs/workspaces/<name>.md` และลิงก์ผ่าน dropdown nav

- ใช้ /check-content-outdate ถ้าจำเป็น
- ใช้ /check-correctness ถ้าจำเป็น

## Expected Outcome

- `docs/` ที่ root มี VitePress config, nav, sidebar ครบตาม type (+ Commands สำหรับ cli, Workspaces สำหรับ monorepo)
- เนื้อหาทุกหน้ามาจาก `/update-docs` — frontmatter ครบ, real data, ไม่มี placeholder
- `vitepress dev`/`build`/`preview` ทำงาน, `vitepress build` ไม่มี dead-links error
- README ลิงก์ไป docs site
