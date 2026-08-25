---
name: follow-dynamic-programming
description: แก้ปัญหาที่ซับซ้อนด้วย dynamic programming พร้อม memoization, tabulation, optimization
---

## Goal

แก้ปัญหาที่ซับซ้อนด้วย dynamic programming เพื่อลด time complexity และ space complexity

## Scope

ใช้ `follow-dynamic-programming` สำหรับ tasks และ workflows เฉพาะที่ครอบคลุม

## Execute

### 1. Identify DP Problems

> Goal: ระบุปัญหาที่มี overlapping subproblems และ optimal substructure

ระบุปัญหาที่เหมาะกับ dynamic programming

1. หา overlapping subproblems
2. หา optimal substructure
3. ตรวจสอบว่ามี state dependencies
4. หา recurrence relation
5. ตรวจสอบว่ามี repeated calculations

### 2. Design Recurrence

> Goal: ออกแบบ recurrence relation ที่ถูกต้องและวิเคราะห์ complexity

ออกแบบ recurrence relation

1. กำหนด base cases
2. กำหนด state variables
3. กำหนด transition function
4. ตรวจสอบ correctness ของ recurrence
5. วิเคราะห์ complexity

### 3. Choose Approach

> Goal: เลือก approach ที่เหมาะสมระหว่าง memoization และ tabulation

เลือก approach ที่เหมาะสม

1. ใช้ top-down (memoization) เมื่อต้องการความง่าย
2. ใช้ bottom-up (tabulation) เมื่อต้องการ efficiency
3. พิจารณา space optimization
4. พิจารณา time complexity
5. เลือก data structure ที่เหมาะสม

### 4. Implement Memoization

> Goal: ใช้ memoization สำหรับ top-down approach ให้ cache ทำงานถูกต้อง

ใช้ memoization สำหรับ top-down approach

1. สร้าง cache สำหรับ store results
2. เช็ค cache ก่อน calculate
3. store result หลัง calculate
4. เลือก data structure ที่เหมาะสมสำหรับ cache
5. จัดการ cache size

### 5. Implement Tabulation

> Goal: ใช้ tabulation สำหรับ bottom-up approach ให้ table ถูกต้อง

ใช้ tabulation สำหรับ bottom-up approach

1. สร้าง table สำหรับ store results
2. initialize base cases
3. fill table ตาม recurrence
4. optimize space เมื่อเป็นไปได้
5. return final result

### 6. Optimize

> Goal: ปรับปรุง performance ด้วยการลด state space และ space optimization

ปรับปรุง performance

1. ลด state space เมื่อเป็นไปได้
2. ใช้ space optimization techniques
3. ลบ unnecessary calculations
4. ใช้ bitwise operations เมื่อเหมาะสม
5. profile และ benchmark

### 7. Test

> Goal: ยืนยันความถูกต้องของ solution ผ่าน edge cases และ large inputs

ทดสอบ solution

1. Test edge cases
2. Test base cases
3. Test with small inputs
4. Test with large inputs
5. Verify correctness

## Rules

### 1. Problem Identification

ระบุปัญหาที่เหมาะกับ DP อย่างถูกต้อง

- ต้องมี overlapping subproblems
- ต้องมี optimal substructure
- ต้องมี state dependencies
- ต้องมี recurrence relation
- ต้องมี repeated calculations

### 2. Recurrence Design

ออกแบบ recurrence ที่ถูกต้อง

- กำหนด base cases ชัดเจน
- กำหนด state variables ชัดเจน
- กำหนด transition function ชัดเจน
- ตรวจสอบ correctness
- วิเคราะห์ complexity

### 3. Approach Selection

เลือก approach ที่เหมาะสม

- Top-down สำหรับความง่าย
- Bottom-up สำหรับ efficiency
- พิจารณา space optimization
- พิจารณา time complexity
- เลือก data structure ที่เหมาะสม

### 4. Memoization

ใช้ memoization อย่างถูกต้อง

- เช็ค cache ก่อน calculate
- store result หลัง calculate
- เลือก data structure ที่เหมาะสมสำหรับ cache
- จัดการ cache size
- หลีกเลี่ยง cache misses

### 5. Tabulation

ใช้ tabulation อย่างถูกต้อง

- initialize base cases
- fill table ตาม recurrence
- optimize space เมื่อเป็นไปได้
- return final result
- หลีกเลี่ยง out of bounds

### 6. Optimization

ปรับปรุง performance

- ลด state space
- ใช้ space optimization
- ลบ unnecessary calculations
- ใช้ bitwise operations
- profile และ benchmark

### 7. Testing

ทดสอบ solution อย่างครบถ้วน

- Test edge cases
- Test base cases
- Test with small inputs
- Test with large inputs
- Verify correctness

## Expected Outcome

- Problems ที่ซับซ้อนแก้ได้ด้วย DP
- Time complexity ที่ดีขึ้น
- Space complexity ที่ดีขึ้น
- Code ที่ maintain ได้ง่าย
- Solution ที่ correct และ efficient