---
name: improve-uxui-improve-states
description: เพิ่ม missing UI states — loading, empty, error, skeleton บน routes/components
argument-hint: "[route-or-component]"
related:
  - review-uxui
  - follow-design-system
  - use-agent-browser
  - report-before-after
---

## Goal

เพิ่ม/แก้ missing UI states — loading, empty, error, skeleton — ให้ทุก async data และ list render มี feedback ชัดเจนตาม design system ของ project

## Scope

- ใช้เมื่อ functional/visual pass พบ missing states หรือ user สั่งโดยตรง
- ครอบคลุม: loading spinners/skeletons, empty states, error states, retry actions, partial data states
- ใช้ components/patterns ที่ project มีอยู่ — ห้ามสร้าง state design ใหม่ถ้ามีอยู่แล้ว

## Execute

### 1. Find Missing States

> Goal: รู้ว่าจุดไหนขาด state ใด

1. รวม findings จาก passes — routes ที่ blank ขณะโหลด, lists ที่ว่างเปล่า, errors ที่เงียบ
2. ถ้าไม่มี findings → สแกน data-fetching points: ทุก async boundary ต้องมี loading + error, ทุก list ต้องมี empty
3. ระบุ state components/patterns ที่ project มีอยู่แล้ว — Skeleton, EmptyState, ErrorBoundary, spinner

### 2. Add Loading And Skeleton

> Goal: user เห็น feedback ทุก async operation

1. จุดที่โหลด layout-heavy content → skeleton ที่ตรงรูปทรง content แทน spinner กลางจอ
2. จุดที่ action-triggered (submit, save) → loading บน control นั้น + disable กัน double-submit
3. route-level loading → suspense boundary หรือ loading file ตาม framework convention

### 3. Add Empty And Error States

> Goal: ไม่มีหน้าจอว่างหรือ error เงียบ

1. lists/tables/search results → empty state พร้อมข้อความและ next action (เช่น CTA สร้างรายการแรก)
2. fetch failures → error state พร้อม retry action — ห้าม render ว่างหรือ crash
3. error boundaries ที่ route/section level — partial failure ไม่ทำทั้งหน้าพัง
4. ข้อความภาษาและ tone ตาม i18n/content conventions ของ project

### 4. Verify

> Goal: ทุก state render ได้จริง

1. trigger จริงแต่ละ state: throttle network → loading, empty data → empty state, force fail → error + retry
2. capture screenshots ทุก state ที่เพิ่ม — before/after
3. ตรวจ transitions ไม่กระพริบ — loading → content ไม่ layout shift

## Rules

- ใช้ state components/patterns ที่มีใน project ก่อน — consistency ก่อนความสวย
- ทุก async boundary ต้องมีอย่างน้อย loading + error; ทุก list ต้องมี empty
- ข้อความต้อง actionable — บอกว่าเกิดอะไรและทำอะไรต่อได้
- ห้าม block render ทั้งหน้าด้วย spinner เดียวถ้า content บางส่วนโหลดได้
- before/after screenshot ทุก state ที่เพิ่ม

## Expected Outcome

- ทุก async data/list มี loading, empty, error states ครบ
- states สอดคล้องกับ design system ของ project
- verify ด้วย triggered states จริงพร้อม evidence
