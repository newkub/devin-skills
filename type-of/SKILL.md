---
name: type-of
description: ระบุประเภทหรือชนิดของ <exact-name> ใน context ที่ถูกต้อง
argument-hint: "<exact-name>"
related:
  - follow-math-concepts
  - follow-data-structures
  - follow-programming-paradigm
  - report-table
  - check-reference
  - ask-me
---

## Goal

เมื่อผู้ใช้ถาม `type of <exact-name>` หรือ `typeof <exact-name>` หรือ "สิ่งนี้เป็นประเภทอะไร" ให้ระบุประเภท/ชนิดของ <exact-name> และอธิบายอย่างกระชับ

## Scope

ใช้กับ:
- `type of <exact-name>` หรือ `typeof <exact-name>`
- คำถาม "ประเภทของ <exact-name>" หรือ "ชนิดของ <exact-name>" หรือ "<exact-name> คืออะไร"
- libraries, tools, frameworks, languages, data structures, patterns, services, types ในโค้ด

## Execute

### 1. Identify <exact-name> And Context

> Goal: เข้าใจว่าถามเรื่องอะไร

1. ใช้ชื่อตรงตัวที่ user ระบุเป็น <exact-name> จาก prompt เช่น `type of Bun` → <exact-name> = `Bun`
2. ระบุ context: คณิตศาสตร์, programming language, runtime, data, architecture
3. ถ้า user ไม่ได้ระบุชื่อ <exact-name> ให้ถามด้วย `/ask-me`
4. ระบุว่าเป็น type ในแง่ใด (category, runtime type, TS type, set/category)

### 2. Classify

> Goal: จัดประเภทของ <exact-name>

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

1. ตอบตรงประเด็น: "<exact-name> เป็น <type>"
2. ใช้ `/report-table` ถ้ามีหลายมิติที่ต้องเปรียบเทียบ (category, language, use case)
3. อธิบายสั้น ๆ ว่าทำไมจึงเป็นประเภทนั้น
4. ให้ตัวอย่างที่เกี่ยวข้องถ้าช่วยให้เข้าใจ

### 5. Suggest Next

> Goal: แนะนำ action ถัดไป

1. ถ้าเป็น type ในโค้ด แนะนำ skill ที่เกี่ยวข้อง เช่น `/follow-lang-typescript`
2. ถ้าเป็น library/tool แนะนำ `/follow-lib-<exact-name>` หรือ `/follow-tool-<exact-name>` หรือ `/follow-framework-<exact-name>`
3. ทำ `/suggest-next-action` เสมอ

## Rules

### 1. Trigger Patterns

- `type of <exact-name>` หรือ `typeof <exact-name>` หรือ "ประเภทของ <exact-name>"
- รองรับคำถามภาษาไทยและอังกฤษ
- ใช้ชื่อตรงตัวที่ user ระบุเป็น <exact-name> ไม่ดึงหรือแปลงเป็นคำอื่น

### 2. Be Precise

- ไม่เดา type ถ้าไม่แน่ใจ
- แยกแยะระหว่าง runtime type, static type, category, domain
- ระบุหลายประเภทได้ถ้า <exact-name> มีลักษณะทับซ้อนกัน

### 3. Output

- ตอบตรงประเด็นก่อน
- ใช้ตารางถ้ามีหลายมิติ
- ไม่ยืดยาวเกินไป

### 4. References

- อ้างอิง source ถ้าตรวจสอบได้
- ไม่สร้างข้อมูลที่ตรวจสอบไม่ได้

## Expected Outcome

- ระบุ type/category ของ <exact-name> ได้อย่างชัดเจน
- อธิบายเหตุผลสั้น ๆ
- ใช้ตารางได้ถ้ามีหลายมิติ
- แนะนำ next action/skill ที่เหมาะสม
