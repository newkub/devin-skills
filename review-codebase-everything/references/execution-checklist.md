# Workflow Execution Checklist

รายละเอียดขั้นตอนการทำงานของ `/deep-review` ดำเนินการตามลำดับ ถ้า metrics ไม่ผ่านให้ทำซ้ำไม่เกิน 3 รอบ

## 1. Prepare And Keep Up With Codebase

> Goal: อัปเดต rules, skills และ CLI ให้ทันสมัยก่อนรัน review

1. ทำ `/scan-codebase` ใน `tools/review-codebase/` ถ้ามีอยู่
2. ทำ `/update-project-rules` เพื่อสร้าง skills ที่ขาดจาก dependencies และ features
3. ทำ `/update-review-cli-and-fix` เพื่ออัปเดต `tools/review-codebase` ให้ครอบคลุม features ปัจจุบัน
4. ทำ `/check-should-update` โดยระบุ target paths: `tools/review-codebase/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
5. ถ้าผลเป็น `skip` → ไป Step 9 (Run Review CLI)
6. ถ้าผลเป็น `update` หรือ `create` → ไป Step 2
7. อ่าน `AGENTS.md`, `.devin/rules.md`, `tools/review-codebase/README.md` ถ้ามี
8. ถ้า `tools/review-codebase` มีอยู่ → ทำ pre-review ตาม `references/review-checklist.md` เพื่อตรวจ Clean Architecture, analyzers, CLI interface, package scripts, analyze integration, line count, และ evidence
9. ถ้า pre-review score < 70 → ทำ Step 2-8 ก่อน Step 9

ดูเพิ่มเติม: [review-checklist.md](review-checklist.md)

## 2. Plan Analyzer Categories

> Goal: รู้ว่าจะ expose analyzers อะไรบ้าง

1. ทำตาม `run-review` เพื่อดู 60+ categories จัดกลุ่มตาม 5 domains
2. สร้าง mapping แต่ละ category ไปยัง analyzer file ใน `src/domain/analyzers/`
3. ระบุ analyzers ที่มีอยู่, ต้องสร้างใหม่, หรือต้องอัปเดท
4. ดู `references/review-codebase-cli.md` สำหรับ category structure

ดูเพิ่มเติม: [analyzers.md](analyzers.md)

## 3. Create Or Update Workspace Package

> Goal: มี workspace `tools-review-codebase` พร้อมใช้

1. สร้าง directory `tools/review-codebase/` ถ้ายังไม่มี
2. เขียน `tools/review-codebase/package.json` กำหนด `name: "tools-review-codebase"`, `type: "module"`, scripts `review-codebase`, `review-codebase:json`, `lint`, `typecheck`
3. เขียน `tools/review-codebase/tsconfig.json`, `biome.jsonc`, `README.md`
4. เพิ่ม `tools-review-codebase` เข้า root `package.json` workspaces ถ้ายังไม่มี
5. ใช้ `bun install` เพื่ออัปเดต `bun.lock`

ดูเพิ่มเติม: [package-scripts.md](package-scripts.md)

## 4. Setup Clean Architecture Structure

> Goal: มีโครงสร้าง Clean Architecture สำหรับ review CLI

1. สร้าง `src/adapters/file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
2. สร้าง `src/adapters/git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. สร้าง `src/domain/models.ts` สำหรับ `CategoryFinding`, `CategoryResult`, `ReviewReport`
4. สร้าง `src/application/review.ts` สำหรับ import `runAllAnalyzers` จาก `tools-analyze` แล้วเพิ่ม review scoring, grading, และ report
5. สร้าง `src/presentation/cli.ts` เป็น entry point
6. สร้าง `src/index.ts` export `runReview`, `createReviewPorts`

ดูเพิ่มเติม: [clean-architecture.md](clean-architecture.md)

## 5. Integrate Analyzers From tools-analyze

> Goal: `tools/review-codebase` ใช้ analyzers จาก `tools-analyze` โดยไม่ duplicate logic

1. ทำตาม `/deep-analyze-by-use-scripts` เพื่อประมวลผล patterns ซับซ้อนใน `tools/analyze` ไม่ใช่ใน `tools/review-codebase`
2. import `runAllAnalyzers` จาก `tools-analyze` ใน `src/application/review.ts`
3. แปลงผล `CategoryResult` ของแต่ละ analyzer เป็น `ReviewReport` พร้อม score, grade, domain breakdown
4. กำหนด `reviewWorkflow` map ไปยัง `/review-*` workflows ที่เหมาะสม
5. ถ้า analyzer ยัง implement ไม่เสร็จ ให้ comment `// TODO` พร้อมรายละเอียดใน `tools/analyze`

