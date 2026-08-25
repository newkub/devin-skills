---
name: review-content-coverage
description: เขียน content ครอบคลุมทุก features, APIs, และ use cases
---

## Goal

เขียน content ครอบคลุมทุก features, APIs, และ use cases โดย research จากแหล่งข้อมูลหลายชั้น

## Scope

ใช้สำหรับเขียน content ที่ครอบคลุมทุก aspects ของ skill, project, หรือ documentation

## Execute

### 1. Research From Multiple Sources

> Goal: Research From Multiple Sources

research ข้อมูลจากแหล่งต่างๆ ตามลำดับความสำคัญ

1. ใช้ `DeepWiki` สำหรับ GitHub repositories (`read_wiki_structure` → `read_wiki_contents` → `ask_question`)
2. ใช้ `Context7` สำหรับ libraries และ frameworks (`resolve-library-id` → `query-docs`)
3. ใช้ `search_web` เป็น fallback เมื่อไม่มีข้อมูลจากแหล่งอื่น
4. เข้าถึง Official Documentation เสมอ
5. ไม่เรียก `Context7` เกิน 3 ครั้งต่อคำถาม

### 2. Extract Knowledge

> Goal: Extract Knowledge

บันทึกความรู้จากการ research

1. จดบันทึก core concepts และหลักการที่สำคัญ
2. ระบุ features และ capabilities หลักทั้งหมด
3. บันทึก code examples และ configuration examples
4. บันทึก best practices, edge cases, และ common pitfalls

### 3. Analyze Coverage Gaps

> Goal: Analyze Coverage Gaps

วิเคราะห์ features ที่ยังไม่มี content

1. ตรวจสอบ features, APIs, use cases ทั้งหมด
2. ระบุ content ที่ยังขาด (guides, examples, references, key-concepts, principles)
3. จัดลำดับ priority ตามความสำคัญและ impact

### 4. Write Missing Content

> Goal: Write Missing Content

เขียน content สำหรับส่วนที่ขาด

1. เขียน guides สำหรับ features ที่ยังไม่มี (Getting Started สำคัญที่สุด)
2. เขียน examples ที่ใช้งานได้จริง แบบ copy-paste
3. เขียน API references ครอบคลุม endpoints, methods, parameters, responses
4. เขียน key-concepts อธิบาย "why" และ "how" นอกจาก "what"
5. เขียน principles สำหรับ best practices

### 5. Verify Completeness

> Goal: Verify Completeness

ตรวจสอบว่า content ครอบคลุมทุก aspects

1. ตรวจสอบทุก features มี guide
2. ตรวจสอบทุก APIs มี examples
3. ตรวจสอบทุก use cases มี documentation
4. ตรวจสอบทุก concepts มี explanations

### 6. Update Index Files

> Goal: Update Index Files

อัปเดต index files ให้ครบถ้วน

1. อัปเดต `SKILL.md` ให้ครอบคลุมทุก content
2. อัปเดต sitemap และ references ถ้ามี
3. ตรวจสอบ links ถูกต้อง

## Rules

### 1. Source Priority

- ลำดับแหล่งข้อมูล: `DeepWiki` → `Context7` → `Web Search` → `Official Docs`
- ใช้ `DeepWiki` ก่อนถ้าเป็น GitHub repository
- ใช้ `Context7` สำหรับ libraries และ frameworks
- เข้าถึง `Official Documentation` เสมอ

### 2. Content Quality

- ทำ `/review-writing` สำหรับจัดรูปแบบและคุณภาพเนื้อหา
- ใช้ kebab-case สำหรับชื่อไฟล์
- จัดลำดับ content ตาม logical flow
- ใช้ index files สำหรับ organization

### 3. Coverage Requirements

- ทุก features ต้องมี guide
- ทุก APIs ต้องมี examples
- ทุก use cases ต้องมี documentation
- ทุก concepts ต้องมี explanations
- ทุก best practices ต้องมี guidelines

## Expected Outcome

- Content ครอบคลุมทุก features, APIs, และ use cases
- ข้อมูลถูกต้องและเป็นปัจจุบันจาก multiple sources
- Guides ครบถ้วนและอ่านง่าย
- Examples ที่ใช้งานได้จริง
- References ที่ถูกต้องและอัปเดต
- Index files ครบถ้วนและถูกต้อง