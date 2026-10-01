---
name: create-video-with-slidev
description: สร้างวิดีโอแนว visual interactive transition จาก Slidev deck ผ่าน slidev MCP + recording
argument-hint: "[topic-or-slides.md]"
related:
  - follow-create-slide-slidev
  - use-mcp
  - record-video-web-with-agents-browser
  - use-agent-browser
  - update-devin-global-mcp
  - gen-voice
  - gen-subtitle-video
  - convert-files-format
  - edit-video-with-remotion
  - create-programatic-video-with-fframes
  - report

---

## Goal

สร้างวิดีโอ presentation จาก Slidev deck ที่เน้น visual interactive transitions (slide transitions, click/motion animations, view transitions) โดยใช้ `slidev` MCP server จัดการ deck และบันทึก playback เป็นวิดีโอจริง

## Scope

- สร้างหรือ enhance `slides.md` ผ่าน `/follow-create-slide-slidev` — ทุก slide ต้องมี motion (ไม่ใช่ static deck)
- ใช้ `slidev` MCP server (`bunx slidev mcp slides.md` — ลงทะเบียนแล้วใน `%APPDATA%\devin\mcp_config.json` ผ่าน `/update-devin-global-mcp`) เพื่อ inspect, edit, reorder และ navigate slides
- บันทึกวิดีโอด้วย `/record-video-web-with-agents-browser` (agent-browser) ขณะ auto-advance deck จนจบ
- ทางเลือกนอก scope หลัก: วิดีโอ programmatic ขั้นสูง (multi-track, effects) → `/edit-video-with-remotion` หรือ `/create-programatic-video-with-fframes` แทน

## Execute

### 1. Plan Storyboard

> Goal: ได้แผนฉากและ transition ครบก่อนเขียน slide

1. รับ `topic` หรือ path ของ `slides.md` เดิมจาก user — ถ้ามี deck อยู่แล้วข้ามไปข้อ 3
2. ถาม `orientation` (`landscape 16:9` default), `duration` เป้าหมาย, `tone`, ภาษา, และว่าต้องการ voiceover หรือไม่
3. เขียน storyboard: 1 slide = 1 scene, ระบุต่อ slide — content, transition เข้า/ออก, click/motion beats, เวลาค้างจอวิเคราะห์ (dwell time ≥ เวลาที่ animation เล่นจบ)

### 2. Author Deck

> Goal: slides.md ที่ visual interactive transition ครบทุกหน้า

1. ทำ `/follow-create-slide-slidev` เพื่อสร้าง/แก้ `slides.md` (standalone หรือ `D:/newkub/slides/{project}/`)
2. ตั้ง headmatter: `transition` ต่อ slide (`slide-left`, `slide-up`, `fade-out`, `view-transition` — ใช้ `forward | backward` pair เมื่อทิศทางสำคัญ), `comark: true`, `fonts` ถ้าเนื้อหาไทย
3. ใส่ motion ทุก slide ตาม `### Animation Transitions` ของ `/follow-create-slide-slidev`: `v-click` presets, `v-motion` (initial/enter/click-N states), `v-switch` สำหรับ staged reveals, `clickAnimation` preset, `view-transition-name` สำหรับ shared-element morphs
4. เนื้อหาไทยใช้ `Noto Sans Thai`; ไม่เกิน 5 bullets ต่อ slide; ใช้ `layout: cover` เปิดและ `layout: end` ปิด

### 3. Verify Deck Via Slidev MCP

> Goal: deck ถูกต้องและ MCP drive ได้ก่อนบันทึก

1. เช็คว่า `slidev` server อยู่ใน `%APPDATA%\devin\mcp_config.json` — ไม่มี → ทำ `/update-devin-global-mcp` add `{ "command": "bunx", "args": ["slidev", "mcp", "slides.md"] }`
2. เรียก `mcp_list_tools` บน server `slidev` เพื่อดู tools จริง (inspect/edit/reorder/navigate) — ห้ามเดาชื่อ tool
3. stdio server ทำงานบน `slides.md` ใน cwd ที่ launch — ถ้า deck อยู่ path อื่นให้ส่ง path เต็มตอนเรียก tool หรือใช้ HTTP transport `http://localhost:3030/__mcp` ขณะ dev server รัน
4. ใช้ MCP tools ตรวจ slide count, order, click counts ต่อ slide → ได้ click budget สำหรับ recording

