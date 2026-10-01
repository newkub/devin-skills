# Formatter Best Practices

แนวทางเลือก ตั้งค่า และ integrate formatter ให้ทีมใช้สม่ำเสมอ — prettier, biome, dprint, rustfmt, ruff, gofmt

## Recommended Patterns

### 1. One formatter per language, one source of truth

- เลือก formatter เดียวต่อภาษา แล้ว commit config ที่ root: `biome.json`, `.prettierrc`, `rustfmt.toml`
- ห้ามมี 2 formatter แก้ไฟล์เดียวกัน (เช่น prettier + eslint stylistic rules) → conflict วนลูป
- monorepo: config ที่ root ให้ sub-packages inherit — override เฉพาะเมื่อจำเป็นจริง

### 2. Scripts ที่เป็นมาตรฐาน

```json
{
  "scripts": {
    "format": "biome format --write .",
    "format:check": "biome format ."
  }
}
```

- `format` = write mode สำหรับ local/pre-commit
- `format:check` = read-only สำหรับ CI — exit non-zero เมื่อมีไฟล์ยังไม่ format
- ทุก formatter มี check mode: `prettier --check`, `dprint fmt --check`, `cargo fmt --check`, `ruff format --check`

### 3. Ignore ให้ครบ

```text
# .prettierignore / ignores ใน config
node_modules/
dist/
coverage/
*.lock
*.min.js
.generated/
```

- generated files, vendored files, lock files ต้อง ignore — format พวกมัน = diff noise มหาศาลและช้า
- เครื่องมือส่วนใหญ่ respect `.gitignore` อยู่แล้ว (biome, dprint) — prettier ต้อง `.prettierignore` แยก

### 4. Format on save + pre-commit gate

- editor `formatOnSave` + ชี้ formatter เป็น default formatter → ไม่มีใคร commit unformatted code
- pre-commit hook (hk/lefthook/moon `vcs.hooks`) รัน format บน staged files เท่านั้น — เร็วและไม่รบกวนไฟล์ที่ไม่ได้แตะ
- CI `format:check` เป็น gate สุดท้าย — จับคนที่ bypass hook

## Do / Don't

| Do | Don't |
|---|---|
| formatter แก้ style, linter แก้ quality — แยกหน้าที่ | ให้ linter rules ทำหน้าที่ formatter (เช่น eslint indent rules) |
| ใช้ `--write` local, `--check` ใน CI | รัน write mode ใน CI แล้วหวังว่าใครจะ commit กลับ |
| format เฉพาะ staged files ใน pre-commit | format ทั้ง repo ทุก commit (ช้า) |
| reformat ทั้ง repo ใน PR เดียวเมื่อเปลี่ยน formatter/config | เปลี่ยน config แล้วปล่อยให้ format drift ค่อยๆ เกิด |
| pin formatter version ใน devDependencies | ให้แต่ละเครื่องใช้ global formatter คนละ version |

## Common Pitfalls

- Editor extension คนละ version กับ repo: VS Code prettier extension ใช้ bundled prettier ถ้าไม่ตั้ง `prettier.prettierPath` → format ต่างจาก CI ให้ชี้ไปที่ `node_modules` version
- Format + lint fix ชนกัน: `eslint --fix` ที่มี style rules + prettier → แก้ไปแก้กลับ — ใช้ `eslint-config-prettier` ปิด style rules
- Line endings บน Windows: `endOfLine` / `core.autocrlf` ไม่ตรงกัน → formatter flip-flop ทุกไฟล์ — ตั้ง `endOfLine: "lf"` ใน config และ `.gitattributes` `* text=auto eol=lf`
- Format migration PR ใหญ่เกิน: เปลี่ยน formatter แล้ว reformat ทั้ง repo → PR diff ท่วม review ไม่ได้ — แยก PR reformat ล้วนๆ ไม่มี logic change และใส่ commit ใน `.git-blame-ignore-revs`
- Slow pre-commit: format ทั้ง repo ใน hook → devs bypass ด้วย `--no-verify` — ใช้ staged-only (hk `fix` step, `lint-staged`, `dprint fmt --staged`)

## Performance / CI Notes

- Speed ranking โดยทั่วไป: `biome`/`dprint` (Rust, parallel) > `prettier` — codebase ใหญ่เปลี่ยนได้เรื่อง pre-commit latency
- `dprint --incremental` / `biome --changed` ประหยัดเวลาใน repo ใหญ่
- CI: `format:check` เป็น job แยกหรืออยู่ใน lint job — fast fail ก่อน test jobs ที่หนักกว่า
- cache formatter binary/config ใน CI (`actions/cache` สำหรับ cargo tools หรือ bun install)
- `.editorconfig` เป็น baseline ข้าม editors (`indent_style`, `indent_width`) — formatter หลายตัวอ่านมันเป็น fallback
