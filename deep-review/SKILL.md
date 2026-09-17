---
name: deep-review
description: รัน review-* ครบทุก domain แล้วรายงานผลลง `.devin/reports/<workspace>/` (report only)
argument-hint: "[path-or-target] [--diff] [--deep]"
related:
  - run-review
  - update-review-cli
  - deep-review-then-fix
  - create-report-in-dot-devin
  - use-subagents
  - follow-parallel
  - follow-deep
  - list-workspaces
  - follow-monorepo
  - use-scripts
  - review
  - review-gaps
  - review-diff
  - review-risk
  - review-by-stakeholder
  - report
  - suggest-next-action
---

## Goal

ใช้ `tools/review-codebase` CLI รัน review แบบครอบคลุมทุกมิติของ codebase แล้ววิเคราะห์ผล จัดลำดับ findings และส่งต่อไปยัง review/deep-review-then-fix ที่เหมาะสม — ลึกที่สุดด้วย token น้อยและเวลาสั้นสุด รองรับ resume ถ้างานขาดกลางคัน

## Scope

ใช้เมื่อต้องการ review ครบทุก dimension ของ codebase (architecture, quality, security, performance, delivery, UX/DX) ผ่าน `tools/review-codebase` CLI ที่ project root โดยไม่ซ้ำกับ `/run-review` ที่เน้นการรัน CLI และแปลผลสั้นๆ

ผลลัพธ์รายงานลง `.devin/reports/<workspace>/deep-review-<time>.md` ผ่าน `/create-report-in-dot-devin` โดยแยก section ตาม `review-*` แต่ละ domain — report เท่านั้น ไม่แก้ไข code — แก้ findings → `/deep-review-then-fix`

- merged from: `review-platform` — platform dimensions refs `references/platform-*.md`
- merged from: `report-review` — report structure, executive summary, severity/status symbols รวมอยู่ใน Step 8
- subagent: `subagents/domain-reviewer.md` — รัน review ทีละ domain แบบขนาน
- dispatch catalog: `references/review-skills.md` — `review-*` ครบทุกตัวยกเว้น `review-github-pr` + `deep-*` ผ่าน `/follow-deep` แบ่ง phase ต่อ workspace

## Execute

### 0. Manual Pre-Pass

> Goal: ตรวจสุขภาพ repo ด้วยตาและมือก่อนเชื่อ analyzer — ถ้าเจอ issue ของ CLI/analyzer ให้บันทึกลง `## Known Issues` ของ `update-review-cli` และ `run-review`

1. `git status` + `git diff --stat` — ดู uncommitted changes, ไฟล์ใหญ่ผิดปกติ, generated files ที่หลุดเข้ามา
2. สุ่มอ่าน 2-3 ไฟล์ที่ใหญ่สุดหรือเปลี่ยนล่าสุด — เช็คว่า analyzer น่าจะเห็นอะไร (ประกอบการตีความผล)
3. ตรวจ `reports/review-report.json` เดิม: timestamp ต้องใหม่กว่าไฟล์ source ล่าสุด ไม่งั้น report stale — รัน formatter (`biome check --write`) ก่อนเสมอเพราะ analyzer อ่าน live fs ระหว่างรัน
4. ถ้าเจอพฤติกรรม CLI/analyzer ผิดปกติ (stale scan, false positive, crash ใต้ load) → เขียน issue + evidence + workaround ลง section `## Known Issues` ใน `update-review-cli/SKILL.md` และ `run-review/SKILL.md` ก่อนดำเนินการต่อ

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
2. ถ้าไม่มี → ทำ `/update-review-cli` เพื่อสร้าง CLI ก่อน
3. รัน `bun --filter tools-review-codebase lint` และ `typecheck`
4. รัน `bun --filter tools-review-codebase review-codebase --help` เพื่อยืนยันว่า CLI ใช้งานได้
5. ถ้า CLI ติดตั้ง/รันไม่ได้ → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 3. Run Comprehensive Review

> Goal: รัน review CLI ครั้งเดียว ได้ JSON กลางให้ทุก domain ใช้ร่วม — ห้ามรันซ้ำต่อ domain

1. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อได้ `reports/review-report.json` เป็น single source of truth — ถ้า mode `--diff` ให้ส่ง scope flag ที่ CLI รองรับ (เช่น `--changed`, `--paths`) หรือกรอง findings ทีหลังด้วยรายชื่อไฟล์จาก `git diff --name-only`
2. รัน table output เฉพาะเมื่อต้องดูด้วยตา: `bun --filter tools-review-codebase review-codebase` — ตารางมี domain summary + per-category sub-list (priority, reason, risk, fix skill, evidence items) + status new/existing + delta เทียบ baseline
3. เก็บ score, grade, domain breakdown, findings count, analyzerErrors, falsePositiveRate, hasBaseline, fixedFindings
4. ถ้า CLI crash → กลับไป Step 2
5. iterate เฉพาะส่วนที่ fail ด้วย `--domain <name>` และ `--severity <min>` — ไม่ต้อง full scan ทุกครั้ง

