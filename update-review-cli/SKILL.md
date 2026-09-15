---
name: update-review-cli
description: สร้างหรืออัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ปัจจุบัน แล้วรัน review จนผ่าน
argument-hint: "[target-or-iteration]"
related:
  - run-review
  - deep-review
  - update-create-analyze-cli
  - check-should-update
  - scan-codebase
  - new-skills
  - resolve-errors
  - report
  - run-test
  - use-astgrep-programmatic
---

## Goal

สร้างหรืออัปเดต `tools/review-codebase` CLI ให้ครอบคลุม features ปัจจุบัน แล้วรัน review เพื่อวัด metrics ครบทุกมิติ จนผ่านหรือครบ 3 รอบ

## Scope

ใช้กับ monorepo ที่มีหรือกำลังสร้าง `tools/review-codebase` CLI ที่ project root ครอบคลุม 60+ categories ตาม 5 domains

## Execute

### 1. Prepare And Keep Up With Codebase

> Goal: อัปเดต rules, skills และ CLI ให้ทันสมัยก่อนรัน review

1. ทำ `/scan-codebase` ใน `tools/review-codebase/` ถ้ามีอยู่
2. ทำ `/new-skills` เพื่อสร้าง skills ที่ขาดจาก dependencies และ features
3. ทำ `/update-create-analyze-cli` เพื่ออัปเดต `tools/analyze` ให้ครอบคลุม features ปัจจุบัน
4. ทำ `/check-should-update` โดยระบุ target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. ถ้าผลเป็น `skip` → ไป Step 8
6. ถ้าผลเป็น `update` หรือ `create` → ดำเนินขั้นตอนถัดไป
7. อ่าน `AGENTS.md`, `.devin/rules.md`, `tools/review-codebase/README.md` ถ้ามี
8. ถ้า `tools/review-codebase` มีอยู่ → ทำ pre-review ตาม `deep-review/references/review-checklist.md` ตรวจ Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count และ evidence
9. ถ้า pre-review score < 70 → ทำ Step 2-7 ก่อน Step 8

### 2. Scan Codebase Features

> Goal: เข้าใจ features ที่มีใน codebase

1. ทำ `/scan-codebase` เพื่อดู structure, tech stack, packages
2. ทำ `/deep-analyze` เพื่อดู features หลัก
3. อ่าน `AGENTS.md` และ `docs/project/features.md` ถ้ามี
4. ระบุ features ใหม่่ที่ยังไม่มี analyzer ครอบคลุม

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

### 6. Setup Clean Architecture

> Goal: โครงสร้าง Clean Architecture สำหรับ review CLI

1. สร้าง `src/adapters/file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
2. สร้าง `src/adapters/git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. สร้าง `src/domain/models.ts` สำหรับ `CategoryFinding`, `CategoryResult`, `ReviewReport`
4. สร้าง `src/application/review.ts` import `runAllAnalyzers` จาก `tools-analyze`
5. สร้าง `src/presentation/cli.ts` เป็น entry point
6. สร้าง `src/index.ts` export `runReview` หรือ `createReviewPorts`

### 7. Integrate Analyzers

> Goal: ใช้ analyzers จาก `tools-analyze` โดยไม่ duplicate logic

1. import `runAllAnalyzers` จาก `tools-analyze`
2. แปลง `CategoryResult` ของแต่ละ analyzer เป็น `ReviewReport` พร้อม score, grade, domain breakdown
3. กำหนด `reviewWorkflow` map ไปยัง review skills — ต้องครอบคลุม `review-*` ทุกตัวใน `deep-review/references/review-skills.md` (54 ตัว ยกเว้น `review-github-pr` ที่เป็น PR-scoped)
4. metric หรือ review domain ใดที่ยังไม่มี analyzer → บันทึกเป็น analyzer gap (name + review skill + metric ที่ขาด) ใน Known Issues และ report
5. ถ้า analyzer ยัง implement ไม่เสร็จ ให้ comment `// TODO` พร้อมรายละเอียด
6. ถ้าต้องเพิ่ม AST-based analyzer (structural patterns ที่ regex/git-grep ทำไม่ได้ เช่น function metrics, SRP counts, custom lint rules) → ทำ `/use-astgrep-programmatic` เพื่อ integrate `@ast-grep/napi` หรือ `ast-grep scan --json` เข้า `tools/analyze`/`tools/review-codebase` — findings ต้องมี file:line + rule id ตาม ### 4. Evidence-Based

### 8. Validate CLI

> Goal: ตรวจสอบว่า CLI รันได้

1. รัน `bun --filter tools-review-codebase lint`
2. รัน `bun --filter tools-review-codebase typecheck`
3. รัน `bun --filter tools-review-codebase review-codebase --help`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. รัน `bun --filter tools-review-codebase review-codebase:json` แล้วตรวจสอบ `<workspace>/reports/review-report.json`
6. ถ้า fail → ทำ `/resolve-errors` แล้ว retry (max 3)

### 9. Run Review And Decide

> Goal: รัน review CLI แล้วตัดสินใจอัปเดตตาม metrics

