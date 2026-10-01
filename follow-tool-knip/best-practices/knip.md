# Knip — Best Practices

Unused files/deps/exports detection — config precision สำหรับ monorepos

## Recommended Patterns

- `knip.json`/`knip.ts` ต่อ repo root — `entry` + `project` patterns ต่อ workspace แม่นยำ (entry คือจุดที่ knip trace จาก)
- ประกาศ entry points จริงทั้งหมด: config files, scripts, app entry, test files — missing entry = false "unused" flood
- Workspaces: `workspaces` map ใน config หรือ rely auto-detect จาก package manager — ตรวจว่าครบ
- `--production` mode สำหรับ deps ที่ต้องมีตอน runtime — เทียบ devDeps separately
- CI: `knip --exit-code` fail build — run เป็น dedicated job ไม่ใช่ทุก PR (ช้า)

## Common Pitfalls

- False positives จาก dynamic imports/plugins (vite plugins, drizzle models, barrel re-exports) — ใส่ใน `entry`/`ignore` หรือ `ignoreDependencies`
- Barrel files: knip รู้จัก re-exports แต่ `index.ts` ที่ export * ทั้งหมดต้องเป็น entry
- `ignoreBinaries`/`ignoreDependencies` สำหรับ tools ที่เรียกผ่าน scripts ไม่ใช่ imports (husky, turbo, changesets)
- Monorepo: run ที่ root เท่านั้น — per-package runs miss cross-workspace usage
- Config evolves — new entry types (new scripts dir) ต้องเพิ่ม entry patterns หรือ knip จะ flag ทั้ง dir

## Report Interpretation

- `unused files` → delete candidates; `unused deps` → uninstall; `unused exports` → dead code; `unlisted deps` → missing package.json entries (บั๊กจริง)
- Duplicate exports/enum members = hygiene issues ตาม severity ต่ำกว่า

## Do / Don't

| Do | Don't |
|----|-------|
| entry patterns ครบทุก entrypoint | rely auto-detect แล้ว wonder false positives |
| `ignoreDependencies` สำหรับ script-invoked tools | uninstall dep เพราะ knip flag |
| run ที่ monorepo root | per-package knip runs |
| baseline→ratchet ใน CI | strict mode day one บน legacy repo |