### 4. Validate Output Metrics

> Goal: ตรวจสอบความครบถ้วนของผลลัพธ์ก่อน dispatch — subagent ที่ parse JSON พังคือ token ที่เสียฟรี

1. ตรวจว่า categories ≥ 60 ตาม 5 domains ของ review CLI (spec ใน `/update-review-cli`)
2. ตรวจว่า `score` / `grade` ถูกสร้างครบ
3. ตรวจ schema: top-level keys ต้องมี `score`, `grade`, `domains`, `findings`, `analyzerErrors`, `falsePositiveRate`, `generatedAt` — ขาด key ใด → JSON ผิด spec → flag เป็น analyzer issue ไป `/update-review-cli` ก่อน dispatch ใดๆ
4. ตรวจว่า findings มี `severity`, `evidence`, `recommendation`, `priority`, `fixSkill`, `risk`, `status` ครบ
5. ถ้า `falsePositiveRate > 20%` หรือ `analyzerErrors > 0` → ส่งต่อ `/update-review-cli` ก่อนวิเคราะห์
6. cross-check ด้วยมือ: evidence ของ finding ใดๆ ต้องตรงกับไฟล์จริง (อ่าน file:line ที่อ้าง) — ถ้าไม่ตรง → false positive → บันทึกลง Known Issues ของ `update-review-cli`/`run-review`

### 5. Slice Findings And Dispatch Domain Analysis

> Goal: แบ่ง JSON เป็น slice ต่อ domain แล้ว spawn subagent ขนาน — subagent อ่านไฟล์เล็ก ไม่ใช่ report ทั้งก้อน

1. อ่าน `references/review-checklist.md`
2. ทำ `/use-scripts` เขียน slice ลง `reports/.deep-review-<time>/findings-<domain>.json` — ไฟล์ละ domain เดียว เท่านั้น (deterministic, ไม่ต้อง parse ใน context ของ parent)
3. ทำ `/use-subagents` spawn `deep-review-domain-reviewer` (ดู `subagents/domain-reviewer.md`) ต่อ domain ที่มี findings จริง — ส่ง `domain`, `workspace-path`, `findings-json` = path ของ slice file, `references` ที่ตรง domain
4. subagent อ่าน findings จาก slice file โดยตรง — ห้ามรัน CLI ซ้ำ (full scan แพง) ยกเว้น domain-specific check ที่ CLI รองรับ
5. domain reference mapping:
   - `clean-architecture.md` สำหรับ architecture issues
   - `analyzers.md` สำหรับ analyzer gaps
   - `issue-detection.md` สำหรับ bug-prone patterns
   - `package-scripts.md` สำหรับ CLI/package issues
   - `scoring.md` สำหรับ scoring/severity ที่ไม่ชัด
6. ถ้า domain มี findings ≤ 2 → parent วิเคราะห์เอง ไม่ต้อง spawn (subagent overhead ไม่คุ้ม)
7. subagent timeout/crash/parse ผิด output contract → mark `failed` ใน ledger และเขียน domain นั้นเป็น `review-failed` พร้อม error ลง report — ห้ามเงียบ (domain ที่หายไปดูเหมือน clean)
8. รวมผลลัพธ์จากทุก subagent — บันทึก gaps แต่ละ domain พร้อม evidence

### 6. Dispatch Review-* Per Workspace

> Goal: review ครบทุก `review-*` (ยกเว้น `review-github-pr`) ทีละ workspace ตามความสำคัญ ภายใต้ budget ของ Step 1

1. ถ้า monorepo → ทำ `/list-workspaces` แล้วเรียง workspace ตามความสำคัญ: user-facing apps → shared packages → tools/infra — ทำ `/follow-monorepo` ตาม conventions; ถ้า workspaces > budget → เลือก top-N และ mark ที่เหลือ `skipped (budget)` ใน ledger
2. ต่อ workspace → รัน pipeline ใน `references/review-skills.md` ตามลำดับ phase:
   - Phase 1 entry: `/review-config` → `/review-techstack` → `/review-architecture` → ที่เหลือตาม condition
   - Phase 2 source code: `/review-quality`, `/review-writing`, `/review-cli`/`/review-api`/`/review-backend`/`/review-frontend` ฯลฯ ตาม workspace type
   - Phase 3 cross-cutting: `/review-security`, `/review-performance`, `/review-stability` และ metrics อื่นครบ
   - Phase 4 meta: `/review-gaps`, `/review-by-stakeholder` ตามต้องการ
   - Phase 5 deep: ทำ `/follow-deep` ต่อ workspace เมื่อ `--deep` หรือ workspace นั้นมี Critical/High findings — `deep-*` ทุกตัวที่ตรง context (`deep-analyze`, `deep-trace`, `deep-test`, `deep-build`, `deep-optimize`, `deep-impact`, `deep-research`, `deep-validate`, `deep-debug`, `deep-retro`, `deep-thinking`, `deep-plan`)
