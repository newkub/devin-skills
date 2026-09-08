---
name: reset-context
description: ลบ context ของบทสนทนาและ/หรือ reset มุมมองต่อไฟล์เป้าหมาย โดยเริ่มวิเคราะห์ใหมจากระบบไฟล์
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
  - use-astgrep
  - check-skills-related
  - deep-thinking
  - follow-best-practice
  - follow-layered-architecture
  - deep-plan
  - refactor
  - use-scripts
  - implement-to-production
  - deep-validate
  - run-verify
  - ask-me
---

## Goal

ลบ context ทั้งหมดของบทสนทนาก่อนหน้า และ/หรือ reset มุมมองต่อไฟล์เป้าหมาย โดยเริ่มวิเคราะห์ใหมทั้งหมดจากระบบไฟล์ปัจจุบันและ input ใหมของผู้ใช้

## Scope

ใช้เมื่อผู้ใช้พูด `reset-context`, ต้องการลบการวิเคราะห์ก่อนหน้า, หรือเริ่มงานใหม

- ถ้าไม่ระบุ target → reset ระดับ session
- ถ้าระบุ target เป็นไฟล์หรือ directory → reset มุมมองต่อไฟล์/ไดเรกทอรีนั้น โดยทำตามขั้นตอน `Assume Reset Context For Target` ด้านล่าง
- ไม่ลบไฟล์ใด ๆ แต่ reset แบบจำลองความเข้าใจของบทสนทนาหรือไฟล์

ดูเพิ่มเติม: `/scan-codebase`, `/use-astgrep`, `/check-skills-related`, `/deep-thinking`, `/deep-plan`, `/refactor`, `/use-scripts`, `/implement-to-production`, `/deep-validate`, `/run-verify`

## Execute

### 1. Reset Mental Context

> Goal: ล้าง assumptions ทั้งหมดจาก context ก่อนหน้า

1. ละเลยข้อสรุป การวิเคราะห์ แผน และผลลัพธ์บางส่วนจาก turn ก่อนหน้า
2. ไม่ตั้งสมมติฐานว่าสถานะก่อนหน้ายังเป็นจริงอยู่
3. ถือว่า target file หรืองานถัดไป เป็นไฟล์/งานแรกของ session ใหม
4. ไม่อ้างถึงการตัดสินใจก่อนหน้า เว้นแต่ผู้ใช้ขอให้อ้างถึงโดยชัดแจ้ง

### 2. Identify Reset Scope

> Goal: ระบุว่าจะ reset ระดับใด

1. ถ้าผู้ใช้ไม่ระบุ target → ไป `Re-Read State From Disk` สำหรับ workspace ทั้งหมด
2. ถ้าผู้ใช้ระบุ target เป็นไฟล์หรือ directory → ไป `Assume Reset Context For Target`
3. ถ้าไม่แน่ใจ → ถามผู้ใช้ด้วย `/ask-me`

### 3. Re-Read State From Disk

> Goal: อ่านสถานะใหมจากระบบไฟล์

1. ไม่พึ่งพา memory สำหรับเนื้อหาไฟล์ สถานะ workspace หรือผลลัพธ์ของ tool
2. อ่านไฟล์หรือ directory ที่ระบุใหม
3. ใช้ `todo_write` เพื่อติดตามเฉพาะงานใหม ไม่ใช่งานเก่า

### 4. Re-Plan From Scratch

> Goal: วางแผนงานใหมจากสถานะไฟล์ปัจจุบัน

1. ถ้าผู้ใช้ให้งานใหม ให้วางแผนงานนั้นโดยอิสระ
2. ใช้ `/deep-thinking` เพื่อวิเคราะห์ปัญหาใหมโดยไม่มีอคติจากก่อนหน้า
3. ใช้ `/deep-plan` เพื่อสร้างแผนใหมจากสถานะไฟล์ปัจจุบัน
4. ไม่นำแผนเก่ากลับมาใช้ เว้นแต่ผู้ใช้ขอให้ทำ

### 5. Assume Reset Context For Target

> Goal: วิเคราะห์และแก้ไข target เหมือนเป็นครั้งแรก

