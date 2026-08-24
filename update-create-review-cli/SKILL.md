---
name: update-create-review-cli
description: สร้างและอัปเดท codebase review CLI ใน tools/review
---

## Goal

สร้างและอัปเดท codebase review CLI ใน `tools/review` ที่ project root ให้ครอบคลุม 60+ categories ตาม `/run-review` พร้อม review score, action items, และ production readiness

## Scope

ใช้สำหรับสร้างและอัปเดท review analysis CLI ใน `tools/review` ที่ project root ครอบคลุม 60+ categories จัดกลุ่มตาม 5 domains ตาม `/run-review`

## Execute

### 1. Check Should Update

> Goal: ตรวจสอบว่า CLI ต้องอัปเดทหรือไม่ โดยเช็ค git changes ที่เกี่ยวข้อง
> Goal: รู้ว่า CLI ต้องอัปเดทตาม code changes หรือไม่ ก่อนเริ่มงาน ไม่เสียเวลาอัปเดทถ้าไม่มีอะไรเปลี่ยน

1. ทำ `/check-should-update` โดยระบุ target paths: `tools/review/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
2. ถ้าผลเป็น `skip` → ข้ามไป Step 8 (Validate CLI) เพื่อรัน CLI ที่มีอยู่
3. ถ้าผลเป็น `update` → ทำตาม Step 2 ก่อน แล้วทำ Step 3 เป็นต้นไป
4. ถ้าผลเป็น `create` → ทำ Step 3 เป็นต้นไปเลย

### 2. Check AGENTS.md Freshness

> Goal: ตรวจสอบว่า AGENTS.md ต้องอัปเดทก่อนหรือไม่ เพื่อให้ reviewWorkflow mapping ถูกต้อง
> Goal: AGENTS.md เป็นปัจจุบันก่อนอัปเดท analyzers เพราะ analyzers อ้างอิง review workflow จาก AGENTS.md

1. อ่าน `AGENTS.md` ที่ root และ workspace level
2. เช็คว่า `## Workflows`, `## Review`, และ `## Skills` section ครอบคลุม dependencies ใน `package.json` ทั้งหมด
3. ถ้า AGENTS.md ขาด workflows, skills หรือ reviews ที่ map กับ dependencies ปัจจุบัน → ทำ `/update-agents-md` ก่อน
4. ถ้า AGENTS.md เป็นปัจจุบัน → ข้ามไป Step 3

### 3. Read Context

> Goal: อ่าน context ก่อนเริ่มงานเพื่อเข้าใจ categories และ CLI ที่มีอยู่
> Goal: เข้าใจ categories ทั้งหมด CLI structure ที่มีอยู่ และ architecture guidelines

1. ทำ `/run-review` เพื่อดูรายการ 60+ categories จัดกลุ่มตาม 5 domains
2. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องกับ project แบบ recursive
3. อ่าน `tools/review/` directory ที่ project root เพื่อดู CLI ที่มีอยู่แล้ว
4. อ่าน `src/domain/analyzers/` เป็น reference implementation
5. ทำ `/follow-create-bun-cli` เพื่ออ่าน Bun CLI best practices
6. ทำ `/follow-clean-architecture` เพื่ออ่าน Clean Architecture structure สำหรับ CLI
7. ทำ `/use-ast-grep` เพื่ออ่าน ast-grep patterns และ rules สำหรับ analyzer checks

### 4. Build Analyzer Inventory

> Goal: สร้าง mapping ระหว่าง categories และ analyzer modules เพื่อระบุสิ่งที่ต้องทำ
> Goal: รู้ analyzers ที่ต้องสร้าง อัปเดท และลบ — โดย map กับ 8+1 category orchestrators จาก `/review-codebase`

