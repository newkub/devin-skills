---
name: ship-rollback
description: Rollback production deployment ที่พัง ด้วย git revert หรือ redeploy เวอร์ชันเดิม
argument-hint: "[deploy-id-or-reason]"
related:
  - ship
  - ship-to-staging
  - ship-to-production
  - run-deploy
  - watch-deploy
  - resolve-errors
  - report-table
  - ask-me
---

## Goal

Rollback production deployment ที่พัง กลับไปยัง version ล่าสุดที่ทำงานได้ — ปลอดภัย รวดเร็ว และมี evidence

## Scope

ใช้ภายหลัง `/ship`, `/ship-to-staging` หรือ `/ship-to-production` เมื่อ production deploy แล้วพัง — โดยทั่วไป trigger มาจาก `/watch-deploy` หรือ observability alert

## Execute

### 1. Detect Failure

> Goal: ยืนยันว่าพังจริง

1. ทำ `/watch-deploy` หรือ health checks
2. ตรวจ error rate, latency, logs จาก observability
3. บันทึก evidence พร้อมเวลาทีเริ่มพัง

### 2. Identify Last Known Good

> Goal: รู้ว่าจะ rollback ไป version ไหน

1. หา last successful deploy: `git log --oneline`, deploy history, tags
2. ระบุ commit hash หรือ image tag ที่ทำงานได้ล่าสุด
3. ถ้าไม่ชัด → `/ask-me`

### 3. Execute Rollback

> Goal: เอา version ดีกลับคืน

1. ตัวเลือก A: `git revert <bad-merge-commit>` บน `main` แล้ว push
2. ตัวเลือก B: redeploy เวอร์ชันเดิม (เช่น tag เก่า) ด้วย `/run-deploy`
3. ตัวเลือก C: ถ้าใช้ database migrations ที่ incompatible → restore backup ถ้ามี
4. ห้าม force-push หรือลบ history

### 4. Verify Rollback

> Goal: ยืนยันว่ากลับมาทำงานได้

1. ทำ `/watch-deploy` health check อีกครั้ง
2. ตรวจ error rate ลดลง
3. รัน smoke tests บน critical paths
4. ถ้า rollback ยังไม่ทำงาน → ทำ `/resolve-errors` แล้ว escalate

### 5. Report

> Goal: สรุปเหตุการณ์

1. ทำ `/report-table` สรุป cause, version rolled back, time, status
2. เปิด issue สำหรับ root cause ถ้ายังไม่มี
3. ทำ `/suggest-next-action`

## Rules

### 1. Evidence First

- ไม่ rollback ถ้าไม่มี evidence ว่าพัง
- บันทึกสิ่งทีพังก่อน rollback

### 2. No History Rewrite

- ใช้ `git revert` ไม่ใช่ `git reset --hard` หรือ force-push
- เก็บ deploy history ไว้

### 3. Safety

- ถ้ามี migrations ที่ destructive ต้องมี backup ก่อน restore
- ถ้าไม่แน่ใจ → `/ask-me`

## Expected Outcome

- production กลับมา healthy
- มี evidence และ version ที rollback ไป
- root cause issue ถูกสร้างหรือบันทึก
