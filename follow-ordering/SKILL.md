---
name: follow-ordering
description: กฏในการเรียงลำดับรายการให้เหมาะสม
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related: []
---
## Goal

เรียงลำดับรายการให้เหมาะสมตามหลัก Order Theory เพื่อให้ค้นหาและอ่านง่าย

## Scope

ใช้สำหรับจัดเรียงรายการ ไฟล์ หรือ tasks ใน project ให้เป็นระบบ

## Execute

### 1. หลักการ ORDERING

> Goal: กำหนดหลักการเรียงลำดับ
> Goal: เข้าใจหลักการเรียงลำดับตาม Order Theory

1. DEFINE รายการทั้งหมดที่ต้องเรียงลำดับ (Set)
2. DEFINE ความสัมพันธ์สำหรับการเปรียบเทียบ (Order Relation)
3. VERIFY ว่าความสัมพันธ์เป็น order relation (Reflexive, Antisymmetric, Transitive)
4. COMPUTE ลำดับของรายการ
5. VALIDATE ว่าลำดับถูกต้อง
6. VERIFY ว่าอ่านง่ายและเข้าใจ

### 2. การวิเคราะห์

> Goal: วิเคราะห์รายการและความสัมพันธ์
> Goal: รู้รายการและความสัมพันธ์ที่จะใช้เรียงลำดับ

1. IDENTIFY รายการทั้งหมดและคุณสมบัติ
2. DEFINE criteria สำหรับการเปรียบเทียบ
3. VERIFY Reflexive, Antisymmetric, Transitive

### 3. การเรียงลำดับ

> Goal: เลือก Order Type และคำนวณลำดับ
> Goal: ได้ลำดับที่ถูกต้องตามความสัมพันธ์

1. เลือก Total Order (ทุกรายการเปรียบเทียบได้) หรือ Partial Order (บางรายการเปรียบเทียบไม่ได้)
2. ใช้ Topological Order สำหรับความสัมพันธ์ขึ้นต่อกัน
3. ใช้ primary relation ถ้าเท่ากัน ใช้ secondary relation

### 4. การ VALIDATE และ VERIFY

> Goal: ตรวจสอบลำดับและความชัดเจน
> Goal: ลำดับถูกต้องและอ่านง่าย

1. CHECK ว่าลำดับสอดคล้องกับ relation
2. CHECK ว่าไม่มีรายการที่ผิดลำดับ
3. CHECK ว่าลำดับอ่านง่ายและค้นหาได้ง่าย

## Rules

- ต้องมี frontmatter
- content เขียนตาม example
- กฏต้องสามารถ VALIDATE และ VERIFY ได้
- ใช้ alphabetical order เป็น default เมื่อไม่มีลำดับที่ชัดเจน

## Expected Outcome

- รายการเรียงลำดับตาม relation ที่กำหนด
- ลำดับอ่านง่ายและค้นหาได้ง่าย
- ลำดับสอดคล้องกับวัตถุประสงค์
