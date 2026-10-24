# Use Case — Run A Monorepo And Parallel Worktrees

Getting unique hostnames for every workspace package and every branch without editing config per run

## Monorepo: one root config

1. Confirm the workspace layout is discoverable — `pnpm-workspace.yaml` or a `"workspaces"` field in the root `package.json`.
2. Add `portless.json` at the repo root:

```json
{
  "name": "acme",
  "script": "dev"
}
```

3. Run bare `portless` from the root. Every package that has the `dev` script is started; hostnames default to `<package>.<project>.localhost`, where *project* is the most common npm scope, otherwise the root directory name.
4. `portless list` shows one row per package with its port and URL.

Expected result: `https://web.acme.localhost`, `https://api.acme.localhost`, and so on — no port numbers anywhere.

## Per-package overrides

Only add overrides where the defaults are wrong:

```json
{
  "name": "acme",
  "apps": {
    "apps/web": { "name": "web" },
    "apps/api": { "name": "api", "script": "start" },
    "apps/docs": { "name": "docs", "proxy": false }
  }
}
```

`"proxy": false` runs a non-serving package (build watcher, type checker) without registering a route.

## Turborepo

Keep the `dev` script delegating to portless so `turbo run dev` still works, and point portless at the real command:

```json
{
  "scripts": {
    "dev": "portless",
    "dev:app": "turbo run dev --parallel"
  },
  "portless": { "script": "dev:app" }
}
```

Portless uses Turbo when `turbo.json` / `turbo.jsonc` is readable. If the delegation misbehaves, set `"turbo": false` to spawn processes directly.

## Parallel worktrees

1. Create a worktree as usual: `git worktree add ../acme-feature -b feature/login`.
2. `cd` into it and run `portless run` — or bare `portless`.
3. The branch becomes a prefix: `https://feature-login.web.acme.localhost`.

The main checkout keeps the bare hostnames, so both trees run at once with no `--force` and no port juggling. `portless get web` inside the worktree returns the prefixed URL; add `--no-worktree` when you deliberately want the unprefixed one.

## Verify

| No. | Check | Command | Expect |
|---|---|---|---|
| 1 | proxy healthy | `portless doctor` | proxy, CA, hosts all pass |
| 2 | routes registered | `portless list` | one row per running package |
| 3 | URL resolves | `curl -I "$(portless get web)"` | `HTTP/2 200` |
| 4 | worktree isolation | `portless get web` in each tree | different hostnames |

Source: https://portless.sh/ (accessed 2026-10-24)
