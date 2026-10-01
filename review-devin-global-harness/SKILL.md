---
name: review-devin-global-harness
description: Review ทั้ง devin harness — skills, subagents, hooks, MCP, global rules ให้ alignment ไม่ซ้ำซ้อน
argument-hint: "[layer|all]"
related:
  - update-devin-global-skills
  - follow-single-of-source
  - update-devin
  - deep-validate
  - follow-deep
  - check-reference
  - search-skills
  - update-devin-harness
  - deep-review
  - check-reference
  - update-references
  - use-subagents
  - simplify
---

## Goal

Review devin harness ทั้งหมด — `skills`, `subagents` (`%APPDATA%\devin\agents`), `hooks`, `MCP servers`, `global rules` — ให้ alignment ตรงกัน ไม่มี redundancy ก่อนเรียก `update-devin-global-* / update-devin-project-*` — checklists ทั้งหมดอยู่ใน `## Checklists`

## Scope

ใช้ก่อนเรียก `update-devin-global-* / update-devin-project-*` — ครอบคลุม 5 layers:

- `skills` — ตรวจ skill package ตามมาตรฐาน `update-devin-global-skills` (frontmatter, sections, line count, style)
- `subagents` — ตรวจ `AGENT.md` ตามมาตรฐาน `update-devin-global-subagents`
- `hooks` — ตรวจ hooks config ว่า trigger ถูก event, ไม่ block workflow, command มีอยู่จริง
- `mcp` — ตรวจ MCP servers ว่า enable/ใช้งานจริง, ไม่ซ้ำ server, ไม่ dead config
- `global rules` — ตรวจ `global_rules.md` ว่า skills ที่อ้างมีจริง, ไม่ขัดแย้งกัน, ไม่ stale

ข้าม-layer checks: `alignment` (rules↔skills↔subagents อ้างกันถูก), `redundancy` (duplicate purpose/scope/content/unused), `references integrity`, `context rot` (stale/incorrect content, dead weight, context bloat), `coverage` (domains/actions ที่ยังไม่มี skill — `/deep-review`)

ไม่สร้าง skill ใหม่ (ใช้ `/update-devin-global-skills`) ไม่แก้ code (ใช้ `/deep-validate`)

## Execute

### 1. Prepare Context
> Goal: inventory ทุก layer ของ harness

1. ทำ `/scan-codebase` ใน skills dir → list skills ทั้งหมดจัดกลุ่มตาม prefix → อ่าน `update-devin-global-skills` + `AGENTS.md` + `global_rules.md` เพื่อทราบมาตรฐานปัจจุบัน
2. รวบรวม inventory: skills dirs, `%APPDATA%\devin\agents\*` (AGENT.md), hooks config, MCP config, `global_rules.md`

### 2. Run Review Script
> Goal: ได้ findings จาก automated checks

1. รัน `bun run review` ใน skill directory — script ใน `src/` ตรวจ frontmatter, sections, line count, style, references, parallel markers และ cross-skill checks — script ครอบเฉพาะ skills layer แบบ mechanical; hooks/mcp/global rules/template compliance ไม่มี script ต้อง manual เท่านั้น
2. ใช้ `bun run review:ci` สำหรับ pre-check ก่อน `update-devin-*` (exit 1 เมื่อ Critical/High)
3. อ่าน `review-skills-report.json` เพื่อดู findings ทั้งหมด — findings จาก script = input ของ Step 3 ไม่ใช่ผลลัพธ์สุดท้าย

### 3. Review Each Layer
> Goal: ตรวจแต่ละ layer ตามมาตรฐานของมัน

1. `skills` → แยกงาน: script (Step 2) ครอบ mechanical checks แล้ว — manual ทำเฉพาะ interpretation/quality ที่ script ตรวจไม่ได้ ตาม `### Content Quality`; เกณฑ์ที่ script ใช้อยู่ใน `### Package Checks`
2. `subagents` → ตรวจ AGENT.md ทุกตัวใน `%APPDATA%\devin\agents`: frontmatter, sections, line count, style, safety — ใช้มาตรฐานเดียวกับ skills; รายงาน finding ต่อ agent
3. `hooks` → ตาม `### Hooks`; `mcp` → ตาม `### Mcp`; `global rules` → ตาม `### References Integrity` ข้อ global rules — skills ที่อ้างมีจริง, ลำดับ Execute ไม่ขัดแย้ง, ไม่มี stale skill names

### 4. Cross-Layer Alignment — ทำตาม ``deep-review/SKILL.md` alignment` (canonical)
> Goal: ตรวจ layers อ้างกันถูกต้อง

