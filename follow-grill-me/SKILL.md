---
name: follow-grill-me
description: สัมภาษณ์ผู้ใช้อย่างเข้มข้นเกี่ยวกับ plan หรือ design จนเข้าใจตรงกัน
---

## Goal

สัมภาษณ์ผู้ใช้อย่างเข้มข้นเกี่ยวกับ plan หรือ design จนเข้าใจตรงกัน โดยไล่ลงไปทุกสาขาของ decision tree และแก้ไข dependencies ระหว่างการตัดสินใจทีละข้อ

## Execute

### 1. Prepare

1. ทำ `/analyze-project` เพื่อเข้าใจ context ของ project
2. อ่านไฟล์ที่เกี่ยวข้องเพื่อเข้าใจ plan หรือ design ปัจจุบัน
3. ระบุส่วนที่ต้องการ stress-test หรือ validate

### 2. Question Strategy

1. เริ่มจากคำถาม high-level ที่สำคัญที่สุดก่อน
2. ไล่ลงไปทุกสาขาของ decision tree ทีละข้อ
3. แก้ไข dependencies ระหว่างการตัดสินใจทีละข้อ
4. สำหรับแต่ละคำถาม ให้คำแนะนำที่เหมาะสมด้วย

### 3. Question Format

1. ถามคำถามทีละข้อ ไม่ถามหลายข้อพร้อมกัน
2. ถ้าคำถามสามารถตอบได้โดยสำรวจ codebase ให้สำรวจ codebase แทนการถาม
3. ใช้ภาษาไทยในการสื่อสาร (ตาม user rules)
4. ให้คำตอบกระชับ ตรงประเด็น

### 4. Validation

1. ตรวจสอบว่าผู้ใช้เข้าใจแต่ละ decision ก่อนไปต่อ
2. จดบันทึกคำตอบและคำแนะนำที่สำคัญ
3. ตรวจสอบความสอดคล้องระหว่าง decisions ต่างๆ
4. ยืนยันว่าทุกสาขาของ decision tree ได้รับการครอบคลุม

## Rules

### 1. Question Order

จัดลำดับคำถามตาม:

- High-level decisions ก่อน (architecture, scope)
- Critical path ก่อน (dependencies สำคัญ)
- High risk items ก่อน (fail fast)
- Foundation ก่อน (ที่ hard to change)
- ไล่ลงไปที่ละเลี้ยวของ decision tree

### 2. Question Style

ลักษณะคำถาม:

- ถามทีละข้อเท่านั้น ไม่ถามหลายข้อพร้อมกัน
- ถามแบบกระชับ ตรงประเด็น
- หลีกเลี่ยงคำยืนยันที่ไม่จำเป็น
- ให้คำแนะนำที่เป็นประโยชน์สำหรับแต่ละคำถาม

### 3. Codebase Exploration

เมื่อถามคำถาม:

- ถ้าสามารถตอบได้โดยสำรวจ codebase ให้สำรวจก่อน
- ใช้ tools ที่มีอยู่เพื่อค้นหาข้อมูล
- ถามเฉพาะเมื่อไม่สามารถหาคำตอบจาก codebase ได้
- อ้างอิง code จริงเมื่อมี

### 4. Communication

การสื่อสาร:

- ใช้ภาษาไทยในการสื่อสาร (ตาม user rules)
- คำตอบกระชับ ตรงประเด็น
- หลีกเลี่ยงคำยืนยันที่ไม่จำเป็น
- ให้คำแนะนำที่เป็นประโยชน์

### 5. Decision Tree Traversal

วิธีการไล่ลง decision tree:

- เริ่มจาก root decision
- ไล่ลงทุกสาขาทีละเส้น
- แก้ไข dependencies ระหว่าง decisions ทีละข้อ
- ไม่ข้ามขั้นตอน
- ตรวจสอบความสอดคล้องระหว่าง branches

## Expected Outcome

- Plan หรือ design ที่ได้รับการ validate อย่างละเอียด
- ความเข้าใจตรงกันระหว่าง AI และผู้ใช้
- Dependencies ระหว่าง decisions ได้รับการแก้ไข
- ทุกสาขาของ decision tree ได้รับการครอบคลุม
