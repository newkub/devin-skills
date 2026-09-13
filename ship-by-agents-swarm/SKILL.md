---
name: ship-by-agents-swarm
description: Alias for ship — merged into canonical skill as swarm mode (Step 4)
argument-hint: "[scope]"
related:
  - ship
---

## Goal

Skill นี้ถูก merge เข้ากับ `/ship` แล้ว — ใช้ `/ship` เป็น canonical skill (swarm flow อยู่ที่ `ship/SKILL.md` Step 4 + `ship/references/swarm-*.md`)

## Scope

Callers ที่ใช้ชื่อเดิมจะถูกส่งต่อไปยัง `/ship` เสมอ — ระบุว่าต้องการ swarm mode

## Execute

### 1. Forward To Canonical

> Goal: ส่งต่อไปยัง canonical skill

1. ทำ `/ship` ด้วย arguments เดิม และใช้ swarm flow (`references/swarm-*.md`) สำหรับงาน multi-lane

## Rules

- ห้ามเพิ่ม workflow เฉพาะใน alias นี้ — แก้ที่ canonical skill เท่านั้น
- เก็บไว้เพื่อ backward compatibility กับ callers ที่ใช้ชื่อเดิม

## Expected Outcome

- ผลลัพธ์เหมือนการเรียก `/ship` ใน swarm mode โดยตรง
