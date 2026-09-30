# Capture App


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

- `public/screenshots/` มีภาพครบทุก routes/components/views สำคัญ พร้อมใช้กับ `/deep-review`
- หรือได้ภาพ OS window/screen ตาม `--title` ที่ระบุ

