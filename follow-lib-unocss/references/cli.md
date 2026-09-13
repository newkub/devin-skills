# UnoCSS CLI Reference

## Source

- CLI docs: https://unocss.dev/integrations/cli
- Package: `@unocss/cli` (npm, `66.10.2`, verified 2026-09-13)

## Install

```bash
bun add -D @unocss/cli
```

## Usage

```bash
# ตั้งแต่ v66.6.0 CLI ไม่มี default preset — ระบุ --preset หรือใช้ uno.config.ts
bunx unocss --preset wind4

# Watch mode
bunx unocss --watch

# Custom output
bunx unocss "src/**/*.{html,ts}" --out-file dist/uno.css
```

## Options

| Option | Description |
|--------|-------------|
| `-c, --config [file]` | Config file path |
| `-o, --out-file <file>` | Output filename (default: `uno.css`) |
| `-w, --watch` | Watch files and rebuild |
| `--preflights` | Enable preflight styles |
| `-m, --minify` | Minify generated CSS |
| `--debug` | Enable debug mode |
| `--preset [wind3\|wind4]` | Default preset (ignored if config exists) |
| `--rewrite` | Rewrite utilities in files |

## Notes

- เมื่อมี `uno.config.ts` อยู่แล้ว CLI จะใช้ config นั้น — `--preset` ถูก ignore
- สำหรับ design tokens / theme ดูเพิ่มเติมที่ [unocss.md](unocss.md) และ `/follow-lib-unocss-design-system`
