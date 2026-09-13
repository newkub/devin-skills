---
name: deep-update-project
description: Alias for update-project — merged into the canonical skill
argument-hint: "[scope]"
related:
  - update-project
---

## Goal

Skill นี้ถูก merge เข้ากับ `/update-project` แล้ว — ใช้ `/update-project` เป็น canonical skill

## Scope

ใช้เมื่อ caller เรียกชื่อ alias เดิม — forward ทั้งหมดไปยัง canonical skill

## Execute

1. ทำ `/update-project` ตามขอบเขตและ workflow เดิมทั้งหมด
2. subagent `project-updater` ย้ายไป `update-project/subagents/project-updater.md` (canonical) — อ้างอิง path นั้น


## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias — แก้ที่ canonical skill เท่านั้น
- รักษา backward compatibility ของชื่อ alias

## Expected Outcome

- ผลลัพธ์เหมือน `/update-project`
