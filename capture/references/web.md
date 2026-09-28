# Capture Web (merged จาก capture-web)

Screenshot/PDF หน้าเว็บเดียวด้วย `agent-browser` CLI ผ่าน `capture web`

## Execute

### 1. Install And Verify

1. ตรวจด้วย `agent-browser --help` — ถ้าไม่มี → `bun add -g agent-browser` แล้ว `agent-browser install` (ดู `/use-agent-browser`)
2. ตรวจว่า target URL ตอบกลับก่อน capture

### 2. Capture

```bash
bun <skill-dir>/src/presentation/cli.ts web <url> --out <file.png>
bun <skill-dir>/src/presentation/cli.ts web <url> --out <file.png> --full --annotate
bun <skill-dir>/src/presentation/cli.ts web <url> --pdf <file.pdf>
```

- `--out` ไม่ระบุ → save ไป `~/.agent-browser/tmp/screenshots/`
- `--full` = full-page, `--annotate` = numbered element labels (refs `@eN` สำหรับ interact ต่อ)
- `--pdf` = save หน้าเว็บเป็น PDF
- `--wait <ms>` = settle time หลัง networkidle (เพิ่มถ้า SPA ช้า)

### 3. Advanced Options

- ใช้ `agent-browser screenshot` โดยตรงถ้าต้องการ options เพิ่ม: `--screenshot-dir`, `--screenshot-format jpeg`, `--screenshot-quality 0-100`
- env ถาวร: `AGENT_BROWSER_SCREENSHOT_DIR`, `AGENT_BROWSER_SCREENSHOT_FORMAT`, `AGENT_BROWSER_SCREENSHOT_QUALITY`
- ใช้ `agent-browser snapshot -i` ควบคู่ `--annotate` เพื่อดู refs ใน text format

### 4. Verify And Cleanup

1. CLI ปิด browser เองหลังจบ (`agent-browser close`)
2. ตรวจว่าไฟล์สร้างสำเร็จและไม่ว่าง แล้วรายงาน path + ขนาด

## Rules

- เก็บไฟล์ใน `docs/screenshots/` หรือ `test/screenshots/` — ตั้งชื่อตาม page/test case
- ไม่ capture หน้าจอที่มี secrets/credentials
- รอ `networkidle` ก่อน screenshot เสมอ (CLI ทำให้แล้ว)
- ใช้ /use-agent-browser ถ้าจำเป็น — ใช้ /resolve-errors เมื่อเจอ error

## Expected Outcome

- ได้ screenshot (viewport/full-page/annotated) หรือ PDF ตามที่ระบุ พร้อม path ที่รายงานได้
