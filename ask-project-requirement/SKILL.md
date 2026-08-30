---
name: ask-project-requirement
description: ถาม project requirements ผ่าน /ask-me แบบ multi-select/multi-step แล้วสรุปเป็นข้อกำหนด
argument-hint: "[topic]"
related:
  - ask-me
  - update-agents-md
  - use-lib-better
  - ship
  - deep-plan
  - follow-goal
---

## Goal

ถาม requirements ที่จำเป็นก่อนเริ่มโปรเจกต์ โดยใช้ multi-select และ multi-step flow ผ่าน `ask_user_question` หรือ `/ask-me` แล้วสรุปเป็นข้อกำหนด

## Scope

ใช้ตอนเริ่มโปรเจกต์ใหม่ หรือเมื่อ context ไม่ชัด ก่อนทำ plan

## Execute

### 1. Inspect Existing Context

> Goal: รู้ context ก่อนถาม

1. อ่าน `AGENTS.md` ถ้ามี
2. อ่าน `.devin/rules/*.md` ถ้ามี
3. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod` หรือ manifest สำคัญ
4. ถ้าไม่มี `AGENTS.md` → ทำ `/update-agents-md` ก่อน

### 2. Multi-Step Requirement Interview

> Goal: เก็บ requirements แบบ multi-step ด้วย multi-select

1. ออกแบบ steps ตามหัวข้อต่อไปนี้ แต่ละ step มี 1-4 คำถาม
2. สำหรับคำถามที่ตอบได้หลายข้อ ให้ `multi_select: true` และ options ครอบคลุม

#### Step 1: Interfaces And Users

- ถาม interfaces ที่เกี่ยวข้อง แบบ multi_select: web, desktop, CLI/TUI, mobile, SDK, library, API, PWA, อื่นๆ
- ถาม user personas แบบ multi_select: end users, developers, business, partners, enterprise, internal ops, อื่นๆ
- ถาม mode: real-time, batch, async, offline, อื่นๆ

#### Step 2: Tech And Product Context

- ถาม ecosystem/runtime แบบ multi_select: bun, node, deno, rust, go, python, kotlin, swift, อื่นๆ
- ถาม product/domain context แบบ text หรือ single choice
- ถาม functional/non-functional requirements แบบ multi_select: performance, security, compliance, reliability, observability, i18n, accessibility, อื่นๆ

#### Step 3: Scale And Constraints

- ถาม scale/traffic แบบ text หรือ single choice
- ถาม constraints แบบ multi_select: security, privacy, compliance, data residency, integration, deployment, compatibility, budget, timeline
- ถาม definition of done แบบ multi_select: tests, docs, observability, rollback, migration, อื่นๆ

#### Step 4: Libraries And Tools

- ถามว่าควรใช้ `/use-lib-better` หรือไม่
- ถ้า library ที่ต้องการไม่มี ให้ถามว่าควรแนะนำตัวไหน แบบ multi_select จาก candidates
- ถาม build/ship tools ที่ต้องการ แบบ multi_select

### 3. Synthesize Requirements

> Goal: สรุป requirements เป็นข้อกำหนด

1. รวบรวมคำตอบจากทุก step เป็น bullet หรือ `requirement-summary.md`
2. ถ้าต้องการเลือก library → ทำ `/use-lib-better`
3. ถ้าต้องการ plan ต่อ → ทำ `/deep-plan`
4. ถ้าต้องการตั้งเป้า → ทำ `/follow-goal`
5. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ด้วย requirements

### 4. Confirm

> Goal: ยืนยันก่อนใช้

1. ทำ `/ask-me` ให้ user ยืนยันว่าสรุปถูกต้อง
2. ถ้าไม่ถูก → ถามซ้ำเฉพาะส่วนที่ไม่ชัด โดยใช้ multi-step
3. บันทึก `requirement-summary.md` ใน project root

## Rules

### 1. No Web UI

- ไม่เปิด Web UI
- ไม่รัน `bun --filter` CLI
- ใช้ `ask_user_question` หรือ `/ask-me` เท่านั้น

### 2. Multi-Step And Multi-Select

- ถามเป็นขั้นตอน แต่ละ step มี 1-4 คำถาม
- คำถามที่ผู้ใช้ตอบได้หลายข้อต้องตั้ง `multi_select: true`
- ถามเฉพาะคำถามที่ยังไม่มีคำตอบ
- ถ้าไม่แน่ใจ → ทำ `/ask-me` อีกครั้ง

### 3. Requirements Coverage

- ครอบคลุม interfaces, users, tech, scale, constraints, compliance, definition of done
- ระบุ priority ของ requirements ถ้าได้รับคำตอบ
- เก็บ custom_text จากผู้ใช้ไว้ใน summary

## Expected Outcome

- ได้ `requirement-summary.md` หรือสรุปใน `AGENTS.md`
- รู้ interfaces, users, tech, scale, constraints, compliance, definition of done
- `AGENTS.md` อัปเดตตาม requirements
- พร้อมทำ `/deep-plan` หรือ `/follow-goal` ต่อ
