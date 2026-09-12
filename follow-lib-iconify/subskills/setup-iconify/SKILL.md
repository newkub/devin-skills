---
name: follow-lib-iconify-setup-iconify
description: ติดตั้ง Iconify — @iconify-json/* sets, framework components, usage patterns
argument-hint: "[framework]"
related:
  - follow-lib-iconify
  - run-install
  - run-verify
  - run-test
  - resolve-errors
---

## Goal

ติดตั้งและใช้งาน Iconify — `@iconify-json/*` icon sets, framework components และ usage patterns พื้นฐาน

## Scope

ใช้เมื่อต้อง setup icons ด้วย Iconify ใน project — ครอบคลุม install, เลือก icon set, usage ตาม framework (React, Vue, Svelte, web component) และ integration กับ UnoCSS/Tailwind

## Execute

### 1. Check Current State

> Goal: ตรวจสอบ framework และ icons ที่มีอยู่ก่อนติดตั้ง

1. ตรวจ `package.json` ว่ามี `@iconify/*`, `iconify-icon` หรือ `@iconify-json/*` อยู่แล้วหรือไม่ — ถ้ามี → verify version เท่านั้น
2. ตรวจว่า project ใช้ UnoCSS (`uno.config.ts`) หรือ Tailwind — เลือก integration path ที่ตรง
3. เลือก icon set ตาม design: `mdi` (material), `lucide` (minimal), `tabler`, `carbon` — ค้นหา sets ได้ที่ `https://icon-sets.iconify.design`

### 2. Install Packages

> Goal: ติดตั้ง iconify packages ตาม usage pattern

1. Framework component: `bun add @iconify/react` / `@iconify/vue` / `@iconify/svelte` หรือ `iconify-icon` (web component, framework-agnostic)
2. Offline icon data: `bun add -D @iconify-json/<set>` เช่น `@iconify-json/mdi`
3. UnoCSS: ใช้ `presetIcons` กับ `@iconify-json/*` ตาม `/follow-lib-unocss`
4. Tailwind: `bun add -D @iconify/tailwind` แล้วเพิ่ม plugin ใน config

### 3. Use Icons

> Goal: ใช้ icons ตาม pattern ของ integration ที่เลือก

1. Component: `<Icon icon="mdi:home" />` (React), `<Icon icon="mdi:home" />` จาก `@iconify/vue` (Vue), `<iconify-icon icon="mdi:home"></iconify-icon>` (web component)
2. UnoCSS: class `i-mdi-home` หรือ `i-mdi:home`
3. Tailwind plugin: class `icon-[mdi--home]`
4. ตั้ง `width`/`height`/`color` ผ่าน props หรือ class — ไม่ hardcode ใน SVG

### 4. Verify

> Goal: ตรวจสอบ icons render ถูกต้อง

1. รัน dev server — icon ต้องแสดงผลโดยไม่มี network request ถ้าใช้ `@iconify-json/*` offline data
2. ทำ `/run-verify` และ `/run-test`
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- อย่า import ทั้ง icon set — ใช้ per-icon หรือ `@iconify-json/<set>` เฉพาะที่ใช้
- ตั้ง `size`/`color` ผ่าน props/class — ไม่ hardcode ใน SVG
- ใช้ `@iconify-json/*` (offline data) เป็น default — ใช้ Iconify API runtime เฉพาะ dynamic icons
- ใช้ `/follow-lib-iconify` สำหรับ overview และ best practices

## Expected Outcome

- Iconify ติดตั้งตาม framework และ integration ที่เหมาะสม
- Icons render ถูกต้องแบบ offline (ไม่พึ่ง API runtime สำหรับ static icons)
- Lint, typecheck, tests ผ่าน
