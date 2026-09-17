---
name: follow-create-web-docs
description: สร้างเว็บ single-page แสดง README + docs ด้วย Comark Vue deploy Cloudflare Workers ผ่าน GitHub CI
argument-hint: "[repo-path]"
related:
  - follow-create-web
  - follow-create-web-nuxt
  - follow-service-cloudflare
  - follow-lib-vue
  - run-docs
  - update-docs
  - gen-openapi
  - follow-tool-github-actions
  - ship
  - report
---

## Goal

สร้างเว็บไซต์ single-page ที่ render `README.md` (และ `docs/` ถ้ามี) ของ repo ด้วย Comark Vue — nav แสดง repo name, GitHub link, registry badges, theme toggle — deploy ไป Cloudflare Workers ผ่าน GitHub Actions

## Scope

ใช้เมื่อต้องการ docs site ขนาดเล็กสำหรับ repo — ไม่ใช่ docs framework ใหญ่ (ใช้ `/run-docs` สำหรับ VitePress)

- Output: Vue + Vite app (single page), Comark render markdown, deploy ด้วย `wrangler` + `cloudflare/wrangler-action`
- Source of truth คือไฟล์ใน repo — `README.md` บังคับ, `docs/` optional (glob `docs/**/*.md`)
- ไม่มี router — docs ทุกไฟล์ render ใน scroll เดียว หรือ sidebar switch ใน page เดียว

## Execute

### 1. Detect Metadata

> Goal: รู้ว่า nav/docs ต้องแสดงอะไร

1. repo name: จาก git remote (`git remote get-url origin`) หรือ `package.json` name
2. registries: `package.json` publishable → npm badge/link; `Cargo.toml` → crates.io; `pyproject.toml` → PyPI
3. docs: ถ้ามี `docs/**/*.md` → enable docs pane + sidebar TOC; ถ้าไม่มี → single README pane เท่านั้น
4. ทำตาม [references/detect-meta.md](references/detect-meta.md)

### 2. Scaffold App

> Goal: Vue + Vite app พร้อม Comark

1. **ใช้ `create-docs` (canonical generator) ก่อนเสมอ** — `bunx create-docs` (หรือ `npx create-docs`, repo: `wrikka/create-docs`) scaffold site ตาม spec นี้ทั้งหมด; ถ้า generator ใช้ไม่ได้ (ยังไม่ publish/network) → fallback เป็น manual steps ข้างล่าง
2. Manual fallback: `bun create vite <name> --template vue-ts` (หรือ add เข้า repo เดิมที่ `site/` หรือ `docs-site/`)
3. `bun add @comark/vue` และ plugins ตามต้องการ (shiki สำหรับ code highlight)
4. ตาม [references/comark-vue.md](references/comark-vue.md) — `<Markdown>` ต้องอยู่ใน `<Suspense>`, ใช้ `:value` หรือ slot
5. bundle markdown เป็น string ผ่าน `import readme from '../README.md?raw'` (Vite raw imports) — ไม่ต้อง fetch ตอน runtime

### 3. Build Layout

> Goal: layout ตรง spec — simple clean

1. Nav: repo name ซ้าย, ขวา = registry badges (npm/crates ถ้ามี) + GitHub icon link + theme toggle icon (sun/moon)
2. Desktop (≥1024px): 2 columns — ซ้าย README render `position: sticky`, ขวา docs พร้อม sidebar TOC (ถ้ามี docs)
3. Mobile: README scroll ปกติก่อน — เมื่อเลื่อนสุดแล้ว docs pane เป็น `h-screen` scroll แยก
4. ตาม [references/layout.md](references/layout.md) — CSS ให้น้อย, system font, max-width readable

### 4. Deploy To Cloudflare Workers

> Goal: CI deploy ทุก push บน main

1. `bun add -D wrangler` + `wrangler.toml` (assets ชี้ `dist/`, SPA fallback)
2. GitHub Actions workflow ตาม [references/deploy-cloudflare.md](references/deploy-cloudflare.md) — `cloudflare/wrangler-action@v3` + secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
3. ทำ `/run-docs` หรือ `bun run build` + `wrangler deploy --dry-run` verify ก่อน push

## Rules

### 1. Simplicity

- single page เท่านั้น — ไม่เพิ่ม router, ไม่เพิ่ม state management
- สไตล์ minimal: system font stack, spacing เดียว, theme แค่ light/dark
- ห้าม hard-code repo name/registry — detect จาก repo จริง

### 2. Content Integrity

- render README/docs ตรงๆ — ไม่ rewrite เนื้อหา
- internal links ใน docs ให้ทำงานใน sidebar TOC ได้

### 3. Safety

- ไม่ deploy จริงโดยไม่ได้รับอนุญาต — build + dry-run เท่านั้นจนกว่า user confirm
- secrets ใช้ GitHub secrets เท่านั้น ห้าม commit

- ใช้ /follow-lib-vue ถ้าจำเป็น
- ใช้ /follow-service-cloudflare ถ้าจำเป็น
- ใช้ /follow-tool-github-actions ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-create-web-nuxt ถ้าจำเป็น
- ใช้ /update-docs ถ้าจำเป็น
- ใช้ /gen-openapi ถ้าจำเป็น
- ใช้ /ship ถ้าจำเป็น
- ใช้ /report ถ้าจำเป็น


## Expected Outcome

- single-page site render README (+docs) ด้วย Comark Vue ถูก layout spec
- nav มี repo name, GitHub link, registry badges, theme toggle
- GitHub Actions deploy ไป Cloudflare Workers พร้อมใช้งาน
- ผ่าน local build และ `wrangler deploy --dry-run`
