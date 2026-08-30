---
name: capture-web
description: Capture ภาพหน้าเว็บด้วย agent-browser CLI
argument-hint: "[url]"
related:
  - follow-tool-agent-browser
  - resolve-errors
---

## Goal

Capture ภาพหน้าเว็บ (screenshot, PDF) ด้วย `agent-browser` CLI สำหรับ documentation, debugging และ testing

## Scope

ใช้สำหรับ capture ภาพหน้าเว็บ ถ่ายภาพ annotated screenshot และ save เป็น PDF ด้วย `agent-browser` CLI

## Execute

### 1. Install And Verify

> Goal: Install And Verify

ติดตั้งและตรวจสอบ `agent-browser` ตาม `/follow-tool-agent-browser` ข้อ 1

1. ตรวจสอบด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun add -g agent-browser` แล้ว `agent-browser install`

### 2. Open Browser

> Goal: Open Browser

เปิด browser ไปยัง URL ที่ต้องการ capture ตาม `/follow-tool-agent-browser` ข้อ 2

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser
2. รอให้ page load เสร็จด้วย `agent-browser wait --load networkidle`

### 3. Take Screenshot

> Goal: Take Screenshot

ถ่ายภาพหน้าเว็บตาม ## Rules ข้อ 1

1. ใช้ `agent-browser screenshot` สำหรับ screenshot ปกติ (save ไป temp directory)
2. ใช้ `agent-browser screenshot <path>.png` สำหรับ save ไป path ที่กำหนด
3. ใช้ `agent-browser screenshot --full` สำหรับ full-page screenshot
4. ใช้ `agent-browser screenshot --annotate` สำหรับ annotated screenshot พร้อม element labels

### 4. Save As PDF

> Goal: Save As PDF

Save หน้าเว็บเป็น PDF

1. ใช้ `agent-browser pdf <path>.pdf` สำหรับ save เป็น PDF
2. ระบุ path ชัดเจน เช่น `./docs/page.pdf`

### 5. Annotated Screenshot For Debugging

> Goal: Annotated Screenshot For Debugging

ใช้ annotated screenshot สำหรับ debugging และ AI analysis

1. ใช้ `agent-browser screenshot --annotate` สำหรับภาพพร้อม numbered labels
2. แต่ละ label `[N]` สอดคล้องกับ ref `@eN` สำหรับ interact ต่อได้ทันที
3. ใช้ `agent-browser snapshot -i` ควบคู่กันเพื่อดู refs ใน text format

### 6. Configure Screenshot Options

> Goal: Configure Screenshot Options

ตั้งค่า screenshot options ตาม ## Rules ข้อ 2

1. ใช้ `--screenshot-dir <path>` สำหรับกำหนด output directory
2. ใช้ `--screenshot-format jpeg` สำหรับ JPEG format (default: PNG)
3. ใช้ `--screenshot-quality <0-100>` สำหรับ JPEG quality (default: 80)

### 7. Cleanup And Close

> Goal: Cleanup And Close

ทำ cleanup หลัง capture เสร็จ

1. ปิด browser ด้วย `agent-browser close`
2. ตรวจสอบไฟล์ที่ capture
3. สรุปผลลัพธ์และ path ของไฟล์

## Rules

### 1. Screenshot Types

- ใช้ `agent-browser screenshot` สำหรับ screenshot ปกติ (viewport เท่านั้น)
- ใช้ `agent-browser screenshot --full` สำหรับ full-page screenshot
- ใช้ `agent-browser screenshot --annotate` สำหรับ annotated screenshot พร้อม element labels
- ใช้ `agent-browser screenshot <path>` สำหรับ save ไป path ที่กำหนด
- ถ้าไม่ระบุ path จะ save ไป temp directory ที่ `~/.agent-browser/tmp/screenshots/`

### 2. Screenshot Options

- ใช้ `--screenshot-dir <path>` สำหรับกำหนด default output directory
- ใช้ `--screenshot-format <fmt>` สำหรับ format: `png` (default) หรือ `jpeg`
- ใช้ `--screenshot-quality <0-100>` สำหรับ JPEG quality (เฉพาะ JPEG)
- ใช้ environment variables `AGENT_BROWSER_SCREENSHOT_DIR`, `AGENT_BROWSER_SCREENSHOT_FORMAT`, `AGENT_BROWSER_SCREENSHOT_QUALITY` สำหรับ config ถาวร

### 3. PDF Output

- ใช้ `agent-browser pdf <path>.pdf` สำหรับ save เป็น PDF
- ระบุ path ชัดเจนเสมอ
- เหมาะสำหรับ documentation และ archiving

### 4. Annotated Screenshots

- ใช้ `--annotate` สำหรับ overlay numbered labels บน interactive elements
- แต่ละ label `[N]` สอดคล้องกับ ref `@eN` สำหรับ interact ต่อได้ทันที
- refs ถูก cached หลัง annotated screenshot ทำให้ interact ได้โดยไม่ต้อง snapshot ใหม่
- ใช้ควบคู่กับ `agent-browser snapshot -i` สำหรับ debugging ที่ครบถ้วน

### 5. File Management

- เก็บไฟล์ใน `test/screenshots/` หรือ `docs/screenshots/`
- ตั้งชื่อไฟล์ตาม page หรือ test case เช่น `login-page.png`, `checkout-error.png`
- ใช้ `--screenshot-dir` สำหรับกำหนด output directory ถาวร
- ลบไฟล์เก่าก่อน capture ใหม่ถ้าไม่ต้องการเก็บ history

### 6. Error Handling

- ถ้า `agent-browser` ไม่ติดตั้ง ให้ทำตาม `/follow-tool-agent-browser` ข้อ 8 (fallback)
- ถ้า screenshot ไม่ออก ให้ตรวจสอบว่า browser เปิดอยู่
- เรียก `/resolve-errors` เมื่อเจอ error
- ใช้ `agent-browser wait --load networkidle` ก่อน screenshot เพื่อให้ page load สมบูรณ์

## Expected Outcome

- ภาพ screenshot ครอบคลุมทั้ง viewport และ full-page
- Annotated screenshots แสดง element labels สำหรับ debugging
- ไฟล์ PDF สำหรับ documentation
- ไฟล์จัดเก็บอย่างเป็นระบบใน path ที่กำหนด
- ปิด browser และ cleanup หลัง capture เสร็จ