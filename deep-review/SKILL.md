---
name: deep-review
description: รัน review-* ครบทุก domain แล้วรายงานผลลง `.devin/temp/report/<workspace>/` (report only)
argument-hint: "[path-or-target] [--diff] [--deep]"
related:
  - run-review
  - update-review-cli-then-run
  - deep-review-then-fix
  - create-report-in-dot-devin
  - use-subagents
  - follow-parallel
  - follow-deep
  - list-workspaces
  - follow-monorepo
  - use-scripts
  - review
  - report
  - suggest-next-action

---

## Goal

ใช้ `tools/review-codebase` CLI รัน review แบบครอบคลุมทุกมิติของ codebase แล้ววิเคราะห์ผล จัดลำดับ findings และส่งต่อไปยัง review/deep-review-then-fix ที่เหมาะสม — ลึกที่สุดด้วย token น้อยและเวลาสั้นสุด รองรับ resume ถ้างานขาดกลางคัน

## Scope

ใช้เมื่อต้องการ review ครบทุก dimension ของ codebase (architecture, quality, security, performance, delivery, UX/DX) ผ่าน `tools/review-codebase` CLI ที่ project root โดยไม่ซ้ำกับ `/run-review` ที่เน้นการรัน CLI และแปลผลสั้นๆ

ผลลัพธ์รายงานลง `.devin/temp/report/<workspace>/deep-review-<time>.md` ผ่าน `/create-report-in-dot-devin` โดยแยก section ตาม `review-*` แต่ละ domain — report เท่านั้น ไม่แก้ไข code — แก้ findings → `/deep-review-then-fix`

- dispatch catalog: `## Domain Pipeline` ด้านล่าง — review domains ทั้งหมด + `deep-*` ผ่าน `/follow-deep` ตาม phase ต่อ workspace
- domain reviews: `review-*` ทั้งหมดเป็น named domains ใน `## Review Domains` ด้านล่าง (56 domains) — checklist/SSOT knowledge อยู่ใน `## Domain Guides` + `## Pattern Guides` + `## Fix` + `## Review Rules` ของไฟล์นี้; ยกเว้น `/review-devin-global-harness`, `/review-github-pr`, `/review-github-issue` ที่ยังเป็น top-level skills อยู่

## Execute

### 0. Manual Pre-Pass

> Goal: ตรวจสุขภาพ repo ด้วยตาและมือก่อนเชื่อ analyzer — ถ้าเจอ issue ของ CLI/analyzer ให้บันทึกลง `update-review-cli-then-run/references/known-issues.md`

1. `git status` + `git diff --stat` — ดู uncommitted changes, ไฟล์ใหญ่ผิดปกติ, generated files ที่หลุดเข้ามา
2. สุ่มอ่าน 2-3 ไฟล์ที่ใหญ่สุดหรือเปลี่ยนล่าสุด — เช็คว่า analyzer น่าจะเห็นอะไร (ประกอบการตีความผล)
3. ตรวจ `reports/review-report.json` เดิม: timestamp ต้องใหม่กว่าไฟล์ source ล่าสุด ไม่งั้น report stale — รัน formatter (`biome check --write`) ก่อนเสมอเพราะ analyzer อ่าน live fs ระหว่างรัน
4. ถ้าเจอพฤติกรรม CLI/analyzer ผิดปกติ (stale scan, false positive, crash ใต้ load) → เขียน issue + evidence + workaround ลง `update-review-cli-then-run/references/known-issues.md` (single source — `run-review` เป็น alias) ก่อนดำเนินการต่อ

### 1. Parse Target And Budget

> Goal: แปลง argument เป็น scope + mode + budget ก่อนรัน — run ที่ไม่ bounded คือ run ที่ตายกลางทาง

1. `[path-or-target]` — ถ้าระบุ: scope จำกัด workspace/path นั้น; ถ้าไม่ระบุ = full repo
2. `--diff` — incremental mode: review เฉพาะไฟล์ที่เปลี่ยนเทียบ `git diff` (เทียบ baseline commit หรือ HEAD); ใช้สำหรับ re-review หลัง fix — full scan ครั้งเดียวต่อวัน/ต่อ release, ที่เหลือใช้ diff
3. `--deep` — เปิด Phase 5 (`deep-*` ต่อ workspace); ถ้าไม่ระบุ Phase 5 ทำเฉพาะ workspace ที่มี Critical/High findings
4. กำหนด budget: workspaces ≤ 10 ต่อ run (เรียง user-facing → shared → tools), subagent dispatches ≤ 30 รวมทุก step — เกิน budget → รันเฉพาะ top-priority แล้วบันทึก `skipped (budget)` พร้อมเหตุลง ledger
5. สร้าง progress ledger `reports/.deep-review-<time>.ledger.json` — `{dispatched: {skill: {workspace, status: pending|running|done|failed|skipped}}, startedAt}`; อัปเดตทุก dispatch — resume จาก ledger ได้ถ้า session ขาด

### 2. Prepare And Verify CLI

> Goal: ตรวจสอบให้ `tools/review-codebase` พร้อมรัน

1. ตรวจสอบว่า `tools/review-codebase/package.json` และ entry point มีอยู่
2. ถ้าไม่มี → ทำ `/update-review-cli-then-run` เพื่อสร้าง CLI ก่อน; `ทางเลือกที่แนะนำ`: ใช้ `linter` CLI (Rust, `D:\newkub\wpackages\rust-packages\packages\tools\linter`) — deterministic checks ทั้งหมด (rules/metrics/secrets/framework packs) + score/grade/baseline/SARIF — ผลิต schema เดียวกัน drop-in แทน review-report.json ได้
3. รัน `bun --filter tools-review-codebase lint` และ `typecheck`
4. รัน `bun --filter tools-review-codebase review-codebase --help` เพื่อยืนยันว่า CLI ใช้งานได้
5. ถ้า CLI ติดตั้ง/รันไม่ได้ → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 3. Run Comprehensive Review

> Goal: รัน review CLI ครั้งเดียว ได้ JSON กลางให้ทุก domain ใช้ร่วม — ห้ามรันซ้ำต่อ domain

1. รัน `linter scan --format json` (Rust CLI — แนะนำ) หรือ `bun --filter tools-review-codebase review-codebase:json` (legacy TS) เพื่อได้ `reports/review-report.json` เป็น single source of truth — ถ้า mode `--diff` ให้ส่ง scope flag ที่ CLI รองรับ (เช่น `--changed`, `--paths`) หรือกรอง findings ทีหลังด้วยรายชื่อไฟล์จาก `git diff --name-only`
2. รัน table output เฉพาะเมื่อต้องดูด้วยตา: `bun --filter tools-review-codebase review-codebase` — ตารางมี domain summary + per-category sub-list (priority, reason, risk, fix skill, evidence items) + status new/existing + delta เทียบ baseline
3. เก็บ score, grade, domain breakdown, findings count, analyzerErrors, falsePositiveRate, hasBaseline, fixedFindings
4. ถ้า CLI crash → กลับไป Step 2
5. iterate เฉพาะส่วนที่ fail ด้วย `--domain <name>` และ `--severity <min>` — ไม่ต้อง full scan ทุกครั้ง

### 4. Validate Output Metrics

> Goal: ตรวจสอบความครบถ้วนของผลลัพธ์ก่อน dispatch — subagent ที่ parse JSON พังคือ token ที่เสียฟรี

1. ตรวจว่า categories ≥ 60 ตาม 5 domains ของ review CLI (spec ใน `/update-review-cli-then-run`)
2. ตรวจว่า `score` / `grade` ถูกสร้างครบ
3. ตรวจ schema: top-level keys ต้องมี `score`, `grade`, `domains`, `findings`, `analyzerErrors`, `falsePositiveRate`, `generatedAt` — ขาด key ใด → JSON ผิด spec → flag เป็น analyzer issue ไป `/update-review-cli-then-run` ก่อน dispatch ใดๆ
4. ตรวจว่า findings มี `severity`, `evidence`, `recommendation`, `priority`, `fixSkill`, `risk`, `status` ครบ
5. ถ้า `falsePositiveRate > 20%` หรือ `analyzerErrors > 0` → ส่งต่อ `/update-review-cli-then-run` ก่อนวิเคราะห์
6. cross-check ด้วยมือ: evidence ของ finding ใดๆ ต้องตรงกับไฟล์จริง (อ่าน file:line ที่อ้าง) — ถ้าไม่ตรง → false positive → บันทึกลง `update-review-cli-then-run/references/known-issues.md`

### 5. Slice Findings And Dispatch Domain Analysis

> Goal: แบ่ง JSON เป็น slice ต่อ domain แล้ว spawn subagent ขนาน — subagent อ่านไฟล์เล็ก ไม่ใช่ report ทั้งก้อน

