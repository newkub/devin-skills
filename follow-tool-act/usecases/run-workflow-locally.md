# Use Case — Run the Workflow Locally Before Pushing

> Catch YAML, script and environment mistakes on your machine instead of burning CI minutes on every attempt. Source: https://nektosact.com/usage/index.html (accessed 2026-10-20)

## 1. Pin the runner image once

```bash
# .actrc — committed, so every developer runs the same image
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
```

Without `-P`, `act` uses a minimal image and your workflow fails on missing tools (`bun`, `jq`) that the real runner has.

## 2. List, then dry-run

```bash
act -l                     # workflows + jobs + events
act pull_request -n        # dry-run: shows the job graph, executes nothing
```

## 3. Run the job with real secrets

```bash
act pull_request -j test \
  --secret-file .secrets \
  --env-file .env.local \
  --container-options "--network host"
```

`.secrets` is `KEY=value` per line and must be gitignored. `--network host` is needed when the service must reach a local database.

## 4. Iterate fast

```bash
act pull_request -j test --reuse      # reuse the container between runs
act pull_request -j test -v           # verbose: see each step's shell command
```

## 5. Keep it in sync with CI

```bash
act push -j build --eventpath .github/events/push.json
```

An event payload file reproduces event-specific fields (`github.event.*`) that a bare local run leaves empty.

## Pitfalls

- No `--secret-file` → secrets resolve to empty strings and steps fail with confusing auth errors.
- Expecting `actions/cache` to work → `act` has no cache server; cache steps fail or silently miss.
- macOS/Windows runners (`macos-latest`, `windows-latest`) → unsupported; keep those jobs out of the local path.
- Local paths in `docker` actions or `uses: ./...` → resolved relative to the repo copy inside the container, not your host.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/local-actions.md`
- `usecases/debug-failing-job.md`
