# Rolldown — Best Practices

Rust-based bundler (Rollup-compatible API) — lib builds และ Vite 8 core

## Recommended Patterns

- Rolldown = Rollup API-compatible + Rust speed — config แทบเหมือน `rollup.config` (input/output/plugins)
- Vite 8 ใช้ Rolldown เป็น bundler — ใน Vite projects ใช้ `/follow-tool-vite`; bare rolldown สำหรับ lib builds
- `rolldown.config.ts` + `defineConfig` — typed config; ใช้ `input`/`output.format` (esm/cjs) explicit
- Library builds: external deps via `external` (peerDeps) — อย่า bundle dependencies ลง dist
- DTS แยกขั้นตอน — rolldown ไม่ emit types; pair กับ tsdown (`/follow-tool-tsdown`) หรือ tsc สำหรับ `.d.ts`

## Common Pitfalls

- Rollup plugins ไม่ทุกตัวทำงาน — Rolldown มี builtin equivalents; เช็ค compat ก่อน port plugin
- `preserveModules` สำหรับ lib multi-entry — tree-shakeable output ที่ consumers ต้องการ
- Sourcemaps: `output.sourcemap` — library ต้อง ship maps สำหรับ debugging consumers
- Side effects: `treeshake` options + `"sideEffects": false` ใน package.json — missing = bloated consumer bundles
- Speed สูงหมายถึง iterate ได้บ่อย — แต่ config mistakes fail fast; test builds ใน CI เสมอ

## Migration (Rollup → Rolldown)

- Config แทบ drop-in — เปลี่ยน import + validate plugins
- Verify output parity: sizes, exports, chunks ก่อน switch production builds
- Watch for JS-plugin-specific behavior (hooks semantics อาจต่าง)

## Do / Don't

| Do | Don't |
|----|-------|
| external peerDeps สำหรับ libs | bundle react/lodash ลง dist |
| tsdown/tsc สำหรับ .d.ts | expect rolldown emit types |
| verify plugin compat | assume all rollup plugins work |
| `sideEffects` field ถูกต้อง | tree-shake metadata missing |
