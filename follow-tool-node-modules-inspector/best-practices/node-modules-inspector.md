# Node Modules Inspector — Best Practices

Interactive node_modules analysis — dep tree, sizes และ health audit

## Recommended Patterns

- `npx node-modules-inspector` (หรือ devDep) — launch interactive UI; use สำหรับ dep audits periodic
- วิเคราะห์: install size, duplicate versions, dependency depth, outdated packages, licenses
- เจาะ duplicate packages ก่อน — หลายเวอร์ชันของ dep เดียว = bundle bloat + potential bugs
- Compare lockfile vs node_modules — drift ชี้ติดตั้งไม่สะอาด
- Use เป็น input ของ `/run-bench-deps` และ dep cleanup workflows

## Common Pitfalls

- node_modules size ≠ bundle size — devDeps inflate node_modules; distinguish ตอนตีความ
- Transitive deps ใหญ่สุดมักมาจาก parent เดียว — trace ขึ้นหา parent ก่อน blame
- Duplicates บางอย่าง unavoidable (peer ranges conflict) — fix ผ่าน resolutions/overrides เฉพาะเมื่อจำเป็น
- pnpm/bun layouts ต่างจาก npm — inspector อ่านโครงสร้างจริง; symlinks store ทำให้ size ดูผิด
- อย่า audit เฉพาะครั้งเดียว — deps creep เรื่อยๆ; periodic check ตอน upgrade reviews

## Action Items

- Dedupe: `bun install`/lockfile regen หรือ overrides สำหรับ version unification
- Replace heavy deps: inspector ชี้ใหญ่สุด → หา alternatives (`/alternative`)
- Remove unused: combine กับ `/follow-tool-knip` — inspector เห็นติดตั้ง, knip เห็นใช้

## Do / Don't

| Do | Don't |
|----|-------|
| periodic dep audits | install-and-forget |
| trace parent ของ heavy transitive deps | blame leaf packages |
| dedupe versions เมื่อทำได้ | force overrides ทุก conflict |
| cross-check กับ knip unused | delete ตาม size อย่างเดียว |
