---
title: Section Order Validation
description: กฎตรวจสอบลำดับ sections และขนาดไฟล์
---

# Section Order Validation

## Required Section Order

`AGENT.md` ต้องมี sections ตามลำดับนี้เท่านั้น:

1. `## Goal` — เป้าหมายของ subagent
2. `## Scope` — ขอบเขตการใช้งาน
3. `## Execute` — ขั้นตอนการทำงาน
4. `## Rules` — กฎและข้อจำกัด
5. `## Expected Outcome` — ผลลัพธ์ที่คาดหวัง

## Validation Rules

### Order

- sections ต้องเรียงตามลำดับด้านบน
- ห้ามสลับหรือข้าม section
- ห้ามเพิ่ม section นอกเหนือจากที่กำหนด

### Line Count

- ไฟล์ `AGENT.md` ทั้งหมดต้องไม่เกิน 250 บรรทัด
- นับทั้ง frontmatter และ content
- ถ้าเกิน 250 บรรทัด → flag เป็น High

### Placeholder Check

- ห้ามมี `TODO` ใน content
- ห้ามมี `MOCK` ใน content
- ห้ามมี placeholder text เช่น `lorem ipsum`, `xxx`, `foo bar`
- ถ้าพบ → flag เป็น Medium

## Severity Mapping

| Finding | Severity |
|---|---|
| ขาด section จำเป็น | High |
| ลำดับ sections ผิด | High |
| เกิน 250 บรรทัด | High |
| มี `TODO`/`MOCK`/placeholder | Medium |

## Evidence Format

บันทึก finding พร้อม:

- file path ของ `AGENT.md`
- section ที่มีปัญหา หรือ line number
- เนื้อหาที่พบ
- action ที่แนะนำ
