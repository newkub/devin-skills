---
name: follow-architecture
description: เลือกและ apply architecture pattern — clean สำหรับ multi-app unified, layered สำหรับ app เดียว
argument-hint: "[target-path | clean | layered]"
related:
  - follow-clean-arch
  - follow-layered-arch
  - separate-of-concerns
  - refactor
  - review-architecture
  - scan-codebase
  - ask-me
  - update-references
  - run-check
  - report-before-after

---

## Goal

Entry point เดียวสำหรับ architecture restructure — เลือก pattern ที่เหมาะกับ target แล้ว dispatch ไป leaf skill (merge selection ของ `/follow-clean-arch` + `/follow-layered-arch`)

## Scope

- ใช้เมื่อต้อง restructure codebase/package/app ตาม architecture pattern — ถูก dispatch จาก `/refactor` architecture scope และ callers อื่น
- Pattern detail ฉบับเต็ม (SSOT): `/review-architecture` `## Pattern Guides`
- ไม่ครอบ microservices — อ่าน `/review-architecture` `### Pattern: Microservices Architecture` โดยตรง
- การเลือก: หลาย apps ต้อง unified support → Clean; app เดียว → Layered

## Execute

### 1. Detect Target

> Goal: รู้ว่า target คืออะไรและมีกี่ apps

1. ทำ `/scan-codebase` ที่ root — ระบุ `apps/*`, `packages/*`, `crates/*` และ target ที่ user ระบุ
2. นับจำนวน app entry points และตรวจว่ามี shared domain/modules ที่หลาย app ต้องใช้ร่วมกัน (unified support) หรือไม่
3. argument `clean`/`layered` → เลือก pattern นั้นโดยตรง ข้ามตารางเลือก

### 2. Select Pattern

> Goal: เลือก pattern เดียวที่เหมาะกับ target

| No. | Condition | Pattern | Dispatch |
|-----|-----------|---------|----------|
| 1 | หลาย `apps/*` ต้อง unified support — แชร์ `modules/`/`core/`/`contracts/` ข้าม entry points | Clean | `/follow-clean-arch` |
| 2 | `packages/*`, `crates/*` (shared libs, domain packages) | Clean | `/follow-clean-arch` |
| 3 | app เดียว — `apps/*` ตัวเดียวหรือ single-app project | Layered | `/follow-layered-arch` |
| 4 | target อื่น — testability สูง/domain-heavy → Clean; UI-driven/CRUD → Layered | ตามลักษณะ code | ตามนั้น |

- ไม่ชัดเจน → ทำ `/ask-me` ก่อน dispatch

### 3. Apply And Verify

> Goal: leaf skill restructure สำเร็จและ boundaries ถูกต้อง

1. Dispatch ไป leaf skill ตามตาราง — ทำทีละ target ห้าม mix pattern ใน target เดียว
2. ถ้าพบ mixed concerns ระหว่างย้าย (logic + IO + config ในไฟล์เดียว) → ทำ `/separate-of-concerns` แยก concern ก่อนจัด layer
3. หลังแต่ละ target → ทำ `/update-references` + `/run-check` ก่อน target ถัดไป
4. ทำ `/report-before-after` เมื่อครบทุก target

## Rules

- entry point เดียว — architecture restructure ทุกครั้งเลือก pattern ผ่าน skill นี้ ไม่เรียก leaf โดยตรงเมื่อยังไม่รู้ pattern
- ห้าม duplicate pattern detail — canonical อยู่ leaf skills (`templates/file-structure.md`) + `/review-architecture` pattern guides
- รักษา behavior และ public API เดิมเสมอ — tests ต้องผ่านเหมือนก่อน restructure

## Expected Outcome

- Target ถูก restructure ด้วย pattern ที่เหมาะ — multi-app unified = Clean, single app = Layered
- ไม่มี circular dependencies; public API เดิมใช้ได้
- ผ่าน `/run-check` และ tests
