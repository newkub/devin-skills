---
name: report-plan
description: รายงานแผนงานก่อน implement พร้อม task table, bullet points ของ task with before-after แต่ละข้อ...
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-format-table
  - suggest-next-action
---

## Goal

รายงานแผนงานในแชทก่อนลงมือ implement เพื่อให้ผู้ใช้เห็นภาพรวมและตัดสินใจได้

## Scope

ใช้หลังจาก `/deep-plan` เสร็จ รายงานแผนเป็นตาราง, bullet points ของ task พร้อม before-after แต่ละข้อ และ file structure ในแชท แล้วทำงานต่อได้เลย

## Execute

### 1. Summarize Plan

สรุปแผนงานเป็น bullet points สั้นๆ

> Goal: ผู้ใช้เข้าใจภาพรวมของงานทันที

1. ระบุ goal และ scope ของงาน
2. ระบุจำนวน tasks และประเภท (create, modify, delete)
3. ระบุ library choices พร้อมเหตุผล
4. ระบุ milestones และ timeline

### 2. Report Task Table

แสดงตาราง tasks ตาม `/report-format-table`

> Goal: ผู้ใช้เห็นรายการงานและ priority ได้ชัดเจน

1. คอลัมน์ (# | Task | Type | Priority | Effort | Impact | Risk | Status)
2. Type: Create, Modify, Delete
3. Priority: P0 (critical), P1 (high), P2 (medium), P3 (low)
4. Effort: S, M, L, XL
5. Impact: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
6. Risk: 🔴 สูง, 🟡 ปานกลาง, 🟢 ต่ำ
7. Status: ⬜ ยังไม่ทำ, � กำลังทำ, ✅ เสร็จแล้ว

### 3. Report Task Bullets with Before-After

แสดง bullet points ของแต่ละ task ด้านล่างตาราง พร้อม before-after

> Goal: ผู้ใช้เห็นรายละเอียดและผลกระทบของแต่ละงาน

1. ต่อจากตาราง tasks ให้แสดงรายการ task เป็นข้อๆ
2. แต่ละข้อต้องระบุ: ชื่อ task, ไฟล์/โฟลเดอร์ที่เกี่ยวข้อง, สิ่งที่จะเปลี่ยนแปลง
3. แต่ละข้อต้องมี `/report-before-after` โดยแยก `### Before` และ `### After` เปรียบเทียบ
4. ใช้ code block หรือ table ถ้าช่วยให้เห็นความแตกต่างชัดเจน

### 4. Report File Structure

แสดง file structure ตาม `/report-format-file-structure`

> Goal: ผู้ใช้เห็นไฟล์ที่จะสร้าง/แก้ไข/ลบได้ชัดเจน

1. แสดง tree diagram ของไฟล์ที่จะสร้าง/แก้ไข/ลบ
2. ระบุ file pattern และ naming convention
3. ระบุ module boundaries และ dependencies

### 5. Report Execution Order

ระบุลำดับการทำงาน

> Goal: ผู้ใช้รู้ว่าจะเริ่มจากอะไร ทำพร้อมกันได้ตรงไหน

1. จัดกลุ่ม tasks เป็น phases: Foundation → Core → Polish → Test
2. ระบุ critical path: tasks ที่ต้องทำตามลำดับ
3. ระบุ parallelizable tasks: tasks ที่ทำพร้อมกันได้
4. แสดง execution sequence เป็นลิสต์: Phase 1 → Phase 2 → Phase 3
5. ระบุ milestones และ deliverables แต่ละ phase

### 6. Continue Execution

ดำเนินการต่อหลัง report

> Goal: ทำงานต่อได้เลยหรือถามก่อนถ้าจำเป็น

1. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
2. ถ้างานไม่เสี่ยง → เริ่ม implement ตาม execution order ได้เลย
3. ถ้ามีความเสี่ยงสูง ให้ใช้ `/ask-me` ก่อน implement

## Rules


### Report UX/UI

> Goal: report อ่านง่าย สรุป key findings ไว้ด้านบน และนำไปสู่ action

1. สรุป key findings ไว้ด้านบนก่อนรายละเอียด
2. ใช้ `/report-format-table` สำหรับตารางเปรียบเทียบหลาย columns
3. ใช้ `/report-format-terminal` สำหรับรายงานสถานะ/progress/logs
4. ใช้ numbered columns, headers ชัดเจน, จัดกลุ่ม/เรียงลำดับตามความสำคัญ
5. ใช้ symbols ✅ ❌ ⚠️ สำหรับ status indicators
6. ทำ `/suggest-next-action` ท้าย report เสมอ

### 1. Report Before Implement

- ต้อง report plan ในแชทก่อนลงมือทำเสมอ
- รายงานเป็นภาษาไทย กระชับ ตรงประเด็น
- ใช้ตารางสำหรับ tasks และ file structure

### 2. Before-After For Every Task

- ทำ `/report-before-after` สำหรับทุก task ใน bullet list
- งานเล็กก็ยังต้องแสดง before-after อย่างกระชับ
- ไม่แก้ไขไฟล์จริงใน `/report-before-after`

### 3. Auto Continue

- หลัง report แล้วทำงานต่อได้เลย ไม่ต้องรอยืนยัน
- ยกเว้นกรณีเสี่ยงสูง ให้ใช้ `/ask-me`
- ไม่หยุดถามถ้าไม่จำเป็น

### 4. Format

- ใช้ `/report-format-table` สำหรับ task table
- ใช้ `/report-format-file-structure` สำหรับ file tree
- ใช้ table หรือ code block สำหรับ before-after comparison

## Expected Outcome

- สรุปแผนงานเป็น bullet points ในแชท
- ตาราง tasks 8 คอลัมน์ (# | Task | Type | Priority | Effort | Impact | Risk | Status)
- Bullet points ของแต่ละ task ด้านล่างตาราง พร้อม before-after แต่ละข้อ
- File structure tree diagram
- Execution order แบ่งเป็น phases พร้อม critical path
- ทำงานต่อได้เลยหรือถามก่อนถ้าเสี่ยง
- Report อ่านง่าย มี key findings ด้านบน
- มี next action ชัดเจน
