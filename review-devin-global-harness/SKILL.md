---
name: review-devin-global-harness
description: Review ทั้ง devin harness — skills, subagents, hooks, MCP, global rules ให้ alignment ไม่ซ้ำซ้อน
argument-hint: "[layer|all]"
related:
  - update-devin-global-skills
  - update-devin
  - align-devin-layers
  - deep-validate
  - follow-deep
  - report
  - suggest-next-action
  - check-reference
  - follow-skills-map
  - check-skill-usage
  - check-devin-knowledge
  - check-content-outdate
  - check-correctness
  - review-coverage
  - update-references
  - run-review
  - deep-review
---

## Goal

Review devin harness ทั้งหมด — `skills`, `subagents` (`%APPDATA%\devin\agents`), `hooks`, `MCP servers`, `global rules` — ให้ alignment ตรงกัน ไม่มี redundancy ก่อนเรียก `update-devin-global-* / update-devin-project-*`

## Scope

ใช้ก่อนเรียก `update-devin-global-* / update-devin-project-*` — ครอบคลุม 5 layers:

- `skills` — ตรวจ skill package ตามมาตรฐาน `update-devin-global-skills` (frontmatter, sections, line count, style)
- `subagents` — ตรวจ `AGENT.md` ตามมาตรฐาน `update-devin-global-subagents` (merged from: review-devin-global-subagents)
- `hooks` — ตรวจ hooks config ว่า trigger ถูก event, ไม่ block workflow, command มีอยู่จริง
- `mcp` — ตรวจ MCP servers ว่า enable/ใช้งานจริง, ไม่ซ้ำ server, ไม่ dead config
- `global rules` — ตรวจ `global_rules.md` ว่า skills ที่อ้างมีจริง, ไม่ขัดแย้งกัน, ไม่ stale

ข้าม-layer checks: `alignment` (rules↔skills↔subagents อ้างกันถูก), `redundancy` (duplicate purpose/scope/content/unused — merged from: review-redundancy), `references integrity` (merged from: review-references), `context rot` (stale/incorrect content, dead weight, context bloat), `coverage` (domains/actions ที่ยังไม่มี skill — `/review-coverage`)