1. สร้าง mapping จาก run-review categories เป็น analyzer module:
   - แต่ละ domain มี analyzer file ใน `src/domain/analyzers/`: `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
   - แต่ละ category เป็น `Analyzer` object ใน domain file
2. Map analyzers ไปยัง category orchestrators จาก `/review-codebase`:
   - `/review-codebase` → รวม 8+1 domain analyzers: Code & Architecture, Security & Compliance, User-Facing, Backend & Data, Infrastructure, Business, Delivery, Platform, Performance
3. ระบุ analyzers ที่มีอยู่แล้ว, ที่ต้องสร้างใหม่, และที่ต้องอัปเดท
4. ระบุ analyzers ที่ไม่มี category สอดคล้องแล้วเพื่อพิจารณาลบ

### 5. Create Or Update Analyzers

> Goal: สร้างหรืออัปเดท analyzer แต่ละตัวตาม category ใน `/run-review`
> Goal: ทุก category มี analyzer ที่ทำงานได้และสอดคล้องกับ `/run-review`

1. สำหรับแต่ละ category ใน `/run-review`:
   1. อ่าน `/run-review` Step 7 สำหรับรายการ categories ในแต่ละ domain
   2. สร้าง `Analyzer` object ใน domain file ที่เกี่ยวข้อง ถ้ายังไม่มี
   3. อัปเดท analyzer ที่มีอยู่แล้วให้สอดคล้องกับ category ปัจจุบัน
   4. ใช้ `/deep-analyze-by-use-scripts` สำหรับโครงสร้าง analyzer
2. ทุก analyzer ต้องใช้ shared utilities จาก `src/adapters/`:
   - `file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
   - `git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. แต่ละ analyzer ต้องมี:
   - `name` ตรงกับ category name ใน `/run-review`
   - `domain` ตรงกับ domain ใน `/run-review`
   - `reviewWorkflow` ตรงกับ `/review-codebase` หรือ `review-codebase/references/<dimension>.md` จาก AGENTS.md
   - `analyze()` ที่ return `CategoryResult` พร้อม `status`, `score`, `findings`
4. ใส่ specific checks ตาม scope ของแต่ละ category
5. ถ้า analyzer ไม่สามารถ implement ทั้งหมดได้ ให้ comment `// TODO` พร้อมรายละเอียดสิ่งที่ต้องทำ
6. ทำ `/update-rules` สำหรับ `tools/review/` เพื่อสร้าง ast-grep rules ของ patterns ที่ analyzers ตรวจจับ — ใช้ `/use-ast-grep` สำหรับ AST-based patterns
7. สำหรับ checks ที่ซับซ้อน ต้องวิเคราะห์ context ข้ามไฟล์ หรือ AST จับไม่ได้ → เขียนเป็น `.ts` analyzer logic โดยตรง ใช้ `/use-scripts` เมื่อต้องประมวลผลข้อมูลซับซ้อน

### 6. Update Package Manifest

> Goal: ตรวจสอบและอัปเดท scripts ใน `package.json` ของ workspace และ root ให้สอดคล้องกับ CLI ที่อัปเดท
> Goal: scripts ใน `package.json` ครบถ้วนและรันได้ก่อน validate

1. ทำ `/use-scripts` สำหรับ script ที่จำเป็น:
   - `review` → `bun run src/presentation/cli.ts` ใน `tools/review/package.json`
   - `review` → `bun --filter tools-review review` ใน root `package.json`
   - `review:json` → `bun --filter tools-review review:json` ใน root `package.json`
2. ทำ `/follow-tasks` เพื่อเพิ่ม `review` และ `review:json` ใน package scripts ตาม tech stack (ดู section 11 Review CLI Scripts ใน `/follow-tasks`)
3. ถ้ามี script ใหม่ที่ต้อง orchestration → register task ใน `turbo.json`
4. ถ้า script มีอยู่และถูกต้อง → ข้าม

### 7. Restructure Analyzers

> Goal: ปรับโครงสร้างไฟล์ถ้าเกิน 250 บรรทัดและอัปเดท references
> Goal: ไฟล์ไม่เกิน 250 บรรทัด และ references ถูกต้อง

1. ทำ `/restructure` สำหรับ `src/domain/analyzers/` ถ้ามีไฟล์ที่ยาวกว่า 250 บรรทัด
2. จัดกลุ่ม analyzers ตาม domain เดียวใน file เดียว
3. ทำ `/update-reference` ทุกครั้งหลังย้ายหรือเปลี่ยนชื่อไฟล์

