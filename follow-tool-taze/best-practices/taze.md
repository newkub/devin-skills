# Taze — Best Practices

Dependency updater CLI — interactive + CI modes สำหรับ version bumps

## Recommended Patterns

- `taze` interactive — grouped view (major/minor/patch), เลือก bump ต่อ dep
- `taze -w` write ลง package.json — ตรวจ diff ก่อน commit; `taze` ดิบ = dry-run
- `taze major` เฉพาะเมื่อตั้งใจ upgrade majors — default respects semver ranges
- Monorepo: `-r` recursive ทุก workspace — consistent bumps ข้าม packages
- `taze --include locked` หรือ filters ต่อ dep patterns — scope updates เช่น types-only

## Common Pitfalls

- Bump แล้วต้อง install + test — version เปลี่ยน ≠ deps ติดตั้ง; `bun install` + `run-check` เสมอ
- Lockfile sync: package.json bump ต้อง regen lockfile — commit ทั้งคู่
- Peer dep warnings หลัง bump — majors ที่ peer conflicts = ต้อง upgrade chain ทั้ง cluster
- New versions อายุ <7 วัน = supply-chain risk — เช็ค publish date, prefer stable
- Beta/alpha tags: taze อาจเสนอ prereleases — verify tag ก่อน accept

## Workflow

- Periodic: `taze` → review grouped list → bump safe set → install → typecheck+test → commit
- Pair กับ `/run-bench-deps` — bench report ชี้ outdated, taze executes bump
- Renovate ใน CI กับ taze local = complementary — อย่า run ทั้งคู่ conflict

## Do / Don't

| Do | Don't |
|----|-------|
| dry-run review ก่อน `-w` | blind `taze major -w` |
| bump → install → test → commit | bump แล้วลืม lockfile |
| grouped minor/patch first | major bumps ทีเดียวหมด |
| check publish dates | accept day-old versions |
