---
name: ask-requirement
description: ถาม requirements ผ่าน ask-me/ask_user_question แล้วสรุปเป็นข้อกำหนด
allowed-tools:
  - read
  - ask_user_question
  - write
  - exec
triggers:
  - user
  - model
related:
  - ask-me
  - use-lib-better
  - deep-plan
  - follow-goal
  - update-agents-md
---

## Goal

ถาม requirements ที่จำเป็นก่อนเริ่มโปรเจกต์ โดยไม่ต้องเปิด Web UI

## Scope

ใช้ตอนเริ่มโปรเจกต์ใหม่ หรือเมื่อ context ไม่ชัด ก่อนทำ plan

## Execute

### 1. Inspect Existing Context
> Goal: รู้ context ก่อนถาม
1. อ่าน `AGENTS.md` ถ้ามี
2. อ่าน `.devin/rules/*.md` ถ้ามี
3. อ่าน `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod` หรือ manifest สำคัญ
4. ถ้าไม่มี `AGENTS.md` → ทำ `/update-agents-md` ก่อน

### 2. Ask Interfaces And Users
> Goal: รู้ว่า target คืออะไร
1. ถามผ่าน `ask_user_question` หรือ `/ask-me`:
   - ระบบ interfaces ที่เกี่ยวข้อง (desktop, CLI, web, SDK, library, API, mobile, ฯลฯ)
   - ผู้ใช้เป็นใคร (end users, developers, business, partners, enterprise, ฯลฯ)

### 3. Ask Libraries And Product Context
> Goal: รู้ว่าใช้ tech/stack อะไร
1. ถามว่าควรใช้ `/use-lib-better` หรือไม่
2. ถ้า library ที่ต้องการไม่มี ให้ถามว่าควรแนะนำตัวไหน
3. ถาม product/domain context และ functional/non-functional requirements

### 4. Ask Scale And Constraints
> Goal: รู้ boundaries
1. ถาม scale, traffic, performance targets
2. ถาม security, privacy, compliance, data residency
3. ถาม integration, deployment constraints, compatibility
4. ถาม testing, observability, rollback/recovery, definition of done

### 5. Synthesize
> Goal: สรุป requirements เป็นข้อกำหนด
1. รวมคำตอบเป็น bullet หรือ `requirement-summary.md`
2. ถ้าต้องการเลือก library → ทำ `/use-lib-better`
3. ถ้าต้องการ plan ต่อ → ทำ `/deep-plan`
4. ถ้าต้องการตั้งเป้า → ทำ `/follow-goal`
5. ทำ `/update-agents-md` เพื่ออัปเดต `AGENTS.md` ด้วย requirements

### 6. Confirm
> Goal: ยืนยันก่อนใช้
1. ทำ `/ask-me` ให้ user ยืนยันว่าสรุปถูกต้อง
2. ถ้าไม่ถูก → ถามซ้ำเฉพาะส่วนที่ไม่ชัด
3. บันทึก `requirement-summary.md` ใน project root

## Rules

### 1. No Web UI

- ไม่เปิด Web UI
- ไม่รัน `bun --filter` CLI
- ใช้ `ask_user_question` หรือ `/ask-me` แทน

### 2. Ask Only Missing

- อ่าน existing ก่อนถาม
- ถามทีละ batch ไม่เกิน 4 คำถาม
- ถามเฉพาะคำถามที่ยังไม่มีคำตอบ
- ถ้าไม่แน่ใจ → ทำ `/ask-me` อีกครั้ง

## Expected Outcome

- ได้ `requirement-summary.md` หรือสรุปใน `AGENTS.md`
- รู้ interfaces, users, tech, scale, constraints, compliance, definition of done
- `AGENTS.md` อัปเดตตาม requirements
- พร้อมทำ `/deep-plan` หรือ `/follow-goal` ต่อ