1. อ่าน `update-review-cli-then-run/references/review-checklist.md`
2. ทำ `/use-scripts` เขียน slice ลง `reports/.deep-review-<time>/findings-<domain>.json` — ไฟล์ละ domain เดียว เท่านั้น (deterministic, ไม่ต้อง parse ใน context ของ parent)
3. ทำ `/use-subagents` spawn domain-review subagent ต่อ domain ที่มี findings จริง — inputs: `domain`, `workspace-path`, `findings-json` = path ของ slice file — output contract: findings table (No., Finding, Severity, Evidence, Action, Owner Skill) + domain summary — report-only ห้ามแก้ code, review เฉพาะ domain ที่ได้รับ, evidence จาก report/code จริงเท่านั้น
4. subagent อ่าน findings จาก slice file โดยตรง — ห้ามรัน CLI ซ้ำ (full scan แพง) ยกเว้น domain-specific check ที่ CLI รองรับ
5. ถ้า domain มี findings ≤ 2 → parent วิเคราะห์เอง ไม่ต้อง spawn (subagent overhead ไม่คุ้ม)
7. subagent timeout/crash/parse ผิด output contract → mark `failed` ใน ledger และเขียน domain นั้นเป็น `review-failed` พร้อม error ลง report — ห้ามเงียบ (domain ที่หายไปดูเหมือน clean)
8. รวมผลลัพธ์จากทุก subagent — บันทึก gaps แต่ละ domain พร้อม evidence

### 6. Run Review Domains Per Workspace

> Goal: review ครบทุก domain (named domains ใน `## Review Domains` — ใช้ checklist ใน `## Domain Guides`/`## Pattern Guides` และ pipeline ใน `## Domain Pipeline`) ทีละ workspace ตามความสำคัญ ภายใต้ budget ของ Step 1

1. ถ้า monorepo → ทำ `/list-workspaces` แล้วเรียง workspace ตามความสำคัญ: user-facing apps → shared packages → tools/infra — ทำ `/follow-monorepo` ตาม conventions; ถ้า workspaces > budget → เลือก top-N และ mark ที่เหลือ `skipped (budget)` ใน ledger
2. ต่อ workspace → รัน pipeline ใน `## Domain Pipeline` ตามลำดับ phase (domain = `review-<name>` ใน `## Review Domains`):
   - Phase 1 entry: `review-config` → `review-techstack` → `review-architecture` → ที่เหลือตาม condition
   - Phase 2 source code: `review-code-quality`, `review-writing`, `review-cli`/`review-api`/`review-backend`/`review-frontend` ฯลฯ ตาม workspace type
   - Phase 3 cross-cutting: `review-security`, `review-performance`, `review-stability` และ metrics อื่นครบ
   - Phase 4 meta: `review-gaps`, `review-by-stakeholder` ตามต้องการ
   - Phase 5 deep: ทำ `/follow-deep` ต่อ workspace เมื่อ `--deep` หรือ workspace นั้นมี Critical/High findings — `deep-*` ทุกตัวที่ตรง context (`deep-analyze`, `deep-trace`, `deep-test`, `deep-build`, `deep-impact`, `deep-research`, `deep-validate`, `deep-debug`, `deep-retro`, `deep-thinking`, `deep-plan`)
3. ทำ `/use-subagents` หรือ `/follow-parallel` รัน independent reviews ขนาน ≤10 ต่อ batch — ส่ง `workspace-path`, `report-json`, domain ที่ต้องรัน
4. ห้ามข้าม domain เพราะ "ไม่น่าจะมีปัญหา" — skip ได้เฉพาะ condition N/A ชัดเจน (เช่น `review-mobile` ใน CLI workspace) หรือ budget — ทุก skip ต้องอยู่ใน ledger พร้อมเหตุ
5. ถ้า scope ใหญ่หรือไม่ชัด → platform dimensions ผ่าน domain ที่ตรง platform (`review-mobile`, `review-desktop-app`, `review-frontend`, `review-backend` ฯลฯ)
6. ใช้ `fixSkill` field ในแต่ละ finding เป็น canonical owner — ไม่ต้อง map ซ้ำเอง
7. metric/finding ใดที่ analyzer ไม่ครอบคลุม → ระบุ `ใน update-review-cli-then-run = N` เป็น analyzer gap ส่งต่อ `/update-review-cli-then-run`
8. ทุก dispatch อัปเดต ledger — skill ที่เสร็จแล้วใน ledger เก่า (resume) ให้ reuse ผลเดิม ไม่รันซ้ำ

### 7. Dedup And Stakeholder Prioritization

> Goal: findings ซ้ำจากหลายแหล่งรวมเป็นชุดเดียว แล้วจัดลำดับตาม impact

1. dedup findings ระหว่าง CLI report กับ review-* outputs — key = `file + rule/message-normalized + domain`; finding ที่ match ให้ merge (เก็บ evidence รวม + severity สูงสุด + fixSkill ที่เจาะจงกว่า) ไม่ใช่แสดง 2 แถว
2. รวม findings จากทุก domain — เรียงตาม `priority` field ของ report เป็นหลัก (severity → weakest domain)
3. ถ้าต้องการมุมมอง engineer/QA → domain `review-by-stakeholder` (`staff-engineer` หรือ `qa-tester`)
4. ถ้าต้องการมุมมอง product/user → domain `review-by-stakeholder` (`product-manager` หรือ `user`)
5. ระบุ clear owner skill สำหรับแต่ละ action จาก `fixSkill`

### 8. Report To .devin/Reports

> Goal: รายงานผล review ลง `.devin/temp/report/<workspace>/` (report only) ด้วยโครงที่อ่านแล้ว fix ได้ทันที และ verify ว่าครอบคลุมจริง

1. ทำ `/report` สรุป score, findings, owner skill, priority
2. ทำ `/create-report-in-dot-devin` ด้วย title `deep-review` — โครง report:
   - `## Executive Summary` — overall score (0-100), grade, สรุป findings ตาม severity (Critical/High/Medium/Low) และตาม domain, confidence level, critical issues ที่ต้องแก้ก่อน production, mode (full/diff) + scope ที่รัน
   - `## Result` — ตาราง score/grade/findings count เทียบ before-after ต่อ workspace (No. column แรกเสมอ)
   - `## Coverage` — matrix จาก ledger: แถว = workspace, คอลัมน์ = phase/skill group, cell = done/skipped(reason)/failed — ทำให้ "ครบทุกตัว" ตรวจสอบได้ ไม่ใช่เชื่อคำพูด
   - section ต่อ `review-*` domain — header ชื่อ review skill + domain score/grade
   - ต่อ finding ตารางคอลัมน์: `No.`, `หลักฐาน` (file:line หรือ evidence items — บังคับทุก row), `เหตุผล` (message — rule ที่พัง), `ความเสี่ยง` (risk field), `ลำดับความสำคัญ` (priority + status new/existing/fixed/regressed), `fix skill` (fixSkill field), `ใน update-review-cli-then-run` (`Y` = analyzer ครอบคลุมแล้ว / `N` = analyzer gap → ส่งต่อ `/update-review-cli-then-run`)
   - severity symbols: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low — status symbols: ✅ แก้แล้ว, ❌ ยังไม่แก้, 🔄 กำลังแก้, ⏭️ ข้าม
   - `## Fix Status` — ตาราง Issue, Dimension, Severity, Status, Fix Applied
   - `## Trends` — เทียบ baseline snapshot จาก run ก่อน (ถ้ามี): score trajectory ต่อ workspace, findings ใหม่/แก้แล้ว/regressed ต่อ domain — ทำให้เห็นว่า codebase ดีขึ้นหรือแย่ลง
   - `## Priority Action Plan` — fix sequence จัดลำดับ Foundation → Dependencies → High impact → Critical path → High risk พร้อม effort คร่าวๆ ต่อ item — ไม่ใช่ flat TODO list
   - `## Evidence Index` — mapping domain → slice file/JSON path ที่ใช้เป็นแหล่ง findings — reviewer trace ย้อน evidence ได้โดยไม่ถาม
   - `## Recommendations` — จัดลำดับตาม impact/effort แยก quick wins กับ strategic fixes
   - `## Residual notes` — analyzer false positives ที่ยอมรับ, infra flakes, warnings ที่ไม่ block, domains ที่ `review-failed`/`skipped (budget)` พร้อมวิธี resume
3. ถ้า run ขาดกลางคัน → เขียน partial report ทันทีด้วย coverage matrix เท่าที่มี — ห้ามเสียงานทั้งหมดเพราะ report ไม่ครบ
4. action items ทั้งหมดอยู่ใน `## Priority Action Plan` เป็นลำดับไม่ใช่ flat TODO — item ที่บล็อก item อื่นต้องมาก่อน
5. ถ้า CLI รองรับ → save baseline snapshot (`review-report.json` เป็น baseline ถัดไป) เพื่อให้ delta/new-vs-fixed ทำงานใน run ถัดไป
6. verify หลังเขียน: report ไฟล์มีอยู่จริง + ทุก required section ครบ + ทุก row มีหลักฐาน — ขาด → แก้ report ก่อนจบ
7. ทำ `/suggest-next-action` โดยแนะนำ `## Fix` ของ domain ที่ตรง หรือ `/deep-review-then-fix`

## Rules

### 1. No Duplication

