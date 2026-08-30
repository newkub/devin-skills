---
name: run-profiler
description: Profile performance เพื่อหา bottlenecks และ optimize
related:
  - follow-best-practice
  - suggest-next-action
  - resolve-errors
  - run-check
  - run-verify
  - review-codebase-everything
---

## Goal

Profile performance เพื่อหา bottlenecks และ optimize

## Scope

ใช้สำหรับ profiling ด้วย Chrome DevTools, Node.js profiler, หรือ Bun profiler เพื่อหา hot paths และ memory issues

## Execute

### 1. Setup Profiling

> Goal: เลือก profiling tool และตั้งค่า environment

1. เลือก profiling tool ที่เหมาะสม (Chrome DevTools, Node.js profiler, Bun profiler)
2. ตั้งค่า profiling environment
3. กำหนด scope ของ profiling

### 2. Capture Profile

> Goal: เริ่ม profiling session และบันทึกข้อมูล

1. เริ่ม profiling session
2. ทำงานที่ต้อง profile (user flow, API call, etc.)
3. หยุด profiling และบันทึกข้อมูล

### 3. Analyze Profile

> Goal: วิเคราะห์ profile data

1. วิเคราะห์ call tree และ flame graph
2. ระบุ functions ที่ใช้เวลานาน
3. ตรวจสอบ memory allocations
4. ดู network requests และ I/O

### 4. Identify Bottlenecks

> Goal: ระบุ hot paths และ inefficient code

1. ระบุ hot paths ใน code
2. ตรวจสอบ unnecessary computations
3. ดู inefficient algorithms
4. ตรวจสอบ memory leaks

### 5. Optimize

> Goal: ปรับปรุง performance ตาม findings

1. ทำ `/review-codebase-everything` เพื่อปรับปรุง
2. ใช้ caching ที่เหมาะสม
3. Optimize algorithms และ data structures
4. ลบ unnecessary work

### 6. Verify Improvements

> Goal: วัดผลหลัง optimize

1. Profile อีกครั้งหลัง optimize
2. เปรียบเทียบกับ profile เดิม
3. ยืนยัน improvements

## Rules

### 1. Profiling Scope

- Profile realistic workloads
- Profile ใน production-like environment
- Profile ช่วงเวลาที่เพียงพอ

### 2. Analysis Focus

- มุ่งเน้นที่ bottlenecks ที่ impact สูง
- ดูทั้ง CPU และ memory
- ตรวจสอบ I/O และ network

### 3. Optimization Strategy

- Optimize สิ่งที่ช้าก่อน
- ใช้ measurements ไม่ใช่ assumptions
- Optimize แบบ iterative

## Expected Outcome

- Performance bottlenecks ถูกระบุ
- Hot paths ถูก optimize
- Memory usage ถูกปรับปรุง
- Performance improvements ถูกวัด
- Code ทำงานเร็วขึ้น
