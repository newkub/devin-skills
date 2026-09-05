---
name: ship-by-agents-swarm
description: Ship ด้วย swarm — fan-out ทุก lane แบบ async parallel แล้ว verify ครบก่อน ship
argument-hint: "[@issue-or-title]"
related:
  - ship
  - follow-parallel
  - consider-use-subagents
  - follow-devin-global-subagents
  - use-scripts
  - use-astgrep
  - search-by-astgrep
  - run-verify
  - deep-verify
  - run-check
  - resolve-errors
  - report-table
  - report-progress
  - follow-agents-md
  - ask-me
---

## Goal

Ship งานโดย fan-out ทุก lane ที่ทำขนานกันได้แบบ async parallel — ใช้ `use-scripts`, `use-astgrep`, `search-by-astgrep`, `follow-devin-global-subagents` และ `follow-parallel` เต็มประสิทธิภาพ — แล้ว merge ผลและ verify ทุกอย่างให้ถูกต้องก่อน ship จริง

## Scope

ใช้เมื่อ ship งานขนาดใหญ่หรือหลายด้านพร้อมกัน (multi-workspace, multi-concern) — งานเล็กหรือ lane เดียวให้ใช้ `/ship` แบบ sequential แทน

ต้องไม่ลด validation gate ของ `/ship` — parallel ใช้กับความเร็วเท่านั้น ไม่ใช่ข้าม checks

## Execute

### 1. Prepare Context

> Goal: เข้าใจ scope และ conventions ก่อน fan-out

1. ทำ `/follow-agents-md` เพื่ออ่าน `AGENTS.md` และ workflows ที่บังคับ
2. ทำ `/report-progress` เพื่อ snapshot สถานะปัจจุบัน
3. ถ้า requirements ไม่ชัดหรือเสี่ยงสูง → `/ask-me` ก่อน fan-out

### 2. Plan Swarm Lanes

> Goal: แตกงานเป็น lanes ที่ independent จริง

1. ทำตาม `references/swarm-plan.md` — แยก lanes ตาม ownership ของไฟล์ ไม่ให้ 2 lanes แก้ไฟล์เดียวกัน
2. ทำตาม `references/lanes.md` — lane types: verify, review, test, docs, deps, ship-ops
3. ใช้ `/search-by-astgrep` หรือ `/use-astgrep` เพื่อ map symbols/call sites แยก lane ownership
4. ถ้า lanes ไม่ independent → ทำ sequential ตาม `/ship` แทน

### 3. Preflight Checks

> Goal: ตรวจ environment ให้พร้อมก่อน swarm

1. ทำตาม `references/swarm-plan.md#preflight` — git clean, deps installed, env vars พร้อม
2. ใช้ `/use-scripts` รัน preflight checks เป็น script เดียวแทนหลาย tool calls
3. ถ้า preflight fail → `/resolve-errors` ก่อน fan-out

### 4. Fan-Out Parallel

> Goal: ส่งทุก lane ทำงานพร้อมกัน

1. ทำตาม `references/fan-out.md` — spawn subagents ต่อ lane ผ่าน `/follow-devin-global-subagents` หรือ `/consider-use-subagents`
2. รัน tool calls ที่ independent พร้อมกันในข้อความเดียวตาม `/follow-parallel`
3. งาน mechanical จำนวนมาก (rename, codemod, scan) ให้ `/use-scripts` หรือ `/use-astgrep` แทน subagent
4. ทุก lane ต้องมี deliverable และ acceptance criteria ชัดเจน

### 5. Collect And Merge Results

> Goal: รวมผลทุก lane โดยไม่มี conflict

1. ทำตาม `references/merge-and-gate.md` — รวบรวม lane results, detect file conflicts
2. ถ้า 2 lanes แตะไฟล์เดียวกัน → merge ตาม lane priority ใน plan
3. lane ที่ fail → re-run เฉพาะ lane นั้น ไม่ restart ทั้ง swarm

### 6. Verify Everything

> Goal: ทุกอย่างผ่านก่อน ship — เร็วด้วย parallel verification

1. ทำ `/run-verify` — build, lint, typecheck, format พร้อมกันตาม `/follow-parallel`
2. ทำ `/deep-verify` สำหรับ correctness เชิงลึกของ merged result
3. ทำ `/run-check` สำหรับ static checks ที่เหลือ
4. ถ้า verification fail → `/resolve-errors` แล้ว re-verify

### 7. Gate And Ship

> Goal: ผ่าน gates เดียวกับ `/ship` ก่อนส่งมอบ

1. ทำตาม `references/merge-and-gate.md#ship-gate` — commit, PR, review, merge, deploy ตาม `/ship` conventions
2. ต้อง user confirmation ก่อน merge/release เหมือน `/ship`
3. ห้ามข้าม gates เพราะ swarm เร็ว — parallel ไม่ใช่ shortcut

### 8. Report

> Goal: สรุป swarm results แบบ traceable

1. ทำ `/report-table` แสดงแต่ละ lane: status, files changed, findings, duration
2. ทำ `/report-progress` สรุปเปอร์เซ็นต์งานและ lanes ที่เหลือ
3. ระบุ lanes ที่ fail/skip พร้อมเหตุผล

## Rules

### 1. Independence Required

- lane ต้องไม่แตะไฟล์เดียวกัน — ถ้าแตะให้ merge เป็น lane เดียวหรือทำ sequential
- ทุก lane ต้องมี deliverable วัดผลได้ ไม่ใช่ "ลองทำดู"
- ใช้ `/follow-parallel` ตัดสินว่าอะไรขนานกันได้จริง

### 2. No Gate Bypass

- parallel execution ห้ามลด checks ของ `/ship` — verify, review, user confirmation ต้องครบ
- ห้าม merge/deploy โดยไม่มี user confirmation
- ถ้า swarm fail ซ้ำ → fallback ไป `/ship` sequential

### 3. Prefer Scripts Over Agents

- งาน mechanical/deterministic → `/use-scripts`, `/use-astgrep` หรือ `/search-by-astgrep`
- subagent ใช้เฉพาะ lane ที่ต้องการ judgment หรือ multi-step reasoning
- ห้าม spawn subagent ซ้ำซ้อนสำหรับงานที่ script ทำได้

### 4. Traceable

- ทุก lane ต้อง log deliverable และ files changed
- report ต้องบอก lane ไหนทำอะไร ไม่ใช่สรุปรวมอย่างเดียว

## Expected Outcome

- Ship เร็วขึ้นโดย lanes ทำงานขนานกันอย่างปลอดภัย
- Verification ครบทุกด้านก่อน ship จริง
- รายงาน per-lane results พร้อม status และ evidence
- ไม่มี file conflicts หรือ lost work จาก parallel execution