3. ทำ `/use-subagents` หรือ `/follow-parallel` รัน independent reviews ขนาน ≤10 ต่อ batch — ส่ง `workspace-path`, `report-json`, review skill ที่ต้องรัน
4. ห้ามข้าม domain เพราะ "ไม่น่าจะมีปัญหา" — skip ได้เฉพาะ condition N/A ชัดเจน (เช่น `review-mobile` ใน CLI workspace) หรือ budget — ทุก skip ต้องอยู่ใน ledger พร้อมเหตุ
5. ถ้า scope ใหญ่หรือไม่ชัด → platform dimensions ผ่าน `references/platform-*.md` (merged from: review-platform)
6. ใช้ `fixSkill` field ในแต่ละ finding เป็น canonical owner — ไม่ต้อง map ซ้ำเอง
7. metric/finding ใดที่ analyzer ไม่ครอบคลุม → ระบุ `ใน update-review-cli = N` เป็น analyzer gap ส่งต่อ `/update-review-cli`
8. ทุก dispatch อัปเดต ledger — skill ที่เสร็จแล้วใน ledger เก่า (resume) ให้ reuse ผลเดิม ไม่รันซ้ำ

### 7. Dedup And Stakeholder Prioritization

> Goal: findings ซ้ำจากหลายแหล่งรวมเป็นชุดเดียว แล้วจัดลำดับตาม impact

1. dedup findings ระหว่าง CLI report กับ review-* outputs — key = `file + rule/message-normalized + domain`; finding ที่ match ให้ merge (เก็บ evidence รวม + severity สูงสุด + fixSkill ที่เจาะจงกว่า) ไม่ใช่แสดง 2 แถว
2. รวม findings จากทุก domain — เรียงตาม `priority` field ของ report เป็นหลัก (severity → weakest domain)
3. ถ้าต้องการมุมมอง engineer/QA → `/review-by-stakeholder staff-engineer` หรือ `qa-tester`
4. ถ้าต้องการมุมมอง product/user → `/review-by-stakeholder product-manager` หรือ `user`
5. ระบุ clear owner skill สำหรับแต่ละ action จาก `fixSkill`

### 8. Report To .devin/Reports

> Goal: รายงานผล review ลง `.devin/reports/<workspace>/` (report only) ด้วยโครงที่อ่านแล้ว fix ได้ทันที และ verify ว่าครอบคลุมจริง

1. ทำ `/report` สรุป score, findings, owner skill, priority
2. ทำ `/create-report-in-dot-devin` ด้วย title `deep-review` — โครง report (merged from: report-review):
   - `## Executive Summary` — overall score (0-100), grade, สรุป findings ตาม severity (Critical/High/Medium/Low) และตาม domain, confidence level, critical issues ที่ต้องแก้ก่อน production, mode (full/diff) + scope ที่รัน
   - `## Result` — ตาราง score/grade/findings count เทียบ before-after ต่อ workspace (No. column แรกเสมอ)
   - `## Coverage` — matrix จาก ledger: แถว = workspace, คอลัมน์ = phase/skill group, cell = done/skipped(reason)/failed — ทำให้ "ครบทุกตัว" ตรวจสอบได้ ไม่ใช่เชื่อคำพูด
   - section ต่อ `review-*` domain — header ชื่อ review skill + domain score/grade
   - ต่อ finding ตารางคอลัมน์: `No.`, `หลักฐาน` (file:line หรือ evidence items — บังคับทุก row), `เหตุผล` (message — rule ที่พัง), `ความเสี่ยง` (risk field), `ลำดับความสำคัญ` (priority + status new/existing/fixed), `fix skill` (fixSkill field), `ใน update-review-cli` (`Y` = analyzer ครอบคลุมแล้ว / `N` = analyzer gap → ส่งต่อ `/update-review-cli`)
   - severity symbols: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low — status symbols: ✅ แก้แล้ว, ❌ ยังไม่แก้, 🔄 กำลังแก้, ⏭️ ข้าม
   - `## Fix Status` — ตาราง Issue, Dimension, Severity, Status, Fix Applied
   - `## Recommendations` — จัดลำดับตาม impact/effort แยก quick wins กับ strategic fixes
   - `## Residual notes` — analyzer false positives ที่ยอมรับ, infra flakes, warnings ที่ไม่ block, domains ที่ `review-failed`/`skipped (budget)` พร้อมวิธี resume
