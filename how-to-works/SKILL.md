---
name: how-to-works
description: อธิบายกลไกการทำงานของระบบ tool library หรือ concept ที user ถาม
argument-hint: "<target>"
related:
  - write-how-to
  - summarize
  - learn
  - scan-codebase
  - deep-trace
  - learn-from-web
  - read-related
---

## Goal

อธิบายวิธีการทำงานของระบบ, tool, library, หรือ concept ที user ถาม เป้นลำดับขั้นตอนชัดเจน

## Scope

ใช้เมื่อ user ถาม "X ทำงานอย่างไร", "how does X work", "mechanism ของ X" โดยเน้นเข้าใจกลไกภายใน ไม่ใช่คู่มือทำตาม

## Execute

### 1. Identify Target

> Goal: Identify Target

1. อ่าน `<target>` จาก argument หรือ context
2. ระบุประเภท: `system`, `tool`, `library`, `code`, `concept`
3. ถ้า target ไม่ชัด → ถาม user ให้ระบุ
4. บันทึกระดับความลึกที user ต้องการ (overview หรือ detailed)

### 2. Gather Context

> Goal: Gather Context

1. ถ้า target อยู่ใน project ปัจจุบัน → ทำ `/scan-codebase` หรือ `/deep-trace`
2. ถ้า target เป็น tool/library ภายนอก → ทำ `/learn-from-web` ด้วย official docs
3. ถ้าเกี่ยวข้องกับ skills ใน repo → ทำ `/read-related`
4. รวบรวม source paths, docs, และ examples

### 3. Analyze Mechanism

> Goal: Analyze Mechanism

1. ระบุ inputs และ outputs
2. ระบุ key components หรือ modules
3. วางแผน data flow หรือ execution flow
4. ระบุ state changes, lifecycle, และ edge cases

### 4. Explain Step By Step

> Goal: Explain Step By Step

1. เริ่มด้วย overview สั้นๆ ก่อนลงรายละเอียด
2. แบ่งการทำงานเป็น 3-7 ขั้นตอน
3. แต่ละขั้นตอนระบุ what happens, why, และ how
4. ใช้ analogies หรือตัวอย่างเพื่อช่วยให้เข้าใจ
5. ใช้ `/report-flow`, `/report-table`, หรือ `/draw-tldraw` ถ้าช่วยให้เห็นภาพ

### 5. Validate Understanding

> Goal: Validate Understanding

1. ตรวจสอบว่าอธิบายครบ inputs, process, outputs
2. ยืนยันว่าไม่มี jargon ทีไม่อธิบาย
3. ถ้า user ถามเพิ่ม → ใช้ `/explain` หรือ `/deep-research`

## Rules

### 1. Focus On Mechanism

- เน้น "how" ไม่ใช่ "what" หรือ "how-to"
- อธิบาย cause และ effect ของแต่ละขั้นตอน
- หลีกเลี่ยงรายละเอียดทีไม่จำเป็นจนกระทบความเข้าใจ

### 2. Source Based

- ไม่เดาเนื้อหา
- อ้างอิง official docs, code, หรือ reliable sources
- ถ้าไม่มั่นใจ → บอกว่าเป็นส่วนที่เดาไม่ได้

### 3. Clarity

- ใช้ภาษากระชับ
- ใช้ analogies สำหรับ abstract concepts
- 1 step = 1 idea
- ใช้ backticks สำหรับ code, tools, ชื่อ components

## Expected Outcome

- คำอธิบายกลไกการทำงานของ target ทีชัดเจน
- เรียงลำดับเป้น step ทีเข้าใจง่าย
- ผู้ใช้เข้าใจ "why" และ "how" ของระบบหรือ tool
- ระบุแหล่งอ้างอิงหรือ next skill ถ้าต้องการลงลึก
