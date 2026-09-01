---
name: improve-uxui
description: ปรับ UX/UI ให้สวยงาม เข้าใจง่าย ใช้งานง่าย โดย deep-thinking/pondering ว่า UX/UI ที่ดีควรเป็นยังไง แล้วเลือก action ตามผล
argument-hint: "[file-or-pattern]"
related:
  - review-uxui
  - deep-thinking
  - pondering
  - rethink
  - follow-design-system
  - optimize-everything
  - ship-verify-cicd
  - suggest-next-action
  - report
---

## Goal

ปรับปรุง UX/UI ของ project ให้เป็น design system ทีสวยงาม เข้าใจง่าย และใช้งานง่าย โดย deep-thinking/pondering ว่า UX/UI ทีดีควรเป็นยังไง แล้วเลือก action ตามผล

## Scope

- ใช้กับ web และ TUI projects
- เน้น design system, visual consistency, accessibility, interaction
- ไม่ต้อง capture ภาพหน้าจอ ใช้การคิดวิเคราะห์ภายในแทน
- ไม่แก้ code โดยตรงถ้าไม่จำเป็น แต่จะชี้ไปยัง skill ทีเหมาะสม
- ถ้าไม่มี UI หรือไม่มีสิ่งแก้ไข → stop และ report

## Execute

### 1. Ponder & Define Good UX/UI

> Goal: คิดวิเคราะห์ภายในว่า UX/UI ทีดีควรเป็นยังไง

1. ทำ `/deep-thinking "what makes a good UX/UI for this project"` โดยไม่ต้อง capture หรือใช้ external tools
2. ทำ `/pondering "UX/UI trade-offs and design direction"` เพื่อทบทวนมุมมองผู้ใช้ ระบบ และอนาคต
3. ระบุหลักการสำคัญสำหรับ project นี้ เช่น visual hierarchy, consistency, accessibility, feedback, motion
4. ถ้ามี screenshots หรือ context จาก user อยู่แล้ว → อ่านด้วย `/read` แล้วนำมาประกอบการคิด
5. สรุป design principles ทีจะใช้ guide การปรับปรุง

### 2. Review First

> Goal: เข้าใจปัญหา UX/UI ก่อนแก้

1. ทำ `/review-uxui <file-or-pattern>`
2. บันทึก findings, severity, score
3. ถ้าไม่มี UI หรือไม่มี findings ทีแก้ไขได้ → stop และ report

### 3. Decide Action

> Goal: เลือก skill ทีเหมาะสมตามผล review

| ปัญหาทีพบ | Action |
|-----------|--------|
| ไม่มี design system / tokens ไม่สม่ำเสมอ | `/follow-design-system` |
| ปัญหา accessibility / contrast / focus / keyboard | `/follow-design-system` หรือแก้เฉพาะจุด |
| ปัญหา performance / SEO / bundle | `/optimize-everything` |
| ต้องการมุมมอง user หรือ designer | `/roleplay-stakeholder` |
| code พร้อมแล้ว ต้องการส่งมอบ | `/ship-verify-cicd` |

เลือก 1-3 actions ทีมี impact สูงสุด อย่า over-engineer

### 4. Apply Design System

> Goal: สร้างความสม่ำเสมอให้ UI

1. ถ้าเลือก `/follow-design-system` → กำหนด tokens: colors, typography, spacing, radius, shadows
2. สร้าง / ปรับ reusable components
3. อัปเดต theme config ให้เป็นระบบ
4. ใช้ tokens ใหม่แทนค่า hardcode เก่า

### 5. Verify

> Goal: ยืนยันว่า UX/UI ดีขึ้น

1. ทำ `/review-uxui` อีกครั้ง
2. รัน `bun run build` และ `bun run typecheck` ถ้ามี
3. ถ้า project เป็น web → เปิด browser ตรวจ visual และ interaction

### 6. Ship

> Goal: ส่งมอบงานทีผ่านการ verify

1. ทำ `/deep-validate`
2. ถ้าผ่านและมี code changes → ทำ `/ship-verify-cicd`
3. ทำ `/report` สรุป before/after score, สิ่งทีแก้, และ next actions
4. ทำ `/suggest-next-action`

## Rules

- ต้องเริ่มจาก `/deep-thinking` หรือ `/pondering` ก่อนเสมอ
- ไม่ต้อง capture หน้าจอภายใน skill นี้ ให้คิดวิเคราะห์จาก context ทีมี
- ไม่เรียกตัวเอง (`/improve-uxui`) ซ้ำ
- เลือก action ตาม severity / impact ไม่ทำทุกอย่างในครั้งเดียว
- ใช้ `/follow-design-system` เป็นหลักสำหรับ design system
- ใช้ `/optimize-everything` เฉพาะเมื่อเจอปัญหา performance/SEO
- ไม่ commit ก่อนตรวจสอบผ่าน

## Expected Outcome

- มี design principles ทีตอบโจทย์ผู้ใช้และ project context
- มี design system ทีสม่ำเสมอ
- UX/UI ใช้งานง่าย เข้าใจง่าย สวยงาม
- Review score ดีขึ้นจาก before
- รายงาน before/after, next actions ชัดเจน

