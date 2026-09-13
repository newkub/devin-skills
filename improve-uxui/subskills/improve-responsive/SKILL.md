---
name: improve-uxui-and-features-improve-responsive
description: แก้ responsive issues — breakpoints, overflow, touch targets, mobile layout
argument-hint: "[route-or-component]"
related:
  - review-uxui
  - review-mobile
  - use-agent-browser
  - report-before-after
---

## Goal

แก้ responsive issues จาก visual pass — layout แตก, overflow, touch targets เล็กเกิน — ครบทุก breakpoint ที่ project รองรับ พร้อม before/after evidence

## Scope

- ใช้เมื่อ visual pass พบ responsive findings หรือ user สั่งโดยตรง
- ครอบคลุม: breakpoints, horizontal overflow, text truncation, touch target size, viewport-specific layout
- ใช้ breakpoints ของ project ที่มีอยู่ — ห้ามสร้างระบบใหม่

## Execute

### 1. Collect Findings

> Goal: รู้ว่า route/element ไหนแตกที่ viewport ไหน

1. รวม findings จาก visual pass — route, viewport width, ลักษณะปัญหา
2. ถ้าไม่มี findings → capture ทุก route ที่ mobile width (~375px) และ tablet (~768px) ด้วย `agent-browser`
3. ระบุ breakpoints ที่ project ใช้จาก CSS framework config (tailwind, unocss, media queries)

### 2. Fix Overflow And Layout

> Goal: ไม่มี horizontal scroll หรือ layout แตก

1. หา elements ที่ทำ overflow — fixed widths, long unbroken strings, tables, images ไม่มี `max-width`
2. แก้ด้วย fluid sizing (`minmax`, `clamp`, `%`), `overflow-wrap`, `min-width: 0` บน flex/grid children
3. stack layouts ที่ fixed multi-column บน viewport เล็ก — ใช้ responsive utilities ของ framework ที่มี
4. tables/wide data → horizontal scroll container หรือ card layout บน mobile

### 3. Fix Touch Targets

> Goal: interactive elements กดได้บน mobile

1. buttons, links, icon buttons, form controls → อย่างน้อย ~44x44px หรือตาม platform guideline
2. เพิ่ม padding หรือ hit area แทนขยาย visual size ถ้า design ต้องการเล็ก
3. ระยะห่างระหว่าง adjacent targets — กันผิดกด

### 4. Verify Across Breakpoints

> Goal: ผ่านทุก viewport ที่รองรับ

1. re-capture routes ที่แก้ทั้ง mobile, tablet, desktop — before/after screenshots
2. ตรวจไม่มี horizontal scrollbar และ content ไม่ถูกตัด
3. ตรวจ desktop ไม่ regression จาก mobile fixes

## Rules

- ใช้ breakpoints และ utilities ของ framework ที่ project ใช้ — ห้าม ad-hoc media queries ใหม่ถ้าไม่จำเป็น
- แก้ที่ shared components/layout primitives ก่อน per-route CSS
- ทุก fix ต้อง verify ทั้ง mobile และ desktop — mobile fix ห้ามทำ desktop พัง
- before/after screenshot ทุก fix — ห้ามแก้จาก intuition
- ถ้า layout ต้อง redesign ใหญ่ (information architecture เปลี่ยน) → `/ask-me` หรือ `/deep-thinking` ก่อน

## Expected Outcome

- ไม่มี horizontal overflow หรือ layout แตกบน breakpoints ที่รองรับ
- touch targets ผ่านขนาดขั้นต่ำ
- before/after evidence ครบทุก route ที่แก้
