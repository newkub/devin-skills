---
name: choose-and-apply
description: alias → /apply choose (เลือกจาก N ทางเลือกแล้ว apply สิ่งที่เหมาะสมที่สุด)
argument-hint: "[options...]"
related:
  - apply
---

## Goal

Alias ของ `/apply` mode `choose` — รับทางเลือก N รายการแล้ววิเคราะห์ เลือก ทำตามสิ่งที่เหมาะสมที่สุด

## Scope

ใช้เมื่อ user เรียก `/choose-and-apply` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `apply` (`### Mode: Choose`)

## Execute

ทำ `/apply` mode `choose` เต็ม workflow

## Rules

- ห้าม duplicate workflow ของ `/apply` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `apply/SKILL.md` เสมอ

## Expected Outcome

- `/apply` mode `choose` ถูก execute ครบทุก step — ตารางเปรียบเทียบ options + option แนะนำ + apply สำเร็จ
