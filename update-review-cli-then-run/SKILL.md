---
name: update-review-cli-then-run
description: สร้าง/อัปเดต tools/review-codebase CLI แล้วรัน review จนผ่าน metrics หรือครบ 3 รอบ
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - deep-review
  - review-dot-devin
  - update-create-analyze-cli
  - check-should-update
  - scan-codebase
  - new-skills
  - resolve-errors
  - run-verify
  - follow-tasks
  - report
  - run-test
  - use-astgrep-programmatic
  - suggest-next-action
---

## Goal

Canonical engine: linter CLI (Rust, `D:\newkub\wpackages\rust-packages\packages\tools\linter`) — deterministic checks ผลิต `review-report.json` schema เดิม; skill นี้ extends โดยเพิ่ม YAML rule packs (`rules/<lang|frameworks|deps>/`) หรือ analyzer modules แทนแก้ TS CLI เก่า

สร้างหรืออัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ปัจจุบัน แล้วรัน review เพื่อวัด metrics ครบทุกมิติ จนผ่านหรือครบ 3 รอบ — รวม workflow ของ `run-review` (รัน → วิเคราะห์ → fix CLI → rerun → verify → suggest) ไว้ใน skill เดียว

## Scope

ใช้กับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI ที่ project root ครอบคลุม 60+ categories ตาม 5 domains — ครอบทั้ง update path (Steps 1-6) และ run path (Steps 7-10); `/run-review` เป็น alias ของ skill นี้

## Execute

> Pre-Run: ทำ `/review-dot-devin` ก่อนเสมอ — `run-*` ต้อง review/ประเมินก่อนลงมือหลัก ห้ามข้าม; ถ้า findings เป็น blocker ให้แก้หรือ report ก่อนรัน

### 1. Prepare And Keep Up With Codebase

> Goal: อัปเดต rules, skills และ CLI ให้ทันสมัยก่อนรัน review

1. ทำ `/scan-codebase` ใน `tools/review-codebase/` ถ้ามีอยู่
2. ทำ `/new-skills` เพื่อสร้าง skills ที่ขาดจาก dependencies และ features
3. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze` ให้ครอบคลุม features ปัจจุบัน
4. ทำ `/check-should-update` โดยระบุ target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. ถ้าผลเป็น `skip` → ไป Step 7
6. ถ้าผลเป็น `update` หรือ `create` → ดำเนินขั้นตอนถัดไป
7. อ่าน `AGENTS.md`, `.devin/rules.md`, `tools/review-codebase/README.md` ถ้ามี
8. ถ้า `tools/review-codebase` มีอยู่ → ทำ pre-review ตาม `references/review-checklist.md` ตรวจ Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count และ evidence
9. ถ้า pre-review score < 70 → ทำ Step 2-6 ก่อน Step 7

### 2. Scan Codebase Features

> Goal: เข้าใจ features ที่มีใน codebase

1. ทำ `/scan-codebase` เพื่อดู structure, tech stack, packages
2. ทำ `/deep-analyze` เพื่อดู features หลัก
3. อ่าน `AGENTS.md` และ `docs/project/features.md` ถ้ามี
4. ระบุ features ใหม่ที่ยังไม่มี analyzer ครอบคลุม

### 3. Update Project Rules

> Goal: มั่นใจว่า skills/rules ครอบคลุม dependencies และ features

1. ทำ `/new-skills` เพื่อสร้าง skills ที่ขาดจาก dependencies
2. ตรวจ `AGENTS.md` และ `.devin/rules` อัปเดตตาม features ใหม่
3. ถ้ามี skill หรือ rule ขาด → สร้างหรืออัปเดต

### 4. Update Analyze CLI

> Goal: เพิ่ม/อัปเดต analyzers ตาม features ใหม่

1. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze`
2. ตรวจ categories ครอบคลุม features ทั้งหมด
3. ถ้า categories น้อยกว่า 60 หรือ feature ใหม่ไม่มี analyzer → เพิ่ม analyzer

### 5. Create Or Update Workspace Package

> Goal: มี workspace `tools-review-codebase` พร้อมใช้

1. สร้าง `tools/review-codebase/` ถ้ายังไม่มี
2. เขียน `package.json` กำหนด name, scripts `review-codebase`, `review-codebase:json`, `lint`, `typecheck`
3. เขียน `tsconfig.json`, `biome.jsonc`, `README.md`
4. เพิ่ม `tools-review-codebase` เข้า root `package.json` workspaces ถ้ายังไม่มี
5. ใช้ `bun install` เพื่ออัปเดต `bun.lock`

