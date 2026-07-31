---
name: follow-git-blame
description: ใช้ git blame และ code archaeology เพื่อดูประวัติการเปลี่ยนแปลงของ code
---

## Goal

ใช้ git blame และ code archaeology เพื่อดูใครแก้บรรทัดไหนเมื่อไหร่ และทำไม

## Scope

ครอบคลุม git blame, git log, git show และ code archaeology techniques

## Execute

### 1. Blame A File

1. รัน `git blame <file>` เพื่อดูใครแก้บรรทัดไหนเมื่อไหร่
2. รัน `git blame -L <start>,<end> <file>` เพื่อ blame เฉพาะบรรทัดที่สนใจ
3. รัน `git blame -w <file>` เพื่อ ignore whitespace changes
4. รัน `git blame -C <file>` เพื่อ detect moved lines จากไฟล์อื่น

### 2. Trace Changes

1. รัน `git log -p <file>` เพื่อดู history พร้อม diff ของไฟล์
2. รัน `git log --follow <file>` เพื่อ track ไฟล์ผ่านการ rename
3. รัน `git log -S "<search-string>" <file>` เพื่อหาเมื่อ string ถูกเพิ่ม/ลบ
4. รัน `git log --oneline -- <file>` เพื่อดู commits ที่แก้ไฟล์

### 3. Investigate A Commit

1. รัน `git show <commit-hash>` เพื่อดู changes ของ commit
2. รัน `git show <commit-hash> --stat` เพื่อดูไฟล์ที่เปลี่ยน
3. รัน `git log <commit-hash> -1 --format=full` เพื่อดู metadata
4. รัน `git diff <commit-hash>~1 <commit-hash>` เพื่อดู diff ก่อนหน้า

### 4. Code Archaeology

1. รัน `git log --all --oneline --source -- <file>` เพื่อดูทุก branch ที่แก้ไฟล์
2. รัน `git log --grep="<keyword>"` เพื่อค้นหา commits ตาม message
3. รัน `git log --author="<name>"` เพื่อดู commits ตาม author
4. รัน `git log --since="2 weeks ago" --until="yesterday"` เพื่อดูตามช่วงเวลา

### 5. Use File History Tool

1. ทำ `/git-file-history` เพื่อดู file history แบบ interactive
2. ใช้ HTML viewer สำหรับดู timeline และ diff
3. วิเคราะห์ pattern ของการเปลี่ยนแปลง

## Rules

### 1. Blame Context

- ใช้ `git blame` เพื่อดูใครแก้บรรทัดไหน ไม่ใช่เพื่อโทษคน
- ใช้ `-w` เพื่อ ignore whitespace ถ้าสนใจเฉพาะ logic changes
- ใช้ `-C` เพื่อ detect code movement ระหว่างไฟล์
- ตรวจสอบ commit message ของบรรทัดที่สนใจ

### 2. Investigation Discipline

- ใช้ `git log -S` เพื่อหาเมื่อ code ถูกเพิ่มหรือลบ
- ใช้ `git log --follow` เพื่อ track ไฟล์ผ่าน rename
- ตรวจสอบหลาย commits ไม่ใช่แค่ commit ล่าสุด
- ใช้ `/git-file-history` สำหรับ visualization

### 3. Performance

- หลีกเลี่ยง `git blame` บนไฟล์ขนาดใหญ่โดยไม่จำกัด range
- ใช้ `-L` เพื่อจำกัดบรรทัดที่สนใจ
- ใช้ `--since` และ `--until` เพื่อจำกัดช่วงเวลา
- ใช้ `--oneline` เพื่อลด output size

### 4. Non-Redundancy

- รายละเอียด file history viewer อยู่ใน `/git-file-history` แล้ว
- รายละเอียด debugging อยู่ใน `/debug-issue` แล้ว

## Expected Outcome

- ทราบประวัติการเปลี่ยนแปลงของ code
- เข้าใจเหตุผลที่ code เป็นแบบนี้
- หา commit ที่ทำให้เกิดปัญหาได้
- ตัดสินใจได้ดีขึ้นเมื่อต้องแก้ไข code
