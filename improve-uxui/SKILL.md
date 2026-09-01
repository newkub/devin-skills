---
name: improve-uxui
description: ปรับ UX/UI all routes และ all components ด้วย deep-thinking/pondering แล้ว follow-design-system
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

ปรับปรุง UX/UI ของ project ให้ครอบคลุม all routes และ all components โดย deep-thinking/pondering ว่า UX/UI ทีดีควรเป็นยังไง แล้วใช้ `/follow-design-system` สร้างความสม่ำเสมอ

## Scope

- ใช้กับ web และ TUI projects
- ครอบคลุม all routes และ all components ของ project
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

### 2. Review All Routes And Components

> Goal: เข้าใจปัญหา UX/UI ทั้งหมดก่อนแก้

1. หา routes ทั้งหมดจาก file structure (`src/app`, `src/pages`, `src/routes`)
2. หา components ทั้งหมดจาก `src/components` และ `src/ui`
3. ทำ `/review-uxui` ทีละ route และทีละ component กลุ่มย่อย
4. บันทึก findings, severity, score รวมกันเป็น overall score
5. ถ้าไม่มี UI หรือไม่มี findings ทีแก้ไขได้ → stop และ report

### 3. Decide Action

> Goal: เลือก skill ทีเหมาะสมตามผล review

- ถ้าพบปัญหา design system / tokens / consistency ให้ใช้ `/follow-design-system` เป็นหลัก
- ถ้าพบปัญหา accessibility / contrast / focus / keyboard ให้ใช้ `/follow-design-system` หรือแก้เฉพาะจุด
- ถ้าพบปัญหา performance / SEO / bundle ให้ใช้ `/optimize-everything`
- ถ้าต้องการมุมมอง user หรือ designer ให้ใช้ `/roleplay-stakeholder`
- ถ้า code พร้อมแล้ว ต้องการส่งมอบ ให้ใช้ `/ship-verify-cicd`

เลือก 1-3 actions ทีมี impact สูงสุด อย่า over-engineer

### 4. Apply Design System To All Routes And Components

> Goal: ใช้ `/follow-design-system` สร้างความสม่ำเสมอให้ all routes และ all components

1. ทำ `/follow-design-system` เพื่อกำหนด tokens: colors, typography, spacing, radius, shadows
2. สร้าง / ปรับ reusable components ให้ครอบ all components
3. อัปเดต theme config ให้เป็นระบบ
4. ใช้ tokens ใหม่แทนค่า hardcode เก่าทั้ง all routes และ all components
5. ทำ `/review-uxui` ซ้ำทีละ route/component กลุ่มย่อยเพื่อยืนยันว่า apply ครบ

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
- มี design system ทีสม่ำเสมอผ่าน `/follow-design-system`
- all routes และ all components ถูก review และปรับปรุง
- UX/UI ใช้งานง่าย เข้าใจง่าย สวยงาม
- Review score ดีขึ้นจาก before
- รายงาน before/after, next actions ชัดเจน

