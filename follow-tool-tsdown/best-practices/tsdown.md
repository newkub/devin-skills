# tsdown — Best Practices

TypeScript library bundler บน Rolldown — fast lib builds + DTS

## Recommended Patterns

- `tsdown` zero-config สำหรับ libs มาตรฐาน — config file เมื่อต้องการ custom entries/formats
- `tsdown.config.ts` + `defineConfig`: `entry`, `format: ['esm','cjs']`, `dts: true`, `sourcemap`, `minify`
- `dts: true` emit `.d.ts` ผ่าน isolated declarations/rolldown-plugin-dts — อย่า run tsc ขนานสำหรับ types
- `external` deps — peerDeps/dependencies ต้อง external; tsdown auto-external deps จาก package.json เป็นส่วนใหญ่
- `exports` map ใน package.json ต้องตรง output files — `./dist/index.js`, `./dist/index.d.ts` สำหรับ each format

## Common Pitfalls

- Dual-format hazards: CJS+ESM twins = dual package hazard; เลือก format เดียว (ESM) เมื่อ consumers ทันสมัย
- DTS generation fails บน complex types — isolatedDeclarations constraint; fix types หรือ fallback tsc
- `exports` field order matters — types ก่อน, default ท้าย
- Sourcemaps + minify แยกกัน: prod minified + maps, dev readable
- Watch mode สำหรับ dev — `tsdown --watch` rebuild on change

## Build Hygiene

- `publint` validate package.json exports — catches broken publish config
- `attw` (are-the-types-wrong) check CJS/ESM type resolution
- `sideEffects: false` ใน package.json — consumer tree-shaking
- Ship README/LICENSE/CHANGELOG — npm pack dry-run check files

## Do / Don't

| Do | Don't |
|----|-------|
| dts via tsdown | tsc parallel dual-pipeline |
| external runtime deps | bundle deps ลง dist |
| validate exports w/ publint+attw | publish blind |
| single ESM format เมื่อพอ | dual-format by default |
