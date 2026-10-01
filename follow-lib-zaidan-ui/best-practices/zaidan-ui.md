# Zaidan UI — Best Practices

SolidJS component library บน Kobalte + Corvu + Tailwind — a11y-first copy-in components

## Recommended Patterns

- Components เป็น Kobalte/Corvu primitives + Tailwind styling — accessibility (ARIA, keyboard, focus) มาจาก primitive layer
- เลือก primitive ตามชนิด: Kobalte สำหรับส่วนใหญ่, Corvu สำหรับ primitives ที่ Kobalte ไม่มี (drawer, resizable, OTP)
- Theme ผ่าน Tailwind tokens/CSS vars — อย่า hardcode colors ใน component source
- `splitProps`/`mergeProps` เมื่อ wrap components — preserve Solid reactivity เสมอ
- Copy component source เข้า repo แล้ว customize — แนวทางเดียวกับ shadcn model

## Common Pitfalls

- อย่า destructure props ของ primitive — reactivity หายเหมือน Solid pattern ทั่วไป
- Kobalte vs Corvu API ต่างกัน — ตรวจ docs ของ primitive จริงก่อน wrap; props/events ไม่เหมือนกัน
- Portal-based components (dialog, popover, toast) mount นอก tree — theme class/vars ต้องครอบ portal container ด้วย
- Tailwind version/token names ต้องตรงกับ setup ของ project — copied components assume โครงเดิม
- SSR/SolidStart: primitives touch DOM — ตรวจ `isServer` guards เมื่อ render server-side

## Perf Notes

- Primitive = headless; styling cost ตาม Tailwind classes จริง — tree-shake utilities ผ่าน UnoCSS/Tailwind JIT
- เลี่ยง wrap หลายชั้น — ทุก layer เพิ่ม component overhead; compose ตรงๆ เมื่อพอ

## Do / Don't

| Do | Don't |
|----|-------|
| Kobalte ก่อน, Corvu สำหรับ missing primitives | rebuild primitive เอง |
| theme ผ่าน CSS vars/tokens | hardcode palette ใน component |
| `splitProps`/`mergeProps` | destructure props ดิบ |
| ครอบ portal container ด้วย theme | assume portal inherit root classes |
