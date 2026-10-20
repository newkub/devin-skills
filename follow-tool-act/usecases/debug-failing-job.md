# Use Case — Debug a Failing Job Without a CI Round Trip

> Reproduce a red CI job locally, inspect the exact shell and env it ran with, and confirm the fix before pushing. Source: https://nektosact.com/usage/index.html (accessed 2026-10-20)

## 1. Reproduce the same job and event

```bash
act pull_request -j e2e --verbose
```

`-j` selects the job, the event selects the `github.event` payload shape. A `push`-only workflow will not run under `pull_request`.

## 2. See what the step actually ran

`--verbose` prints each step's resolved `run:` script and the working directory. Most "works locally, fails in CI" cases are one of:

- a missing env var (`${{ secrets.X }}` empty locally)
- a different `working-directory`
- a tool present on the host but absent in the image

## 3. Compare environment

```bash
act pull_request -j e2e --env-file .env.local -s GITHUB_TOKEN=$(gh auth token)
```

`-s` sets a single secret. `GITHUB_TOKEN` in particular is not injected automatically — any `gh`/API step fails without it.

## 4. Get a shell in the failed state

```bash
act pull_request -j e2e --reuse
docker ps                          # find the act container
docker exec -it <container> bash   # poke around the workspace copy
```

The repo is bind-mounted at `/github/workspace` — rerun the failing command there with the same env.

## 5. Confirm, then push

Run the same `act` command after the fix, then push once. Do not use `act` as a substitute for a real runner on matrix/OS-specific jobs.

## Pitfalls

- Debugging with `-v` output alone → the container is still available with `--reuse`; inspect it instead of guessing.
- Assuming a passing local run means green CI → missing caches, OIDC tokens, and service containers behave differently on the real runner.
- Secrets in `.actrc` → it is committed; keep secrets in `.secrets` (gitignored) or `-s` flags.
- Running the whole workflow repeatedly → `-j` one job, `--reuse` the container; full runs are slow.

## Related

- `references/cli.md`
- `best-practices/local-actions.md`
- `usecases/run-workflow-locally.md`