- ไม่ซ้ำกับ `/run-review` — `run-review` เน้น "รันแล้วบอกผล" ส่วน `deep-review` เน้น "manual pre-pass + รันครั้งเดียว + subagent วิเคราะห์ขนาน + จัดลำดับ + report ลง `.devin/temp/report/<workspace>/`"
- Report only — รายงานผลลง report เท่านั้น ไม่แก้ไข code — แก้ findings → `/deep-review-then-fix` ใน skill นี้
- ถ้าผลลัพธ์สั้นและไม่ต้อง deep analysis → ใช้ `/run-review` แทน
- dedup ระหว่าง CLI findings กับ review-* findings ก่อน report (ดู Step 7.1)

### 2. Evidence First

- ทุก finding ต้องมี evidence จาก `review-report.json` หรือ screenshots — spot-check evidence กับไฟล์จริงอย่างน้อย 1 รายการต่อ domain ที่มี findings
- ไม่ตัดสิน severity จาก intuition อย่างเดียว
- ตรวจ `falsePositiveRate` และ `analyzerErrors` ก่อนประเมินผล

### 3. Efficiency

- รัน CLI full scan ครั้งเดียว — subagents แชร์ findings ผ่าน slice files ห้ามรันซ้ำ
- subagent อ่านเฉพาะไฟล์ที่ถูก flag ใน evidence — ห้าม sweep ทั้ง codebase
- evidence items ต่อ finding สูงสุด ~8 รายการ (ตรงกับ CLI table output)
- spawn subagent เฉพาะ domain ที่ findings > 2 — น้อยกว่านั้น parent ทำเองเร็วกว่า
- re-review หลัง fix → ใช้ `--diff` mode เสมอ ไม่ใช่ full scan

### 4. Budget And Resume

- budget ตั้งไว้ใน Step 1 เป็น hard cap — เกินให้ mark `skipped (budget)` ใน ledger ไม่ใช่แค่หยุดทำ
- ledger `reports/.deep-review-<time>.ledger.json` เป็น single source ของ resume — run ใหม่ชี้ ledger เดิม = skip งานที่ `done` แล้ว
- subagent ที่ fail → `review-failed` ใน ledger + report เสมอ ห้าม domain หายเงียบๆ
- partial report ดีกว่าไม่มี report — ขาดกลางคันให้เขียน coverage เท่าที่มี (Step 8.3)

### 5. Coverage Dispatch

- dispatch `review-*` ครบทุก domain ต่อ workspace ตาม `## Domain Pipeline` — ภายใต้ budget
- dispatch `deep-*` ผ่าน `/follow-deep` เมื่อ `--deep` หรือมี Critical/High findings
- skip domain ได้เฉพาะ condition N/A ชัดเจนหรือ budget — ต้องระบุเหตุใน ledger และ report `## Coverage`
- metric ที่ `ใน update-review-cli-then-run = N` → บันทึก analyzer gap ส่ง `/update-review-cli-then-run` และอ้างใน `run-review`

### 6. Loop Limit

- ถ้า CLI รันไม่ผ่าน วนกลับไป `/update-review-cli-then-run` สูงสุด 3 รอบ
- subagent ต่อ domain retry ได้สูงสุด 1 ครั้ง — รอบสอง fail → `review-failed` แล้วข้ามไป domain อื่น (อย่าติด loop บน domain เดียว)
- ถ้า `score < 70` หรือ `grade D/F` หลัง 3 รอบ → stop และ report

### 7. Issue Logging

- เจอปัญหาของ CLI/analyzer (crash, false positive, stale scan, output ผิด spec, schema ขาด key) → เขียนลง `update-review-cli-then-run/references/known-issues.md` (single source — `run-review` เป็น alias ไม่มี Known Issues แยก) พร้อม evidence + workaround + สถานะ (open/fixed)
- ถ้า issue แก้แล้วใน session เดียวกัน → mark `fixed` พร้อม commit/ไฟล์ที่แก้

### 8. Safety

- ไม่แก้ business logic โดยตรงจาก skill นี้
- ไม่เพิ่ม dependencies ใหม่นอกเหนือจาก CLI workspace
- ถ้า `tools/review-codebase` ติดตั้งไม่ได้ → หยุดและแจ้ง user
- ถ้า analyzer ไม่ครอบ finding domain (คอลัมน์ `ใน update-review-cli-then-run` = N) หรือ CLI มี bug → ทำ `/update-review-cli-then-run` เพิ่ม/แก้ analyzer แทนการ workaround ใน report
- ledger/slice files เขียนใต้ `reports/` เท่านั้น — ห้ามเขียน temp นอก repo

## Review Domains

ทุก review domain เป็น named domain ของ `/deep-review` — dispatch ด้วยชื่อ domain จากตารางนี้; checklist ราย domain + shared knowledge อยู่ใน `## Domain Guides` / `## Pattern Guides` / `## Review Rules` / `## Fix` ของไฟล์นี้ (merged inline — ไม่มี `workflows/`/`references/` แยกแล้ว). Phase/ordering ตาม `## Domain Pipeline`.

| Domain | รายละเอียด |
|--------|-----------|
| `review-accessibility` | ตรวจ accessibility ของ web pages/components ตามมาตรฐาน WCAG |
| `review-ai` | Review AI/LLM integration ของ project ครบทุกมิติ |
| `review-algorithm` | ตรวจสอบ algorithms — time/space complexity, data structure choice, correctness, memory/allocation patterns, numeric safety, hot paths (ดู `### Time Complexity`) |
| `review-alignment` | ตรวจว่า layers ของระบบอ้างกันถูกต้องและ sync กัน |
| `review-api` | ตรวจสอบ API design |
| `review-architecture` | Review architecture ระดับ macro — design patterns, module boundaries, dependency directions, coupling, SOLID, anti-patterns, modularity, isolation, resilience (ดู `## Pattern Guides`) |
| `review-auth` | Review authentication (authn) และ authorization (authz) — identity, sessions, tokens, OAuth, MFA, password policy, RBAC/ABAC, secrets, audit logging, account recovery |
| `review-backend` | Orchestrate backend review ครอบคลุม API, service, database, data flow, data fetching, data validation, integration |
| `review-browser-ext` | Review browser extension (Chrome/Edge/Firefox/Safari) |
| `review-bundle` | Review production output ทั้งหมด |
| `review-business` | Review business logic ครอบคลุมทุก dimension พร้อม aggregate findings และ review score |
| `review-by-stakeholder` | Review project จากมุมมอง stakeholder |
| `review-cli` | Review CLI/TUI application แบบเจาะลึก |
| `review-code-quality` | Review คุณภาพ code — quality, bug-prone patterns, correctness, time complexity, tech debt, quality score |
| `review-compliance` | Review compliance ทุก dimension พร้อม aggregate findings และ review score |
| `review-config` | Review configuration files — drift, missing, duplicate, extends config / deps catalog opportunities |
| `review-cost` | ตรวจสอบ infrastructure cost: compute, storage, bandwidth, third-party services, idle resources |
| `review-coverage` | Review ว่า "surface ที่ควรครอบคลุม" ถูก cover จริงแค่ไหน |
| `review-data-validation` | ตรวจสอบ data validation ใน API, forms, schemas — coverage, safety, type-safety |
| `review-database` | ตรวจสอบ database layer |
| `review-delivery` | Review delivery ครอบคลุมทุก dimension พร้อม aggregate findings และ review score |
| `review-dependencies` | ตรวจสอบ dependencies ของ project |
| `review-desktop-app` | Review desktop app (Tauri/Electron/native) — ดู `### Platform Mobile And Desktop` |
| `review-diff` | รีวิว git diff — สรุปการเปลี่ยนแปลง ตรวจหาปัญหา ถาม user ก่อน keep/revert/ดำเนินการต่อ |
| `review-docs` | Review documentation structure ก่อนเรียก `/update-docs` (markdown docs) หรือ `/update-vitepress-docs` (VitePress site) |
| `review-dot-devin` | Review `.devin` ครบทั้ง structure และ content |
| `review-dx` | Review developer experience (DX) แบบเจาะลึก — ดู `### DX` |
| `review-events` | Review event-driven architecture |
| `review-frontend` | Review frontend code quality — component architecture, state management, rendering performance, type safety, CSS/styling, form and error handling |
| `review-gaps` | Meta-review รวบรวม findings จาก dimensional reviews — dedup, prioritize, แนะนำ action skill |
| `review-i18n` | Review internationalization/localization ของ project |
| `review-iac` | Review infrastructure-as-code |
| `review-idea` | ตรวจสอบและประเมินไอเดีย ว่าควร implement หรือไม่ |
| `review-issue` | ตรวจสอบ issue — คุณภาพ, ความชัดเจน, ความครบถ้วน, ความพร้อมก่อน implementation |
| `review-mcp` | Review MCP (Model Context Protocol) servers ครบทุกมิติ |
| `review-migration` | Review migration plan — backward compatibility, data integrity, rollback, cutover, dependencies, framework, infrastructure, feature flags |
| `review-mobile` | Review mobile app (native/React Native/Flutter/PWA) — ดู `### Platform Mobile And Desktop` |
| `review-observability` | Review observability ครอบคลุมทุก dimension พร้อม aggregate findings และ review score |
| `review-optimize` | Review app/package เพื่อหา "สิ่งที่ optimize ได้จริง" ครบทุก layer |
| `review-performance` | Review application performance — network, build/runtime, memory, I/O, database, caching, algorithmic complexity |
| `review-plan` | Review plan quality — risk assessment, dependency mapping, alternatives, timeline, scope clarity, acceptance criteria, rollback plan |
| `review-redundancy` | ตรวจหา redundancy ทุกรูปแบบใน scope |
| `review-release` | Review release readiness — version, changelog, breaking changes, semver, platform targets, rollback, release notes, license |
| `review-risk` | Review project/plan/implementation risks — probability, impact, mitigation, rollback, risk score |
| `review-sdk` | Review public API surface ของ library/SDK/package ครบทุกมิติ |
| `review-security` | Review security ครอบคลุมทุก dimension พร้อม aggregate findings, severity, review score |
| `review-seo` | Review SEO — technical SEO, on-page, structured data, Core Web Vitals, sitemap, international SEO, semantic HTML |
| `review-stability` | Review ความเสถียร — crashes, error handling, debuggability, recovery, monitoring |
| `review-techstack` | Review tech stack, dependencies, library design — framework choices, versions, runtime compat, security vulnerabilities, unused packages |
| `review-test` | Review test strategy และ quality — pass/fail, coverage, flaky, action ถัดไป |
| `review-then-fix` | Alias ของ `/deep-review-then-fix` |
| `review-usage` | Review usage surface ของ project จากมุมผู้ใช้ |
| `review-uxui` | Review UX/UI design quality — design system, visual design, interaction design, accessibility, design-dev handoff |
| `review-workflow` | Review workflow — เร็ว, ปลอดภัย, ใช้ง่าย, มีประสิทธิภาพ, ไม่ซ้ำซ้อน, ไม่เกิน scope |
| `review-workspace` | Review workspace เดี่ยวใน monorepo หรือ project เดี่ยว ครบถ้วนตามมาตรฐาน พร้อม score และ recommendations |
| `review-writing` | ปรับปรุงคุณภาพการเขียน, naming conventions, discoverability ทั่ว project |

