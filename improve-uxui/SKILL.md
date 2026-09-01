---
name: improve-uxui
description: ปรับ UX/UI ให้สวยงาม เข้าใจง่าย ใช้งานง่าย โดยอ่าน review แล้วเลือก action ตามผล
argument-hint: "[file-or-pattern]"
related:
  - review-uxui
  - capture-image-app-to-screenshot
  - capture-component
  - from-downloads
  - from-recent-windows-capture
  - follow-design-system
  - optimize-everything
  - ship-verify-cicd
  - suggest-next-action
  - report
---

## Goal

ปรับปรุง UX/UI ของ project ให้เป็น design system ทีสวยงาม เข้าใจง่าย และใช้งานง่าย โดยเริ่มจาก `/review-uxui` แล้วเลือก action ตามปัญหาทีพบ

## Scope

- ใช้กับ web และ TUI projects
- เน้น design system, visual consistency, accessibility, interaction
- ไม่แก้ code โดยตรงถ้าไม่จำเป็น แต่จะชี้ไปยัง skill ทีเหมาะสม
- ถ้าไม่มี UI หรือไม่มีสิ่งแก้ไข → stop และ report

## Execute

### 1. Capture Screenshots

> Goal: มี reference images ของ UI ก่อน review

1. ถ้า project เป็น web หรือ TUI → ทำ `/capture-image-app-to-screenshot` เพื่อ capture ทุก route/component/view ลง `public/screenshots/`
2. ถ้า user มี screenshots อยู่ใน Downloads → ทำ `/from-downloads` เพื่ออ่านภาพ
3. ถ้ามี screenshots ล่าสุดจาก Windows → ทำ `/from-recent-windows-capture`
4. ถ้าต้องการ capture component แยก → ทำ `/capture-component <component-name-or-url>`
5. อ่านภาพที capture ได้ด้วย `/read` เพื่อเข้าใจสภาพ UI ปัจจุบัน

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

- ต้องเริ่มจาก `/review-uxui` เสมอ
- ไม่เรียกตัวเอง (`/improve-uxui`) ซ้ำ
- เลือก action ตาม severity / impact ไม่ทำทุกอย่างในครั้งเดียว
- ใช้ `/follow-design-system` เป็นหลักสำหรับ design system
- ใช้ `/optimize-everything` เฉพาะเมื่อเจอปัญหา performance/SEO
- ไม่ commit ก่อนตรวจสอบผ่าน

## Expected Outcome

- มี design system ทีสม่ำเสมอ
- UX/UI ใช้งานง่าย เข้าใจง่าย สวยงาม
- Review score ดีขึ้นจาก before
- รายงาน before/after, next actions ชัดเจน

