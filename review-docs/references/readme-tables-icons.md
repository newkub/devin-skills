# Table Columns And Icon Format

กฎการตรวจสอบ table columns และ icon format ใน `README.md`

## Features Table

Features table ต้องมี 5 columns ตามลำดับ:

| Icon | Feature | Description | Benefit | Usage |
|:---:|---|---|---|---|

- `Icon` จัดกึ่งกลางด้วย `:---:`
- ถ้า columns ไม่ครบหรือผิดลำดับ → flag เป็น `Medium`

## Project Sub-Tables

Project section ต้องมี sub-tables ดังนี้:

- Goal: 4 columns
- Scope: 4 columns
- When To Use: 3 columns
- Key Concepts: 3 columns
- Core Principles: 3 columns
- Best Practices: 3 columns

ถ้า sub-table ขาดหรือ columns ไม่ตรง → flag เป็น `Medium`

## Development Sub-Tables

Development section ต้องมี:

- Tech Stack: 4 columns (เช่น Category, Technology, Version, Purpose)
- Scripts: JSON codeblock ไม่ใช่ table

ถ้า Scripts ไม่เป็น JSON codeblock → flag เป็น `Medium`

## Icon Format

- ใช้ iconify CDN URL: `https://api.iconify.design/<icon-set>/<icon-name>.svg?color=%23<hex>`
- ต้องมี `?color=%23<hex>` สำหรับ color เสมอ
- ห้ามใช้ emoji ในตารางทุกประเภท
- ถ้า icon ไม่มี color parameter → flag เป็น `Medium`
- ถ้าใช้ emoji แทน icon → flag เป็น `Medium`

## Icon Column Alignment

- Icon column ต้องจัดกึ่งกลางด้วย `:---:`
- ถ้าใช้ `:---` หรือ `---:` → flag เป็น `Low`

## Validation Steps

1. ค้นหา table ทุกตารางใน `README.md`
2. ตรวจ column count และ header names
3. ตรวจ icon URLs ว่าใช้ iconify CDN พร้อม color
4. ตรวจ Icon column alignment
5. บันทึก finding พร้อม file path และ line number
