---
name: learn-from-references
description: เรียนรู้จาก references/, official docs, web sources และ CLI แล้วเขียน content ครอบคลุม
argument-hint: "[scope-or-source]"
related:
  - learn
  - check-reference
  - follow-coverage
  - report
  - review-writing
  - use-scripts
  - update-references
  - deep-research
  - follow-best-practice
  - report-uxui-all-routes
---

## Goal

เรียนรู้และสกัดความรู้จาก `references/` directory, official docs/web sources และ CLI tools แล้วเขียน content หรือ reference files ครอบคลุมทุก features, APIs และ use cases

## Scope

ใช้เมื่อต้องดึงความรู้เพื่อเขียน guides, examples, documentation หรือ `references/` files โดยเลือก source ตาม target:

- `references/` directory ของ skill → อ่านและสกัดจากไฟล์ที่มีอยู่
- tool/library/framework → web sources (official docs, DeepWiki, Context7)
- CLI tool → discovery ผ่าน `--help`, subcommands และ output

ไม่ใช่สร้าง reference จาก codebase โดยตรง (ใช้ `/learn-codebase`)

## Execute

### 1. Identify Sources

> Goal: รู้ว่ามี references หรือ sources อะไรให้เรียนรู้

1. รับ target (skill directory, tool, library หรือ topic) จาก user
2. ถ้า target มี `references/` → อ่านทั้งหมดรวม nested directories แล้วจัดรายการ: ชื่อ, ประเภท (`api`, `cli`, `components`, `guide`, `examples`), ขนาด
3. ถ้าไม่มี `references/` แต่ต้องการสร้าง → ทำ step 3 (web) หรือ step 4 (cli) ตาม source แล้วเขียนตาม [references/write-references.md](references/write-references.md)
4. ถ้าเป็น skill ที่มี dependencies → ตรวจว่าทุก dependency มี reference file
5. เลือก source path: `references/` → step 2, web/docs → step 3, CLI → step 4 (ทำได้หลาย path)

### 2. Extract Knowledge From References

> Goal: สกัดความรู้จาก reference files ที่มีอยู่

1. อ่านทุก reference file ใน `references/`
2. จดบันทึก core concepts, principles และหลักการสำคัญ
3. ระบุ features และ capabilities หลักทั้งหมด
4. บันทึก code examples, configuration examples, best practices, edge cases และ common pitfalls
5. จัดกลุ่มความรู้ตามประเภท (`features`, `apis`, `use-cases`, `examples`)

### 3. Learn From Web Sources

> Goal: เรียนรู้จาก official docs และ web sources อย่างเป็นระบบ

ทำตาม [references/web-research.md](references/web-research.md) — ลำดับ `Official Docs` → `DeepWiki` → `Context7` → `Web Search`

### 4. Learn CLI Tools

> Goal: รู้ว่า CLI มี subcommands, options, flags และ output อย่างไร

ทำตาม [references/cli-discovery.md](references/cli-discovery.md)

### 5. Cross-Check And Coverage

> Goal: ยืนยันความรู้ถูกต้อง ทันสมัย และครอบคลุม

1. ทำ `/check-reference` เพื่อยืนยัน references มีอยู่จริงและถูกต้อง
2. ทำ `/learn-from-references` step 3 จาก official docs เพื่อ cross-check ข้อมูลสำคัญ
3. ใช้ `DeepWiki` สำหรับ GitHub repositories, `Context7` สำหรับ libraries
4. ถ้าข้อมูลไม่ตรงกัน → ใช้ official docs เป็นแหล่งหลักและอัปเดต reference
5. เปรียบเทียบความรู้กับ `SKILL.md` และ content ที่มี → ระบุ gaps แล้วทำ `/follow-coverage`
6. ทำ `/report` สรุป gaps: ประเภท, สิ่งที่ขาด, priority, impact

### 6. Write Content And References

> Goal: เขียน content และ reference files ครอบคลุม

1. เขียน guides สำหรับ features ที่ขาด (Getting Started สำคัญที่สุด)
2. เขียน examples ที่ใช้งานได้จริง แบบ copy-paste จาก reference examples
3. เขียน API references ครอบคลุม endpoints, methods, parameters, responses
4. เขียน key-concepts อธิบาย `why` และ `how` นอกจาก `what`
5. ถ้าถูกเรียกเพื่อ dependency ของ skill → เขียน reference files จริงตาม [references/write-references.md](references/write-references.md) (บังคับ ห้ามข้าม)
6. ถ้า project/skill ผูกกับ website framework → สร้าง `references/routes.md` ตาม [references/write-references.md](references/write-references.md)
7. ทำ `/review-writing` สำหรับ content ใหม่ทุกชิ้น
8. ถ้าต้องเขียน >10 ไฟล์ → ทำ `/use-scripts`

### 7. Verify And Update

> Goal: ยืนยัน content ครอบคลุมและ references ครบถ้วน

1. ทำ `/follow-coverage` เพื่อยืนยัน coverage ครบ
2. ทำ `/check-reference` เพื่อตรวจ references ครบถ้วน
3. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด
4. ทำ `/update-references` ถ้ามีการเพิ่มไฟล์ใหม่หรือเปลี่ยนชื่อ
5. ทำ `/report` สรุป content ที่เขียนและ coverage ที่เพิ่มขึ้น

## Rules

### 1. Source Priority

- `references/` directory เป็นแหล่งหลักเมื่อมีอยู่แล้ว
- web research: `Official Docs` → `DeepWiki` → `Context7` → `Web Search` (domain filter เฉพาะ official site ก่อน)
- CLI: `--help`/`--version`/subcommand help และ machine-readable metadata เป็นแหล่งหลัก
- ถ้า reference ขัดแย้งกับ official docs → อัปเดต reference ตาม official docs

### 2. Coverage With Follow-Coverage

- ทำ `/follow-coverage` เพื่อ ensure content ครอบคลุมทุก aspects
- ทุก features ต้องมี guide, ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation, ทุก concepts ต้องมี explanations

### 3. Content Quality

- ทำ `/review-writing` สำหรับ content ใหม่ทุกชิ้น
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ไม่เกิน 250 บรรทัดต่อไฟล์
- ไม่มี TODO/MOCK/placeholder — code examples ต้องมาจาก official docs หรือ reference จริง

### 4. Safety

- ไม่ทำลาย references หรือ content เดิม
- ถ้ามีการ overwrite ไฟล์เดิม → user confirmation ก่อน
- ถ้า reference จำเป็นไม่มี → stop และ report

## Expected Outcome

- ความรู้จาก `references/`, web sources และ/หรือ CLI ถูกสกัดและ cross-check กัน
- content ครอบคลุมทุก features, APIs, use cases ที่อ้างถึงใน references
- gaps ทั้งหมดถูกเติมให้ครบผ่าน `/follow-coverage`
- ถ้าถูกเรียกเพื่อ dependency ของ skill → มี reference files จริงใน `references/` ครบทุก dependency ไม่มี placeholder
- ไฟล์ใหม่ทุกไฟล์ผ่าน `/review-writing` ไม่เกิน 250 บรรทัด
- รายงาน content ที่เขียนและ coverage ที่เพิ่มขึ้นชัดเจน
