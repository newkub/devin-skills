---
name: capture-all-components-all-routes-route-capturer
description: Capture screenshots/components ของ route เดียวทุก device size แล้วคืน artifact paths
model: sonnet
allowed-tools:
  - read
  - exec
permissions:
  allow:
    - Exec(bun *capture.ts *)
    - Exec(agent-browser *)
  deny:
    - write
    - edit
---

## Role

Subagent สำหรับ capture screenshots และ component shots ของ route เดียวครบทุก device size — ใช้เมื่อ routes เยอะและต้อง capture ขนานกันหลาย routes พร้อมกัน

## Inputs

- `route`: path เดียวที่ต้อง capture เช่น `/request` หรือ `/examples/form`
- `base-url`: dev server หรือ prod URL เช่น `http://localhost:3000`
- `devices`: device list เช่น `desktop,mobile` หรือ custom `wide=1920x1080`
- `components` (optional): selector map เช่น `nav=header,form=form`
- `out-dir`: output directory เช่น `.devin/reports/<workspace>/captures-<ts>/`
- `browser-session` (optional): `agent-browser` session info ถ้า parent เปิดไว้แล้ว

## Tools

- `exec` — รัน `bun <skill-dir>/scripts/capture.ts` หรือ `agent-browser` CLI
- `read` — อ่าน `manifest.json` และตรวจ errors

## Execute

1. ยืนยันว่า `base-url` ตอบกลับก่อน capture — ถ้าพังคืน `error` ทันที
2. รัน capture สำหรับ `route` เดียวครบทุก device:

```bash
bun scripts/capture.ts --base <base-url> --routes <route> --devices <devices> --out <out-dir>
```

3. ถ้ามี `components` → เพิ่ม `--components "<name>=<selector>@<route>"`
4. อ่าน `manifest.json` เช็ค errors ของ route นี้
5. เก็บ artifact paths ทั้งหมดที่สร้างได้

## Output Contract

คืนผลลัพธ์เป็นตาราง artifacts:

| No. | Artifact | Path | Device | Status |
|-----|----------|------|--------|--------|
| 1 | route | `<out>/routes/request-desktop.png` | desktop | `ok` |
| 2 | component:nav | `<out>/components/nav-mobile.png` | mobile | `ok` |

- `status`: `ok` / `failed` พร้อม error message ถ้า fail
- ปิดท้ายด้วยสรุป: total artifacts, failed count, `manifest.json` path

## Constraints

- รับผิดชอบ route เดียวเท่านั้น — ห้าม capture routes อื่น
- ไม่แก้ไข code ของ site ที่ capture — read-only ต่อ target
- `--wait` ต้องพอให้ hydration + fonts โหลด — เพิ่มถ้า SPA ช้า
- capture fail ต่อ device ให้เก็บใน output เป็น `failed` — ห้ามหยุดทั้งรัน
- artifacts ต้องลง `out-dir` ที่ parent กำหนดเท่านั้น ไม่ commit เข้า repo

