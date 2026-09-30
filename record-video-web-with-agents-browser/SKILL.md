---
name: record-video-web-with-agents-browser
description: บันทึกวิดีโอ WebM/MP4 จากหน้าเว็บด้วย `agent-browser record` CLI
argument-hint: "[url]"
related:
  - use-agent-browser
  - record-video-terminal-with-asciinema
  - capture
  - resolve-errors
---

## Goal

บันทึกวิดีโอ WebM หรือ MP4 จากหน้าเว็บด้วย `agent-browser record` สำหรับ debugging, CI evidence, product walkthroughs และ repro reports — ตาม https://agent-browser.dev/recording

## Scope

ใช้สำหรับบันทึกวิดีโอการใช้งานหน้าเว็บ, demo และ record test scenarios ด้วย `agent-browser` CLI (recording pipes frames เข้า `ffmpeg` — `agent-browser` ส่วนอื่นไม่ต้องใช้ ffmpeg)

## Execute

### 1. Install And Verify

> Goal: agent-browser + ffmpeg พร้อมใช้งาน

1. ติดตั้ง/ตรวจ `agent-browser` ตาม `/use-agent-browser` ข้อ 1 — ถ้ายังไม่มี: `bun add -g agent-browser` แล้ว `agent-browser install`
2. ตรวจ `ffmpeg` บน `PATH` ด้วย `agent-browser doctor` — รายงาน encoders ใต้ "Recording" ต้องมี `libvpx` และ `libx264`
3. ถ้า ffmpeg ขาด → ติดตั้งด้วย package manager ของ OS (เช่น `winget install ffmpeg`, `scoop install ffmpeg`, `brew install ffmpeg`, `sudo apt install ffmpeg`)

### 2. Choose Output Format

> Goal: เลือก container ตาม use case

1. `.webm` — VP8 via libvpx (default ของ web evidence)
2. `.mp4` — H.264 via libx264 (แชร์เล่นได้ทุก player)
3. extension อื่น (`.mkv`, `.mov`) — ส่งให้ ffmpeg เป็น H.264 ใน container นั้น
4. path ไม่มี extension → `record start` reject ทันที เพราะ ffmpeg เลือก container ไม่ได้

### 3. Open And Start Recording

> Goal: เริ่มบันทึกบน tab ที่ต้องการ

1. เปิด browser: `agent-browser open <url> --headed` แล้วรอ `agent-browser wait --load networkidle`
2. เริ่มบันทึก: `agent-browser record start <path>.webm` — บันทึก active page ตามสภาพ (hydrated state, session/cookies คงอยู่)
3. หรือเริ่มพร้อม navigate: `agent-browser open` แล้ว `agent-browser record start <path>.webm <url>` — tab ปัจจุบัน navigate ก่อน เริ่มบันทึกเมื่อ page loaded
4. บันทึกใน tab แยก: `agent-browser tab new <url>` แล้ว `agent-browser record start <path>.webm`
5. options เสริม (ตาม Rules ข้อ 2-3): `--fps <1-60>`, `--cursor`, `--contact-sheet [--contact-sheet-threshold <0-1>]`

### 4. Perform Actions

> Goal: ทำ actions ที่ต้องการบันทึก

1. ใช้ `agent-browser snapshot -i` เพื่อดู interactive elements และ refs
2. ใช้ `agent-browser click @e1`, `agent-browser fill @e2 "text"`, `agent-browser scroll down 500`
3. ใช้ `agent-browser wait <ms>` หน่วงระหว่าง actions ให้วิดีโออ่านง่าย (demo สำหรับคน → wait 500ms ระหว่าง steps)
4. ใช้ `agent-browser screenshot <path>.png` ควบคู่ — screenshot เก็บ still state แม่นยำ, video แสดง timing/transitions/overlays

### 5. Stop Recording

> Goal: หยุดและ flush ไฟล์ก่อนปิด session

