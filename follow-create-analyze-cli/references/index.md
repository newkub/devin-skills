# Reference Index

ตาราง mapping reference file แต่ละตัวกับความรับผิดชอบ

## Reference Files

| File | Responsibility |
|---|---|
| `workspace-package.md` | ตรวจ `package.json` setup: name, type, scripts, exports, root workspace filter |
| `clean-architecture.md` | ตรวจ Clean Architecture: `src/adapters/`, `src/domain/`, `src/application/`, `src/presentation/` |
| `analyzers.md` | ตรวจ analyzer structure: `CategoryResult` return, `reviewWorkflow` map, deterministic behavior, findings |
| `exports.md` | ตรวจ workspace API exports: `src/index.ts`, `package.json` exports, `process.env.ANALYZE_BASE` |
| `review-integration.md` | ตรวจ integration กับ `tools/review`: import จาก `tools-analyze`, ไม่ duplicated logic, dependency check |
| `scoring.md` | คำนวณ review score และ grade: severity weights, grade thresholds, action threshold |
| `index.md` | ตาราง mapping reference file กับความรับผิดชอบ (ไฟล์นี้) |

## Usage

อ้างถึง reference file ใน SKILL.md Execute steps:

- Step 2 → `references/workspace-package.md`
- Step 3 → `references/clean-architecture.md`
- Step 4 → `references/analyzers.md`
- Step 5 → `references/exports.md`
- Step 6 → `references/review-integration.md`
- Step 8 → `references/scoring.md`

## Cross References

- `workspace-package.md` → `exports.md` (exports field detail)
- `clean-architecture.md` → `analyzers.md` (analyzer detail)
- `exports.md` → `review-integration.md` (import usage)
- `scoring.md` → `index.md` (reference mapping)