## Domain Pipeline

Catalog review domains ทั้งหมดสำหรับ `deep-review` — ครอบคลุมครบทุก domain (merged จาก `references/review-skills.md`)

### Priority Order

> เมื่อเวลาจำกัดหรือ findings เยอะ — review/fix ตามลำดับนี้เสมอ (เรียงตาม blast radius ต่อ production)

| Priority | Domains | เหตุ |
|----------|---------|------|
| P0 Critical | `security`, `auth`, `data-validation`, `database`, `config` | กระทบความปลอดภัย/ข้อมูลโดยตรง — ผิด = breach/corruption/downtime |
| P1 High | `architecture`, `quality`, `api`, `dependencies`, `workspace` | structural debt — งานทุกชิ้นต่อไปสร้างบนฐานนี้ |
| P2 Medium | `performance`, `stability`, `events`, `frontend`, `backend`, `observability`, `iac` | คุณภาพ runtime — แก้ได้หลัง structure นิ่ง |
| P3 Low | `docs`, `writing`, `uxui`, `seo`, `accessibility`, `business`, `compliance`, `i18n`, `dx`, `usage`, `ai`, `mcp`, `bundle`, `cost` | polish/domain-specific — ไม่ block production |
| P4 Meta | Phase 4-5 ทั้งหมด (`gaps`, `risk`, `diff`, `plan` ฯลฯ + `deep-*`) | ต้องมี findings จาก P0-P3 ก่อนจึง meaningful |

- pipeline phases ข้างล่างคือ *execution order* ต่อ workspace; priority ตารางนี้คือ *attention order* เมื่อต้องเลือก — รัน phase ครบแต่จัดการ findings ตาม P0 ก่อนเสมอ

### Phase 1 — Entry (config/stack/structure)

| No. | Domain | ตรวจอะไร | Condition |
|-----|--------|----------|-----------|
| 1 | `review-config` | config files, drift, missing, duplicate, shared config | ทุก workspace |
| 2 | `review-techstack` | tech stack, versions, library design | ทุก workspace |
| 3 | `review-architecture` | modularity, isolation, boundaries, resilience | ทุก workspace |
| 4 | `review-workspace` | manifest, deps, scripts ของ workspace | monorepo members |
| 5 | `review-workflow` | workflows/pipelines ใน workspace | ทุก workspace |
| 6 | `review-dot-devin` | `.devin/` structure, hooks, `rules/` (ast-grep), `sgconfig.yml`, `AGENTS.md` | workspace ที่มี `.devin/` หรือ rules |
| 7 | `review-docs` | docs structure, README, USAGE, FEATURES | workspace ที่มี docs |

### Phase 2 — Source Code

| No. | Domain | ตรวจอะไร | Condition |
|-----|--------|----------|-----------|
| 1 | `review-code-quality` | code quality, naming, bug-prone patterns, correctness | ทุก workspace ที่มี source |
| 2 | `review-writing` | writing quality, discoverability | ทุก workspace |
| 3 | `review-algorithm` | time/space complexity, hot paths | workspace ที่มี logic |
| 4 | `review-data-validation` | validation coverage, type-safety | workspace ที่รับ input |
| 5 | `review-cli` | commands, I/O contract, exit codes | workspace ที่เป็น CLI/TUI |
| 6 | `review-api` | REST conventions, versioning, errors | workspace ที่ expose API |
| 7 | `review-sdk` | public API surface, exports, semver, types | workspace ที่ publish package/library |
| 8 | `review-backend` | backend sub-reviews, data flow | workspace ที่มี backend |
| 9 | `review-frontend` | components, state, rendering, forms | workspace ที่มี UI code |
| 10 | `review-mobile` | touch targets, lifecycle, platform conventions | workspace ที่เป็น mobile app |
| 11 | `review-desktop-app` | window, tray, IPC security, packaging, auto-update | workspace ที่เป็น desktop app |
| 12 | `review-browser-ext` | manifest v3, permissions, content scripts, CSP | workspace ที่เป็น browser extension |
| 13 | `review-iac` | Terraform/Pulumi/CDK/K8s, state, secrets, drift | workspace ที่มี IaC |
| 14 | `review-usage` | usage surface parity — API/CLI/web vs docs promise | workspace ที่มี public usage surface |
| 15 | `review-database` | schema, indexes, queries, migrations | workspace ที่แตะ DB |
| 16 | `review-events` | event schemas, ordering, idempotency, DLQ | workspace ที่ใช้ events/queues |
| 17 | `review-auth` | sessions, tokens, OAuth, RBAC | workspace ที่มี auth |
| 18 | `review-business` | payment, subscription, feature flags | workspace ที่มี business logic |

### Phase 3 — Cross-Cutting Metrics

| No. | Domain | ตรวจอะไร | Condition |
|-----|--------|----------|-----------|
| 1 | `review-security` | OWASP, secrets, injection, supply chain | ทุก workspace |
| 2 | `review-performance` | network, build, runtime, memory, I/O | ทุก workspace |
| 3 | `review-stability` | error handling, recovery, debuggability | ทุก workspace |
| 4 | `review-observability` | metrics, tracing, logging, alerting | workspace ที่ deploy จริง |
| 5 | `review-compliance` | GDPR, PDPA, consent, retention | workspace ที่เก็บ user data |
| 6 | `review-cost` | compute, storage, idle resources | workspace ที่มี infra |
| 7 | `review-bundle` | bundle size, chunks, tree-shaking, static assets | workspace ที่ build frontend/lib |
| 8 | `review-seo` | technical SEO, structured data, CWV | workspace ที่เป็น public web |
| 9 | `review-i18n` | message catalogs, RTL, formats | workspace ที่มี i18n |
| 10 | `review-accessibility` | WCAG, ARIA, keyboard, contrast | workspace ที่มี UI |
| 11 | `review-uxui` | design system, interaction, handoff | workspace ที่มี UI |
| 12 | `review-ai` | prompts, token cost, guardrails, evals | workspace ที่ใช้ AI/LLM |
| 13 | `review-mcp` | MCP tool naming, schemas, auth | workspace ที่เป็น/ใช้ MCP |
| 14 | `review-test` | test strategy, quality, coverage | ทุก workspace ที่มี tests |
| 15 | `review-coverage` | declared surface เทียบของจริง | ทุก workspace |
| 16 | `review-dependencies` | outdated, vulnerabilities, unused | workspace ที่มี manifest |
| 17 | `review-delivery` | docs, DX, CI/CD, infra | ทุก workspace |
| 18 | `review-dx` | dev loop, onboarding, error messages, ergonomics | workspace ที่มี dev workflow |
| 19 | `review-release` | release/deploy readiness | workspace ที่ release/deploy |
| 20 | `review-alignment` | cross-layer drift code↔docs↔tests↔config↔API contracts (report-only) | ทุก workspace |
| 21 | `review-optimize` | optimization opportunities ทุก layer + prioritized plan | ทุก workspace |
| 22 | `review-redundancy` | duplicates/redundant/unused — code, skills, docs, config (report-only) | ทุก workspace |

### Phase 4 — Meta / Conditional

