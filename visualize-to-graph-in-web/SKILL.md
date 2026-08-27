---
name: visualize-to-graph-in-web
description: สร้าง web graph visualizer ด้วย Rust CLI และ Solid frontend จาก JSON nodes/edges
argument-hint: "[input-json] [--output <path>]"
allowed-tools:
  - exec
  - read
  - write
  - find_file_by_name
  - open-web
  - browser_preview
related:
  - visualize-in-web
  - visualize-devin-in-web
  - visualize-project
  - follow-create-rust-cli
  - follow-framework-solidjs
  - follow-tool-vite
  - report-html
  - open-web
  - use-scripts
---

## Goal

สร้างไฟล์ HTML ที่แสดง graph แบบ interactive ใน browser โดยใช้ Rust CLI คำนวณ layout และ Solid frontend จัดการ state/pan/zoom

## Scope

ใช้เมื่อต้องการ visualize ความสัมพันธ์ระหว่าง entities เป็นกราฟใน browser รับข้อมูล `nodes`/`edges` จาก JSON แล้วสร้าง `index.html` พร้อมเปิดดู

## Execute

### 1. Build Rust Binary

> Goal: compile CLI จาก source ใน skill directory

1. ตรวจสอบ `Cargo.toml` และ `src/main.rs` ใน `%APPDATA%\devin\skills\visualize-to-graph-in-web`
2. รัน `cargo build --release` ใน skill directory
3. ยืนยันว่า binary อยู่ที่ `target/release/visualize-to-graph-in-web.exe`

### 2. Prepare Input Data

> Goal: สร้าง JSON ที่มี nodes และ edges

1. รับหรือสร้าง JSON ตามรูปแบบ:
   ```json
   {
     "nodes": [
       { "id": "a", "label": "A", "group": "skill" },
       { "id": "b", "label": "B", "group": "report" }
     ],
     "edges": [
       { "from": "a", "to": "b" }
     ]
   }
   ```
2. บันทึกลงไฟล์หรือส่งผ่าน stdin
3. ถ้าไม่มี input ให้ใช้ `check-skills-related` สร้าง graph ของ skills ก่อน

### 3. Run CLI

> Goal: สร้าง HTML จาก JSON

1. รัน `<skill-dir>/target/release/visualize-to-graph-in-web.exe <input.json> --output <output.html>`
2. หรือส่งผ่าน stdin: `cat graph.json | <binary> --output index.html`
3. ปรับ `--width`, `--height`, `--iterations` ตามต้องการ
4. รอ CLI แจ้ง path ของ HTML ที่สร้างเสร็จ

### 4. Open In Browser

> Goal: แสดงผล graph ใน browser

1. ทำ `/open-web` กับ path ของ HTML ที่ CLI สร้าง
2. หรือรัน `bunx serve <output-dir>` แล้วเปิด URL
3. ตรวจสอบว่า nodes/edges แสดงถูกต้อง พร้อม pan/zoom/click

### 5. Customize Output

> Goal: ปรับ UX ตาม context

1. แก้ไข `src/template.html` ถ้าต้องการเปลี่ยนสี ขนาด หรือ layout
2. แก้ไข `src/layout.rs` ถ้าต้องการเปลี่ยน force-directed parameters
3. rebuild ด้วย `cargo build --release` แล้วรันใหม่

## Rules

### 1. Input Format

- JSON ต้องมี `nodes` และ `edges`
- แต่ละ node ต้องมี `id` ไม่ซ้ำกัน
- edge ใช้ `from` และ `to` อ้างอิง `id` ของ node
- `label` และ `group` เป็น optional

### 2. Output

- default output คือ `index.html` ใน current directory
- HTML เป็น single file ไม่ต้อง build เพิ่ม
- graph data ถูก embed ใน HTML โดยตรง
- รองรับเปิดจาก `file://` หรือผ่าน HTTP server

### 3. Rust + Solid

- Rust ใช้สำหรับ parse JSON, คำนวณ layout, และ generate HTML
- Solid ใช้สำหรับ reactive state: `selected`, `hover`, `scale`, `offset`
- `template.html` โหลด `solid-js` จาก `esm.sh` แบบ no-build
- ไม่ต้องติดตั้ง `node_modules` สำหรับ frontend

### 4. Extending

- ถ้าต้องการ full build project ให้ใช้ `/visualize-project` หรือ `/visualize-devin-in-web`
- ถ้าต้องการ temp HTML อย่างเดียวให้ใช้ `/visualize-in-web`
- ถ้าต้องการ graph จาก skills ให้ใช้ `/check-skills-related` ก่อน

## Expected Outcome

- `target/release/visualize-to-graph-in-web.exe` build ผ่านและรันได้
- HTML แสดง graph ได้ด้วย pan, zoom, hover, click
- skill มี `src/` พร้อม Rust CLI และ Solid template
- สามารถเปิดดูใน browser ได้ทันทีหลังรัน CLI
