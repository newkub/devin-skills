# Review Checklist For tools/review-codebase

ตรวจสอบ `tools/review-codebase` CLI ก่อนเรียก `/review-codebase-everything` เพื่อยืนยันว่า Clean Architecture, analyzer structure, category coverage, CLI interface, และ workspace integration ครบถ้วนและถูกต้อง

## Reference Mapping

| Reference File | Responsibility |
|----------------|----------------|
| `clean-architecture.md` | Clean Architecture validation rules — directories, entry points, kebab-case, Bun native APIs, dependency direction |
| `analyzers.md` | Analyzer structure and coverage — analyzer files, `CategoryResult`, `reviewWorkflow` map, shared utilities, 60+ categories, 5 domains |
| `cli-interface.md` | CLI interface and output format — `--help`/`-h`, exit codes, `--format` table/JSON, error messages |
| `analyze-integration.md` | Integration with `tools-analyze` — workspace imports, no duplicated logic, dependency check |
| `package-scripts.md` | Package scripts validation — `review-codebase`, `review-codebase:json` scripts, root `package.json` filter commands |
| `scoring.md` | Scoring formula — severity weights, grade thresholds, action on low score, report format |

## 1. Prepare Context

> Goal: เข้าใจ `tools/review-codebase` structure

1. ทำ `/scan-codebase` ใน `tools/review-codebase/`
2. ตรวจว่า `tools/review-codebase/` มีอยู่ ถ้าไม่ → flag เป็น critical
3. อ่าน `package.json` ของ `tools/review-codebase`
4. อ่าน `/run-review` เพื่อทราบ 60+ categories และ 5 domains

## 2. Check Clean Architecture

> Goal: ตรวจ Clean Architecture structure

> ดู `clean-architecture.md` สำหรับ architecture validation rules

1. ตรวจ directories: `src/domain/`, `src/application/`, `src/adapters/`, `src/presentation/`
2. ตรวจ entry point: `src/presentation/cli.ts` และ `src/index.ts`
3. ตรวจ file names ใช้ `kebab-case`
4. ตรวจว่าใช้ Bun native APIs: `Bun.file`, `Bun.spawn`, `Bun.write`
5. บันทึก findings พร้อม evidence

## 3. Check Analyzers

> Goal: ตรวจ analyzer structure และ coverage

> ดู `analyzers.md` สำหรับ analyzer structure และ coverage rules

1. ตรวจ analyzer files ใน `src/domain/analyzers/`: `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
2. ตรวจว่าทุก analyzer return `CategoryResult` พร้อม `status`, `score`, `findings`
3. ตรวจว่าทุก analyzer มี `reviewWorkflow` map ไปยัง `/review-codebase-everything` หรือ references
4. ตรวจว่าใช้ shared utilities จาก `src/adapters/` ไม่ duplicate code
5. ตรวจ category coverage: 60+ categories จาก `/run-review`, 5 domains
6. บันทึก findings พร้อม evidence

## 4. Check CLI Interface

> Goal: ตรวจ CLI interface และ output format

> ดู `cli-interface.md` สำหรับ CLI interface และ output format rules

1. ตรวจ `--help`/`-h` option แสดง usage, options, exit codes, examples
2. ตรวจ exit codes: 0 = success, 1 = invalid arguments
3. ตรวจ output รองรับ table และ JSON ผ่าน `--format` flag
4. ตรวจ error messages สำหรับ invalid arguments
5. บันทึก findings พร้อม evidence

## 5. Check Analyze Integration

> Goal: ตรวจ integration กับ tools-analyze

> ดู `analyze-integration.md` สำหรับ integration validation rules

1. ตรวจว่า `tools/review-codebase` imports analyzers จาก `tools-analyze` ผ่าน workspace
2. ตรวจว่าไม่มี duplicated analyzer logic ใน `tools/review-codebase/src/health`
3. ตรวจ `tools-analyze` เป็น dependency ของ `tools/review-codebase`
4. บันทึก findings พร้อม evidence

## 6. Check Package Scripts

> Goal: ตรวจ scripts ใน package.json

> ดู `package-scripts.md` สำหรับ package scripts validation rules

1. ตรวจ `tools/review-codebase/package.json` มี `review-codebase`, `review-codebase:json` scripts
2. ตรวจ root `package.json` มี `review: bun --filter tools-review-codebase review-codebase`
3. ตรวจ root `package.json` มี `review-codebase:json: bun --filter tools-review-codebase review-codebase:json`
4. บันทึก findings พร้อม evidence

## 7. Check Line Count And Evidence

> Goal: ตรวจ line count และ evidence quality

1. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด
2. ตรวจว่า findings มี evidence: file path, line number, code snippet
3. บันทึก findings พร้อม evidence

## 8. Score And Report

> Goal: สรุป review score และ findings

> ดู `scoring.md` สำหรับ scoring formula และ grade thresholds

1. คำนวณ review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100)
2. กำหนด grade: A (90+), B (80+), C (70+), D (60+), F (<60)
3. ทำ `/report-table` พร้อม findings: Category, Severity, Finding, Evidence, Action
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข CLI code ระหว่าง review
- ถ้าต้องแก้ไข ให้เรียก `/review-codebase-everything` หลัง review
- ทุก finding ต้องมี file path และ evidence

### 2. Severity Ratings

- `Critical`: ไม่มี `tools/review-codebase`, ขาด entry point, analyzers ไม่ทำงาน
- `High`: ขาด Clean Architecture, analyzer ไม่ return `CategoryResult`, ไม่มี `--help`
- `Medium`: category coverage ไม่ครบ, scripts ขาด, duplicated code
- `Low`: file names ไม่ `kebab-case`, line count เกิน
- `Info`: ข้อเสนอแนะ ไม่กระทบการทำงาน

### 3. Scoring

- review score = weighted average ของ findings ทั้งหมด
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Score < 70 → แนะนำให้เรียก `/review-codebase-everything` ก่อนดำเนินการ

### 4. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงาน `tools/review-codebase` CLI Review พร้อม score และ grade
- รายงาน findings พร้อม severity, evidence และ action required
- ยืนยัน Clean Architecture, analyzer coverage, CLI interface ครบถ้วน
- ยืนยัน integration กับ `tools-analyze` ไม่มี duplicated logic
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
