# pkg.pr.new — Best Practices

Continuous preview releases — install PR builds โดยไม่ publish registry จริง

## Recommended Patterns

- GitHub Action: `pkg.pr.new` workflow publish ทุก commit/PR เป็น installable preview URL — `npm i https://pkg.pr.new/...`
- ใช้สำหรับ PR review testing — reviewer install preview build โดยไม่ต้อง checkout+build เอง
- Template comments บน PR ด้วย install URLs — action ทำอัตโนมัติถ้า configure
- `--compact`/`--binary` flags ตาม repo needs; monorepo ใช้ `--pnpm`/workspace support
- Pair กับ conventional commits/changesets — preview versions meaningful

## Common Pitfalls

- Preview URLs = ephemeral — ห้ามใช้เป็น dep จริงใน package.json; ทดลองแล้ว revert
- Private repos: pkg.pr.new ต้อง org/subscription access — verify access model ก่อน rely
- Build must be deterministic: preview publish ผล build จริง — reproducible builds ก่อน enable
- Secrets: workflow ต้องการ token — ใช้ GITHUB_TOKEN/permissions minimal
- อย่า publish preview ของทุก commit ใน monorepo ใหญ่ — scope ด้วย paths filter

## Workflow

- Reviewer flow: open PR → comment มี install URL → `bun add <url>` → test → feedback
- CI: pkg.pr.new job หลัง build pass — fail build = ไม่มี preview
- Cleanup: previews หมดอายุเอง — ไม่ต้องจัดการ

## Do / Don't

| Do | Don't |
|----|-------|
| preview builds สำหรับ PR testing | pin preview URLs ใน package.json |
| auto-comment install links | manual "checkout to test" instructions |
| scope publish ด้วย paths | publish ทุก commit ทุก workspace |
| verify build determinism | publish broken builds เป็น previews |
