---
name: edit-devin-global-rules
description: Edit global_rules.md in Windsurf memories safely with validation
---

## Goal

แก้ไข `global_rules.md` ใน `C:\Users\Veerapong\.codeium\windsurf\memories\` อย่างปลอดภัยและผ่าน validation

## Scope

- อ่าน `global_rules.md` ก่อนแก้ไข
- แก้ไข rule, section, หรือ structure ตามคำขอ
- Validate หลังแก้ไขให้ตรงตาม conventions
- ไม่แก้ไขถ้าไม่มีการสำรองหรือ dry run

## Execute

### 1. Prepare

> Goal: อ่านและเข้าใจ global rules ปัจจุบัน

1. อ่าน `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
2. ระบุ sections: `Goal`, `Scope`, `Execute`, `Rules`, `Expected Outcome`
3. ตรวจ frontmatter: `name: global-rules`, description
4. สำรองเนื้อหาเดิมไปยัง `global_rules.md.bak` ก่อนแก้ไข

### 2. Plan Changes

> Goal: ระบุสิ่งที่ต้องแก้และ impact

1. ถามหรือรวบรวม requirement จาก user
2. ระบุ sections หรือ rules ที่ต้องแก้
3. ตรวจสอบ impact ต่อ skills อื่นด้วย `/consider-use-in-another-skills`
4. ทำ `/report-plan` ถ้าเปลี่ยนแปลงใหญ่

### 3. Edit Rules

> Goal: แก้ไข `global_rules.md` ตาม requirement

1. ใช้ `edit` หรือ `write` สำหรับเปลี่ยนแปลง
2. รักษาโครงสร้าง `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. เก็บ line count ไม่เกิน 250 บรรทัด
4. ห้ามใช้ `**` bold markers
5. ใช้ backticks สำหรับ `tools`, paths, commands, skill names

### 4. Validate

> Goal: ตรวจสอบความถูกต้อง

1. ตรวจ frontmatter `name` ตรงกับ `global-rules`
2. ตรวจ heading levels เรียงถูกต้อง
3. ตรวจไม่มี `**` bold markers
4. ตรวจ line count ไม่เกิน 250
5. รัน `/validate` ถ้ามี

### 5. Report

> Goal: สรุปการเปลี่ยนแปลง

1. ทำ `/report` พร้อมสิ่งที่แก้และเหตุผล
2. ทำ `/suggest-next-action` ถ้าต้อง propagation ไปยัง skills อื่น

## Rules

### 1. Safety First

- สำรอง `global_rules.md` ก่อนแก้ไขทุกครั้ง
- ไม่ลบหรือ overwrite โดยไม่มี dry run
- ถ้าเปลี่ยนแปลงเสี่ยงสูง → ใช้ `/ask-me`

### 2. Structural Conventions

- ต้องมี frontmatter `name: global-rules` และ `description`
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- Headings ภาษาอังกฤษ Title Case
- รายการภาษาไทย

### 3. Content Quality

- เก็บเฉพาะข้อกำหนดที่กระทบผลลัพธ์จริง
- ทุก rule ต้องมี action, condition, หรือ expected result ที่ตีความได้ทางเดียว
- ห้ามใช้ placeholder หรือ generic filler

### 4. Compatibility

- ถ้าแก้ skills หรือ `global_rules.md` → ทำ `/follow-write-devin-skills` และ `/consider-use-in-another-skills`
- อัปเดต skills ที่อ้างอิง `global_rules.md` ถ้าจำเป็น

## Expected Outcome

- `global_rules.md` ถูกต้องตาม conventions
- มี backup ก่อนการแก้ไข
- ไม่มี broken structure หรือ syntax
- รายงานการเปลี่ยนแปลงพร้อม action ถัดไป
