---
title: Format Validation
description: กฎตรวจสอบ format ของ docs/project/features.md
related:
  - review-features
---

## Goal

ตรวจสอบว่า `docs/project/features.md` ใช้ markdown table columns, domain grouping และไม่มี HTML

## Scope

ใช้ใน Execute step "Check Format" ของ `review-features` — ตรวจ format เท่านั้น ไม่ตรวจ coverage หรือ duplication

## Required Table Columns

1. ตรวจว่ามี markdown table ที่ header row ประกอบด้วย columns ต่อไปนี้ตามลำดับ:

   `| Feature | Description | Module | Domain | Status |`

2. ตรวจว่ามี separator row ใต้ header:

   `| --- | --- | --- | --- | --- |`

3. ตรวจว่าแต่ละ data row มีครบ 5 columns คือ:
   - `Feature` — ชื่อ feature
   - `Description` — คำอธิบายสั้น
   - `Module` — module หรือไฟล์ที่ implement
   - `Domain` — domain grouping
   - `Status` — สถานะ (เช่น `done`, `wip`, `planned`)

4. ถ้า column ขาดหรือลำดับผิด → flag เป็น `High`

## Domain Grouping

1. ตรวจว่า features จัดกลุ่มตาม domain ด้วย heading `## <domain>`
2. แต่ละ heading ต้องอยู่ก่อน table ของ domain นั้น
3. ถ้าไม่มี domain heading → flag เป็น `Medium`
4. ถ้า feature อยู่ใน domain ผิด → flag เป็น `Medium`

## No HTML

1. ตรวจว่าไม่ใช้ HTML tags เช่น `<table>`, `<div>`, `<details>`, `<summary>`
2. ตรวจว่าไม่ใช้ interactive UX elements เช่น `<button>`, `<input>`
3. ใช้ markdown only — ถ้าพบ HTML → flag เป็น `Medium`

## Validation Steps

1. อ่าน `docs/project/features.md`
2. ตรวจ header row ตรงตาม Required Table Columns
3. ตรวจ separator row อยู่ใต้ header
4. ตรวจทุก data row มีครบ 5 columns
5. ตรวจ domain headings ครอบคลุมทุก feature
6. ตรวจไม่มี HTML tags
7. บันทึก findings พร้อม file path และ evidence

## Severity Mapping

- `High`: ขาด table, column ผิดลำดับ, column ขาด
- `Medium`: ขาด domain grouping, HTML แทน markdown, feature อยู่ domain ผิด
- `Low`: spacing ไม่สม่ำเสมอ, separator ใช้ `---` ไม่ครบ

## Expected Outcome

- ยืนยัน format ของ `docs/project/features.md` ถูกต้องตาม columns, domain grouping และ no HTML
- รายงาน findings พร้อม severity และ evidence
