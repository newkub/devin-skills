---
name: skill-type-idea
description: Template สำหรับ idea-* skills สร้างไอเดีย
allowed-tools:
  - read
  - grep
  - glob
  - ask_user_question
triggers:
  - user
  - model
---

## Goal

Template สำหรับสร้าง `idea-*` skills ที่สร้างไอเดีย วิเคราะห์ gaps และ opportunities พร้อม continuous numbering

## Scope

ใช้สำหรับ skills ที่สร้างไอเดีย เช่น `idea-features`, `idea-uxui`, `idea-improve-naming`, `compare-and-idea-features`

## Execute

### 1. Gather Context

รวบรวม context ก่อนสร้างไอเดีย
> Goal: ไอเดียตรงกับ project และ user needs

1. ทำ `/deep-analyze` เพื่อเข้าใจ current state
2. ทำ `/bench-competitors` ถ้าต้องเปรียบเทียบ
3. อ่าน user feedback, อ่าน issues, อ่าน feature requests
4. ระบุ constraints: timeline, budget, team size

### 2. Identify Gaps

ระบุ gaps และ opportunities
> Goal: รู้ว่าขาดอะไร โอกาสอะไร

1. วิเคราะห์ gaps (missing features, UX issues, performance bottlenecks)
2. ระบุ opportunities: new trends, user pain points, competitive advantages
3. จัดกลุ่ม gaps ตาม category
4. จัดลำดับตาม impact และ feasibility

### 3. Generate Ideas

สร้างไอเดียพร้อม continuous numbering
> Goal: ไอเดียที่ actionable และ track ได้

1. สร้างไอเดียสำหรับแต่ละ gap หรือ opportunity
2. ใช้ continuous numbering (ไม่ต่อจากเดิมถ้ามีอยู่แล้ว)
3. ระบุ scope สำหรับแต่ละไอเดีย: quick win, short-term, long-term
4. ระบุ impact และ effort สำหรับแต่ละไอเดีย

### 4. Report

รายงานไอเดียเป็นตาราง
> Goal: ผู้ใช้เห็นไอเดียทั้งหมดพร้อมลำดับความสำคัญ

1. ทำ `/report-table` สำหรับ summary
2. คอลัมน์: number, idea, category, impact, effort, scope
3. จัดลำดับตาม impact/effort ratio
4. ทำ `/suggest-next-action`

### 5. Refine And Prioritize

ปรับแต่งและจัดลำดับไอเดีย
> Goal: ไอเดียพร้อมลงมือทำตามความเหมาะสม

1. ทบทวนไอเดียกับ stakeholders หรือ user feedback
2. รวมหรือแยกไอเดียตามความใกล้เคียง
3. ระบุ dependencies และ prerequisites ของไอเดีย
4. ทำ `/suggest-next-action` สำหรับ top ideas

## Rules

### 1. Actionable

- ทุกไอเดียต้อง actionable ไม่เป็นแค่ concept
- ระบุ scope และ effort ชัดเจน
- ถ้าไอเดียซับซ้อน → แบ่งเป็น sub-ideas

### 2. Continuous Numbering

- ใช้ continuous numbering ต่อจากไอเดียเดิมถ้ามี
- ไม่ reset numbering ระหว่าง runs
- เก็บไอเดียเดิมไว้ ไม่ลบ

### 3. Evidence-Based

- ทุกไอเดียต้องมีพื้นฐานจาก analysis
- ระบุ gap หรือ opportunity ที่ไอเดียตอบ
- ถ้าเป็น creative idea → ระบุ inspiration source

### 4. No Over-Engineering

- ไม่เสนอไอเดียที่ซับซ้อนเกินจำเป็น
- ถ้าไอเดียต้องการ refactor ใหญ่ → ระบุเป็น long-term
- ทำ `/dont-over-engineer`

### Package Structure

- `SKILL.md` คือ entry point หลัก
- สามารถมี `references/`, `scripts/`, `workflows/`, `guide/`, `examples/` ตามความจำเป็น
- ไฟล์ย่อยทุกไฟล์ไม่เกิน 250 บรรทัด

## Expected Outcome

- รายการไอเดียพร้อม continuous numbering
- ทุกไอเดียมี impact, effort และ scope
- จัดลำดับตาม impact/effort ratio
- ผู้ใช้รู้ next action ที่ชัดเจน