1. อ่าน target file ทั้งไฟล์ ไม่ข้ามบรรทัด
2. อ่าน `imports`, `exports`, dependencies และ reverse dependencies
3. ทำ `/scan-codebase` พร้อม `/use-astgrep` และ `/check-skills-related`
4. ทำ `/deep-thinking` เพื่อวิเคราะห์โครงสร้าง, issues, และ improvements
5. ทำ `/follow-best-practice` และ `/follow-layered-architecture` เพื่อเทียบมาตรฐาน
6. ทำ `/deep-plan` เพื่อวางแผนการแก้ไขตาม findings ใหม
7. ทำ `/refactor` และ `/use-scripts` ก่อน implement ถ้าจำเป็น
8. ทำ `/implement-to-production` เพื่อส่งมอบ code สมบูรณ์

### 6. Confirm Before Continuing

> Goal: ยืนยันก่อนดำเนินการ

1. สรุปสิ่งที่เข้าใจเกี่ยวกับงานใหมหรือ target
2. ถามผู้ใช้ให้ยืนยันหรือชี้แจง หากงานมีขนาดใหญ่หรือมีความเสี่ยง
3. เริ่มงานได้เมื่ target และขอบเขตชัดเจนแล้ว

### 7. Validate

> Goal: ตรวจสอบผลลัพธ์ใหมทั้งหมด

1. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้อง
2. ทำ `/run-verify` เพื่อรัน lint, typecheck, scan

## Rules

### 1. No Memory Assumptions

- ไม่ตั้งสมมติฐานว่าไฟล์ ข้อผิดพลาด หรือการแก้ไขก่อนหน้ายังมีผล
- อ่านไฟล์ซ้ำก่อนอ้างถึง
- ตรวจสอบสถานะ workspace ซ้ำก่อนรันคำสั่ง

### 2. No Context Reference

- ห้ามอ้างอิง conclusions, analysis, หรือ decisions จากการสนทนาก่อนหน้า
- ห้ามสมมติว่า `code` ก่อนหน้าถูกต้องโดยไม่พิสูจน์
- ทุกการตัดสินใจต้องมาจากการอ่านไฟล์จริงในปัจจุบัน

### 3. Fresh Analysis

- วิเคราะห์งานใหมตั้งแต่ต้น
- ถ้าเคยพูดถึงไฟล์ใด ให้อ่านไฟล์นั้นอีกครั้ง
- ถ้าเคยรันคำสั่งใด และผลลัพธ์นั้นมีความสำคัญ ให้รันซ้ำ
- อ่านไฟล์ทั้งไฟล์ ไม่ข้ามส่วนใด
- วิเคราะห์ใหมทั้งหมดเหมือนไม่เคยเห็นไฟล์นี้มาก่อน

### 4. Evidence-Based

- ทุก assumption ต้องมี evidence จากไฟล์จริง
- ทุกการตัดสินใจต้องอ้างอิงจาก code ที่อ่านได้
- ไม่เดาจาก context หรือ memory

### 5. Complete Independence

- ถ้ามี progress notes หรือ shared notes จาก context เดิม ให้อ่านแต่ไม่เชื่อโดยไม่พิสูจน์
- ถ้ามี `TODO` หรือ `FIXME` ในไฟล์ ให้ตรวจสอบว่ายังเกี่ยวข้องหรือไม่
- ถ้ามี `comments` อธิบายการแก้ไขก่อนหน้า ให้ตรวจสอบว่ายังถูกต้องหรือไม่

### 6. Independence And Safety

- ไม่สืบทอด todo ค้าง การกระทำที่ค้างอยู่ หรือปัญหาที่ยังไม่ได้แก้จาก turn ก่อนหน้า
- สร้างรายการ `todo_write` ใหมสำหรับงานใหม
- ถ้าผู้ใช้ต้องการ resume งานเก่า ต้องบอกโดยชัดแจ้ง
- ไม่ดำเนินการทำลายล้างตามสมมติฐานจาก context ก่อนหน้า
- ยืนยัน target และ action ก่อนเปลี่ยนไฟล์เสมอ
- ถ้าสงสัย ให้ถามมากกว่าตั้งสมมติฐาน

## Expected Outcome

- บทสนทนาดำเนินต่อโดยไม่มีสมมติฐานจาก turn ก่อนหน้า
- ไฟล์และสถานะ workspace ถูกอ่านใหมจาก disk ก่อนตัดสินใจ
- งานใหมหรือ target ได้รับการวางแผนและติดตามโดยอิสระ
- ผู้ใช้ได้รับข้อความยืนยันสั้น ๆ ว่า context ได้ถูก reset แล้ว
- การวิเคราะห์และแก้ไข target ที่ไม่ถูกจำกัดด้วย context เดิม
- ลด confirmation bias และ assumptions ที่ผิด
- ค้นพบปัญหาที่อาะมองข้ามจาก context เดิม
