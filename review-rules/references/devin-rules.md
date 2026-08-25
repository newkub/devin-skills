# `.devin/rules` Checks

## Goal

ตรวจสอบ rules ใน `.devin/rules/` ให้ถูกต้อง ครบถ้วน และไม่ซ้ำซ้อน

## Scope

ใช้สำหรับไฟล์ rules ใน `.devin/rules/` เท่านั้น

## Checks

### 1. Frontmatter

- ตรวจว่ามี `trigger` และค่าถูกต้อง (`always_on`, `model_decision`, `glob`)
- ตรวจว่า `title` เป็น Title Case
- ตรวจว่า `description` ไม่เกิน 100 ตัวอักษร
- ตรวจว่า `glob` ระบุ file pattern ที่ถูกต้องหากมี

### 2. Filename

- ตรวจว่า filename ใช้ kebab-case
- ตรวจว่า filename สื่อใจ intent ของ rule

### 3. Duplicates

- ระบุ rules ที่มี intent ซ้ำกัน (เช่น `import-alias` vs `import-aliases`)
- ถ้ามีหลาย rules คล้ายกัน ให้ merge หรือเลือก canonical
- ลบ duplicate หลัง user confirm

### 4. Completeness

- ตรวจว่า rule มี description ที่อธิบายเงื่อนไขและ expected result
- ตรวจว่า rule ไม่ใช้ placeholder หรือ generic filler
- ตรวจว่า rule ระบุ action, condition หรือ expected result ที่ตีความได้ทางเดียว

## Expected Outcome

- ทุก rule ใน `.devin/rules/` มี frontmatter ครบและถูกต้อง
- ไม่มี duplicate rules
- filename ใช้ kebab-case
