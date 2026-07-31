---
name: update-codebase-health-cli
description: สร้างและอัปเดท codebase health CLI ใน tools/health
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - report-codebase-health
  - check-should-update
  - report-deps
  - use-scripts
  - bun
---

## Goal

สร้างและอัปเดท codebase health CLI ใน `tools/health` ที่ project root ให้ครอบคลุม 60+ categories ตาม `/report-codebase-health` พร้อม health score, action items, และ production readiness

## Scope

ใช้สำหรับสร้างและอัปเดท health analysis CLI ใน `tools/health` ที่ project root ครอบคลุม 60+ categories จัดกลุ่มตาม 5 domains ตาม `/report-codebase-health`

## Execute

### 1. Check Should Update

ตรวจสอบว่า CLI ต้องอัปเดทหรือไม่ โดยเช็ค git changes ที่เกี่ยวข้อง

> Goal: รู้ว่า CLI ต้องอัปเดทตาม code changes หรือไม่ ก่อนเริ่มงาน ไม่เสียเวลาอัปเดทถ้าไม่มีอะไรเปลี่ยน

1. ทำ `/check-should-update` โดยระบุ target paths: `tools/health/`, `AGENTS.md`, `apps/*/AGENTS.md`, `apps/website/src/`
2. ถ้าผลเป็น `skip` → ข้ามไป Step 8 (Validate CLI) เพื่อรัน CLI ที่มีอยู่
3. ถ้าผลเป็น `update` → ทำตาม Step 2 ก่อน แล้วทำ Step 3 เป็นต้นไป
4. ถ้าผลเป็น `create` → ทำ Step 3 เป็นต้นไปเลย

### 2. Check AGENTS.md Freshness

ตรวจสอบว่า AGENTS.md ต้องอัปเดทก่อนหรือไม่ เพื่อให้ reviewWorkflow mapping ถูกต้อง

> Goal: AGENTS.md เป็นปัจจุบันก่อนอัปเดท analyzers เพราะ analyzers อ้างอิง review-* workflows จาก AGENTS.md

1. อ่าน `AGENTS.md` ที่ root และ workspace level
2. เช็คว่า `## Workflows`, `## Review`, และ `## Skills` section ครอบคลุม dependencies ใน `package.json` ทั้งหมด
3. ถ้า AGENTS.md ขาด workflows, skills หรือ reviews ที่ map กับ dependencies ปัจจุบัน → ทำ `/update-agents-md` ก่อน
4. ถ้า AGENTS.md เป็นปัจจุบัน → ข้ามไป Step 3

### 3. Read Context

อ่าน context ก่อนเริ่มงานเพื่อเข้าใจ categories และ CLI ที่มีอยู่

> Goal: เข้าใจ categories ทั้งหมด CLI structure ที่มีอยู่ และ architecture guidelines

1. ทำ `/report-codebase-health` เพื่อดูรายการ 60+ categories จัดกลุ่มตาม 5 domains
2. ทำ `/read-related-skills` เพื่ออ่าน workflows ที่เกี่ยวข้องกับ project แบบ recursive
3. อ่าน `tools/health/` directory ที่ project root เพื่อดู CLI ที่มีอยู่แล้ว
4. อ่าน `src/domain/analyzers/` เป็น reference implementation
5. ทำ `/follow-create-bun-cli` เพื่ออ่าน Bun CLI best practices
6. ทำ `/follow-clean-architecture` เพื่ออ่าน Clean Architecture structure สำหรับ CLI
7. ทำ `/use-ast-grep` เพื่ออ่าน ast-grep patterns และ rules สำหรับ analyzer checks

### 4. Build Analyzer Inventory

สร้าง mapping ระหว่าง categories และ analyzer modules เพื่อระบุสิ่งที่ต้องทำ

> Goal: รู้ analyzers ที่ต้องสร้าง อัปเดท และลบ — โดย map กับ 8+1 category orchestrators จาก `/review-codebase-everything`

1. สร้าง mapping จาก report-codebase-health categories เป็น analyzer module:
   - แต่ละ domain มี analyzer file ใน `src/domain/analyzers/`: `user-facing.ts`, `security.ts`, `backend-data.ts`, `infrastructure.ts`, `code-arch.ts`
   - แต่ละ category เป็น `Analyzer` object ใน domain file
2. Map analyzers ไปยัง category orchestrators จาก `/review-codebase-everything`:
   - `/review-code-quality` → Code & Architecture domain analyzers
   - `/review-security` → Security & Compliance domain analyzers
   - `/review-frontend` → User-Facing domain analyzers
   - `/review-backend` → Backend & Data domain analyzers
   - `/review-infrastructure` → Infrastructure domain analyzers
   - `/review-business` → Business domain analyzers
   - `/review-delivery` → Delivery domain analyzers
   - `/review-platform` → Platform domain analyzers
   - `/review-performance` → Performance domain analyzers
3. ระบุ analyzers ที่มีอยู่แล้ว, ที่ต้องสร้างใหม่, และที่ต้องอัปเดท
4. ระบุ analyzers ที่ไม่มี category สอดคล้องแล้วเพื่อพิจารณาลบ

### 5. Create Or Update Analyzers

สร้างหรืออัปเดท analyzer แต่ละตัวตาม category ใน `/report-codebase-health`

> Goal: ทุก category มี analyzer ที่ทำงานได้และสอดคล้องกับ `/report-codebase-health`

