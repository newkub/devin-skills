# Clean Architecture Structure

อธิบายการตรวจ Clean Architecture ของ `tools/analyze` ในไดเรกทอรี `src/`

## Directory Layout

ตรวจว่า `tools/analyze/src/` มีไดเรกทอรีครบ:

| Directory | ชั้น | หน้าที่ |
|---|---|---|
| `src/adapters/` | Adapters | เชื่อมกับ external tools (git, filesystem) |
| `src/domain/` | Domain | business models และ analyzers |
| `src/application/` | Application | orchestration ของ analyzers |
| `src/presentation/` | Presentation | CLI entry point |

ถ้าไดเรกทอรีขาด → flag เป็น `High`

## Adapters Layer

ตรวจไฟล์ใน `src/adapters/`:

- `file-utils.ts` — ต้องมี function `walk` (traverse directory tree) และ `readText` (read file content)
- `git-grep.ts` — ต้องมี function `gitGrep` (search via `git grep`) และ `gitGrepCount` (count matches)

ถ้าไฟล์หรือ function ขาด → flag เป็น `High`

## Domain Layer

ตรวจไฟล์ใน `src/domain/`:

- `models.ts` — ต้องมี types: `CategoryFinding`, `CategoryResult`, `AnalyzeReport`
- `analyzers/` — ต้องมี analyzer files:
  - `user-facing.ts`
  - `security.ts`
  - `backend-data.ts`
  - `infrastructure.ts`
  - `code-arch.ts`

ถ้า `models.ts` ขาด type ใด → flag เป็น `High`
ถ้า analyzer file ขาด → flag เป็น `High`

ดู `references/analyzers.md` สำหรับ analyzer structure และ behavior

## Application Layer

ตรวจไฟล์ใน `src/application/`:

- `analyze.ts` — ต้องรวม analyzers ทั้งหมด และ export function `runAllAnalyzers`

ถ้า `analyze.ts` ไม่รวม analyzers ครบ → flag เป็น `High`

## Presentation Layer

ตรวจไฟล์ใน `src/presentation/`:

- `cli.ts` — ต้องเป็น entry point ที่ parse args และเรียก `runAllAnalyzers`

ถ้า `cli.ts` ไม่เป็น entry point → flag เป็น `Medium`

## Dependency Direction

ตรวจว่า dependency ไหลในทิศทาง:

- `presentation/` → `application/` → `domain/` → `adapters/`
- ห้าม `adapters/` import จาก `domain/` หรือ `application/`
- ห้าม `domain/` import จาก `presentation/`

ถ้าพบ dependency ผิดทิศทาง → flag เป็น `Medium`
