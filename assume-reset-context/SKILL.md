---
name: assume-reset-context
description: สมมุติว่ากำลังเข้ามาแก้ไขไฟล์นี้เป็นครั้งแรก โดยไม่มี context จากการสนทนาก่อนหน้า
allowed-tools:
  - read
  - grep
  - glob
  - find_file_by_name
  - skill
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

สมมุติว่ากำลังเข้ามาแก้ไขไฟล์นี้เป็นครั้งแรก โดยไม่มี context จากการสนทนาก่อนหน้า วิเคราะห์และเข้าใจไฟล์ใหม่ทั้งหมดจากสิ่งที่มีอยู่จริงใน codebase

## Scope

ใช้เมื่อต้องการแก้ไขไฟล์โดยตัด context ก่อนหน้าทิ้งทั้งหมด เริ่มวิเคราะห์ใหม่เหมือนเปิดไฟล์ครั้งแรก เพื่อหลีกเลี่ยง confirmation bias และ assumptions ที่ผิดจาก context เดิม

## Execute

### 1. Reset Mindset

> Goal: ล้าง assumptions ทั้งหมดจาก context ก่อนหน้า
> Goal: เริ่มต้นด้วย mindset ที่ไม่มี bias จากสนทนาก่อนหน้า

1. ไม่อ้างอิงข้อสรุป การวิเคราะห์ หรือ decisions จากการสนทนาก่อนหน้า
2. ไม่สมมติว่า `code` ก่อนหน้าถูกต้องหรือผิด ให้พิสูจน์ใหม่จากไฟล์จริง
3. ถือว่าไฟล์นี้เป็นไฟล์ที่ไม่เคยเห็นมาก่อน ต้องอ่านและเข้าใจใหม่ทั้งหมด

### 2. Read File Fresh

> Goal: อ่านไฟล์เป้าหมายและไฟล์ที่เกี่ยวข้องใหม่ทั้งหมด
> Goal: รวบรวมข้อมูลจริงจาก codebase โดยไม่ข้ามส่วนใด

1. อ่านไฟล์เป้าหมายทั้งไฟล์ ไม่ข้ามบรรทัด
2. อ่าน `imports` และ dependencies ที่ไฟล์เรียกใช้
3. อ่านไฟล์ที่ import ไฟล์เป้าหมาย (reverse dependencies)
4. ทำ `/scan-codebase` เพื่อหา usage patterns และ references ทั้งหมด
   - ใช้ `/use-ast-grep` สำหรับ AST-based pattern search
5. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้อง

### 3. Analyze From Scratch

> Goal: วิเคราะห์ไฟล์ใหม่ทั้งหมดโดยไม่อ้างอิง context เดิม
> Goal: ได้ findings ที่อิงจากสภาพไฟล์จริง ไม่ใช่ความจำ

1. ทำ `/deep-thinking` เพื่อวิเคราะห์ปัญหาและโครงสร้างของไฟล์
2. ระบุว่าไฟล์นี้ทำหน้าที่อะไร รับผิดชอบอะไร
3. ระบุ dependencies และ relationships กับไฟล์อื่น
4. ระบุ issues, bugs, หรือ improvements จากการอ่านจริง
5. ทำ `/follow-best-practice`
   - ทำ `/follow-layered-architecture` เพื่อเทียบกับมาตรฐาน

### 4. Plan Fresh

> Goal: วางแผนการแก้ไขใหม่จากการวิเคราะห์ปัจจุบัน
> Goal: มีแผนที่อิงจาก findings ใหม่ทั้งหมด

1. ทำ `/deep-plan` เพื่อวางแผนการแก้ไขตาม findings ใหม่
2. ระบุว่าต้องแก้อะไร เพราะอะไร อย่างไร
3. ถ้า findings ใหม่ขัดแย้งกับ context เดิม ให้เชื่อ findings ใหม่ที่พิสูจน์จากไฟล์จริง

### 5. Implement

> Goal: แก้ไขไฟล์ตามแผนใหม่
> Goal: แก้ไขตามแผนโดยใช้ skills ที่เหมาะสม

1. ทำ `/refactor` ก่อนเขียน code ใหม่ถ้าจำเป็น
2. แก้ไขตามแผนที่วางไว้ — ใช้ `/use-scripts` เมื่อต้องประมวลผลไฟล์หลายไฟล์
3. ทำ `/realize-implementation` เพื่อให้แน่ใจว่า code สมบูรณ์

### 6. Validate

> Goal: ตรวจสอบผลลัพธ์ใหม่ทั้งหมด
> Goal: ผลลัพธ์ผ่าน validation โดยไม่อ้างอิง context เดิม

1. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง
2. ทำ `/run-check` เพื่อรัน lint, typecheck, scan

## Rules

### 1. No Context Reference

- ห้ามอ้างอิง conclusions, analysis, หรือ decisions จากการสนทนาก่อนหน้า
- ห้ามสมมติว่า `code` ก่อนหน้าถูกต้องโดยไม่พิสูจน์
- ทุกการตัดสินใจต้องมาจากการอ่านไฟล์จริงในปัจจุบัน

### 2. Fresh Analysis

- อ่านไฟล์ทั้งไฟล์ ไม่ข้ามส่วนใด
- วิเคราะห์ใหม่ทั้งหมดเหมือนไม่เคยเห็นไฟล์นี้มาก่อน
- ถ้า findings ใหม่ขัดแย้งกับ context เดิม ให้เชื่อ findings ใหม่

### 3. Evidence-Based

- ทุก assumption ต้องมี evidence จากไฟล์จริง
- ทุกการตัดสินใจต้องอ้างอิงจาก code ที่อ่านได้
- ไม่เดาจาก context หรือ memory

### 4. Complete Independence

- ถ้ามี progress notes หรือ shared notes จาก context เดิม ให้อ่านแต่ไม่เชื่อโดยไม่พิสูจน์
- ถ้ามี `TODO` หรือ `FIXME` ในไฟล์ ให้ตรวจสอบว่ายังเกี่ยวข้องหรือไม่
- ถ้ามี `comments` อธิบายการแก้ไขก่อนหน้า ให้ตรวจสอบว่ายังถูกต้องหรือไม่

## Expected Outcome

- การวิเคราะห์และแก้ไขไฟล์ที่ไม่ถูกจำกัดด้วย context เดิม
- ลด confirmation bias และ assumptions ที่ผิด
- ค้นพบปัญหาที่อาจมองข้ามจาก context เดิม
- การแก้ไขที่อิงจากสภาพไฟล์จริงในปัจจุบัน ไม่ใช่จากความจำ
