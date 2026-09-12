---
name: follow-lib-shadcn-solid-config-tokens
description: ปรับ theme tokens ของ shadcn-solid — colors, radius, variants, cva
argument-hint: "[scope]"
related:
  - follow-lib-shadcn-solid
  - follow-lib-unocss
  - follow-design-system
  - check-config-drift
  - resolve-errors
---

## Goal

ปรับแต่ง theme tokens ของ shadcn-solid — color palette, radius, component variants ด้วย `cva` และ tokens ใหม่

## Scope

ใช้เมื่อต้องแก้ไข theme tokens ที่ setup แล้ว — ครอบคลุม CSS variables, base color, component variants ใน `src/components/ui/` และ token naming consistency

## Execute

### 1. Read Current Tokens

> Goal: อ่าน theme tokens และ components ปัจจุบัน

1. เปิด global CSS file — ดู CSS variables ชุดปัจจุบันใน `:root` และ dark block
2. เปิด `components.json` — ดู base color และ aliases
3. ถ้ายังไม่มี theme → ทำ subskill `setup-theme` ก่อน; merge เดิมเสมอ ห้าม overwrite

### 2. Adjust Color And Radius Tokens

> Goal: เปลี่ยน palette และ radius ให้ตรง design

1. แก้ค่า variables ใน `:root` และ dark block พร้อมกัน — ทุก token ที่แก้ต้องมีทั้งสอง mode
2. ปรับ `--radius` เป็น single source ของ corner radius — components ใช้ `rounded-md` ฯลฯ ที่ derive จากมัน
3. เพิ่ม semantic tokens ใหม่ (เช่น `success`, `warning`) โดยตั้งชื่อตาม convention เดิม แล้ว map เข้า utility ของ CSS framework
4. ทำ `/check-config-drift` ถ้าไม่แน่ใจว่า tokens ตรงกับที่ components อ้างถึง

### 3. Customize Component Variants

> Goal: ปรับ variants ใน copied components ด้วย `cva`

1. เปิด component ใน `src/components/ui/` — variants นิยามด้วย `cva` เช่น `buttonVariants`
2. เพิ่ม/แก้ variants (`variant`, `size`) ใน `cva` definition — ห้าม hard-code class ใน JSX ซ้ำ
3. variant classes ต้องอ้าง tokens เช่น `bg-primary text-primary-foreground` — ไม่ใช่ `bg-blue-500`
4. update `defaultVariants` ให้ตรง design intent

### 4. Sync With CSS Framework

> Goal: ให้ tokens ใช้ผ่าน utilities ได้จริง

1. Tailwind: ตรวจ `tailwind.config`/`@theme` block map variables เข้า color names (`primary`, `muted`, ฯลฯ)
2. UnoCSS: map เข้า `theme.colors` ตาม `/follow-lib-unocss` และ `/follow-lib-unocss-design-system`
3. ทดสอบ utilities ใหม่ เช่น `bg-success`, `text-warning-foreground`

### 5. Verify

> Goal: ตรวจสอบ tokens ใหม่และของเดิมไม่พัง

1. รัน dev — ทดสอบ components ทุก variant ที่แก้ ทั้ง light/dark
2. ใช้ `bunx shadcn-solid@latest diff <component>` เช็คว่าแก้เฉพาะจุดที่ตั้งใจ
3. ถ้าพัง → revert keys ที่เพิ่งแก้ แล้ว report diff

## Rules

- แก้ tokens ใน CSS variables จุดเดียว — components อ้างผ่าน tokens เท่านั้น
- `:root` และ dark block ต้องครบชุดเดียวกันเสมอ
- เพิ่ม variants ผ่าน `cva` เท่านั้น — ห้าม inline class overrides ใน JSX
- ห้ามแก้ Kobalte primitives source — customize ที่ copied components เท่านั้น
- ใช้ `/follow-lib-shadcn-solid` สำหรับ full reference

## Expected Outcome

- Theme tokens ปรับตาม design — palette, radius, semantic colors ครบ
- Component variants เพิ่ม/แก้ผ่าน `cva` อย่าง type-safe
- Dark mode ครอบคลุม tokens ใหม่ทั้งหมด
- Tokens consistent ระหว่าง CSS variables, framework config และ components
