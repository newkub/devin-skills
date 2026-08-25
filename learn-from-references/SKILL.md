---
name: learn-from-references
description: เรียนรู้จาก references directory และ external sources เพื่อเขียน content ครอบคลุม
---

## Goal

เรียนรู้และสกัดความรู้จาก `references/` directory และ external sources แล้วเขียน content ครอบคลุมทุก features, APIs, และ use cases

## Scope

ใช้เมื่อ skill มี `references/` directory หรือต้องการดึงความรู้จาก reference materials เพื่อเขียน guides, examples, หรือ documentation ครอบคลุม ไม่ใช่สร้าง references (ใช้ `/learn-from-web` สำหรับสร้าง)

## Execute

### 1. Identify References

> Goal: รู้ว่ามี references อะไรให้เรียนรู้

1. รับ target skill directory จาก user
2. อ่าน `references/` directory ทั้งหมด รวม nested directories
3. จัดทำรายการ reference files: ชื่อ, ประเภท (`api`, `cli`, `components`, `guide`, `examples`), ขนาด
4. ถ้าไม่มี `references/` → ทำ `/learn-from-web` สร้างก่อน แล้วกลับมาทำขั้นตอนนี้
5. ถ้าเป็น skill ที่มี dependencies → ตรวจว่าทุก dependency มี reference file

### 2. Extract Knowledge From References

> Goal: สกัดความรู้จาก reference files

1. อ่านทุก reference file ใน `references/`
2. จดบันทึก core concepts, principles, และหลักการสำคัญ
3. ระบุ features และ capabilities หลักทั้งหมด
4. บันทึก code examples และ configuration examples
5. บันทึก best practices, edge cases, และ common pitfalls
6. จัดกลุ่มความรู้ตามประเภท (`features`, `apis`, `use-cases`, `examples`)

### 3. Cross-Check With External Sources

> Goal: ยืนยันความรู้ถูกต้องและทันสมัย

1. ทำ `/check-reference` เพื่อยืนยัน references มีอยู่จริงและถูกต้อง
2. ทำ `/learn-from-web` จาก official docs เพื่อ cross-check ข้อมูลสำคัญ
3. ใช้ `DeepWiki` สำหรับ GitHub repositories ถ้า reference มาจาก repo
4. ใช้ `Context7` สำหรับ libraries และ frameworks
5. ถ้าข้อมูลไม่ตรงกัน → ใช้ official docs เป็นแหล่งหลักและอัปเดต reference

### 4. Analyze Coverage Gaps

> Goal: ระบุส่วนที่ยังไม่ครอบคลุม

1. เปรียบเทียบความรู้ที่สกัดได้กับ `SKILL.md` และ content ที่มี
2. ระบุ gaps: features ที่ไม่มี guide, APIs ที่ไม่มี examples, use cases ที่ไม่มี docs
3. ทำ `/follow-coverage` เพื่อวิเคราะห์และเติม gaps อย่างครอบคลุม
4. จัดลำดับ gaps ตาม impact และ priority
5. ทำ `/report-table` สรุป gaps: ประเภท, สิ่งที่ขาด, priority, impact

### 5. Write Content From References

> Goal: เขียน content ครอบคลุมจากความรู้ที่สกัดได้

1. เขียน guides สำหรับ features ที่ขาด (Getting Started สำคัญที่สุด)
2. เขียน examples ที่ใช้งานได้จริง แบบ copy-paste จาก reference examples
3. เขียน API references ครอบคลุม endpoints, methods, parameters, responses
4. เขียน key-concepts อธิบาย `why` และ `how` นอกจาก `what`
5. เขียน principles สำหรับ best practices
6. ทำ `/follow-content-quality` สำหรับ content ใหม่ทุกชิ้น
7. ถ้าต้องเขียน >10 ไฟล์ → ทำ `/use-scripts`

### 6. Verify And Update

> Goal: ยืนยัน content ครอบคลุมและ references ครบถ้วน

1. ทำ `/follow-coverage` เพื่อยืนยัน coverage ครบ
2. ทำ `/check-reference` เพื่อตรวจ references ครบถ้วน
3. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด
4. ทำ `/update-reference` ถ้ามีการเพิ่มไฟล์ใหม่หรือเปลี่ยนชื่อ
5. ทำ `/report-table` สรุป content ที่เขียนและ coverage ที่เพิ่มขึ้น

## Rules

### 1. Source Priority

- `references/` directory เป็นแหล่งหลักสำหรับเรียนรู้
- ใช้ `/learn-from-web` จาก official docs เพื่อ cross-check
- ลำดับ: `references/` → `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ถ้า reference ขัดแย้งกับ official docs → อัปเดต reference ตาม official docs

### 2. Coverage With Follow-Coverage

- ทำ `/follow-coverage` เพื่อ ensure content ครอบคลุมทุก aspects
- ทุก features ต้องมี guide, ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation, ทุก concepts ต้องมี explanations

### 3. Content Quality

- ทำ `/follow-content-quality` สำหรับ content ใหม่ทุกชิ้น
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder

### 4. Safety

- ไม่ทำลาย references หรือ content เดิม
- ถ้ามีการ overwrite ไฟล์เดิม → user confirmation ก่อน
- ถ้า reference จำเป็นไม่มี → stop และ report

## Expected Outcome

- ความรู้จาก `references/` ถูกสกัดและ cross-check กับ external sources
- content ครอบคลุมทุก features, APIs, use cases ที่อ้างถึงใน references
- gaps ทั้งหมดถูกเติมให้ครบผ่าน `/follow-coverage`
- ไฟล์ใหม่ทุกไฟล์ผ่าน `/follow-content-quality` ไม่เกิน 250 บรรทัด
- references ครบถ้วน ไม่มี missing/unused
- รายงาน content ที่เขียนและ coverage ที่เพิ่มขึ้นชัดเจน
