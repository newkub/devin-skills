---
name: use-in-another-workflows
description: พิจารณาการใช้ workflows ใน global workflows อื่นๆ เพื่อหลีกเลี่ยงการซ้ำซ้อนและรักษาความสอดคล้อง
---

## Goal

พิจารณาและตัดสินใจว่าควรใช้ workflows ใดใน global workflows อื่นๆ เพื่อหลีกเลี่ยงการซ้ำซ้อน รักษาความสอดคล้อง และเพิ่มประสิทธิภาพการทำงาน

## Scope

ใช้เมื่อเขียนหรือปรับปรุง global workflow ใหม่ หรือเมื่อพบว่า workflow ปัจจุบันมีเนื้อหาที่อาจซ้ำซ้อนกับ workflows อื่นใน global_workflows/

## Execute

### 1. Analyze Current Workflow

วิเคราะห์ workflow ปัจจุบันเพื่อระบุส่วนที่อาจซ้ำซ้อน

> Goal: ระบุส่วนที่อาจซ้ำซ้อนกับ workflows อื่น

1. อ่าน workflow ปัจจุบันทั้งหมด
2. ระบุ Execute steps ที่มีลักษณะทั่วไปหรือ reusable
3. ระบุ Rules ที่มีลักษณะทั่วไปหรือ reusable
4. ระบุ patterns ที่เกิดซ้ำใน workflows อื่น
5. ทำ `/read-related-workflows` เพื่อดู dependencies ของ workflow ปัจจุบัน

### 2. Search For Existing Workflows

ค้นหา workflows ที่มีอยู่แล้วซึ่งอาจทำหน้าที่เดียวกัน

> Goal: ค้นหา workflows ที่มีอยู่แล้วเพื่อใช้แทนการเขียนใหม่

1. ค้นหาใน `global_workflows/` สำหรับ workflows ที่มี:
   - Goal ที่คล้ายกัน
   - Execute steps ที่คล้ายกัน
   - Rules ที่คล้ายกัน
2. อ่าน workflows ที่พบเพื่อเปรียบเทียบ
3. ระบุ workflows ที่สามารถใช้แทนได้โดยไม่ต้องแก้ไข
4. ระบุ workflows ที่ต้องปรับเล็กน้อยก่อนใช้
5. ทำ `/check-reference` เพื่อยืนยันว่า workflows ที่พบมีอยู่จริง

### 3. Evaluate Reusability

ประเมินว่าส่วนไหนควร extract เป็น workflow แยกหรือใช้ workflow ที่มีอยู่

> Goal: ตัดสินใจว่าควร reuse, extract, หรือ keep inline

1. ถ้าพบ workflow ที่ตรงกันทั้งหมด → ใช้ workflow นั้นผ่าน `related`
2. ถ้าพบ workflow ที่คล้ายกันแต่ไม่ตรง 100% → ปรับ workflow นั้นให้ generic แล้วใช้
3. ถ้าไม่พบ workflow ที่เหมาะสม → พิจารณา extract เป็น workflow ใหม่ถ้า:
   - ใช้ซ้ำใน > 2 workflows อื่น
   - มีความซับซ้อน > 5 steps
   - เป็นหลักการที่ใช้ได้กับหลาย contexts
4. ถ้าใช้เฉพาะใน workflow นี้ → keep inline

### 4. Update Workflow References

อัปเดท workflow ปัจจุบันให้ใช้ workflows อื่นผ่าน references

> Goal: ลดการซ้ำซ้อนโดยใช้ references แทน duplicate content

1. เพิ่ม workflows ที่จะใช้ใน `related` ใน frontmatter
2. แก้ Execute steps ให้เรียก `/workflow-name` แทนเขียน detail ซ้ำ
3. ลบ Rules ที่ซ้ำซ้อนกับ workflows ที่เรียก
4. รักษา context เฉพาะของ workflow นี้ไว้
5. ทำ `/update-reference` ถ้ามีการเปลี่ยนชื่อหรือย้ายไฟล์

### 5. Validate Consistency

ตรวจสอบว่าการใช้ workflows อื่นสอดคล้องและไม่ทำให้ workflow เสียความสมบูรณ์

> Goal: ยืนยันว่า workflow ยังสมบูรณ์และ deterministic

1. ตรวจสอบว่าทุก step ยังทำได้จริง
2. ตรวจสอบว่า flow ยังลื่นไหล
3. ตรวจสอบว่าไม่มี circular dependencies
4. ตรวจสอบว่า `related` มีเฉพาะ workflows ที่เรียกโดยตรง
5. จำลองการรัน workflow เพื่อยืนยันว่าทำตามได้จริง

## Rules

### 1. Reuse Over Duplicate

- ใช้ workflows ที่มีอยู่เสมอถ้าทำหน้าที่เดียวกัน
- ห้าม duplicate Execute steps หรือ Rules จาก workflows อื่น
- ถ้า workflow มีอยู่แต่ไม่ตรง 100% → ปรับให้ generic แทนสร้างใหม่
- `related` ต้องมีเฉพาะ workflows ที่เรียกโดยตรงใน Execute หรือ Rules

### 2. Extraction Criteria

- Extract เป็น workflow ใหม่เฉพาะเมื่อ:
  - ใช้ซ้ำใน > 2 workflows อื่น
  - มีความซับซ้อน > 5 steps
  - เป็นหลักการที่ใช้ได้กับหลาย contexts
- ถ้าใช้เฉพาะใน workflow เดียว → keep inline
- ถ้ามีความซับซ้อน < 5 steps → keep inline

### 3. Reference Integrity

- ทุก workflow ใน `related` ต้องถูกเรียกโดยตรงใน Execute หรือ Rules
- ห้ามมี unused related ใน frontmatter
- ห้ามมี missing related — workflows ที่เรียกต้องอยู่ใน `related`
- ทำ `/check-reference` ก่อนเพิ่ม reference

### 4. Context Preservation

- เมื่อใช้ workflow อื่น ต้องรักษา context เฉพาะของ workflow นี้
- ลบเฉพาะส่วนที่ซ้ำซ้อน ไม่ลบ context เฉพาะ
- ถ้า workflow อื่นไม่ครอบคลุม context เฉพาะ → เพิ่ม detail เฉพาะใน workflow นี้

### 5. Dependency Management

- หลีกเลี่ยง circular dependencies ระหว่าง workflows
- อ่าน workflows ตามลำดับ topological sort
- ถ้าพบ circular dependency → restructure workflows

### 6. Naming Conventions

- ใช้ชื่อ workflow ที่สะท้อนหน้าที่อย่างชัดเจน
- ถ้า extract workflow ใหม่ → ใช้ชื่อที่ generic แต่ยังสื่อความหมาย
- ตรวจสอบว่าชื่อไม่ทับซ้อนกับ workflows ที่มีอยู่

## Expected Outcome

- Workflow ที่ไม่มีการซ้ำซ้อนกับ workflows อื่นใน global_workflows/
- References ถูกต้องทั้งหมดใน `related` frontmatter
- Execute steps และ Rules ที่ concise และไม่ duplicate
- Context เฉพาะของ workflow ยังครบถ้วน
- ไม่มี circular dependencies ระหว่าง workflows
- Workflow ที่ deterministic และทำตามได้จริง
