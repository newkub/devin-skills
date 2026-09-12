---
name: capture-all-components-all-routes
description: Capture screenshots ของทุก route ทุก device size ในคำสั่งเดียว — framework-agnostic
argument-hint: "[base-url]"
related:
  - watch-browser
  - watch-browser-and-test
  - watch-browser-and-improve-uxui
  - improve-uxui
  - review-uxui
---

## Goal

Capture screenshots ทุก route x ทุก device size ในรันเดียว ด้วย `agent-browser` — generic ไม่ผูกกับ router/framework ใดๆ ใช้ได้กับทุก frontend (Solid, React, Vue, Svelte, static, ฯลฯ)

## Scope

ใช้เมื่อต้องการภาพรวม visual ของทั้ง site — regression check, UX/UI pass, docs evidence, design review

## Execute

### 1. Confirm Server

> Goal: base URL ตอบกลับก่อน capture

1. เช็คว่า dev server หรือ prod URL เปิดได้ (`agent-browser open <base>` หรือ `Invoke-WebRequest`)
2. ถ้า server พัง → `/run-dev` หรือ `/resolve-errors` ก่อน

### 2. Discover Routes

> Goal: ได้ route list ครบ — generic ไม่ขึ้นกับ router lib

เลือกวิธีตามความเหมาะสม (เรียงตามความแม่น):

1. **`crw_map` (MCP)** — เรียก `crw_map` กับ site URL → ได้ URL list ทั้ง site → กรองเฉพาะ same-origin pages → บันทึกเป็น routes file
   - เหมาะสุดสำหรับ prod/public site และ site ที่มี sitemap
2. **`--discover`** — script crawl same-origin `<a href>` จาก base URL เอง (สูงสุด 50 routes) — ไม่ต้องมี sitemap
3. **`--routes`** — ระบุเองเมื่อรู้ routes แล้ว เช่น `/,/request,/examples`
4. **`--routes-file`** — ไฟล์ทีละบรรทัด หรือ JSON array — เหมาะกับ output จาก `crw_map`

### 3. Run Capture

> Goal: ได้ภาพครบทุก route x device ในรันเดียว

```bash
bun <skill-dir>/scripts/capture.ts --base http://localhost:3000 --discover
```

ตัวอย่าง:

```bash
# routes ชัดเจน + เฉพาะ desktop/mobile
bun scripts/capture.ts --base http://localhost:3000 --routes /,/request,/examples --devices desktop,mobile

# routes + components (selector per route)
bun scripts/capture.ts --base http://localhost:3000 \
  --routes /,/request \
  --components "nav=header@/,form=form@/request,card=.rounded-3xl@/request"

# routes จาก crw_map → บันทึก routes.txt ก่อน แล้ว capture
bun scripts/capture.ts --base https://example.com --routes-file routes.txt --full

# custom viewport
bun scripts/capture.ts --base http://localhost:3000 --discover --devices "wide=1920x1080,mobile"
```

Output layout (flat files, device ในชื่อไฟล์):

```text
captures-<ts>/
  routes/index-desktop.png, routes/request-mobile.png, ...
  components/nav-desktop.png, components/form-mobile.png, ...
  manifest.json
```

### 4. Review Output

> Goal: ใช้ภาพเป็น evidence ต่อได้ทันที

1. ภาพอยู่ที่ `<out>/routes/<route-slug>-<device>.png` และ `<out>/components/<name>-<device>.png` เช่น `routes/request-mobile.png`
2. `manifest.json` สรุป captures + errors — เช็ค errors ก่อนเสมอ
3. นำภาพไปต่อด้วย `/review-uxui` หรือ `/improve-uxui`

## Rules

### 1. Generic By Design

- ห้าม hardcode routes ของ framework ใด — route discovery ต้องมาจาก `crw_map`, `--discover`, หรือ input ของ user
- script ใช้ `agent-browser` CLI เท่านั้น — ไม่ต้อง install dependency ในโปรเจกต์
- ไม่แก้ไข code ของ site ที่ capture

### 2. Evidence Quality

- `--wait` ต้องพอให้ hydration + fonts โหลด (default 1200ms — เพิ่มถ้า SPA ช้า)
- ถ้า capture fail ให้เก็บใน manifest.errors ไม่ใช่หยุดทั้งรัน
- `--full` ใช้เมื่อต้องการ full-page screenshots (สำหรับ routes — components แคป viewport หลัง scrollintoview)

### 3. Output Location

- default output: `.devin/reports/<workspace>/captures-<timestamp>/` — สอดคล้อง artifact convention ของ project ทุกอย่างอยู่ที่เดียว เป็นระเบียบ
- `.devin/` ควรถูก gitignore — captures เป็น local evidence ไม่ commit

## Expected Outcome

- ได้ screenshots ครบทุก route x ทุก device ในรันเดียว
- `manifest.json` สรุปผล + errors พร้อมใช้ต่อใน `/review-uxui` หรือ report
- ใช้ได้กับทุก frontend โดยไม่ต้องแก้ code ฝั่ง site
