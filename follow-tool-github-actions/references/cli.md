| key | value |
|---|---|
| install | `mise use -g gh # or https://cli.github.com — npm package `gh` ไม่ใช่ตัวจริง` |
| repository | https://github.com/cli/cli |
| docs | https://cli.github.com/manual/gh_workflow |

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
| `gh run view <id> --log` | View run logs | — | --log-failed, -j, --job |
| `gh run download <id>` | Download artifacts | — | -R, --repo, -n, --name, -D, --dir |
| `gh run cancel <id>` | Cancel run | — | -R, --repo |
| `gh run delete <id>` | Delete run | — | -R, --repo |
| `gh secret list` | List secrets | — | -R, --repo, -e, --env |
| `gh secret set <name>` | Set secret | — | --body, --env-file, -R, --repo |
| `gh variable list` | List variables | — | -R, --repo, -e, --env |
