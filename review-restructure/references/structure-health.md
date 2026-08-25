# Structure Health Score Formula

## Metrics

5 metrics หลักสำหรับ structure health:

1. File Naming — ตรวจสอบ naming conventions, consistency, responsibility reflection
2. Folder Grouping — ตรวจสอบ domain cohesion, file count, mixed concerns, nesting depth
3. Barrel Exports — ตรวจสอบ barrel file quality, export strategy, coverage
4. Import Complexity — ตรวจสอบ relative imports, alias configuration, deep imports
5. Nesting Depth — ตรวจสอบ flat vs nested structure, depth appropriateness

## Scoring

- แต่ละ metric มีน้ำหนักเท่ากัน (1/5 หรือ 20%)
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Structure health score = (total score / 5) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Metrics Table Format

ตาราง Structure Health Metrics มี columns: Metric, Count, Threshold, Status

| Metric | Count | Threshold | Status |
|--------|-------|-----------|--------|
| Files with naming issues | N | 0 | pass/warning/fail |
| Folders with grouping issues | N | 0 | pass/warning/fail |
| Modules without barrel files | N | 0 | pass/warning/fail |
| Complex relative imports | N | 0 | pass/warning/fail |
| Directories with depth issues | N | 0 | pass/warning/fail |

## Relocation Plan Table Format

ตาราง Relocation Plan มี columns: File, Old Path, New Path, Reason, Priority

| File | Old Path | New Path | Reason | Priority |
|------|----------|----------|--------|----------|
| `auth.ts` | `src/utils/auth.ts` | `src/auth/auth-service.ts` | Domain grouping | 1 |

## Priority Formula

- Priority ขึ้นกับ domain cohesion impact และ import complexity reduction
- High impact + low effort = priority 1
- High impact + high effort = priority 2
- Low impact + any effort = priority 3+

## Dry-Run Preview Format

แสดง before/after structure ในรูปแบบ tree:

```
Before:
src/
├── utils/
│   ├── auth.ts
│   └── user-helpers.ts

After:
src/
├── auth/
│   └── auth-service.ts
├── user/
│   └── user-helpers.ts
```
