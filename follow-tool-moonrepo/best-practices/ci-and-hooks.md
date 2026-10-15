# moonrepo — CI Integration and Git Hooks

## Recommended Patterns

### `moon ci` vs `moon run`

- `moon ci` = CI mode — selects only affected targets with `runInCI` enabled, prints a structured summary
- `moon run` = local/dev mode — fully respects cache but doesn't filter by base branch
- Never use `moon run` in the main CI pipeline — it runs unnecessary tasks and wastes time
- Use `moon ci :build :test :lint` to force a target set instead of the default run-everything

### Affected Detection

- affected = projects whose files changed since the base — it needs sufficient git history
- CI checkout must use `fetch-depth: 0` (or at least enough to reach the merge-base) — a shallow clone makes moon see every project as affected, or none at all
- PR pipelines compare the base against `vcs.defaultBranch` — set it in `.moon/workspace.yml` to the real branch (`main`/`dev`)
- Debug affected detection with `moon query affected --base <ref>` before pushing

### Sharding and Reports

- Shard big repos with `moon ci --shard <i>/<total>` or `--job <i>`/`--jobTotal <i>` on matrix jobs
- Keep reports: `moon ci` writes the summary into `.moon/cache` — upload it as an artifact when you must audit which tasks actually ran
- Combine shards at an end-of-pipeline step to aggregate pass/fail

### Git Hooks via `vcs.hooks`

- A moon repo → use `vcs.hooks` in `.moon/workspace.yml` as the default — no external hook manager needed
- Hooks must be fast: always use `--affected` + `--status=staged` — moon already knows the graph + cache
- Generated hooks live in `.moon/hooks` — `sync: true` lets moon set `core.hooksPath` automatically
- If some teammates want to opt out → remove `sync` and have them run `moon sync hooks` themselves, but document it

## Do / Don't

| Do | Don't |
|---|---|
| `fetch-depth: 0` in the CI checkout | Shallow clone then expect affected detection to work |
| Set `runInCI: false` for `dev`/`serve`/watch tasks | Let a persistent task get picked on CI and hang |
| Use `vcs.hooks` for this repo | Add husky/hk on top when moon hooks are sufficient |
| Verify the hook path with `git config core.hooksPath` | Assume hooks are installed because the config exists |
| Run `moon ci` on a test branch before merging a big config change | Edit CI config then merge straight into main |

## Common Pitfalls

- Affected detection comes back empty → wrong defaultBranch, or the base ref isn't in the CI clone
- Hooks don't work after a fresh `git clone` → forgot `sync: true`, or nobody has run a moon command yet (hooks sync on task runs)
- CI slower than local → remote cache isn't set up, or the runner cache dir doesn't persist across jobs
- `runInCI` set with the wrong type → unknown keys may be silently ignored — validate with `moon task` to see the merged output
- Windows contributors: hook scripts are shell — test with `moon sync hooks` then try a real commit on Windows

## Performance Notes

- `moon ci` + remote cache cuts CI time a lot — worth it from ~10+ projects per repo
- Matrix sharding pays off when the test suite exceeds ~10 minutes — below that the spawn overhead costs more
- Slow hooks drive devs to `--no-verify` — keep pre-commit under 5s with `--status=staged` + cache
