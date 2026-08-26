---
name: create-similar
description: สร้างไฟล์ skill หรือ project ใหม่โดยอ้างอิงโครงสร้างจากตัวอย่าง
related:
  - at-this-repo
  - follow-create-devin-skills
  - review-naming
  - consider-use-in-another-skills
  - edit-by-use-scripts
  - validate
---

## Goal

สร้างสิ่งใหม่ทีมีโครงสร้างคล้ายตัวอย่างทีมีอยู่ โดยปรับชื่อและ context ให้เหมาะสม

## Scope

ใช้เมื่อต้องการสร้าง skill, file, component, หรือ project structure ใหม่โดยอ้างอิงจากตัวอย่างเดิม เช่น สร้าง `at-<repo>` จาก `at-this-repo`

## Execute

### 1. Identify Example

> Goal: ระบุตัวอย่างทีจะคัดลอก

1. ถ้า user ระบุ path หรือ skill name → อ่านทันที
2. ถ้าไม่ระบุ → หาไฟล์/ directory ทีใกล้เคียงกับ target ด้วย `/search-files-patterns`
3. ยืนยันว่า example เป็นต้นฉบับทีถูกต้อง

### 2. Analyze Structure

> Goal: เข้าใจโครงสร้างและส่วนทีต้องเปลี่ยน

1. อ่านไฟล์ทั้งหมดใน example
2. แยกส่วนประกอบ: frontmatter, sections, commands, references, names
3. ระบุ identifiers ทีผูกกับ example (directory name, skill name, URLs, paths)
4. บันทึกรายการทีต้อง replace

### 3. Define Target

> Goal: กำหนดสิ่งทีจะสร้าง

1. รับ target name จาก user
2. ตรวจสอบความถูกต้องของชื่อ (kebab-case, ไม่ซ้ำ, ไม่มีอักขระพิเศษ)
3. รับ context หรือ scope ทีแตกต่างจาก example
4. ถ้าไม่ชัด → ทำ `/ask-me`

### 4. Create Copy

> Goal: สร้างไฟล์/ directory ใหม่

1. สร้าง target directory ถ้าจำเป็น
2. คัดลอกไฟล์จาก example ไปยัง target
3. ถ้ามีหลายไฟล์ → คัดลอกทั้งหมด
4. ไม่ overwrite ไฟล์เดิม

### 5. Replace Identifiers

> Goal: ปรับ example ให้ตรงกับ target

1. แทนทีชื่อ example ด้วย target name ในทุกไฟล์
2. แทนที directory references
3. แทนที URLs, paths, project-specific names
4. ถ้าเป็น skill → อัปเดต `name` ใน frontmatter
5. ถ้ามี `description` → ปรับให้สอดคล้อง

### 6. Adapt Content

> Goal: ปรับเนื้อหาให้เหมาะกับ target

1. ปรับ `## Goal` และ `## Scope` ตาม context
2. ปรับ commands, examples, และ paths
3. ลบข้อมูลเฉพาะของ example ทีไม่เกี่ยวข้อง
4. ถ้ามี `related` → อัปเดตให้ถูกต้อง

### 7. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจสอบว่า `name` ตรง directory name
2. ตรวจสอบว่าไม่มี broken references
3. ทำ `/validate` สำหรับ skill
4. ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

## Rules

- ไม่ overwrite ไฟล์เดิม ถ้ามีอยู่แล้วให้ stop หรือถาม user
- เปลี่ยนทุก identifiers ทีขาดไม่ได้
- ไม่คัดลอก secrets, API keys, credentials
- ถ้าเป็น skill ให้ `name` ตรง directory name
- ไม่เดา context ถ้าไม่ชัด → ใช้ `/ask-me`
- ถ้าสร้าง skill ใหม่ → อัปเดต `AGENTS.md`

## Expected Outcome

- สร้างไฟล์/ directory ใหม่ทีคล้าย example แต่ปรับตาม target
- ไม่มี broken references
- `name` ตรง directory name
- ผ่าน validation
