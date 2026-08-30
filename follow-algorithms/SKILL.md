---
name: follow-algorithms
description: เลือกและ implement algorithms ตามปัญหาและ complexity ทีเหมาะสม
related:
  - follow-math-combinatorics
  - follow-math-graph-theory
  - follow-math-algorithm-complexity
  - follow-math-discrete-math
  - follow-math-proofs
  - review-quality
  - ask-me
---

## Goal

เลือกและ implement algorithm ทีเหมาะสมกับปัญหา ด้วยการวิเคราะห์ complexity อย่างถูกต้อง

## Scope

ใช้เมื่อต้องแก้ปัญหาด้วย algorithm หรือ optimize existing algorithm

## Execute

### 1. Understand The Problem

> Goal: วิเคราะห์ปัญหาก่อนเลือก algorithm

1. ระบุ input/output ทีต้องการ
2. ระบุ constraints (time, space, data size)
3. ระบุ edge cases
4. ถ้าไม่ชัดให้ `ask-me`

### 2. Choose Algorithm

> Goal: เลือก algorithm ตาม characteristics

1. ค้นหา algorithm ทั่วไปสำหรับปัญหาประเภทนี้ (sorting, searching, graph, DP, greedy)
2. เปรียบเทียบ time/space complexity
3. พิจารณาความง่ายใน implementation และ maintainability
4. เลือก standard library ก่อน implement เอง

### 3. Analyze Complexity

> Goal: วิเคราะห์ก่อน implement

1. คำนวณ best/average/worst time complexity
2. คำนวณ space complexity
3. ระบุ bottlenecks
4. ทำ `/review-quality` อ้างอิง [references/time-complexity.md](references/time-complexity.md) ถ้าต้องการตรวจสอบละเอียด

### 4. Implement

> Goal: เขียน algorithm ให้ถูกต้องและอ่านง่าย

1. ใช้ชื่อตัวแปรและฟังก์ชันทีสื่อความหมาย
2. แบ่งเป็น helper functions ถ้าซับซ้อน
3. เพิ่ม comments สำหรับ tricky parts
4. ใช้ unit tests ครอบคลุม edge cases

### 5. Optimize If Needed

> Goal: ปรับปรุงเมื่อจำเป็น

1. Profile ก่อน optimize
2. พิจารณา trade-off ระหว่าง time/space
3. หลีกเลี่ยง premature optimization
4. เอกสารสาเหตุที optimize

## Rules

### 1. Prefer Standard Libraries

- ใช้ built-in sort, search, collections ก่อน implement เอง
- ใช้ well-known libraries ถ้ามีใน ecosystem
- Implement เองเฉพาะทีจำเป็นจริงๆ

### 2. Document Complexity

- ระบุ time/space complexity ใน comments หรือ docs
- อธิบายทำไมถึงเลือก algorithm นี
- บอก worst case

### 3. Test Edge Cases

- ทดสอบกับ input เปล่า, ขนาดใหญ่, ลำดับพิเศษ
- ทดสอบ worst case ถ้าเป็นไปได้
- ใช้ property-based tests ถ้าเหมาะสม

## Expected Outcome

- Algorithm ทีเลือกเหมาะสมกับปัญหา
- Implementation ถูกต้องและ tested
- Complexity ถูกวิเคราะห์และเอกสารไว้
- ไม่ over-engineer
