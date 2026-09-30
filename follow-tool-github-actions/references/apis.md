| key | value |
|---|---|
| install | `mise use -g gh` |
| repository | https://github.com/rhysd/actionlint |
| docs | https://docs.github.com/en/actions |

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
