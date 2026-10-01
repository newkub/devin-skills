# UnoCSS — Best Practices

Atomic CSS engine — presets, shortcuts และ config discipline

## Recommended Patterns

- `presetWind4`/`presetWind3` (Tailwind-compatible) เป็น base — เลือก preset ตาม syntax ที่ต้องการ
- Theme tokens ใน `uno.config.ts` — `theme.colors`, `theme.fontSize` — single source ไม่ hardcode ใน utilities
- `shortcuts` สำหรับ repeated combos — ชื่อ semantic (`btn-primary`) ไม่ใช่ utility dump
- `presetAttributify` สำหรับ attribute-mode ถ้าชอบ — แต่เลือก mode เดียวให้ทีม (consistency)
- `presetIcons` สำหรับ icons — `i-carbon-*` etc., icon เป็น font/svg inline

## Common Pitfalls

- Dynamic class strings ไม่ถูก scan — `class={\`bg-${color}-500\`}` broken; ใช้ `safelist` หรือ full class names
- `content.pipeline` config ต้องครอบ file extensions จริง — `.tsx`, `.md`, `.vue` ตาม project
- Variant order matters: `hover:` `focus:` `sm:` etc — ระวัง pseudo-variant conflicts ใน shortcuts
- PostCSS vs Vite plugin — เลือก integration เดียวตาม bundler (`unocss/vite` สำหรับ Vite)
- `presetMini` vs `presetWind` — Wind superset กว่า; อย่า mix preset ที่ซ้ำกันโดยไม่ตั้งใจ

## Perf Notes

- On-demand engine — CSS output เล็กมาก; แต่ scan ใหญ่ → `content.filesystem`/`pipeline` จำกัด scope
- `transformerDirectives` (`@apply`) มี cost + ทำ atomic model เสีย — ใช้เฉพาะเจาะจง
- Preflights (`presetMini` normalize) เปิดเมื่อต้องการ — app ที่มี reset อยู่แล้วอาจปิด

## Do / Don't

| Do | Don't |
|----|-------|
| theme tokens + shortcuts semantic | magic strings ทุก component |
| safelist สำหรับ dynamic classes | template-literal class composition |
| integration เดียว (`unocss/vite`) | Vite plugin + PostCSS พร้อมกัน |
| `presetIcons` สำหรับ icons | import icon components + svg inline ซ้ำ |
