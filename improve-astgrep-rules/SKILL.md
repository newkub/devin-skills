---
name: improve-astgrep-rules
description: หา improvements ใน ast-grep ruleset — rule quality, coverage, false positives — แก้ทันที
argument-hint: "[scope]"
related:
  - improve
  - update-astgrep-rules
  - deep-review
  - deep-review-then-fix
  - run-bench-deps
  - report
  - ask-me
---

## Goal

ตอบคำถาม "ast-grep rules ของ project นี้ improve อะไรได้บ้าง" — review `rules/` + `sgconfig.yml` เป็น prioritized findings แล้วแก้ผ่าน `/update-astgrep-rules` ทันที

## Scope

ใช้เมื่อ project มี `rules/` + `sgconfig.yml` อยู่แล้วและอยาก improve ruleset — thin entry point delegate review ไป `/deep-review` ไม่ทำ review/แก้ไขเอง

- ถ้ายังไม่มี rules → ใช้ `/update-astgrep-rules` สร้างใหม่แทน
- `review-config` — `sgconfig.yml` correctness (ruleDirs, languageAliases, devPaths)
- `review-dependencies` — dependency rules ตรงกับ deps จริงใน `package.json`/`Cargo.toml` หรือไม่ (stale rules หลัง deps ถูกลบ = noise)
- `review-code-quality` — rule quality: severity เหมาะสม, message ชัด, patterns ไม่ over/under-match

## Execute

### 1. Review

> Goal: ได้ prioritized findings ต่อ ruleset

1. รับ `scope` จาก argument — ถ้าไม่มี → ใช้ project ปัจจุบัน ถ้าไม่ชัด → `/ask-me`
2. ทำ `/deep-review` domains `review-config` + `review-dependencies` + `review-code-quality` กับ `rules/` + `sgconfig.yml`
3. รัน `ast-grep scan` — findings สำหรับ false-positive/noise review: rule ที่ fire เยอะผิดปกติหรือ 0 hits ตลอด (rule ตาย) = candidate ปรับ/ลบ
4. ตรวจ coverage gaps — deps/architecture จริงที่ยังไม่มี rule (เช่น dep ใหม่ที่เพิ่งเพิ่ม, layer ใหม่)
5. รวบรวม prioritized list พร้อม severity และ evidence

### 2. Present Findings

> Goal: แสดงผล findings ก่อนแก้

1. ทำ `/report` แสดง improvements: No., Finding, Severity, Fix Skill
2. ดำเนินการแก้ต่อทันที — ไม่รอ user confirm

### 3. Fix All Findings

> Goal: แก้ทุก finding ที่พบ

1. ส่ง findings ไป `/deep-review-then-fix` (domain ที่ตรง) — rule add/edit/regenerate ผ่าน `/update-astgrep-rules`
2. หลังแก้ → re-run `ast-grep scan` verify rules parse + findings เปลี่ยนตามคาด
3. ทำ `/suggest-next-action` หลังแก้ครบ

## Rules

- ไม่ทำ review เอง — delegate ไป `/deep-review` domains ข้างบน
- แก้ทุก finding ทันทีโดยไม่รอ confirm
- rules ต้อง grounded — ห้ามเพิ่ม rule สำหรับ dep/pattern ที่ไม่มีใน project จริง
- new/adjusted rules เริ่มที่ `severity: warning` ตาม `/update-astgrep-rules` convention — promote เป็น `error` เมื่อ codebase clean แล้วเท่านั้น
- หลังแก้ต้อง `ast-grep scan` verify เสมอ

## Expected Outcome

- Prioritized improvement list ต่อ `rules/` + `sgconfig.yml` พร้อม evidence
- ไม่มี confirm gate — แก้ทุก finding ทันที
- Rules ที่แก้ scan ผ่าน — ไม่มี stale/บึ้ม rules ค้าง
