| key | value |
|---|---|
| install | `mise use -g gh # or https://cli.github.com — npm package `gh` ไม่ใช่ตัวจริง` |
| repository | https://github.com/cli/cli |
| docs | https://cli.github.com/manual/gh_project |

| commands | description | default | options |
|---|---|---|---|
| `gh project list` | List projects | — | --owner, --limit, --closed, --format, --web |
| `gh project view <number>` | View project | — | --owner, --web, --format |
| `gh project create` | Create project | interactive on TTY | --owner, --title, --format |
| `gh project edit <number>` | Edit project | — | --owner, --title, --description, --visibility, --readme |
| `gh project close <number>` | Close/reopen project | — | --owner, --undo |
| `gh project copy <number>` | Duplicate project | — | --owner, --title, --drafts |
| `gh project mark-template <number>` | Mark/unmark as template | — | --owner, --undo |
| `gh project link <number>` | Link repo or team | — | --owner, --team |
| `gh project unlink <number>` | Unlink repo or team | — | --owner, --team |
| `gh project delete <number>` | Delete project (destructive) | — | --owner |
| `gh project item-list <number>` | List items | — | --owner, --limit, --query, --format |
| `gh project item-add <number>` | Add issue/PR by URL | — | --owner, --url, --format |
| `gh project item-create <number>` | Create draft item | — | --owner, --title, --body, --format |
| `gh project item-edit [<number>]` | Edit item field | — | name-based: --owner, --url, --field, --value; ID-based: --id, --project-id, --field-id; values: --text, --number, --date, --single-select-option-id, --iteration-id, --clear; also --title, --body (draft) |
| `gh project item-archive <number>` | Archive/unarchive item | — | --owner, --id, --undo |
| `gh project item-delete <number>` | Delete item (destructive) | — | --owner, --id |
| `gh project field-list <number>` | List fields and field IDs | — | --owner, --format |
| `gh project field-create <number>` | Create field | — | --owner, --name, --data-type (`TEXT`, `SINGLE_SELECT`, `DATE`, `NUMBER`), --single-select-options |
| `gh project field-delete <number>` | Delete field (destructive) | — | --owner, --id |
