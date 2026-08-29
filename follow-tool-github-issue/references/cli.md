# GitHub Issues CLI (gh)

## Install

```sh
bun add -D gh
```

## Version

- Latest
- Repository: https://github.com/cli/cli
- Docs: https://cli.github.com/manual/gh_issue

## Commands

| commands | description | default | options |
|---|---|---|---|
| `gh issue list` | List issues | — | -R, --repo, -s, --state, -l, --label, -a, --assignee |
| `gh issue create` | Create issue | — | -R, --repo, -t, --title, -b, --body, -l, --label, -a, --assignee |
| `gh issue view <id>` | View issue | — | -R, --repo, --comments, --json |
| `gh issue close <id>` | Close issue | — | -R, --repo, -c, --comment, -r, --reason |
| `gh issue reopen <id>` | Reopen issue | — | -R, --repo, -c, --comment |
| `gh issue comment <id>` | Comment on issue | — | -R, --repo, -b, --body, -e, --edit-last |
| `gh issue edit <id>` | Edit issue | — | -R, --repo, -t, --title, -b, --body, --add-label |
| `gh issue delete <id>` | Delete issue | — | -R, --repo, --yes |
## Examples

```sh
gh issue list --state open
```
```sh
gh issue create -t "Bug" -b "desc"
```
```sh
gh issue close 123
```