| No. | Domain | ใช้เพื่อ | Condition |
|-----|--------|---------|-----------|
| 1 | `review-gaps` | รวม findings จาก dimensional reviews เป็น prioritized list | หลัง phase 1-3 เสมอ |
| 2 | `review-by-stakeholder` | persona lens (staff-engineer, qa, pm, user) | เมื่อต้องการ prioritization หลายมุม |
| 3 | `review-risk` | probability, impact, mitigation | เมื่อ findings เสี่ยงสูง |
| 4 | `review-diff` | git diff keep/revert | เมื่อ scope มี diff |
| 5 | `review-code-quality` | pre-refactor baseline | เมื่อ findings ชี้ refactor |
| 6 | `review-migration` | migration plan + checklist | เมื่อมี migration |
| 7 | `review-plan` | plan quality | เมื่อ scope คือ plan |
| 8 | `review-idea` | idea assessment | เมื่อ scope คือ idea |
| 9 | `review-issue` | issue clarity, scope, acceptance criteria | เมื่อ scope คือ issue |
| 10 | `/review-devin-global-harness` | devin harness layers | เฉพาะเมื่อ target คือ devin skills/agents repo |
| 11 | `review-then-fix` | alias → `/deep-review-then-fix` | เมื่อ user confirm แก้ findings |

### Phase 5 — Deep (via `/follow-deep`)

dispatch ผ่าน `/follow-deep` ต่อ workspace หลัง phase 1-4 — `follow-deep` เลือก `deep-*` ที่ตรง context; ตารางนี้คือ coverage ที่ต้องพิจารณาครบทุกตัว

| No. | Skill | ตรวจอะไร | Condition |
|-----|-------|----------|-----------|
| 1 | `/deep-analyze` | วิเคราะห์ลึกทุกมิติด้วย tools/scripts/CLI | ทุก workspace |
| 2 | `/deep-trace` | trace execution flow, logs, distributed trace | workspace ที่มี runtime/async flow |
| 3 | `/deep-debug` | debug หลายมิติ reproduce → prevent | เมื่อมี bug findings |
| 4 | `/deep-test` | testing domains: api, cli, contract, coverage, e2e, integration, mutation, visual | ทุก workspace ที่มี tests |
| 5 | `/deep-build` | build หลาย target/platform, bundle analysis | workspace ที่ build |
| 6 | `/deep-impact` | impact analysis ก่อน change ใหญ่ | เมื่อ findings ชี้ refactor/upgrade |
| 7 | `/deep-research` | ค้นหลายแหล่ง: packages, docs, security | เมื่อต้อง external knowledge |
| 8 | `/deep-validate` | validate ละเอียดหลายมิติ cross-reference | ท้าย pipeline เสมอ |
| 9 | `/deep-retro` | post-incident retrospective | เมื่อเจอ incident/root-cause findings |
| 10 | `/deep-thinking` | วิเคราะห์ปัญหาเป็นระบบไม่ใช้ tools | เมื่อ findings ซับซ้อน/ไม่ชัด |
| 11 | `/deep-plan` | plan ระดับ implementation-ready | เมื่อ findings ต้องการ plan ก่อน fix |

Excluded จาก dispatch: `/deep-review` (ตัวเอง), `/deep-review-then-fix` (fix path ไม่ใช่ review), aliases (`refactor`→`refactor`, `deep-verify`→`run-verify`, `implement-to-production`→`implement-to-production`, `deep-update-project`→`update-project`)

### Pipeline Rules

1. dispatch ครบ phase 1-3 ทุก workspace ยกเว้น condition ที่ N/A ชัดเจน — ห้ามข้ามเพราะ "ไม่น่าจะมีปัญหา" — ภายใต้ budget ของ Step 1 (workspaces ≤ 10, dispatches ≤ 30; เกิน → mark `skipped (budget)` ใน ledger)
2. independent skills → `/use-subagents` หรือ `/follow-parallel` ≤10 ต่อ batch
3. subagent อ่าน slice file `reports/.deep-review-<time>/findings-<domain>.json` + เฉพาะไฟล์ใน evidence — ห้ามรัน CLI ซ้ำ ห้าม sweep ทั้ง codebase
4. ทุก finding ต้องระบุ `ใน update-review-cli-then-run` = Y/N — N หมายถึง analyzer gap → ส่งต่อ `/update-review-cli-then-run`
5. `fixSkill` field ใน finding เป็น canonical owner — ห้าม map ซ้ำเอง
6. Phase 5 ทำผ่าน `/follow-deep` เมื่อ `--deep` flag ถูกส่ง หรือ workspace มี Critical/High findings — ครอบคลุม `deep-*` ทุกตัวที่ condition ตรง ไม่เลือกบางตัวเอง

## Review Rules

Canonical rules ที่ใช้ร่วมกันในทุก `review-*` domain (merged จาก `references/review-rules.md`) — `(<domain>)` คือชื่อ domain

### Evidence-Based Findings

- ทุก finding ต้องมี file path, line number และ evidence
- ไม่เดา — ใช้ tools สำหรับ verification
- ระบุ false positives ที่พบ

### Severity Classification

- Critical: ใช้ไม่ได้จริง / data loss / security exposure
- High: broken สำหรับ common case / missing protection บน critical path
- Medium: inconsistency หรือ partial failure
- Low: cosmetic, documentation gap
- Info: suggestion, best practice recommendation

### Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์, code หรือ configuration ระหว่าง review
- ถ้าพบ issues ที่ต้องแก้ไข → report ผ่าน `/report` และ `/suggest-next-action`

### Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`

## Fix

Canonical boilerplate สำหรับ fix workflow ของทุก `review-*` domain (merged จาก `references/review-fix.md`)

> ทำ section นี้เฉพาะเมื่อ user confirm ให้แก้ findings — review/report-only โดย default; multi-domain fix orchestration → `/deep-review-then-fix`

Standard fix steps เมื่อ domain ไม่มี fix workflow เฉพาะ:

1. จัดลำดับ findings ตาม severity — critical ก่อน แล้วแก้ทีละรายการพร้อม verify ทันทีหลังแก้
2. ใช้ fix route เฉพาะ domain (ตาม checklist ใน `## Domain Guides` หรือ domain spec)
3. ทุก fix ต้องรักษา behavior เดิม ผ่าน `/run-check` และ `/run-test` ถ้ามี แล้วสรุปผลด้วย `/report-before-after`

## Dimension Map

ใช้เมื่อต้องสแกน scope แบบกว้างหา "improve อะไรได้บ้าง" — ตรวจแต่ละ dimension แบบเบา (ไม่ใช่ deep review เต็มรูปแบบ) แล้ว map ไปยัง `## Fix` ของ domain ที่ตรง (merged จาก `references/dimension-map.md`)

| No. | Dimension | ดูอะไร | Fix Skill |
|-----|-----------|--------|-----------|
| 1 | Architecture | boundaries, coupling, SRP, layer violations | `/deep-review` |
| 2 | Security | secrets, auth, injection, headers, deps vulns | `/deep-review` |
| 3 | Performance | bundle, rendering, queries, memory, network | `/deep-review` |
| 4 | Quality | naming, duplication, complexity, dead code | `/deep-review-then-fix` |
| 5 | Dependencies | outdated, vulnerable, unused, licenses | `/deep-review` |
| 6 | Accessibility | WCAG violations, keyboard, contrast | `/deep-review` |
| 7 | Docs | stale docs, missing guides, broken links | `/deep-review` |
| 8 | Tests | coverage gaps, missing edge cases | `/deep-review` |
| 9 | Observability | missing logs, metrics, alerts | `/deep-review` |
| 10 | Stability | error handling, retries, degradation | `/deep-review` |
| 11 | API | validation, errors, versioning, contract drift | `/deep-review` |
| 12 | Auth | sessions, tokens, OAuth, authz matrix | `/deep-review` |
| 13 | Database | queries, indexes, N+1, migrations, PII | `/deep-review` |
| 14 | SEO | meta, OG, structured data, sitemap | `/deep-review` |
| 15 | Config | env drift, defaults, secrets in config | `/deep-review` |
| 16 | Delivery | CI/CD speed, caching, Docker, releases | `/deep-review` |
| 17 | Cost | idle resources, over-provisioning, egress | `/deep-review` |
| 18 | Frontend | components, state, rendering, resilience | `/deep-review` |
| 19 | Backend | services, jobs, idempotent consumers | `/deep-review` |
| 20 | UXUI | design system, interaction, handoff | `/deep-review` |
| 21 | CLI | commands, help, exit codes, output | `/deep-review` |
| 22 | i18n | catalogs, hardcoded strings, RTL, formats | `/deep-review` |
| 23 | Mobile | touch, safe areas, lifecycle, offline | `/deep-review` |
| 24 | AI | prompts, token cost, guardrails, evals | `/deep-review` |
| 25 | MCP | tool schemas, safety, server config | `/deep-review` |
| 26 | Events | event schemas, idempotency, DLQ | `/deep-review` |
| 27 | Migration | unsafe ops, rollback, ordering | `/deep-review` |
| 28 | Compliance | GDPR/PDPA, consent, retention | `/deep-review` |
| 29 | Business | payments, tenancy, flags, realtime | `/deep-review` |
| 30 | DataValidation | schemas, boundary validation | `/deep-review` |
| 31 | Algorithm | complexity, data structures, hot paths | `/deep-review` |
| 32 | Assets | images, fonts, media, caching | `/deep-review` |
| 33 | Bundle | code splitting, tree shaking, size | `/deep-review` |
| 34 | Workspace | monorepo graph, circular deps | `/deep-review` |
| 35 | Writing | naming, readability, discoverability | `/deep-review` |

