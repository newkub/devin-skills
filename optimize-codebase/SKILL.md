---
name: optimize-codebase
description: วิเคราะห์และ optimize codebase เพื่อความเร็ว ขนาด โครงสร้าง และลบสิ่งไม่จำเป็น
argument-hint: "<path-or-target>"
allowed-tools:
  - read
  - write
  - edit
  - grep
  - find_file_by_name
  - exec
  - skill
  - run_subagent
  - ask_user_question
  - todo_write
triggers:
  - user
  - model
related:
  - deep-optimize
  - review-performance
  - check-bottlenecks
  - check-dead-code
  - check-unused-deps
  - review-redundancy
  - deep-refactor
  - resolve-errors
  - run-verify
  - run-build
  - report
---

## Goal

วิเคราะห์ codebase หาโอกาส optimize เรื่อง performance, bundle size, dead code, unused dependencies, redundant code และโครงสร้าง แล้วแก้ไขหรือแนะนำการแก้ไข

## Scope

ใช้เมื่อต้องการ optimize codebase ก่อนหรือระหว่าง ship รองรับทั้ง quick wins และการวิเคราะห์ลึก

## Execute

### 1. Identify Target

1. รับ `path-or-target` จาก argument
2. ถ้าไม่ระบุให้ถาม user
3. ตรวจ ecosystem จาก `package.json`, `Cargo.toml`, `go.mod` เพื่อเลือก tools ถูกต้อง

### 2. Scan For Optimization Opportunities

1. ทำ `/scan-codebase` เพื่อหา patterns, consumers, hot files
2. ทำ `/check-dead-code` เพื่อหา code ทีไม่ถูกใช้
3. ทำ `/check-unused-deps` เพื่อหา dependencies ส่วนเกิน
4. ทำ `/check-bottlenecks` เพื่อหา performance issues
5. ทำ `/review-redundancy` เพื่อหา duplicate logic
6. ทำ `/review-performance` เพื่อหา hotspots

### 3. Prioritize

1. จัดลำดับ findings ตาม impact และ effort
2. ระบุ quick wins ทีปลอดภัยและแก้ได้ทันที
3. ระบุ items ทีต้อง user confirmation ก่อนแก้

### 4. Apply Quick Wins

1. ลบ dead code ทีปลอดภัย
2. ลบ unused dependencies
3. รวม duplicate imports หรือ constants
4. แก้ไขง่าย ๆ เช่น remove console.log, ลบ comment ทีไม่จำเป็น
5. ถ้าไม่แน่ใจ → ถาม user ก่อน

### 5. Deep Optimize (Optional)

1. ถ้าพบปัญหาซับซ้อน → ทำ `/deep-optimize`
2. ถ้าพบโครงสร้างไม่ดี → ทำ `/deep-refactor`
3. ถ้าพบ performance ลึก → ทำ `/deep-analyze`

### 6. Validate

1. ทำ `/run-verify`
2. ทำ `/run-build` ถ้ามี build
3. รัน test ถ้าจำเป็น
4. ตรวจ `git diff` เพื่อตรวจสอบความถูกต้อง
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry

### 7. Report

1. สรุป findings ทีแก้ ทีค้าง และ recommendations
2. บอก metrics เช่น dead code removed, bundle size delta, files changed
3. ทำ `/report` และ `/suggest-next-action`

## Rules

- ไม่ลบ code ทีอาจมี consumer โดยไม่ตรวจ `grep` หรือ `/scan-codebase`
- ไม่เพิ่ม dependency ใหม่ ถ้าทำได้ด้วย built-in หรือ refactoring
- ถ้า optimization เปลี่ยน public API ให้ถาม user ก่อน
- ถ้าไม่แน่ใจว่า code ใช้หรือไม่ ให้ถามก่อนลบ
- ต้องมี validation หลังทุกการเปลี่ยนแปลงสำคัญ
- ถ้าผลกระทบใหญ่ → ทำ `/deep-optimize` แทนการแก้เอง

## Expected Outcome

- Codebase ลด dead code, unused deps, redundancy
- Performance hotspots ถูกระบุและแก้ไขตาม impact
- Validation ผ่านหลัง optimize
- รายงาน before/after ชัดเจน
