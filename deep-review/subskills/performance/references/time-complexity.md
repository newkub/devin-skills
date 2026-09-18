# Time Complexity Review

## Goal

วิเคราะห์ Big O และ algorithmic complexity บน critical paths เพื่อระบุ bottleneck, ตรวจสอบ data structure selection และจัดลำดับ severity

## Scope

ใช้สำหรับ review โค้ดที่เกี่ยวข้องกับ:

- loops, recursion, nested iteration
- sorting, searching, traversal
- data structure operations เช่น lookup, insert, delete
- dynamic programming, backtracking, divide and conquer

ไม่รวม optimization ระดับ hardware หรือ compiler-level

## Common Complexities

| Complexity | Name | Growth | Typical Code Pattern |
|---|---|---|---|
| O(1) | Constant | ไม่ขึ้นกับ input size | hash lookup, array index access, simple arithmetic |
| O(log n) | Logarithmic | ช้ามาก | binary search, divide by half |
| O(n) | Linear | ตาม input size | single loop, linear scan |
| O(n log n) | Linearithmic | n คูณ log n | efficient sort, divide and conquer with merge |
| O(n^2) | Quadratic | ตาม n กำลังสอง | nested loops over same set |
| O(2^n) | Exponential | เพิ่มทวีคูณ | brute force subsets, recursion with 2 branches |

## How to Identify from Code

1. นับจำนวน loops ซ้อนกัน:
   - loop เดียวครอบ n -> O(n)
   - loop ซ้อนกัน 2 ชั้นบน n -> O(n^2)
   - loop ซ้อนกัน k ชั้นบน n -> O(n^k)
2. ดู recursion branching:
   - เรียกตัวเอง b ครั้ง ลึก d ชั้น -> O(b^d)
   - เรียกตัวเอง 1 ครั้ง ลด n ครึ่ง -> O(log n) หรือ O(n) ขึ้นกับงานต่อ node
3. ดู built-in sort: ส่วนใหญ่ O(n log n)
4. ดู search:
   - linear scan -> O(n)
   - binary search -> O(log n)
5. รวม sequential blocks โดยเอา term สูงสุด
6. ลบ constants และ lower-order terms: O(2n + 5) -> O(n)
7. ประเมิน worst case เวลาไม่มีข้อมูลชัดเจน

## Budget Thresholds

| Input Size | Hot Path Allowed | Cold Path Allowed |
|---|---|---|
| n <= 10 | O(2^n) | O(2^n) |
| n <= 100 | O(n^2) | O(n^2) |
| n <= 1,000 | O(n log n) | O(n^2) |
| n <= 10,000 | O(n log n) | O(n^2) |
| n <= 100,000 | O(n) | O(n log n) |
| n <= 1,000,000 | O(n) | O(n log n) |
| n > 1,000,000 | O(log n) / O(1) | O(n) |

- hot path: ทำงานบ่อย, อยู่บน request critical path, หรือต้อง real-time
- cold path: ทำงานนานๆ ครั้ง, startup, batch, admin tool

## Severity Mapping

- Critical: complexity เกิน budget 10 เท่าบน hot path หรือ O(2^n) บน n > 20
- High: complexity เกิน budget บน hot path
- Medium: complexity เกิน budget บน cold path หรือใช้ data structure ไม่เหมาะสม
- Low: complexity ใกล้ budget หรือมีวิธี optimize ได้เล็กน้อย

## Rules

- ระบุ input size จริงหรือประเมินค่าสูงสุด
- วิเคราะห์ hot path ก่อน cold path
- ระบุชื่อ function, file path, line number สำหรับทุก finding
- ใช้ `/use-astgrep` เพื่อหา nested loops, recursion patterns, หรือ sorting บน critical paths
- อ้างอิง `references/scoring.md` เมื่อคำนวณ score

## Expected Outcome

- ทุก critical path มีระบุ Big O
- data structure สอดคล้องกับ operation และ input size
- severity ชัดเจนและสอดคล้องกับ budget thresholds
