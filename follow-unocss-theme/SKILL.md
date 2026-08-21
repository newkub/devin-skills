---
name: follow-unocss-theme
description: ตั้งค่า theme colors และ Design System ด้วย UnoCSS แบบ HSL variables
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

สร้าง theme colors สำหรับ UnoCSS ด้วย HSL CSS variables พร้อมรองรับ light/dark mode และ validator

## Scope

ใช้สำหรับตั้งค่า theme colors ด้วย HSL variables ในโปรเจกต์ที่ใช้ UnoCSS (ติดตั้งผ่าน `/follow-unocss`)

## Execute

### 1. Prepare

1. ตรวจสอบว่า UnoCSS ติดตั้งแล้วโดยทำ `/follow-unocss`
2. อ่าน `uno.config.ts` ที่มีอยู่
3. ระบุตำแหน่ง `theme.css` ตาม framework:
   - Nuxt: `app/assets/theme.css`
   - Next.js: `app/theme.css`
   - Vite: `src/theme.css`

### 2. Update Configuration

1. เพิ่ม theme colors ใน `uno.config.ts` ด้วย HSL variables
2. กำหนด colors: primary, secondary, success, warning, destructive, background, foreground, surface, muted, accent, border, focus, overlay, skeleton
3. ใช้ format `hsl(var(--color-{name}))` สำหรับแต่ละ color

### 3. Create Theme CSS

1. สร้างไฟล์ `theme.css` พร้อม HSL variables สำหรับ light/dark mode
2. กำหนด CSS variables ใน `:root` และ `.dark` selector
3. ใช้ format `--color-{name}: hue saturation% lightness%`

### 4. Import Theme CSS

1. Nuxt: ใน `app.vue` import `./assets/theme.css`
2. Next.js: ใน `app/layout.tsx` import `./theme.css`
3. Vite: ใน `main.ts` import `./theme.css`

### 5. Create Biome Validator Plugin

1. ทำ `/follow-create-biome-plugins` สำหรับสร้าง GritQL plugin
2. สร้างไฟล์ `theme-validator.grit` ที่ root ของโปรเจกต์
3. เขียน GritQL patterns สำหรับตรวจสอบ:
   - ทุก color variable ที่กำหนดใน `uno.config.ts` มีใน `:root` และ `.dark`
   - HSL format ถูกต้อง (`hue saturation% lightness%`)
   - ทุก color มี states ครบ: `DEFAULT`, `hover`, `active`, `foreground`
4. เพิ่ม plugin path ใน `biome.jsonc` ผ่าน `plugins` array
5. รัน `bunx biome lint` เพื่อทดสอบ validator

### 6. Verify

1. ทดสอบ theme classes เช่น `bg-primary`, `text-foreground`
2. ทดสอบ dark mode ด้วย class `.dark` บน html element
3. รัน `bunx biome lint` เพื่อตรวจสอบ theme validator ผ่าน

## Rules

### Color Format

กำหนดรูปแบบ CSS variables สำหรับ theme colors

- ใช้ HSL format สำหรับ CSS variables เสมอ
- ตั้งชื่อ variables เป็น `--color-{name}`
- มี states ครบ: `DEFAULT`, `hover`, `active`, `foreground`

### Dark Mode

กำหนดการทำงานของ dark mode

- ใช้ class `.dark` บน html element
- สร้าง variables สำหรับ dark mode ใน `.dark` selector
- ทุก color ที่มีใน `:root` ต้องมีใน `.dark` ด้วย

### Required Colors

กำหนด colors ที่จำเป็นต้องมี

- primary, secondary, success, warning, destructive
- background, foreground, surface, muted, accent
- border, focus, overlay, skeleton

### Validator

กำหนดการตรวจสอบด้วย Biome plugin

