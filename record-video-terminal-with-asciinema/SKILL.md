---
name: record-video-terminal-with-asciinema
description: บันทึก terminal session เป็นวิดีโอ/`.cast` ด้วย asciinema สำหรับ CLI testing
argument-hint: "[scope]"
related:
  - run-dev
  - watch-terminal
  - record-video-web-with-agents-browser
  - resolve-errors
---

## Goal

บันทึก terminal session ด้วย `asciinema` เป็น `.cast` (text-based) หรือแปลงเป็นวิดีโอ สำหรับ CLI testing, demo และ documentation

## Scope

ใช้สำหรับ workflows ที่ต้องการบันทึก terminal sessions เช่น `/run-dev`, `/watch-terminal` — `asciinema` เป็น primary tool; tools อื่น (`vhs`, `terminalizer`, `tuirec`) เป็น alternative ตาม Rules ข้อ 1

## Execute

### 1. Analyze Requirements

> Goal: Analyze Requirements

วิเคราะห์ความต้องการก่อนเลือก output

1. ต้องการ format อะไร: text-based (`.cast`), GIF, หรือ video
2. ต้องการ automation หรือ manual recording
3. ต้องการ embed ใน HTML หรือเป็นไฟล์ standalone
4. ต้องการใช้ใน CI/CD หรือเฉพาะ local

### 2. Install Asciinema

> Goal: Install Asciinema

ติดตั้ง `asciinema` (primary tool)

1. ติดตั้งด้วย `cargo install asciinema` หรือ `scoop install asciinema` — ไม่มีบน npm (verified 2026-09-12)
2. ตรวจสอบด้วย `asciinema --version`
3. ถ้าต้องการ GIF/MP4 จาก `.cast` → ติดตั้ง `agg` (asciinema gif generator) ด้วย `cargo install agg`

### 3. Record Session

> Goal: Record Session

บันทึก terminal session ด้วย `asciinema`

1. บันทึกแบบกำหนด command: `asciinema rec <path>.cast --command "<command>"`
2. บันทึก interactive session: `asciinema rec <path>.cast` แล้วพิมพ์ `exit` เมื่อเสร็จ
3. จำกัดช่วง idle: เพิ่ม `--idle-time-limit <seconds>` หรือตั้งเป็น env `ASCIINEMA_IDLE_TIME_LIMIT`
4. กำหนดขนาด terminal: `--cols <n> --rows <n>` (แนะนำ 80x24 หรือ 120x30)
5. แปลง `.cast` เป็น GIF: `agg <path>.cast <path>.gif`

### 4. Verify Recording

> Goal: Verify Recording

ตรวจสอบไฟล์ที่บันทึก

1. ตรวจสอบว่าไฟล์ถูกสร้างที่ path ที่ระบุ
2. เล่นกลับด้วย `asciinema play <path>.cast` เพื่อยืนยันการบันทึก
3. ตรวจสอบขนาดไฟล์ว่าไม่ใหญ่เกินไป

## Rules

### 1. Tool Selection

- Default/CI/CD/Quick: ใช้ `asciinema` — text-based `.cast`, ไฟล์เล็ก, แก้ไขได้, diff ได้
- Automated recording จาก config: ใช้ `vhs` (`go install github.com/charmbracelet/vhs@latest` หรือ `winget install charmbracelet.vhs` — npm `vhs` เป็นคนละ package, verified 2026-09-12)
- Demo ต้องการ style: ใช้ `terminalizer` (`bun add -g terminalizer`, `terminalizer@0.12.0`, verified 2026-09-12)
- TUI app ต้องการ keystroke script: ใช้ `tuirec` (`go install github.com/gui-cs/tuirec/cmd/tuirec@latest`)

### 2. File Management

- เก็บไฟล์ใน `test/recordings/` หรือ `docs/recordings/`
- ตั้งชื่อไฟล์ตาม test case เช่น `cli-help.cast`, `login-flow.gif`
- ลบไฟล์เก่าก่อนบันทึกใหม่เพื่อหลีกเลี่ยง confusion
- ไม่ commit ไฟล์ขนาดใหญ่เข้า git (เก็บ `.cast` ได้เพราะเล็ก)

### 3. Quality Standards

- ตั้งค่า terminal size ที่เหมาะสม (80x24 หรือ 120x30) ด้วย `--cols`/`--rows`
- ใช้ font monospace ที่อ่านง่าย
- หลีกเลี่ยง recording ที่ยาวเกินไป แบ่งเป็นส่วนถ้าจำเป็น
- ใช้ `--idle-time-limit` เพื่อตัดช่วง idle

### 4. Integration With Workflows

- เรียก `/record-video-terminal-with-asciinema` ใน workflows ที่ต้องการบันทึก
- ใช้ใน `/run-dev` สำหรับบันทึก development sessions
- ใช้ใน `/watch-terminal` สำหรับ monitoring
- บันทึกหน้าเว็บ → `/record-video-web-with-agents-browser`

### 5. Error Handling

- เรียก `/resolve-errors` เมื่อเจอ error
- ตรวจสอบว่า tool ที่เลือกติดตั้งแล้วก่อนใช้งาน
- ตรวจสอบ disk space ก่อนบันทึก
- ถ้า tool ไม่รองรับ Windows ให้เลือก tool อื่น

## Expected Outcome

- บันทึก terminal session ด้วย `asciinema` สำเร็จ
- ไฟล์จัดเก็บอย่างเป็นระบบ
- เลือก alternative tool ได้ถูกต้องเมื่อ `asciinema` ไม่ตอบโจทย์
- ผนวกกับ workflows อื่นได้อย่างราบรื่น
