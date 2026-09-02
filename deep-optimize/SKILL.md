---
name: deep-optimize
description: Optimize codebase แบบลึก ครอบคลุมหลายมิติ พร้อม implement และ validate
argument-hint: "<target>"
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
  - review-performance
  - review-redundancy
  - check-bottlenecks
  - check-dead-code
  - check-unused-deps
  - deep-refactor
  - deep-analyze
  - resolve-errors
  - run-verify
  - run-build
  - run-test-all
  - report
---

## Goal

Optimize codebase แบบละเอียด ครอบคลุม performance, bundle size, dead code, unused dependencies, redundant logic, architecture และ implement การเปลี่ยนแปลงทีจำเป็น

## Scope

ใช้เมื่อ optimize ทั่วไปไม่เพียงพอ หรือต้องการ optimize หลายมิติพร้อมกัน

## Execute

### 1. Define Scope

1. รับ `target` จาก argument
2. ตรวจ ecosystem, build system, test setup
3. ระบุ goals: faster build, smaller bundle, less dead code, better structure
4. ถาม user ถ้า scope ไม่ชัด

### 2. Deep Analysis

1. ทำ `/deep-analyze` บน target
2. ทำ `/review-performance` เพื่อหา hotspots
3. ทำ `/review-redundancy` เพื่อหา duplicate logic
4. ทำ `/check-dead-code`
5. ทำ `/check-unused-deps`
6. ทำ `/check-bottlenecks`
7. วิเคราะห์ bundle / build output ถ้ามี

### 3. Plan Optimizations

1. จัดลำดับ optimizations ตาม impact และ effort
2. แยก quick wins กับ major changes
3. ระบุ public API ทีอาจเปลี่ยน
4. สร้าง plan แล้วทำ `/report-plan` เพื่อ user confirm

### 4. Implement

1. ลบ dead code และ unused dependencies
2. Refactor hotspots ด้วย `/deep-refactor` ถ้าจำเป็น
3. Optimize bundle: code splitting, tree shaking, dynamic imports
4. Optimize performance: memoization, lazy loading, query batching
5. รวม redundant code
6. ถ้าต้องเปลี่ยน architecture → ถาม user ก่อน

### 5. Validate

1. ทำ `/run-verify`
2. ทำ `/run-test-all` ถ้ามี
3. ทำ `/run-build` หรือ `/deep-build` ถ้ามี build
4. ตรวจ `git diff` ย่อย ๆ
5. ถ้า fail → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 รอบ

### 6. Measure

1. บันทึก before/after metrics
2. วัด bundle size, build time, test time, dead code count
3. ทำ `/report-before-after`

### 7. Report

1. สรุป optimizations ทีทำ
2. บอก metrics ก่อน-หลัง
3. ระบุ items ทีค้างและ recommendations
4. ทำ `/report-progress` และ `/suggest-next-action`

## Rules

- ต้องมี user confirmation ก่อนเปลี่ยน public API หรือ architecture
- ไม่ลบ code โดยไม่ตรวจ consumers
- ทุก major change ต้องมี validation
- ถ้า codebase ใหญ่ ให้ใช้ subagents แยกตาม module/package
- ไม่เพิ่ม dependency ใหม่ถ้าไม่จำเป็น
- เก็บ evidence ของ metrics ก่อนและหลัง

## Expected Outcome

- Codebase ถูก optimize หลายมิติ
- Metrics before/after ชัดเจน
- Validation ผ่าน
- User ทราบสิ่งทีเปลี่ยนและผลกระทบ
