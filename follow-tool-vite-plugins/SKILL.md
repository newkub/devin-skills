---
name: follow-tool-vite-plugins
description: เลือกและตั้งค่า Vite plugins — unified (unplugin ecosystem) และ frontend-lib catalog
argument-hint: "[plugin-or-topic | unified | frontend-lib]"
related:
  - follow-tool-vite
  - follow-create-plugins
  - follow-create-vite-plugin
  - scan-codebase
  - search-github-star
  - search-raindrop
  - report
---

## Goal

เลือก Vite plugin ที่เหมาะกับงานและตั้งค่าใน `vite.config.ts` — catalog ครอบคลุม unplugin ecosystem (`unified`) และ framework/frontend plugins (`frontend-lib`)

## Scope

- เลือก/setup plugin สำหรับ Vite project — plugin catalog อยู่ใน `workflows/`
- สร้าง plugin ใหม่ → `/follow-create-plugins` หรือ `/follow-create-vite-plugin`
- Vite core config (resolve/build/server) → `/follow-tool-vite`
- Catalog sources: `search-raindrop` bookmarks + `search-github-star` (vite-plugin by stars) + awesome-vite

## Execute

### 1. Identify Need

> Goal: รู้ว่าต้องการ plugin แบบไหน

1. อ่าน `vite.config.ts` + `package.json` — ดู plugins ที่มีอยู่แล้ว (ห้ามซ้ำ)
2. ระบุหมวด: framework adapter, auto-import, assets, PWA, DX tooling, platform (electron/extension/meta-framework)

### 2. Pick From Catalog

> Goal: เลือก plugin ที่ maintained และตรงงาน

| Topic | Workflow |
|-------|----------|
| Universal plugins — ทำงานข้าม bundler (`unplugin-*` ecosystem) | `workflows/unified/SKILL.md` |
| Framework/frontend plugins — react, vue, svelte, css, assets, routing | `workflows/frontend-lib/SKILL.md` |

- ไม่มีใน catalog → ทำ `/search-github-star` หรือ `/search-raindrop` หา plugin ที่ maintained (stars, last publish ≥7 วัน)

### 3. Install And Wire

> Goal: plugin ทำงานใน config

1. `bun add -D <plugin>` — pin version เผยแพร่ ≥7 วัน
2. เพิ่มใน `plugins: [...]` ของ `vite.config.ts` ตาม official docs — ใช้ option defaults ก่อนเสมอ
3. Vite 8 (Rolldown) — เช็ค plugin รองรับ rolldown; ถ้า plugin ผูก Rollup/Rollup hooks ให้เช็ค compat layer
4. Type augmentation (เช่น auto-import `.d.ts`) → รัน dev 1 ครั้งเพื่อ generate

### 4. Verify And Report

> Goal: plugin ทำงานจริง ไม่ทำ build พัง

1. รัน `bunx vite` dev server — ดู no errors + plugin output ทำงาน
2. `bunx vite build` — production build ผ่าน
3. ทำ `/report` table: `Plugin`, `Purpose`, `Version`, `Status`

## Rules

- Official/framework plugin ก่อนเสมอ (`@vitejs/plugin-*`) — community plugin เมื่อ official ไม่มี
- เช็ค maintenance — last publish ≥7 วัน, stars, open issues; plugin ที่ตายแล้ว (เช่น windicss → unocss) ห้ามใช้
- Plugin order สำคัญ — auto-import/plugin ที่ transform code มาก่อน framework plugin ตาม docs
- ห้ามใส่ plugin 2 ตัวทำงานซ้ำกัน (เช่น `vite-plugin-svgr` + `unplugin-icons` สำหรับ svg)

- ใช้ `/follow-tool-vite` สำหรับ config หลัก
- ใช้ `/search-github-star`, `/search-raindrop` หา plugin ที่ไม่มีใน catalog
- ใช้ `/follow-create-plugins` ถ้าต้องเขียน plugin เอง

- ดู best-practices/ สำหรับ recommended patterns และ pitfalls

## Expected Outcome

- Plugin ที่เลือกถูกติดตั้งและทำงานใน dev + build
- ไม่มี plugin ซ้ำซ้อนหรือ unmaintained
- Report ครบพร้อม versions
