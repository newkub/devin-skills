# Content Quality And Language Standards

กฎการตรวจสอบ content quality และ language ใน `README.md`

## Language

- content ต้องเป็นภาษาอังกฤษ
- ถ้าพบ content ที่ไม่ใช่อังกฤษ → แนะนำให้ทำ `/translate-to-lang-en`
- ถ้า content ผสมหลายภาษาโดยไม่จำเป็น → flag เป็น `High`

## Real Data No Placeholder

- ใช้ข้อมูลจริงจาก source code เท่านั้น
- ห้ามใช้ placeholder ยกเว้น banner image
- ตัวอย่าง placeholder ที่ต้อง flag:
  - `TODO`, `FIXME`, `your-api-key`, `example.com`
  - `lorem ipsum`, `placeholder text`
  - `<your-name>`, `<your-email>`
- ถ้าพบ placeholder นอกจาก banner image → flag เป็น `High`

## Forbidden Sections

ห้ามมี section เหล่านี้เป็น heading แยก:

- `## Information` — ข้อมูลทั่วไปควรกระจายไปยัง section ที่เกี่ยวข้อง
- `## Key Concepts` — ควรอยู่ใน `## Project` sub-table
- `## Tech Stack` — ควรอยู่ใน `## Development` sub-table

ถ้าพบ section เหล่านี้ → flag เป็น `Medium`

## ANSI Codeblock

- ห้ามใช้ ANSI codeblock ใน `README.md` ทั้งหมด
- ANSI codeblock คือ codeblock ที่มี escape sequences สำหรับสี
- ถ้าพบ ANSI codeblock → flag เป็น `Medium`
- ใช้ text codeblock แทน เช่น ` ```text `

## Validation Steps

1. อ่าน `README.md` ทั้งหมด
2. ตรวจภาษาของ content
3. ค้นหา placeholder patterns
4. ค้นหา forbidden section headings
5. ค้นหา ANSI escape sequences ใน codeblocks
6. บันทึก finding พร้อม file path และ line number
