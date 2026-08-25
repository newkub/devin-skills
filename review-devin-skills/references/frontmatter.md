# Frontmatter Validation

ตรวจสอบ frontmatter ของ skill package แต่ละตัว

## Required Fields

- `name` — ต้องมี และตรงกับ directory name
- `description` — ต้องมี และไม่เกิน 100 ตัวอักษร
- `related` — optional แต่ถ้ามีต้องผ่าน validation ทั้งหมด

## Name Validation

- `name` ต้องตรงกับชื่อ directory ที่ skill อยู่
- ถ้า `name` ไม่ตรง directory → flag เป็น Critical
- ตัวอย่าง: skill ใน `skills/run-lint/` ต้องมี `name: run-lint`

## Description Validation

- นับความยาว `description` รวมช่องว่าง
- ถ้าเกิน 100 ตัวอักษร → flag เป็น Low
- `description` ต้องอธิบายว่า skill ทำอะไรและเมื่อไร

## Related Validation

- ตรวจทุก entry ใน `related` ว่ามีอยู่จริงใน skills repo
- ถ้ามี entry ที่ไม่มี skill จริง → flag เป็น High (missing)
- ตรวจว่า skill อื่นมี `related` อ้างกลับมาหรือไม่
- ถ้ามี skill ที่ไม่ถูกอ้างใน `related` ของ skill นี้แต่ควรอ้าง → flag เป็น High (unused)
- ตรวจ circular dependencies: A → B → A → flag เป็น High (circular)

## Scoring

- Critical: ไม่มี `name` หรือ `name` ไม่ตรง directory
- High: `related` missing, unused หรือ circular
- Low: `description` เกิน 100 ตัวอักษร
- Info: `description` สั้นเกินไปหรือไม่ชัดเจน
