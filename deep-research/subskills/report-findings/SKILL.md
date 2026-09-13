---
name: deep-research-report-findings
description: สร้าง research report จาก findings — sources, confidence, comparison, open questions
argument-hint: "[topic]"
related:
  - report
  - create-report-in-dot-devin
  - learn-references
---

## Goal

แปลง findings ของ `/deep-research` เป็น research report ที่ trace ย้อน source ได้ — deliverable หลักของ research workflow

## Scope

- ใช้เมื่อ `/deep-research` dispatch มาที่ `report` หรือเรียก standalone กับ findings ที่มีอยู่
- ครอบคลุม: summary, evidence per claim, confidence levels, source list, open questions
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` ถ้า user ขอ

## Execute

### 1. Organize Findings

> Goal: จัด findings เป็น claims พร้อม evidence

1. แตก findings เป็น claims — แต่ละ claim ผูก source (URL/doc/repo)
2. กำหนด confidence: `verified` (primary source), `likely` (secondary หลายแหล่งตรงกัน), `unverified` (แหล่งเดียว/อนุมาน)
3. flag claims ที่ sources ขัดกัน — แสดงทั้งสองฝั่ง

### 2. Build Report

> Goal: report ที่อ่านแล้วตัดสินใจได้

1. Summary 3-5 บรรทัด — key findings ก่อน
2. ตาราง: `No.`, `Finding`, `Confidence`, `Sources`, `Notes`
3. Comparison matrix ถ้า research เทียบหลายตัวเลือก
4. Open questions — สิ่งที่หาไม่เจอหรือต้อง validate เพิ่ม

### 3. Source List

> Goal: references ครบและตรวจย้อนได้

1. รวม sources ทั้งหมด — primary ก่อน secondary
2. ระบุ access date และชนิด (official docs, repo, benchmark, article)
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

## Rules

- ทุก claim ต้องมีอย่างน้อย 1 source หรือ tag เป็น assumption
- แยก fact จาก interpretation — report ต้องบอกว่าอันไหนคืออะไร
- ห้าม fabricate sources — ถ้า claim ไม่มีหลักฐานให้เขียนว่าไม่พบ

## Expected Outcome

- Research report พร้อม confidence ต่อ claim + source list ครบ
