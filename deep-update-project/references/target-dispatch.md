# Target Dispatch

(merged from: deep-update)

ใช้เมื่อต้อง update target ที่ไม่ใช่ root project — map target type ไปยัง `update-*` skill ที่เหมาะสม

## Target Type Dispatch

| No. | Target Type | Skill |
|-----|-------------|-------|
| 1 | `root-project` | `/deep-update-project` (skill นี้) |
| 2 | `skill` ใน global skills | `/update-devin-global-skills <skill-name>` |
| 3 | `all` global skills | `/update-devin-global-skills` |
| 4 | `config` | `/update-config` |
| 5 | `versions` (runtime, deps, tools, CI, Docker) | `/update-version-to-latest` |
| 6 | `project-docs` | `/update-readme-md`, `/update-agents-md`, `/update-usage-md`, `/update-features-md` |
| 7 | `rules` | `/update-project-rules` |
| 8 | `skills` ใน project | `/update-project-skills` |
| 9 | `examples` | `/update-examples` |
| 10 | `tests` | `/update-test-and-fix` |
| 11 | `todo` | `/update-todo-md` |
| 12 | `gitignore` | `/update-gitignore` |
| 13 | `vscode` | `/update-dot-vscode` |
| 14 | `github-metadata` | `/update-github-metadata` |
| 15 | `codebase` | `/deep-implement-to-production` ตาม critical path |

หลัง update ทุก target ให้ทำ `/update-references` เพื่อ sync ทุก reference

## Rules

- ต้องระบุ target type ก่อนเริ่ม — ถ้าไม่ชัด → ทำ `/ask-me`
- ใช้ `update-*` skills ตาม target type ไม่ทำงานที่ `update-*` skills ทำได้เองโดยตรง
- ถ้า target ไม่ตรงกับ skill ใด → ใช้ `/deep-implement-to-production` สำหรับ code changes
- รันซ้ำได้โดยไม่เกิด side effects — ข้าม steps ที่ไม่จำเป็น
- ต้องผ่าน `/deep-validate` และ `/run-verify` ก่อนถือว่าเสร็จ
