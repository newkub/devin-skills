---
name: time-complexity
description: วิเคราะห์และควบคุม time complexity ของ algorithms และ data structures
---

## Goal

วิเคราะห์และควบคุม time complexity ของ code ให้เหมาะสมกับ input size และใช้ data structures ที่ถูกต้อง

## Scope

ใช้สำหรับ projects ที่ต้องการรับประกัน performance ภายใต้ input size ที่คาดการณ์ได้ ไม่ใช้กับ prototype ที่ไม่มี performance requirements

## Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|---|---|---|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

## Review Checklist

### 1. Identify Critical Paths

1. ระบุ hot paths และ functions ที่รับ input ขนาด variable
2. ระบุ functions ที่ process collections: loops, recursion, nested iteration, sorting, searching
3. ระบุ functions ที่ถูกเรียกบ่อย: event handlers, middleware, query builders, render loops
4. ถ้าไม่มี critical path ที่รับ input ขนาด variable → skip

### 2. Classify Complexity

1. วิเคราะห์ loops: single loop = O(n), nested loop = O(n²), binary search = O(log n)
2. วิเคราะห์ recursion: ใช้ Master Theorem หรือ tree method
3. วิเคราะห์ data structure operations: array access = O(1), hash lookup = O(1) avg, tree = O(log n)
4. วิเคราะห์ composed operations: sort + binary search = O(n log n) + O(log n) = O(n log n)
5. บันทึกผลเป็นตาราง: function, input size, complexity, expected max time

### 3. Validate Against Input Bounds

1. ระบุ input size สูงสุดจาก production data หรือ requirements
2. คำนวณ worst-case operations: input size × complexity factor
3. เปรียบเทียบกับ time budget: ถ้า operations เกิน 10⁶ → ต้อง optimize
4. ถ้า input size ไม่ชัด → ใช้ heuristic: UI = 10³, API = 10⁴, batch = 10⁶, data pipeline = 10⁸

### 4. Verify With Benchmarks

1. ทำ `/run-bench` กับ input sizes หลายระดับ: small, medium, large, worst-case
2. ตรวจว่า execution time เติบโตตาม complexity ที่วิเคราะห์
3. ถ้า empirical growth ไม่ตรง theoretical → วิเคราะห์ใหม่ (อาจมี hidden complexity)
4. ทำ `/update-test-and-fix` สำหรับ regression: test กับ input ขนาดสูงสุด

## Data Structure Selection

- ใช้ hash map เมื่อต้อง lookup บ่อยและไม่ต้อง sorting
- ใช้ sorted array เมื่อต้อง search และ range queries
- ใช้ tree เมื่อต้อง insert/delete และ search พร้อมกัน
- ใช้ array เมื่อต้อง random access และ iteration ตามลำดับ
- ใช้ heap เมื่อต้อง min/max และ partial sorting
- ไม่ใช้ linked list เมื่อต้อง random access — ใช้ array

## Anti-Patterns

- ห้าม nested loop กับ collection ขนาด variable โดยไม่วิเคราะห์ — ใช้ hash map หรือ precompute
- ห้าม sort ทุกครั้งที่ query — sort ครั้งเดียวแล้ว binary search
- ห้าม recursive โดยไม่ memoize เมื่อมี overlapping subproblems
- ห้าม `array.indexOf` ใน loop — ใช้ `Set` หรือ `Map` แทน
- ห้าม assume O(1) โดยไม่ตรวจ — hash map worst case = O(n)

## Optimization Principles

- วัดก่อน optimize — ใช้ `/run-bench` ยืนยัน bottleneck จริง
- เปลี่ยน data structure ก่อนเปลี่ยน algorithm — impact ใหญ่กว่าและ risk น้อยกว่า
- ไม่ optimize ก่อนมี evidence — premature optimization เป็น anti-pattern
- ถ้า complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า
- Cache ผลลัพธ์ของ expensive pure functions เมื่อ input ซ้ำบ่อย

## Severity Classification

- Critical: O(n²) บน input > 10⁴ ใน hot path, O(n!) บน input > 10
- High: O(n²) บน input > 10² ใน hot path, missing memoization บน overlapping subproblems
- Medium: suboptimal data structure selection, missing cache บน expensive pure functions
- Low: minor optimization opportunities, readability vs performance trade-offs

## Expected Outcome

- ทุก critical path มี time complexity ที่รับได้กับ input size จริง
- Data structures ถูกเลือกตาม operation pattern
- Benchmarks ยืนยัน empirical growth ตรงกับ theoretical complexity
- Regression tests คุ้มครอง time bounds ของ critical paths
