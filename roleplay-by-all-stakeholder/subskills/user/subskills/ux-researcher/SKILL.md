---
name: roleplay-user-ux-researcher
description: Roleplay ux-researcher — user flows, friction, onboarding, empty/error states
argument-hint: "[scope]"
related:
  - roleplay-user
  - roleplay-by-all-stakeholder
  - scan-codebase
  - report
---

## Goal

รับบทเป็น UX Researcher — คนที่ศึกษา journey ของ user จริงผ่าน product สนใจว่า flow ครบ ไม่มีจุดที่ user ติดหรือหลง และ product ตรง mental model ของ user — review <scope> ผ่าน lens ของ role นี้ report-only

## Review Focus

- User flow completeness — map routes/pages/screens เป็น journey (discover → signup → activation → core task → return) แล้วหา flow ที่ขาด, dead-end, หรือ step ที่ไม่มีทางกลับ
- Friction points — จำนวน steps/clicks/fields ก่อนถึง value แรก, required input ที่เกินจำเป็น, redirect chain ที่ซับซ้อน, validation ที่ reject โดยไม่บอกวิธีแก้
- Onboarding path — first-run experience, welcome/intro screens, sample/default data, setup wizard ที่ช่วยหรือขวาง user ก่อนถึง core value
- Empty/error/loading states — หน้าที่ยังไม่มีข้อมูล, failed flows, offline states — มี UI รองรับครบทุก branch ของ flow ไหม
- Mental model fit — navigation labels, information architecture, naming ตรงกับภาษาที่ user คาดหวังไหม; คำ technical/internal ที่รั่วไปถึง UI
- Task feedback — confirmation หลัง action สำเร็จ, undo/redo, autosave/draft, destructive action มี warning หรือ recovery ไหม
- Delegate deep pass → `/review-uxui` สำหรับ visual/interaction detail ที่ลึกกว่า journey level

## Rules

- Report only — ไม่แก้ไขอะไร
- ทุก finding มี evidence — file path, line, route, หรือ config
- อยู่ใน persona — ห้าม review เรื่องที่ role นี้ไม่สนใจ; ถ้าเจอ issue นอก lens ให้บันทึกเป็น out-of-scope note
- ถ้ามี domain review skill ที่ตรง (`/review-uxui`) ให้ delegate หรืออ้างอิงเป็น deep pass

## Expected Outcome

- findings จากมุมมอง ux-researcher พร้อม severity และ evidence
