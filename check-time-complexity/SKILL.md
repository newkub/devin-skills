---
name: check-time-complexity
description: วิเคราะห์และควบคุม time complexity ของ algorithms และ data structures
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - delete
---
## Goal

วิเคราะห์และควบคุม time complexity ของ code ให้เหมาะสมกับ input size และใช้ data structures ที่ถูกต้อง

## Scope

ใช้สำหรับ projects ที่ต้องการรับประกัน performance ภายใต้ input size ที่คาดการณ์ได้ ไม่ใช้กับ prototype ที่ไม่มี performance requirements

## Execute

### 1. Identify Critical Paths

> Goal: ระบุ code paths ที่ต้องวิเคราะห์ time complexity
> Goal: รู้ว่าต้องวิเคราะห์ฟังก์ชันใดบ้าง

1. ทำ `/deep-analyze-by-use-scripts` เพื่อหา hot paths และ functions ที่รับ input ขนาด variable
2. ระบุ functions ที่ process collections: loops, recursion, nested iterations, sorting, searching
3. ระบุ functions ที่ถูกเรียกบ่อยใน hot paths: event handlers, middleware, query builders, render loops
4. ถ้าไม่มี critical path ที่รับ input ขนาด variable → stop และ report

### 2. Classify Complexity

> Goal: วิเคราะห์ Big O ของแต่ละ critical path
> Goal: รู้ time complexity ของทุก critical path

1. วิเคราะห์ loops: single loop = O(n), nested loop = O(n²), binary search = O(log n)
2. วิเคราะห์ recursion: ใช้ Master Theorem หรือ tree method — ถ้าไม่ชัด → ทำ `/deep-review`
3. วิเคราะห์ data structure operations: array access = O(1), hash lookup = O(1) avg, tree = O(log n), sorted array search = O(log n)
4. วิเคราะห์ composed operations: เช่น sort แล้ว binary search = O(n log n) + O(log n) = O(n log n)
5. บันทึกผลลัพธ์เป็นตาราง: function, input size, complexity, expected max time

### 3. Validate Against Input Bounds

> Goal: ตรวจสอบว่า complexity รับได้กับ input size จริง
> Goal: ยืนยันว่า code ทำงานได้ภายใน time budget ที่กำหนด

1. ระบุ input size สูงสุดจาก production data หรือ requirements
2. คำนวณ worst-case operations: input size × complexity factor
3. เปรียบเทียบกับ time budget: ถ้า operations เกิน 10⁶ → ต้อง optimize
4. ถ้า input size ไม่ชัด → ใช้ heuristic: UI = 10³, API = 10⁴, batch = 10⁶, data pipeline = 10⁸
5. ถ้า complexity เกิน budget → ไป Step 4; ถ้าไม่เกิน → ไป Step 5

### 4. Optimize Complexity

> Goal: ลด time complexity ของ paths ที่เกิน budget
> Goal: ทุก critical path อยู่ใน time budget

1. เปลี่ยน data structure: array → hash map (O(n) → O(1) lookup), array → sorted array (O(n) → O(log n) search)
2. ลด nested loops: ใช้ hash map แทน inner loop, ใช้ two-pointer technique, ใช้ sliding window
3. ลด recursion: ใช้ memoization (exponential → polynomial), ใช้ tabulation (recursive → iterative)
4. แคลง expensive operations: precompute, lazy evaluate, หรือ cache results
5. Optimize เพิ่มเติมเช่น batch processing, parallelism, หรือ algorithm replacement
6. ถ้า optimize ไม่ได้ → report constraint และเสนอ alternative approach

### 5. Verify With Benchmarks

> Goal: ทดสอบว่า complexity จริงตรงกับการวิเคราะห์
> Goal: ยืนยัน empirical performance ตรงกับ theoretical complexity

1. ทำ `/run-bench` กับ input sizes หลายระดับ: small, medium, large, worst-case
2. ตรวจว่า execution time เติบโตตาม complexity ที่วิเคราะห์ — เช่น O(n²) ต้องเติบโต 4× เมื่อ input 2×
3. ถ้า empirical growth ไม่ตรง theoretical → วิเคราะห์ใหม่ (อาจมี hidden complexity เช่น hash collisions)
4. ทำ `/write-test` สำหรับ regression: test กับ input ขนาดสูงสุดและตรวจ time bound
5. ถ้า benchmark fail → กลับไป Step 4 และ optimize ใหม่

## Rules

### 1. Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|------------|----------------------|----------|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

### 2. Data Structure Selection

- ใช้ hash map เมื่อต้อง lookup บ่อยและไม่ต้อง sorting
- ใช้ sorted array เมื่อต้อง search และ range queries
- ใช้ tree เมื่อต้อง insert/delete และ search พร้อมกัน
- ใช้ array เมื่อต้อง random access และ iteration ตามลำดับ
- ใช้ heap เมื่อต้อง min/max และ partial sorting
- ไม่ใช้ linked list เมื่อต้อง random access — ใช้ array

### 3. Optimization Principles

- วัดก่อน optimize — ใช้ `/run-bench` ยืนยัน bottleneck จริง
- เปลี่ยน data structure ก่อนเปลี่ยน algorithm — impact ใหญ่กว่าและ risk น้อยกว่า
- ไม่ optimize ก่อนมี evidence — premature optimization เป็น anti-pattern
- ถ้า complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า
- Cache ผลลัพธ์ของ expensive pure functions เมื่อ input ซ้ำบ่อย

### 4. Anti-Patterns

- ห้าม nested loop กับ collection ขนาด variable โดยไม่วิเคราะห์ — ใช้ hash map หรือ precompute
- ห้าม sort ทุกครั้งที่ query — sort ครั้งเดียวแล้ว binary search
- ห้าม recursive โดยไม่ memoize เมื่อมี overlapping subproblems
- ห้าม array.indexOf ใน loop — ใช้ Set หรือ Map แทน
- ห้าม assume O(1) โดยไม่ตรวจ — hash map worst case = O(n)

## Expected Outcome

- ทุก critical path มี time complexity ที่รับได้กับ input size จริง
- Data structures ถูกเลือกตาม operation pattern ไม่ใช่ความเคยชิน
- Benchmarks ยืนยัน empirical growth ตรงกับ theoretical complexity
- Regression tests คุ้มครอง time bounds ของ critical paths
