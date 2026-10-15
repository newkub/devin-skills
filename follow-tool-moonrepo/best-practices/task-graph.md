# moonrepo — Task Graph and Project Boundaries

## Recommended Patterns

### Task Naming and deps

- Use the same task names in every project (`build`, `test`, `lint`, `typecheck`) — `moon run :build` fans out to every project that has that task
- Use `deps: ["^:build"]` when a project needs upstream dependency artifacts first — moon always finishes upstream tasks before
- Use same-project deps (`deps: ["codegen"]`) for ordering within one project — don't chain with `&&` in `command` because cache and parallelism won't work
- Declare `deps` completely from the start — a graph missing a dep causes race conditions that cost more to debug than to declare

### inputs / outputs

- Every build task needs `outputs` (`dist`, `build`, `.next/**`) — no `outputs` = no cache restore
- `inputs` defaults to the project's `**/*` — narrow it when a task shouldn't re-run from unrelated files, e.g. `inputs: ['src/**/*', 'package.json']`
- Tasks that produce no artifact (`test`, `lint`) can still be cached — stdout/stderr is replayed from cache
- Don't put `outputs` pointing outside the project dir — the hash becomes unstable and the cache hit rate drops

### Shared config via `.moon/tasks/`

- Tasks reused across all projects go in `.moon/tasks/all.yml` — each project's `moon.yml` overrides only what genuinely differs
- Use `tags` in `moon.yml` with tag-scoped tasks (e.g. `.moon/tasks/tag-frontend.yml`) so `dev`/`serve` exist only on frontend projects
- Use explicit `dependsOn` when projects really reference each other — implicit detection from manifest deps works, but explicit is clearer in mixed-stack repos

### Toolchain

- Pin the toolchain in `.moon/toolchains.yml` so moon manages versions — the team gets one version without relying on global installs
- If `mise`/`proto` already manages the toolchain → disable moon's auto-install for that tool so it isn't downloaded twice

## Do / Don't

| Do | Don't |
|---|---|
| Run `moon run :<task>` through the task graph | Write a script that loops into each package itself |
| Declare `deps` per the code's real dependencies | Rely on ordering from project names or luck |
| Use `--affected` for a local check before push | Run `:build :test` across the whole repo on every tiny change |
| Use `moon query projects` / `moon task` to debug the graph | Edit config then guess the graph is correct |
| Keep shared tasks in `.moon/tasks/` | Copy-paste the same task into every `moon.yml` |

## Common Pitfalls

- `moon run project:build` failing because a dep build didn't finish → that task is missing `deps: ["^:build"]`
- Cache never hits though nothing changed → `inputs` too broad, or a generated file that changes every run sits in the input set
- An env-dependent task (reading a frequently changing `process.env`) must declare env in `inputs` or `options.envFile` — otherwise moon caches wrongly
- A `dev`/`start` task that never exits needs `options.persistent = true` — otherwise dependents wait forever
- Don't accidentally define the same task in both `.moon/tasks/all.yml` and `moon.yml` without intending a merge — read the merged config with `moon task <id>:<task>` before debugging

## Performance Notes

- `--affected` uses git diff vs the base — it needs a correct branch point (`vcs.defaultBranch`)
- Tune `runner.implicitDeps` / concurrency in `.moon/workspace.yml` when the machine is weak or CI has limited CPU
- Remote caching (`.moon/workspace.yml` → `runner.cache`/`unstable_remote`) pays off when the team is >2 people or CI is heavy — the local cache alone already helps a lot
- Avoid tasks whose `command` is a long shell script — split it into a file in `scripts/` and call it, so diffs read easily and the hash stays stable

## CI Notes

- Use `moon ci` only on CI — it runs only affected tasks that have `runInCI` enabled
- A shallow clone breaks `--affected` — use `fetch-depth: 0` or `filter: 'blob:none'`
- Set `runInCI: false` for persistent tasks (`dev`, `serve`) — off by default already, but watch for custom tasks people forget
