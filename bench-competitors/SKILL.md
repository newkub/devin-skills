---
name: bench-competitors
description: ศึกษาคู่แข่งและปรับปรุง project ให้ดีกว่าในทุกมิติ
argument-hint: "[scope]"
related:
  - create-plan-in-dot-devin
  - create-report-in-dot-devin
  - deep-research
  - deep-review-codebase
  - deep-thinking
  - deep-plan
  - report-table
  - idea-features
  - ask-me
  - suggest-next-action
  - ship
  - update-docs
---

## Goal

ศึกษาคู่แข่งและปรับปรุง project ให้ดีกว่าในทุกมิติ

## Scope

ครอบคลุมทุกมิติของ product: features, performance, UX/UI, architecture, DX, security, scalability, business ไม่ใช่แค่มิติใดมิติหนึ่ง

- มิติ features ทำ inline ใน skill นี้ (merged จาก `/bench-features`) — ใช้ `/deep-research` รวบรวม features คู่แข่ง, สร้าง comparison matrix, หา gaps
- ถ้าต้องการไอเดีย features ใหม่ → ใช้ `/idea-features` หรือ `/idea-features`

ดูเพิ่มเติม: /deep-review-codebase

## Execute

### 1. Research Competitors

> Goal: วิจัยคู่แข่งที่ relevant

1. รับ `<scope>` จาก argument หรือ conversation context
2. ทำ `/deep-research` เพื่อระบุ direct และ indirect competitors
3. เลือก competitors 3-5 รายที่ใกล้เคียงหรือเหนือกว่า
4. วิเคราะห์ strengths, weaknesses, unique selling points, tech stack, UX patterns
5. ถ้า scope ไม่ชัด → ใช้ `/ask-me` ก่อน; ถ้าหาข้อมูลไม่ได้ → stop และ report

### 2. Benchmark Features

> Goal: เปรียบเทียบและหา gaps มิติ features

1. ทำ `/deep-research` ต่อ competitor เพื่อรวบรวม feature list, feature matrix, pricing tiers ที่ผูกกับ features จาก official docs, changelogs, reviews และ user feedback
2. จัดกลุ่ม features ตามหมวด เช่น core, advanced, integrations, automation
3. ทำ `/deep-research` เพื่อยืนยัน features ปัจจุบันของ project ถ้า codebase ไม่พอ
4. สร้าง feature comparison matrix: project vs คู่แข่งแต่ละราย — ทำ `/report-table` โดยมีคอลัมน์ `No.` เป็นคอลัมน์แรก และระบุสถานะแต่ละ feature: `มี`, `ไม่มี`, `ดีกว่า`, `ด้อยกว่า`, `เท่ากัน`
5. บันทึกผลเป็น `comparison-features.md` ใน `docs/project/`
6. รวม features ที่ project `ไม่มี` และ `ด้อยกว่า` เป็น gap list — แต่ละ gap ระบุ: feature, competitor ที่มี, impact, effort โดยประมาณ
7. ระบุ unique features ของ project ที่คู่แข่งไม่มีเพื่อรักษาไว้
8. สร้าง prioritized feature list: Critical, High, Medium, Nice-to-have
9. ถ้า `/deep-research` หาข้อมูลไม่ได้ → stop และ report

### 3. Benchmark Other Dimensions

> Goal: เปรียบเทียบมิติที่เหลือนอกเหนือ features

1. ทำ `/deep-review` สำหรับ performance
2. ทำ `/deep-review` สำหรับ UX/UI
3. ถ้ามีมิติอื่น (architecture, DX, security, scalability, business) ให้ใช้เครื่องมือที่เหมาะสม
4. บันทึกผลใน `docs/project.md`

### 4. Plan Improvements

> Goal: วางแผนปรับปรุงให้ดีกว่าคู่แข่ง

1. ทำ `/deep-thinking` เพื่อทบทวน priority และผลกระทบ
2. ทำ `/deep-plan` เพื่อสร้าง roadmap ครอบทุกมิติ
3. ทำ `/create-plan-in-dot-devin` จาก roadmap บันทึก `PLAN_PATH`
4. ระบุ priority: Critical, High, Medium, Nice-to-have
5. ถ้า scope ไม่ชัด → ใช้ `/ask-me` ก่อน plan

### 5. Report Results

> Goal: บันทึกผล benchmark เป็น report ใน .devin

