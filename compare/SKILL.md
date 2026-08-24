---
name: compare
description: เปรียบเทียบ options, tools, หรือ solutions เพื่อตัดสินใจ
---

## Goal

เปรียบเทียบ options, tools, หรือ solutions เพื่อเลือกตัวเลือกที่เหมาะสมที่สุด

## Scope

ใช้สำหรับการเปรียบเทียบทุกประเภท เช่น tools, frameworks, libraries, approaches

## Execute

### 1. Identify Comparison Criteria
> Goal: Identify Comparison Criteria

1. ระบุ criteria ที่สำคัญสำหรับการตัดสินใจ
2. กำหนด weight สำหรับแต่ละ criterion (ถ้าจำเป็น)
3. จัดลำดับ criteria ตามความสำคัญ

### 2. Gather Information
> Goal: Gather Information

1. ทำ `/deep-research` สำหรับ options ที่ต้องการเปรียบเทียบ
2. รวบรวม features, pros, cons ของแต่ละ option
3. ตรวจสอบ benchmarks, performance metrics, และ community feedback
4. รวบรวม pricing, licensing, และ maintenance status

### 3. Create Comparison Table
> Goal: Create Comparison Table

1. ทำ `/report-table` สำหรับจัดรูปแบบตาราง
2. กำหนด columns สำหรับ comparison criteria
3. เติมข้อมูลสำหรับแต่ละ option ในแต่ละ row

### 4. Analyze Trade-offs
> Goal: Analyze Trade-offs

1. วิเคราะห์ pros และ cons ของแต่ละ option
2. ระบุ trade-offs ที่สำคัญ
3. พิจารณา context และ use case เฉพาะ
4. ประเมิน impact ระยะยาว

### 5. Provide Recommendation
> Goal: Provide Recommendation

1. ทำ `/pondering` เพื่อทบทวน trade-offs และผลกระทบก่อนแนะนำ
2. สรุป findings จากการเปรียบเทียบ
3. แนะนำ option ที่เหมาะสมที่สุดตาม context
4. อธิบายเหตุผลสำหรับ recommendation
5. ระบุ edge cases ที่ option อื่นอาจเหมาะสมกว่า

## Rules

### Comparison Criteria

เกณฑ์ที่ใช้ในการเปรียบเทียบ

- ใช้ criteria ที่เป็น objective และ measurable
- รวม criteria ที่สำคัญสำหรับ use case เฉพาะ
- พิจารณา non-functional requirements (performance, security, scalability)
- รวม criteria เกี่ยวกับ developer experience และ ecosystem

### Information Sources

แหล่งข้อมูลที่ใช้ในการเปรียบเทียบ

- ใช้ multiple sources จาก `/deep-research`
- ตรวจสอบ official documentation และ benchmarks
- พิจารณา community feedback และ adoption rates
- ตรวจสอบ maintenance status และ release frequency

### Recommendation Logic

หลักการในการแนะนำ

- แนะนำตาม context และ use case เฉพาะ
- อธิบาย trade-offs อย่างชัดเจน
- ระบุ edge cases ที่ option อื่นอาจเหมาะสมกว่า
- ให้เหตุผลที่เป็น objective และ data-driven

## Expected Outcome

- ตารางเปรียบเทียบที่ครบถ้วนและอ่านง่าย
- Recommendation ที่ชัดเจนพร้อมเหตุผล
- การวิเคราะห์ trade-offs ที่ครอบคลุม
- การตัดสินใจที่ขึ้นอยู่กับ data และ context