1. `global_rules.md` อ้าง skills → ทุกชื่อมี skill จริง
2. skill `related` ↔ reverse related → สมมาตรกัน
3. subagent profiles ใน skills ↔ `agents/` dir → ตรงกัน
4. `AGENTS.md` ใน skills repo ↔ actual dirs → sync

### 5. Interpret And Quality
> Goal: แยก false positives และตรวจเนื้อหาที่ script ตรวจไม่ได้

1. เช็ค evidence แต่ละ finding
2. ทำตาม `### Content Quality` และ `### Parallel And Scripts`
3. ทำ `/check-my-global-cli` ตรวจว่า `check-my-global-cli/references/tool-map.md` sync กับ tools ที่ติดตั้งจริง

### 6. Plan And Execute Refactor
> Goal: split, merge, restructure, deduplicate, relocate ตาม plan

1. ทำตาม `### Refactor Guide` (plan → execute → cross-skill consistency)
2. ระบุ SKILL.md ที่ควร refactor — เนื้อหาซ้ำ, >250 บรรทัด, ขาด sections, SRP เบลอ → รายการเป็น action items

### 7. Redundancy Audit — ทำตาม ``deep-review/SKILL.md` redundancy` (canonical)
> Goal: ตรวจหา skills/layers ที่ซ้ำซ้อนหรือไม่จำเป็น

ทำตาม `### Redundancy` — inventory → detect ×4 → recommend → user confirm → score ตาม `### Scoring`; remove/merge ต้อง user confirm เสมอ

### 8. References Integrity
> Goal: ตรวจ references ไม่ขาด/ซ้ำ/วน ทุก layer

1. script (Step 2) ตรวจ mechanical ref existence แล้ว — manual ตรวจเฉพาะ semantics ตาม `### References Integrity`
2. score ตาม `### Scoring`, report format ตาม `### References Integrity` ข้อ report
3. refs ขาด/ซ้ำ → `/update-references` หลัง user confirm

### 9. Context Rot And Coverage
> Goal: ตรวจ content ที่เน่าเสื่อมตามเวลา และ domain gaps

1. ทำตาม `### Context Rot` — stale content (`/deep-review` domain `usage`), incorrect content (`/check-reference`), dead weight, context bloat
2. ทำ `/deep-review` domain `gaps` — เช็คว่า domains/actions ที่ harness ตั้งใจครอบคลุม มี skill รองรับจริงหรือมี gaps
3. รวม findings เข้า report แยก section `context-rot` และ `coverage`

### 10. Score And Report
> Goal: สรุป score ต่อ layer + findings + refactor plan

1. score ตาม `### Scoring` — severity weights, grade, report format
2. ทำ `/report` แยก section ตาม layer: `skills`, `subagents`, `hooks`, `mcp`, `global rules`, `cross-layer` — แต่ละมี Skill/Layer, Category, Severity, Finding, Evidence, Action
3. สรุป "improve อะไรอีกบ้าง" + "SKILL.md ที่ควร refactor" เป็น prioritized action list → `/suggest-next-action`

### Workflows
> Goal: dispatch focused pass เมื่อ argument ระบุ layer เดียว (`[layer|all]`) — merged จาก `workflows/` เดิม (CLI tools ย้ายไป `scripts/`)

| Layer Arg | Focused Pass |
|-----------|--------------|
| `skills` | `bun run review` findings + manual pass ตาม `### Content Quality` (เกณฑ์ที่ script ใช้ = `### Package Checks`) — แยก false positives; report No./Skill/Category/Severity/Finding/Evidence/Action |
| `subagents`, `agents` | inventory `AGENT.md` ทุกตัวใน `%APPDATA%\devin\agents` — frontmatter/sections ตาม `### Package Checks` + safety (permissions เหมาะสม, ไม่มี destructive default) + orphan agents (ไม่มี skill อ้างถึง — ห้ามลบโดยไม่ confirm) |
| `hooks` | ตาม `### Hooks` — trigger/command/loop/duplicate/blocking; broken command + infinite loop = High |
| `mcp` | ตาม `### Mcp` — enabled/env/duplicate/tool-name clash/dead config; ห้าม log secrets — ระบุแค่ missing/present |
| `rules`, `global-rules` | ตาม `### References Integrity` ข้อ global rules — skill refs มีจริง, Execute ไม่ขัดแย้ง, ไม่ stale |
| `broken-refs`, `references` | `bun scripts/broken-skills-references.ts [path]` (default `%APPDATA%\devin\skills`) — Critical = broken `related`, Warning = broken body `/skill-name`; filter URL/file-path/npm/placeholder false positives; report-only → fix ผ่าน `/update-references` |
| `skills-related`, `relations` | `cargo build --release` ใน `scripts/skills-related/` แล้วรัน `scripts/skills-related/target/release/check-skills-related.exe` — modes: `Summary` (default), `Quick`, `Tree` (`-Skill <name> -TreeDepth N`), `Cycles`, `Verify` (exit 1 เมื่อมี cycle — CI), `Full`; report-only |

