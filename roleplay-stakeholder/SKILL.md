---
name: roleplay-stakeholder
description: รับบท persona หรือ stakeholder ที่ user ระบุ แล้วส่งต่อไปยัง review-by-* domain skill
argument-hint: "[role-name]"
related:
  - review-by-user
  - review-by-designer
  - review-by-product
  - review-by-engineer
  - review-by-security
  - review-by-compliance
  - review-by-qa
  - review-by-data
  - scan-codebase
  - report
  - suggest-next-action
  - ask-me
---

## Goal

รับบท persona หรือ stakeholder ที่ user ระบุ แล้วส่งต่อไปยัง `review-by-*` domain skill ที่เหมาะสมเพื่อ review project จากมุมมองนั้น

## Scope

ใช้กับทุก project ที่ต้องการมุมมองภายนอก รองรับ business, technical, security, user, compliance, growth ไม่แก้ code โดยตรง

ถ้าต้องการ feedback จาก stakeholder จริง (ไม่ใช่ roleplay) → ใช้ `/review-by-stakeholder` แทน

## Execute

### 1. Identify Role

> Goal: รู้ persona ที่จะรับบท

1. ถ้ามี `role-name` argument → ใช้ role นั้น
2. ถ้าไม่มี → แสดงตาราง mapping แล้ว `/ask-me` ให้ user เลือก
3. ถ้า role ไม่อยู่ในตาราง → แจ้ง และถามว่าจะใช้ closest role ไหน

### 2. Map To Domain Skill

> Goal: ส่งต่อไปยัง child skill ที่ถูกต้อง

1. ใช้ตารางด้านล่างเพื่อ map role → `/review-by-*` skill
2. ถ้า role ตกอยู่ในหลาย domain ให้ user ยืนยัน domain ทีต้องการ
3. ส่งต่อไปยัง skill ทีเลือกพร้อม context และ argument

### 3. Delegate And Collect

> Goal: ให้ child skill ทำ review ตาม lens ของ role

1. ทำ `/scan-codebase` เพื่อรวบรวม context ก่อนส่งต่อ
2. เรียก child skill ที่เหมาะสม
3. รับ findings, severity และ recommendations จาก child skill

### 4. Report

> Goal: สรุปผลจากมุมมอง persona

1. ทำ `/report` พร้อม findings และ recommendation
2. ระบุ top 3-5 ประเด็นทีสำคัญทีสุด
3. ทำ `/suggest-next-action`

## Role To Domain Mapping

| No. | Role | Domain Skill |
|----:|------|--------------|
| 1 | `user` | `/review-by-user` |
| 2 | `ui-designer` | `/review-by-designer` |
| 3 | `ux-researcher` | `/review-by-user` |
| 4 | `qa-tester` | `/review-by-qa` |
| 5 | `product-manager` | `/review-by-product` |
| 6 | `new-developer` | `/review-by-engineer` |
| 7 | `devops-engineer` | `/review-by-engineer` |
| 8 | `competitor` | `/review-by-product` |
| 9 | `attacker` | `/review-by-security` |
| 10 | `ceo` | `/review-by-product` |
| 11 | `compliance-officer` | `/review-by-compliance` |
| 12 | `customer-success-manager` | `/review-by-user` |
| 13 | `customer-support-agent` | `/review-by-user` |
| 14 | `data-analyst` | `/review-by-data` |
| 15 | `data-engineer` | `/review-by-data` |
| 16 | `financial-analyst` | `/review-by-product` |
| 17 | `growth-manager` | `/review-by-product` |
| 18 | `incident-commander` | `/review-by-security` |
| 19 | `legal-counsel` | `/review-by-compliance` |
| 20 | `marketing-manager` | `/review-by-product` |
| 21 | `open-source-contributor` | `/review-by-engineer` |
| 22 | `performance-engineer` | `/review-by-engineer` |
| 23 | `security-architect` | `/review-by-security` |
| 24 | `solutions-engineer` | `/review-by-engineer` |
| 25 | `staff-engineer` | `/review-by-engineer` |
| 26 | `technical-writer` | `/review-by-engineer` |

## Rules

- ไม่แก้ code ระหว่าง roleplay review
- ทุก finding ต้องมี evidence จาก code หรือ config
- ถ้า role ไม่ชัด → ถามก่อน
- ส่งต่อไปยัง `/review-by-*` ที่เหมาะสม ไม่ mixed perspective
- ไม่ deploy หรือรันอะไรจริง

## Expected Outcome

- รายงาน findings จากมุมมอง persona ที่เลือก
- Top issues พร้อม recommendation
- รายงาน severity ชัดเจน
- Next actions ผ่าน `/suggest-next-action`
