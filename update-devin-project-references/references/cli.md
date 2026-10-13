# refs-cli — Flags และ Commands

Entry point: `bun scripts/refs-cli/index.ts` (run จากโฟลเดอร์ skill หรือระบุ path เต็มก็ได้)

## Usage

```
bun scripts/refs-cli/index.ts [website|api|cli ...] [flags]
```

- positional = domain ที่ต้องการ generate (ไม่ระบุ → `api cli`)
- domain ซ้ำกันในคำสั่งเดียวไม่ผิด (dedupe โดยธรรมชาติของ table)

## Flags

| Flag | Default | ความหมาย |
|---|---|---|
| `--root <dir>` | cwd | project root ที่สแกน source และอ่าน manifests |
| `--out <dir>` | `<root>/.devin/references` | ที่เขียนไฟล์ output (สร้างอัตโนมัติ) |
| `--url <url>` | — | base URL สำหรับ `website` domain (จำเป็นเมื่อเลือก domain นี้) |
| `--dry-run` | off | พิมพ์ markdown ลง stdout ไม่เขียนไฟล์ |
| `--help`, `-h` | — | แสดง usage |

## Examples

```bash
# preview api + cli ของ project ปัจจุบันในแชท
bun scripts/refs-cli/index.ts --dry-run

# generate ทุก domain ของ staging site
bun scripts/refs-cli/index.ts website api cli --url https://staging.example.com --root ~/code/my-app

# เขียนเฉพาะ api.md ลง docs/references
bun scripts/refs-cli/index.ts api --root ~/code/my-app --out docs/references
```

## Exit Behavior

- tool หายไป (เช่น `crw` สำหรับ website) → error พร้อม pointer ไป skill ที่ติดตั้ง tool (`/follow-tool-crw`) แล้ว exit 1
- domain `website` โดยไม่มี `--url` → error ก่อนเริ่มงาน (fail fast, ไม่ scrape มั่ว)
- ast-grep pattern error → ข้าม pattern นั้นเงียบๆ (table อาจว่าง — suspect pattern ก่อน suspect code)
