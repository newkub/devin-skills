---
name: follow-lib-unocss-design-system
description: สร้าง design system ด้วย UnoCSS — theme colors, HSL variables, dark mode, tokens
argument-hint: "[scope]"
related:
  - follow-lib-unocss
  - follow-lib-css
  - follow-design-system
  - follow-best-practice
---

## Goal

สร้าง design system ด้วย UnoCSS — กำหนด theme colors ผ่าน HSL CSS variables, dark mode tokens, `extendTheme` และ `theme.css` ที่แชร์ข้าม framework

## Scope

ใช้สำหรับ customize theme ของ UnoCSS v66+ projects — design tokens, color palette, dark mode, breakpoints และ typography scale สำหรับ Vite, Nuxt, Next.js, Astro

- ติดตั้ง/setup UnoCSS ก่อนด้วย `/follow-lib-unocss`
- Latest: `unocss@66.10.2` (verified 2026-09-12)

## Execute

### 1. Prerequisite

> Goal: UnoCSS พร้อมใช้งานก่อนปรับ theme

1. ทำ `/follow-lib-unocss` ให้เสร็จก่อน (install + `presetWind4` + framework integration)
2. ตรวจ `uno.config.ts` มี `presetWind4()` แล้ว
3. ระบุ CSS entry point ของ framework (`main.ts`, `app/layout.tsx`, `app.vue`)

### 2. Define Theme Colors

> Goal: map design tokens เข้า `theme.colors` ด้วย HSL variables

1. ใช้ format `hsl(var(--color-{name}))` เพื่อให้ colors resolve จาก CSS variables:

   ```ts
   export default defineConfig({
     presets: [presetWind4()],
     theme: {
       colors: {
         primary: 'hsl(var(--color-primary))',
         'primary-foreground': 'hsl(var(--color-primary-foreground))',
         secondary: 'hsl(var(--color-secondary))',
         success: 'hsl(var(--color-success))',
         warning: 'hsl(var(--color-warning))',
         destructive: 'hsl(var(--color-destructive))',
         background: 'hsl(var(--color-background))',
         foreground: 'hsl(var(--color-foreground))',
         surface: 'hsl(var(--color-surface))',
         muted: 'hsl(var(--color-muted))',
         accent: 'hsl(var(--color-accent))',
         border: 'hsl(var(--color-border))',
       },
     },
   })
   ```

2. ใช้ nested object สำหรับ shade-like states — `DEFAULT` เปิด bare class เช่น `bg-brand`
3. ใช้ `extendTheme` เมื่อต้อง mutate merged theme หรือ inherit defaults (เช่น custom `breakpoints` ที่ override แทน merge)

### 3. Create theme.css

> Goal: กำหนด CSS variables สำหรับ light และ dark mode

1. สร้าง `theme.css` ด้วย format `--color-{name}: hue saturation% lightness%` (ไม่ใส่ `hsl()` wrapper):

   ```css
   :root {
     --color-primary: 221 83% 53%;
     --color-background: 0 0% 100%;
     --color-foreground: 220 13% 18%;
   }
   .dark {
     --color-primary: 221 83% 63%;
     --color-background: 220 13% 7%;
     --color-foreground: 220 13% 97%;
   }
   ```

2. import `theme.css` ตาม framework:
   - Nuxt: `app.vue` import `./assets/theme.css`
   - Next.js: `app/layout.tsx` import `./theme.css`
   - Vite: `main.ts` import `./theme.css`
   - Astro: layout component import `../styles/theme.css`

### 4. Configure Dark Mode

> Goal: ตั้งค่า dark mode strategy

1. ใช้ `presetWind4({ dark: 'class' })` สำหรับ class-based dark mode (default แนะนำ)
2. ใช้ `dark: 'media'` ถ้าตาม system preference เท่านั้น
3. ใช้ `{ dark: '.dark', light: '.light' }` สำหรับ custom selectors
4. เพิ่ม toggle script ที่ set/remove class `dark` บน `<html>` (framework-agnostic)

### 5. Extend Design Tokens (Optional)

> Goal: เพิ่ม tokens อื่นนอกจาก colors

1. ใช้ `theme.font`, `theme.radius`, `theme.shadow`, `theme.breakpoint`, `theme.ease` (ชื่อ keys ของ presetWind4)
2. ใช้ `shortcuts` สำหรับ utility aliases เช่น `btn-primary`
3. ใช้ `presetTypography` สำหรับ prose scale และ `presetWebFonts` สำหรับ font loading

### 6. Verify

> Goal: ตรวจสอบ design system ทำงานถูกต้อง

1. รัน dev server แล้วทดสอบ `bg-primary`, `text-foreground`, `border-border`
2. ตรวจ CSS variables ถูก generate ใน output ภายใต้ `theme` layer (on-demand)
3. toggle `dark` class แล้วตรวจ colors เปลี่ยนตาม `.dark` block
4. รัน build ตรวจว่าไม่มี error

## Rules

### 1. Token Naming

- ใช้ convention `--color-{name}` ใน `theme.css` และ `hsl(var(--color-{name}))` ใน config — ต้องตรงกันทุกตัว
- ค่าใน CSS variables เป็น raw HSL channels (`221 83% 53%`) ไม่ใส่ `hsl()` wrapper

### 2. Dark Mode

- ใช้ `dark: 'class'` เป็น default strategy — ควบคุมผ่าน class `dark` บน root element
- กำหนด tokens ทั้ง `:root` และ `.dark` ครบทุกตัว — ห้ามขาดตัวใดตัวหนึ่ง

### 3. Theme Keys (presetWind4)

- ใช้ keys ของ wind4: `font`, `radius`, `shadow`, `breakpoint`, `ease`, `property`, `spacing` — ไม่ใช่ชื่อแบบ wind3 (`fontFamily`, `borderRadius`, `boxShadow`, `breakpoints`, `easing`)

### 4. Reference

- ดูตัวอย่างเต็ม (full config, nested colors, extendTheme, CLI) ใน [references/unocss-theme.md](references/unocss-theme.md)

- ใช้ `/follow-lib-unocss` ถ้ายังไม่ได้ setup
- ใช้ `/follow-lib-css` ถ้าจำเป็น
- ใช้ `/follow-design-system` ถ้าจำเป็น

## Expected Outcome

- `theme.colors` map กับ CSS variables ครบและ consistent
- `theme.css` มี tokens ทั้ง light และ dark mode
- dark mode toggle ทำงานผ่าน class strategy
- design tokens ใช้ผ่าน utilities ได้ทันที (`bg-primary`, `text-muted` ฯลฯ)
- theme แชร์ได้ข้าม framework ด้วย `theme.css` ไฟล์เดียว
