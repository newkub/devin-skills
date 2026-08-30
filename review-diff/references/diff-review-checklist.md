# Diff Review Checklist

## Goal

รายละเอียดการรีวิว git diff ก่อนตัดสินใจ keep, revert หรือดำเนินการต่อ

## Scope

ใช้ก่อน `git-commit`, `/ship-ci`, `/follow-enter-dot` หรือเมื่อ working tree มีการเปลี่ยนแปลงจำนวนมาก

## Capture Diff State

1. รัน `git status --short` เพื่อดูไฟล์ที่ถูกแก้, ลบ, และ untracked
2. รัน `git diff --stat` เพื่อดูภาพรวมขนาดและจำนวนไฟล์
3. รัน `git diff --name-status` เพื่อดูสถานะของแต่ละไฟล์ (M, D, A, R, ??)
4. ถ้ามี target files เฉพาะ → รัน `git diff -- <path>`

## Summarize Changes

1. สร้างตาราง: `File`, `Status`, `Lines +/-`, `Summary`
2. สำหรับไฟล์ใหม่ (untracked/added) ให้อ่านส่วนต้นเพื่อสรุป intent
3. สำหรับไฟล์ลบ ให้ตรวจว่ามี references อื่นที่ยังอ้างถึงไฟล์นั้นหรือไม่
4. สำหรับไฟล์แก้ไข ให้ระบุส่วนสำคัญที่เปลี่ยน โดยไม่ dump ทั้งหมด

## Check Risks

1. ทำ `/grep` หา references เก่า เช่น ชื่อ skill ที่ถูก rename หรือลบ
2. ตรวจไฟล์ใหม่ทีอาจยาวเกิน 250 บรรทัด
3. ตรวจ secrets, credentials, หรือ hardcoded paths ในไฟล์ใหม่
4. ตรวจว่าไฟล์ใหม่ไม่อยู่นอก scope ที่ user ร้องขอ

## Present Options

1. สรุป `## Diff Review Snapshot` ด้วย bullet points
2. เสนอตัวเลือก: `continue`, `revert`, `inspect`, `ask`
3. ไม่ตัดสินใจแทน user ถ้า diff มี action เสี่ยง

## Act On Decision

1. ถ้า `continue` → ทำงานถัดไปตาม context (เช่น `/ship-ci`, `/git-commit`)
2. ถ้า `revert` → แสดง list ทีจะ revert ก่อนทำ แล้วรอ confirmation
3. ถ้า `inspect` → อ่านไฟล์ทีระบุและนำเสนอสรุปเพิ่ม
4. ถ้า `ask` → ใช้ `/ask-me` เพื่อถามปัญหาทีค้าง

## Rules

- สรุปให้พอตัดสินใจ ไม่ dump diff ทั้งหมด
- ถ้าตารางยาวเกิน 20 แถว ให้ group ตาม status หรือ directory
- ถ้า diff มีการลบ/ย้าย/overwrite ต้องระบุและถามก่อน
- ไม่ commit หรือ ship ถ้ายังไม่ได้ user confirmation
- ทุกสรุปต้องมาจาก `git status`, `git diff`, หรือการอ่านไฟล์จริง
- ถ้ามี rename/ลบ skill ให้ `/grep` หา references ทีเกี่ยวข้อง

## Expected Outcome

- ตารางสรุป diff ทั้ง tracked และ untracked
- รายการ risks หรือ side effects ทีพบ
- ตัวเลือกทัดไปที user เลือกได้ชัดเจน
- ไม่มีการ commit/ship/revert โดยไม่ได้รับ user confirmation