Rules:

- สแกนกว้างไม่ลงลึก — ถ้าต้องการ depth ให้ใช้ `review-*` เฉพาะด้านหรือ `/deep-review`
- ทุก finding ต้องมี evidence ไม่เดา
- แสดงเฉพาะ findings ที่มี fix path ชัดเจน — ถ้าไม่มี skill ตรงให้ระบุ "no skill" พร้อมแนวทาง
- ไม่แก้ไข code ระหว่าง scan — ส่งต่อ `## Fix` เท่านั้น
- ไม่สร้าง findings จาก style preference ที่ไม่มีผลจริง

## Domain Guides

### DX

Review developer experience ด้าน tooling, onboarding, docs, และ feedback loops (merged จาก `references/dx.md` — ใช้กับ domain `review-dx`)

#### Tooling

1. ตรวจสอบ package scripts (`dev`, `build`, `test`, `lint`, `typecheck`) ใช้งานได้และไม่ซ้ำซ้อน
2. ตรวจสอบ dev server startup time และ hot reload / HMR
3. ตรวจสอบ build time, incremental build, และ cache usage
4. ตรวจสอบ lint, format, type check runtime เร็วพอ
5. ตรวจสอบ IDE integrations, extensions, และ editor config (`editorconfig`, `.vscode/settings.json`)
6. ตรวจสอบ pre-commit hooks ไม่ช้าและไม่ block

#### Onboarding

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide เป็น step-by-step บน clean environment
3. ตรวจสอบ prerequisites, env vars, และ secrets setup
4. ตรวจสอบ one-command setup เช่น `bun install && bun dev`
5. ตรวจสอบ troubleshooting guide สำหรับข้อผิดพลาดทั่วไป

#### Docs

1. ตรวจสอบ API docs / `JSDoc` / `TSDoc` ครอบคลุม public API
2. ตรวจสอบ examples runnable และ up-to-date
3. ตรวจสอบ changelog / migration guide ถ้ามี breaking changes
4. ตรวจสอบ doc tools (`VitePress`, `Docusaurus`, `Storybook`) ตรงกับ code
5. ตรวจสอบ docs ไม่มี broken links, missing pages, stale screenshots

#### Feedback Loops

1. ตรวจสอบ error messages บอกสาเหตุ, วิธีแก้, และตำแหน่ง
2. ตรวจสอบ stack traces อ่านง่ายและมี context
3. ตรวจสอบ test feedback loop เร็ว (unit, integration, watch mode)
4. ตรวจสอบ lint / type check feedback ใน IDE และ CI
5. ตรวจสอบ observability สำหรับ debug: logs, metrics, tracing
6. ตรวจสอบ build / deploy error feedback ชัดเจน

#### DX Severity

- Critical: ไม่สามารถ run dev/build ได้, broken setup, no onboarding guide, unrecoverable error
- High: no HMR, slow build > 1 นาที, missing debug tooling, unclear error messages, missing contributing guide
- Medium: poor error messages, missing docs, suboptimal feedback loop
- Low: cosmetic improvement

Rules: review เท่านั้น ไม่ fix — build ควร < 1 นาที, tests รันเร็ว, linting เร็ว, HMR instant — ทุก finding มี file:line หรือ doc URL

### Platform Mobile And Desktop

Mobile/desktop platform checks (merged จาก `references/platform-mobile-desktop.md` — ใช้กับ `review-mobile` + `review-desktop-app`)

#### Mobile — Capacitor And Native Bridge

1. ตรวจสอบ Capacitor plugin usage, platform detection, และ native bridge patterns
2. ตรวจสอบ plugin compatibility กับ target platform versions
3. ตรวจสอบ native bridge error handling และ fallback behavior

#### Mobile — Offline And Notifications

1. ตรวจสอบ offline support, cache strategy, และ offline data sync
2. ตรวจสอบ push notification handling: permission flow, notification display, action handling
3. ตรวจสอบ biometric auth integration และ fallback

#### Mobile — UX

1. ตรวจสอบ touch targets: ขนาดต่ำสุด 44x44px, spacing ระหว่าง targets
2. ตรวจสอบ safe area handling: notch, home indicator, status bar
3. ตรวจสอบ responsive layout ข้าม screen sizes และ orientations

#### Mobile Severity

- Critical: native bridge พัง, plugin ที่จำเป็นหายไป, app crash บน platform
- High: ไม่มี offline support, push notification พัง, ไม่มี platform detection
- Medium: missing safe area, touch target เล็กเกินไป, inconsistent responsive layout
- Low: minor layout issue, cosmetic improvement

#### Desktop — Native APIs And IPC

1. ตรวจสอบ native API usage, IPC patterns, และ security boundaries ระหว่าง main/renderer processes
2. ตรวจสอบ IPC message validation, input sanitization, และ channel whitelisting
3. ตรวจสอบ context isolation, node integration settings, และ sandbox configuration

#### Desktop — Window Management

1. ตรวจสอบ window management, multi-window patterns, และ window state persistence
2. ตรวจสอบ window lifecycle: create, restore, minimize, maximize, close
3. ตรวจสอบ single-instance lock และ second-instance handling

#### Desktop — Auto-Update

1. ตรวจสอบ auto-update mechanism, update signature verification, และ rollback capability
2. ตรวจสอบ update channel configuration และ staged rollout
3. ตรวจสอบ update notification UX และ restart behavior

#### Desktop — File System And Sandbox

1. ตรวจสอบ file system access, path validation, และ sandbox restrictions
2. ตรวจสอบ file dialog integration, drag-and-drop, และ recent files
3. ตรวจสอบ permission model และ user consent flow

#### Desktop — Platform-Specific Code

1. ตรวจสอบ platform-specific code, conditional compilation, และ platform feature detection
2. ตรวจสอบ offline support, local data persistence, และ sync conflict resolution
3. ตรวจสอบ desktop UX: system tray, notifications, keyboard shortcuts, clipboard integration

#### Desktop Severity

- Critical: IPC ไม่มี validation, file system access ไม่จำกัด, ไม่มี sandbox, auto-update ไม่ verify
- High: ไม่มี platform-specific handling, native integration พัง, ไม่มี auto-update rollback, ไม่มี offline fallback
- Medium: inconsistent window state, missing keyboard shortcut, suboptimal tray integration
- Low: minor UX polish, cosmetic improvement

### Time Complexity

วิเคราะห์และควบคุม time complexity ของ algorithms และ data structures (merged จาก `references/time-complexity.md` — ใช้กับ `review-algorithm`) — ใช้สำหรับ projects ที่ต้องการรับประกัน performance ภายใต้ input size ที่คาดการณ์ได้ ไม่ใช้กับ prototype

#### Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|---|---|---|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

#### Checklist

1. Identify critical paths — hot paths, functions ที่รับ input ขนาด variable, collection processing (loops, recursion, nested iteration, sorting, searching), functions ที่ถูกเรียกบ่อย (event handlers, middleware, query builders, render loops); ไม่มี → skip
2. Classify complexity — single loop = O(n), nested = O(n²), binary search = O(log n); recursion ใช้ Master Theorem; data structure ops: array access = O(1), hash lookup = O(1) avg, tree = O(log n); บันทึกเป็นตาราง function/input size/complexity/expected max time
3. Validate against input bounds — ระบุ input size สูงสุด, คำนวณ worst-case operations, ถ้าเกิน 10⁶ → ต้อง optimize; input ไม่ชัด → heuristic: UI = 10³, API = 10⁴, batch = 10⁶, data pipeline = 10⁸
4. Verify with benchmarks — `/run-bench` หลาย input sizes; empirical growth ไม่ตรง theoretical → วิเคราะห์ใหม่; `/update-tests` สำหรับ regression

#### Data Structure Selection

- hash map: lookup บ่อยไม่ต้อง sorting · sorted array: search + range queries · tree: insert/delete + search พร้อมกัน · array: random access + sequential iteration · heap: min/max + partial sorting · ไม่ใช้ linked list เมื่อต้อง random access

#### Anti-Patterns

- ห้าม nested loop กับ collection ขนาด variable โดยไม่วิเคราะห์ — ใช้ hash map หรือ precompute
- ห้าม sort ทุกครั้งที่ query — sort ครั้งเดียวแล้ว binary search
- ห้าม recursive โดยไม่ memoize เมื่อมี overlapping subproblems
- ห้าม `array.indexOf` ใน loop — ใช้ `Set` หรือ `Map` แทน
- ห้าม assume O(1) โดยไม่ตรวจ — hash map worst case = O(n)

#### Optimization Principles

- วัดก่อน optimize — ใช้ `/run-bench` ยืนยัน bottleneck จริง
- เปลี่ยน data structure ก่อนเปลี่ยน algorithm — impact ใหญ่กว่า risk น้อยกว่า
- ไม่ optimize ก่อนมี evidence — premature optimization เป็น anti-pattern
- complexity เท่ากัน → เลือก algorithm ที่อ่านง่ายกว่า
- Cache ผลลัพธ์ของ expensive pure functions เมื่อ input ซ้ำบ่อย

