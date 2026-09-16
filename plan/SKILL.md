---
name: plan
description: Alias for deep-plan — merged into the canonical skill (chat-only, ไม่สร้างไฟล์)
argument-hint: "[prompt]"
related:
  - deep-plan
  - ask-me
  - suggest-next-action
---

## Goal

Skill นี้ถูก merge เข้ากับ `/deep-plan` แล้ว — ใช้ `/deep-plan` เป็น canonical skill สำหรับทุกการวางแผน (tasks, libraries, implementation path, file architecture, test strategy, validate) — output อยู่ในแชทเท่านั้น ไม่สร้างไฟล์ใน `.devin/`

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/deep-plan` ตามขอบเขตและ workflow เดิมทั้งหมด — แผนแสดงในแชทด้วย `## TODOs`, `## File Changes`, `## File Structure`, `## Next Action`

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias
- ห้ามสร้างไฟล์ใน `.devin/tasks/` หรือ `.devin/plan/` — persist เฉพาะเมื่อ user สั่ง `/create-plan-in-dot-devin` เองโดยตรง
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ `/ask-me` ถ้าจำเป็น

## Expected Outcome

- ผลลัพธ์เหมือน `/deep-plan` — implementation-ready plan ในแชท ไม่มีไฟล์ถูกสร้าง
