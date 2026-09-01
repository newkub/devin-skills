---
name: reset-context
description: ลบ context ของบทสนทนาก่อนหน้าและดำเนินการต่อเหมือนกับ session ใหม่
argument-hint: "[optional-target-or-task]"
allowed-tools:
  - read
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - scan-codebase
  - deep-thinking
  - follow-best-practice
  - deep-plan
  - refactor
  - use-scripts
  - realize-implementation
  - deep-validate
  - run-verify
---

## Goal

ลบ context ทั้งหมดของบทสนทนาก่อนหน้า และดำเนินการต่อเหมือนกับ session ใหม่ โดยตั้งสมมติฐานใหม่ทั้งหมดจากระบบไฟล์ปัจจุบันและ input ใหม่ของผู้ใช้

## Scope

ใช้เมื่อผู้ใช้พูด `reset-context`, ต้องการลบการวิเคราะห์ก่อนหน้า หรือเริ่มงานใหม่ skill นี้ไม่ลบไฟล์ใด ๆ แต่ reset แบบจำลองความเข้าใจของบทสนทนา

## Execute

### 1. Reset Mental Context

> Goal: Reset Mental Context

1. ละเลยข้อสรุป การวิเคราะห์ แผน และผลลัพธ์บางส่วนจาก turn ก่อนหน้า
2. ไม่ตั้งสมมติฐานว่าสถานะก่อนหน้ายังเป็นจริงอยู่
3. มองงานถัดไปเหมือนเป็นงานแรกของ session ใหม่
4. ไม่อ้างถึงการตัดสินใจก่อนหน้า เว้นแต่ผู้ใช้ขอให้อ้างถึงโดยชัดแจ้ง

### 2. Re-Read State From Disk

> Goal: Re-Read State From Disk

1. ไม่พึ่งพา memory สำหรับเนื้อหาไฟล์ สถานะ workspace หรือผลลัพธ์ของ tool
2. ถ้ามี target ระบุ ให้อ่านไฟล์หรือ directory นั้นใหม่
3. ถ้าไม่มี target ระบุ ให้ถามผู้ใช้ว่าต้องการทำงานอะไร
4. ใช้ `todo_write` เพื่อติดตามเฉพาะงานใหม่ ไม่ใช่งานเก่า

### 3. Re-Plan From Scratch

> Goal: Re-Plan From Scratch

1. ถ้าผู้ใช้ให้งานใหม่ ให้วางแผนงานนั้นโดยอิสระ
2. ใช้ `/deep-thinking` เพื่อวิเคราะห์ปัญหาใหม่โดยไม่มีอคติจากก่อนหน้า
3. ใช้ `/deep-plan` เพื่อสร้างแผนใหม่จากสถานะไฟล์ปัจจุบัน
4. ไม่นำแผนเก่ากลับมาใช้ เว้นแต่ผู้ใช้ขอให้ทำ

### 4. Confirm Before Continuing

> Goal: Confirm Before Continuing

1. สรุปสิ่งที่เข้าใจเกี่ยวกับงานใหม่
2. ถามผู้ใช้ให้ยืนยันหรือชี้แจง หากงานมีขนาดใหญ่หรือมีความเสี่ยง
3. เริ่มงานได้เมื่อ target และขอบเขตชัดเจนแล้ว

## Rules

### 1. No Memory Assumptions

- ไม่ตั้งสมมติฐานว่าไฟล์ ข้อผิดพลาด หรือการแก้ไขก่อนหน้ายังมีผล
- อ่านไฟล์ซ้ำก่อนอ้างถึง
- ตรวจสอบสถานะ workspace ซ้ำก่อนรันคำสั่ง

### 2. Fresh Analysis

- วิเคราะห์งานใหม่ตั้งแต่ต้น
- ถ้าเคยพูดถึงไฟล์ใด ให้อ่านไฟล์นั้นอีกครั้ง
- ถ้าเคยรันคำสั่งใด และผลลัพธ์นั้นมีความสำคัญ ให้รันซ้ำ

### 3. Independence

- ไม่สืบทอด todo ค้าง การกระทำที่ค้างอยู่ หรือปัญหาที่ยังไม่ได้แก้จาก turn ก่อนหน้า
- สร้างรายการ `todo_write` ใหม่สำหรับงานใหม่
- ถ้าผู้ใช้ต้องการ resume งานเก่า ต้องบอกโดยชัดแจ้ง

### 4. Safety

- ไม่ดำเนินการทำลายล้างตามสมมติฐานจาก context ก่อนหน้า
- ยืนยัน target และ action ก่อนเปลี่ยนไฟล์เสมอ
- ถ้าสงสัย ให้ถามมากกว่าตั้งสมมติฐาน

## Expected Outcome

- บทสนทนาดำเนินต่อโดยไม่มีสมมติฐานจาก turn ก่อนหน้า
- ไฟล์และสถานะ workspace ถูกอ่านใหม่จาก disk ก่อนตัดสินใจ
- งานใหม่ได้รับการวางแผนและติดตามโดยอิสระ
- ผู้ใช้ได้รับข้อความยืนยันสั้น ๆ ว่า context ได้ถูก reset แล้ว