### 6. Setup Architecture And Integrate Analyzers

> Goal: Clean Architecture พร้อม analyzers จาก `tools-analyze` โดยไม่ duplicate logic

1. สร้าง `src/adapters/file-utils.ts` (`walk`, `readText`, `getRel`), `src/adapters/git-grep.ts` (`gitGrep`, `gitGrepCount`), `src/domain/models.ts` (`CategoryFinding`, `CategoryResult`, `ReviewReport`), `src/application/review.ts` (import `runAllAnalyzers` จาก `tools-analyze`), `src/presentation/cli.ts` (entry point), `src/index.ts` (export `runReview`/`createReviewPorts`)
2. แปลง `CategoryResult` ของแต่ละ analyzer เป็น `ReviewReport` พร้อม score, grade, domain breakdown
3. กำหนด `reviewWorkflow` map ไปยัง review skills — ต้องครอบคลุม `review-*` ทุกตัวใน `review/references/review-skills.md` (54 ตัว ยกเว้น `review-github-pr` ที่เป็น PR-scoped)
4. metric หรือ review domain ใดที่ยังไม่มี analyzer → บันทึกเป็น analyzer gap (name + review skill + metric ที่ขาด) ใน `references/known-issues.md` และ report
5. ถ้า analyzer ยัง implement ไม่เสร็จ ให้ comment `// TODO` พร้อมรายละเอียด
6. ถ้าต้องเพิ่ม AST-based analyzer (structural patterns ที่ regex/git-grep ทำไม่ได้ เช่น function metrics, SRP counts, custom lint rules) → ทำ `/use-astgrep-programmatic` เพื่อ integrate `@ast-grep/napi` หรือ `ast-grep scan --json` เข้า `tools/analyze`/`tools/review-codebase` — findings ต้องมี file:line + rule id ตาม ### 4. Evidence-Based

### 7. Validate CLI

> Goal: ตรวจสอบว่า CLI รันได้

1. ตรวจ `tools/review-codebase/package.json` และ `src/presentation/cli.ts` มีอยู่ — ไม่มี → กลับ Step 5-6
2. รัน `bun --filter tools-review-codebase lint`
3. รัน `bun --filter tools-review-codebase typecheck`
4. รัน `bun --filter tools-review-codebase review-codebase --help`
5. รัน `bun --filter tools-review-codebase review-codebase`
6. รัน `bun --filter tools-review-codebase review-codebase:json` แล้วตรวจสอบ `<workspace>/reports/review-report.json`
7. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 8. Run Review And Analyze

> Goal: รัน review CLI แล้ววิเคราะห์ผลเพื่อตัดสินใจอัปเดตตาม metrics

1. รัน `bun --filter tools-review-codebase review-codebase` สำหรับ table output
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อเขียน `reports/review-report.json` ภายใน workspace ที่ถูก review (เช่น `apps/website/reports/review-report.json`) — ห้ามเขียนลง root `reports/`
3. stdout mode: `bun --filter tools-review-codebase review-codebase:json -- --out-file -`; custom path: `--out-file <path>`
4. บันทึก score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
5. ระบุ findings Critical/High → จัดกลุ่มตาม `reviewWorkflow` map ไปยัง `/review-*` ที่เหมาะสม (coverage ครบตาม `review/references/review-skills.md`)
6. metric/finding ใดไม่มี analyzer ครอบคลุม → mark `ใน update-review-cli-then-run = N` เป็น analyzer gap
7. ถ้าผลตรง Metric Triggers ใด → ทำ `/update-create-analyze-cli` แล้วทำ Step 4-7 กลับมารัน Step 8 ใหม่ (ไม่เกิน 3 รอบ):
   - `categories` น้อยกว่า 60
   - overall `score` ต่ำกว่า 70 หรือ `grade` เป็น `D`/`F`
   - domain ใด `score` ต่ำกว่า 50
   - `analyzerErrors` > 0 → ทำ `/resolve-errors` ก่อน
   - `falsePositiveRate` สูงกว่า 20%
   - findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
   - `reviewWorkflow` ไม่ map ไปยัง review skills ที่มีอยู่ หรือไม่ครบ `review/references/review-skills.md`
   - มี analyzer gap — review domain/metric ที่ CLI ไม่ครอบคลุม
8. ถ้าหลัง 3 รอบยังไม่ผ่าน → stop และ report

### 9. Verify And Follow Tasks

