---
name: idea-new-global-workflows
description: แนะนำ global workflows ใหม่ที่ควรสร้างหรือใช้ต่อจาก workflow ปัจจุบัน
---

## Goal

แนะนำ global workflows ที่เกี่ยวข้องและควรใช้ต่อจาก workflow ปัจจุบัน เพื่อสร้างการเชื่อมโยงระหว่าง workflows

## Scope

ใช้หลังจากเขียนหรือแก้ไข workflow เสร็จ เพื่อวิเคราะห์และแนะนำ workflows อื่นที่ควรใช้ร่วมกัน

## Execute

### 1. Analyze Current Workflow

วิเคราะห์ workflow ปัจจุบันเพื่อเข้าใจ context และ purpose

1. อ่าน `title`, `description`, `Goal`, `Scope` ของ workflow ปัจจุบัน
2. ระบุ `related_workflows` ที่มีอยู่แล้ว
3. วิเคราะห์ `Execute` steps และ `Rules` เพื่อเข้าใจการใช้งาน
4. ระบุ workflow category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`)

### 2. List Available Workflows

รวบรวม global workflows ทั้งหมดที่มีอยู่

1. อ่านไฟล์ทั้งหมดใน `global_workflows/` directory
2. ดู `title` และ `description` ของแต่ละ workflow
3. จัดกลุ่มตาม category (`analysis`, `implementation`, `quality`, `deployment`, `maintenance`)
4. ตรวจสอบว่าไม่แนะนำ workflow ที่อยู่ใน `related_workflows` แล้ว

### 3. Match Related Workflows

จับคู่ workflows ที่เกี่ยวข้องกับ workflow ปัจจุบัน

1. วิเคราะห์ความเกี่ยวข้องจาก `Goal`, `Scope`, และ `Execute`
2. จัดลำดับความเกี่ยวข้อง: `direct dependency`, `complementary`, `follow-up`, `alternative`
3. ตรวจสอบว่า workflows ที่แนะนำมีอยู่จริงใน `global_workflows/`
4. กรอง workflows ที่ไม่เกี่ยวข้องออก

### 4. Suggest With Reasons

แนะนำ workflows พร้อมเหตุผล

1. แนะนำเป็นลิสต์พร้อมเหตุผลว่าทำไมควรใช้
2. ระบุประเภทความเกี่ยวข้อง (`direct dependency`, `complementary`, `follow-up`, `alternative`)
3. ระบุเงื่อนไขการใช้งาน เช่น "ใช้เมื่อ..." หรือ "ใช้หลังจาก..."
4. จัดลำดับจากที่เกี่ยวข้องมากที่สุดไปน้อยที่สุด

### 5. Update Related Workflows

อัปเดต `related_workflows` ในไฟล์ workflow ปัจจุบัน

1. เพิ่ม workflows ที่แนะนำเข้าไปใน `related_workflows` ของ workflow ปัจจุบัน
2. ตรวจสอบว่าไม่ซ้ำซ้อนกับที่มีอยู่แล้ว
3. ทำ `/update-reference` เพื่ออัปเดต references ในไฟล์อื่นที่เกี่ยวข้อง

## Rules

### 1. Relevance Analysis

- วิเคราะห์จาก `Goal`, `Scope`, และ `Execute` ไม่ใช่แค่ `title`
- พิจารณาทั้ง input และ output ของ workflow
- ตรวจสอบว่า workflows สามารถใช้ร่วมกันได้จริง
- ไม่แนะนำ workflow ที่ทำหน้าที่ซ้ำซ้อน

### 2. Suggestion Format

- ระบุชื่อ workflow ด้วย backticks เช่น `/workflow-name`
- ระบุเหตุผลสั้นกระชับ
- ระบุประเภทความเกี่ยวข้องในวงเล็บ
- จัดลำดับจากมากไปน้อย

### 3. Validation

- ตรวจสอบว่า workflows ที่แนะนำมีอยู่จริง
- ตรวจสอบว่าไม่แนะนำ workflow ตัวเอง
- ตรวจสอบว่าไม่ซ้ำซ้อนกับ `related_workflows` ที่มีอยู่
- ทำ `/check-reference` เพื่อยืนยัน references มีอยู่จริง

### 4. Cross-Reference Update

- อัปเดต `related_workflows` ทั้งสองไฟล์ (current และ suggested)
- ใช้ `/update-reference` สำหรับการอัปเดต
- ตรวจสอบว่าไม่เพิ่ม reference ในไฟล์ที่ไม่เกี่ยวข้อง

## Expected Outcome

- Workflows ที่เกี่ยวข้องถูกแนะนำพร้อมเหตุผลชัดเจน
- `related_workflows` อัปเดตครบถ้วน
- การเชื่อมโยงระหว่าง workflows ชัดเจนขึ้น
- ลดการพลาด workflows ที่ควรใช้ร่วมกัน