### 8. Validate CLI

> Goal: ตรวจสอบว่า CLI รันได้และ output ถูกต้อง
> Goal: CLI ผ่าน typecheck, lint และ output ถูกต้อง

1. รัน `bun --filter tools-review lint` สำหรับ typecheck และ lint
2. รัน review CLI ด้วย `bun --filter tools-review review`
3. ตรวจสอบ output ว่าอยู่ใน expected format (table และ json)
4. รัน `bunx biome check tools/review` เพื่อตรวจ lint และ format
5. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง

### 9. Deep Report

> Goal: สร้าง deep report ตาม `/deep-report` พร้อมตารางละเอียดและสรุปครบทุกมิติ
> Goal: deep report ที่ละเอียด actionable และครบทุกมิติ

1. ทำ `/deep-report` เพื่อสร้าง deep report ตาม format ที่กำหนด
2. แสดงตาราง deep report ด้วย 7 columns ตาม Rules section 7 (Deep Report Table)
3. จัดกลุ่มตาม `reviewWorkflow` จาก AGENTS.md เพื่อเชื่อมโยงกับ `/review-*` workflows
4. แสดงสรุปละเอียดครบทุกมิติตาม Rules section 8 (Deep Summary)
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. CLI And Analyzer Structure

- ใช้โครงสร้างจาก `/follow-create-bun-cli` และ `/follow-clean-architecture`
- แยก concerns ตาม Clean Architecture: `domain/` (pure logic), `application/` (orchestration), `adapters/` (I/O), `presentation/` (CLI entry point)
- ชื่อไฟล์ใช้ `kebab-case` เสมอ
- Entry point: `src/presentation/cli.ts` และ `src/index.ts`
- ใช้ Bun native APIs: `Bun.file`, `Bun.spawn`, `Bun.write`
- ทุก analyzer ต้อง return `CategoryResult` พร้อม `status`, `score`, `findings`
- ทุก analyzer ต้องมี `reviewWorkflow` ที่ map ไปยัง `/review-codebase` หรือ `review-codebase/references/<dimension>.md` จาก AGENTS.md
- ใช้ shared utilities จาก `src/adapters/` แทนการ duplicate code
- Output เป็น table และ JSON ตาม `--format` flag

### 2. Category Coverage

- ครอบคลุม 60+ categories จาก `/run-review` Step 7
- 5 domains: User-Facing, Security & Compliance, Backend & Data, Infrastructure, Code & Architecture
- แต่ละ category มี status: ✅ pass, ⚠️ warn, ❌ fail
- คำนวณ review score: ✅ = 100, ⚠️ = 50, ❌ = 0
- แสดง progress bar พร้อม grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 3. Table Output Format

- กรองเฉพาะ categories ที่มี findings (ไม่แสดง pass)
- จัดกลุ่มตาม `reviewWorkflow` จาก AGENTS.md
- แสดงเฉพาะไฟล์ที่มีปัญหา พร้อม severity และ message
- แสดง summary ด้านล่าง: domain scores, severity counts, total categories
- แสดง action items สำหรับ Critical และ High severity

### 4. CLI Help

- มี `--help` และ `-h` option ที่แสดง usage, options, exit codes, examples
- มี error messages สำหรับ invalid arguments
- มี exit codes: 0 = success, 1 = invalid arguments

### 5. Specific Checks

- อ่าน `## Execute` และ `## Rules` ของ `/run-review`
- ใช้ `/use-ast-grep` สำหรับ pattern-based checks ที่ AST จับได้ — แปลง code patterns เป็น ast-grep rules ผ่าน `/update-rules`
- สำหรับ checks ที่ซับซ้อน ต้องวิเคราะห์ context ข้ามไฟล์ หรือ AST จับไม่ได้ → เขียนเป็น `.ts` logic ใน analyzer โดยตรง ใช้ `/use-scripts` เมื่อต้องประมวลผลข้อมูลซับซ้อน
- ใช้ `gitGrep` สำหรับ pattern-based search ที่ไม่ต้องการ AST
- อย่า implement checks ที่เป็น process guidelines หรือ require human judgment

