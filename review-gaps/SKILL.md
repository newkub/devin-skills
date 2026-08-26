---
name: review-gaps
description: Meta-review รวบรวม findings จาก dimensional reviews เป็น prioritized improvement list
---

## Goal

Meta-review ที่รวบรวม findings จาก dimensional reviews มา deduplicate, prioritize, และแนะนำ action skill ต่อ opportunity

## Scope

ใช้เมื่อต้องการรวม findings จากหลาย dimensional reviews เป็นรายการเดียวที่เรียงลำดับแล้ว ไม่ทำ dimensional review เอง — รวบรวม ตัดซ้ำ และจัดลำดับเท่านั้น

## Execute

### 1. Prepare

> Goal: ระบุ review reports ที่จะรวม

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, และ scope
2. ระบุ dimensional reviews ที่เกี่ยวข้องกับ project ตาม context
3. ตรวจว่ามี review reports อยู่แล้วหรือต้อง run ใหม่
4. ถ้าไม่มี code หรือ artifacts ให้ review → stop และ report

### 2. Collect

> Goal: รวม findings จากทุก dimensional review

1. ดึง findings จากทุก report ที่ run แล้ว
2. บันทึก source dimension, severity, location, และ evidence ต่อ finding
3. ถ้า finding ไม่มี evidence → ข้ามและบันทึกเป็น noise

### 3. Deduplicate

> Goal: ตัด findings ที่ซ้ำกันข้าม dimensions

1. จับคู่ findings ที่อ้างถึง issue เดียวกัน
2. รวมเป็น single finding พร้อมระบุทุก source dimensions
3. ใช้ severity สูงสุดจากทุก source

### 4. Prioritize

> Goal: จัดลำดับ opportunities ตาม impact และ effort

1. จัด findings เข้าหมวด: missing features, quality, implementation, DX, performance, security, architecture, delivery
2. ให้คะแนนแต่ละ opportunity ด้วย impact / effort (high impact, low effort = สูง)
3. คำนึงถึง quick wins และ dependencies ที่ชัดเจน
4. ทำ `/prioritize` เพื่อยื่นยันลำดับ

### 5. Report

> Goal: ส่งมอบ prioritized list พร้อม action skill

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง: Rank, Opportunity, Category, Score, Action Skill, Sources
3. แนะนำ action skill ต่อ opportunity: `/add-more`, `/idea-features`, `/improve`, `/fix`
4. ทำ `/suggest-next-action` โดยอ้างอิง top opportunities

## Rules

### 1. Meta-Review Only

- ทำ aggregation เท่านั้น ไม่ทำ dimensional review เอง
- ใช้ findings จาก `/review-*` skills ที่ run แล้ว
- ถ้าไม่มี report ให้ run dimensional review ก่อน แล้วค่อย aggregate

### 2. Apply /dont-over-engineer

- ใช้ minimal changes เมื่อรายงานและแนะนำ
- ไม่สร้าง abstraction, schema, หรือ workflow ที่ไม่จำเป็น
- ใช้ simple scoring (impact / effort) แทน multi-factor formula
- หยุดเมื่องานเสร็จ ไม่ทำลึกเกินกว่าที่จำเป็น

### 3. Evidence-Based

- ทุก gap ต้อง trace กลับไปยัง dimensional review finding
- ระบุ source dimension และ location
- ห้ามสร้าง gap ที่ไม่มีใน report

### 4. No Implementation

- ทำ review และ recommend เท่านั้น ไม่ implement
- แนะนำ action skill แต่ไม่ execute
- ถ้า user ต้องการ implement → ส่งต่อผ่าน `/suggest-next-action`

### 5. Simple Output

- ตอบในแชทเท่านั้น ไม่สร้างไฟล์แยก
- ใช้ `/report-table` สำหรับตาราง
- ระบุ quick wins และ top 3-5 opportunities เท่าที่จำเป็น

## Expected Outcome

- ตาราง prioritized improvement list พร้อม category, score, action skill
- รายการ quick wins
- รายการ coverage gaps (ถ้ามี)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
