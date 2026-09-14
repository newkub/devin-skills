---
name: bench-competitors-report-comparison
description: สร้าง competitor comparison report — feature matrix, gap list, re-bench delta
argument-hint: "[phase-or-topic]"
related:
  - create-report-in-dot-devin
  - report
  - compare-competitors
---

## Goal

สร้าง report ของ `/bench-competitors` — comparison matrix + gap list + re-benchmark delta หลัง implement — persistent artifact ใน `.devin/report/`

## Scope

- ใช้เมื่อ `/bench-competitors` dispatch มาที่ `report` หรือต้องการ report เฟสไหนเฟสหนึ่ง
- Output: `/create-report-in-dot-devin` artifact เสมอ (report นี้เป็น deliverable ของ workflow)

## Execute

### 1. Collect Evidence

> Goal: รวม data จาก research/compare/bench phases

1. รวม feature matrix + gap list จาก `/compare-competitors-and-idea-features` output
2. รวม benchmark numbers ต่อ dimension (perf, UX/UI, architecture, DX, security, scalability, business)
3. ถ้า post-implement → รวม re-bench delta (before vs after)
4. ทุก competitor claim ต้องมี source citation

### 2. Build Report Structure

> Goal: report ครบตาม contract ของ parent

1. ตาราง matrix: `No.`, `Dimension/Feature`, `Ours`, `Competitor A`, ..., `Gap`
2. Gap list เรียง priority พร้อม evidence
3. Re-bench delta table ถ้าเป็น post-implement phase
4. จำกัด ≤ 1 A4 page ต่อ competitor — รวม summary เดียวถ้าเยอะ

### 3. Emit Artifact

> Goal: report ถาวรที่ trace ย้อนได้

1. ทำ `/create-report-in-dot-devin` — ตั้งชื่อตาม convention `bench-competitors-<date>`
2. แยก facts จาก assumptions ชัดเจนใน report
3. ลงท้ายด้วย verdict: ดีกว่า/ด้อยกว่า ต่อ dimension

## Rules

- ทุก claim มี citation — ไม่มี citation = ติดป้าย assumption
- ไม่เขียน report ยาว — density สูงกว่า prose
- re-bench delta ต้องใช้ methodology เดียวกับ baseline

## Expected Outcome

- `.devin/report/` artifact พร้อม matrix + gap list + verdict ต่อ dimension