- สร้าง Biome plugin ด้วย `/follow-create-biome-plugins`
- ตรวจสอบ missing CSS variables ใน `:root` และ `.dark`
- ตรวจสอบ HSL format ถูกต้อง
- ตรวจสอบ required states ครบ
- กำหนด plugin ใน `biome.jsonc` ผ่าน `plugins` array
- รัน `bunx biome lint` เพื่อตรวจสอบ

### Example Variables

ตัวอย่าง CSS variables สำหรับ theme colors

```css
:root {
  --color-primary: 221 83% 53%;
  --color-primary-hover: 221 83% 45%;
  --color-primary-active: 221 83% 37%;
  --color-primary-foreground: 0 0% 100%;
  --color-secondary: 238 84% 67%;
  --color-secondary-hover: 238 84% 59%;
  --color-secondary-active: 238 84% 51%;
  --color-secondary-foreground: 0 0% 100%;
  --color-success: 142 76% 36%;
  --color-success-foreground: 0 0% 100%;
  --color-warning: 38 92% 50%;
  --color-warning-foreground: 0 0% 100%;
  --color-destructive: 0 84% 60%;
  --color-destructive-hover: 0 84% 56%;
  --color-destructive-active: 0 84% 52%;
  --color-destructive-foreground: 0 0% 100%;
  --color-background: 0 0% 100%;
  --color-foreground: 220 13% 18%;
  --color-surface: 0 0% 100%;
  --color-surface-elevated: 0 0% 100%;
  --color-surface-foreground: 220 13% 18%;
  --color-muted: 220 13% 96%;
  --color-muted-foreground: 220 13% 42%;
  --color-accent: 221 83% 53%;
  --color-accent-hover: 221 83% 45%;
  --color-accent-foreground: 0 0% 100%;
  --color-border: 220 13% 82%;
  --color-border-hover: 220 13% 60%;
  --color-focus: 221 83% 53%;
  --color-overlay: 0 0% 0%;
  --color-skeleton: 220 13% 82%;
  --color-skeleton-shine: 220 13% 96%;
}
.dark {
  --color-primary: 221 83% 63%;
  --color-primary-hover: 221 83% 55%;
  --color-primary-active: 221 83% 47%;
  --color-primary-foreground: 0 0% 100%;
  --color-secondary: 238 84% 77%;
  --color-secondary-hover: 238 84% 69%;
  --color-secondary-active: 238 84% 61%;
  --color-secondary-foreground: 0 0% 100%;
  --color-success: 142 76% 46%;
  --color-success-foreground: 0 0% 100%;
  --color-warning: 38 92% 60%;
  --color-warning-foreground: 0 0% 100%;
  --color-destructive: 0 84% 70%;
  --color-destructive-hover: 0 84% 66%;
  --color-destructive-active: 0 84% 62%;
  --color-destructive-foreground: 0 0% 100%;
  --color-background: 220 13% 7%;
  --color-foreground: 220 13% 97%;
  --color-surface: 220 13% 10%;
  --color-surface-elevated: 220 13% 15%;
  --color-surface-foreground: 220 13% 97%;
  --color-muted: 220 13% 22%;
  --color-muted-foreground: 220 13% 60%;
  --color-accent: 221 83% 63%;
  --color-accent-hover: 221 83% 55%;
  --color-accent-foreground: 0 0% 100%;
  --color-border: 220 13% 30%;
  --color-border-hover: 220 13% 42%;
  --color-focus: 221 83% 63%;
  --color-overlay: 0 0% 0%;
  --color-skeleton: 220 13% 30%;
  --color-skeleton-shine: 220 13% 22%;
}
```

## Expected Outcome

- Theme classes ใช้งานได้ (e.g., `bg-primary`, `text-foreground`)
- CSS variables ทำงานใน light/dark mode
- Colors เปลี่ยนตาม class `.dark`
- ใช้ร่วมกับ UnoCSS utilities ได้
- Biome validator ตรวจสอบ theme variables ได้
- Missing variables และ invalid HSL format ถูกจับได้ด้วย `bunx biome lint`