1. รัน `bun --filter tools-review-codebase review-codebase` สำหรับ table output
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อเขียน `reports/review-report.json` ภายใน workspace ที่ถูก review (เช่น `apps/website/reports/review-report.json`) — ห้ามเขียนลง root `reports/`
3. บันทึก score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
4. ถ้าผลตรงเงื่อนไขใดข้างล่าง → ทำ `/update-create-analyze-cli` แล้วทำ Step 4-8 เพื่อ integrate กลับไป Step 9 ใหม่ (ไม่เกิน 3 รอบ):
   - `categories` น้อยกว่า 60
   - overall `score` ต่ำกว่า 70 หรือ `grade` เป็น `D`/`F`
   - domain ใด `score` ต่ำกว่า 50
   - `analyzerErrors` > 0
   - `falsePositiveRate` สูงกว่า 20%
   - findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
   - `reviewWorkflow` ไม่ map ไปยัง review skills ที่มีอยู่ หรือไม่ครบ `deep-review/references/review-skills.md`
   - มี analyzer gap — review domain/metric ที่ CLI ไม่ครอบคลุม
5. ถ้าหลัง 3 รอบยังไม่ผ่าน → stop และ report

### 10. Report

> Goal: สรุปผล review

1. ทำ `/run-review` สำหรับ table output
2. ใช้ `/report` แสดง findings: Category, Finding, Severity, Location, Recommendation
3. ทำ `/suggest-next-action`

## CLI Output

`review-codebase` table output ต้องแสดงรายละเอียดครบตาม spec — ห้ามแสดงแค่ score เดี่ยวหรือ category ละ 1 บรรทัด

### Findings Table (ต่อ category)

| No. | Domain | Category | Score | Grade | C | H | M | L | Status | Top Finding | Evidence | Fix Skill | Delta |
|-----|--------|----------|-------|-------|---|---|---|---|--------|-------------|----------|-----------|-------|

- `No.` column แรกเสมอ เรียง 1..n
- `C`/`H`/`M`/`L` = findings count ตาม severity (Critical/High/Medium/Low)
- `Status` = `new` / `existing` / `regression` / `fixed` เทียบ `reports/review-report.json` ครั้งก่อน — สำคัญสำหรับ iteration 3 รอบของ Step 9
- `Evidence` = `file:line` ของ top finding
- `Fix Skill` = จาก `reviewWorkflow` map — `/review-<domain>` สำหรับ domain finding, `/deep-review-then-fix` เมื่อต้อง apply fix
- `Delta` = score diff เทียบ `reports/review-report.json` ครั้งก่อน (ถ้ามี baseline)
- sort: Critical ก่อน → score ต่ำสุดก่อน

### Domain Summary Table (ต่อท้าย)

| No. | Domain | Score | Grade | Categories | Findings | Errors | FP% | Trend |
|-----|--------|-------|-------|------------|----------|--------|-----|-------|

- `Trend` = up/down/flat เทียบ run ก่อน
- footer row: overall score + grade, `categories N/60`, total analyzer errors, duration

### Output Requirements

- non-TTY/CI → auto plain table หรือใช้ `--json`
- ทุก row ต้องมี `Evidence` — ห้าม row ที่ไม่มี file:line
- หน้าจอแคบ → ตัด `Top Finding` ก่อน ห้ามตัด `Evidence`/`Fix Skill`
- exit code: `exit 1` เมื่อ trigger ใดใน Metric Triggers (`categories < 60`, `score < 70`/`grade D/F`, `domain < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`) — CI gate + auto-detect ผ่าน/ไม่ผ่าน ใน Step 9
- filter flags: `--domain <name>` และ `--severity <min>` สำหรับรันเฉพาะส่วนที่ fail ในรอบ 2-3 ของ Step 9 — ไม่ต้อง full scan ทุกครั้ง

## Rules

### 1. CLI-Driven

- ใช้ `tools/review-codebase` CLI เป็นแหล่งหลักของ findings
- ไม่ manual อ่าน references ทีละ dimension
- ถ้า metrics บ่งชี้ให้ update CLI → ต้องทำ Step 4-8 ก่อนรีวิวต่อ

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

- `reviewWorkflow` map ต้องครอบคลุม `review-*` ทุกตัวใน `deep-review/references/review-skills.md` ยกเว้น `review-github-pr`
- ทุก metric ที่ `deep-review`/`run-review` mark ว่า `ใน update-review-cli = N` → เพิ่ม analyzer หรือบันทึก gap พร้อมเหตุผลใน Known Issues
- deep-review dispatch `review-*` ทีละ workspace ตาม phase (entry → source → cross-cutting → meta) — CLI ต้อง output findings ที่ map กลับไปหา review skill เหล่านั้นได้

### 5. Report Location

- Report ต้องถูกเขียนลงใน workspace ที่ถูก review เท่านั้น เช่น `<workspace>/reports/review-report.json`
- ห้ามสร้างหรือเขียนลง root-level `reports/` directory
- ถ้า review หลาย workspaces → แต่ละ workspace มี report ของตัวเอง

### 6. Review Independence

