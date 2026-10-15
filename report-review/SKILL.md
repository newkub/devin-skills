---
name: report-review
description: รายงาน review findings เป็นตารางในแชท (No./Action/Evidence/Severity/Priority/Status) ไม่สร้างไฟล์
argument-hint: "[scope-or-findings-source]"
related:
  - deep-review-codebase
  - run-review
  - report
  - create-report-in-dot-devin
  - deep-review-codebase-then-fix
  - suggest-next-action
---

## Goal

รายงานผล review เป็นตารางเดียวในแชท — ทุก row มี action ทำได้จริงและหลักฐานจริง; ไม่มีไฟล์รายงาน

## Scope

- เป็น final report ของทุก `review-*`/`deep-review-codebase`/`report-*` — canonical format ตาม `update-devin-global-skills` `## Conventions → Templates` แถว `review-*`/`report-*`
- เรียกเดี่ยวโดยไม่มีข้อมูล findings → รวบรวมก่อนด้วย `/deep-review-codebase`
- ไฟล์สร้างเฉพาะเมื่อ user ขอร้องตรงๆ → `/create-report-in-dot-devin`; artifact ตาม nature ของ skill (HTML/slides/diagram/schema file) ยังสร้างได้ผ่าน owner skill

## Execute

1. เก็บ findings จากแหล่งข้อมูล — `review-report.json` (ตาราง findings), ผลจาก domain `review-*`, หรือ scope ที่ user ระบุ; ไม่มี → รัน `/deep-review-codebase` ก่อน
2. Dedup key = `file + rule/message-normalized + domain` (merge เป็น highest severity + fixSkill ที่เฉพาะกว่า) แล้วเรียงด้วย severity → priority (P0→P4 ตาม `deep-review-codebase` `## Domain Pipeline`)
3. สรุปบนหัวรายงาน: score/grade (ถ้ามี), จำนวน findings ต่อ severity, mode (full/diff) + scope ที่ run, confidence
4. รายงานเป็นตารางเดียวในแชท คอลัมน์คงที่:

   | No. | Action | Evidence | Reason | Severity | Risk | Priority | Owner skill | Status |
   |-----|--------|----------|--------|----------|------|----------|-------------|--------|
   | 1 | เลื่อน secret ไป env var | `src/api/x.ts:12` | hardcode secret ใน code | 🔴 High | breach | P0 | `/improve security` | ❌ open |

   - `Action` = สิ่งที่ต้องทำ (imperative, 1 action ต่อ row) — `Evidence` = file:line หรือหลักฐานจริง (บังคับทุก row, ห้ามมโน)
   - `Reason` = กติกา/rule ที่ fail — `Severity`: 🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low
   - `Owner skill` = field `fixSkill` — `Priority` รวม status new/existing/fixed/regressed (✅ fixed / ❌ open / 🔄 in progress / ⏭️ skipped)
5. ปิดท้ายด้วยลำดับ execute: Foundation → Dependencies → High impact → Critical path (effort โดยประมาณต่อ item — ไม่ใช่ flat TODO) และ coverage ของ domain/workspace ที่ run (done/skipped(reason)/failed จาก ledger)
6. Run `/suggest-next-action` — findings ต้องแก้ → `/deep-review-codebase-then-fix`

## Rules

- Chat เท่านั้น — ไม่สร้างไฟล์ `.devin/temp/report/` เด็ดขาด นอกจาก user ขอร้อง explicitly
- ทุก row ต้องมีหลักฐานจริง (spot-check อ่าน file ที่อ้างถึง file:line อย่างน้อย 1 item ต่อ domain) — ห้าม guessing, ห้าม vacuous row
- ตารางเดียวรวมทุก domain — ไม่แยกราย many tables ซ้ำซ้อน; กลุ่ม row ด้วย severity→priority
- findings มากเกินไป → report รายการ priority สูงสุดก่อน แล้วระบุ "remaining skipped (n)" ชัดเจน ไม่เงียบตัด
- ไม่แก้ code ในขั้น report — report only; ผูก fixSkill กับทุก action

## Expected Outcome

- ตารางครบถ้วนในแชท — ทุก row มี `Action` + `Evidence` จริง + สรุป + ลำดับ execute
- coverage ระบุชัด ทุก domain done/skipped/failed
- ไม่มีไฟล์รายงานถูกสร้าง (เว้น user ขอ → `/create-report-in-dot-devin`)