- ทุก focused pass review-only — ไม่แก้ไขระหว่าง check; ทุก finding ต้องมี path + evidence

## Checklists

### Subagent: harness-reviewer (merged AGENT)

Read-only reviewer contract สำหรับ fan-out ผ่าน `/use-subagents` — merged จาก `subagents/harness-reviewer/` เดิม:

- inputs: `scope` (path/dir เป้าหมาย), `dimensions` (optional — subset ของ dimensions), `findings-file` (optional baseline เช่น `review-skills-report.json`)
- dimension → checklist section: `frontmatter`/`sections`/`line-count`/`style`/`template-selection`/`checklist` → `### Package Checks`; `content-quality` → `### Content Quality`; `parallel-usage` → `### Parallel And Scripts`; `hooks` → `### Hooks`; `mcp` → `### Mcp`; `redundancy-*` → `### Redundancy`; `refs-*` → `### References Integrity` + `### Artifact Alignment`; `context-rot` → `### Context Rot`; `refactor-guide` → `### Refactor Guide`; `scoring`/`redundancy-scoring`/`refs-scoring` → `### Scoring`
- output contract: table `No. | Dimension | Severity | File | Finding | Suggestion` เรียง Critical→Info + score ต่อ dimension — รายงานทั้ง strengths และ weaknesses
- constraints: read-only (ห้ามแก้ไข — fix อยู่ `## Fix`), ไม่มี evidence ไม่มี finding, รับผิดชอบเฉพาะ `dimensions` ที่ได้รับ

### Package Checks

- frontmatter: `name` = dir (Critical ถ้าขาด/ไม่ตรง), `description` ≤100 (Low ถ้าเกิน, Info ถ้าไม่ชัด), `related` missing/unused (High), `related` ไม่ถูก mention ใน body = orphan (Medium), circular chain ผิดปกติ (High)
- sections: `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome` — ขาด = Critical, ลำดับผิด = High; `## Execute` ≤10 steps (Medium), `### N.` + `> Goal:` + numbered list (ขาด Goal = High, bullets แทน numbered = Medium)
- line count: ขาด `SKILL.md` = Critical; `SKILL.md` >250 มาก = Critical, ไฟล์อื่น >250 = Medium, 251-260 = Low; TODO/MOCK/placeholder = High; `references/` kebab-case flat, มี deps แต่ไม่มี `references/` = Medium
- style: backticks สำหรับ tools/commands/paths/skill names (ขาด = Medium), ห้าม `**` bold (Medium), English headings Title Case (Low)
- template: prefix ↔ execute pattern ตาม `update-devin-global-skills` `## Conventions → Templates`; `follow-*-architecture` → architecture pattern; mismatch ไม่มีเหตุผลใน `## Scope` = High, เหตุผลไม่ชัด = Medium

### Hooks

Config: `%APPDATA%\devin\config.json` (หรือ `~/.config/devin/config.json`), `.devin/config.json`, `.devin/plugins/*/hooks.json` — checks: event ถูก (`PreToolUse`/`PostToolUse`/`UserPromptSubmit`/`SessionStart`/`Stop` เท่านั้น — High), command path มีจริง+executable (Critical), matcher ไม่กว้างเกิน (Medium), ไม่ duplicate global+project (Medium), ไม่ infinite loop — hook เรียก tool ที่ trigger มัน (Critical), blocking ≤30s (High), hook fail ไม่ block โดยไม่ตั้งใจ (High), ไม่ฝัง secrets (Critical); report per hook: No./Hook/Event/Finding/Severity/Evidence (config path+line)

### Mcp

Config: `config.json → mcpServers` global + project — checks: server ตอบจริง/`npx` package มีจริง (Critical), env vars ครบไม่ใช่ placeholder (High), ไม่ duplicate server (Medium), tool names ไม่ชน (High), ไม่ dead config (Medium), scope ถูก global vs project (Low), unused server (Low), pinning/`minimumReleaseAge` — `@latest` ใน npx = supply chain risk (High); report per server: No./Server/Transport/Finding/Severity/Evidence

### Content Quality

