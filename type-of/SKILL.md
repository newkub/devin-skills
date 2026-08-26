---
name: type-of
description: ระบุประเภทหรือชนิดของ <x> ใน context ที่ถูกต้อง
argument-hint: "<x>"
related:
  - follow-math-concepts
  - follow-data-structures
  - follow-programming-paradigm
  - report-table
  - check-reference
  - ask-me
---

## Goal

เมื่อผู้ใช้ถาม `type of <x>` หรือ `typeof <x>` หรือ "สิ่งนี้เป็นประเภทอะไร" ให้ระบุประเภท/ชนิดของ <x> และอธิบายอย่างกระชับ

## Scope

ใช้กับ:
- `type of <x>` หรือ `typeof <x>`
- คำถาม "ประเภทของ <x>" หรือ "ชนิดของ <x>" หรือ "<x> คืออะไร"
- libraries, tools, frameworks, languages, data structures, patterns, services, types ในโค้ด

## Execute

### 1. Identify <x> And Context

> Goal: เข้าใจว่าถามเรื่องอะไร

1. ดึง <x> จากคำถาม
2. ระบุ context: คณิตศาสตร์, programming language, runtime, data, architecture
3. ถ้า <x> ไม่ชัดหรือมีหลายความหมาย ให้ถามด้วย `/ask-me`
4. ระบุว่าเป็น type ในแง่ใด (category, runtime type, TS type, set/category)

### 2. Classify

> Goal: จัดประเภทของ <x>

1. ถ้าเป็น code/value: ใช้ TypeScript/JavaScript type หรือ runtime type ที่เหมาะสม
2. ถ้าเป็น tool/library: ระบุ category เช่น linter, bundler, ORM, runtime, framework
3. ถ้าเป็น data structure: ระบุ type เช่น list, set, map, tree, graph
4. ถ้าเป็น pattern: ระบุ paradigm/architectural pattern
5. ถ้าเป็น math/abstract: ใช้ concepts จาก `/follow-math-concepts`

### 3. Verify If Uncertain

> Goal: ลดความผิดพลาด

1. ใช้ `/check-reference` เพื่อตรวจสอบ official docs หรือ sources
2. ถ้าเป็น library/tool ให้ใช้ `/learn-from-web` จาก official docs
3. ถ้าไม่สามารถยืนยันได้ ให้ระบุความไม่แน่นอน

### 4. Report

> Goal: นำเสนอผลลัพธ์กระชับ

1. ตอบตรงประเด็น: "<x> เป็น <type>"
2. ใช้ `/report-table` ถ้ามีหลายมิติที่ต้องเปรียบเทียบ (category, language, use case)
3. อธิบายสั้น ๆ ว่าทำไมจึงเป็นประเภทนั้น
4. ให้ตัวอย่างที่เกี่ยวข้องถ้าช่วยให้เข้าใจ

### 5. Suggest Next

> Goal: แนะนำ action ถัดไป

1. ถ้าเป็น type ในโค้ด แนะนำ skill ที่เกี่ยวข้อง เช่น `/follow-lang-typescript`
2. ถ้าเป็น library/tool แนะนำ `/follow-lib-<x>` หรือ `/follow-tool-<x>` หรือ `/follow-framework-<x>`
3. ทำ `/suggest-next-action` เสมอ

## Rules

### 1. Trigger Patterns

- `type of <x>` หรือ `typeof <x>` หรือ "ประเภทของ <x>"
- รองรับคำถามภาษาไทยและอังกฤษ

### 2. Be Precise

- ไม่เดา type ถ้าไม่แน่ใจ
- แยกแยะระหว่าง runtime type, static type, category, domain
- ระบุหลายประเภทได้ถ้า <x> มีลักษณะทับซ้อนกัน

### 3. Output

- ตอบตรงประเด็นก่อน
- ใช้ตารางถ้ามีหลายมิติ
- ไม่ยืดยาวเกินไป

### 4. References

- อ้างอิง source ถ้าตรวจสอบได้
- ไม่สร้างข้อมูลที่ตรวจสอบไม่ได้

## Expected Outcome

- ระบุ type/category ของ <x> ได้อย่างชัดเจน
- อธิบายเหตุผลสั้น ๆ
- ใช้ตารางได้ถ้ามีหลายมิติ
- แนะนำ next action/skill ที่เหมาะสม
