# Section Order Validation

กฎการตรวจสอบลำดับ section ใน `README.md`

## Standard Section Order

ลำดับที่ถูกต้องสำหรับ root `README.md`:

1. Status Callout — callout block ด้านบนสุดก่อน Hero
2. Hero — title, tagline, banner image
3. UI Sketch — text codeblock ไม่มี heading วางด้านบน Get Started
4. Get Started — install และ quick start
5. Features — feature table
6. Usage — access methods
7. Project — sub-tables (Goal, Scope, When To Use, Key Concepts, Core Principles, Best Practices)
8. API References — API endpoints และ types
9. Development — Tech Stack, Scripts, Contributing
10. License — ด้านล่างสุดของ root เท่านั้น

## UI Sketch Rules

- ต้องเป็น text codeblock เช่น ` ```text ` ไม่ใช่ ANSI codeblock
- วางด้านบน `## Get Started` โดยไม่มี heading ครอบ
- ถ้าเป็น ANSI codeblock → flag เป็น `Medium`

## License Rules

- License section อยู่ด้านล่างสุดเฉพาะ root `README.md`
- workspace `README.md` ห้ามมี License section (ใช้ของ root)
- ถ้า workspace มี License → flag เป็น `Low`

## Validation Steps

1. อ่าน `README.md` ทั้งหมด
2. ระบุ heading levels (`##`, `###`) ตามลำดับที่ปรากฏ
3. เทียบลำดับกับ standard order ด้านบน
4. ถ้า section ผิดลำดับ → flag ตาม severity:
   - ผิดหลาย section หรือ section สำคัญหาย → `Critical`
   - ผิด 1-2 section ไม่ใช่สำคัญ → `High`
   - UI Sketch ผิด format → `Medium`
5. บันทึก finding พร้อม file path และ line number

## Severity Mapping

| Issue | Severity |
|---|---|
| ไม่มี `README.md` | `Critical` |
| Section order ผิดอย่างรุนแรง | `Critical` |
| ขาด section สำคัญ (Features, Usage, Get Started) | `High` |
| UI Sketch เป็น ANSI หรือมี heading | `Medium` |
| License อยู่ผิดตำแหน่ง | `Medium` |
| workspace มี License section | `Low` |
