---
name: watch-github-actions
description: รันและตรวจสอบ GitHub Actions จนกว่าจะผ่าน
argument-hint: "[run-id]"
---

## Goal

รันและตรวจสอบ GitHub Actions จนกว่าจะผ่านทั้งหมด

## Scope

ใช้สำหรับตรวจสอบและรัน GitHub Actions หลังจาก push code หรือเมื่อได้รับ `run-id` จาก argument

## Execute

### 1. Verify GitHub CLI

> Goal: ยืนยันว่า `gh` CLI ติดตั้งและ authenticated

1. รัน `gh --version` เพื่อตรวจสอบการติดตั้ง
2. ถ้าไม่ได้ติดตั้ง → stop และ report ว่าต้องติดตั้ง `gh` CLI
3. รัน `gh auth status` เพื่อตรวจสอบ authentication
4. ถ้าไม่ authenticated → ทำ `/ask-me` ให้ user รัน `gh auth login`
5. ถ้า authenticated → ไปขั้นตอน Check Workflows

### 2. Check Workflows

> Goal: ตรวจสอบว่า repository มี GitHub Actions และระบุ workflow ที่เกี่ยวข้อง

1. รัน `gh workflow list` เพื่อตรวจสอบว่ามี GitHub Actions ใน `repository` ไหม
2. ตรวจสอบ workflow ที่ trigger จาก push ครั้งล่าสุด
3. รัน `gh run list --limit 5` เพื่อดู recent workflow runs และสถานะล่าสุด
4. ถ้าไม่มี workflow ใน `repository` → รายงานและจบ task

### 3. Watch And Fix

> Goal: ติดตาม workflow run แบบ real-time แก้ไข failure และ re-push จนกว่าจะผ่าน

1. รัน `gh run list --limit 1` เพื่อดู recent workflow run และระบุ `run-id`
2. ถ้าได้รับ `run-id` จาก argument ให้ใช้ค่านั้นแทน
3. รัน `gh run watch <run-id>` เพื่อติดตาม workflow แบบ real-time จนกว่าจะจบ
4. ถ้า workflow ผ่าน → ไปขั้นตอนที่ 9
5. ถ้า workflow ล้มเหลว → รัน `gh run view <run-id> --log-failed` เพื่ออ่าน logs ของ job ที่ล้มเหลว
6. วิเคราะห์ logs เพื่อระบุ root cause เช่น syntax error, test failure, lint error หรือ dependency missing
7. ทำ `/follow-tool-github-actions` เพื่อแก้ไข code หรือ config ตาม root cause ที่พบ
8. หลังแก้ไขเสร็จ → commit และ push ใหม่ จากนั้นกลับไปขั้นตอนที่ 1 เพื่อตรวจสอบ run ใหม่
9. รัน `gh run list --limit 10` เพื่อยืนยันว่าทุก workflow ผ่านแล้ว
10. ถ้ายังมี workflow ที่ล้มเหลว → กลับไปขั้นตอนที่ 3 และทำซ้ำจนกว่าทุก workflow ผ่าน

## Rules

### 1. Watch Real-time

ติดตาม workflow แบบ real-time:

- ใช้ `gh run watch` เพื่อติดตาม workflow แบบ real-time จนกว่าจะจบ
- ถ้า `gh run watch` ค้างหรือ timeout → รัน `gh run view <run-id>` เพื่อตรวจสอบสถานะแทน
- ตรวจสอบ logs จาก GitHub UI ถ้าจำเป็น

### 2. Read Logs And Identify Failures

อ่าน logs อย่างละเอียดเพื่อหา root cause:

- รัน `gh run view <run-id> --log-failed` เพื่อดู logs ของ job ที่ล้มเหลวโดยเฉพาะ
- ระบุประเภท failure เช่น `compile error`, `test failure`, `lint error`, `dependency missing` หรือ `timeout`
- ถ้า logs ไม่ชัดเจน → รัน `gh run view <run-id> --log` เพื่อดู logs ทั้งหมด
- บันทึก root cause ก่อนเริ่มแก้ไขเพื่อไม่ให้พลาดจุดที่ผิด

### 3. Fix And Re-push

แก้ไขและ push ใหม่จนกว่าจะผ่าน:

- ทำ `/follow-tool-github-actions` เพื่อแก้ไข code หรือ config ตาม root cause ที่พบ
- แก้ไขเฉพาะจุดที่ผิด ไม่เปลี่ยน code อื่นที่ไม่เกี่ยวข้อง
- หลังแก้ไขเสร็จ → commit และ push ใหม่เพื่อ trigger workflow run ใหม่
- ตรวจสอบว่า fix ไม่ทำให้ workflow อื่นที่เคยผ่านกลับมาล้มเหลว

### 4. Loop Until Pass

ต้อง loop จนกว่าทุก workflow ผ่าน:

- ต้อง loop จนกว่าทุก workflow ผ่านทั้งหมด
- ไม่ยอมรับ workflow ที่ล้มเหลว
- ตรวจสอบทุก run ก่อนสิ้นสุด task
- ถ้า loop เกิน 5 รอบและยังไม่ผ่าน → หยุดและรายงานสถานะ

### 5. Clean Failed Runs (Optional)

ลบ run ที่ failure — เป็น optional และต้องได้รับการยืนยันจาก user:

- หลังจาก workflow ผ่านแล้ว ให้ใช้ `gh run list` เพื่อดูสถานะ runs ทั้งหมด
- ถ้า user ขอให้ลบ → ทำ `/ask-me` เพื่อยืนยันก่อนลบแต่ละ run
- ใช้ `gh run delete <run-id>` เฉพาะที่ user ยืนยัน
- คง run ที่ failure ไว้สำหรับ post-incident analysis โดย default

### 6. Graceful Shutdown

- หยุดทันทีเมื่อ user กด `Ctrl+C`
- บันทึกสถานะ workflow run ก่อนหยุด

### 7. Push Failure Handling

- ถ้า `git push` ล้มเหลวเพราะ merge conflict → ทำ `git pull --rebase` แล้ว push ใหม่
- ถ้า `git push` ล้มเหลวเพราะ branch protection → ทำ `/ask-me`
- ถ้า `git push` ล้มเหลวเพราะ network → retry สูงสุด `3` ครั้ง

### 8. Rollback Safety

- ก่อน push fix ให้บันทึก SHA ของ last green commit: `git rev-parse HEAD`
- ถ้า fix round ≥ `3` และสร้าง failure ใหม่ → `git revert` กลับไป last green SHA
- ถ้า fix สร้าง failure ใน workflow ที่ก่อนหน้าผ่าน → revert ทันที

### 9. Per-Round Timeout

- `perRoundTimeout` = `120` วินาที สำหรับแต่ละรอบ fix-and-push
- `ghRunWatchTimeout` = `300` วินาที สำหรับ `gh run watch`

## Expected Outcome

- ทุก GitHub Actions ผ่านสำเร็จ
- ไม่มี workflow ที่ล้มเหลวเหลืออยู่
- `repository` อยู่ในสถานะ CI/CD ผ่าน
- run ที่ failure คงไว้โดย default สำหรับ post-incident analysis
