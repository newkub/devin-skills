---
name: follow-lib-unocss-theme
description: ตั้งค่า theme colors และ Design System ด้วย UnoCSS HSL variables
argument-hint: "[scope]"
related:
  - follow-lib-unocss
  - follow-lib-css
  - follow-create-biome-plugins
---

## Goal

สร้าง theme colors สำหรับ UnoCSS ด้วย HSL CSS variables พร้อมรองรับ light/dark mode และ Biome validator (ถ้ามี)

## Scope

ใช้สำหรับตั้งค่า theme colors ด้วย HSL variables ใน project ที่ใช้ UnoCSS ผ่าน `/follow-lib-unocss`

## Execute

### 1. Prepare

> Goal: ตรวจสอบ UnoCSS และระบุตำแหน่ง theme.css

1. ทำ `/follow-lib-unocss` เพื่อตรวจสอบว่า UnoCSS ติดตั้งแล้ว
2. อ่าน `uno.config.ts` ที่มีอยู่
3. ระบุตำแหน่ง `theme.css` ตาม framework:
   - Nuxt: `app/assets/theme.css`
   - Next.js: `app/theme.css`
   - Vite: `src/theme.css`

### 2. Update Configuration

> Goal: เพิ่ม theme colors ใน uno.config.ts

1. ใช้ `presetWind4` และเพิ่ม `theme.colors` ด้วย HSL variables:

   ```ts
   import { defineConfig, presetWind4 } from 'unocss'

   export default defineConfig({
     presets: [
       presetWind4({
         preflights: { theme: 'on-demand' },
         dark: 'class',
       }),
     ],
     theme: {
       colors: {
         primary: 'hsl(var(--color-primary))',
         'primary-hover': 'hsl(var(--color-primary-hover))',
         'primary-active': 'hsl(var(--color-primary-active))',
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
         focus: 'hsl(var(--color-focus))',
         overlay: 'hsl(var(--color-overlay))',
         skeleton: 'hsl(var(--color-skeleton))',
       },
     },
   })
   ```

2. ใช้ nested objects สำหรับ states เมื่อต้องการ `bg-primary`, `bg-primary-hover`:

   ```ts
   primary: {
     DEFAULT: 'hsl(var(--color-primary))',
     hover: 'hsl(var(--color-primary-hover))',
     active: 'hsl(var(--color-primary-active))',
     foreground: 'hsl(var(--color-primary-foreground))',
   },
   ```

3. ตั้งค่า `dark` เป็น `'class'` หรือ `'media'` ตาม project

### 3. Create Theme CSS

> Goal: สร้าง theme.css พร้อม HSL variables

1. สร้างไฟล์ `theme.css` พร้อม HSL variables สำหรับ light/dark mode
2. กำหนด CSS variables ใน `:root` และ `.dark` selector
3. ใช้ format `--color-{name}: hue saturation% lightness%`

### 4. Import Theme CSS

> Goal: import theme.css ตาม framework

1. Nuxt: ใน `app.vue` import `./assets/theme.css`
2. Next.js: ใน `app/layout.tsx` import `./theme.css`
3. Vite: ใน `main.ts` import `./theme.css`

### 5. Create Biome Validator Plugin (Optional)

> Goal: สร้าง GritQL validator สำหรับ theme variables

1. ทำ `/follow-create-biome-plugins` สำหรับสร้าง plugin
2. สร้างไฟล์ `theme-validator.grit` ที่ root ของโปรเจกต์
3. เขียน GritQL patterns สำหรับตรวจสอบ:
   - ทุก color variable ที่กำหนดใน `uno.config.ts` มีใน `:root` และ `.dark`
   - HSL format ถูกต้อง (`hue saturation% lightness%`)
   - ทุก color มี states ครบ: `DEFAULT`, `hover`, `active`, `foreground` (ถ้ามี)
4. เพิ่ม plugin path ใน `biome.jsonc` ผ่าน `plugins` array
5. รัน `bunx biome lint` เพื่อทดสอบ validator

### 6. Verify

> Goal: ทดสอบ theme classes และ dark mode

1. ทดสอบ theme classes เช่น `bg-primary`, `text-foreground`
2. ทดสอบ dark mode ด้วย class `.dark` บน `html` element
3. รัน `bunx biome lint` หรือ `bunx biome check` เพื่อตรวจสอบ theme validator ผ่าน
4. ตรวจสอบ CSS output ว่า theme variables ถูก generate ถูกต้อง

## Rules

### 1. Color Format

- ใช้ HSL format สำหรับ CSS variables
- ตั้งชื่อ variables เป็น `--color-{name}`
- ใช้ `hsl(var(--color-{name}))` ใน `theme.colors`
- มี states ครบ: `DEFAULT`, `hover`, `active`, `foreground` (ถ้ามี)

### 2. Dark Mode

- ใช้ class `.dark` บน `html` element (default) หรือ `media` query
- สร้าง variables สำหรับ dark mode ใน `.dark` selector
- ทุก color ที่มีใน `:root` ต้องมีใน `.dark` ด้วย

### 3. Required Colors

- primary, secondary, success, warning, destructive
- background, foreground, surface, muted, accent
- border, focus, overlay, skeleton

### 4. Configuration

- ใช้ `presetWind4` เป็น preset หลัก
- ตั้งค่า `preflights.theme: 'on-demand'` เพื่อ generate theme CSS vars เฉพาะที่ใช้
- ใช้ `theme.colors` สำหรับ map colors ไปยัง HSL variables

### 5. Validator (Optional)

- ใช้ `/follow-create-biome-plugins` สำหรับสร้าง GritQL plugin
- ตรวจสอบ missing CSS variables ใน `:root` และ `.dark`
- ตรวจสอบ HSL format ถูกต้อง
- ตรวจสอบ required states ครบ
- กำหนด plugin ใน `biome.jsonc` ผ่าน `plugins` array
- รัน `bunx biome lint` หรือ `bunx biome check` เพื่อตรวจสอบ

### 6. Example Variables

```css
:root {
  --color-primary: 221 83% 53%;
  --color-primary-hover: 221 83% 45%;
  --color-primary-active: 221 83% 37%;
  --color-primary-foreground: 0 0% 100%;
  --color-secondary: 238 84% 67%;
  --color-success: 142 76% 36%;
  --color-warning: 38 92% 50%;
  --color-destructive: 0 84% 60%;
  --color-background: 0 0% 100%;
  --color-foreground: 220 13% 18%;
}

.dark {
  --color-primary: 221 83% 63%;
  --color-primary-hover: 221 83% 55%;
  --color-primary-active: 221 83% 47%;
  --color-background: 220 13% 7%;
  --color-foreground: 220 13% 97%;
}
```

- ใช้ `/follow-lib-unocss` ถ้าจำเป็น
- ใช้ `/follow-lib-css` ถ้าจำเป็น

## Expected Outcome

- Theme classes ใช้งานได้ (e.g., `bg-primary`, `text-foreground`)
- CSS variables ทำงานใน light/dark mode
- Colors เปลี่ยนตาม class `.dark`
- ใช้ร่วมกับ UnoCSS utilities ได้
- Biome validator ตรวจสอบ theme variables ได้ (ถ้าตั้งค่า)
- Missing variables และ invalid HSL format ถูกจับได้
