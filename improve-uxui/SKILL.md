---
name: improve-uxui
description: ปรับปรุง UX/UI ของ project ด้วย orchestration ของ skills ย่อย
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
triggers:
  - user
  - model
related:
  - improve-codebase
  - improve-ux-writing
  - improve-web-accessibility
  - check-accessibility
  - senior-frontend
---

## Goal

ปรับปรุง UX/UI ของ project ให้ดีขึ้น โดยประสาน skills ย่อยทีเกี่ยวข้อง

## Scope

ใช้กับ project หรือ workspace ที่ต้องการปรับปรุง UX/UI, copy, accessibility, visual design, และ component interaction

## Execute

### 1. Analyze
> Goal: วิเคราะห์สถานะปัจจุบัน
1. ทำ /scan-codebase เพื่อหา issues ที่เกี่ยวข้อง
2. ทำ /review-codebase เพื่อรายละเอียดเพิ่ม
3. ระบุ UX/UI pain points: copy, navigation, accessibility, visual consistency, responsive
4. ถ้าไม่พบ issues -> stop และ report

### 2. Improve UX Writing
> Goal: ข้อความชัดเจนและสนับสนุน user journey
1. ทำ /improve-ux-writing ถ้าพบ issues ด้าน copy, labels, error messages, notifications
2. ทำ /improve-writing ถ้า documentation หรือ comments เกี่ยวข้อง

### 3. Improve Accessibility
> Goal: ใช้งานได้กับทุกคน
1. ทำ /check-accessibility เพื่อหา WCAG issues
2. ทำ /improve-web-accessibility สำหรับการแก้ไข accessibility

### 4. Improve UI And Frontend
> Goal: visual design, layout, components, interaction ดีขึ้น
1. ทำ /senior-frontend ถ้ามี issues ด้าน UI, performance, component design
2. ทำ /optimize-frontend ถ้า frontend performance เป็นปัญหา

### 5. Validate
> Goal: ยืนยันว่าปรับปรุงแล้วดีขึ้น
1. ทำ /validate หรือ /run-check
2. ถ้าไม่ผ่าน -> ทำ /resolve-errors แล้ว retry (max 3)
3. ทำ /suggest-next-action

## Rules
### 1. Minimal Changes
- ใช้ minimal changes
- ไม่แก้นอก scope
- ถ้าไม่แน่ใจ -> stop และ /ask-me

## Expected Outcome
- UX/UI ดีขึ้นตาม criteria
- ไม่มี regression
- รายงานสรุปผล
