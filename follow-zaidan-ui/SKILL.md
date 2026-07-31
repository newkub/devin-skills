---
name: follow-zaidan-ui
description: ShadCN UI registry สำหรับ SolidJS บน Kobalte และ Corvu
---

## Goal

ใช้ Zaidan UI registry สำหรับ SolidJS เพื่อสร้าง accessible และ customizable components อย่างรวดเร็ว

## Scope

ครอบคลุมการติดตั้ง, การใช้งาน components, การ custom themes, และการ integrate กับ SolidJS projects

## Execute

### 1. ติดตั้ง Zaidan UI

ติดตั้ง dependencies ที่จำเป็น

1. ติดตั้ง `@kobalte/core` และ `@corvu/ui` ด้วย `bun add`
2. ติดตั้ง `shadcn-solid` CLI ด้วย `bun add -D`
3. รัน `npx shadcn-solid@latest init` เพื่อ setup project
4. ตั้งค่า `components.json` ตาม preferences

### 2. เพิ่ม Components

เพิ่ม components จาก registry

1. ใช้ `npx shadcn-solid@latest add [component]` เพื่อเพิ่ม component
2. เลือก components ที่ต้องการจาก registry
3. Components จะถูก copy ไปยัง `src/components/ui`
4. ตรวจสอบ dependencies ที่ต้องการ

### 3. Custom Themes

ปรับแต่ง themes ผ่าน CSS variables

1. แก้ไข `src/index.css` สำหรับ custom colors
2. ใช้ CSS variables สำหรับ theme customization
3. ตั้งค่า `baseColor`, `borderRadius`, และ `radius`
4. ใช้ Tailwind classes สำหรับ styling

### 4. ใช้งาน Components

ใช้ components ใน SolidJS pages

1. Import components จาก `@/components/ui`
2. ใช้ components ใน SolidJS pages
3. ปรับ props ตามความต้องการ
4. ทำตาม accessibility guidelines

### 5. ตรวจสอบ Accessibility

ตรวจสอบ accessibility ของ components

1. ตรวจสอบ keyboard navigation
2. ตรวจสอบ screen reader support
3. ตรวจสอบ color contrast
4. ใช้ ARIA attributes เมื่อจำเป็น

## Rules

### Installation

ติดตั้ง dependencies ที่จำเป็น:

- ติดตั้ง `@kobalte/core` สำหรับ accessible primitives
- ติดตั้ง `@corvu/ui` สำหรับ UI components
- ติดตั้ง `shadcn-solid` CLI สำหรับ component management
- ใช้ `bun` สำหรับ package management

### Component Usage

ใช้ components อย่างถูกต้อง:

- Import จาก `@/components/ui` เท่านั้น
- ไม่แก้ไข source code ของ components
- Custom ผ่าน props และ CSS variables
- ทำตาม Kobalte และ Corvu patterns

### Theme Customization

Custom themes ผ่าน CSS variables:

- ใช้ CSS variables สำหรับ colors, spacing, radius
- แก้ไข `src/index.css` สำหรับ global styles
- ใช้ Tailwind classes สำหรับ component-level styles
- รักษา consistency ทั้ง application

### Accessibility

ทำตาม accessibility standards:

- Components จาก Zaidan accessible โดย default
- รองรับ keyboard navigation
- รองรับ screen readers
- ใช้ ARIA attributes อย่างถูกต้อง

### Best Practices

ทำตาม best practices สำหรับ SolidJS:

- ใช้ SolidJS reactivity อย่างถูกต้อง
- ใช้ `createSignal`, `createMemo`, `createEffect`
- ใช้ `Show`, `For`, `Index` สำหรับ conditional rendering
- ใช้ `onMount`, `onCleanup` สำหรับ lifecycle

## Expected Outcome

- SolidJS project พร้อมใช้ Zaidan UI components
- Accessible และ customizable UI
- Consistent design system
- Fast development ด้วย copy-paste components
- Full TypeScript support
