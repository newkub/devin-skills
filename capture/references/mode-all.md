# Capture All


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
2. นำภาพไปต่อด้วย `/deep-review` หรือ `/review-uxui`

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