1. ทำ `/create-report-in-dot-devin` บันทึกผล benchmark ลง `.devin/reports/<workspace>/` — title เช่น `benchmark-competitors`
2. รวม comparison matrix, gap list และ prioritized feature list ใน report
3. รายงาน `REPORT_PATH` ให้ user

### 6. Implement Improvements

> Goal: ปรับปรุง project ตาม roadmap

1. ทำ `/ship` เพื่อ implement improvements ตาม `PLAN_PATH`
2. หลัง `/ship` เสร็จ ลบ `PLAN_PATH`
3. ทำ `/deep-review` สำหรับ performance improvements
4. ทำ `/deep-review` สำหรับ UX/UI improvements
5. หยุดเมื่อดีกว่าคู่แข่งทั้งหมดในทุกมิติ

### 7. Update Report

> Goal: อัปเดตรายงานเปรียบเทียบ

1. ทำ `/update-docs` เพื่ออัปเดต `docs/project.md`
2. อัปเดต status ในตารางเปรียบเทียบ
3. Re-benchmark หลังการปรับปรุง แล้วทำ `/create-report-in-dot-devin` ใหม่
4. ทำ `/suggest-next-action` โดยแนะนำ `/idea-features` ถ้าต้องการขยายไอเดียต่อ

## Rules

### 1. Focus On Actionable Insights

- เน้น metrics ที่ measurable และ actionable
- ไม่ research ลึกเกินความจำเป็น
- รายงานกระชับไม่เกิน 1 หน้า A4 ต่อ competitor

### 2. Document Structure

- ไฟล์หลัก `comparison.md` ใน `docs/project/`
- อนุญาตไฟล์ย่อย `comparison-*.md` จาก sub-workflows เช่น `comparison-features.md`
- ผล benchmark ต้องถูกบันทึกเป็น report ผ่าน `/create-report-in-dot-devin` ใน `.devin/reports/<workspace>/`
- 2-3 sections หลักพอ
- ไม่ต้องมี timeline ละเอียด

### 3. Multi-Dimension Focus

- ไม่ใช่แค่ features แต่ครอบคลุมทุกมิติ
- วัดด้วย metrics ที่ objective
- เปรียบเทียบกับ competitors ที่ relevant

### 4. Features Evidence

- ใช้ `/deep-research` ทุกครั้งที่ต้องการข้อมูลคู่แข่ง ไม่เดาจาก memory
- อ้างอิงแหล่งข้อมูลของแต่ละ feature claim
- ทุก feature gap ต้องมี evidence จาก competitor docs หรือ reviews
- ไม่สรุปว่า project ด้อยกว่าถ้าไม่มีหลักฐาน
- แยก `fact` (คู่แข่งมีจริง) ออกจาก `assumption` (คาดว่ามี)
- ทุก gap ต้อง map เป็น feature ที่ implement ได้ — ไม่รายงาน gap ที่กว้างเกินไปโดยไม่แตกเป็น feature ย่อย
- ผลลัพธ์ต้องพร้อมส่งต่อ `/create-plan-in-dot-devin` หรือ `/idea-features`

### 5. Implementation Discipline

- สร้าง plan ผ่าน `/create-plan-in-dot-devin` ก่อน implement
- ทำตาม plan จนกว่าจะดีกว่าคู่แข่ง
- ลบ plan หลัง `/ship` เสร็จ
- หยุดเมื่อสำเร็จเป้าหมายในทุกมิติ
- ติดตามความคืบหน้าอย่างสม่ำเสมอ
- Re-benchmark หลังการปรับปรุงแต่ละครั้ง

### 6. Stop When Better

- หยุดทันทีเมื่อ project ดีกว่าคู่แข่งในทุกมิติ
- ไม่ทำ over-engineering หรือเพิ่ม features ที่ไม่จำเป็น
- ย้ายไปทำงานอื่นเมื่อสำเร็จเป้าหมายแล้ว

## Expected Outcome

- Feature comparison matrix เทียบ project กับคู่แข่ง 3-5 ราย พร้อม prioritized gap list (impact + effort) และ unique features ที่ต้องรักษา
- ไฟล์ plan ใน `.devin/plan/<workspace>/` ถูกสร้างก่อน implement และลบหลัง `/ship` เสร็จ
- ไฟล์ report ใน `.devin/reports/<workspace>/` จาก `/create-report-in-dot-devin`
- ไฟล์ `docs/project.md` ที่มีตารางเปรียบเทียบทุกมิติ
- Project ดีกว่าคู่แข่งในทุกมิติ
- ใช้เวลาไม่เกิน 30 นาทีในการ benchmark
