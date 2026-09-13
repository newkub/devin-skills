# Tool Github Actions API & Dependencies

GitHub Actions เป็น hosted platform — ไม่มี package ให้ติดตั้ง; CLI ที่เกี่ยวข้องคือ `gh` (GitHub CLI) สำหรับจัดการ workflows/runs และ `actionlint` สำหรับ lint workflow files

## Install

```sh
# gh — GitHub CLI binary (npm package `gh` ไม่ใช่ตัวจริง)
mise use -g gh
# or
winget install GitHub.cli

# actionlint — workflow linter
mise use -g actionlint
```

## Version

- Latest: gh CLI `2.100.0` (github.com/cli/cli, verified 2026-09-13) — หมายเหตุ: npm package `gh` ไม่ใช่ GitHub CLI ตัวจริง ติดตั้งผ่าน `mise use -g gh` หรือ https://cli.github.com
- actionlint `1.7.12` (github.com/rhysd/actionlint, verified 2026-09-13)
- [Repository (gh)](https://github.com/cli/cli)
- [Repository (actionlint)](https://github.com/rhysd/actionlint)

## Dependencies

- `gh` เป็น static binary — ไม่มี npm transitive dependencies
- Actions ที่ pin ใน SKILL.md: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/cache@v6`, `actions/upload-artifact@v7`

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `gh workflow list` | List workflows | current repo | -R/--repo, -a/--all |
| `gh workflow run <id>` | Trigger `workflow_dispatch` | — | -f/--field, -r/--ref |
| `gh workflow view <id>` | View workflow YAML/summary | — | -y/--yaml |
| `gh workflow enable/disable <id>` | Toggle workflow | — | -R/--repo |
| `gh run list` | List workflow runs | — | -b/--branch, -s/--status, -w/--workflow |
| `gh run view <id>` | View run; `--log` for logs | — | --log, --exit-status, -j/--job |
| `gh run watch <id>` | Watch run until done | — | --exit-status, -i/--interval |
| `gh run rerun <id>` | Rerun run | — | --failed, --debug |
| `gh run download <id>` | Download artifacts | — | -n/--name, -D/--dir |
| `gh secret set/list` | Manage repo secrets | — | --body, --env, -R/--repo |
| `actionlint` | Lint workflow files | `.github/workflows/` | -oneline, -ignore, -shellcheck |

## Source

- Official docs: https://docs.github.com/en/actions
- gh manual: https://cli.github.com/manual/gh_workflow
- actionlint: https://rhysd.github.io/actionlint/