#### Complexity Severity

- Critical: O(n²) บน input > 10⁴ ใน hot path, O(n!) บน input > 10
- High: O(n²) บน input > 10² ใน hot path, missing memoization บน overlapping subproblems
- Medium: suboptimal data structure selection, missing cache บน expensive pure functions
- Low: minor optimization opportunities, readability vs performance trade-offs

## Pattern Guides

Canonical architecture pattern guides สำหรับ domain `review-architecture` (merged จาก `references/pattern-clean.md` + `references/pattern-layered.md` — เลือก pattern ผ่าน `/follow-architecture`)

### Pattern: Clean Architecture

Implement Clean Architecture ด้วย Vertical Slice Modules, Functional Core และ Ports & Adapters สำหรับ production-grade applications — เหมาะกับ projects ที่ต้องการ testability สูง และ maintainability ระยะยาว

#### Execute — Clean

##### 1. Setup Project Structure

```
src/
├── modules/                      # Feature modules (Vertical Slice)
│   └── [module-name]/            # types/ schemas/ domain/ application/ ports/ index.ts
├── adapters/                     # External systems: db/ http/ external/ config/ cache/ queue/ storage/ auth/
├── presentation/                 # Entry points: http/ graphql/ grpc/ cli/ events/
├── shared/                       # Shared kernel: types/ utils/ errors/ constants/ ports/ mappers/
test/                             # Mirror src structure: fixtures/ helpers/ mocks/ modules/
```

##### 2. Create Shared Kernel

1. `types/` - Common types (`Result`, `Option`)
2. `utils/` - Pure utility functions
3. `errors/` - Error types
4. `ports/` - Cross-module shared interfaces (`LoggerPort`, `ClockPort`, `IdGeneratorPort`)
5. `mappers/` - Shared mapper functions across modules

##### 3. Implement Functional Core

เขียน business logic ใน `modules/*/domain/` ด้วย pure functions (ถ้า project ใช้ TypeScript ให้ทำ `/follow-lib-effect-ts` ก่อนเพื่อใช้ Effect สำหรับ type-safe effects, error handling และ dependency injection)

1. ใช้ `pure functions` เท่านั้น, Immutable data structures (`readonly`)
2. ไม่มี side effects, ไม่พึ่ง infrastructure
3. ทำ `/deep-review` เพื่อกำหนด validation strategy ข้าม layers
4. ทำ `/follow-lib-zod` สำหรับ schema validation ใน `modules/*/schemas/`

##### 4. Implement Application Layer

ทำ `/follow-event-driven` เมื่อ application มี event-driven workflows; ถ้าไม่ใช้ event-driven ให้สร้าง usecases/queries ตรงๆ ใน `modules/*/application/`

1. `usecases/` - Flow orchestration (write side)
2. `queries/` - Read-side queries (CQRS read)
3. `workflows/` - Complex multi-step workflows
4. `handlers/` - Domain event handlers
5. ใช้ `ports` สำหรับ side effects

##### 5. Implement Adapters And Presentation

วางโครงสร้าง adapters และ presentation layers ตาม dependency direction (presentation → application → adapters → ports)

1. `adapters/db/` - Database implementations — ทำ `/refactor` orm scope (`#### 6.2 Repository Pattern`)
2. `adapters/http/` - HTTP clients, `adapters/external/` - External services
3. `adapters/cache/` - Cache, `adapters/queue/` - Message queues, `adapters/storage/` - File storage
4. `presentation/http/` - HTTP handlers, `presentation/graphql/` - GraphQL resolvers
5. `presentation/cli/` - CLI commands, `presentation/events/` - Event handlers

##### 6. Refactor Existing Code

ถ้ามี existing code: ทำ `/refactor` เพื่อย้าย code เข้า structure ใหม่ (ถ้าไม่มี ให้ข้ามขั้นตอนนี้)

1. ย้าย business logic ไป `modules/*/domain/operations/`
2. ย้าย data models ไป `modules/*/domain/models/` เป็น `readonly` types
3. ย้าย repository implementations ไป `adapters/db/`, HTTP handlers ไป `presentation/http/`
4. แปลง class methods เป็น `pure functions`
5. สร้าง module ports ใน `modules/*/ports/`

##### 7. Testing Strategy

ทำ `/update-tests` เพื่อจัดการ tests ตาม Clean Architecture

1. ทำ `/follow-tool-vitest` สำหรับ testing framework setup
2. Unit tests - Pure function tests ใน `test/modules/*/domain/` (AAA pattern)
3. Integration tests - Adapter tests ใน `test/adapters/` (mock ports)
4. E2E tests - Full workflow tests ใน `test/e2e/` (critical flows)
5. Test fixtures ใน `test/fixtures/`, helpers ใน `test/helpers/`

##### 8. Split Modules When Too Large

ถ้า module โตเกินเกณฑ์ ให้ทำ `/refactor-workspace`

1. วัด module size: module เกิน 15 ไฟล์, ไฟล์ใน `domain/operations/` เกิน 300 บรรทัด, usecases ใน `application/usecases/` เกิน 5 ตัว
2. เลือก pattern: sub-module (ยังเกี่ยวข้อง parent), sibling module (อิสระ), shared module (ใช้ร่วม)
3. สร้าง sub-module directories ตาม Clean Architecture structure
4. ทำ `/update-references` เพื่ออัปเดท imports
5. ทำ `/run-test` เพื่อยืนยัน functionality ไม่พัง

#### Rules — Clean

##### 1. Core Rules

- `Domain` = business rules (100% pure)
- `Application` = orchestration + "what happens next" decisions
- `Adapters` = side effects only

##### 2. Folder Structure

| Folder | Purpose | Side Effects | Required |
|--------|---------|--------------|----------|
| `modules/*/domain/` | Pure business logic | None | Required |
| `modules/*/application/` | Orchestration | Via ports | Required |
| `modules/*/ports/` | Module interfaces | None | Required |
| `adapters/` | External systems | I/O only | Required |
| `presentation/` | Entry points | I/O only | Required |
| `shared/` | Common utilities | None | Required |

##### 3. Layer Responsibilities

| Layer | Dependencies | Side Effects |
|-------|--------------|--------------|
| Domain | None | None |
| Application | Domain | Via ports |
| Adapters | Ports | I/O only |
| Presentation | Application | I/O only |
| Shared | None | None |

##### 4. When To Use

เหมาะกับ: testability สูง, เปลี่ยน technology ได้ง่าย, ทีม 3+ developers
ไม่เหมาะกับ: CRUD ธรรมดา, Prototype/MVP, One-person project ระยะสั้น

##### 5. Module Splitting

- ผ่าน 2+ triggers = ควร split (ไฟล์เกิน 15, operations เกิน 300 บรรทัด, usecases เกิน 5)
- ไม่ split module ที่ < 5 ไฟล์ (`over-engineering`)
- แต่ละ sub-module ควรมี 3-10 ไฟล์ และเขียน responsibility ได้ในประโยคเดียว (SRP)
- ไม่ split ถ้าทำให้เกิด `circular dependency` หรือใน prototype/MVP phase

- ใช้ /follow-tool-vite ถ้าจำเป็น
- ใช้ /follow-lang-typescript ถ้าจำเป็น
- ใช้ /follow-lang-rust ถ้าจำเป็น
- ใช้ /follow-create-bun-cli ถ้าจำเป็น
- ใช้ /improve ถ้าจำเป็น
- ใช้ /run-clean ถ้าจำเป็น

#### Expected Outcome — Clean

- Functional Clean Architecture ที่ production-ready
- Pure domain logic ใน `modules/` (100% functional)
- Side effects isolation ใน `adapters/` layer เท่านั้น
- Production-grade testability จาก pure functions + clear boundaries

### Pattern: Layered Architecture

Implement Layered Architecture สำหรับ Frontend projects โดยแยก concerns ตาม layers และ enforce dependency rules — เหมาะกับ Frontend projects (Vue/Nuxt/React/Solid) ขนาดเล็ก-กลาง

#### Execute — Layered

##### 1. Select Pattern

1. ประเมิน project size และ team experience
2. เลือก pattern: traditional layered, feature-based, 4-layer, หรือ hybrid
3. พิจารณา project lifecycle และ migration path
4. ทำ `/follow-tool-vite` สำหรับ build tooling setup

##### 2. Create Structure

Flat Type-Grouped (canonical — canonical template: `follow-architecture/templates/file-structure-layered.md`):

```
src/
├── app/              // entry, routes/pages, middleware, server
├── components/       // UI components (PascalCase, presentational)
├── hooks/            // composables / hooks — UI state + view logic
├── usecases/         // application use cases — orchestration entry
├── services/         // domain services — business rules
├── features/         // feature-level logic เฉพาะ domain (optional)
├── infra/            // repositories, database/, external APIs
├── lib/              // third-party wrappers / singleton clients
├── utils/            // pure utilities — no IO
├── types/            // shared types — pure types only
├── constants/        // app constants
├── config/           // env/app config
└── index.ts          // barrel — public API
```

