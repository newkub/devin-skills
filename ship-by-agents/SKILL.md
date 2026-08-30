---
name: ship-by-agents
description: ให้ agent รับงาน code project ต่อและทำจน deploy/release สำเร็จ
related:
  - ship
  - suggest-next-action
  - follow-devin-global-subagents
  - consider-use-subagents
  - report-progress
  - resolve-errors
  - ask-me
---

## Goal

ให้ agent รับงาน code project ต่อจาก context ปัจจุบันและทำจน deploy/release สำเร็จ

## Scope

ใช้เมื่องานขนาดใหญ่หรือต้องการให้ agentic flow รับไปทำต่อแทนการทำเองทุกขั้นตอน

## Execute

### 1. Handover

> Goal: ส่งต่อ context และ target ให้ agent

1. ทำ `/report-before` เพื่อสรุป context, state, และ target
2. ใช้ `/suggest-next-action` เลือกลำดับถัดไป
3. ถ้าต้องการให้ subagents ทำงานคู่ขนาน → `/consider-use-subagents` หรือ `/follow-devin-global-subagents`

### 2. Autonomous Ship

> Goal: ให้ agent ดำเนินการจนถึง deploy/release

1. ทำ `/ship` โดยปล่อยให้ agent จัดการ steps ตาม state
2. ติดตาม progress ด้วย `/report-progress`
3. ถ้าติด blocker → `/resolve-errors` หรือ `/ask-me`

## Rules

- รักษา goal และ target ชัดเจน
- ไม่เปลี่ยน scope โดยไม่ถาม user
- ทำ checkpoint ก่อน action เสี่ยง
- ถ้างานไม่สมบูรณ์ → รายงานสิ่งทีทำได้, blocker, และ next action

## Expected Outcome

- Project ถูก ship จนถึง deploy/release หรือทีกำหนด
- มี report สรุปสิ่งที agent ทำ
- user ทราบสถานะสุดท้ายและสิ่งทีค้าง
