# Content Coverage Checklist

## Goal

รายละเอียดการเขียน content ครอบคลุมทุก features, APIs และ use cases สำหรับ `review-content-coverage`

## Scope

ใช้กับการ research, สรุปความรู้, วิเคราะห์ gaps, เขียน content ที่ขาด, ตรวจความครบถ้วน และอัปเดต index

## Research From Multiple Sources

1. ใช้ `DeepWiki` สำหรับ GitHub repositories (`read_wiki_structure` → `read_wiki_contents` → `ask_question`)
2. ใช้ `Context7` สำหรับ libraries และ frameworks (`resolve-library-id` → `query-docs`)
3. ใช้ `search_web` เป็น fallback เมื่อไม่มีข้อมูลจากแหล่งอื่น
4. เข้าถึง Official Documentation เสมอ
5. ไม่เรียก `Context7` เกิน 3 ครั้งต่อคำถาม

## Extract Knowledge

1. จดบันทึก core concepts และหลักการที่สำคัญ
2. ระบุ features และ capabilities หลักทั้งหมด
3. บันทึก code examples และ configuration examples
4. บันทึก best practices, edge cases, และ common pitfalls

## Analyze Coverage Gaps

1. ตรวจสอบ features, APIs, use cases ทั้งหมด
2. ระบุ content ที่ยังขาด (guides, examples, references, key-concepts, principles)
3. จัดลำดับ priority ตามความสำคัญและ impact

## Write Missing Content

1. เขียน guides สำหรับ features ที่ยังไม่มี (Getting Started สำคัญที่สุด)
2. เขียน examples ที่ใช้งานได้จริง แบบ copy-paste
3. เขียน API references ครอบคลุม endpoints, methods, parameters, responses
4. เขียน key-concepts อธิบาย "why" และ "how" นอกจาก "what"
5. เขียน principles สำหรับ best practices

## Verify Completeness

1. ตรวจสอบทุก features มี guide
2. ตรวจสอบทุก APIs มี examples
3. ตรวจสอบทุก use cases มี documentation
4. ตรวจสอบทุก concepts มี explanations

## Update Index Files

1. อัปเดต `SKILL.md` ให้ครอบคลุมทุก content
2. อัปเดต sitemap และ references ถ้ามี
3. ตรวจสอบ links ถูกต้อง

## Source Priority

- ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
- ใช้ `Context7` สำหรับ libraries และ frameworks
- เข้าถึง `Official Documentation` เสมอ

## Coverage Rules

- ใช้ kebab-case สำหรับชื่อไฟล์
- จัดลำดับ content ตาม logical flow
- ใช้ index files สำหรับ organization
- ทุก feature, API, use case, concept, best practice ต้องมี content ครอบคลุม