- Flat เท่านั้น — ห้าม nest ตาม capability; prefix ชื่อไฟล์ตาม domain (`user-service.ts`)
- layer mapping: presentation = `app/`+`components/`+`hooks/`; domain = `usecases/`+`services/`+`features/`; data = `infra/`+`lib/`; shared leaves = `types/`+`constants/`+`utils/`+`config/`
- framework flat conventions (frontend เล็ก-กลาง): `stores/` (Pinia/Zustand), `middleware/`, `plugins/` เพิ่มได้ตาม framework — จัดเข้า layer ตาม role

Alternative Variants (เลือกเฉพาะเมื่อ flat ไม่พอ):

Feature-Based (features ชัดเจน แยกกันได้ — ยอม nest ตาม feature):

```
src/
├── features/          // feature-based organization
│   ├── auth/         // authentication feature
│   │   ├── composables/  // Vue composables
│   │   ├── components/  // Vue components
│   │   ├── api/          // API calls
│   │   ├── stores/ (optional)   // state management
│   │   ├── hooks/ (optional)     // custom hooks
│   │   ├── middleware/ (optional) // route middleware
│   │   └── types/        // TypeScript types
│   └── dashboard/    // dashboard feature
└── shared/           // shared utilities
    ├── utils/        // utility functions
    ├── stores/ (optional)     // global state
    ├── plugins/ (optional)    // framework plugins
    ├── constants/ (optional)  // app constants
    └── types/ (optional)      // shared types
```

4-Layer (separation of concerns แบบชัดเจน):

```
src/
├── presentation/     // UI components, pages, routing, layout
│   ├── components/   // reusable UI (Button, Card)
│   ├── pages/        // page-level components
│   └── hooks/        // UI-specific hooks
├── application/      // state orchestration, workflows
│   ├── stores/       // TanStack Query, Zustand, Pinia
│   ├── useCases/     // application workflows
│   └── utils/        // app-wide utilities
├── domain/           // business entities and pure logic
│   ├── entities/     // models (User, Product)
│   ├── repositories/ // interfaces for data access
│   └── services/     // pure business logic functions
├── infrastructure/   // external integrations
│   ├── api/          // API clients
│   ├── storage/      // LocalStorage, IndexedDB wrappers
│   └── config/       // environment configs
└── shared/           // cross-layer utilities (types, constants)
```

##### 3. Enforce Dependencies And Public APIs

1. ใช้ path aliases (`@/domain/...`, `@/application/...`) เพื่อให้ layer transitions ชัดเจน
2. ถ้า project มี `Biome` → เพิ่ม restricted import rules
3. ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
4. หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 4. Align Tests With Layers

1. `Domain` tests: pure functions และ policies
2. `Application` tests: use cases กับ fake repositories
3. `Infrastructure` tests: adapters และ mapping (contract tests)
4. `Presentation` tests: behavior และ composition
5. ถ้า project มี `Vitest` → ทำตาม `/follow-tool-vitest`

##### 5. Setup And Migrate

1. สร้าง folder structure ตาม pattern ที่เลือก
2. ตั้งค่า import alias ใน `tsconfig` หรือ `nuxt.config`
3. ย้าย code ทีละ feature เพื่อลด risk
4. ถ้า project มี `Nuxt Layers` → ใช้ `extends` ใน `nuxt.config.ts`
5. ทำ `/refactor` หลังจากเสร็จ
6. ถ้า project โตขึ้น (3+ devs) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)

#### Rules — Layered

##### 1. Pattern Selection

- `flat type-grouped` = canonical default สำหรับ app เดียวทุกขนาด — grouping by type ไม่ nest ตาม capability
- `feature-based` เหมาะกับโปรเจกต์ที่มี features ชัดเจนและแยกกันได้ (ยอม nest ตาม feature)
- `4-layer` เหมาะกับโปรเจกต์ที่ต้องการ separation of concerns แบบชัดเจน (nested layers)
- `hybrid` (vertical slices + internal layering) เหมาะกับโปรเจกต์ขนาดใหญ่
- พิจารณา team experience และ project lifecycle

##### 2. Dependency Discipline

- presentation folders (`app/`, `components/`, `hooks/`) → domain folders เท่านั้น — ห้ามเรียก `infra/`/`lib/` ตรง
- domain folders (`usecases/` → `services/`/`features/` → `infra/`) — `app/` เรียก `usecases/`/`features/` เท่านั้น
- data folders (`infra/`, `lib/`) = leaf — ห้าม import presentation/domain
- `types/`/`constants/`/`utils/`/`config/` = shared leaves — ทุก layer ใช้ได้ ห้าม import กลับ; `utils/`/`types/` ต้อง pure
- ใช้ path aliases (`@/usecases/...`, `@/services/...`) เพื่อให้ layer transitions ชัดเจน
- ถ้า project มี `Biome` → เพิ่ม restricted import rules
- ถ้า project มี CI → เพิ่ม dependency graph checks สำหรับ cycle detection
- หลีกเลี่ยง circular dependencies โดยใช้ dependency injection ผ่าน interfaces

##### 3. Public API Rules

- แต่ละ layer/feature ต้องมี `index.ts` เป็น public API entry point
- ห้าม deep imports ข้าม layer (ใช้ `@/domain/order` ไม่ใช่ `@/domain/order/entities/User`)
- ใช้ barrel export pattern ทั้งหมด
- composables ใช้ prefix `use` เสมอ
- import ผ่าน alias ไม่ใช้ relative path

##### 4. Nuxt-Specific Guidelines

- ใช้ `Nuxt Layers` สำหรับ share configuration, components, และ composables ข้ามโปรเจกต์
- `srcDir` ค่าเริ่มต้นคือ `app/` ใน Nuxt 4
- auto-imported directories: `components/`, `composables/`, `utils/`
- ใช้ `shared/` สำหรับ code ที่ใช้ร่วมระหว่าง app และ server
- ลำดับ priority: project files > auto-scanned layers > `extends` config layers

##### 5. Common Pitfalls

- หลีกเลี่ยง `shared/` กลายเป็น escape hatch — shared ต้องมีเฉพาะ code ที่ใช้จริงข้าม layers
- หลีกเลี่ยง business layer กลายเป็น mega-service — แยก use cases ให้เล็กและ focused
- หลีกเลี่ยง features กระจายข้าม layers จนค้นหายาก — ใช้ `feature-based` ถ้าจำเป็น
- หลีกเลี่ยง manual enforcement โดยไม่มี lint หรือ CI checks

##### 6. Migration Path

- ถ้า project โตขึ้น (3+ devs, high testability) → migrate ไป Clean Architecture (`### Pattern: Clean Architecture`)
- ถ้า project ต้องการ modular boundaries → ใช้ module structure ใน `src/modules/<feature>/` ตาม `### Pattern: Clean Architecture`
- Domain logic ต้อง framework-agnostic เพื่อให้ migrate ได้ง่าย

- ใช้ /follow-lib-vue ถ้าจำเป็น
- ใช้ /follow-create-web-nuxt ถ้าจำเป็น
- ใช้ /follow-create-web-svelte ถ้าจำเป็น
- ใช้ /follow-create-web-nextjs ถ้าจำเป็น
- ใช้ /follow-lib-react ถ้าจำเป็น

#### Expected Outcome — Layered

- เลือก pattern ที่เหมาะสมกับโปรเจกต์
- Folder structure ชัดเจนตาม pattern ที่เลือก
- Dependency rules ถูก enforce ผ่าน aliases และ lint
- Code แยกตาม domain หรือ technical layer
- Tests จัดเรียงตาม layers
- Migration path ชัดเจนเมื่อ project โตขึ้น

## Expected Outcome

- `tools/review-codebase` CLI รันได้และ produce `reports/review-report.json` (full หรือ diff-scoped ตาม mode)
- Review ครอบคลุม 56 review domains (`## Review Domains` + `## Domain Pipeline`/`## Domain Guides`/`## Pattern Guides`) ตาม priority order (P0 Critical → P4 Meta) + `deep-*` ผ่าน `/follow-deep` ภายใต้ budget — coverage ตรวจได้จาก ledger + `## Coverage` matrix
- Findings มี priority, risk, fixSkill, status (new/existing/fixed/regressed), dedup แล้ว และ delta เทียบ baseline
- ทุก high-priority finding ถูก route ไปยัง review/deep-review-then-fix skill ที่เหมาะสม
- รายงานสรุปพร้อม Executive Summary, Result, Coverage matrix, per-domain sections, per-finding `หลักฐาน`/`เหตุผล`/`ความเสี่ยง`/`ลำดับความสำคัญ`/`fix skill`/`ใน update-review-cli-then-run`, Fix Status, Recommendations — verify ครบ section ก่อนจบ
- session ขาดกลางคัน → resume จาก ledger ได้โดยไม่รันงานซ้ำ; baseline ถูก save สำหรับ run ถัดไป
- analyzer gaps (`ใน update-review-cli-then-run = N`) และ analyzer/CLI issues ถูกบันทึกลง `update-review-cli-then-run/references/known-issues.md`
