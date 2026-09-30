| key | value |
|---|---|
| repository | https://github.com/nektos/act |
| docs | https://nektosact.com |

| commands | description | default | options |
|---|---|---|---|
| `act` | Run push event workflows | - | -j job, -W workflow |
| `act -l` | List jobs/workflows | - | - |
| `act push` / `pull_request` | Run specific event | - | -e event.json |
| `act -s GITHUB_TOKEN=...` | Pass secrets | - | --secret-file |
| `act -P ubuntu-latest=...` | Custom runner image | medium | catthehacker images |
| `act --container-daemon-socket -` | Skip Docker socket mount | - | - |
