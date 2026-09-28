# Capture Terminal (merged จาก capture-terminal)

Capture terminal output เป็นภาพ PNG/SVG/HTML สำหรับ docs/README/reports ผ่าน `capture terminal`

## Execute

### 1. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts terminal --cmd "<command>" --out <file.png>
bun <skill-dir>/src/presentation/cli.ts terminal --cmd "git log --oneline -5" --out docs/screenshots/git-log.png --title "Git Log"
```

- CLI รัน `--cmd` เก็บ stdout/stderr เป็น text แล้ว pipe เข้า tool ที่ติดตั้ง
- `--tool auto` (default) เลือกตามนามสกุลไฟล์: `terminal-shot` → `termframe` → `termshot`
- `--theme dark` (default) — เลือกได้ `dark`, `catppuccin`, `tokyo-night`, `github-dark`

### 2. Tool Selection (เลือกเองผ่าน `--tool`)

| Tool | Formats | เหมาะกับ | Install |
|------|---------|---------|---------|
| `terminal-shot` | png, svg, html | documentation/README — themes + window chrome | `bun add -g terminal-shot` |
| `termframe` | svg | precise vector output, auto-sizing | `scoop install termframe` |
| `termshot` | png | CI/CD pipelines | GitHub releases: `mr-pmillz/termshot` |

- ถ้าไม่มี tool ติดตั้ง → CLI error พร้อม install hint
- Quick screenshot โดยไม่มี tool → Windows Snipping Tool (`Win + Shift + S`)

### 3. Direct Tool Usage (options ขั้นสูง)

```bash
terminal-shot --output <path>.png --theme dark --title "Title"   # stdin
termframe -o <path>.svg -- <command>                              # รัน cmd เอง
echo "text" | termframe -o <path>.svg                             # จาก text
termshot <command>            # หรือ termshot --raw-read < file.txt
```

## Rules

- PNG สำหรับ raster/web, SVG สำหรับ vector/print, HTML สำหรับ interactive docs
- เก็บไฟล์ใน `docs/screenshots/` หรือ `test/screenshots/` — ชื่อตาม command/test case เช่น `cli-help.png`
- ตั้ง terminal size เหมาะสม (80x24 หรือ 120x30), font monospace อ่านง่าย, contrast ดี
- หลีกเลี่ยง output ยาวเกิน — ใช้ `--max-height` ถ้า tool รองรับ
- ใช้ /capture web ถ้าต้อง capture web terminal (ttyd ฯลฯ) — ใช้ /open-windows-terminal ถ้าจำเป็น

## Expected Outcome

- ภาพ terminal output คุณภาพสูงใน path ที่กำหนด อ่านง่าย เหมาะกับ documentation
