---
name: list-git-commit
description: รายงาน git log สรุป commits, สถิติ, และ insights ในรูปแบบที่อ่านง่าย
argument-hint: "[ref]"
---

## Goal

รายงาน git log ในรูปแบบสรุปทีอ่านง่าย ครอบคลุม commits ล่าสุด สถิติ เเละ insights จาก history

## Scope

ใช้หลัง `/git-commit` เพื่อตรวจสอบประวัติทีเพิ่มขึ้น หรือเมื่อผู้ใช้ต้องการสรุป git log ช่วงใดช่วงหนึ่ง โดยไม่แก้ไข history

## Execute

### 1. Resolve Log Range

> Goal: ระบุช่วง commit ทีต้องรายงาน

1. ถ้าผู้ใช้ระบุ range (เช่น `v1.0.0..v2.0.0`, `HEAD~10`) → ใช้ค่านั้น
2. ถ้าไม่ระบุ → ใช้ `HEAD~10..HEAD` หรือค่า default `git log --oneline -10`
3. ตรวจสอบว่า range ถูกต้องด้วย `git rev-parse` หรือ `git log --quiet`

### 2. Fetch Log Data

> Goal: รวบรวมข้อมูล commits ด้วย `git log`

1. รัน `git log --oneline --decorate --graph <range>` เพื่อดูภาพรวม
2. รัน `git log --pretty=format:"%h|%an|%ad|%s" --date=short <range>` เพื่อดึงข้อมูลราย commit
3. ถ้าต้องการรายละเอียดเพิ่ม → รัน `git log --stat <range>`
4. บันทึกข้อมูล commits สำหรับสรุป

### 3. Categorize Commits

> Goal: จัดกลุ่ม commits ตาม conventional commits type

1. แยก commit message ตาม prefix: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `perf:`, `test:`, `chore:`
2. นับจำนวน commit แต่ละประเภท
3. ระบุ scope ทีพบบ่อย (เช่น `api`, `ui`, `config`, `test`)
4. สรุป top contributors จาก author

### 4. Report Summary

> Goal: นำเสนอ git log ในรูปแบบเข้าใจง่าย

1. ใช้ `/report-table` สร้างตาราง commits (# | Hash | Author | Date | Type | Subject)
2. แสดงสถิติรวม: จำนวน commits, จำนวน files เปลี่ยนแปลง (ถ้ามี `--stat`), ประเภททีมากทีสุด
3. สรุป insights: breaking changes, recurring scopes, แนวโน้มของช่วง commit

## Rules

### 1. Read Only

- ใช้ `git log` เท่านั้น ไม่รัน `git reset`, `git rebase`, หรือคำสั่งเปลี่ยนแปลง history
- ไม่แก้ไขไฟล์หรือ tags ระหว่างรายงาน

### 2. Deterministic Output

- รันซ้ำด้วย range เดียวกันได้ผลเหมือนกัน
- ใช้ `--date=short` หรือ `--date=iso` เพื่อให้ format คงที

### 3. Conventional Commits Awareness

- ถ้า commit messages ไม่ตรง conventional commits → ระบุว่าไม่มี type ชัดเจน
- แยก `scope` จาก `(<scope>):` ถ้ามี

### 4. Range Safety

- ตรวจสอบว่า range มีอยู่จริงก่อนรัน `git log`
- ถ้า range ไม่ถูกต้อง → stop และ report โดยไม่รัน

## Expected Outcome

- รายงาน git log เป็นตาราง commits ชัดเจน
- สถิติประเภท commits เเละ top contributors
- Insights สั้นๆ จากช่วง commit
- ไม่มีการเปลี่ยนแปลง git history
