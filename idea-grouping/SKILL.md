---
name: idea-grouping
description: สร้างไอเดียจัดกลุ่ม items ตาม context — criteria, themes และ target groups
argument-hint: "[scope-or-items]"
related:
  - idea
  - idea-merge
  - grouping
  - taxonomy
  - relocation
  - scan-codebase
  - report
  - then-apply
  - suggest-next-action
  - dont-over-engineer
---

## Goal

สร้างไอเดียการจัดกลุ่ม items ให้เป็น groups ที่ชัดเจนและไม่ซ้อนทับ โดย context-aware และ continuous numbering

## Scope

ใช้เมื่อต้องการวิเคราะห์ว่าควรจัดกลุ่มอะไรอย่างไร:

- files, folders, skills, modules, workflows
- ideas หรือ findings ที่สร้างจาก `idea-*`/`review-*` skills ที่ต้อง cluster ตาม theme
- data items, configs, หรือ repository artifacts ใดๆ ที่ยังไม่มีโครงสร้างกลุ่ม

ไม่ลงมือ execute grouping — ส่งต่อ `/grouping` หรือ `/relocation` เมื่อได้ไอเดียและ user confirm

- ต่างจาก `/idea` (dispatcher ไอเดียทั่วไป) — skill นี้เน้นเสนอ grouping criteria และ target groups เท่านั้น
- ไม่รวม merge/consolidation ideas (ใช้ `/idea-merge`) หรือ taxonomy design (ใช้ `/taxonomy`)

## Execute

### 1. Analyze Context

> Goal: รวบรวม context ก่อนสร้างไอเดียจัดกลุ่ม

1. ระบุ scope หรือชุด items จาก argument หรือ context ปัจจุบัน — ไม่ชัด → ทำ `/ask-me`
2. ถ้า scope เป็น repo/directory → ทำ `/scan-codebase` เพื่อดู structure และ items จริง
3. ถ้า input เป็น ideas/findings เดิม → ใช้ list ที่มีอยู่โดยตรง ไม่ต้อง scan ซ้ำ
4. ระบุ attributes ของแต่ละ item: domain, feature, layer, type, size, relationships

### 2. Identify Grouping Opportunities

> Goal: ระบุ items ที่ควรถูกจัดกลุ่ม

1. ระบุ items ที่มี purpose หรือ domain เดียวกันแต่กระจายอยู่
2. ระบุ flat structures ที่มี items มากเกินไปและควรแบ่งเป็น sub-groups
3. ระบุ items ที่ถูกเรียกใช้หรือเปลี่ยนแปลงร่วมกันบ่อย
4. ระบุ groups เดิมที่ซ้อนทับหรือ criteria ไม่สอดคล้อง

### 3. Evaluate Grouping Options

> Goal: ประเมิน criteria และ action ที่เหมาะสม

1. เลือก criteria หลัก: `domain`, `feature`, `layer`, `type`, หรือ `usage`
2. ประเมินแต่ละ opportunity ตามเงื่อนไข:
   - `group` — items ที่ยังไม่มี group หรือกระจายอยู่
   - `regroup` — group เดิมมี criteria ผิดหรือซ้อนทับ
   - `keep` — cohesion ดีอยู่แล้ว ไม่มี benefit ชัดเจน
3. ทำ `/dont-over-engineer` เพื่อกรองไอเดียที่สร้าง groups เกินจำเป็น
4. ตรวจว่า groups ที่เสนอไม่ซ้อนทับกันเองและครอบคลุม items ทั้งหมด

### 4. Generate Ideas

> Goal: สร้างไอเดียจัดกลุ่มแบบ actionable

1. สร้างไอเดียสำหรับแต่ละ opportunity
2. ใช้ continuous numbering ต่อจากไอเดียเดิมถ้ามี
3. ระบุ scope: `quick win`, `short-term`, `long-term`
4. ระบุ action: `group`, `regroup`, `keep`
5. ระบุ criteria, target group name, source items และ impact/effort

### 5. Report

> Goal: รายงานไอเดียและ next action

1. ทำ `/report table`
2. คอลัมน์: No., Items, Group, Criteria, Issue, Idea, Action, Impact, Effort
3. จัดลำดับตาม impact/effort ratio
4. ถ้ามี action ต่อเนื่องจาก idea ก่อนหน้า → ใช้ `/then-apply`
5. ทำ `/suggest-next-action`
6. ถ้าพร้อม execute → แนะนำให้ทำ `/grouping` หรือ `/relocation` ตามชนิดของ items

## Rules

### 1. Context-Aware

- ไม่จำกัดเฉพาะ files — รองรับทุก artifact รวมถึง ideas ที่สร้างจาก session ก่อนหน้า
- ระบุ criteria ที่ใช้จัดกลุ่มในแต่ละไอเดีย
- ใช้ `/ask-me` ถ้า scope หรือ items ไม่ชัด

### 2. Evidence-Based

- ทุกไอเดียต้องมาจาก analysis จริง
- ระบุ file path, item names, หรือ observed scatter ที่เกี่ยวข้อง
- อ้างอิง item counts, shared attributes หรือ co-usage patterns

### 3. Actionable And Numbered

- ใช้ continuous numbering
- ระบุ action ชัดเจน: `group`, `regroup`, `keep`
- ระบุ target group และ source items ทุกไอเดีย

### 4. No Over-Grouping

- ไม่เสนอ group ที่ไม่มี benefit ชัดเจน
- ไม่สร้าง groups เพื่อลดจำนวน top-level อย่างเดียว
- ทำ `/dont-over-engineer`

## Expected Outcome

- รายการไอเดียจัดกลุ่มแบบ continuous numbering
- ทุกไอเดียมี items, group, criteria, action, impact, effort
- ตาราง `/report` พร้อม next action
- ไอเดียพร้อม execute ด้วย `/grouping` หรือ `/relocation`