1. สำหรับแต่ละ category ใน `/report-codebase-health`:
   1. อ่าน `/report-codebase-health` Step 7 สำหรับรายการ categories ในแต่ละ domain
   2. สร้าง `Analyzer` object ใน domain file ที่เกี่ยวข้อง ถ้ายังไม่มี
   3. อัปเดท analyzer ที่มีอยู่แล้วให้สอดคล้องกับ category ปัจจุบัน
   4. ใช้ `/deep-analyze-by-use-scripts` สำหรับโครงสร้าง analyzer
2. ทุก analyzer ต้องใช้ shared utilities จาก `src/adapters/`:
   - `file-utils.ts` สำหรับ `walk`, `readText`, `getRel`
   - `git-grep.ts` สำหรับ `gitGrep`, `gitGrepCount`
3. แต่ละ analyzer ต้องมี:
   - `name` ตรงกับ category name ใน `/report-codebase-health`
   - `domain` ตรงกับ domain ใน `/report-codebase-health`
   - `reviewWorkflow` ตรงกับ `/review-*` workflow จาก AGENTS.md
   - `analyze()` ที่ return `CategoryResult` พร้อม `status`, `score`, `findings`
4. ใส่ specific checks ตาม scope ของแต่ละ category
5. ถ้า analyzer ไม่สามารถ implement ทั้งหมดได้ ให้ comment `// TODO` พร้อมรายละเอียดสิ่งที่ต้องทำ
6. ทำ `/update-rules` สำหรับ `tools/health/` เพื่อสร้าง ast-grep rules ของ patterns ที่ analyzers ตรวจจับ — ใช้ `/use-ast-grep` สำหรับ AST-based patterns
7. สำหรับ checks ที่ซับซ้อน ต้องวิเคราะห์ context ข้ามไฟล์ หรือ AST จับไม่ได้ → เขียนเป็น `.ts` analyzer logic โดยตรง ใช้ `/use-scripts` เมื่อต้องประมวลผลข้อมูลซับซ้อน

### 6. Update Package Manifest

ตรวจสอบและอัปเดท scripts ใน `package.json` ของ workspace และ root ให้สอดคล้องกับ CLI ที่อัปเดท

> Goal: scripts ใน `package.json` ครบถ้วนและรันได้ก่อน validate

1. ทำ `/add-task-in-package-manifest` สำหรับ script ที่จำเป็น:
   - `health` → `bun run src/presentation/cli.ts` ใน `tools/health/package.json`
   - `health` → `bun --filter @booking/tools-health health` ใน root `package.json`
2. ถ้ามี script ใหม่ที่ต้อง orchestration → register task ใน `turbo.json`
3. ถ้า script มีอยู่และถูกต้อง → ข้าม

### 7. Restructure Analyzers

ปรับโครงสร้างไฟล์ถ้าเกิน 250 บรรทัดและอัปเดท references

> Goal: ไฟล์ไม่เกิน 250 บรรทัด และ references ถูกต้อง

1. ทำ `/restructure` สำหรับ `src/domain/analyzers/` ถ้ามีไฟล์ที่ยาวกว่า 250 บรรทัด
2. จัดกลุ่ม analyzers ตาม domain เดียวใน file เดียว
3. ทำ `/update-reference` ทุกครั้งหลังย้ายหรือเปลี่ยนชื่อไฟล์

### 8. Validate CLI

ตรวจสอบว่า CLI รันได้และ output ถูกต้อง

> Goal: CLI ผ่าน typecheck, lint และ output ถูกต้อง

1. รัน `bun --filter @booking/tools-health lint` สำหรับ typecheck และ lint
2. รัน health CLI ด้วย `bun --filter @booking/tools-health health`
3. ตรวจสอบ output ว่าอยู่ใน expected format (table และ json)
4. รัน `bunx biome check tools/health` เพื่อตรวจ lint และ format
5. ทำ `/validate` เพื่อตรวจสอบความถูกต้อง

### 9. Deep Report

สร้าง deep report ตาม `/deep-report` พร้อมตารางละเอียดและสรุปครบทุกมิติ

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
- ทุก analyzer ต้องมี `reviewWorkflow` ที่ map ไปยัง `/review-*` workflow จาก AGENTS.md
- ใช้ shared utilities จาก `src/adapters/` แทนการ duplicate code
- Output เป็น table และ JSON ตาม `--format` flag

### 2. Category Coverage

- ครอบคลุม 60+ categories จาก `/report-codebase-health` Step 7
- 5 domains: User-Facing, Security & Compliance, Backend & Data, Infrastructure, Code & Architecture
- แต่ละ category มี status: ✅ pass, ⚠️ warn, ❌ fail
- คำนวณ health score: ✅ = 100, ⚠️ = 50, ❌ = 0
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

- อ่าน `## Execute` และ `## Rules` ของ `/report-codebase-health`
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
| Review Workflow | `/review-*` workflow ที่แนะนำจาก AGENTS.md | `/review-realize-implementation` |
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

- `tools/health` มี codebase health CLI ครอบคลุม 60+ categories ตาม `/report-codebase-health`
- CLI รันได้ด้วย `bun run health`
- ไม่มีไฟล์ใดยาวกว่า 250 บรรทัด
- Deep report แสดงตาราง 7 columns พร้อมสรุปละเอียดครบทุกมิติ
- ตรวจสอบ git changes และ AGENTS.md freshness ก่อนอัปเดท analyzers
