---
name: report-plan
description: รายงานแผนงานในแชทก่อนลงมือ implement โดยแบ่งเป็น sections ตามมาตรฐาน
---

## Goal

รายงานแผนงานในแชทก่อนลงมือ implement เพื่อให้ผู้ใช้เห็นภาพรวมและตัดสินใจได้

## Scope

ใช้หลังจาก `/deep-plan` เสร็จ หรือก่อนเริ่มงานซับซ้อน รายงานต้องมี sections: TODOs, file changes table, file structure, report-ansi (ถ้าจำเป็น) แล้วทำงานต่อได้เลย

## Execute

### 1. Generate Plan Sections

> Goal: สร้างแผนงานเป็น sections ทีครบถ้วน

1. สรุป goal และ scope ของงาน 1-2 ประโยค
2. สร้างรายการ TODOs แบบ numbered list + bullet points
3. สร้างตาราง file changes ด้วย columns:
   - No.
   - File
   - How to (create / modify / delete / rename)
   - Risk (high / medium / low)
   - Note
4. แสดง file structure ด้วย `/report-file-structure` ถ้ามีการสร้าง/ย้าย/ลบไฟล์
5. แสดง report-ansi ถ้ามีสถานะ/progress/logs ที่ควรเห็นภาพ
6. ทำ `/suggest-next-action` ท้าย report

### 2. Format Output

> Goal: report อ่านง่ายและกระชับ

1. ขึ้นต้นด้วย summary 1-2 บรรทัด
2. แสดง section `## TODOs` ด้วย numbered list
3. แสดง section `## File Changes` ด้วย `/report-table`
4. แสดง section `## File Structure` (ถ้ามี)
5. แสดง section `## Report ANSI` (ถ้ามี)
6. ท้ายด้วย `## Next Action` ชัดเจน

## Rules

### 1. Sections Required

- ต้องมี `## TODOs` เป็น numbered list + bullets
- ต้องมี `## File Changes` เป็น table มี columns: No., File, How to, Risk, Note
- ต้องมี `## File Structure` ถ้ามีการเปลี่ยนโครงสร้างไฟล์
- ต้องมี `## Report ANSI` ถ้ามีสถานะ/progress/logs
- ต้องมี `## Next Action` ท้าย report

### 2. Table Columns

- `No.` เรียงตามลำดับ
- `File` ระบุ path สั้นๆ
- `How to` เขียนคร่าวๆ ว่าทำอะไร
- `Risk` ระบุ high / medium / low
- `Note` ระบุ dependency หรือข้อควรระวัง

### 3. Report UX

- ใช้ภาษาไทย กระชับ ตรงประเด็น
- ใช้ `/report-table` สำหรับตาราง
- ใช้ `/report-file-structure` สำหรับ tree
- ใช้ `/report-ansi` สำหรับ status/progress/logs
- ไม่ต้องรอยืนยัน แต่ถ้าเสี่ยงสูง ให้ใช้ `/ask-me`

## Expected Outcome

- สรุปแผนงานชัดเจน
- รายการ TODOs แบบ numbered + bullet
- ตาราง File Changes ครบ columns
- File Structure ถ้ามี
- Report ANSI ถ้ามี
- Next Action ชัดเจน
