# Use Case — Replace Chained Scripts With Cached Tasks

> A chain of shell commands re-runs everything every time. A `[tasks]` graph with `depends`, `sources`, and `outputs` runs only what changed, and states the order in one place instead of in a `&&` chain. Source: https://mise.jdx.dev/cli/ (accessed 2026-10-21)

## 1. Declare the graph

```toml
[tasks.build]
run = "bun run build"
sources = ["src/**/*", "package.json"]
outputs = ["dist/**"]

[tasks.test]
run = "bun run test"
depends = ["build"]

[tasks.lint]
run = "bun run lint"

[tasks.check]
depends = ["build", "test", "lint"]
```

`depends` runs before the task; `depends_post` runs after. A task with no `run` is a pure aggregator — `check` above only sequences the three that do the work.

## 2. Give each task its inputs and outputs

`sources`/`outputs` are what make the task cacheable: when nothing in `sources` is newer than `outputs`, mise skips the run. Omit `outputs` and the task always runs.

```toml
[tasks.build]
run = "bun run build"
sources = ["src/**/*", "vite.config.ts", "package.json"]
outputs = ["dist/**"]
```

## 3. Run with the flags that matter day to day

```bash
mise run check            # the whole graph
mise run -n build         # dry run, prints what would execute
mise run -j 4 check       # allow 4 parallel jobs
mise run -c check         # continue past a failing task and report all
mise run test -- --watch  # pass arguments through to the task
```

## 4. Watch one task while editing

```bash
mise watch -t test
```

`-t` selects the task to re-run; `-g` narrows the watched glob when the default set is too wide.

## 5. Confirm the cache actually works

```bash
mise run build
stat -c %Y dist        # record the output mtime
mise run build         # must be skipped
stat -c %Y dist        # second stamp must equal the first

touch src/index.ts
mise run build         # must run again
```

A second run over untouched sources must not re-execute the command — the output mtime is the only reliable proof. On Windows, read the same stamp with `(Get-Item dist).LastWriteTimeUtc`.

## 6. Verify

1. `mise tasks` lists every task; `mise tasks --json` when a script needs to read them
2. `mise run check` green from a clean checkout
3. Cache behaviour proved twice: unchanged sources → skipped, one changed file → runs
4. `mise run -n check` on a fresh clone prints the same order CI runs
5. No task duplicates a `package.json` script without a reason (cross-language work is a reason)

## Pitfalls

- `outputs` missing or pointing at a directory the glob also lists in `sources` — the task never caches, or re-runs on its own output.
- Caching a task whose output depends on an env var that is not part of the key: the cache serves a build from different settings.
- Pinning a task to `bash` while the project also runs on Windows — use the task's `shell` explicitly when it matters.
- Chaining `&&` inside `run` when `depends` expresses the same thing and can parallelize.
- Secrets written into `[env]` so every task inherits them — keep secrets in the secret manager and non-secret env in `[env]`.

## Related

- `references/cli.md`
- `references/apis.md`
- `best-practices/mise.md`
- `workflows/config-tools/SKILL.md`
- `usecases/ci-toolchain-pin.md`
