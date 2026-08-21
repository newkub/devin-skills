---
name: capture-terminal
description: Capture ภาพจาก terminal output สำหรับ documentation
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

Capture ภาพ (screenshot) จาก terminal output สำหรับ documentation, README และ test reports

## Scope

ใช้สำหรับ workflows ที่ต้องการ capture terminal output เป็นภาพ PNG, SVG หรือ HTML

## Execute

### 1. Analyze Requirements

วิเคราะห์ความต้องการก่อนเลือก tool

1. ต้องการ format อะไร: PNG, SVG หรือ HTML
2. ต้องการ capture จาก command output หรือ text ที่มีอยู่แล้ว
3. ต้องการ theme หรือ style พิเศษหรือไม่
4. ต้องการใช้ใน CI/CD หรือเฉพาะ local

### 2. Select Tool

เลือก tool ตาม use case ตาม ## Rules ข้อ 1

1. termshot: PNG จาก command output, รองรับ tmux, เหมาะสำหรับ CI/CD
2. terminal-shot: PNG/SVG/HTML พร้อม themes, เหมาะสำหรับ documentation
3. termframe: SVG จาก command output, auto-sizing, เหมาะสำหรับ precise output
4. Windows Snipping Tool: screenshot ด่วนด้วย `Win + Shift + S`

### 3. Install Tool

ติดตั้ง tool ที่เลือก

1. ติดตั้ง termshot: ดาวน์โหลดจาก GitHub releases ของ `mr-pmillz/termshot`
2. ติดตั้ง terminal-shot: `bun install -g terminal-shot`
3. ติดตั้ง termframe: `scoop install termframe` หรือดาวน์โหลดจาก GitHub releases ของ `pamburus/termframe`
4. Windows Snipping Tool: มีอยู่แล้วใน Windows

### 4. Capture Screenshot

Capture terminal output ตาม tool ที่เลือก

1. ใช้ termshot: `termshot <command>` หรือ `termshot --raw-read < file.txt`
2. ใช้ terminal-shot: `terminal-shot --output <path>.png --theme dark --title "Title"`
3. ใช้ termframe: `termframe -o <path>.svg -- <command>` หรือ `echo "text" | termframe -o <path>.svg`
4. ใช้ Windows Snipping Tool: กด `Win + Shift + S` แล้วเลือกพื้นที่

### 5. Configure Output

ตั้งค่า output ตาม ## Rules ข้อ 2

1. ระบุ output path ชัดเจน
2. เลือก format ที่เหมาะสม (PNG สำหรับ raster, SVG สำหรับ vector)
3. เลือก theme ถ้า tool รองรับ
4. ตั้งค่า window chrome, title, subtitle ถ้าต้องการ

### 6. Verify Output

ตรวจสอบไฟล์ที่ capture

1. ตรวจสอบว่าไฟล์ถูกสร้างที่ path ที่ระบุ
2. เปิดดูไฟล์เพื่อยืนยันคุณภาพ
3. ตรวจสอบว่า text อ่านได้ชัดเจน

## Rules

### 1. Tool Selection

- CI/CD pipelines: ใช้ `termshot` เพราะรองรับ `--raw-read` สำหรับ piped output
- Documentation: ใช้ `terminal-shot` เพราะมี themes และ window chrome
- Precise SVG output: ใช้ `termframe` เพราะ auto-sizing และ SVG vector format
- Quick screenshot: ใช้ `Windows Snipping Tool` (`Win + Shift + S`) เพราะเร็วที่สุด
- README images: ใช้ `terminal-shot` เพราะ themes สวยและ export หลาย format

### 2. Output Configuration

- ใช้ PNG สำหรับ raster images (เหมาะสำหรับ web)
- ใช้ SVG สำหรับ vector images (เหมาะสำหรับ print และ scaling)
- ใช้ HTML สำหรับ interactive documentation
- ระบุ output path ชัดเจนเสมอ
- เลือก theme ที่อ่านง่าย: `dark`, `catppuccin`, `tokyo-night`, `github-dark`

### 3. File Management

- เก็บไฟล์ใน `docs/screenshots/` หรือ `test/screenshots/`
- ตั้งชื่อไฟล์ตาม command หรือ test case เช่น `cli-help.png`, `test-output.svg`
- ลบไฟล์เก่าก่อน capture ใหม่ถ้าไม่ต้องการเก็บ history
- Commit ไฟล์ PNG/SVG เข้า git ได้เพราะขนาดเล็ก

### 4. Quality Standards

- ตั้งค่า terminal size ที่เหมาะสม (80x24 หรือ 120x30)
- ใช้ font monospace ที่อ่านง่าย
- ใช้ theme ที่มี contrast ดีระหว่าง text และ background
- หลีกเลี่ยง capture ที่ยาวเกินไป ใช้ `--max-height` ถ้า tool รองรับ

### 5. Error Handling

- เรียก `/resolve-errors` เมื่อเจอ error
- ตรวจสอบว่า tool ที่เลือกติดตั้งแล้วก่อนใช้งาน
- ถ้า tool ไม่รองรับ Windows ให้เลือก tool อื่น
- ถ้า PNG export ต้องการ Chromium ให้ตรวจสอบว่าติดตั้งแล้ว

## Expected Outcome

- ภาพ screenshot จาก terminal output คุณภาพสูง
- ไฟล์จัดเก็บอย่างเป็นระบบใน path ที่กำหนด
- Theme และ style ที่อ่านง่ายเหมาะสำหรับ documentation
- ผนวกกับ workflows อื่นได้อย่างราบรื่น
