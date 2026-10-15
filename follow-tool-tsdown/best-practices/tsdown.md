# tsdown — Best Practices

TypeScript library bundler on Rolldown — fast lib builds + DTS

## Recommended Patterns

- `tsdown` zero-config for standard libs — use a config file when custom entries/formats are needed
- `tsdown.config.ts` + `defineConfig`: `entry`, `format: ['esm','cjs']`, `dts: true`, `sourcemap`, `minify`
- `dts: true` emits `.d.ts` via isolated declarations/rolldown-plugin-dts — don't run tsc in parallel for types
- `external` deps — peerDeps/dependencies must be external; tsdown auto-externalizes most deps from package.json
- The `exports` map in package.json must match the output files — `./dist/index.js`, `./dist/index.d.ts` for each format

## Common Pitfalls

- Dual-format hazards: CJS+ESM twins = dual package hazard; pick a single format (ESM) when consumers are modern
- DTS generation fails on complex types — isolatedDeclarations constraint; fix types or fallback tsc
- `exports` field order matters — types first, default last
- Sourcemaps + minify are separate concerns: prod minified + maps, dev readable
- Watch mode for dev — `tsdown --watch` rebuilds on change

## Build Hygiene

- `publint` validate package.json exports — catches broken publish config
- `attw` (are-the-types-wrong) check CJS/ESM type resolution
- `sideEffects: false` in package.json — consumer tree-shaking
- Ship README/LICENSE/CHANGELOG — npm pack dry-run check files

## Do / Don't

| Do | Don't |
|----|-------|
| dts via tsdown | tsc parallel dual-pipeline |
| external runtime deps | bundle deps into dist |
| validate exports w/ publint+attw | publish blind |
| single ESM format when enough | dual-format by default |
