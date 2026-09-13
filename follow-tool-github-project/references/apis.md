# Tool Github Project API & Dependencies

`gh project` เป็น subcommand ของ GitHub CLI — ไม่มี package แยก (npm package `gh` ไม่ใช่ตัวจริง)

## Install

```sh
mise use -g gh
# or
winget install GitHub.cli
# then
gh auth login && gh auth refresh -s project
```

## Version

- Latest: gh CLI `2.100.0` (github.com/cli/cli, verified 2026-09-13)
- [Repository](https://github.com/cli/cli)
- [Manual](https://cli.github.com/manual/gh_project)

## Dependencies

- `gh` เป็น static binary — ไม่มี npm transitive dependencies
- ต้องการ token scope `project` (`gh auth refresh -s project`)

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `gh project list` | List projects | — | --owner, --limit, --closed, --format |
| `gh project view <number>` | View project | — | --owner, --web, --format |
| `gh project create` | Create project | interactive on TTY | --owner, --title, --format |
| `gh project edit <number>` | Edit project | — | --owner, --title, --description, --visibility, --readme |
| `gh project close <number>` | Close/reopen project | — | --owner, --undo |
| `gh project copy <number>` | Duplicate project | — | --owner, --title, --drafts |
| `gh project mark-template <number>` | Mark/unmark template | — | --owner, --undo |
| `gh project link/unlink <number>` | Link repo or team | — | --owner, --team |
| `gh project delete <number>` | Delete project (destructive) | — | --owner |
| `gh project item-list <number>` | List items | — | --owner, --limit, --query, --format |
| `gh project item-add <number>` | Add issue/PR by URL | — | --owner, --url, --format |
| `gh project item-create <number>` | Create draft item | — | --owner, --title, --body, --format |
| `gh project item-edit [<number>]` | Edit item field | — | name-based: --owner/--url/--field/--value; ID-based: --id/--field-id/--project-id; typed: --text/--number/--date/--single-select-option-id/--iteration-id/--clear |
| `gh project item-archive <number>` | Archive/unarchive item | — | --owner, --id, --undo |
| `gh project item-delete <number>` | Delete item (destructive) | — | --owner, --id |
| `gh project field-list <number>` | List fields + IDs | — | --owner, --format |
| `gh project field-create <number>` | Create field | — | --owner, --name, --data-type (TEXT/SINGLE_SELECT/DATE/NUMBER), --single-select-options |
| `gh project field-delete <number>` | Delete field (destructive) | — | --owner, --id |

## Source

- Official docs: https://cli.github.com/manual/gh_project
- GitHub Projects docs: https://docs.github.com/en/issues/planning-and-tracking-with-projects
