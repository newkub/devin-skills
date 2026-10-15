# Rolldown — Best Practices

Rust-based bundler (Rollup-compatible API) — lib builds and Vite 8 core

## Recommended Patterns

- Rolldown = Rollup API-compatible + Rust speed — the config is nearly identical to `rollup.config` (input/output/plugins)
- Vite 8 uses Rolldown as its bundler — in Vite projects use `/follow-tool-vite`; bare rolldown for lib builds
- `rolldown.config.ts` + `defineConfig` — typed config; set `input`/`output.format` (esm/cjs) explicitly
- Library builds: externalize deps via `external` (peerDeps) — don't bundle dependencies into dist
- DTS is a separate step — rolldown doesn't emit types; pair with tsdown (`/follow-tool-tsdown`) or tsc for `.d.ts`

## Common Pitfalls

- Not every Rollup plugin works — Rolldown has builtin equivalents; check compat before porting a plugin
- `preserveModules` for lib multi-entry — the tree-shakeable output consumers want
- Sourcemaps: `output.sourcemap` — libraries must ship maps for consumer debugging
- Side effects: `treeshake` options + `"sideEffects": false` in package.json — missing = bloated consumer bundles
- High speed means frequent iteration — but config mistakes fail fast; always test builds in CI

## Migration (Rollup → Rolldown)

- Config is nearly drop-in — change the import + validate plugins
- Verify output parity: sizes, exports, chunks before switching production builds
- Watch for JS-plugin-specific behavior (hook semantics may differ)

## Do / Don't

| Do | Don't |
|----|-------|
| external peerDeps for libs | bundle react/lodash into dist |
| tsdown/tsc for .d.ts | expect rolldown emit types |
| verify plugin compat | assume all rollup plugins work |
| `sideEffects` field correct | tree-shake metadata missing |
