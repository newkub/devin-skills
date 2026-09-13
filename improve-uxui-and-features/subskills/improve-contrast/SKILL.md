---
name: improve-uxui-and-features-improve-contrast
description: แก้ color contrast ให้ผ่าน WCAG — design tokens, text/UI contrast, dark mode
argument-hint: "[route-or-component]"
related:
  - review-accessibility
  - review-uxui
  - follow-design-system
  - use-agent-browser
  - report-before-after
---

## Goal

แก้ color contrast issues ให้ผ่าน WCAG — แก้ที่ design tokens/shared components ก่อน per-element — พร้อม before/after evidence

## Scope

- ใช้เมื่อ visual/a11y pass พบ contrast findings หรือ user สั่งโดยตรง
- ครอบคลุม: text contrast, UI component contrast (borders, icons, focus indicators), dark/light mode pairs
- target: WCAG AA — text ปกติ 4.5:1, large text 3:1, non-text UI 3:1

## Execute

### 1. Collect Findings

> Goal: รู้ว่าจุดไหน contrast ไม่ผ่าน

1. รวม findings จาก `/review-accessibility` หรือ visual pass — element, สีเดิม, ratio เดิม
2. ถ้าไม่มี findings → audit ด้วย `agent-browser` snapshot/screenshot + computed styles บน routes ที่สงสัย
3. group findings ตาม token/component — จุดเดียวกันมักมาจาก token เดียวกัน

### 2. Fix At Token Level

> Goal: แก้ที่ root cause ไม่ใช่ per-element

1. ทำ `/follow-design-system` — หา color tokens ที่ใช้ (`--color-*`, theme config, tailwind/unocss tokens)
2. ปรับ token ให้ผ่าน ratio — เช็คทั้ง light และ dark mode pairs
3. ถ้าไม่มี design tokens → แก้ที่ shared component (Button, Badge, Link) ก่อน utility classes ใน routes

### 3. Fix Remaining Elements

> Goal: จัดการจุดที่ token fix ไม่ครอบคลุม

1. text บน background แปรผัน (images, gradients) → เพิ่ม overlay/scrim หรือเปลี่ยน text color
2. disabled/placeholder text → อย่าให้ต่ำกว่า 3:1 ถ้าสื่อความหมาย — หรือใช้ pattern อื่น
3. focus indicators, borders ของ interactive elements → ≥ 3:1 กับ adjacent colors

### 4. Verify

> Goal: ยืนยันผ่านด้วย evidence

1. re-capture routes ที่แก้ — before/after screenshots
2. ตรวจ computed contrast ของ elements ที่แก้แล้ว — ผ่าน AA target
3. ตรวจไม่มี visual regression อื่น — layout, hierarchy, brand colors ที่ตั้งใจ

## Rules

- แก้ที่ tokens/shared components ก่อนเสมอ — per-element fix เป็น fallback
- ทุก fix ต้อง cover ทั้ง light และ dark mode ถ้า project มี
- ห้ามทำให้ text อ่านไม่ได้เพื่อรักษา brand color — ปรับ shade ของ token แทน
- before/after screenshot ทุก fix — ห้ามแก้จาก intuition
- เกณฑ์ผ่านคือ WCAG AA ไม่ใช่ AAA — ถ้า user ต้องการ AAA ให้ `/ask-me` ก่อน

## Expected Outcome

- contrast findings ทั้งหมดผ่าน WCAG AA
- fixes อยู่ที่ tokens/shared components เป็นหลัก ไม่ใช่ scattered overrides
- before/after evidence ครบ ไม่มี visual regression
