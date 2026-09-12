---
name: follow-lib-unocss-design-system-setup-theme
description: Setup design tokens layer — theme.css, HSL variables, dark mode variants
argument-hint: "[scope]"
related:
  - follow-lib-unocss-design-system
  - follow-lib-unocss
  - follow-design-system
  - run-dev
  - resolve-errors
---

## Goal

Setup design tokens layer ของ UnoCSS — สร้าง `theme.css` ด้วย HSL CSS variables, map เข้า `theme.colors` และตั้ง dark mode variants

## Scope

ใช้เมื่อต้อง setup theme ครั้งแรกใน UnoCSS project ที่ติดตั้งแล้ว — ครอบคลุม `theme.css`, CSS variables structure, color mapping และ dark mode (first-time theme setup — ใช้ `config-tokens` สำหรับปรับแต่ง tokens ที่มีอยู่)

## Execute

### 1. Prerequisite

> Goal: UnoCSS พร้อมใช้งานก่อนสร้าง theme

1. ทำ `/follow-lib-unocss` หรือ subskill `setup-unocss` ให้เสร็จก่อน — ต้องมี `uno.config.ts` กับ `presetWind4()`
2. ระบุ CSS entry point ของ framework (`main.ts`, `app/layout.tsx`, `app.vue`)
3. ตรวจว่ามี `theme.css` หรือ CSS variables อยู่แล้วหรือไม่ — ถ้ามี → ทำ `config-tokens` แทน

### 2. Create theme.css

> Goal: กำหนด CSS variables สำหรับ light และ dark mode

1. สร้าง `theme.css` ด้วย raw HSL channels (ไม่ใส่ `hsl()` wrapper):

   ```css
   :root {
     --color-primary: 221 83% 53%;
     --color-background: 0 0% 100%;
     --color-foreground: 220 13% 18%;
     --color-muted: 220 13% 91%;
     --color-border: 220 13% 85%;
   }
   .dark {
     --color-primary: 221 83% 63%;
     --color-background: 220 13% 7%;
     --color-foreground: 220 13% 97%;
     --color-muted: 220 13% 18%;
     --color-border: 220 13% 25%;
   }
   ```

2. กำหนด tokens ทั้ง `:root` และ `.dark` ครบทุกตัว — ห้ามขาดตัวใดตัวหนึ่ง
3. import `theme.css` ตาม framework: Vite `main.ts`, Next.js `app/layout.tsx`, Nuxt `app.vue`, Astro layout component

### 3. Map Colors To Theme

> Goal: เชื่อม CSS variables เข้า `theme.colors` ใน `uno.config.ts`

1. map ทุก token ด้วย `hsl(var(--color-{name}))`:

   ```ts
   theme: {
     colors: {
       primary: 'hsl(var(--color-primary))',
       background: 'hsl(var(--color-background))',
       foreground: 'hsl(var(--color-foreground))',
       muted: 'hsl(var(--color-muted))',
       border: 'hsl(var(--color-border))',
     },
   }
   ```

2. ชื่อ variable `--color-{name}` ใน CSS ต้องตรงกับ key ใน config ทุกตัว
3. ใช้ nested object กับ `DEFAULT` ถ้าต้องการ shade variants เช่น `bg-brand` + `bg-brand-dark`

### 4. Setup Dark Mode Toggle

> Goal: ตั้งค่า dark mode strategy และ toggle

1. ตั้ง `presetWind4({ dark: 'class' })` ใน `uno.config.ts`
2. เพิ่ม toggle script ที่ set/remove class `dark` บน `<html>` (framework-agnostic)
3. persist preference ด้วย `localStorage` หรือ `useDark` จาก VueUse ตาม framework

### 5. Verify

> Goal: smoke test theme ทั้ง light และ dark

1. รัน `/run-dev` แล้วทดสอบ `bg-primary`, `bg-background`, `text-foreground`, `border-border`
2. toggle `dark` class แล้วตรวจ colors เปลี่ยนตาม `.dark` block
3. รัน build — theme CSS variables ต้อง generate ใน output
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ค่าใน CSS variables เป็น raw HSL channels (`221 83% 53%`) — ห้ามใส่ `hsl()` wrapper
- ชื่อ token ต้องตรงกันระหว่าง `theme.css` และ `uno.config.ts` ทุกตัว
- ใช้ `dark: 'class'` เป็น default strategy
- tokens ทั้ง `:root` และ `.dark` ต้องครบชุดเดียวกัน
- ใช้ `/follow-lib-unocss-design-system` สำหรับ full reference

## Expected Outcome

- `theme.css` มี tokens ครบทั้ง light และ dark mode
- `theme.colors` map กับ CSS variables consistent
- Dark mode toggle ทำงานผ่าน class strategy
- Utilities เช่น `bg-primary` ใช้ได้ทันที