1. ใช้ `agent-browser record stop` — รายงาน `frames` ที่เขียนลงไฟล์และ `capturedFrames` จาก Chrome
2. `record stop` ต้องทำก่อน `close` ทุกครั้งเพื่อให้ไฟล์ flush ครบ
3. บันทึกต่อทันที: `agent-browser record restart <path>.webm [url] [options]` — หยุดของเดิมแล้วเริ่มอันใหม่
4. ปิด browser ด้วย `agent-browser close` แล้วรายงาน path ไฟล์

## Rules

### 1. Video Format

- ตั้ง extension ชัดเจนเสมอ (`.webm` หรือ `.mp4`) — path ไม่มี extension ถูก reject
- เก็บใน `test/recordings/` หรือ `docs/recordings/`; ชื่อตาม scenario เช่น `login-flow.webm`
- ไม่ commit ไฟล์วิดีโอขนาดใหญ่เข้า git

### 2. Frame Rate And Options

| Option | เมื่อไหร่ |
|--------|----------|
| `--fps 60` | drag/animation/scroll polish — คลิปสั้นที่ต้องการ evidence ต่อ frame (bitrate ~2x ของ 30) |
| `--fps 30` (default) | flows, CI evidence, walkthroughs ทั่วไป |
| `--fps 1-15` | soak/long sessions ที่ video เป็น timeline มากกว่า motion |
| `--cursor` | walkthrough — animated pointer + click ripple (overlay inert, ซ่อนจาก a11y snapshot, ลบเมื่อ stop; screenshots ระหว่าง record มีด้วย) |
| `--contact-sheet` | ต้องการ PNG timestamped ที่ highlight การเปลี่ยนแปลง (สูงสุด 100 frames) |
| `--contact-sheet-threshold <0-1>` | default 0.05 — เลือก frame เมื่อ pixel เปลี่ยนเกิน threshold; imply `--contact-sheet` |

### 3. Recording Workflow

- `record start` บันทึก active page as-is — ไม่สร้าง tab/context ใหม่; cookies/localStorage คงอยู่
- fps จริงถูกจำกัดด้วย repaint rate ของหน้า — หน้าที่ render < 60 fps จะได้วิดีโอ < 60 fps
- Chrome frame ล่าสุดถูก hold ระหว่าง repaints ทำให้ duration ตรง wall clock
- viewport ตาม browser settings ปัจจุบัน — ตั้งก่อนบันทึกด้วย `agent-browser set viewport <w> <h>`

### 4. CI Evidence Pattern

```bash
#!/bin/bash
set -e
cleanup() {
  agent-browser record stop 2>/dev/null || true
  agent-browser close 2>/dev/null || true
}
trap cleanup EXIT

agent-browser open https://app.example.com/login
agent-browser record start "./artifacts/login-flow.webm"
agent-browser snapshot -i
agent-browser fill @e1 "demo@example.com"
agent-browser click @e3
agent-browser wait --url "**/dashboard"
```

- เก็บ recordings เป็น CI artifacts เมื่อ browser failures วินิจฉัยจาก text output ไม่ได้
- ใช้ `trap cleanup EXIT` เพื่อ flush ไฟล์เสมอ

### 5. Limitations And Errors

- recording เพิ่ม overhead ต่อ automation — fps สูงยิ่งหนัก; คลิปยาวกิน disk (60 fps ≈ 2x bitrate)
- headless ที่จำกัดอาจขาด codec/GPU — `agent-browser doctor` บอก encoders ที่มี
- ffmpeg ที่ build ไม่มี `libvpx`/`libx264` → เขียน format นั้นไม่ได้
- `agent-browser` ไม่ติดตั้ง → `/use-agent-browser` fallback; error อื่น → `/resolve-errors`
- ตรวจ disk space ก่อนบันทึกยาว

## Expected Outcome

- วิดีโอ WebM/MP4 บันทึกการใช้งานหน้าเว็บครบ actions ที่ต้องการ
- ไฟล์ flush ครบก่อนปิด session และจัดเก็บอย่างเป็นระบบ
- เลือก fps/options (`--cursor`, `--contact-sheet`) ตรง use case
- ใช้ CI evidence pattern ได้ reproducible