- ทำ review/deep-review-then-fix CLI เท่านั้น ไม่แก้ไข business logic
- แยก review process จาก fix process
- ใช้ `/deep-review` หรือ `/run-review` สำหรับ comprehensive quality gate

### 7. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
- ใช้ /deep-test cli ถ้าจำเป็น
- ใช้ /run-test ถ้าจำเป็น


## Expected Outcome

- `tools/review-codebase` CLI มีอยู่และรันได้ที่ project root
- Review ทำงานผ่าน `bun run review-codebase`
- Findings ครอบคลุม 60+ categories พร้อม evidence และ severity
- `reviewWorkflow` ครอบคลุม `review-*` ทุกตัวใน `deep-review/references/review-skills.md` — analyzer gaps ถูกบันทึกใน Known Issues
- Before-after review score ผ่าน `/run-review`
- ไม่มี analyzer errors

## Known Issues

ปัญหาที่เคยเจอจริงใน solid-ui session 2026-09-13 — เก็บไว้เช็คซ้ำก่อนตัดสินว่าเป็น source bug

| No. | Issue | Evidence | Status |
|-----|-------|----------|--------|
| 1 | `checkCommand` รายงาน typecheck/lint fail เมื่อ process ตายด้วย OOM/`VirtualAlloc` ใต้ analyzer load | Windows heap error ใน combined output ทั้งที่ typecheck ตรงผ่าน | fixed — retry 1 ครั้งเมื่อ output match OOM/timeout patterns (`tools/analyze/src/analyzers/codeQuality.ts`) |
| 2 | hardcoded-URL check flag URL validation code และ known public endpoints | `startsWith("https://")`, `https://${...}` templates, plausible/GitHub API endpoints | fixed — allowlist + skip validation expressions (`tools/analyze/src/analyzers/security.ts`) |
| 3 | max-function-length 60 บรรทัด flag SolidJS declarative components ปกติ | SearchPage/Sidebar/SearchPalette ถูก flag ทั้งที่เป็น JSX ล้วน | fixed — TSX 200 / TS 120 (`workspace-checks.ts`) |
| 4 | max-file-length 250 flag data tables/renderer maps/barrels ที่แยกแล้วได้แต่ indirection | `index.ts` barrel, `icons.tsx`, `categories.ts`, `specs-extended.ts` | fixed — threshold 400 (`codeQuality.ts`); `no-huge-files` 500 คงไว้ |
| 5 | report สะท้อน line counts เก่าเมื่อ `biome --write` rewrite ไฟล์ระหว่าง/หลัง scan | evidence `ThemeSettings.tsx has 387 lines` ทั้งที่ไฟล์ 52 แล้ว | open — workaround: รัน formatter ให้เสร็จก่อน review เสมอ, เทียบ report timestamp กับไฟล์ล่าสุด |
| 6 | website build crash `Stack overflow` (exit 66) ใต้ load — retry ผ่าน | rolldown build ระหว่าง review กำลังรันขนาน | open — transient; ไม่ใช่ source failure |
| 7 | table output เดิมไม่มี status/delta/fix-skill ตาม spec `## CLI Output` | findings แสดงแค่ severity/domain/category/evidence แบบ flat | fixed — sub-list per category พร้อม reason/risk/fix/priority/status, domain delta, `--domain`/`--severity` filters, exit 1 ตาม metric triggers |
| 8 | unsafe-pattern flag member-call `eval` (`upstash.eval`, Lua EVAL) เป็น High | `packages/infrastructure/src/adapters/redis/upstash-client.ts:69` (booking-platform, 2026-09-14) | fixed — `(?<![\w$.])eval\s*\(` flag เฉพาะ bare `eval(` (`tools/analyze/src/domain/analyzers/security.ts`) |
| 9 | `process.env` flag matches ใน comments และ doc strings | `apps/admin/app/server.ts:56`, `turnstile/service.ts:13` (booking-platform, 2026-09-14) | fixed — strip block/line comments ก่อน match (`tools/analyze/src/domain/analyzers/platform.ts`); real read ใน `apps/provider/src/server.ts` intentional ภายใต้ `nodejs_compat_populate_process_env` |
| 10 | dead-code heuristic flag export ที่มี consumer ผ่าน `createServerFn` | `handleTikTokCallback` flagged ซ้ำ 2026-09-14 (apps/website) ทั้งที่ `routes/auth/tiktok-callback.tsx:41` import ใช้ — reproduce จริง ไม่ใช่ stale scan | open — analyzer ต้อง resolve TanStack `createServerFn` export consumption |
| 11 | tsgo (`typescript@7`) panic `gcBgMarkWorker`/`checkerpool.go` เมื่อ RAM เหลือน้อย (~2.7GB/11.9GB) — typecheck finding ตายทั้งที่ source ผ่าน | `bunx tsc --noEmit` exit 1 พร้อม Go stack; `lib/tsc.js` ก็ delegate ไป native binary; vitest forks OOM ในสภาวะเดียวกัน (booking-platform, 2026-09-14) | open — environmental; workaround: ปิด processes อื่น/รันตอน RAM ว่าง, หรือ `bun build` เช็ค import resolution แทนชั่วคราว |
