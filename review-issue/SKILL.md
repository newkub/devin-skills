---
name: review-issue
description: ตรวจสอบ issue ใดๆ เพื่อดูความชัดเจน, scope, acceptance criteria และความพร้อม
argument-hint: "[scope]"
related:
  - follow-best-practice
  - suggest-next-action
  - deep-review
  - resolve-errors
  - run-review
  - use-subagents

---

## Goal

ตรวจสอบ issue (ไฟล์, chat หรือ external tracker) เพื่อดูคุณภาพ, ความชัดเจน, ความครบถ้วน และความพร้อมก่อน implementation — domain checklist อยู่ใน `subagents/issue-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้สำหรับ issue source ใดๆ ไม่ใช่แค่ GitHub ครอบคลุม title, description, acceptance criteria, scope, dependencies, risks และ next steps ที่นำไปปฏิบัติได้ ไม่แก้ไข issue เว้นแต่ได้รับการร้องขอ

| Dimension | Checklist |
|-----------|-----------|
| `collect` — รับข้อความและ context แบบเต็ม | `subagents/issue-reviewer/collect-issue-content.md` |
| `completeness` — ข้อมูลเพียงพอเริ่มงาน | `subagents/issue-reviewer/issue-completeness.md` |
| `quality` — ความชัดเจนและความเป็นไปได้ | `subagents/issue-reviewer/issue-quality.md` |
| `rating` — severity และ next action | `subagents/issue-reviewer/issue-rating.md` |

ดูเพิ่มเติม: /deep-review

## Execute

### 1. Collect Issue Content

> Goal: รับข้อความและ context ของ issue แบบเต็ม — baseline สำหรับ subagent

ทำตาม [subagents/issue-reviewer/collect-issue-content.md](subagents/issue-reviewer/collect-issue-content.md) — ได้ issue text เต็มพร้อม source (ใช้เป็น findings-file/context ให้ subagent)

### 2. Dispatch Issue-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → `completeness`, `quality`, `rating` ทั้งหมด
2. Spawn `subagents/issue-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (issue content จาก step 1)

### 3. Aggregate And Rate

> Goal: รวม findings พร้อม severity และ readiness verdict

1. รวม findings — dedup ตาม quote/section + issue type
2. Classify severity ตาม `subagents/issue-reviewer/issue-rating.md`
3. ระบุความพร้อมโดยรวม: Ready, Needs Clarification, Blocked หรือ Not Ready

### 4. Report

> Goal: รายงานที่นำไปปฏิบัติได้

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score และ readiness verdict
2. ทำ `/suggest-next-action`

### Subagents

> Goal: dispatch domain review ไปยัง subagent

| Topic | Subagent |
|-------|----------|
| issue dimensions — completeness, quality, rating, readiness พร้อม severity | `subagents/issue-reviewer/AGENT.md` |

## Rules

### 1. Neutrality
- ประเมิน issue ไม่ใช่ผู้เขียน
- ทุกผลการตรวจต้องมี quote หรือ reference จากข้อความ issue

### 2. No Hidden Edits
- ห้ามแก้ไข issue ต้นฉบับ เว้นแต่ผู้ใช้ร้องขออย่างชัดเจน
- หากแนะนำการแก้ไข ให้นำเสนอเป็น draft ก่อน

### 3. Scope Boundaries
- หาก issue มีคำขอที่ไม่เกี่ยวข้องกันหลายรายการ ให้แนะนำการแยก
- ห้ามเพิ่มงานนอกเหนือ scope ที่ระบุ

### 4. Actionable Output
- ทุกผลการตรวจต้องมีข้อแนะนำที่เป็นรูปธรรม
- ผลลัพธ์ต้องระบุความพร้อมโดยรวม: Ready, Needs Clarification, Blocked หรือ Not Ready

- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /suggest-next-action ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [subagents/issue-reviewer/scoring.md](subagents/issue-reviewer/scoring.md) (issue)

- ถ้า fail → ปรับ issue ให้ชัดเจนก่อน implement

- ใช้ /review-plan ถ้าจำเป็น
- ใช้ /review-risk ถ้าจำเป็น

## References

- [Full-dimension checklist](subagents/issue-reviewer/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. แก้ issue ให้ชัด: title, scope, acceptance criteria, blockers — GitHub issue → `/update-github-issue`, local issue → แก้ไฟล์ต้นทาง
2. ถ้า issue พร้อมแล้ว → ส่งต่อ `/implement-to-production`
3. ถ้าไม่พร้อม → ระบุ missing info ที่ต้องถาม

## Expected Outcome

- รายงานการตรวจสอบ issue พร้อม severity, evidence และข้อแนะนำ
- ระบุความพร้อมอย่างชัดเจน
- รายการข้อมูลที่ขาดหายหรือ blockers
- next action หรือ skill ที่แนะนำให้ใช้