> Goal: ยืนยันว่า project ผ่าน verify แล้วติดตาม action ถัดไป

1. ทำ `/run-verify` เพื่อ verify build, lint, typecheck
2. ทำ `/follow-tasks` เพื่อรับ action items และ track progress
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` แล้วกลับไป Step 8 อีกครั้ง

### 10. Report And Suggest Actions

> Goal: สรุปผล review และแนะนำ action ถัดไปตาม findings

1. แสดง table output จาก Step 8 (run ใหม่ได้เฉพาะเมื่อต้อง refresh — full scan แพง)
2. ใช้ `/report` แสดง summary: domain scores, findings (Category, Finding, Severity, Location, Recommendation), recommended workflows
3. แนะนำ `/review-*` workflows สำหรับแต่ละ finding ตาม `reviewWorkflow` field — dispatch catalog: `review/references/review-skills.md`
4. ทำ `/suggest-next-action`

## CLI Output

Table output spec อยู่ใน [references/cli-output.md](references/cli-output.md) — findings table, domain summary, output requirements, exit codes, filter flags

## Rules

### 1. CLI-Driven

- ใช้ `tools/review-codebase` CLI เป็นแหล่งหลักของ findings
- ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ต้องทำ Step 4-7 ก่อนรีวิวต่อ

### 2. Metric Triggers

- `categories < 60` → เพิ่ม analyzers
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers
- `domain score < 50` → ปรับปรุง domain นั้น
- `analyzerErrors > 0` → แก้ไข analyzer errors
- `falsePositiveRate > 20%` → tune rules

### 3. No Duplicate Logic

- ไม่ duplicate analyzer logic ระหว่าง `tools/analyze` และ `tools/review-codebase`
- ใช้ `runAllAnalyzers` จาก `tools/analyze` ใน `tools/review-codebase`

### 4. Evidence-Based

- ทุก finding ต้องมี evidence (file path, line number, code snippet)
- ไม่เดา ใช้ tools สำหรับ verification
- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low

### 4b. Review Coverage

- `reviewWorkflow` map ต้องครอบคลุม `review-*` ทุกตัวใน `review/references/review-skills.md` ยกเว้น `review-github-pr`
- ทุก metric ที่ `deep-review`/skill นี้ mark ว่า `ใน update-review-cli-then-run = N` → เพิ่ม analyzer หรือบันทึก gap พร้อมเหตุผลใน `references/known-issues.md`
- deep-review dispatch `review-*` ทีละ workspace ตาม phase (entry → source → cross-cutting → meta) — CLI ต้อง output findings ที่ map กลับไปหา review skill เหล่านั้นได้

### 5. Report Location

- Report ต้องถูกเขียนลงใน workspace ที่ถูก review เท่านั้น เช่น `<workspace>/reports/review-report.json`
- ห้ามสร้างหรือเขียนลง root-level `reports/` directory
- ถ้า review หลาย workspaces → แต่ละ workspace มี report ของตัวเอง

### 6. Review Independence

- ทำ review/deep-review-then-fix CLI เท่านั้น ไม่แก้ไข business logic
- แยก review process จาก fix process
- ใช้ `/deep-review` หรือ skill นี้ (run path) สำหรับ comprehensive quality gate

### 7. Output Interpretation

- Review score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: pass, warn, fail; severity order: Critical > High > Medium > Low
- จัดลำดับ action items ตาม severity — Critical ก่อนเสมอ
- CLI error/package missing/crash → ทำ Steps 4-7 ของ skill นี้; analyzer ให้ผลผิด → `/update-create-analyze-cli` ก่อน

### 8. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
- ใช้ `/deep-test` cli ถ้าจำเป็น, `/run-test` ถ้าจำเป็น

## Expected Outcome

- `tools/review-codebase` CLI มีอยู่และรันได้ที่ project root
- Review ทำงานผ่าน `bun run review-codebase`
- Findings ครอบคลุม 60+ categories พร้อม evidence และ severity
- `reviewWorkflow` ครอบคลุม `review-*` ทุกตัวใน `review/references/review-skills.md` — analyzer gaps ถูกบันทึกใน `references/known-issues.md`
- Before-after review score แสดงผ่าน table output
- ไม่มี analyzer errors
- ตาราง summary พร้อม top findings + recommended `/review-*` workflows ต่อปัญหา

## Known Issues

Known Issues (issue + evidence + status ทั้งหมด) อยู่ใน [references/known-issues.md](references/known-issues.md) — single source of truth
