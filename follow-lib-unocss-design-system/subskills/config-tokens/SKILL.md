---
name: follow-lib-unocss-design-system-config-tokens
description: ปรับแต่ง design tokens — structure, variants, extendTheme, shortcuts
argument-hint: "[scope]"
related:
  - follow-lib-unocss-design-system
  - follow-lib-unocss
  - follow-design-system
  - check-config-drift
  - resolve-errors
---

## Goal

ปรับแต่ง design tokens ที่มีอยู่ — tokens structure, color variants, `extendTheme`, typography/spacing scale และ shortcuts

## Scope

ใช้เมื่อต้องแก้ไข design tokens ของ UnoCSS project ที่ setup theme แล้ว — ครอบคลุม nested colors, non-color tokens (`font`, `radius`, `shadow`, `breakpoint`, `ease`, `spacing`), `extendTheme` และ shortcuts

## Execute

### 1. Read Current Tokens

> Goal: อ่าน tokens structure ปัจจุบันก่อนแก้

1. เปิด `theme.css` และ `uno.config.ts` — ถ้ายังไม่มี theme → ทำ subskill `setup-theme` ก่อน
2. map ว่า tokens ไหนมีอยู่ ตัวไหนขาด (`:root` vs `.dark` ต้องครบชุดเดียวกัน)
3. ทำ `/check-config-drift` ถ้าสงสัย config ต่างจากที่ควร — merge เดิมเสมอ ห้าม overwrite ทั้งไฟล์

### 2. Structure Color Tokens

> Goal: จัด structure colors ด้วย nested objects และ variants

1. ใช้ nested object + `DEFAULT` สำหรับ base + variants:

   ```ts
   colors: {
     brand: {
       DEFAULT: 'hsl(var(--color-brand))',
       foreground: 'hsl(var(--color-brand-foreground))',
       muted: 'hsl(var(--color-brand-muted))',
     },
   }
   ```

   → ได้ `bg-brand`, `bg-brand-foreground`, `bg-brand-muted`

2. semantic tokens (primary, destructive, success, warning) มาก่อน palette tokens (blue-500 ฯลฯ)
3. ทุก token ใหม่ต้องเพิ่มทั้ง `:root` และ `.dark` ใน `theme.css` พร้อมกัน

### 3. Extend Non-Color Tokens

> Goal: ปรับ tokens นอกจาก colors ด้วย keys ของ wind4

1. ใช้ `theme.font`, `theme.radius`, `theme.shadow`, `theme.breakpoint`, `theme.ease`, `theme.spacing` — ชื่อ keys ของ presetWind4 เท่านั้น
2. ใช้ `extendTheme` เมื่อต้อง merge/inherit defaults แทน replace เช่น override `breakpoint` บางตัว:

   ```ts
   extendTheme: (theme) => {
     theme.breakpoint.xs = '480px'
     return theme
   }
   ```

3. ใช้ `presetTypography` สำหรับ prose scale และ `presetWebFonts` สำหรับ font loading ถ้าจำเป็น

### 4. Add Shortcuts

> Goal: สร้าง utility aliases สำหรับ patterns ที่ใช้ซ้ำ

1. `shortcuts` object สำหรับ static aliases เช่น `{ 'btn': 'px-4 py-2 rounded font-medium' }`
2. dynamic shortcuts ด้วย regex tuple สำหรับ color variants เช่น `[/^btn-(.*)$/, ([, c]) => \`bg-${c} text-${c}-foreground\`]`
3. shortcut names ต้องสื่อความหมายและไม่ชนกับ utility เดิม

### 5. Verify

> Goal: ตรวจสอบ tokens ใหม่ใช้งานได้และของเดิมไม่พัง

1. รัน dev server — ทดสอบ utilities ใหม่และของเดิม
2. toggle dark mode — tokens ใหม่ต้องเปลี่ยนตาม `.dark`
3. ถ้าพัง → revert keys ที่เพิ่งแก้ แล้ว report diff

## Rules

- ใช้ wind4 theme keys เท่านั้น — ห้ามใช้ชื่อแบบ wind3
- token ใหม่ต้องเพิ่มทั้ง `:root` และ `.dark` พร้อมกันเสมอ
- semantic tokens มาก่อน palette — ใช้ raw palette เฉพาะเมื่อจำเป็น
- `extendTheme` สำหรับ merge behavior, `theme` สำหรับ explicit override
- ใช้ `/follow-lib-unocss-design-system` สำหรับ full reference และตัวอย่างเต็ม

## Expected Outcome

- Tokens structure เป็นระบบ มี variants ครบและใช้ผ่าน utilities ได้ทันที
- Non-color tokens (font, radius, shadow, breakpoint) ปรับตาม design
- Config เดิมไม่ถูก clobber — merge ถูกต้อง
- Dark mode ครอบคลุม tokens ใหม่ทั้งหมด
