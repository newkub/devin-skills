---
name: search-api-references
description: ค้นหา API references จากหลายแหล่งด้วย /deep-research
argument-hint: "[api-or-library]"
related:
  - deep-research
  - follow-best-practice
  - learn-from-web
  - check-reference
---

## Goal

ค้นหา API references ที่น่าเชื่อถือสำหรับ API, library, หรือ tool ทีระบุ สรุปเป็นรายการพร้อมแหล่งอ้างอิง

## Scope

ใช้เมื่อต้องการหา references ของ API/library/tool ใหม่หรือตรวจสอบ API ทีมีอยู่ โดยเน้นการค้นหาจากหลายแหล่งด้วย /deep-research

## Execute

### 1. Parse Query

> Goal: เข้าใจสิ่งทีต้องค้นหา

1. อ่านชื่อ API/library/tool จาก argument
2. ระบุ scope: version, language, framework, platform
3. ระบุประเภทข้อมูลทีต้องการ (official docs, examples, tutorials, benchmarks)
4. ถ้า query ไม่ชัดเจน → ใช้ `/ask-me` ก่อน

### 2. Plan Research

> Goal: กำหนด strategy การค้นหา

1. เลือก sources หลัก: official docs, GitHub repo, NPM registry, DeepWiki, Context7
2. ระบุคำค้นหาย่อยเพื่อ cross-reference
3. กำหนดลำดับ: official → code repo → community

### 3. Run Deep Research

> Goal: รวบรวม references จากหลายแหล่ง

1. ทำ `/deep-research` ด้วย query หลัก
2. ใช้ `/learn-from-web` เพื่ออ่าน official docs เฉพาะเจาะจงถ้ามี URL
3. ใช้ `/follow-best-practice` ถ้าหา best practices ของ API นั้น
4. บันทึก source, URL, version, และคะแนนความน่าเชื่อถือ

### 4. Synthesize References

> Goal: สรุปผลการค้นหา

1. กรอง references ซ้ำซ้อน
2. จัดกลุ่มตามหมวดหมู่ (official, examples, tutorials, comparisons)
3. เรียงลำดับตามความน่าเชื่อถือและความเกี่ยวข้อง
4. สรุป key takeaways 2-5 ข้อ

### 5. Format Output

> Goal: นำเสนอผลลัพธ์ในรูปแบบทีอ่านง่าย

1. ใช้ markdown table หรือ numbered list
2. ระบุ URL, คำอธิบายสั้น, แหล่งทีมา, และปี/version
3. ใช้ภาษาเดียวกับ query
4. แสดงผลในแชททันที

## Rules

### 1. Source Priority

- Official docs เป็นแหล่งหลักเสมอ
- ใช้ GitHub repo สำหรับ source code และ examples
- ใช้ NPM registry สำหรับ package info
- ใช้ community sources (Stack Overflow, blog) เป็น fallback เท่านั้น

### 2. Always Use Deep Research

- ต้องเรียก `/deep-research` ในทุกกรณี
- ไม่ใช้ `/search-web` หรือการค้นหาผิวเดียวแทน `/deep-research`
- ถ้า `/deep-research` ไม่พบข้อมูล ให้รายงาน gaps

### 3. Credibility

- ตรวจสอบปี/version ของข้อมูล
- ตรวจสอบ maintenance status (last commit, release)
- ระบุข้อมูลทียังไม่แน่ใจ

### 4. No Execution

- ไม่แก้ไขไฟล์ project ใดๆ
- ไม่ติดตั้ง dependencies
- เป็นข้อมูล references เท่านั้น

## Expected Outcome

- รายการ API references ครบถ้วน ไม่ซ้ำซ้อน
- มี official source เป็น primary
- ระบุ URL, version, แหล่งทีมา และ key takeaways
- ส่งต่อไปยัง `/follow-best-practice` หรือ `/learn-from-web` ได้
