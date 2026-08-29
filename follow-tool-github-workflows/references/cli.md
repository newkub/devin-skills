# GitHub Workflows CLI (gh)

## Install

```sh
bun add -D gh
```

## Version

- Latest
- Repository: https://github.com/cli/cli
- Docs: https://cli.github.com/manual/gh_workflow

## Commands

| commands | description | default | options |
|---|---|---|---|
| `gh workflow list` | List workflows | — | -R, --repo, -a, --all |
| `gh workflow view <id>` | View workflow YAML | — | -R, --repo, -y, --yaml |
| `gh workflow run <id>` | Trigger workflow | — | -R, --repo, -f, --field, -r, --ref |
| `gh run list` | List runs | — | -R, --repo, -b, --branch, -s, --status |
| `gh run view <id>` | View run | — | -R, --repo, --log, --exit-status, --json |
| `gh run logs <id>` | Download logs | — | -R, --repo, --dir |
## Examples

```sh
gh workflow view ci.yml -y
```
```sh
gh workflow run deploy.yml -r main
```
```sh
gh run view 123 --log
```
