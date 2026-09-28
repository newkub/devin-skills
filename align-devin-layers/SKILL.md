---
name: align-devin-layers
description: alias → /update-devin-harness (จัด alignment ระหว่าง global rules, skills และ subagents)
argument-hint: "[scope]"
related:
  - update-devin-harness
  - update-devin
  - review-devin-global-harness
---

## Goal

Alias ของ `/update-devin-harness` — ทำให้ `global_rules.md`, `devin global skills`, และ `devin global subagents` มี alignment ตรงกัน สอดคล้องกัน และไม่ขัดแย้งกัน

## Scope

ใช้เมื่อ user เรียก `/align-devin-layers` — skill นี้เป็น alias stub เท่านั้น workflow จริงอยู่ใน `update-devin-harness`

## Execute

ทำ `/update-devin-harness` เต็ม workflow — Inventory All Layers → Run Update Workflows → Detect Cross-Layer Misalignment → Resolve Conflicts → Validate Harness → Report

## Rules

- ห้าม duplicate workflow ของ `/update-devin-harness` ในไฟล์นี้
- ถ้า alias ขาด steps → อ่าน `update-devin-harness/SKILL.md` เสมอ
- ถ้า findings มาจาก `/review-devin-global-harness` → ส่งต่อ `/update-devin-harness` เหมือนเดิม

## Expected Outcome

- `/update-devin-harness` ถูก execute ครบทุก step จนได้ alignment report