### 4. Run Dev Server

> Goal: deck render จริงพร้อม animations

1. รัน `bunx slidev <slides.md>` ที่ root ที่ถูกต้องตาม `/follow-create-slide-slidev` (port 3030 default) แบบ background
2. เปิด `http://localhost:3030` ยืนยัน transitions เล่นจริง — error → `/resolve-errors`
3. เช็ค `/check-open-ports` ถ้า port ชน

### 5. Record Playback

> Goal: วิดีโอที่จับทุก transition ครบ

1. ทำ `/record-video-web-with-agents-browser`: `agent-browser open http://localhost:3030 --headed`, `set viewport 1920 1080`, `wait --load networkidle`, แล้ว `record start <name>.webm`
2. Auto-advance ตาม click budget จากข้อ 3: `agent-browser click` บน slide area (หรือ key `ArrowRight`) ทีละ click — `agent-browser wait <ms>` ระหว่าง advance ให้ ≥ transition duration (default ~700ms ปลอดภัยใช้ 1200-1500ms)
3. ถ้า slidev MCP (HTTP `__mcp`) มี navigate tool → drive ผ่าน MCP แทน click ได้ deterministic กว่า
4. วนกลับจนถึง slide สุดท้ายแล้ว `agent-browser record stop` + `agent-browser close`

### 6. Post-Process

> Goal: ไฟล์ส่งมอบพร้อมใช้

1. default output `.webm` — ต้องการ `.mp4` → แปลงด้วย `ffmpeg -i in.webm -c:v libx264 -crf 20 out.mp4` หรือ `/convert-files-format`
2. voiceover → `/gen-voice` แล้ว mux ด้วย `ffmpeg -i video -i voice -c:v copy -shortest out.mp4`
3. subtitle → `/gen-subtitle-video` จากไฟล์วิดีโอสุดท้าย

### 7. Report

> Goal: สรุปผลและ path ไฟล์

1. ทำ `/report`: slide count, transitions ที่ใช้, click beats, duration, output paths (`.webm`/`.mp4`/`.srt`)
2. ระบุส่วนที่ยังทำได้ เช่น ship deck เป็น static site ผ่าน `slidev build`

## Rules

### 1. Motion Required

- ทุก slide ต้องมี motion อย่างน้อย 1 อย่าง — slide transition, `v-click` reveal, หรือ `v-motion`; deck static ถือว่า fail
- ใช้ transition หลากหลายแต่ coherent — เลือก family เดียว (เช่น slide-* ทั้ง deck) เว้น section break ใช้ `fade`/`view-transition`
- dwell time ต่อ click ≥ animation duration เสมอ ไม่งั้นวิดีโอตัด motion กลางคัน

### 2. MCP Usage

- `mcp_list_tools` ก่อนเสมอ — tool surface ของ `slidev mcp` เปลี่ยนตามเวอร์ชัน
- `slides.md` ใน args ของ config เป็น relative — stdio server bind กับ cwd ที่ agent launch, deck อยู่ project อื่นให้ใช้ HTTP `__mcp` หรือเช็ค cwd ก่อน
- แก้ `slides.md` ผ่าน MCP เมื่อเป็นไปได้ (SSOT) — edit มือเฉพาะที่ MCP ไม่ครอบ

### 3. Recording

- บันทึก `--headed` และ viewport 1920x1080 เสมอ ตาม `/record-video-web-with-agents-browser`
- advance แบบ deterministic — 1 action = 1 click state; อย่า rely บน timing ลอยๆ
- deck ยาว → แบ่ง record เป็นหลายไฟล์ตาม section แล้ว concat ด้วย ffmpeg

### 4. Safety

- ไม่ overwrite `slides.md`/video เดิมโดยไม่ถาม — สำรองหรือใช้ชื่อไฟล์ index
- ไม่ commit ไฟล์วิดีโอขนาดใหญ่เข้า git

- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /use-mcp ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Expected Outcome

- `slides.md` ที่ทุก slide มี visual interactive transition ผ่านการ verify ด้วย slidev MCP
- ไฟล์วิดีโอ `.webm` (และ `.mp4` ถ้าแปลง) จับ motion ครบทุก beat
- รายงาน output paths, duration, และ transitions ที่ใช้
