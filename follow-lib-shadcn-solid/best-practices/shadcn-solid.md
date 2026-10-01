# shadcn-solid — Best Practices

SolidJS port ของ shadcn/ui — copy-in components, Kobalte primitives, Tailwind styling

## Recommended Patterns

- Components เป็น copy-in source (ไม่ใช่ dependency ล็อกเวอร์ชัน) — แก้ source ตรงๆ ให้เข้า design system
- Built on Kobalte primitives — accessibility (ARIA, keyboard nav, focus) มากับ primitive; อย่า replace ด้วย div ดิบ
- Tailwind + CSS variables theme — tokens (`--primary`, `--background`) คุม theme; components reference vars ไม่ใช่ hardcoded colors
- `cn()` utility (clsx + tailwind-merge) สำหรับ class composition — ใช้ทุกที่ที่ merge classes
- เพิ่ม components ผ่าน CLI (`npx shadcn-solid@latest add ...`) — เลือกเฉพาะที่ใช้, review diff ก่อน commit

## Common Pitfalls

- Solid reactivity ≠ React — props destructure ทำลาย reactivity เหมือน Solid ปกติ; component internals ใช้ `splitProps`/`mergeProps`
- Version drift: copied components ไม่ auto-update — track upstream changes เมื่อ Kobalte API เปลี่ยน
- `class` prop override behavior ต่างกันใน Kobalte — ตรวจว่า merge หรือ replace ต่อ component
- Dark mode: toggle class บน root + CSS vars — ไม่ duplicate component styles

## Perf Notes

- Import เฉพาะ component ที่ใช้ — copied source = tree-shake ตามใจ ไม่มี barrel bloat
- Kobalte headless = zero style cost; animations ผ่าน CSS/corvu ตาม primitive

## Do / Don't

| Do | Don't |
|----|-------|
| customize source ที่ copy มา | treat เป็น black-box dependency |
| Kobalte primitives สำหรับ a11y | rebuild dialogs/menus เอง |
| CSS vars + `cn()` | hardcoded colors / manual string concat |
| `splitProps` preserve reactivity | destructure props ตรงๆ |
