---
name: follow-lib-zaidan-ui-setup-theme
description: Setup Zaidan UI theme — registry config, Tailwind v4 variables, dark mode
argument-hint: "[scope]"
related:
  - follow-lib-zaidan-ui
  - follow-lib-shadcn-solid
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

Setup theme ของ Zaidan UI — `components.json` registry config, Tailwind CSS v4 variables และ dark mode บน SolidJS

## Scope

ใช้เมื่อต้อง setup theme ครั้งแรกของ Zaidan UI project — ครอบคลุม `components.json`, `registries` config, `globals.css` theme variables และ dark mode ด้วย `data-kb-theme`

## Execute

### 1. Prerequisite

> Goal: project setup Zaidan registry แล้ว

1. ทำ `/follow-lib-zaidan-ui` step 1-2 ก่อน — ต้องมี Tailwind CSS v4 และ `components.json`
2. ตรวจ `components.json`: `style: "kobalte"`, `rsc: false`, `registries` ชี้ `@zaidan` → `https://zaidan.carere.dev/r/{style}/{name}.json`
3. ตรวจ path alias `@/` ใน `tsconfig.json` และ Vite config ตรงกับ `aliases`
4. ถ้ายังไม่มี `components.json` → รัน `bunx shadcn@latest init` ก่อน

### 2. Configure globals.css Theme Variables

> Goal: กำหนด theme variables ใน `src/styles/globals.css`

1. เปิด `globals.css` ตาม `tailwind.css` path ใน `components.json`
2. กำหนด CSS variables ชุดมาตรฐานใน `:root` — `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius` (ดูชุดเต็มใน official docs ที่ `https://zaidan.carere.dev/docs`)
3. map variables เข้า Tailwind v4 `@theme` block หรือตาม format ที่ Zaidan components ใช้ — ดู official docs
4. ใส่ dark variables ใน `[data-kb-theme="dark"]` หรือ `.dark` block — ครบชุดเดียวกันกับ `:root`

### 3. Setup cn Helper

> Goal: ยืนยัน `cn` helper พร้อมใช้

1. ตรวจ `src/lib/utils.ts` มี `cn` ที่ merge `clsx` + `tailwind-merge`
2. import components ด้วย `@/components/ui/*` alias ตาม `components.json`

### 4. Configure Dark Mode

> Goal: ตั้งค่า dark mode toggle

1. ใช้ `data-kb-theme` attribute บน `<html>` (Kobalte convention) หรือ scheme ที่ project กำหนด
2. เพิ่ม toggle ที่ set/remove attribute และ persist ด้วย `localStorage`

### 5. Verify

> Goal: smoke test theme และ components

1. รัน `/run-dev` — add component (`bunx shadcn@latest add @zaidan/button`) แล้วทดสอบ
2. toggle dark mode — colors ต้องเปลี่ยนตาม variables
3. รัน build — ไม่มี error จาก missing variables/aliases/registry
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ `bunx shadcn@latest` CLI ไม่ใช่ `shadcn-solid`
- ใช้ CSS variables เสมอ — ห้าม hard-code colors ใน components
- `:root` และ dark block ต้องมี tokens ครบชุดเดียวกัน
- `style: "kobalte"` และ `rsc: false` ต้องถูกต้องใน `components.json`
- ใช้ `/follow-lib-zaidan-ui` สำหรับ full reference

## Expected Outcome

- `components.json` registry และ `globals.css` variables ตั้งค่าครบ
- Zaidan components render ด้วย theme colors ถูกต้องทั้ง light/dark
- `cn` helper และ path aliases ทำงาน
- Build ผ่านโดยไม่มี error
