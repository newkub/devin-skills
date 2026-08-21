---
name: record-terminal
description: บันทึกวิดีโอและ session จาก terminal สำหรับ CLI testing
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - watch-terminal
  - resolve-errors
  - run-dev
---

## Goal

บันทึก terminal session เป็นวิดีโอหรือ text-based format สำหรับ CLI testing, demo และ documentation

## Scope

ใช้สำหรับ workflows ที่ต้องการบันทึก terminal sessions เช่น `/run-dev`, `/watch-terminal`

## Execute

### 1. Analyze Requirements
> Goal: Analyze Requirements

วิเคราะห์ความต้องการก่อนเลือก tool

1. ต้องการ format อะไร: text-based (`.cast`), GIF, หรือ video
2. ต้องการ automation หรือ manual recording
3. ต้องการ embed ใน HTML หรือเป็นไฟล์ standalone
4. ต้องการใช้ใน CI/CD หรือเฉพาะ local

### 2. Select Tool
> Goal: Select Tool

เลือก tool ตาม use case ตาม ## Rules ข้อ 1

1. asciinema: text-based `.cast` format, ไฟล์เล็ก, แก้ไขได้, เหมาะสำหรับ CI/CD
2. vhs: video/GIF จาก config file, เหมาะสำหรับ automated recording
3. terminalizer: GIF พร้อมปรับแต่ง style, เหมาะสำหรับ demo
4. tuirec: animated GIF จาก keystroke script, เหมาะสำหรับ TUI testing

### 3. Install Tool
> Goal: Install Tool

ติดตั้ง tool ที่เลือก

1. ติดตั้ง asciinema ด้วย `bun install -g asciinema`
2. ติดตั้ง vhs ด้วย `bun install -g vhs`
3. ติดตั้ง terminalizer ด้วย `bun install -g terminalizer`
4. ติดตั้ง tuirec ด้วย `go install github.com/gui-cs/tuirec/cmd/tuirec@latest`

### 4. Record Session
> Goal: Record Session

บันทึก terminal session ตาม tool ที่เลือก

1. ใช้ asciinema: `asciinema rec <path>.cast --command "<command>"`
2. ใช้ vhs: เขียน `.tape` config file แล้วรัน `vhs <path>.tape`
3. ใช้ terminalizer: `terminalizer record <name>` แล้ว `terminalizer render <name> -o <path>.gif`
4. ใช้ tuirec: `tuirec record --binary <app> --keystrokes "<keys>" --output <path>.gif`

### 5. Verify Recording
> Goal: Verify Recording

ตรวจสอบไฟล์ที่บันทึก

1. ตรวจสอบว่าไฟล์ถูกสร้างที่ path ที่ระบุ
2. เปิดดูไฟล์เพื่อยืนยันการบันทึก
3. ตรวจสอบขนาดไฟล์ว่าไม่ใหญ่เกินไป

## Rules

### 1. Tool Selection

- CI/CD integration: ใช้ `asciinema` เพราะ text-based, ไฟล์เล็ก, แก้ไขได้
- Automated recording: ใช้ `vhs` เพราะใช้ config file ควบคุมได้
- Demo presentation: ใช้ `terminalizer` เพราะ visual appeal พรับปรับ style
- TUI testing: ใช้ `tuirec` เพราะรองรับ keystroke script และ TUI apps
- Quick recording: ใช้ `asciinema` เพราะเริ่มได้ทันที

### 2. File Management

- เก็บไฟล์ใน `test/recordings/` หรือ `docs/recordings/`
- ตั้งชื่อไฟล์ตาม test case เช่น `cli-help.cast`, `login-flow.gif`
- ลบไฟล์เก่าก่อนบันทึกใหม่เพื่อหลีกเลี่ยง confusion
- ไม่ commit ไฟล์ขนาดใหญ่เข้า git

### 3. Quality Standards

- ตั้งค่า terminal size ที่เหมาะสม (80x24 หรือ 120x30)
- ใช้ font monospace ที่อ่านง่าย
- หลีกเลี่ยง recording ที่ยาวเกินไป แบ่งเป็นส่วนถ้าจำเป็น
- ใช้ `--idle-time-limit` ใน asciinema เพื่อตัดช่วง idle

### 4. Integration With Workflows

- เรียก `/record-terminal` ใน workflows ที่ต้องการบันทึก
- ใช้ใน `/run-dev` สำหรับบันทึก development sessions
- ใช้ใน `/watch-terminal` สำหรับ monitoring

### 5. Error Handling

- เรียก `/resolve-errors` เมื่อเจอ error
- ตรวจสอบว่า tool ที่เลือกติดตั้งแล้วก่อนใช้งาน
- ตรวจสอบ disk space ก่อนบันทึก
- ถ้า tool ไม่รองรับ Windows ให้เลือก tool อื่น

## Expected Outcome

- เลือก tool ที่เหมาะสมกับ use case
- Terminal sessions บันทึกได้อย่างมีประสิทธิภาพ
- ไฟล์จัดเก็บอย่างเป็นระบบ
- ผนวกกับ workflows อื่นได้อย่างราบรื่น
