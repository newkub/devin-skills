---
name: deep-review
description: รัน review-* ครบทุก domain แล้วรายงานผลลง `.devin/reports/<workspace>/` (report only)
argument-hint: "[path-or-target]"
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
  - review
  - review-gaps
  - review-by-stakeholder
  - report
  - suggest-next-action
---

## Goal

ใช้ `tools/review-codebase` CLI รัน review แบบครอบคลุมทุกมิติของ codebase แล้ววิเคราะห์ผล จัดลำดับ findings และส่งต่อไปยัง review/deep-review-then-fix ที่เหมาะสม — ลึกที่สุดด้วย token น้อยและเวลาสั้นสุด

## Scope

ใช้เมื่อต้องการ review ครบทุก dimension ของ codebase (architecture, quality, security, performance, delivery, UX/DX) ผ่าน `tools/review-codebase` CLI ที่ project root โดยไม่ซ้ำกับ `/run-review` ที่เน้นการรัน CLI และแปลผลสั้นๆ

ผลลัพธ์รายงานลง `.devin/reports/<workspace>/deep-review-<time>.md` ผ่าน `/create-report-in-dot-devin` โดยแยก section ตาม `review-*` แต่ละ domain — report เท่านั้น ไม่แก้ไข code — แก้ findings → `/deep-review-then-fix`

- merged from: `review-platform` — platform dimensions refs `references/platform-*.md`
- merged from: `report-review` — report structure, executive summary, severity/status symbols รวมอยู่ใน Step 7
- subagent: `subagents/domain-reviewer.md` — รัน review ทีละ domain แบบขนาน
- dispatch catalog: `references/review-skills.md` — `review-*` ครบทุกตัวยกเว้น `review-github-pr` + `deep-*` ผ่าน `/follow-deep` แบ่ง phase ต่อ workspace

## Execute

### 0. Manual Pre-Pass

> Goal: ตรวจสุขภาพ repo ด้วยตาและมือก่อนเชื่อ analyzer — ถ้าเจอ issue ของ CLI/analyzer ให้บันทึกลง `## Known Issues` ของ `update-review-cli` และ `run-review`

1. `git status` + `git diff --stat` — ดู uncommitted changes, ไฟล์ใหญ่ผิดปกติ, generated files ที่หลุดเข้ามา
2. สุ่มอ่าน 2-3 ไฟล์ที่ใหญ่สุดหรือเปลี่ยนล่าสุด — เช็คว่า analyzer น่าจะเห็นอะไร (ประกอบการตีความผล)
3. ตรวจ `reports/review-report.json` เดิม: timestamp ต้องใหม่กว่าไฟล์ source ล่าสุด ไม่งั้น report stale — รัน formatter (`biome check --write`) ก่อนเสมอเพราะ analyzer อ่าน live fs ระหว่างรัน
4. ถ้าเจอพฤติกรรม CLI/analyzer ผิดปกติ (stale scan, false positive, crash ใต้ load) → เขียน issue + evidence + workaround ลง section `## Known Issues` ใน `update-review-cli/SKILL.md` และ `run-review/SKILL.md` ก่อนดำเนินการต่อ

### 1. Prepare And Verify CLI

> Goal: ตรวจสอบให้ `tools/review-codebase` พร้อมรัน

1. ตรวจสอบว่า `tools/review-codebase/package.json` และ entry point มีอยู่
2. ถ้าไม่มี → ทำ `/update-review-cli` เพื่อสร้าง CLI ก่อน
3. รัน `bun --filter tools-review-codebase lint` และ `typecheck`
4. รัน `bun --filter tools-review-codebase review-codebase --help` เพื่อยืนยันว่า CLI ใช้งานได้
5. ถ้า CLI ติดตั้ง/รันไม่ได้ → ทำ `/resolve-errors` แล้ว retry สูงสุด 3 ครั้ง

### 2. Run Comprehensive Review

> Goal: รัน review CLI ครั้งเดียว ได้ JSON กลางให้ทุก domain ใช้ร่วม — ห้ามรันซ้ำต่อ domain

1. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อได้ `reports/review-report.json` เป็น single source of truth
2. รัน table output เฉพาะเมื่อต้องดูด้วยตา: `bun --filter tools-review-codebase review-codebase` — ตารางมี domain summary + per-category sub-list (priority, reason, risk, fix skill, evidence items) + status new/existing + delta เทียบ baseline
3. เก็บ score, grade, domain breakdown, findings count, analyzerErrors, falsePositiveRate, hasBaseline, fixedFindings
4. ถ้า CLI crash → กลับไป Step 1
5. iterate เฉพาะส่วนที่ fail ด้วย `--domain <name>` และ `--severity <min>` — ไม่ต้อง full scan ทุกครั้ง

### 3. Validate Output Metrics

> Goal: ตรวจสอบความครบถ้วนของผลลัพธ์

1. ตรวจว่า categories ≥ 60 ตาม 5 domains ของ review CLI (spec ใน `/update-review-cli`)
2. ตรวจว่า `score` / `grade` ถูกสร้างครบ
3. ตรวจว่า findings มี `severity`, `evidence`, `recommendation`, `priority`, `fixSkill`, `risk`, `status` ครบ
4. ถ้า `falsePositiveRate > 20%` หรือ `analyzerErrors > 0` → ส่งต่อ `/update-review-cli` ก่อนวิเคราะห์
5. cross-check ด้วยมือ: evidence ของ finding ใดๆ ต้องตรงกับไฟล์จริง (อ่าน file:line ที่อ้าง) — ถ้าไม่ตรง → false positive → บันทึกลง Known Issues ของ `update-review-cli`/`run-review`

### 4. Analyze By Domain (Subagent Dispatch)

> Goal: วิเคราะห์ findings ตาม domain reference แบบขนานด้วย subagents — ประหยัด context ของ parent

1. อ่าน `references/review-checklist.md`
2. แบ่ง findings ตาม 5 domains ของ review CLI
3. ทำ `/use-subagents` spawn `deep-review-domain-reviewer` (ดู `subagents/domain-reviewer.md`) ต่อ domain ที่มี findings จริง — ส่ง `domain`, `workspace-path`, `report-json` = path ของ `reports/review-report.json`, `references` ที่ตรง domain
4. subagent อ่าน findings จาก JSON โดยตรง — ห้ามรัน CLI ซ้ำ (full scan แพง) ยกเว้น domain-specific check ที่ CLI รองรับ
5. domain reference mapping:
   - `clean-architecture.md` สำหรับ architecture issues
   - `analyzers.md` สำหรับ analyzer gaps
   - `issue-detection.md` สำหรับ bug-prone patterns
   - `package-scripts.md` สำหรับ CLI/package issues
   - `scoring.md` สำหรับ scoring/severity ที่ไม่ชัด
6. ถ้า domain มี findings ≤ 2 → parent วิเคราะห์เอง ไม่ต้อง spawn (subagent overhead ไม่คุ้ม)
7. รวมผลลัพธ์จากทุก subagent — บันทึก gaps แต่ละ domain พร้อม evidence

### 5. Dispatch Review-* Per Workspace

> Goal: review ครบทุก `review-*` (ยกเว้น `review-github-pr`) ทีละ workspace ตามความสำคัญ

1. ถ้า monorepo → ทำ `/list-workspaces` แล้วเรียง workspace ตามความสำคัญ: user-facing apps → shared packages → tools/infra — ทำ `/follow-monorepo` ตาม conventions
2. ต่อ workspace → รัน pipeline ใน `references/review-skills.md` ตามลำดับ phase:
   - Phase 1 entry: `/review-config` → `/review-techstack` → `/review-architecture` → ที่เหลือตาม condition
   - Phase 2 source code: `/review-quality`, `/review-writing`, `/review-cli`/`/review-api`/`/review-backend`/`/review-frontend` ฯลฯ ตาม workspace type
   - Phase 3 cross-cutting: `/review-security`, `/review-performance`, `/review-stability` และ metrics อื่นครบ
   - Phase 4 meta: `/review-gaps`, `/review-by-stakeholder` ตามต้องการ
   - Phase 5 deep: ทำ `/follow-deep` ต่อ workspace เพื่อครอบคลุม `deep-*` ทุกตัวที่ตรง context (`deep-analyze`, `deep-trace`, `deep-test`, `deep-build`, `deep-optimize`, `deep-impact`, `deep-research`, `deep-validate`, `deep-debug`, `deep-retro`, `deep-thinking`, `deep-plan`)
