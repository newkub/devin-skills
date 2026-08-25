---
name: review-gaps
description: Meta-review aggregate findings จาก dimensional reviews เป็น prioritized improvement roadmap
---

## Goal

Meta-review ที่รวบรวม findings จาก dimensional reviews (`review-quality`, `review-realize-implementation`, `review-delivery`, `review-frontend`, `review-backend`, `review-platform`, `review-architecture`, `review-stability`, `review-techstack`, `review-writing`, `review-rules`, `review-codebase`) มา deduplicate, cross-reference, score, และ prioritize เป็น improvement roadmap

## Scope

ใช้เมื่อต้องการรวม findings จากหลาย dimensional reviews เป็น roadmap เดียวที่จัดลำดับครบ ไม่ทำ dimensional review เอง — เก็บ, ตัดซ้ำ, cross-reference, และจัดลำดับเท่านั้น

ครอบคลุม:

- missing features, quality gaps, implementation gaps, DX gaps, performance gaps, security gaps, architecture gaps, delivery gaps
- deduplication ข้าม dimensions
- causal relationships ระหว่าง gaps
- scoring: impact × effort × criticality
- recommended action skill ต่อ opportunity

ดูรายละเอียดใน `references/collection.md`, `references/deduplication.md`, `references/categorization.md`, `references/scoring.md`, และ `references/roadmap.md`

## Execute

### 1. Prepare

> Goal: เข้าใจ codebase และระบุ dimensional reviews ที่จะรวม

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure, tech stack, และ scope
2. ระบุ dimensional reviews ที่เกี่ยวข้องกับ project ตาม context
3. ตรวจว่ามี review reports อยู่แล้วหรือต้อง run ใหม่
4. ถ้าไม่มี code หรือ artifacts ให้ review → stop และ report

### 2. Run Dimensional Reviews

> Goal: ให้ findings จากทุก dimension ที่เกี่ยวข้อง

1. ทำ `/review-quality`, `/review-realize-implementation`, `/review-delivery` ตาม context
2. ทำ `/review-frontend`, `/review-backend`, `/review-platform` ถ้ามีส่วนที่เกี่ยว
3. ทำ `/review-architecture`, `/review-stability`, `/review-techstack` ถ้าจำเป็น
4. ทำ `/review-writing`, `/review-rules`, `/review-codebase` ถ้าจำเป็น
5. ข้าม dimension ที่ไม่เกี่ยวข้องกับ project
6. เก็บ reports ทุก dimension ไว้สำหรับ aggregation

### 3. Collect Findings

> Goal: รวม findings ทั้งหมดจาก dimensional review reports

1. ดึง findings จากทุก dimensional review report
2. บันทึก source dimension, severity, location, และ evidence ต่อ finding
3. ดู criteria ใน `references/collection.md`

### 4. Deduplicate

> Goal: ตัด findings ที่ซ้ำกันข้าม dimensions

1. จับคู่ findings ที่อ้างถึง issue เดียวกัน
2. รวมเป็น single finding พร้อมระบุทุก source dimensions
3. ดู criteria ใน `references/deduplication.md`

### 5. Cross-Reference

> Goal: ระบุ causal relationships ระหว่าง gaps

1. หา gap ที่เป็น root cause ของ gap อื่น
2. หา gap ที่เกิดจาก gap อื่น (downstream effect)
3. ทำเครื่องหมาย dependency chain ระหว่าง gaps
4. ดู criteria ใน `references/deduplication.md`

### 6. Categorize

> Goal: จัดกลุ่ม findings เป็น improvement opportunity categories

1. จัดทุก finding เข้าหมวด: missing features, quality gaps, implementation gaps, DX gaps, performance gaps, security gaps, architecture gaps, delivery gaps
2. รวม findings ที่เกี่ยวข้องในหมวดเดียวกันเป็น opportunity
3. ดู categories ใน `references/categorization.md`

### 7. Score

> Goal: ให้คะแนนแต่ละ opportunity อย่างโปร่งใสและ reproducible

1. ประเมิน impact, effort, และ criticality ต่อ opportunity
2. คำนวณ score = impact × effort × criticality ตาม `references/scoring.md`
3. บันทึกคะแนนย่อยเพื่อ reproducibility

### 8. Prioritize

> Goal: จัดลำดับ opportunities ตาม score และ dependencies

1. เรียง opportunities ตาม score จากสูงไปต่ำ
2. ระบุ quick wins (high impact, low effort) และ high-impact items
3. ปรับลำดับตาม dependency chain จาก Step 5
4. ทำ `/prioritize` เพื่อยืนยันลำดับ
5. ดู format ใน `references/roadmap.md`

### 9. Report

> Goal: ส่งมอบ roadmap ที่อ่านง่าย พร้อม action skill ต่อ opportunity

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Prioritized Roadmap: Rank, Opportunity, Category, Score, Impact, Effort, Criticality, Action Skill, Sources
3. แนะนำ action skill ต่อ opportunity: `/list-improvements`, `/add-more`, `/idea-features`, `/bench-features`
4. แสดง dependency chain และ quick wins แยก
5. ดู format ใน `references/roadmap.md`

### 10. Suggest Next Action

> Goal: แนะนำ action ถัดไปที่ควรทำ

1. ทำ `/suggest-next-action` โดยอ้างอิง top opportunities
2. ระบุ opportunity แรกที่ควรลงมือ
3. ระบุ action skill ที่แนะนำสำหรับ opportunity นั้น

## Rules

### 1. Meta-Review Only

- ทำ aggregation เท่านั้น ไม่ทำ dimensional review เอง
- ใช้ findings จาก `/review-*` skills ที่ run แล้วหรือมี report อยู่
- ถ้าไม่มี report ให้ run dimensional review ก่อน แล้วค่อย aggregate

### 2. Evidence-Based

- ทุก gap ต้อง trace กลับไปยัง dimensional review finding
- ระบุ source dimension, file path, และ line number
- ห้ามสร้าง gap ที่ไม่มีใน report ใด

### 3. No Implementation

- ทำ review และ recommend เท่านั้น ไม่ implement
- แนะนำ action skill แต่ไม่ execute
- ถ้า user ต้องการ implement → ส่งต่อผ่าน `/suggest-next-action`

### 4. Scoring Transparency

- formula ต้อง reproducible ตาม `references/scoring.md`
- บันทึกคะแนนย่อย impact, effort, criticality ต่อ opportunity
- คะแนนเดียวกันต้องได้ลำดับเดียวกันเสมอ

### 5. Coverage

- ต้องพิจารณาทุก dimension ที่เกี่ยวข้อง ไม่ cherry-pick
- ระบุ dimensions ที่ข้ามพร้อมเหตุผล
- ถ้า dimension สำคัญขาด → report เป็น coverage gap

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
- ตอบในแชทเท่านั้น ไม่สร้างไฟล์แยก

## Expected Outcome

- ตาราง Prioritized Roadmap พร้อม score และ action skill ต่อ opportunity
- รายการ quick wins และ high-impact items แยก
- dependency chain ระหว่าง gaps
- coverage report ระบุ dimensions ที่รวมและข้าม
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
