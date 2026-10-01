# hk — Best Practices

Git hooks manager (แทน Lefthook/pre-commit) — fast, parallel hook discipline

## Recommended Patterns

- `hk.pkl` config — pkl-based, typed, amendable; declare hooks ต่อ event (`pre-commit`, `pre-push`, `commit-msg`)
- Stash + fix flow: `fix` jobs ที่ modify files ต้อง re-stage — hk จัดการ stash อัตโนมัติ (edge กว่า lefthook ตรงนี้)
- Parallel by default — hk รัน jobs ขนาน; ใช้ `depends` เฉพาะเมื่อ order จริงๆ จำเป็น
- File filtering ด้วย `glob`/`dir` patterns ต่อ job — lint เฉพาะ staged files ที่เกี่ยว
- `hk run`/`hk check` สำหรับ manual/CI parity — hooks เดียวกัน CI ใช้ได้

## Common Pitfalls

- Pre-commit hooks ต้องเร็ว (<5s รวม) — งานหนัก (test suites) ย้ายไป `pre-push` หรือ CI
- Jobs ที่แก้ไฟล์ (formatters) ต้องเป็น `fix` type ไม่ใช่ `check` — check ไม่ re-stage
- Bootstrap: team members ต้อง `hk install` — ใส่ใน setup docs/postinstall script
- Secrets scanning hook — อย่า rely ฝั่ง hook เดียว; hooks bypass ได้ด้วย `--no-verify`, CI ต้องมี gate ซ้ำ

## Perf Notes

- ใช้ built-in fast tools (`check` steps เรียก binaries ตรงๆ) — wrap ผ่าน task runner เพิ่ม latency
- Group related checks ใน job เดียวเมื่อ cheap — spawn overhead ต่อ job

## Do / Don't

| Do | Don't |
|----|-------|
| fast checks ใน pre-commit | test suites ใน pre-commit |
| `fix` type สำหรับ formatters | `check` ที่ modify files |
| CI gate ซ้ำ hooks | trust hooks อย่างเดียว (--no-verify) |
| `hk install` ใน onboarding docs | assume hooks active อัตโนมัติ |
