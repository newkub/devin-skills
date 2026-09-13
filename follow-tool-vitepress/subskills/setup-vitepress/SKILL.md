---
name: follow-tool-vitepress-setup-vitepress
description: ติดตั้ง VitePress, สร้าง docs structure และ `.vitepress/config.ts` พื้นฐาน
argument-hint: "[scope]"
related:
  - follow-gitignore
  - follow-lang-typescript
  - follow-tool-vite
  - run-docs
---

## Goal

ติดตั้ง VitePress และสร้าง docs site ให้ dev/build/preview ทำงาน — directory structure, `config.ts` พื้นฐาน, package scripts — first-time setup

## Scope

ใช้สำหรับ project ที่ยังไม่มี VitePress — init, `docs/` layout, nav/sidebar พื้นฐาน. Theme customization อยู่ใน `subskills/config-theme/SKILL.md`; migration อยู่ใน `subskills/migrate-from-docusaurus/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ตรวจ state ก่อน setup

1. ตรวจว่ามี `docs/` + `.vitepress/` หรือ `vitepress` dependency อยู่แล้ว — ถ้ามี → skip ไป verify
2. ระบุว่า single project หรือ monorepo — monorepo ให้ `docs/` เป็น workspace ของตัวเอง
3. ระบุ package manager จาก lockfile

### 2. Create Docs Structure

> Goal: สร้าง directory structure

1. สร้าง `docs/` ที่ root พร้อม `.vitepress/` config directory ภายใน
2. Monorepo: สร้าง `docs/package.json` (`vitepress` dependency + scripts `dev`/`build`/`preview`) และเพิ่ม `docs` ใน `workspaces` ของ root
3. Single project: ใส่ scripts ใน root `package.json` เป็น `dev:docs`/`build:docs`/`preview:docs`
4. ทำ `/follow-gitignore` — `docs/.gitignore` ครอบคลุม `node_modules/`, `.vitepress/dist/`, `.vitepress/cache/`
5. ทำ `/follow-lang-typescript` — `docs/tsconfig.json` สำหรับ type checking ของ `.vitepress/` (`noEmit: true`, `types: ["vitepress"]`)

### 3. Install And Config

> Goal: ติดตั้งและสร้าง config พื้นฐาน

1. ติดตั้ง `bun add -d vitepress` ใน docs workspace/root (version ดู parent skill หรือ official docs — stable 1.x, `next` สำหรับ preview)
2. สร้าง `.vitepress/config.ts` ด้วย `defineConfig` จาก `vitepress`: `title`, `description`, `lang`, `themeConfig.nav`, `themeConfig.sidebar`, `markdown.deadLinks: 'ignore'`
3. สร้าง `docs/index.md` ด้วย frontmatter `layout: home` + hero/features หรือ `layout: doc` ตามต้องการ

### 4. Verify

> Goal: ยืนยัน dev/build ทำงาน

1. รัน `vitepress dev` (ใน `docs/`) — เปิด localhost URL ต้องเห็นหน้าแรก
2. รัน `vitepress build` — output ใน `.vitepress/dist/` ไม่มี dead-links error ที่ไม่ตั้งใจ
3. ถ้า fail → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

### 1. Structure

- `.vitepress/config.ts` ใช้ `defineConfig` เสมอ — type safety
- monorepo: `docs/` เป็น workspace มี `package.json` ของตัวเอง
- nav/sidebar อยู่ใน `themeConfig`

### 2. Content

- frontmatter สำหรับ metadata; `layout: home` สำหรับ landing page
- `deadLinks: 'ignore'` ระหว่าง setup — เปลี่ยนเป็น strict เมื่อ content นิ่ง

### 3. Idempotent

- ถ้า `.vitepress/` มีอยู่แล้ว → verify เท่านั้น ห้าม init ซ้ำ

- ใช้ /follow-gitignore ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /run-docs ถ้าจำเป็น

## Expected Outcome

- `docs/` + `.vitepress/config.ts` ถูกสร้าง
- `vitepress dev`/`build`/`preview` ทำงาน
- Monorepo workspace setup ถูกต้อง (ถ้าใช้)
