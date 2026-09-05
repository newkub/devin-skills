---
name: follow-lib-shadcn-solid
description: shadcn/ui port สำหรับ SolidJS - accessible, customizable copy-paste components
argument-hint: "[scope]"
related:
  - follow-solid-tanstack
  - follow-solid-tanstack-architecture
  - follow-lib-animejs
  - follow-lib-unocss
  - follow-best-practice
  - use-my-packages-on-registry
  - setup-cicd
---

## Goal

ใช้ shadcn/ui สำหรับ SolidJS component library ด้วย copy-to-own pattern และ accessible components

## Scope

ใช้สำหรับสร้าง UI components ด้วย shadcn-solid บน SolidJS สำหรับ SolidStart, Astro, Vite

## Execute

### 1. Install And Setup

> Goal: ติดตั้ง shadcn/ui สำหรับ SolidJS

1. สร้าง SolidJS project ด้วย `pnpm create solid@latest` และเลือก tailwind หรือ uno template
2. ติดตั้ง shadcn-solid CLI ผ่าน `npx shadcn-solid@latest init` (หรือ `bunx shadcn-solid@latest init`)
3. เลือก CSS framework `TailwindCSS` หรือ `UnoCSS` ตามคำถามของ CLI
4. ตั้งค่า `components.json` ด้วย base color, global CSS file, import alias (`@/components`), utils alias (`@/lib/utils`)
5. อ่านคำแนะนำเพิ่มเติมที่ [references/shadcn-solid.md](references/shadcn-solid.md)

### 2. Add Components

> Goal: เพิ่ม components ด้วย CLI

1. ใช้ `npx shadcn-solid@latest add [component]` เพื่อเพิ่ม component เดี่ยว
2. ใช้ `npx shadcn-solid@latest add button card dialog` สำหรับหลาย components
3. ใช้ `npx shadcn-solid@latest add --all` สำหรับติดตั้งทั้งหมด
4. ใช้ `npx shadcn-solid@latest add [component] --overwrite` สำหรับ overwrite ไฟล์เดิม
5. ใช้ `npx shadcn-solid@latest diff` เพื่อตรวจสอบ upstream updates

### 3. Learn Key Concepts

> Goal: เข้าใจแนวคิดหลักของ shadcn-solid

1. shadcn-solid เป็น unofficial community-led port ของ shadcn/ui สำหรับ SolidJS
2. Components เป็น copy-to-own source code ใน `src/components/ui/`
3. สร้างบน Kobalte UI primitives สำหรับ accessibility
4. รองรับ Tailwind CSS และ UnoCSS
5. ไม่ต้องติดตั้ง component library เป็น dependency
6. ดูรายละเอียดเพิ่มเติมใน [references/shadcn-solid.md](references/shadcn-solid.md)

### 4. Configure Styles

> Goal: ตั้งค่า styles และ theme

1. ตั้งค่า Tailwind CSS หรือ UnoCSS ตาม template ที่เลือก
2. ใช้ CSS variables สำหรับ colors, radius, และ theme tokens
3. ใช้ `cn` helper ที่สร้างจาก `clsx` และ `tailwind-merge`
4. ตั้งค่า dark mode ด้วย `data-kb-theme="dark"` attribute
5. ใช้ utility classes จาก design system ไม่ hard-code colors

### 5. Customize Components

> Goal: customize components ตามความต้องการ

1. Customize components ที่ copy มาใน `src/components/ui/` ได้โดยตรง
2. ใช้ `cva` (class-variance-authority) สำหรับ type-safe variants
3. ปรับ CSS variables ใน global CSS file
4. ใช้ UnoCSS theme ตาม `/follow-lib-unocss` ถ้าเลือก UnoCSS
5. หลีกเลี่ยงการแก้ไข source ของ shadcn-solid CLI หรือ Kobalte primitives โดยตรง

### 6. Integrate With SolidJS

> Goal: integrate กับ SolidJS ecosystem

1. ตั้งค่า path alias `@/` ใน `tsconfig.json` และ Vite config
2. ใช้ components ใน SolidStart, Astro, หรือ Vite project
3. ใช้ `@solidjs/meta` และ `@solidjs/router` สำหรับ meta และ routing ถ้าจำเป็น
4. อ่าน official docs ที่ https://shadcn-solid.com/docs

### 7. Troubleshoot

> Goal: แก้ปัญหาทั่วไป

1. ตรวจสอบ `components.json` และ path alias ถ้า import ผิด
2. ใช้ `npx shadcn-solid@latest diff <component>` เพื่อดู upstream changes
3. อ่าน troubleshooting ที่ https://shadcn-solid.com/docs

## Rules

- ใช้ CLI `npx shadcn-solid@latest init` สำหรับ initial setup
- ใช้ copy-to-own pattern เสมอ
- ใช้ Kobalte UI primitives
- ใช้ Tailwind CSS หรือ UnoCSS สำหรับ styling
- ใช้ backticks สำหรับ commands, components
- ใช้ code blocks สำหรับ component examples
- ใช้ accessible components เสมอ
- Customize components ใน project ของตัวเอง
- หลีกเลี่ยงการแก้ไข core Kobalte primitives โดยตรง
- ใช้ `diff` ตรวจสอบ upstream updates

- ใช้ `/follow-solid-tanstack` ถ้าจำเป็น
- ใช้ `/follow-solid-tanstack-architecture` ถ้าจำเป็น
- ใช้ `/follow-lib-animejs` ถ้าจำเป็น
- ใช้ `/follow-lib-unocss` ถ้าจำเป็น
- ใช้ `/follow-best-practice` ถ้าจำเป็น
- ใช้ `/use-my-packages-on-registry` ถ้าจำเป็น
- ใช้ `/setup-cicd` ถ้าจำเป็น

## Expected Outcome

- UI components ที่ accessible และ customizable
- Code ที่ copy-to-own และ maintainable
- Integration ที่ smooth กับ SolidJS
- Components ที่ follow accessibility best practices
