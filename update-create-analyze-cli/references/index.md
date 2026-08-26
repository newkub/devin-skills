# Reference Index

ตาราง mapping reference file แต่ละตัวกับความรับผิดชอบ

## Reference Files

|| File | Responsibility |
||---|---|
|| `workspace-package.md` | ตรวจ `package.json` setup: name, type, scripts, exports, root workspace filter |
|| `clean-architecture.md` | ตรวจ Clean Architecture: `src/adapters/`, `src/domain/`, `src/application/`, `src/presentation/` |
|| `analyzers.md` | ตรวจ analyzer structure: `CategoryResult` return, `reviewWorkflow` map, deterministic behavior, findings |
|| `exports.md` | ตรวจ workspace API exports: `src/index.ts`, `package.json` exports, `process.env.ANALYZE_BASE` |
|| `review-integration.md` | ตรวจ integration กับ `tools/review-codebase`: import จาก `tools-analyze`, ไม่ duplicated logic, dependency check |
|| `scoring.md` | คำนวณ review score และ grade: severity weights, grade thresholds, action threshold |
|| `index.md` | ตาราง mapping reference file กับความรับผิดชอบ (ไฟล์นี้) |

## Usage

อ้างถึง reference file ใน SKILL.md Execute steps:

- Step 1 ตรวจ workspace package → `references/workspace-package.md`
- Step 1 ตรวจ Clean Architecture → `/follow-clean-architecture`
- Step 1 ตรวจ analyzers → `references/analyzers.md`
- Step 1 ตรวจ review integration → `references/review-integration.md`
- Step 6 ตรวจ exports → `references/exports.md`
- Step 1 ตรวจ score → `references/scoring.md`

## Cross References

- `workspace-package.md` → `exports.md` (exports field detail)
- `clean-architecture.md` → `analyzers.md` (analyzer detail)
- `exports.md` → `review-integration.md` (import usage)
- `scoring.md` → `index.md` (reference mapping)