- simplify: `/simplify` ∥ `/deep-review` (domain `simplify`/`redundancy`) กระชับเนื้อหา; Execute↔Rules ซ้ำ → ลบ; Rules ซ้ำ skill อื่น → reference; `/dont-over-engineer` กำหนดขอบเขต minimal; gaps ใน coverage → `/deep-review` (domain `gaps`)
- high impact: ทุก bullet ตอบ "ถ้าไม่มีแล้วผลลัพธ์เปลี่ยนไหม" — ไม่เปลี่ยน → ลบ; ห้าม TODO/MOCK/placeholder/filler คำสวยไม่ actionable; simplify ต้องเก็บ context ครบ
- clarity: active voice ระบุ subject/object, validation criteria measurable (threshold/expected/pass-fail/retry limit), ไม่มี unstated assumptions; กำกวม → rewrite recheck max 3
- severity: Critical = TODO/MOCK/ทำตามไม่ได้; High = Execute↔Rules ซ้ำ/ขาด criteria; Medium = filler/ไม่ active voice; Low = กระชับได้อีก

### Parallel And Scripts

`parallel:`/`∥` เฉพาะใน `## Execute` numbered list — ใช้ใน Rules/checklist/Expected Outcome = High; operations ที่ parallel ต้องไม่มี dependency จริง (High); operations >10 ไฟล์ → `/use-scripts` (ขาด = Medium); workflow >5 steps/high-risk → `/follow-context-engineering`; ขาด parallel markers ที่ทำได้ปลอดภัย = Low

### Redundancy

1. Inventory: `/scan-codebase` list ทุก skill (name/description/files/size) จัดกลุ่มตาม prefix + สรุป purpose จาก `description`+`## Goal`
2. Detect ×4: duplicate purpose — `description`/`## Goal` overlap >70% หรือ prefix ต่างแต่ purpose ใกล้กัน; overlapping scope — `## Scope` บอก "ไม่ใช่" แต่ทำเหมือนกัน, `related` อ้างกันเอง, `## Execute` steps เหมือนกันมาก; redundant content — `/use-scripts` hash blocks >50% ระหว่าง skills (เทียบ `## Rules`/`## Expected Outcome`); unused — `/check-reference`+`AGENTS.md` → แยก standalone vs orphan
3. Recommend: duplicate → merge (`/idea-merge`)/rename (`/rename`)/split; scope overlap → ปรับ `## Scope`; content ซ้ำ → ย้าย `references/` หรือ shared reference; unused → keep/document/remove — report table skill/issue/action/priority + `/suggest-next-action`
4. Confirm+execute: `/ask-me` ก่อนเสมอ; merge → re-review, rename → `/rename`+`/update-references`, remove → `git rm`+`/update-references`; `/deep-validate` หลังทุก action
5. Fix flow (canonical): detect → classify (code/content/config/cross-skill — deps → `/deep-review` domain `dependencies`, pattern → `/deep-review` domain `redundancy`, code จำนวนมาก → `/follow-tool-jscpd`) → เลือก canonical (ใช้มากสุด/test ครอบสุด — ไม่ชัด → `/ask-me`) → แทนด้วย reference → `/run-check`+`/run-test` ต่อ batch → report No./Duplicate Type/Canonical/Files Fixed/Status; ห้ามลบ redundancy ที่ตั้งใจ (backup/fail-over), แก้ทีละ dimension

### References Integrity

1. Inventory: `/list-devin-global-skills`/`/scan-codebase` → name+dir ทุก skill; เทียบ `AGENTS.md` — skills ไม่อยู่ใน catalog / entries ไม่มี dir / category ผิด
2. Frontmatter `related`: ทุก entry มี skill จริง; in-body: `/skill-name`/backtick refs resolve ทั้งหมด (เก็บ false positives ของ tools ทั่วไป)
3. Circular: graph จาก `related`+in-body → cycles (A→B→A) + self-refs พร้อม path — script ไม่ตรวจจุดนี้
4. Global rules: refs ใน `global_rules.md` มี skill จริง + skills ที่อ้าง rules มี rule ตรงกัน
5. Report: `/report table` No./Type/Source/Target/Severity/Action เรียง Critical→High→Medium→Low ระบุ auto-fixable vs manual → `/suggest-next-action`

### Artifact Alignment

