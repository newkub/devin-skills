---
name: capture
description: Capture หลักฐานภาพ/วิดีโอ — web, component, terminal, app หรือ all-routes ผ่าน CLI เดียว
argument-hint: "<web|component|terminal|app|all> [options]"
related:
  - capture-bug-context
  - use-agent-browser
  - run-dev
  - review-uxui

---

## Goal

Capture ภาพหรือวิดีโอหลักฐานตาม target ผ่าน Bun CLI ตัวเดียว — หน้าเว็บ, component, terminal output, app window หรือทุก route x device — สำหรับ documentation, debugging และ testing (merged จาก `capture-web`, `capture-component`, `capture-terminal`, `capture-app`, `capture-all-components-all-routes`)

## Scope

CLI อยู่ที่ `src/` (Bun/TypeScript, entry `src/presentation/cli.ts`) — ใช้ได้กับทุก project โดยไม่ต้องติดตั้ง dependency ฝั่ง project:

```bash
bun <skill-dir>/src/presentation/cli.ts <mode> [options]
```

| Mode | ทำอะไร | Guide |
|------|--------|-------|
| `web` | screenshot/PDF หน้าเว็บเดียว ผ่าน `agent-browser` | [Web](#capture-web) |
| `component` | screenshot element เดียว (CSS selector) บน URL | [Component](#capture-component) |
| `terminal` | render output ของ command เป็น PNG/SVG/HTML | [Terminal](#capture-terminal) |
| `app` | screenshot หน้าต่าง/จอ OS-level (Windows PowerShell) + app sweep workflow | [App](#capture-app) |
| `all` | ทุก route x ทุก device size ในรันเดียว + manifest | [All](#capture-all) |

## Execute

### 1. Select Mode

> Goal: ระบุ capture mode และอ่าน guide ของ mode นั้น

1. อ่าน mode จาก argument — ถ้าไม่ระบุ → ถาม user
2. อ่าน `## Mode Guides` ของ mode นั้นแล้วทำตาม Execute + Rules — ไม่ execute จากตารางนี้โดยตรง
3. ถ้า tool ต้องการยังไม่ติดตั้ง (`agent-browser`, `terminal-shot`, …) → ติดตั้งตาม mode guide หรือ `/download-program`

### 2. Capture

> Goal: ได้ภาพ/วิดีโอตาม mode

1. เตรียม target: เปิด URL/app/terminal ที่ต้องการ (`/run-dev` ถ้าต้อง start server)
2. รัน CLI subcommand ตาม mode พร้อมตั้งชื่อไฟล์สื่อความหมาย
3. บันทึกไปตำแหน่งตาม mode guide (`public/screenshots/`, `docs/screenshots/`, หรือ `.devin/temp/report/<workspace>/captures-<ts>/`)

### 3. Verify And Report

> Goal: ภาพใช้ได้จริงและถูกอ้างถึง

1. ตรวจว่าไฟล์สร้างสำเร็จและไม่ว่าง (เปิดดูด้วย `read` ถ้าเป็นภาพ)
2. `all` mode → เช็ค `manifest.json` errors ก่อนเสมอ
3. รายงาน path และขนาดไฟล์ — ถ้าใช้เป็น bug evidence → ผูกกับ `/capture-bug-context`

## Rules

- ตั้งชื่อไฟล์สื่อความหมาย มีวันที่ถ้าเป็น evidence
- ไม่ capture หน้าจอที่มี secrets/credentials โดยไม่จำเป็น — ถ้า target ต้อง auth ให้ถาม user ก่อน
- แจ้ง path ของไฟล์ที่ capture เสมอ
- ใช้ /run-dev, /use-agent-browser, /resolve-errors, /review-uxui ถ้าจำเป็น

## Mode Guides

### Capture Web

Screenshot/PDF หน้าเว็บเดียวด้วย `agent-browser` CLI ผ่าน `capture web` (merged จาก `capture-web`)

#### Web — Execute

##### 1. Install And Verify

1. ตรวจด้วย `agent-browser --help` — ถ้าไม่มี → `bun add -g agent-browser` แล้ว `agent-browser install` (ดู `/use-agent-browser`)
2. ตรวจว่า target URL ตอบกลับก่อน capture

##### 2. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts web <url> --out <file.png>
bun <skill-dir>/src/presentation/cli.ts web <url> --out <file.png> --full --annotate
bun <skill-dir>/src/presentation/cli.ts web <url> --pdf <file.pdf>
```

- `--out` ไม่ระบุ → save ไป `~/.agent-browser/tmp/screenshots/`
- `--full` = full-page, `--annotate` = numbered element labels (refs `@eN` สำหรับ interact ต่อ)
- `--pdf` = save หน้าเว็บเป็น PDF
- `--wait <ms>` = settle time หลัง networkidle (เพิ่มถ้า SPA ช้า)

##### 3. Advanced Options

- ใช้ `agent-browser screenshot` โดยตรงถ้าต้องการ options เพิ่ม: `--screenshot-dir`, `--screenshot-format jpeg`, `--screenshot-quality 0-100`
- env ถาวร: `AGENT_BROWSER_SCREENSHOT_DIR`, `AGENT_BROWSER_SCREENSHOT_FORMAT`, `AGENT_BROWSER_SCREENSHOT_QUALITY`
- ใช้ `agent-browser snapshot -i` ควบคู่ `--annotate` เพื่อดู refs ใน text format

##### 4. Verify And Cleanup

1. CLI ปิด browser เองหลังจบ (`agent-browser close`)
2. ตรวจว่าไฟล์สร้างสำเร็จและไม่ว่าง แล้วรายงาน path + ขนาด

#### Web — Rules

- เก็บไฟล์ใน `docs/screenshots/` หรือ `test/screenshots/` — ตั้งชื่อตาม page/test case
- ไม่ capture หน้าจอที่มี secrets/credentials
- รอ `networkidle` ก่อน screenshot เสมอ (CLI ทำให้แล้ว)
- ใช้ /use-agent-browser ถ้าจำเป็น — ใช้ /resolve-errors เมื่อเจอ error

#### Web — Expected Outcome

- ได้ screenshot (viewport/full-page/annotated) หรือ PDF ตามที่ระบุ พร้อม path ที่รายงานได้

### Capture Component

Capture UI component เฉพาะส่วนสำหรับ docs/review/testing ผ่าน `capture component` (merged จาก `capture-component`)

#### Component — Execute

##### 1. Identify Component

1. ถ้า user ระบุ component file → อ่านไฟล์เพื่อดู props และ variants
2. ถ้า user ระบุ URL + selector → ใช้ตรงๆ
3. ถ้าไม่ระบุ → ค้นหา components จาก `src/components`, `src/ui`, `packages/*/src/components`

##### 2. Prepare Component View

> Goal: มีหน้าจอแสดง component เพียงอย่างเดียว

1. ถ้ามี Storybook → เปิด story ของ component นั้น
2. ถ้ามี dev server → สร้างหรือหา URL ที่ render component เปล่า ๆ
3. ถ้าเป็น static HTML → สร้าง temp page ใน `public/screenshots/components/<name>.html`
4. ถ้าเป็น TUI/CLI → ใช้ `capture terminal --cmd ...` แทน

##### 3. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts component <url> --selector "<css>" --out public/screenshots/components/<name>.png
```

- CLI จะ `scrollintoview` selector แล้ว screenshot viewport
- หลาย variants → แยกไฟล์ เช่น `<name>-primary.png`, `<name>-disabled.png`
- หลาย selectors บน routes เดียวกัน → ใช้ `capture all --components "nav=header@/,form=form@/request"` แทน

##### 4. Verify And Report

1. เปิดดูภาพด้วย `read` — component ต้องชัดเจน
2. ถ้าไม่ชัด → ปรับ viewport (`capture all --devices "name=WxH"`) หรือ theme แล้ว capture ใหม่
3. ลบ temporary HTML หลัง capture เสร็จถ้าไม่ต้องการ

#### Component — Rules

- component ต้องแสดงเพียงอย่างเดียวบนหน้าจอ — ไม่ capture navbar/sidebar/layout
- ถ้า component ต้องใช้ provider → setup provider ก่อน capture
- ตั้งชื่อตาม component (PascalCase หรือชื่อไฟล์) + variant suffix
- บันทึกลง `public/screenshots/components/`
- ถ้า component ต้อง authentication → ถาม user ก่อน

#### Component — Expected Outcome

- ได้ภาพของแต่ละ component/variant แยกไฟล์ พร้อมใช้กับ `/review-uxui`, `/update-readme-md`

### Capture Terminal

Capture terminal output เป็นภาพ PNG/SVG/HTML สำหรับ docs/README/reports ผ่าน `capture terminal` (merged จาก `capture-terminal`)

#### Terminal — Execute

##### 1. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts terminal --cmd "<command>" --out <file.png>
bun <skill-dir>/src/presentation/cli.ts terminal --cmd "git log --oneline -5" --out docs/screenshots/git-log.png --title "Git Log"
```

- CLI รัน `--cmd` เก็บ stdout/stderr เป็น text แล้ว pipe เข้า tool ที่ติดตั้ง
- `--tool auto` (default) เลือกตามนามสกุลไฟล์: `terminal-shot` → `termframe` → `termshot`
- `--theme dark` (default) — เลือกได้ `dark`, `catppuccin`, `tokyo-night`, `github-dark`

##### 2. Tool Selection (เลือกเองผ่าน `--tool`)

| Tool | Formats | เหมาะกับ | Install |
|------|---------|---------|---------|
| `terminal-shot` | png, svg, html | documentation/README — themes + window chrome | `bun add -g terminal-shot` |
| `termframe` | svg | precise vector output, auto-sizing | `scoop install termframe` |
| `termshot` | png | CI/CD pipelines | GitHub releases: `mr-pmillz/termshot` |

- ถ้าไม่มี tool ติดตั้ง → CLI error พร้อม install hint
- Quick screenshot โดยไม่มี tool → Windows Snipping Tool (`Win + Shift + S`)

##### 3. Direct Tool Usage (options ขั้นสูง)

```bash
terminal-shot --output <path>.png --theme dark --title "Title"   # stdin
termframe -o <path>.svg -- <command>                              # รัน cmd เอง
echo "text" | termframe -o <path>.svg                             # จาก text
termshot <command>            # หรือ termshot --raw-read < file.txt
```

#### Terminal — Rules

- PNG สำหรับ raster/web, SVG สำหรับ vector/print, HTML สำหรับ interactive docs
- เก็บไฟล์ใน `docs/screenshots/` หรือ `test/screenshots/` — ชื่อตาม command/test case เช่น `cli-help.png`
- ตั้ง terminal size เหมาะสม (80x24 หรือ 120x30), font monospace อ่านง่าย, contrast ดี
- หลีกเลี่ยง output ยาวเกิน — ใช้ `--max-height` ถ้า tool รองรับ
- ใช้ /capture web ถ้าต้อง capture web terminal (ttyd ฯลฯ) — ใช้ /open-windows-terminal ถ้าจำเป็น

#### Terminal — Expected Outcome

- ภาพ terminal output คุณภาพสูงใน path ที่กำหนด อ่านง่าย เหมาะกับ documentation

### Capture App

สองบริบทของ "app" (merged จาก `capture-app`):

1. **App sweep** — capture ทุก route/component ของ app ลง `public/screenshots/` (workflow)
2. **OS window** — screenshot หน้าต่าง/จอของ desktop app (CLI `capture app`)

#### App — Execute: App Sweep (web app / TUI)

##### 1. Detect App Type

1. ตรวจ `package.json` scripts, dependencies และ file structure
2. web → หา routes จาก `src/app`, `src/pages`, `src/routes`, `apps/*/pages`, `examples`
3. TUI/CLI → ระบุ commands/views สำคัญ
4. ถ้าไม่ชัด → ถาม user

##### 2. Setup Output

1. สร้าง `public/screenshots/` ถ้าไม่มี — แยก `routes/`, `components/`, `terminal/`
2. Naming: `<route-or-component-name>.png`

##### 3. Capture Web Routes

```bash
bun <skill-dir>/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request,/examples --devices desktop --full \
  --out public/screenshots
```

- เริ่ม dev server ก่อนถ้าจำเป็น (`bun dev`)
- ถ้า project มี `playwright.config.*` → ใช้ Playwright ตาม `/follow-tool-playwright` แทน
- component เฉพาะจุด → `capture component <url> --selector <css>`

##### 4. Capture Terminal Views

```bash
bun <skill-dir>/src/presentation/cli.ts terminal --cmd "<cli-command>" --out public/screenshots/terminal/<name>.png
```

##### 5. Verify And Report

1. ตรวจ `public/screenshots/` ว่าไฟล์ถูกสร้างครบ
2. ทำ `/report` table: No., Type, Name, File, Size
3. route fail → `/resolve-errors` แล้ว retry

#### App — Execute: OS Window (desktop app)

```bash
bun <skill-dir>/src/presentation/cli.ts app --out window.png                  # primary screen
bun <skill-dir>/src/presentation/cli.ts app --title "WezTerm" --out wez.png   # window by title
```

- Windows-only (PowerShell `CopyFromScreen`) — `--title` = substring ของ window title ที่มองเห็น

#### App — Rules

- ไม่ commit ภาพถ้า user ไม่ต้องการ; ไม่ capture หน้าจอที่มีข้อมูล sensitive
- route ที่ต้อง authentication → ถาม user ก่อน
- ไม่ deploy/push screenshots อัตโนมัติ
- ถ้าต้องการ script reproducible ใน project → สร้าง `tools/capture-screenshots.{ts,mjs}` ที่เรียก CLI นี้ (ตาม `/convert-scripts`)

#### App — Expected Outcome

- `public/screenshots/` มีภาพครบทุก routes/components/views สำคัญ พร้อมใช้กับ `/review-uxui`
- หรือได้ภาพ OS window/screen ตาม `--title` ที่ระบุ

### Capture All

Capture screenshots ทุก route x ทุก device size ในรันเดียว — framework-agnostic ผ่าน `capture all` (engine: `src/all.ts`, merged จาก `capture-all-components-all-routes`)

#### All — Execute

##### 1. Confirm Server

1. เช็คว่า base URL ตอบกลับ (`agent-browser open <base>` หรือ `Invoke-WebRequest`)
2. ถ้า server พัง → `/run-dev` หรือ `/resolve-errors` ก่อน

##### 2. Discover Routes — เลือกวิธี (เรียงตามความแม่น)

| วิธี | เมื่อไหร่ |
|------|-----------|
| `crw_map` (MCP) | prod/public site หรือ site ที่มี sitemap — ได้ URL list ทั้ง site กรอง same-origin แล้วบันทึกเป็น routes file |
| `--discover` | script crawl same-origin `<a href>` จาก base เอง (สูงสุด 50 routes) — ไม่ต้องมี sitemap |
| `--routes` | ระบุเองเมื่อรู้ routes แล้ว เช่น `/,/request,/examples` |
| `--routes-file` | ไฟล์ทีละบรรทัดหรือ JSON array — เหมาะกับ output จาก `crw_map` |

##### 3. Run Capture

```bash
bun <skill-dir>/src/presentation/cli.ts all --base http://localhost:3000 --discover

# routes ชัดเจน + เฉพาะ desktop/mobile
bun <skill-dir>/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request,/examples --devices desktop,mobile

# routes + components (selector per route)
bun <skill-dir>/src/presentation/cli.ts all --base http://localhost:3000 \
  --routes /,/request --components "nav=header@/,form=form@/request,card=.rounded-3xl@/request"

# routes จาก crw_map → routes.txt
bun <skill-dir>/src/presentation/cli.ts all --base https://example.com --routes-file routes.txt --full

# custom viewport
bun <skill-dir>/src/presentation/cli.ts all --base http://localhost:3000 \
  --discover --devices "wide=1920x1080,mobile"
```

Options: `--wait <ms>` (default 1200), `--full`, `--session <name>`, `--out <dir>`

Output layout:

```text
<out>/routes/<route-slug>-<device>.png
<out>/components/<name>-<device>.png
<out>/manifest.json   # captures + errors
```

##### 4. Parallel Routes (subagent)

ถ้า routes เยอะ → spawn `capture/subagents/route-capturer.md` ทีละ route ขนานกัน (อ่าน inputs/tools/output contract ในไฟล์)

##### 5. Review Output

1. เช็ค `manifest.json` errors ก่อนเสมอ
2. นำภาพไปต่อด้วย `/review-uxui` หรือ `/watch-browser-and-improve-uxui`

#### All — Rules

- ห้าม hardcode routes ของ framework ใด — discovery ต้องมาจาก `crw_map`, `--discover` หรือ input
- ใช้ `agent-browser` CLI เท่านั้น — ไม่ต้อง install dependency ในโปรเจกต์
- ไม่แก้ไข code ของ site ที่ capture
- `--wait` ต้องพอให้ hydration + fonts โหลด — เพิ่มถ้า SPA ช้า
- capture fail ต่อ target เก็บใน `manifest.errors` — ไม่หยุดทั้งรัน
- default output: `.devin/temp/report/<workspace>/captures-<timestamp>/` (`.devin/` ควร gitignore — local evidence)
- ใช้ /watch-browser ถ้าจำเป็น

#### All — Expected Outcome

- ได้ screenshots ครบทุก route x ทุก device + `manifest.json` สรุปผล/errors พร้อมใช้ต่อ

## Expected Outcome

- ไฟล์ภาพ/วิดีโอ/PDF หลักฐานพร้อมใช้ ตาม mode ที่ระบุ
- `all` mode ให้ `manifest.json` สรุปผล + errors พร้อมใช้ต่อใน `/review-uxui` หรือ report
