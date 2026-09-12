---
name: follow-lib-unocss-config-theme
description: ตั้งค่า UnoCSS theme — tokens, shortcuts, rules, dark mode
argument-hint: "[scope]"
related:
  - follow-lib-unocss
  - follow-lib-unocss-design-system
  - follow-lib-css
  - check-config-drift
  - resolve-errors
---

## Goal

ตั้งค่า `uno.config.ts` theme — colors, spacing, typography tokens, shortcuts, custom rules และ dark mode

## Scope

ใช้เมื่อต้อง customize theme ของ UnoCSS ที่ setup แล้ว — ครอบคลุม `theme.*` keys ของ `presetWind4`, `shortcuts`, `rules`, `variants` และ dark mode strategy

## Execute

### 1. Read Current Config

> Goal: อ่าน `uno.config.ts` เดิมก่อนแก้

1. เปิด `uno.config.*` — ถ้าไม่มี → ทำ subskill `setup-unocss` ก่อน
2. ตรวจ `theme`, `shortcuts`, `rules`, `presets` options ที่มีอยู่ — merge กับของเดิม ห้าม overwrite ทั้งไฟล์
3. ทำ `/check-config-drift` ถ้าสงสัยว่า config ต่างจากที่ควร

### 2. Define Theme Tokens

> Goal: กำหนด theme keys ของ presetWind4

1. ใช้ keys ของ wind4: `font`, `radius`, `shadow`, `breakpoint`, `ease`, `spacing`, `colors` — ไม่ใช่ชื่อแบบ wind3 (`fontFamily`, `borderRadius`, `breakpoints`)

   ```ts
   theme: {
     colors: {
       primary: 'hsl(var(--color-primary))',
       background: 'hsl(var(--color-background))',
     },
     radius: { lg: '0.5rem' },
   }
   ```

2. ใช้ `hsl(var(--color-{name}))` เพื่อ map กับ CSS variables — คู่กับ `theme.css` ตาม `/follow-lib-unocss-design-system`
3. ใช้ `extendTheme` เมื่อต้อง mutate merged theme แทนการ replace

### 3. Configure Shortcuts And Rules

> Goal: สร้าง utility aliases และ custom rules

1. `shortcuts`: object หรือ array `[pattern, replacement]` เช่น `{ 'btn-primary': 'px-4 py-2 bg-primary text-white rounded' }`
2. Dynamic shortcuts: `[/^btn-(.*)$/, ([, c]) => \`bg-${c}-500\`px-4 py-2\`]` — ใช้เมื่อ pattern ซ้ำหลายสี
3. `rules`: `[matcher, cssObject]` สำหรับ utilities ที่ preset ไม่มี — เขียนเท่าที่จำเป็น
4. `variants`: custom variant เช่น `hover`, `group-hover` เพิ่มเติม — ดู official docs สำหรับ variant API

### 4. Configure Dark Mode

> Goal: ตั้งค่า dark mode strategy ใน presetWind4

1. `presetWind4({ dark: 'class' })` — default แนะนำ ควบคุมผ่าน class `dark` บน root
2. `dark: 'media'` — ตาม system preference เท่านั้น
3. `{ dark: '.dark', light: '.light' }` — custom selectors
4. กำหนด tokens ทั้ง `:root` และ `.dark` ครบทุกตัวใน `theme.css`

### 5. Verify

> Goal: ตรวจสอบ theme ทำงานและไม่พังของเดิม

1. รัน dev server — ทดสอบ `bg-primary`, shortcuts, dark mode toggle
2. ตรวจ theme CSS variables ถูก generate ภายใต้ `theme` layer (on-demand)
3. ถ้าพัง → revert keys ที่เพิ่งแก้ แล้ว report diff

## Rules

- ใช้ theme keys ของ wind4 เท่านั้น — ตรวจ migration table ใน `/follow-lib-unocss` ถ้า upgrade จาก wind3
- shortcuts ต้องตั้งชื่อสื่อความหมาย — ห้าม shortcut ที่ชนกับ utility เดิม
- custom rules เป็น last resort — ใช้ theme/shortcuts ก่อน
- merge config เดิมเสมอ ห้าม clobber
- ใช้ `/follow-lib-unocss-design-system` สำหรับ full design tokens layer

## Expected Outcome

- `theme.*` tokens map กับ CSS variables ครบและ consistent
- Shortcuts และ rules ทำงานตามที่กำหนด
- Dark mode toggle ทำงานผ่าน strategy ที่เลือก
- Config เดิมไม่ถูก clobber