ดูเพิ่มเติม: [analyze-integration.md](analyze-integration.md)

## 6. Update Package Scripts

> Goal: เรียกใช้งาน `tools/review-codebase` ได้สะดวก

1. ใน `tools/review-codebase/package.json` เพิ่ม `review-codebase` และ `review-codebase:json`
2. ใน root `package.json` เพิ่ม `review-codebase: bun --filter tools-review-codebase review-codebase` และ `review-codebase:json: bun --filter tools-review-codebase review-codebase:json`
3. ทำ `/follow-tasks` เพื่อเพิ่ม `review-codebase` scripts ตาม tech stack ดู section Review CLI Scripts
4. ถ้ามี script ใหม่ที่ต้อง orchestration → register task ใน `turbo.json`

ดูเพิ่มเติม: [package-scripts.md](package-scripts.md)

## 7. Validate CLI

> Goal: ตรวจสอบว่า `tools/review-codebase` รันได้ก่อน loop

1. รัน `bun --filter tools-review-codebase lint`
2. รัน `bun --filter tools-review-codebase typecheck`
3. รัน `bun --filter tools-review-codebase review-codebase --help`
4. รัน `bun --filter tools-review-codebase review-codebase`
5. รัน `bun --filter tools-review-codebase review-codebase:json`
6. ถ้า fail → ทำ `/resolve-errors` แล้ว re-validate (max 3)

ดูเพิ่มเติม: [cli-interface.md](cli-interface.md)

## 8. Run Review CLI And Capture Metrics

> Goal: รัน review CLI เพื่อวัด before score และ metrics

1. ทำ `/run-review` สำหรับ table output หรือรัน `bun --filter tools-review-codebase review-codebase`
2. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง JSON
3. บันทึก before score, grade, domain breakdown, category coverage, findings count, analyzerErrors, falsePositiveRate
4. ถ้า CLI error → ทำ Step 5-7 แล้วกลับมา Step 8

ดูเพิ่มเติม: [review-codebase-cli.md](review-codebase-cli.md), [scoring.md](scoring.md)

## 9. Decide Update From Metrics

> Goal: ตัดสินใจให้ update CLI อัตโนมัติตาม metrics

ถ้า metrics ตรงเงื่อนไขใดข้างล่าง → ทำ `/update-create-analyze-cli` ก่อนถ้า categories/score/domain/analyzerErrors/falsePositiveRate ไม่ผ่าน แล้วทำ Step 3-7 เพื่อ integrate ผลลัพธ์กลับไป Step 8 (ทำซ้ำไม่เกิน 3 รอบ):

1. `categories` น้อยกว่า 60
2. overall `score` ต่ำกว่า 70 หรือ `grade` เป็น `D`/`F`
3. domain ใด `score` ต่ำกว่า 50
4. `analyzerErrors` > 0
5. `falsePositiveRate` สูงกว่า 20%
6. findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
7. `reviewWorkflow` field ไม่ map ไปยัง review skills ที่มีอยู่
8. `tools/review-codebase/package.json` หรือ `tools/review-codebase/src/presentation/cli.ts` ไม่อยู่

ถ้าทุก metrics ผ่านหรือไม่มีการเปลี่ยนแปลงหลัง 3 รอบ → ไป Step 10

ดูเพิ่มเติม: [review-codebase-cli.md](review-codebase-cli.md), [scoring.md](scoring.md)

## 10. Review Findings And Report

> Goal: รายงานผล review พร้อม severity และ recommendations

1. ตรวจสอบความถูกต้อง คุณภาพ และความเหมาะสมของแต่ละ finding
2. ใช้ `grep` หรือ `ast-grep` สำหรับ pattern-based checks ถ้าเกี่ยวข้อง
3. ระบุ severity: Critical → High → Medium → Low
4. ระบุ root cause และ false positives ที่พบ
5. ทำ `/deep-validate` เพื่อ validate findings
6. ทำ `/run-review` เพื่อวัด after score
7. ทำ `/report-table` แสดง findings: Category, Finding, Severity, Location, Recommendation
8. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

ดูเพิ่มเติม: [issue-detection.md](issue-detection.md), [scoring.md](scoring.md)
