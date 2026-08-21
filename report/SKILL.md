---
name: report
description: ตอบในแชทเป็นตารางพร้อม numbered columns, grouping, sorting
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตอบในแชทเป็นตารางที่มี numbered columns, grouping, sorting เพื่อความชัดเจน

## Scope

ใช้สำหรับการรายงานข้อมูลทุกประเภทในรูปแบบตารางและ numbered list ในแชทเท่านั้น

## Execute

### 1. Prepare Data

รวบรวมและจัดเตรียมข้อมูลก่อนจัดรูปแบบ


> Goal: ข้อมูลพร้อมจัดรูปแบบ รู้ประเภทและลำดับความสำคัญ


1. รวบรวมข้อมูลที่ต้องการรายงาน
2. จัดกลุ่มข้อมูลตาม category ที่เกี่ยวข้อง
3. กำหนดลำดับความสำคัญของแต่ละ item
4. ตัดสินใจว่าจะใช้รูปแบบตารางหรือ numbered list

### 2. Format Output

จัดรูปแบบข้อมูลตามประเภทที่เหมาะสม


> Goal: ข้อมูลถูกจัดรูปแบบในรูปแบบที่อ่านง่ายที่สุด


1. ถ้าข้อมูลมีหลาย columns ที่ต้องเปรียบเทียบ ใช้ `/report-table`
2. ถ้าต้องการเน้นลำดับความสำคัญ ใช้ `/report-table` พร้อม numbered columns
3. ถ้าเหมาะสม สามารถผสมทั้งสองรูปแบบในรายงานเดียวกันได้
4. ถ้าเป็นรายงานความคืบหน้า ใช้ `/report-ansi`
5. ถ้าเป็นรายงานสถานะ ใช้ `/report-agents-session-status`
6. ถ้าเป็นรายงาน error ใช้ `/report-ansi`

### 3. Apply Grouping And Sorting

จัดกลุ่มและเรียงลำดับข้อมูลหลังจัดรูปแบบ


> Goal: ข้อมูลจัดกลุ่มและเรียงลำดับชัดเจน อ่านง่าย


1. จัดกลุ่มข้อมูลตามหมวดหมู่ที่เกี่ยวข้อง
2. ใช้ headers สำหรับแยกกลุ่มที่ชัดเจน
3. เรียงลำดับภายในกลุ่มตามความสำคัญ
4. ถ้ากลุ่มซับซ้อน ใช้ separators สำหรับแยกกลุ่ม

### 4. Validate Output

ตรวจสอบคุณภาพของผลลัพธ์ก่อนส่ง


> Goal: ผลลัพธ์ผ่าน quality check อ่านง่าย สม่ำเสมอ


1. ตรวจสอบว่าทุก column มี number (ถ้าใช้ตาราง)
2. ตรวจสอบ grouping และ sorting ที่ถูกต้อง
3. ตรวจสอบว่าอ่านง่ายบนทุก device
4. ทำ `/follow-content-quality` เพื่อตรวจสอบคุณภาพเนื้อหา

## Rules

### 1. Format Selection

- ใช้ตารางเมื่อมีข้อมูลหลาย columns ที่ต้องเปรียบเทียบ
- ใช้ numbered list เมื่อต้องการเน้นลำดับความสำคัญ
- สามารถผสมทั้งสองรูปแบบในรายงานเดียวกันได้
- เลือกรูปแบบที่อ่านง่ายที่สุดสำหรับผู้รับ

### 2. Table Structure

- ทุกตารางต้องมี numbered columns
- ใช้ headers ชัดเจนสำหรับแต่ละ column
- จัดเรียง columns ตามความสำคัญ
- ใช้ alignment (`left`, `center`, `right`) ที่เหมาะสมกับ data types

### 3. Grouping And Sorting

- จัดกลุ่มข้อมูลตาม category ที่เกี่ยวข้อง
- ใช้ headers สำหรับ grouping ที่ชัดเจน
- เรียงลำดับภายในกลุ่มตามความสำคัญ
- ถ้ากลุ่มซับซ้อน ใช้ separators สำหรับแยกกลุ่ม

### 4. Content Formatting

- ใช้ backticks สำหรับ headers และ keywords สำคัญ
- ใช้ `code blocks` สำหรับ commands และ file paths
- ใช้ backticks สำหรับ inline code
- ใช้ symbols (✅, ❌, ⚠️) สำหรับ status indicators

### 5. Output Channel

- ตอบกลับในแชทเท่านั้น
- ไม่สร้างไฟล์แยกสำหรับรายงาน
- ใช้ `markdown` table format มาตรฐาน
- ตารางต้องอ่านง่ายบนทุก device

### 6. Readability

- แต่ละข้อต้องกระชับ ตรงประเด็น
- หลีกเลี่ยงข้อความที่ยาวเกินไป
- ใช้ภาษาที่เข้าใจง่าย
- จัดรูปแบบให้สอดคล้องกันทั้งเอกสาร

## Expected Outcome

- ตารางที่มี numbered columns
- Grouping และ sorting ที่ชัดเจน
- ข้อมูลที่อ่านง่าย
- รูปแบบที่เหมาะสมกับประเภทข้อมูล
- ตอบกลับในแชทเท่านั้น ไม่สร้างไฟล์แยก
