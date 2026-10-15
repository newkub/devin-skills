# Vite 8 — Best Practices

Rolldown-powered build tool — config minimal, env discipline, perf defaults

## Recommended Patterns

- `vite.config.ts` + `defineConfig` — typed config; keep minimal (the defaults are very good)
- Plugins only when needed — every plugin is transform cost; prefer built-ins (`vite:json`, `vite:asset`)
- Env vars: `VITE_*` prefix = client-exposed — never secrets in `VITE_*`; server-only vars have no prefix
- `resolve.alias` for path shortcuts (`@/` → `src/`) — sync with tsconfig paths
- Manual chunks only when measured to be necessary — Rolldown code-splitting defaults are good

## Common Pitfalls

- `import.meta.env` ≠ `process.env` — Vite doesn't polyfill process env in the browser; use `import.meta.env.MODE`/`DEV`
- SSR vs client guards: `import.meta.env.SSR` — browser APIs in the SSR path = crash
- Assets: `public/` = copied as-is (not hashed), `import` = hashed+optimized — pick per use case
- `base` config for non-root deploys — asset paths break when deploying under a subpath without it
- Dev vs build divergence: dev = esbuild transforms, build = Rolldown — test production builds, not dev only

## Perf / Build

- Rolldown native = fast; less config = fast — over-configured pipelines lose speed
- `build.target` per the browser matrix — `esnext` dev, baseline `es2020+` prod per support needs
- Analyze: `vite build --mode analyze` + rollup-plugin-visualizer/rolldown equivalents when the bundle bloats
- CSS: LightningCSS optional transformer — faster + better minification than the default

## Do / Don't

| Do | Don't |
|----|-------|
| minimal config, trust defaults | cargo-cult plugin collections |
| `VITE_*` public vars only | secrets in client env |
| test prod builds | dev-only verification |
| alias + tsconfig sync | divergent path maps |
