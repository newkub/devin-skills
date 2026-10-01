# Vite Plugins — Best Practices

Plugin selection — unplugin ecosystem และ frontend-lib catalog discipline

## Recommended Patterns

- Official plugins ก่อน (`@vitejs/plugin-*`) — framework support (react, vue, svelte) ต้อง official
- `unplugin-*` ecosystem = unified plugins (Icons, AutoImport, Components, Fonts) — ตัวเดียวทำงานทั้ง Vite/Rollup/Webpack
- Plugin order matters: framework plugin ก่อน, transforms ตามหลัง — read plugin docs สำหรับ ordering requirements
- `apply: 'serve'|'build'` เมื่อ plugin เฉพาะ mode — dev tools ไม่ควรอยู่ใน build pipeline
- Audit plugins: ทุกตัว = transform overhead + supply chain — ถามว่า built-in ทำได้ไหมก่อน add

## Common Pitfalls

- Version compat: Vite major upgrades break plugins — check peer ranges เมื่อ upgrade Vite
- Duplicate functionality: `unplugin-auto-import` + manual imports ชนกัน = confusion; commit หนึ่ง approach
- Plugin config ผ่าน options ไม่ใช่ monkey-patch — virtual modules/auto-imports มี conventions
- `@vitejs/plugin-legacy`/SWC variants — เลือกตาม browser matrix; อย่า stack plugins ซ้ำ transform เดียวกัน
- SSR/edge targets: plugin บางตัว assume browser globals — verify ใน target environment

## Selection Criteria

- Maintenance: commits ล่าสุด <6 เดือน, issues response, Vite version support
- Single-purpose ดีกว่า mega-plugins — compose smaller primitives
- Unplugin versions preferred เมื่อเป็น multi-tool — shared config ข้าม bundlers

## Do / Don't

| Do | Don't |
|----|-------|
| official/unplugin plugins ก่อน | random community plugins |
| `apply` scope เฉพาะ mode | dev plugins ใน production build |
| audit plugin necessity | plugin สำหรับทุกอย่างที่ config ทำได้ |
| check Vite peer compat | blind upgrade Vite ทำ plugins พัง |
