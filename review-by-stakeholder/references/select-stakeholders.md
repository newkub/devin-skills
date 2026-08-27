---
name: select-stakeholders
description: เลือก `roleplay-*` ตาม context
---

# Select Stakeholders

## Goal

เลือก `roleplay-*` ตาม context

## Checks

เลือก 3-7 บทบาท จากตาราง mapping:

| Project Type | บทบาทที่เลือกได้ |
|---|---|
| Web / SaaS | user, uxui-designer, product-manager, qa-tester, security-architect, performance-engineer, customer-support-agent, growth-manager |
| Mobile app | user, uxui-designer, product-manager, qa-tester, performance-engineer, security-architect |
| Library / SDK | new-developer, technical-writer, open-source-contributor, staff-engineer, solutions-engineer, qa-tester, product-manager |
| Data / analytics | data-analyst, data-engineer, compliance-officer, staff-engineer, performance-engineer |
| Enterprise / B2B | solutions-engineer, customer-success-manager, security-architect, compliance-officer, staff-engineer, qa-tester |
| Early stage / MVP | ceo, product-manager, user, uxui-designer, growth-manager, staff-engineer |
| Open source | open-source-contributor, technical-writer, new-developer, staff-engineer, legal-counsel |

Adjustment rules:
- ถ้ามี payment → เพิ่ม `financial-analyst`, `legal-counsel`, `compliance-officer`
- ถ้ามี customer-facing → เพิ่ม `customer-support-agent`, `customer-success-manager`
- ถ้ามี public API → เพิ่ม `solutions-engineer`, `technical-writer`
- ถ้ามี sensitive data → เพิ่ม `compliance-officer`
- ถ้ามี incident risk สูง → เพิ่ม `incident-commander`, `devops-engineer`
- ไม่เลือกเกิน 7 บทบาท

