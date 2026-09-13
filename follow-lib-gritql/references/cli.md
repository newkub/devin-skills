# Lib GritQL CLI

GritQL ใน skill นี้รันผ่าน Biome CLI (`@biomejs/biome` v2+) — ไม่มี standalone binary แยก

## Commands

```bash
bun add -D @biomejs/biome            # ติดตั้ง Biome (มี GritQL engine built-in)

# Structural code search — ห่อ pattern ด้วย single quotes
bunx biome search '`console.log($message)`' ./src
bunx biome search '`console.log($message)`' ./src --language=javascript

# Apply fixes จาก GritQL plugins (`.grit` files ที่ register ใน biome.json)
bunx biome check --write              # safe fixes เท่านั้น
bunx biome check --write --unsafe     # รวม unsafe fixes
bunx biome lint --write               # lint-only fixes
```

## Plugin Registration

วาง `.grit` file ใน project แล้วลงทะเบียนใน `biome.json` / `biome.jsonc`:

```jsonc
{
  "plugins": ["./.grit/no-console-log.grit"]
}
```

## Notes

- `biome search` รองรับเฉพาะ search patterns — ไม่รองรับ rewrite operator `=>`
- Rewrites ใน plugin กลายเป็น fixable diagnostics — กำหนด `fix_kind` ใน `register_diagnostic()` (default `unsafe`)
- Standalone `gritql` npm package (`bun add -D gritql`) เป็น beta — API อาจเปลี่ยน
