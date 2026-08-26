---
name: idea-new-devin-skills-global
description: แนะนำ devin global skills ที่เกี่ยวข้องและควรใช้/สร้างต่อจาก skill ปัจจุบัน
argument-hint: "[skill-name]"
related:
  - idea-convert-my-global-cli-to-skills
  - idea-features
  - idea-improve-files-naming
  - create-devin-global-skills
---

## Goal

แนะนำ devin global skills ที่เกี่ยวข้องและควรใช้ต่อจาก skill ปัจจุบัน พร้อมสร้างไอเดีย skills ใหม่ที่ควรมี

## Scope

ใช้หลังจากเขียนหรือแก้ไข `SKILL.md` เสร็จ เพื่อวิเคราะห์และแนะนำ skills อื่นที่ควรใช้ร่วมกัน

## Execute

### 1. Analyze Current Skill

> Goal: Analyze Current Skill

วิเคราะห์ skill ปัจจุบันเพื่อเข้าใจ context และ purpose

1. อ่าน frontmatter, `name`, `description`, `Goal`, `Scope` ของ skill ปัจจุบัน
2. ระบุ `related` skills ที่มีอยู่แล้ว
3. วิเคราะห์ `Execute` steps และ `Rules` เพื่อเข้าใจการใช้งาน
4. ระบุ skill category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`, `idea`)

### 2. List Available Skills

> Goal: List Available Skills

รวบรวม devin global skills ทั้งหมดที่มีอยู่

1. อ่านไฟล์ `SKILL.md` ทั้งหมดใน `C:\Users\Veerapong\AppData\Roaming\devin\skills\`
2. ดู `name` และ `description` ของแต่ละ skill
3. จัดกลุ่มตาม category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`, `idea`)
4. ตรวจสอบว่าไม่แนะนำ skill ที่อยู่ใน `related` แล้ว

### 3. Match Related Skills

> Goal: Match Related Skills

จับคู่ skills ที่เกี่ยวข้องกับ skill ปัจจุบัน

1. วิเคราะห์ความเกี่ยวข้องจาก `Goal`, `Scope`, และ `Execute`
2. จัดลำดับความเกี่ยวข้อง: `direct dependency`, `complementary`, `follow-up`, `alternative`
3. ตรวจสอบว่า skills ที่แนะนำมีอยู่จริงใน `C:\Users\Veerapong\AppData\Roaming\devin\skills\`
4. กรอง skills ที่ไม่เกี่ยวข้องออก

### 4. Suggest Skills And New Ideas

> Goal: Suggest Skills And New Ideas

แนะนำ skills พร้อมเหตุผลและไอเดียใหม่

1. แนะนำ existing skills เป็นลิสต์พร้อมเหตุผลว่าทำไมควรใช้
2. ระบุประเภทความเกี่ยวข้อง (`direct dependency`, `complementary`, `follow-up`, `alternative`)
3. ระบุเงื่อนไขการใช้งาน เช่น "ใช้เมื่อ..." หรือ "ใช้หลังจาก..."
4. วิเคราะห์ gaps และเสนอไอเดีย skills ใหม่ที่ควรสร้าง
5. ถ้า skill ปัจจุบันเกี่ยวข้องกับ CLI หรือ tools → แนะนำ `idea-convert-my-global-cli-to-skills`
6. จัดลำดับจากที่เกี่ยวข้องมากที่สุดไปน้อยที่สุด

### 5. Update Related Skills

> Goal: Update Related Skills

อัปเดต `related` ในไฟล์ skill ปัจจุบัน

1. เพิ่ม skills ที่แนะนำเข้าไปใน `related` ของ skill ปัจจุบัน
2. ตรวจสอบว่าไม่ซ้ำซ้อนกับที่มีอยู่แล้ว
3. ทำ `/update-references` เพื่ออัปเดต references ในไฟล์อื่นที่เกี่ยวข้อง

## Rules

### 1. Relevance Analysis

- วิเคราะห์จาก `Goal`, `Scope`, และ `Execute` ไม่ใช่แค่ `name` หรือ `description`
- พิจารณาทั้ง input และ output ของ skill
- ตรวจสอบว่า skills สามารถใช้ร่วมกันได้จริง
- ไม่แนะนำ skill ที่ทำหน้าที่ซ้ำซ้อน

### 2. Suggestion Format

- ระบุชื่อ skill ด้วย backticks เช่น `skill-name`
- ระบุเหตุผลสั้นกระชับ
- ระบุประเภทความเกี่ยวข้องในวงเล็บ
- สำหรับไอเดียใหม่ ระบุชื่อ proposed skill และ rationale
- จัดลำดับจากมากไปน้อย

### 3. Validation

- ตรวจสอบว่า skills ที่แนะนำมีอยู่จริง
- ตรวจสอบว่าไม่แนะนำ skill ตัวเอง
- ตรวจสอบว่าไม่ซ้ำซ้อนกับ `related` ที่มีอยู่
- ทำ `/check-reference` เพื่อยื่นยัน references มีอยู่จริง

### 4. Cross-Reference Update

- อัปเดต `related` ทั้งสองไฟล์ (current และ suggested)
- ใช้ `/update-references` สำหรับการอัปเดต
- ตรวจสอบว่าไม่เพิ่ม reference ในไฟล์ที่ไม่เกี่ยวข้อง

## Expected Outcome

- Devin global skills ที่เกี่ยวข้องถูกแนะนำพร้อมเหตุผลชัดเจน
- ไอเดีย skills ใหม่ที่ควรสร้างถูกระบุพร้อม rationale
- `related` ใน frontmatter อัปเดตครบถ้วน
- การเชื่อมโยงระหว่าง skills ชัดเจนขึ้น
- ลดการพลาด skills ที่ควรใช้ร่วมกัน