3. ทำ `/use-subagents` หรือ `/follow-parallel` รัน independent reviews ขนาน ≤10 ต่อ batch — ส่ง `workspace-path`, `report-json`, review skill ที่ต้องรัน
4. ห้ามข้าม domain เพราะ "ไม่น่าจะมีปัญหา" — skip ได้เฉพาะ condition N/A ชัดเจน (เช่น `review-mobile` ใน CLI workspace)
5. ถ้า scope ใหญ่หรือไม่ชัด → platform dimensions ผ่าน `references/platform-*.md` (merged from: review-platform)
6. ใช้ `fixSkill` field ในแต่ละ finding เป็น canonical owner — ไม่ต้อง map ซ้ำเอง
7. metric/finding ใดที่ analyzer ไม่ครอบคลุม → ระบุ `ใน update-review-cli = N` เป็น analyzer gap ส่งต่อ `/update-review-cli`

### 6. Stakeholder Prioritization

> Goal: จัดลำดับ findings ตาม impact

1. รวม findings จากทุก domain — เรียงตาม `priority` field ของ report เป็นหลัก (severity → weakest domain)
2. ถ้าต้องการมุมมอง engineer/QA → `/review-by-stakeholder staff-engineer` หรือ `qa-tester`
3. ถ้าต้องการมุมมอง product/user → `/review-by-stakeholder product-manager` หรือ `user`
4. ระบุ clear owner skill สำหรับแต่ละ action จาก `fixSkill`

### 7. Report To .devin/Reports

> Goal: รายงานผล review ลง `.devin/reports/<workspace>/` (report only) ด้วยโครงที่อ่านแล้ว fix ได้ทันที

1. ทำ `/report` สรุป score, findings, owner skill, priority
2. ทำ `/create-report-in-dot-devin` ด้วย title `deep-review` — โครง report (merged from: report-review):
   - `## Executive Summary` — overall score (0-100), grade, สรุป findings ตาม severity (Critical/High/Medium/Low) และตาม domain, confidence level, critical issues ที่ต้องแก้ก่อน production
   - `## Result` — ตาราง score/grade/findings count เทียบ before-after ต่อ workspace (No. column แรกเสมอ)
   - section ต่อ `review-*` domain — header ชื่อ review skill + domain score/grade
   - ต่อ finding ตารางคอลัมน์: `No.`, `หลักฐาน` (file:line หรือ evidence items — บังคับทุก row), `เหตุผล` (message — rule ที่พัง), `ความเสี่ยง` (risk field), `ลำดับความสำคัญ` (priority + status new/existing/fixed), `fix skill` (fixSkill field), `ใน update-review-cli` (`Y` = analyzer ครอบคลุมแล้ว / `N` = analyzer gap → ส่งต่อ `/update-review-cli`)
   - severity symbols: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low — status symbols: ✅ แก้แล้ว, ❌ ยังไม่แก้, 🔄 กำลังแก้, ⏭️ ข้าม
   - `## Fix Status` — ตาราง Issue, Dimension, Severity, Status, Fix Applied
   - `## Recommendations` — จัดลำดับตาม impact/effort แยก quick wins กับ strategic fixes
   - `## Residual notes` — analyzer false positives ที่ยอมรับ, infra flakes, warnings ที่ไม่ block
3. บันทึก action items เป็น `TODO` หรือ plan
4. ทำ `/suggest-next-action` โดยแนะนำ section `## Fix` ของ `review-*` ที่ตรง domain หรือ `/deep-review-then-fix`

## Rules

### 1. No Duplication

