# Reference Index

ตาราง mapping แต่ละ reference file ไปยังความรับผิดชอบ:

| Reference File | Responsibility |
|----------------|----------------|
| `clean-architecture.md` | Clean Architecture validation rules — directories, entry points, kebab-case, Bun native APIs, dependency direction |
| `analyzers.md` | Analyzer structure and coverage — analyzer files, `CategoryResult`, `reviewWorkflow` map, shared utilities, 60+ categories, 5 domains |
| `cli-interface.md` | CLI interface and output format — `--help`/`-h`, exit codes, `--format` table/JSON, error messages |
| `analyze-integration.md` | Integration with `tools-analyze` — workspace imports, no duplicated logic, dependency check |
| `package-scripts.md` | Package scripts validation — `review`, `review:json` scripts, root `package.json` filter commands |
| `scoring.md` | Scoring formula — severity weights, grade thresholds, action on low score, report format |

## Usage

- อ้างอิง reference file ที่เกี่ยวข้องในแต่ละ Execute step ของ `SKILL.md`
- แต่ละ file มี single responsibility — ไม่ overlap กัน
- ใช้สำหรับ validation rules และ evidence format เท่านั้น
