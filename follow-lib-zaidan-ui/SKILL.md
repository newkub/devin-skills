---
name: follow-lib-zaidan-ui
description: ใช้ Zaidan UI สำหรับ SolidJS components ด้วย Kobalte, Corvu และ Tailwind CSS
argument-hint: "[scope]"
related:
  - follow-lib-animejs
  - follow-lib-arktype
  - follow-lib-better-auth
  - follow-lib-shadcn-solid
  - follow-lib-unocss
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ Zaidan UI สำหรับ UI components บน SolidJS ด้วย accessible, customizable components ที่ built with Kobalte, Corvu และ Tailwind CSS

## Scope

ใช้สำหรับสร้าง UI components ด้วย Zaidan registry บน SolidJS สำหรับ Vite, SolidStart, TanStack Start, Astro

- ใช้เมื่อ project ต้องการ components จาก Zaidan registry (`@zaidan/*`) ผ่าน `shadcn` CLI + Tailwind CSS v4
- ถ้า project ใช้ `shadcn-solid` CLI หรือต้องการ UnoCSS styling ให้ใช้ `/follow-lib-shadcn-solid` แทน

- Latest: `shadcn@4.21.0` / `@kobalte/core@0.13.14` / `corvu@0.7.2` / `solid-js@1.9.15` / `tailwindcss@4.3.3` (verified 2026-09-16)

## Execute

### 1. Install And Setup

> Goal: ติดตั้ง Zaidan UI สำหรับ SolidJS

1. เลือก framework และสร้าง project:
   - Vite: `pnpm create vite@latest --template solid-ts`
   - SolidStart: `pnpm create solid@latest --solidstart --ts --template with-tailwindcss`
   - TanStack Start: `pnpm dlx shadcn@latest init -t start`
   - Astro: `bun create astro@latest --template with-tailwind --add solid --git`
2. ติดตั้ง Tailwind CSS v4 (`tailwindcss` และ `@tailwindcss/vite`) ตาม framework
3. ตั้งค่า path alias `@/` ใน `tsconfig.json` และ Vite config
4. รัน `bunx shadcn@latest init` เพื่อสร้าง `components.json`
5. อ่านคำแนะนำเพิ่มเติมที่ [references/zaidan-ui-resources.md](references/zaidan-ui-resources.md)

### 2. Configure Registry

> Goal: ตั้งค่า Zaidan registry ใน components.json

1. ตั้งค่า `style` เป็น `kobalte` และ `rsc` เป็น `false`
2. เพิ่ม `registries` ใน `components.json`:
   ```json
   "registries": {
     "@zaidan": "https://zaidan.carere.dev/r/{style}/{name}.json"
   }
   ```
3. ตั้งค่า `tailwind.css` เป็น `src/styles/globals.css` (หรือ path ที่ project ใช้)
4. ตั้งค่า `aliases` ให้ตรงกับ project (`@/components`, `@/lib/utils`, `@/lib`, `@/hooks`)
5. ดูตัวอย่างเต็มใน [references/zaidan-ui-config.md](references/zaidan-ui-config.md)

### 3. Add Components

> Goal: เพิ่ม Zaidan components ด้วย shadcn CLI

1. ใช้ `bunx shadcn@latest add @zaidan/button` เพื่อเพิ่ม component เดี่ยว
2. ใช้ `bunx shadcn@latest add @zaidan/card @zaidan/dialog` เพื่อเพิ่มหลาย components
3. components จะถูก copy ไปยัง `src/components/ui/`
4. import ด้วย `import { Button } from "@/components/ui/button"`
5. สำหรับ Better Auth UI ใช้ `bunx shadcn@latest add https://better-auth-ui.com/r/solid/auth.json`

### 4. Learn Key Concepts

> Goal: เข้าใจแนวคิดหลักของ Zaidan

1. Zaidan เป็น shadcn registry สำหรับ SolidJS ไม่ใช่ npm package
2. Components built on Kobalte และ Corvu primitives
3. Styled ด้วย Tailwind CSS v4
4. รองรับ copy-paste หรือ pull ผ่าน shadcn CLI
5. มี components, blocks, charts, และ typeset
6. ดูรายละเอียดใน [references/zaidan-ui-resources.md](references/zaidan-ui-resources.md)

### 5. Customize And Apply Best Practices

> Goal: customize components ตาม best practices

1. Customize components ที่ copy มาใน `src/components/ui/`
2. ปรับ CSS variables ใน `src/styles/globals.css`
3. ใช้ `cn` helper สำหรับ merge Tailwind classes
4. ใช้ accessible components เสมอ
5. ใช้ dark mode ด้วย `data-kb-theme` หรือ scheme ที่ project กำหนด

### 6. Integrate With SolidJS

> Goal: integrate กับ SolidJS

1. ใช้ components กับ Vite, SolidStart, TanStack Start หรือ Astro
2. ตั้งค่า Tailwind CSS v4 plugin ใน Vite config
3. ใช้ `@/components/ui/*` import alias ตาม `components.json`
4. อ่าน official docs ที่ https://zaidan.carere.dev/docs

### 7. Troubleshoot

> Goal: แก้ปัญหาทั่วไป

1. ตรวจสอบ `components.json` ว่า `registries` ชี้ไปยัง Zaidan registry ถูกต้อง
2. ตรวจสอบ `style` เป็น `kobalte` และ `rsc` เป็น `false`
3. ตรวจสอบ path alias `@/` ใน `tsconfig.json` และ Vite/SolidStart config
4. อ่าน FAQ ที่ https://zaidan.carere.dev/docs/faq

### Subskills

- Setup theme — registry config, Tailwind v4 variables, dark mode → `subskills/setup-theme/SKILL.md`
- ปรับ theme tokens — colors, radius, Tailwind v4 mapping → `subskills/config-tokens/SKILL.md`

## Rules

- ใช้ `bunx shadcn@latest` CLI ไม่ใช่ `shadcn-solid`
- ใช้ `@zaidan/<component>` registry สำหรับ add components
- ใช้ copy-to-own pattern เสมอ
- ใช้ Kobalte และ Corvu สำหรับ accessible primitives
- ใช้ Tailwind CSS v4 สำหรับ styling
- ใช้ backticks สำหรับ commands, components
- ใช้ code blocks สำหรับ component examples
- ใช้ accessible components เสมอ
- Customize components ตามความต้องการ
- หลีกเลี่ยง modifying core Kobalte/Corvu primitives

- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-arktype` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น
- ใช้ `/follow-lib-shadcn-solid` ถ้าจำเป็น
- ใช้ `/follow-lib-unocss` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- UI components ที่ accessible และ customizable
- Code ที่ copy-to-own และ maintainable
- Integration ที่ smooth กับ SolidJS
- Components ที่ follow accessibility best practices
