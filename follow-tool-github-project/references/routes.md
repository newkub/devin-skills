# Follow Tool Github Project Route Map

- Manual: <https://cli.github.com/manual>
- GitHub Projects docs: <https://docs.github.com/en/issues/planning-and-tracking-with-projects>

## Routes

| Route / Topic | URL |
|---|---|
| `gh project` overview | https://cli.github.com/manual/gh_project |
| `gh project list` / `view` | https://cli.github.com/manual/gh_project_list |
| `gh project create` / `edit` / `close` / `copy` / `mark-template` | https://cli.github.com/manual/gh_project_create |
| `gh project link` / `unlink` | https://cli.github.com/manual/gh_project_link |
| `gh project item-list` / `item-add` / `item-create` / `item-edit` / `item-archive` / `item-delete` | https://cli.github.com/manual/gh_project_item-list |
| `gh project field-list` / `field-create` / `field-delete` | https://cli.github.com/manual/gh_project_field-list |
| Output formatting (`--format`, `--jq`, `--template`) | https://cli.github.com/manual/gh_help_formatting |
| `project` scope | `gh auth refresh -s project` — https://cli.github.com/manual/gh_auth_refresh |

## Key Concepts

- project `number` = ลำดับของ owner ไม่ใช่ GraphQL node ID — ใช้ `--owner "@me"` หรือ org
- name-based item edit: `<number>` + `--owner` + `--url` + `--field` + `--value`; ID-based: `--id` + `--field-id` + `--project-id` — ใช้ร่วมกันไม่ได้
- destructive commands (`delete`, `item-delete`, `field-delete`, `close`) ต้องถามผู้ใช้ก่อน — ทำตาม `/delete`
