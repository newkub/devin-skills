# act Best Practices

Guidance for using `act` (nektos/act) to run GitHub Actions locally efficiently — cutting debug time and avoiding common pitfalls

## Recommended Patterns

### Run Discipline

- Always run `act -n` (dry run) first to see the execution plan — a wrong plan wastes image pulls and container runs for nothing
- Run only the job you changed with `act <event> -j <job>`, not the whole workflow every time
- Use `--matrix` to run a single matrix combination, e.g. `act -j test --matrix node:20` instead of the full matrix
- Use `-W <path>` to select a workflow file only when the repo has multiple workflows
- Provide a real event payload with `-e event.json` when the workflow reads `github.event` fields such as `pull_request.number` or `workflow_dispatch.inputs`

### Image Selection

- The default micro image (`node:16-buster-slim` based) is light but missing many tools — if the job uses `python`, `gcc`, or common system tools, switch to a medium or large image
- The medium image `ghcr.io/catthehacker/ubuntu:act-latest` is the best value for general work — enough tools yet still smaller than the full image (large can exceed 20GB)
- Map only the platforms you use: `-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest` instead of overriding every platform
- On ARM machines (Apple Silicon) always add `--container-architecture linux/amd64` to mimic GitHub-hosted runners

### Secrets And Env

- Separate secrets from env: secrets via `-s KEY=value` or `--secret-file`; regular env via `--env-file`
- Use a gitignored `.env` or `.secrets` file instead of passing long `-s` flags every time
- `act` creates a fake `GITHUB_TOKEN` automatically — if a step calls real GitHub APIs, pass a real token via `-s GITHUB_TOKEN=$(gh auth token)`, but be careful not to log it
- Set `.actrc` at the repo root for default flags such as platform maps and container architecture — the team gets one shared config (committable, but never with secrets)

## Common Pitfalls

| Pitfall | Symptom | How to avoid |
|---|---|---|
| Docker daemon not running | `Cannot connect to the Docker daemon` | always check `docker info` first |
| `runs-on: windows/macos` | job doesn't run or maps wrongly | act runs Linux containers only — skip these jobs, test them on the remote |
| OIDC / `id-token: write` | token request fails | act doesn't support OIDC — mock or skip that step |
| Some reusable workflow shapes | parse/resolve error | inline the workflow or test on the remote instead |
| Empty `github.event` | inputs/paths are null | pass `-e event.json` with complete fields |
| Very slow first pull | looks hung | large images are several GB — use the medium image or pull in advance |
| Artifacts/cache across jobs | next job can't find files | use `--artifact-server-path` for artifacts; actions/cache needs an extra cache server |
| Host paths in the container | volume mount missed | use `--bind` so the workspace is mounted instead of copied |

## Do / Don't

| Do | Don't |
|---|---|
| dry run (`-n`) before running for real | run every workflow on every YAML edit |
| keep `.secrets` in `.gitignore` | commit a secrets file or pass `-s` inside a committed script |
| compare with the real runner when logs differ | assume passing act means passing GitHub |
| separate workflow bugs from act limitations | reshape the workflow to satisfy act until remote behavior breaks |
| use `-v` when logs aren't enough | leave verbose on until logs become unreadable |

## Performance And CI Notes

- The first run is slow due to image pulls — later runs are fast thanks to Docker cache; `--reuse` reuses the same container (leftover state — beware stale artifacts)
- The `--rm` default removes the container after the run — good for CI-clean behavior but hard to debug; to inspect inside, run a single job then exec into the container before it closes
- Matrix jobs run sequentially in act — for a large matrix, always filter with `--matrix`
- Use act as a pre-push gate in your local workflow; don't run act in real CI (it duplicates the real runner)
- Long output → pipe through `tee` to keep the log for later comparison with the remote run

## Config Guidance

`.actrc` (per-repo, committable):

```text
-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
--env-file .env
```

- One flag per line; comment with `#`
- Add `.env`, `.secrets`, `event.json` (if it carries credentials) to `.gitignore`
- Keep an `event.json` template in the repo, e.g. `.github/act/pull_request.json`, so the team uses the same payload
