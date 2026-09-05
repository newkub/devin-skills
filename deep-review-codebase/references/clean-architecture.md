# Clean Architecture Validation Rules

## Required Directories

ตรวจว่า `tools/review-codebase/` มี directories ครบทั้ง 4 ชั้น:

- `src/domain/` — business logic, analyzers, types
- `src/application/` — use cases, orchestration
- `src/adapters/` — shared utilities, external integrations
- `src/presentation/` — CLI entry point, user-facing output

ถ้าขาด directory ใด → flag เป็น `High` severity

## Entry Points

ตรวจว่ามี entry points ครบ:

- `src/presentation/cli.ts` — CLI entry point หลัก
- `src/index.ts` — barrel export สำหรับ workspace imports

ถ้าขาด entry point → flag เป็น `Critical` severity

## File Naming

ตรวจว่าทุกไฟล์ใช้ `kebab-case`:

- ตัวอย่างที่ถูก: `user-facing.ts`, `code-arch.ts`, `review-workflow.ts`
- ตัวอย่างที่ผิด: `UserFacing.ts`, `userFacing.ts`, `user_facing.ts`

ถ้าพบไฟล์ที่ไม่ใช้ `kebab-case` → flag เป็น `Low` severity

## Bun Native APIs

ตรวจว่าใช้ Bun native APIs แทน Node.js APIs:

- `Bun.file` — อ่านไฟล์ แทน `fs.readFile`
- `Bun.spawn` — รัน subprocess แทน `child_process`
- `Bun.write` — เขียนไฟล์ แทน `fs.writeFile`

ถ้าพบการใช้ Node.js APIs แทน Bun → flag เป็น `Medium` severity

## Dependency Direction

ตรวจว่า dependency direction ถูกต้อง:

- `presentation` → `application` → `domain`
- `adapters` → `domain`
- `domain` ห้าม import จากชั้นอื่น

ถ้าพบ dependency ผิดทิศทาง → flag เป็น `High` severity

## Evidence Format

ทุก finding ต้องมี:

- file path เช่น `tools/review-codebase/src/domain/analyzers/security.ts`
- line number
- code snippet ที่เป็นปัญหา
