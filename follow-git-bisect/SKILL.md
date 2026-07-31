---
name: follow-git-bisect
description: ใช้ git bisect สำหรับหา commit ที่ทำให้เกิด bug ด้วย binary search
---

## Goal

ใช้ git bisect เพื่อหา commit ที่ทำให้เกิด bug อย่างรวดเร็วด้วย binary search

## Scope

ครอบคลุม git bisect workflow: start, mark good/bad, identify และ end

## Execute

### 1. Prepare Bisect

1. ทำ `/debug-issue` เพื่อวิเคราะห์ bug ก่อน
2. รัน `git status` เพื่อตรวจสอบ working tree clean
3. ระบุ commit ที่รู้ว่า bug ยังไม่เกิด (good)
4. ระบุ commit ปัจจุบันที่ bug เกิด (bad)

### 2. Start Bisect

1. รัน `git bisect start` เพื่อเริ่ม bisect session
2. รัน `git bisect bad <bad-commit>` เพื่อระบุ commit ที่มี bug
3. รัน `git bisect good <good-commit>` เพื่อระบุ commit ที่ไม่มี bug
4. Git จะ checkout commit ตรงกลางให้ทดสอบ

### 3. Test And Mark

1. รัน test หรือ reproduce bug บน commit ที่ Git checkout ให้
2. ถ้า bug เกิด: รัน `git bisect bad`
3. ถ้า bug ไม่เกิด: รัน `git bisect good`
4. ทำซ้ำจนกว่า Git จะระบุ commit ที่ทำให้เกิด bug

### 4. Identify Root Cause

1. Git จะแสดง commit ที่ทำให้เกิด bug พร้อม hash และ message
2. รัน `git show <commit-hash>` เพื่อดูการเปลี่ยนแปลง
3. วิเคราะห์ว่าการเปลี่ยนแปลงใน commit นั้นทำให้เกิด bug อย่างไร
4. ทำ `/resolve-errors` เพื่อแก้ไข

### 5. End Bisect

1. รัน `git bisect reset` เพื่อกลับไป branch เดิม
2. ตรวจสอบว่าอยู่บน branch ที่ถูกต้อง
3. แก้ไข bug และทำ `/git-commit`

## Rules

### 1. Bisect Discipline

- ตรวจสอบ working tree clean ก่อนเริ่ม
- ระบุ good และ bad commit ให้ชัดเจน
- ทดสอบทุก commit ที่ Git checkout ให้อย่างละเอียด
- ห้ามข้ามการทดสอบ

### 2. Automation

- ใช้ `git bisect run <test-command>` เพื่อ automate การทดสอบ
- Test command ต้อง exit code 0 สำหรับ good และ non-0 สำหรับ bad
- ใช้เมื่อสามารถ reproduce bug ด้วย command ได้

### 3. Safety

- ห้ามแก้ไข code ระหว่าง bisect
- ใช้ `git bisect reset` เพื่อออกจาก bisect session เสมอ
- ถ้าต้องการดู commit เพิ่มเติมให้ใช้ `git bisect visualize`

### 4. Non-Redundancy

- รายละเอียด debugging อยู่ใน `/debug-issue` แล้ว
- รายละเอียด error resolution อยู่ใน `/resolve-errors` แล้ว

## Expected Outcome

- หา commit ที่ทำให้เกิด bug ได้อย่างรวดเร็ว
- ลดเวลาในการ debug ด้วย binary search
- ทราบ root cause ของ bug อย่างชัดเจน