ไม่สร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`) ไม่แก้ code (ใช้ `/deep-validate`)

## Execute

### 1. Prepare Context

> Goal: inventory ทุก layer ของ harness

1. ทำตาม `references/prepare.md`
2. รวบรวม inventory: skills dirs, `~/.config/devin/agents/*` (AGENT.md), hooks config, MCP config, `global_rules.md`

### 2. Run Review Script

> Goal: ได้ findings จาก automated checks

1. รัน `bun run review` ใน skill directory — script ใน `src/` ตรวจ frontmatter, sections, line count, style, references, parallel markers, template compliance และ cross-skill checks
2. ใช้ `bun run review:ci` สำหรับ pre-check ก่อน `update-devin-*` (exit 1 เมื่อ Critical/High)
3. อ่าน `review-skills-report.json` เพื่อดู findings ทั้งหมด

### 3. Review Each Layer

> Goal: ตรวจแต่ละ layer ตามมาตรฐานของมัน

1. `skills` → ทำตาม `references/frontmatter.md`, `references/sections.md`, `references/style.md`, `references/line-count.md`, `references/template-selection.md`
2. `subagents` → ตรวจ AGENT.md ทุกตัวใน `%APPDATA%\devin\agents`: frontmatter, sections, line count, style, safety — ใช้มาตรฐานเดียวกับ skills; รายงาน finding ต่อ agent
3. `hooks` → ตรวจ trigger event ถูกต้อง, command path มีจริง, ไม่ infinite loop, ไม่ duplicate hooks
4. `mcp` → ตรวจ server config: enabled, env vars ครบ, ไม่ซ้ำ server เดียวกัน, tool names ไม่ชน
5. `global rules` → ทำตาม `references/refs-check-global-rules.md` — skills ที่อ้างมีจริง, ลำดับ Execute ไม่ขัดแย้ง, ไม่มี stale skill names

### 4. Cross-Layer Alignment

> Goal: ตรวจ layers อ้างกันถูกต้อง

1. `global_rules.md` อ้าง skills → ทุกชื่อมี skill จริง
2. skill `related` ↔ reverse related → สมมาตรกัน (`/check-skills-related`)
3. subagent profiles ใน skills ↔ `agents/` dir → ตรงกัน
4. `AGENTS.md` ใน skills repo ↔ actual dirs → sync

### 5. Interpret And Quality

> Goal: แยก false positives และตรวจเนื้อหาที่ script ตรวจไม่ได้

1. เช็ค evidence แต่ละ finding
2. ทำตาม `references/content-quality.md` และ `references/parallel-usage.md`
3. ทำ `/follow-skills-map` ตรวจว่า map sync กับ skills จริง

### 6. Plan And Execute Refactor

> Goal: split, merge, restructure, deduplicate, relocate ตาม plan

1. ทำตาม `references/refactor-guide.md#plan-refactor` แล้ว `#execute-refactor`
2. ทำตาม `references/refactor-guide.md#cross-skill-consistency`
3. ระบุ SKILL.md ที่ควร refactor — เนื้อหาซ้ำ, >250 บรรทัด, ขาด sections, SRP เบลอ → รายการเป็น action items

### 7. Redundancy Audit (merged from: review-redundancy)

> Goal: ตรวจหา skills/layers ที่ซ้ำซ้อนหรือไม่จำเป็น

1. ทำตาม `references/redundancy-inventory-group.md`
2. ตรวจตาม `references/redundancy-detect-*.md` ทั้ง 4 (duplicate purpose, overlapping scope, redundant content, unused)
3. แนะนำ actions ตาม `references/redundancy-recommend-actions.md` — merge → `/idea-merge`, rename → `/batch-rename-files`
4. remove/merge ต้อง user confirm เสมอ ตาม `references/redundancy-confirm-execute.md`
5. score ตาม `references/redundancy-scoring.md`

### 8. References Integrity (merged from: review-references)

> Goal: ตรวจ references ไม่ขาด/ซ้ำ/วน ทุก layer

1. ทำตาม `references/refs-inventory-skills.md`, `refs-check-agentsmd.md`, `refs-check-frontmatter.md`, `refs-check-in-body.md`
2. ตรวจ circular ตาม `references/refs-check-circular.md`
3. score ตาม `references/refs-scoring.md`, report ตาม `references/refs-report.md`
4. refs ขาด/ซ้ำ → `/update-references` หลัง user confirm

### 9. Context Rot And Coverage

> Goal: ตรวจ content ที่เน่าเสื่อมตามเวลา และ domain gaps

1. ทำตาม `references/context-rot.md` — stale content (`/check-content-outdate`), incorrect content (`/check-correctness`), dead weight, context bloat
2. ทำ `/review-coverage` — เช็คว่า domains/actions ที่ harness ตั้งใจครอบคลุม มี skill รองรับจริงหรือมี gaps
3. รวม findings เข้า report แยก section `context-rot` และ `coverage`

### 10. Score And Report

> Goal: สรุป score ต่อ layer + findings + refactor plan

1. ทำตาม `references/scoring.md` — severity weights, grade, report format
2. ทำ `/report` แยก section ตาม layer: `skills`, `subagents`, `hooks`, `mcp`, `global rules`, `cross-layer` — แต่ละมี Skill/Layer, Category, Severity, Finding, Evidence, Action
3. สรุป "improve อะไรอีกบ้าง" + "SKILL.md ที่ควร refactor" เป็น prioritized action list
4. ทำ `/suggest-next-action`

## Rules

### 1. Review Before Refactor

- ทำ review (Steps 1-5) ก่อน refactor (Step 6) เสมอ
- ทุก finding ต้องมี layer, file path, evidence
- ไม่แก้ไข harness ระหว่าง review — แก้ใน refactor step

### 2. Whole-Harness Focus

- ครอบคลุมทุก layer ที่ inventory พบ — ไม่ข้าม layer โดยไม่ระบุเหตุ
- เน้น alignment ข้าม layer มากกว่า perfection ใน layer เดียว
- รักษา intent เดิมของแต่ละ skill/subagent/rule

### 3. Non-Redundancy

- ใช้ references แทน duplicate เนื้อหา
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- finding เดียวกันใน 2 layers ให้รายงานครั้งเดียวที่ root cause

### 4. Safety Measures

- สร้าง commit checkpoint ก่อน refactor
- อัปเดต `related`/`AGENTS.md`/`global_rules.md` หลังทุก split, merge, rename
- destructive actions ต้องมี dry run และ user confirmation

### 5. Scoring And Formatting

- คำนวณ review score ตาม `references/scoring.md` แยกต่อ layer
- ห้ามใช้ `**` (bold markers) — ใช้ backticks
- รายงานเป็นตารางด้วย `/report`

- ใช้ /idea-new-devin-global-skills ถ้าจำเป็น
- ใช้ /follow-deep ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /review-rules ถ้าจำเป็น
- ใช้ /review-quality ถ้าจำเป็น
- ใช้ /align-devin-layers เมื่อ findings เป็นเรื่อง layer misalignment ที่ต้องแก้
- ใช้ /check-reference, /check-skill-usage, /check-devin-knowledge สำหรับเจาะลึก layer เดียว

## Fix

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; apply fixes → `/deep-review-then-fix`

## References

- [Full-dimension checklist](references/checklist.md)
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงาน Harness Review พร้อม score + grade ต่อ layer
- findings พร้อม layer, severity, evidence, action
- ยืนยันครบ: skills frontmatter/sections/line/style, subagents AGENT.md, hooks, MCP, global rules
- cross-layer alignment ผ่าน ไม่มี broken/orphan references
- รายการ SKILL.md ที่ควร refactor + improve items พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