3. ถ้า run ขาดกลางคัน → เขียน partial report ทันทีด้วย coverage matrix เท่าที่มี — ห้ามเสียงานทั้งหมดเพราะ report ไม่ครบ
4. บันทึก action items เป็น `TODO` หรือ plan
5. ถ้า CLI รองรับ → save baseline snapshot (`review-report.json` เป็น baseline ถัดไป) เพื่อให้ delta/new-vs-fixed ทำงานใน run ถัดไป
6. verify หลังเขียน: report ไฟล์มีอยู่จริง + ทุก required section ครบ + ทุก row มีหลักฐาน — ขาด → แก้ report ก่อนจบ
7. ทำ `/suggest-next-action` โดยแนะนำ section `## Fix` ของ `review-*` ที่ตรง domain หรือ `/deep-review-then-fix`

## Rules

### 1. No Duplication

- ไม่ซ้ำกับ `/run-review` — `run-review` เน้น "รันแล้วบอกผล" ส่วน `deep-review` เน้น "manual pre-pass + รันครั้งเดียว + subagent วิเคราะห์ขนาน + จัดลำดับ + report ลง `.devin/reports/<workspace>/`"
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

- dispatch `review-*` ครบทุกตัวต่อ workspace ตาม `references/review-skills.md` ยกเว้น `/review-github-pr` — ภายใต้ budget
- dispatch `deep-*` ผ่าน `/follow-deep` เมื่อ `--deep` หรือมี Critical/High findings
- skip domain ได้เฉพาะ condition N/A ชัดเจนหรือ budget — ต้องระบุเหตุใน ledger และ report `## Coverage`
- metric ที่ `ใน update-review-cli = N` → บันทึก analyzer gap ส่ง `/update-review-cli` และอ้างใน `run-review`

### 6. Loop Limit

- ถ้า CLI รันไม่ผ่าน วนกลับไป `/update-review-cli` สูงสุด 3 รอบ
- subagent ต่อ domain retry ได้สูงสุด 1 ครั้ง — รอบสอง fail → `review-failed` แล้วข้ามไป domain อื่น (อย่าติด loop บน domain เดียว)
- ถ้า `score < 70` หรือ `grade D/F` หลัง 3 รอบ → stop และ report

### 7. Issue Logging

- เจอปัญหาของ CLI/analyzer (crash, false positive, stale scan, output ผิด spec, schema ขาด key) → เขียนลง `## Known Issues` ของ `update-review-cli/SKILL.md` และ `run-review/SKILL.md` พร้อม evidence + workaround + สถานะ (open/fixed) — ถ้า section `## Known Issues` ไม่มี → สร้างก่อนเขียน
- ถ้า issue แก้แล้วใน session เดียวกัน → mark `fixed` พร้อม commit/ไฟล์ที่แก้

### 8. Safety

- ไม่แก้ business logic โดยตรงจาก skill นี้
- ไม่เพิ่ม dependencies ใหม่นอกเหนือจาก CLI workspace
- ถ้า `tools/review-codebase` ติดตั้งไม่ได้ → หยุดและแจ้ง user
- ledger/slice files เขียนใต้ `reports/` เท่านั้น — ห้ามเขียน temp นอก repo

## Expected Outcome

- `tools/review-codebase` CLI รันได้และ produce `reports/review-report.json` (full หรือ diff-scoped ตาม mode)
- Review ครอบคลุม 5 domains, 60+ categories, `review-*` ทุกตัว (ยกเว้น `review-github-pr`) และ `deep-*` ผ่าน `/follow-deep` ภายใต้ budget — coverage ตรวจได้จาก ledger + `## Coverage` matrix
- Findings มี priority, risk, fixSkill, status (new/existing/fixed), dedup แล้ว และ delta เทียบ baseline
- ทุก high-priority finding ถูก route ไปยัง review/deep-review-then-fix skill ที่เหมาะสม
- รายงานสรุปพร้อม Executive Summary, Result, Coverage matrix, per-domain sections, per-finding `หลักฐาน`/`เหตุผล`/`ความเสี่ยง`/`ลำดับความสำคัญ`/`fix skill`/`ใน update-review-cli`, Fix Status, Recommendations — verify ครบ section ก่อนจบ
- session ขาดกลางคัน → resume จาก ledger ได้โดยไม่รันงานซ้ำ; baseline ถูก save สำหรับ run ถัดไป
- analyzer gaps (`ใน update-review-cli = N`) และ analyzer/CLI issues ถูกบันทึกลง Known Issues ของ `update-review-cli` และ `run-review`
