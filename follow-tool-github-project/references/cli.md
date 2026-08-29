# GitHub Projects CLI (gh project)

## Install

```sh
bun add -D gh
```

## Version

- Latest
- Repository: https://github.com/cli/cli
- Docs: https://cli.github.com/manual/gh_project

## Commands

| commands | description | default | options |
|---|---|---|---|
| `gh project create` | Create project | — | --owner, --title, --closed |
| `gh project list` | List projects | — | --owner, --limit |
| `gh project view <number>` | View project | — | --owner, --closed |
| `gh project item-list <number>` | List items | — | --owner, --limit |
| `gh project item-add <number>` | Add item | — | --owner, --content, --url |
| `gh project item-edit <id>` | Edit item | — | --owner, --field, --text, --single-select-option |
| `gh project item-delete <id>` | Delete item | — | --owner, --project-id, --yes |
| `gh project field-list <number>` | List fields | — | --owner |
## Examples

```sh
gh project list --owner myorg
```
```sh
gh project create --title "Roadmap"
```
```sh
gh project item-add 5 --url https://github.com/org/repo/issues/1
```