### 6. Validation

- ทุก analyzer ต้องผ่าน typecheck ก่อน commit
- ทุก analyzer ต้องรันได้โดยไม่ error
- ทุก finding ต้องมี evidence: file path, line number, หรือ code snippet
- ใช้ `/validate` ก่อนสรุปผล

### 7. Deep Report Table

ตาราง deep report มี 7 columns จัดกลุ่มตาม `reviewWorkflow`:

| Column | Description | Example |
|---|---|---|
| Scope | Domain และ category ที่พบปัญหา | `Code & Architecture > Completeness` |
| File | ไฟล์และบรรทัดที่มีปัญหา | `apps/website/src/routes/__root.tsx:26` |
| Cause | สาเหตุรากของปัญหา (root cause) | `Case-insensitive 'placeholder' matches HTML attributes` |
| Solutions | วิธีแก้ที่ actionable และเฉพาะเจาะจง | `Use case-sensitive search for MOCK/STUB/FAKE markers only` |
| Severity | ระดับความรุนแรง: Critical > High > Medium > Low | `High` |
| Review Workflow | review workflow ที่แนะนำจาก AGENTS.md | `/review-codebase` |
| Evidence | code snippet หรือ pattern ที่ trigger finding | `grep -i 'placeholder' → 947 matches in <input placeholder=...>` |

- จัดเรียงตาม severity: Critical ก่อน, High รองลงมา
- กรองเฉพาะ categories ที่มี findings (ไม่แสดง pass)
- แต่ละ row ต้องมี evidence ที่ตรวจสอบได้จริง
- ถ้า finding เป็น false positive ให้ระบุใน column Cause ว่า `False positive: <reason>`

### 8. Deep Summary

สรุปละเอียดครบทุกมิติท้าย report มี 5 ส่วน:

1. Domain Breakdown — score, pass/warn/fail counts, top finding ของทุก domain
2. Severity Distribution — จำนวน findings ตาม Critical/High/Medium/Low
3. Analyzer Changes — สร้างใหม่/อัปเดท/ลบ พร้อมสิ่งที่เปลี่ยน
4. False Positive Analysis — รายการ, สาเหตุ, วิธีแก้
5. Recommended Actions — quick wins และ major improvements พร้อม reviewWorkflow, effort, impact

## Expected Outcome

- `tools/review` มี codebase review CLI ครอบคลุม 60+ categories ตาม `/run-review`
- CLI รันได้ด้วย `bun run review`
- ไม่มีไฟล์ใดยาวกว่า 250 บรรทัด
- Deep report แสดงตาราง 7 columns พร้อมสรุปละเอียดครบทุกมิติ
- ตรวจสอบ git changes และ AGENTS.md freshness ก่อนอัปเดท analyzers

## Addendum

### Analyze Extraction Rule

ถ้า `tools/review` ยังไม่ได้แยก analyzer engine ออกเป็น `tools/analyze`:

1. ทำตาม `/update-create-analyze-cli` เพื่อสร้างหรืออัปเดต `tools/analyze`
2. ย้าย analyzer logic ที่ซับซ้อนหรือต้องการ deep analysis ออกจาก `tools/review/src/health` หรือ `tools/review/src/domain/analyzers` ไปยัง `tools/analyze/src/domain/analyzers`
3. ให้ `tools/review` นำเข้า analyzers จาก `tools-analyze` ผ่าน Bun workspace แทนการเก็บ code ซ้ำ
4. อัปเดต `tools/review/src/domain/analyzers/health-adapter.ts` หรือสร้าง `analyze-adapter.ts` ให้ `import("tools-analyze/src/domain/analyzers")` และ `import("tools-analyze/src/adapters")`
5. รัน `bun --filter tools-analyze typecheck`, `lint`, `analyze` แล้วจึงรัน `bun --filter tools-review review`
