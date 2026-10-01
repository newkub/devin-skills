# Iconify — Icon Usage และ Bundle Optimization

## Recommended Patterns

### เลือก Loading Strategy

- static icons (รู้ตั้งแต่ build time) → bundle ไว้เลย: `@iconify-json/<set>` + UnoCSS `presetIcons` หรือ `addIcon`/`addCollection`
- dynamic icons (user ระบุ, CMS-driven) → runtime API loading ผ่าน icon component ที่ fetch จาก Iconify API
- ห้ามใช้ runtime API สำหรับ icons ที่ static — แต่ละ icon คือ network request เพิ่ม latency
- icons น้อยมาก (< 5-10 ตัว) และไม่ต้องการ dependency → inline SVG เรียบง่ายกว่า

### Per-Icon Imports

- import icon เฉพาะตัว: `import home from '@iconify-json/mdi/home'` หรือผ่าน `addIcon('mdi:home', data)`
- ห้าม import ทั้ง `@iconify-json/mdi` — set มี icons พันตัว bundle จะบวม
- ใช้ `addCollection` เฉพาะเมื่อ subset แล้วจริง — ไม่ใช่ dump ทั้ง set

### Framework Components

- `@iconify/react`, `@iconify/vue`, `@iconify/svelte` ตาม framework — `<Icon icon="mdi:home" />`
- `iconify-icon` web component สำหรับ framework-agnostic / plain HTML
- props มาตรฐาน: `width`, `height`, `color`, `rotate`, `flip`, `inline`
- icon data lookup ด้วย `getIcon(name)`; build SVG เองด้วย `iconToSVG(data, customisations)` จาก `@iconify/utils`

### Styling

- ขนาดควบคุมด้วย `font-size` หรือ `width`/`height` prop — SVG scale ตาม `em` เมื่อไม่ fix px
- สีตาม text color ด้วย `currentColor` — set `color` prop/class ไม่ hardcode `fill` ใน SVG
- `inline` prop ให้ icon อยู่แนวเดียวกับ text baseline เหมาะกับ inline text

## Do / Don't

| Do | Don't |
|---|---|
| import per-icon หรือ subset | `import * as icons from '@iconify-json/mdi'` |
| bundle static icons ตอน build | fetch static icons ผ่าน runtime API |
| ใช้ `currentColor` + CSS class | hardcode `fill`/`stroke` ใน SVG data |
| เลือก icon set ให้ consistent (mdi / lucide / tabler) | ผสมหลาย set มั่วทำให้ style ไม่เนียน |
| ใช้ Tailwind plugin ที่ตรง version (`@iconify/tailwind` vs `@iconify/tailwind4`) | ใช้ `@iconify/tailwind` กับ Tailwind v4 |

## Common Pitfalls

- `addCollection(mdiSet)` ทั้ง set → bundle bloat แม้ใช้แค่ 5 icons — subset ก่อน
- runtime API fail silently เมื่อ offline — static icons ต้อง bundle ไม่ใช่ fetch
- icon ไม่แสดงเพราะชื่อผิด format — format คือ `<prefix>:<name>` เช่น `mdi:home` ไม่ใช่ `mdi-home`
- web component `iconify-icon` ต้อง import script ก่อนใช้ tag — register custom element ใน entry
- UnoCSS `presetIcons` ต้องติดตั้ง `@iconify-json/<set>` ที่ใช้ — ไม่งั้น icon ไม่ render โดยไม่ warning

## Performance Notes

- bundle ขนาด icon data ~1-2KB ต่อ icon — 10 icons ยังเล็ก; ทั้ง set (พันตัว) = MB
- runtime API มี latency + cache ผ่าน localStorage — first paint อาจมี icon flash ว่าง
- subsetting ทำได้หลายวิธี: `@iconify/utils` `iconToSVG`, unplugin-icons สำหรับ on-demand auto-import
- SSR/hydration: icon components render inline SVG — ไม่มี FOUC ถ้า bundle offline

## Ecosystem / Integration

- UnoCSS `presetIcons` + `@iconify-json/*` = pattern หลักใน ecosystem นี้ (ดู `/follow-lib-unocss`)
- Tailwind v3 → `@iconify/tailwind`; v4 → `@iconify/tailwind4` — syntax ต่างกัน
- icon set metadata/search: `https://icon-sets.iconify.design` — browse + copy name
- `@iconify/utils` สำหรับ custom pipeline — generate, transform, validate icon data
