# Vite 8 — Best Practices

Rolldown-powered build tool — config minimal, env discipline, perf defaults

## Recommended Patterns

- `vite.config.ts` + `defineConfig` — typed config; keep minimal (defaults ดีมาก)
- Plugins เฉพาะที่จำเป็น — ทุก plugin คือ transform cost; prefer built-ins (`vite:json`, `vite:asset`)
- Env vars: `VITE_*` prefix = client-exposed — ห้าม secrets ใน `VITE_*`; server-only vars ไม่มี prefix
- `resolve.alias` สำหรับ path shortcuts (`@/` → `src/`) — sync กับ tsconfig paths
- Manual chunks เฉพาะเมื่อวัดแล้วจำเป็น — Rolldown code-splitting defaults ดี

## Common Pitfalls

- `import.meta.env` ≠ `process.env` — Vite ไม่ polyfill process env ใน browser; ใช้ `import.meta.env.MODE`/`DEV`
- SSR vs client guards: `import.meta.env.SSR` — browser APIs ใน SSR path = crash
- Assets: `public/` = copied as-is (ไม่ hash), `import` = hashed+optimized — เลือกตาม use case
- `base` config สำหรับ non-root deploys — asset paths พังถ้า deploy ใต้ subpath โดยไม่ตั้ง
- Dev vs build divergence: dev = esbuild transforms, build = Rolldown — test production builds ไม่ใช่ dev only

## Perf / Build

- Rolldown native = fast; config น้อย = fast — over-configured pipelines เสียสปีด
- `build.target` ตาม browser matrix — `esnext` dev, baseline `es2020+` prod ตาม support needs
- Analyze: `vite build --mode analyze` + rollup-plugin-visualizer/rolldown equivalents เมื่อ bundle บวม
- CSS: LightningCSS optional transformer — faster + minification ดีกว่า default

## Do / Don't

| Do | Don't |
|----|-------|
| minimal config, trust defaults | cargo-cult plugin collections |
| `VITE_*` public vars เท่านั้น | secrets ใน client env |
| test prod builds | dev-only verification |
| alias + tsconfig sync | divergent path maps |
