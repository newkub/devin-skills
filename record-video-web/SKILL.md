---
name: record-video-web
description: บันทึกวิดีโอจากหน้าเว็บด้วย agent-browser CLI
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related: []
---
## Goal

บันทึกวิดีโอ WebM จากหน้าเว็บด้วย `agent-browser` CLI สำหรับ demo, documentation และ testing

## Scope

ใช้สำหรับบันทึกวิดีโอการใช้งานหน้าเว็บ การทำ demo และการ record test scenarios ด้วย `agent-browser` CLI

## Execute

### 1. Install And Verify
> Goal: Install And Verify

ติดตั้งและตรวจสอบ `agent-browser` ตาม `/follow-agent-browser` ข้อ 1

1. ตรวจสอบด้วย `agent-browser --help`
2. ถ้าไม่ได้ติดตั้ง ให้ติดตั้งด้วย `bun install -g agent-browser` แล้ว `agent-browser install`

### 2. Open Browser
> Goal: Open Browser

เปิด browser ไปยัง URL ที่ต้องงานบันทึก ตาม `/follow-agent-browser` ข้อ 2

1. ใช้ `agent-browser open <url> --headed` เพื่อเปิด browser แบบมองเห็นหน้าต่าง
2. รอให้ page load เสร็จด้วย `agent-browser wait --load networkidle`

### 3. Start Recording
> Goal: Start Recording

เริ่มบันทึกวิดีโอ

1. ใช้ `agent-browser record start <path>.webm` เพื่อเริ่มบันทึก
2. ระบุ path ที่ต้องการบันทึก เช่น `./demo.webm` หรือ `test/recordings/login-flow.webm`
3. ถ้าต้องการบันทึกพร้อมเปิด URL ใหม่ ใช้ `agent-browser record start <path>.webm <url>`

### 4. Perform Actions
> Goal: Perform Actions

ทำ actions ที่ต้องการบันทึก ตาม `/follow-agent-browser` ข้อ 4

1. ใช้ `agent-browser snapshot -i` เพื่อดู interactive elements และ refs
2. ใช้ `agent-browser click @e1` สำหรับคลิก
3. ใช้ `agent-browser fill @e2 "text"` สำหรับกรอกข้อมูล
4. ใช้ `agent-browser scroll down 500` สำหรับเลื่อนหน้า
5. ใช้ `agent-browser wait 2000` ถ้าต้องการหน่วงเวลาระหว่าง actions

### 5. Stop Recording
> Goal: Stop Recording

หยุดบันทึกและบันทึกไฟล์

1. ใช้ `agent-browser record stop` เพื่อหยุดบันทึกและ save ไฟล์
2. ตรวจสอบว่าไฟล์ถูกสร้างที่ path ที่ระบุ

### 6. Restart Recording (Optional)
> Goal: Restart Recording (Optional)

ถ้าต้องการบันทึกใหม่อีกครั้ง

1. ใช้ `agent-browser record restart <path>.webm` เพื่อหยุด recording ปัจจุบันและเริ่มใหม่
2. ทำ actions ใหม่ตามข้อ 4
3. ใช้ `agent-browser record stop` เพื่อหยุด

### 7. Cleanup And Close
> Goal: Cleanup And Close

ทำ cleanup หลังบันทึกเสร็จ

1. ปิด browser ด้วย `agent-browser close`
2. ตรวจสอบไฟล์วิดีโอที่บันทึก
3. สรุปผลลัพธ์และ path ของไฟล์

## Rules

### 1. Video Format

- ไฟล์ output เป็น format WebM (VP8/VP9 codec)
- กำหนด path ของไฟล์ชัดเจน เช่น `./recordings/demo.webm`
- ไฟล์ compressed แต่คุณภาพสูง ใช้กับ modern browsers และ video players ได้ทั้งหมด
- ไม่ support format อื่นนอกจาก WebM

### 2. Recording Workflow

- เปิด browser ก่อนเริ่ม recording เสมอ
- ใช้ `--headed` เพื่อให้เห็นการบันทึกแบบ real-time
- รอ page load เสร็จก่อนเริ่ม recording ด้วย `agent-browser wait --load networkidle`
- ใช้ `agent-browser wait <ms>` ระหว่าง actions เพื่อให้วิดีโอดูเป็นธรรมชาติ
- recording สร้าง fresh browser context แต่ preserve cookies และ localStorage

### 3. File Management

- เก็บไฟล์ใน `test/recordings/` หรือ `docs/recordings/`
- ตั้งชื่อไฟล์ตาม scenario เช่น `login-flow.webm`, `checkout-process.webm`
- ลบไฟล์เก่าก่อนบันทึกใหม่ถ้าไม่ต้องการเก็บ history
- ไม่ commit ไฟล์วิดีโอขนาดใหญ่เข้า git

### 4. Error Handling

- ถ้า `agent-browser` ไม่ติดตั้ง ให้ทำตาม `/follow-agent-browser` ข้อ 8 (fallback)
- ถ้า recording ไม่ทำงาน ให้ตรวจสอบว่า browser เปิดอยู่
- เรียก `/resolve-errors` เมื่อเจอ error
- ตรวจสอบ disk space ก่อนบันทึก

### 5. Quality

- ใช้ `--headed` เพื่อเห็นการบันทึก real-time
- หลีกเลี่ยง recording ที่ยาวเกินไป แบ่งเป็นส่วนถ้าจำเป็น
- ใช้ `agent-browser wait` ระหว่าง actions เพื่อให้วิดีโออ่านง่าย
- ตั้งค่า viewport ด้วย `agent-browser set viewport 1920 1080` ก่อนบันทึก

## Expected Outcome

- วิดีโอ WebM บันทึกการใช้งานหน้าเว็บได้อย่างมีประสิทธิภาพ
- ไฟล์จัดเก็บอย่างเป็นระบบใน path ที่กำหนด
- การบันทึกครอบคลุม actions ทั้งหมดที่ต้องการ
- ปิด browser และ cleanup หลังบันทึกเสร็จ
