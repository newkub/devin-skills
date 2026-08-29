# GitHub Actions CLI (gh)

## Install

```sh
bun add -D gh # or https://cli.github.com
```

## Version

- Latest
- Repository: https://github.com/cli/cli
- Docs: https://cli.github.com/manual/gh_workflow

## Commands

| commands | description | default | options |
|---|---|---|---|
| `gh workflow list` | List workflows | — | -R, --repo, -a, --all |
| `gh workflow view <id>` | View workflow | — | -R, --repo, -y, --yaml |
| `gh workflow run <id>` | Run workflow | — | -R, --repo, -f, --field, -r, --ref |
| `gh workflow disable <id>` | Disable workflow | — | -R, --repo |
| `gh workflow enable <id>` | Enable workflow | — | -R, --repo |
| `gh run list` | List workflow runs | — | -R, --repo, -b, --branch, -s, --status |
| `gh run view <id>` | View run | — | -R, --repo, --log, --exit-status |
| `gh run watch <id>` | Watch run | — | -R, --repo, --exit-status |
| `gh run rerun <id>` | Rerun run | — | -R, --repo, --failed, --debug |
| `gh run logs <id>` | Download logs | — | -R, --repo, --dir |
## Examples

```sh
gh workflow list
```
```sh
gh run list --status in_progress
```
```sh
gh workflow run ci.yml -f env=staging
```
