---
name: follow-lib-zaidan-ui-config-tokens
description: ปรับ theme tokens ของ Zaidan UI — colors, radius, Tailwind v4 mapping
argument-hint: "[scope]"
related:
  - follow-lib-zaidan-ui
  - follow-lib-shadcn-solid
  - follow-design-system
  - check-config-drift
  - resolve-errors
---

## Goal

ปรับแต่ง theme tokens ของ Zaidan UI — color palette, radius, semantic tokens และ Tailwind v4 mapping ใน `globals.css`

## Scope

ใช้เมื่อต้องแก้ไข theme tokens ที่ setup แล้ว — ครอบคลุม CSS variables, `@theme` mapping, component customization ใน `src/components/ui/` และ token consistency

## Execute

### 1. Read Current Tokens

> Goal: อ่าน tokens structure ปัจจุบันก่อนแก้

1. เปิด `src/styles/globals.css` — ดู CSS variables ใน `:root` และ dark block รวมถึง `@theme` mapping
2. เปิด `components.json` — ดู `tailwind.css` path และ aliases
3. ถ้ายังไม่มี theme → ทำ subskill `setup-theme` ก่อน; merge เดิมเสมอ ห้าม overwrite
4. ทำ `/check-config-drift` ถ้าไม่แน่ใจว่า tokens ตรงกับที่ components อ้างถึง

### 2. Adjust Color And Radius Tokens

> Goal: เปลี่ยน palette และ radius ให้ตรง design

1. แก้ค่า variables ใน `:root` และ dark block พร้อมกัน — ทุก token ต้องมีทั้งสอง mode
2. ปรับ `--radius` เป็น single source ของ corner radius
3. เพิ่ม semantic tokens ใหม่ (เช่น `success`, `warning`) ตาม naming convention เดิม
4. token ใหม่ต้อง map เข้า `@theme` หรือ utility layer ที่ Tailwind v4 ใช้ — ดู official docs ที่ `https://zaidan.carere.dev/docs`

### 3. Customize Component Variants

> Goal: ปรับ variants ใน copied components

1. เปิด component ใน `src/components/ui/` — แก้ variant classes ให้อ้าง tokens (เช่น `bg-primary`) ไม่ใช่ raw palette
2. ใช้ `cn` helper สำหรับ merge classes — ห้าม hard-code overrides ใน JSX ซ้ำ
3. ห้ามแก้ Kobalte/Corvu primitives source — customize เฉพาะ copied components

### 4. Verify

> Goal: ตรวจสอบ tokens ใหม่และของเดิมไม่พัง

1. รัน dev — ทดสอบ components ที่แก้ทั้ง light/dark
2. ตรวจ utility classes ใหม่ generate ถูกต้องใน Tailwind v4 output
3. ถ้าพัง → revert keys ที่เพิ่งแก้ แล้ว report diff

## Rules

- แก้ tokens ใน `globals.css` จุดเดียว — components อ้างผ่าน tokens เท่านั้น
- `:root` และ dark block ต้องครบชุดเดียวกันเสมอ
- ใช้ Tailwind CSS v4 syntax (`@theme`) ตามที่ Zaidan ใช้ — ดู official docs
- ห้ามแก้ Kobalte/Corvu primitives source
- ใช้ `/follow-lib-zaidan-ui` สำหรับ full reference

## Expected Outcome

- Theme tokens ปรับตาม design — palette, radius, semantic colors ครบ
- Tokens map เข้า Tailwind v4 utilities ถูกต้อง
- Dark mode ครอบคลุม tokens ใหม่ทั้งหมด
- Config เดิมไม่ถูก clobber