หลังเปลี่ยน rules/architecture/deps/skills/docs → inventory `rules/`+`sgconfig.yml`+`AGENTS.md`+`README`+`USAGE`+`package.json`+`global_rules.md` (บันทึก version/last-updated) → detect misalignment (broken/stale/circular refs, terminology, docs↔code) → align: rules → `/update-astgrep-rules`/`/update-dot-devin`/`sgconfig.yml`+`/run-scan`, docs → `/update-agents-md`/`/update-readme-md`/`/update-usage-md`, code → `/deep-review`+`/check-code-structure` → `/deep-validate`+typecheck/lint/scan+tests → report Artifact/Before/After/Status; rules vs code ขัด → `/ask-me` ถามฝ่ายตั้ง; detect ก่อนแก้, minimal scope, rename/move → `/update-references`, ห้ามสร้าง circular refs

### Context Rot

- stale: `/deep-review` — version pins, `(verified YYYY-MM-DD)` markers (>90 วัน), deprecated commands, dead links → route `/update-devin-global-skills`/`update-*-md`
- incorrect: `/check-reference` บน skill ที่แก้ล่าสุด/high-traffic; unverified claims → Warning
- dead weight: skills/subagents ไม่ถูก invoke, orphan `references/` (ไม่ถูก link จาก SKILL.md), `related` ชี้ skill ที่ลบแล้ว
- bloat: SKILL.md ใกล้ 250 → split ไป `references/`; `references/` รวม >~1500 → consolidate; `related` >15 → ตัดเหลือจำเป็น
- severity: command/API ใช้ไม่ได้ใน skill active = Critical; version pin เก่า >1 major / orphan refs = Warning; bloat / marker เก่าแต่ตรง = Info

### Refactor Guide

Categories: split (>250/หลาย resp), merge (scope ซ้อน/ซ้ำ — รักษา intent ลบตัวที่ถูกรวม), restructure (≤10 steps), deduplicate (→ references/`related`), relocate (`/relocation` ตาม prefix); priority: redundancy สูง → ไฟล์ใหญ่ → structure พัง; เทียบ change frequency/usage — ไม่ over-refactor; sub-skills ใหม่ → `/update-devin-global-skills` ทีละตัว; consistency → `/deep-review` + `/update-references` + bidirectional refs ครบ

### Scoring

- weights: Critical=0 / High=25 / Medium=50 / Low=75 / Info=100 — score = weighted average ของ findings; grades A≥90 / B≥80 / C≥70 / D≥60 / F<60
- thresholds: score <70 → แนะนำ `update-*`/`update-references` ที่เกี่ยวก่อนดำเนินการ; <50 → หยุด report อย่างเดียว
- report: `/report table` No./Skill/Layer/Category/Severity/Finding/Evidence/Action — ทุก finding ต้องมี file path + evidence → `/suggest-next-action`
- metrics: coverage %, false positive %, evidence strength %, actionability %, severity distribution, MTTR (C=1d/H=3d/M=7d/L=14d avg), before/after trend, risk exposure (C/H ใน core scope); domain metrics ตาม layer เช่น duplication rate, broken ref rate, template compliance %

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

- ใช้ checklists ในไฟล์นี้แทน duplicate เนื้อหา
- ไม่ซ้ำซ้อนระหว่าง Execute และ Rules
- finding เดียวกันใน 2 layers ให้รายงานครั้งเดียวที่ root cause

### 4. Safety Measures

- สร้าง commit checkpoint ก่อน refactor
- อัปเดต `related`/`AGENTS.md`/`global_rules.md` หลังทุก split, merge, rename
- destructive actions ต้องมี dry run และ user confirmation

### 5. Scoring And Formatting

- คำนวณ review score ตาม `### Scoring` แยกต่อ layer
- ห้ามใช้ markdown bold markers — ใช้ backticks
- รายงานเป็นตารางด้วย `/report`

- ใช้ /idea-new-devin-global-skills, /follow-deep, /deep-review, /run-review, /follow-single-of-source ถ้าจำเป็น
- ใช้ /update-devin-harness เมื่อ findings เป็นเรื่อง layer misalignment ที่ต้องแก้
- ใช้ /check-reference, /update-devin-global-skills, /update-devin-harness สำหรับเจาะลึก layer เดียว

## Fix

> ทำตาม `deep-review/SKILL.md` เมื่อ user confirm ให้แก้ findings
- ใช้ /use-subagents ถ้าจำเป็น

## Expected Outcome

- รายงาน Harness Review พร้อม score + grade ต่อ layer
- findings พร้อม layer, severity, evidence, action
- ยืนยันครบ: skills frontmatter/sections/line/style, subagents AGENT.md, hooks, MCP, global rules
- cross-layer alignment ผ่าน ไม่มี broken/orphan references
- รายการ SKILL.md ที่ควร refactor + improve items พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