- ไม่ซ้ำกับ `/run-review` — `run-review` เน้น "รันแล้วบอกผล" ส่วน `deep-review` เน้น "manual pre-pass + รันครั้งเดียว + subagent วิเคราะห์ขนาน + จัดลำดับ + report ลง `.devin/reports/<workspace>/`"
- Report only — รายงานผลลง report เท่านั้น ไม่แก้ไข code — แก้ findings → `/deep-review-then-fix` ใน skill นี้
- ถ้าผลลัพธ์สั้นและไม่ต้อง deep analysis → ใช้ `/run-review` แทน

### 2. Evidence First

- ทุก finding ต้องมี evidence จาก `review-report.json` หรือ screenshots — spot-check evidence กับไฟล์จริงอย่างน้อย 1 รายการต่อ domain ที่มี findings
- ไม่ตัดสิน severity จาก intuition อย่างเดียว
- ตรวจ `falsePositiveRate` และ `analyzerErrors` ก่อนประเมินผล

### 3. Efficiency

- รัน CLI full scan ครั้งเดียว — subagents แชร์ `reports/review-report.json` ห้ามรันซ้ำ
- subagent อ่านเฉพาะไฟล์ที่ถูก flag ใน evidence — ห้าม sweep ทั้ง codebase
- evidence items ต่อ finding สูงสุด ~8 รายการ (ตรงกับ CLI table output)
- spawn subagent เฉพาะ domain ที่ findings > 2 — น้อยกว่านั้น parent ทำเองเร็วกว่า

### 4. Coverage Dispatch

- dispatch `review-*` ครบทุกตัวต่อ workspace ตาม `references/review-skills.md` ยกเว้น `/review-github-pr`
- dispatch `deep-*` ครบผ่าน `/follow-deep` ต่อ workspace (Phase 5) — ครอบคลุมทุกอย่างที่ condition ตรง
- skip domain ได้เฉพาะ condition N/A ชัดเจน — ต้องระบุเหตุใน report
- metric ที่ `ใน update-review-cli = N` → บันทึก analyzer gap ส่ง `/update-review-cli` และอ้างใน `run-review`

### 5. Loop Limit

- ถ้า CLI รันไม่ผ่าน วนกลับไป `/update-review-cli` สูงสุด 3 รอบ
- ถ้า `score < 70` หรือ `grade D/F` หลัง 3 รอบ → stop และ report

### 6. Issue Logging

- เจอปัญหาของ CLI/analyzer (crash, false positive, stale scan, output ผิด spec) → เขียนลง `## Known Issues` ของ `update-review-cli/SKILL.md` และ `run-review/SKILL.md` พร้อม evidence + workaround + สถานะ (open/fixed)
- ถ้า issue แก้แล้วใน session เดียวกัน → mark `fixed` พร้อม commit/ไฟล์ที่แก้

### 7. Safety

- ไม่แก้ business logic โดยตรงจาก skill นี้
- ไม่เพิ่ม dependencies ใหม่นอกเหนือจาก CLI workspace
- ถ้า `tools/review-codebase` ติดตั้งไม่ได้ → หยุดและแจ้ง user

## Expected Outcome

- `tools/review-codebase` CLI รันได้และ produce `reports/review-report.json`
- Review ครอบคลุม 5 domains, 60+ categories, `review-*` ทุกตัว (ยกเว้น `review-github-pr`) และ `deep-*` ผ่าน `/follow-deep` ต่อ workspace ตาม `references/review-skills.md` ด้วย subagents ขนาน
- Findings มี priority, risk, fixSkill, status (new/existing/fixed) และ delta เทียบ baseline
- ทุก high-priority finding ถูก route ไปยัง review/deep-review-then-fix skill ที่เหมาะสม
- รายงานสรุปพร้อม Executive Summary, per-domain sections, per-finding `หลักฐาน`/`เหตุผล`/`ความเสี่ยง`/`ลำดับความสำคัญ`/`fix skill`/`ใน update-review-cli`, Fix Status, Recommendations
- analyzer gaps (`ใน update-review-cli = N`) และ analyzer/CLI issues ถูกบันทึกลง Known Issues ของ `update-review-cli` และ `run-review`
