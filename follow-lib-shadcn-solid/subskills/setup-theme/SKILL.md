---
name: follow-lib-shadcn-solid-setup-theme
description: Setup shadcn-solid theme — init components, CSS variables, dark mode
argument-hint: "[scope]"
related:
  - follow-lib-shadcn-solid
  - follow-lib-unocss
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

Setup theme ของ shadcn-solid — `components.json`, global CSS variables และ dark mode หลัง init components

## Scope

ใช้เมื่อต้อง setup theme ครั้งแรกหลัง `shadcn-solid init` — ครอบคลุม `components.json` config, CSS variables ใน global CSS, `cn` helper และ dark mode ด้วย `data-kb-theme`

## Execute

### 1. Prerequisite

> Goal: project init shadcn-solid แล้ว

1. รัน `bunx shadcn-solid@latest init` ถ้ายังไม่มี `components.json` — ทำ `/follow-lib-shadcn-solid` step 1
2. ตรวจ `components.json`: base color, global CSS file path, aliases (`@/components`, `@/lib/utils`)
3. ตรวจว่าเลือก TailwindCSS หรือ UnoCSS — theme setup ต่างกันเล็กน้อย

### 2. Configure Global CSS Variables

> Goal: กำหนด theme CSS variables ใน global CSS file

1. เปิด global CSS file ตาม `components.json` (เช่น `src/app.css` หรือ `src/styles/globals.css`)
2. กำหนด CSS variables ชุดมาตรฐานใน `:root` — `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius` (ดูชุดเต็มใน official docs ที่ `https://shadcn-solid.com/docs`)
3. ใส่ dark theme variables ใน `.dark` หรือ `[data-kb-theme="dark"]` block — ครบชุดเดียวกันกับ `:root`
4. ใช้ format ตาม CSS framework ที่ project ใช้ (Tailwind `hsl(var(--x))` pattern หรือ UnoCSS `hsl(var(--color-x))` — ดู official docs)

### 3. Setup cn Helper And Utils

> Goal: ยืนยัน `cn` helper และ utils พร้อมใช้

1. ตรวจ `src/lib/utils.ts` มี `cn` ที่ merge `clsx` + `tailwind-merge` (หรือ equivalent)
2. ตั้งค่า path alias `@/` ใน `tsconfig.json` และ Vite config ให้ตรง `components.json` aliases

### 4. Configure Dark Mode

> Goal: ตั้งค่า dark mode ด้วย Kobalte theme attribute

1. ใช้ `data-kb-theme="dark"` attribute บน `<html>` สำหรับ Kobalte dark mode
2. เพิ่ม toggle ที่ set/remove attribute และ persist ด้วย `localStorage`
3. ถ้าใช้ class-based dark mode ของ CSS framework คู่กัน — sync ทั้งสองใน toggle เดียว

### 5. Verify

> Goal: smoke test theme และ components

1. รัน `/run-dev` — add `button` component (`bunx shadcn-solid@latest add button`) แล้วทดสอบ variants
2. toggle dark mode — colors ต้องเปลี่ยนตาม variables
3. รัน build — ไม่มี error จาก missing variables/aliases
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ใช้ CSS variables เสมอ — ห้าม hard-code colors ใน components
- ชื่อ variables ต้องตรงกับที่ components ใน `src/components/ui/` อ้างถึง
- `:root` และ dark block ต้องมี tokens ครบชุดเดียวกัน
- `components.json` aliases ต้องตรงกับ `tsconfig.json` paths
- ใช้ `/follow-lib-shadcn-solid` สำหรับ full reference

## Expected Outcome

- `components.json` และ global CSS variables ตั้งค่าครบ
- Components render ด้วย theme colors ถูกต้องทั้ง light/dark
- `cn` helper และ path aliases ทำงาน
- Build ผ่านโดยไม่มี error
