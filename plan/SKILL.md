---
name: plan
description: Alias for deep-analyze-and-plan — merged into the canonical skill
argument-hint: "[prompt]"
related:
  - deep-analyze-and-plan
  - deep-analyze
  - deep-plan
  - ask-me
  - suggest-next-action
---

## Goal

`/plan` เปลี่ยนเป็น `/deep-analyze-and-plan` — forward ทุก invocation ไปยัง canonical skill ที่รวม deep-analyze + deep-plan พร้อม deep-thinking, deep-research และ playbooks จาก deep-refactor + deep-implement-to-production — output เป็น comprehensive plan ในแชท (deps, file changes, risks, task graph)

## Scope

ใช้กับ caller ที่เรียก alias เท่านั้น — forward ไปยัง canonical skill

## Execute

1. ทำ `/deep-analyze-and-plan` ตาม workflow ของมันทั้งหมด — รายงานตาม report format ของมัน (`## Analysis Findings`, `## Dependencies`, `## File Changes`, `## TODOs`, `## Task Graph`, `## Risks`, `## Test Strategy`, `## Assumptions And Unknowns`, `## Next Action`)

## Rules

- ห้ามทำ workflow ซ้ำใน alias — forward ไป canonical skill เท่านั้น
- คง backward compatibility สำหรับทุก alias
- ห้ามสร้างไฟล์ใดๆ ใน `.devin/tasks/` หรือ `.devin/plan/` — persist เฉพาะเมื่อ user สั่ง `/create-plan-in-dot-devin` โดยตรง
- ทำ `/suggest-next-action` ตามปกติ
- ใช้ `/ask-me` เมื่อต้องตัดสินใจร่วมกับ user

## Expected Outcome

- ผลลัพธ์เหมือนรัน `/deep-analyze-and-plan` — analysis findings + implementation-ready plan ครบทุกมิติในแชท
