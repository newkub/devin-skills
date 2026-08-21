---
name: run-profiler
description: Profile performance เพื่อหา bottlenecks และ optimize
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

Profile performance เพื่อหา bottlenecks และ optimize

## Scope

ใช้สำหรับ profiling ด้วย Chrome DevTools, Node.js profiler, หรือ Bun profiler เพื่อหา hot paths และ memory issues

## Execute

### 1. Setup Profiling

เลือก profiling tool และตั้งค่า environment

> Goal: รู้ tool, environment, และ scope ของ profiling

1. เลือก profiling tool ที่เหมาะสม (Chrome DevTools, Node.js profiler, Bun profiler)
2. ตั้งค่า profiling environment
3. กำหนด scope ของ profiling

### 2. Capture Profile

เริ่ม profiling session และบันทึกข้อมูล

> Goal: ได้ profile data ที่สมบูรณ์

1. เริ่ม profiling session
2. ทำงานที่ต้อง profile (user flow, API call, etc.)
3. หยุด profiling และบันทึกข้อมูล

### 3. Analyze Profile

วิเคราะห์ profile data

> Goal: ระบุ functions ที่ช้าและ memory issues

1. วิเคราะห์ call tree และ flame graph
2. ระบุ functions ที่ใช้เวลานาน
3. ตรวจสอบ memory allocations
4. ดู network requests และ I/O

### 4. Identify Bottlenecks

ระบุ hot paths และ inefficient code

> Goal: รู้ bottlenecks ที่ impact สูง

1. ระบุ hot paths ใน code
2. ตรวจสอบ unnecessary computations
3. ดู inefficient algorithms
4. ตรวจสอบ memory leaks

### 5. Optimize

ปรับปรุง performance ตาม findings

> Goal: Bottlenecks ถูก optimize และ verify ผล

1. ทำ `/review-codebase` เพื่อปรับปรุง
2. ใช้ caching ที่เหมาะสม
3. Optimize algorithms และ data structures
4. ลบ unnecessary work

### 6. Verify Improvements

วัดผลหลัง optimize

> Goal: ยืนยันว่า performance ดีขึ้น

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
