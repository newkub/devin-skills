# CLI: updatedeps

CLI นี้อยู่ใน `src/cli.ts` (bin `updatedeps` ชี้มาที `src/cli.ts` สำหรับ Bun)

### Install

```bash
bun install
```

หรือใช้โดยตรง:

```bash
bun src/cli.ts --help
```

### Commands

| Command | Description |
|---------|-------------|
| `updatedeps [update] [path]` | อัพเดท dependencies (default) |
| `updatedeps convert-submodules <path> --remote <url>` | แปลง package/path เป็น git submodule |
| `updatedeps refactor [path]` | รัน refactor command ใน repo |
| `updatedeps retest [path]` | รัน tests ใหม่หลังอัพเดท |
| `updatedeps commit [path]` | stage + commit + push |

### `update` flags

```bash
updatedeps [update] [path] --type all|patch|minor|major --write --interactive --recursive --dry-run
```

- `--type`: ระดับการอัพเดท (default `all`)
- `--write`: เขียนลง manifest
- `--interactive`: ใช้ taze interactive mode
- `--recursive`: recursive workspaces
- `--dry-run`: แสดงผลโดยไม่อัพเดท

### ตัวอย่าง

```bash
# ดูว่ามีอะไร outdate บ้าง
cd /path/to/project
bun src/cli.ts update --dry-run

# อัพเดททั้งหมดเป็น latest แล้วเขียนลงไฟล์
bun src/cli.ts update --type all --write --recursive

# อัพเดท major versions เท่านั้น
bun src/cli.ts update --type major --write

# แปลง directory เป็น submodule แล้ว commit/push
bun src/cli.ts convert-submodules packages/legacy --remote https://github.com/org/legacy.git --push

# refactor ใน temp clone ด้วยคำสั่งกำหนดเอง
bun src/cli.ts refactor --temp --command "bunx @ast-grep/cli scan"

# retest บน temp clone
bun src/cli.ts retest --temp

# commit ทั้งหมดแล้ว push
bun src/cli.ts commit -m "chore: update dependencies" --push
```
