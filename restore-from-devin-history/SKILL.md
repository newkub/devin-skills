---
name: restore-from-devin-history
description: กู้คืนไฟล์ที่เสียหายรุนแรงโดยอ่านประวัติ Devin session แทน git restore เมื่อง git ใช้ไม่ได้แล้ว
---

## Goal

กู้คืนข้อมูลหรือทำความเข้าใจว่าเกิดอะไรขึ้นก่อนไฟล์เสียหาย เมื่อง git ไม่สามารถ restore ได้แล้ว โดยอ่านประวัติ Devin CLI session

## Scope

ใช้เมื่องไฟล์หรือ workspace เสียหายรุนแรงจน `git restore` ไม่ช่วย ไม่มี backup อื่น และต้องสืบค้นว่า AI ทำอะไรไปก่อนหน้า

## Execute

### 1. Assess Git State

> Goal: ตรวจสอบ git state ก่อน

1. รัน `git status` ใน repo ที่เสียหาย
2. ดู `git log -1 --format='%H %ci %s'` เพื่อรู้ last commit time
3. ลอง `git diff` หรือ `git show HEAD:<file>` เพื่อดูว่าข้อมูลสำคัญยังอยู่ไหม
4. ถ้าข้อมูลจำเป็นหายไปจาก git → ดำเนินการต่อ

### 2. Inspect Devin Session History

> Goal: อ่านประวัติ Devin CLI

1. ดูโฟลเดอร์ `C:\Users\Veerapong\AppData\Roaming\devin\cli\summaries`
2. หาไฟล์ `history_*.md` ล่าสุด (เรียงตามชื่อหรือ modified time)
3. อ่านไฟล์ summary ล่าสุดที่ตรงกับช่วงเวลาก่อนไฟล์เสียหาย
4. ค้นหาคำสั่งที่ user ให้และ action ที่ agent ทำ
5. ดูโฟลเดอร์ `C:\Users\Veerapong\AppData\Roaming\devin\cli` หา logs หรือ session files เพิ่มเติมถ้ามี
6. บันทึกรายการ commands/files ที่เกี่ยวข้อง

### 3. Correlate With Last Commit

> Goal: เทียบเวลา

1. บันทึก last commit time จาก step 1
2. บันทึกเวลาของไฟล์เสียหาย (`ls -la` หรือ `Get-ChildItem`)
3. บันทึกเวลาของ Devin summary ล่าสุด
4. สร้าง timeline: last commit → actions ที่ทำ → ไฟล์เสียหาย

### 4. Report Findings

> Goal: รายงานสิ่งที่พบ

1. สรุปไฟล์ที่เสียหายและสาเหตุทีคาดการณ์
2. ระบุ last commit time และสถานะ git
3. รายงานคำสั่งหรือ actions สำคัญจาก Devin session
4. ระบุข้อมูลที่ยังกู้คืนได้ (ถ้ามี) เช่นจาก temp files, summaries, logs
5. ไม่แนะนำให้ทำการ restore เองโดยไม่ถาม user ก่อน

### 5. Ask Next Step

> Goal: ถาม user ว่าจะทำต่ออย่างไร

1. ใช้ `ask-me` skill เพื่อถาม user ด้วยตัวเลือกชัดเจน
2. ตัวเลือกเช่น:
   - ลองกู้คืนด้วย manual recovery จาก session logs
   - ย้อนกลับไปทำงานที่ last commit แล้วค่อยทำใหม่
   - ข้ามไฟล์นั้นไปและดำเนินการอื่น
   - ให้ user ส่ง backup หรือ reference ที่เหลืออยู่
3. อธิบาย risk ของแต่ละตัวเลือก

## Rules

### 1. Do Not Guess

- ไม่คาดเดาว่าไฟล์มีอะไรก่อนเสียหาย
- อ้างอิงเฉพาะข้อมูลที่อ่านได้จาก git, summaries, logs
- ถ้าไม่มีหลักฐาน ให้บอก user ตรงๆ

### 2. No Auto-Destructive Recovery

- ไม่รัน `git clean`, `git reset --hard`, หรือลบไฟล์โดยไม่ถาม
- ไม่เขียนทับไฟล์ทีอาจยังมีข้อมูล
- ทำ backup ก่อน recovery ทุกครั้ง

### 3. Session Privacy

- อ่านเฉพาะ summaries ที่จำเป็น
- ไม่แชร์ข้อมูลลับ (keys, tokens) ที่อาจพบใน logs
- รายงานเฉพาะสิ่งที่เกี่ยวข้องกับไฟล์ที่เสียหาย

### 4. Clear Communication

- ใช้ภาษาไทยกระชับ
- แสดง timeline เป็นข้อๆ
- ไม่ตอบคำถามก่อนรวบรวมข้อมูลครบ

## Expected Outcome

- รู้ว่า git restore ช่วยไม่ได้จริงหรือไม่
- ได้ timeline ของเหตุการณ์ก่อนเสียหาย
- ได้รายงานคำสั่งและ actions สำคัญจาก Devin session
- ผู้ใช้ได้รับตัวเลือกกู้คืนพร้อม risk และยืนยันก่อนทำ
