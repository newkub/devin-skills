---
name: review-diff
description: รีวิว git diff ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ
argument-hint: "[scope]"
related:
  - report-git-diff
  - check-git-diff
  - git-commit
  - ship
  - report-table
  - validate
  - ask-me
  - consider-use-in-another-skills
---

## Goal

รีวิว git diff อย่างรวดเร็ว สรุปสิ่งที่เปลี่ยนแปลง ตรวจหาปัญหาทีอาจเกิด และถาม user ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ

## Scope

ใช้ก่อน `git-commit`, `/ship`, `/follow-enter-dot` หรือทุกครั้งที่ working tree มีการเปลี่ยนแปลงจำนวนมากและต้องการ user confirmation ก่อนลงมือ

## Execute

### 1. Capture Diff State

> Goal: รวบรวมสถานะการเปลี่ยนแปลงทั้งหมด

1. รัน `git status --short` เพื่อดูไฟล์ที่ถูกแก้, ลบ, และ untracked
2. รัน `git diff --stat` เพื่อดูภาพรวมขนาดและจำนวนไฟล์
3. รัน `git diff --name-status` เพื่อดูสถานะของแต่ละไฟล์ (M, D, A, R, ??)
4. ถ้ามี target files เฉพาะ → รัน `git diff -- <path>`

### 2. Summarize Changes

> Goal: ทำให้ user เข้าใจ diff ในเวลาสั้น

1. สร้างตาราง: `File`, `Status`, `Lines +/-`, `Summary`
2. สำหรับไฟล์ใหม่ (untracked/added) ให้อ่านส่วนต้นเพื่อสรุป intent
3. สำหรับไฟล์ลบ ให้ตรวจว่ามี references อื่นที่ยังอ้างถึงไฟล์นั้นหรือไม่
4. สำหรับไฟล์แก้ไข ให้ระบุส่วนสำคัญที่เปลี่ยน โดยไม่ dump ทั้งหมด

### 3. Check Risks

> Goal: หาปัญหาก่อนสรุป

1. ทำ `/grep` หา references เก่า เช่น ชื่อ skill ที่ถูก rename หรือลบ
2. ตรวจไฟล์ใหม่ทีอาจยาวเกิน 250 บรรทัด
3. ตรวจ secrets, credentials, หรือ hardcoded paths ในไฟล์ใหม่
4. ตรวจว่าไฟล์ใหม่ไม่อยู่นอก scope ที่ user ร้องขอ

### 4. Present Options

> Goal: ให้ user เลือกท่าทีถัดไป

1. สรุป `## Diff Review Snapshot` ด้วย bullet points
2. เสนอตัวเลือก:
   - `continue` — รับ diff และดำเนินการต่อ
   - `revert` — คืนค่าหรือลบไฟล์ที่ไม่ต้องการ
   - `inspect` — เปิดอ่านไฟล์หรือ diff เฉพาะเพิ่มเติม
   - `ask` — ถาม user เมื่องานซับซ้อน
3. ไม่ตัดสินใจแทน user ถ้า diff มี action เสี่ยง

### 5. Act On Decision

> Goal: ดำเนินการตามที user เลือก

1. ถ้า `continue` → ทำงานถัดไปตาม context (เช่น `/ship`, `/git-commit`)
2. ถ้า `revert` → แสดง list ทีจะ revert ก่อนทำ แล้วรอ confirmation
3. ถ้า `inspect` → อ่านไฟล์ทีระบุและนำเสนอสรุปเพิ่ม
4. ถ้า `ask` → ใช้ `/ask-me` เพื่อถามปัญหาทีค้าง

## Rules

### 1. Minimal Output

- สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
- ถ้าตารางยาวเกิน 20 แถว ให้ group ตาม status หรือ directory
- ใช้ `git diff --stat` ก่อนจะแสดงรายละเอียด

### 2. Safety First

- ถ้า diff มีการลบ/ย้าย/overwrite ต้องระบุและถามก่อน
- ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
- ถ้าพบ untracked files นอก scope ให้แจ้ง user

### 3. Evidence-Based

- ทุกสรุปต้องมาจาก `git status`, `git diff`, หรือการอ่านไฟล์จริง
- ระบุ file path, line count, และ status เป็นหลักฐาน
- ไม่เดา intent ของ changes ถ้าไฟล์ซับซ้อน

### 4. No Hidden Scope

- หยุดถ้า diff มีงานนอก scope ที่ user ร้องขอ
- แยก diff ของงานหลักกับ side effects ออกจากกัน
- ถ้ามี side effects ให้รายงานก่อนและขอ decision

### 5. Cross-Reference Check

- ถ้ามี rename/ลบ skill ให้ `/grep` หา references ทีเกี่ยวข้อง
- ถ้า references ขาด → แจ้งก่อน continue
- ถ้า references เกิน → แนะนำ `/update-references`

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
