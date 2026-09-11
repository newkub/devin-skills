# Tool Act CLI

## Install

```sh
mise use -g act
```

## Commands

| Command | Description | Options |
|---|---|---|
| `act` | Run default (push) workflows | `-j`, `-W`, `--dryrun` |
| `act -l` | List all jobs | `--graph` |
| `act <event>` | Trigger event (push/pull_request/workflow_dispatch) | `-e event.json` |
| `act -j <job>` | Run specific job | `--matrix key:val` |
| `act -n` | Dry run | - |
| `act --env-file .env` | Load env file | `--secret-file`, `-s` |
| `act -P <platform>=<image>` | Runner image override | micro/medium/large |

## Examples

```sh
act push -j test --env-file .env.test
act pull_request -W .github/workflows/ci.yml
act -P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
```
