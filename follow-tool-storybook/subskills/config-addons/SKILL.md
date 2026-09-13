---
name: follow-tool-storybook-config-addons
description: ตั้งค่า `.storybook/main.ts` addons — essentials, docs, a11y, vitest
argument-hint: "[scope]"
related:
  - follow-tool-vitest
  - follow-tool-playwright
  - run-test
---

## Goal

ตั้งค่า Storybook addons ใน `.storybook/main.ts` — docs, a11y, vitest integration และ addons อื่นตามต้องการ — โดย merge กับ config เดิม

## Scope

ใช้เมื่อต้องเพิ่ม/แก้ addons หรือ main.ts config — init/framework setup อยู่ใน `subskills/setup-storybook/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: อ่าน config เดิมก่อนแก้

1. อ่าน `.storybook/main.ts` — `framework`, `stories`, `addons` ปัจจุบัน
2. ตรวจ Storybook version — **สำคัญ**: ใน v10+ controls/actions/interactions/viewport/backgrounds เป็น core features (ไม่ต้องติดตั้ง `@storybook/addon-essentials`/`addon-interactions`); versions ก่อนหน้าต้องพึ่ง essentials — ตรวจ version ใน `package.json` ก่อนเสมอ
3. ตรวจ addons ที่ติดตั้งอยู่แล้วใน devDependencies

### 2. Configure Addons

> Goal: register addons ที่ต้องการใน `addons` array

1. `@storybook/addon-docs` — auto-docs จาก stories
2. `@storybook/addon-a11y` — accessibility testing panel
3. `@storybook/addon-vitest` — component/interaction testing ผ่าน Vitest (ต้องมี vitest setup — ทำ `/follow-tool-vitest` ก่อน)
4. addons อื่น (theming, design tools, i18n) — ติดตั้ง package ก่อนแล้วเพิ่มชื่อใน `addons` array; ดู official docs สำหรับชื่อ addon ที่ไม่แน่ใจ
5. addons ที่มี options ใช้ object form `{ name: "...", options: {...} }`

### 3. Adjust main.ts Options

> Goal: ตั้งค่า options รองรับ addons

1. `staticDirs` — static assets ที่ addons/stories ใช้
2. `docs`/`features` flags ตาม version (ดู official docs)
3. `framework` options (builder config) ถ้าต้องปรับ
4. `.storybook/preview.ts` — global parameters ที่ addons อ่าน (เช่น a11y config, docs settings)

### 4. Verify

> Goal: ตรวจ addons load ถูกต้อง

1. รัน dev server — เปิด UI ตรวจว่า addon panels แสดง (Docs tab, Accessibility tab, ฯลฯ)
2. รัน `bunx storybook build` — build ผ่านไม่มี addon errors
3. ถ้า addon fail → ตรวจ version compatibility กับ Storybook version แล้วแก้ (max 3 รอบ)

## Rules

### 1. Version Awareness

- ตรวจ Storybook version ก่อนเสมอ — v10 ย้ายหลาย addons เข้า core; อย่าติดตั้ง addon ที่กลายเป็น core แล้ว
- addon versions ต้อง compatible กับ Storybook major version

### 2. Config Discipline

- merge กับ `addons` array เดิม — ห้าม overwrite
- ทุก addon ใน `addons` ต้องติดตั้งใน devDependencies

### 3. Testing

- `@storybook/addon-vitest` ต้องการ vitest environment — setup ก่อน register
- รัน `storybook test`/`test-storybook` ใน CI ถ้าใช้ testing addons

- ใช้ /follow-tool-vitest ถ้าจำเป็น
- ใช้ /run-test-visual ถ้าจำเป็น

## Expected Outcome

- Addons ที่ต้องการ register และทำงานใน dev server
- `storybook build` ผ่านพร้อม addons ใหม่
- Docs/a11y/testing panels ใช้งานได้
