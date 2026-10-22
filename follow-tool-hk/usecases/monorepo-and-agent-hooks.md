# Use Case — Monorepo Subprojects And Agent Stop Hooks

> In a monorepo the hook must resolve the workspace it is running in; when an agent is the one committing, it must also run on the files the agent touched, without a terminal to babysit. Sources: https://hk.jdx.dev and `hk --help` (accessed 2026-10-21)

## 1. Let subprojects own their own config

```pkl
subprojects {
  ["apps/web"] {
    config = "hk.pkl"
  }
  ["packages/core"] {
    config = "hk.pkl"
  }
}
```

A subproject resolves its own `hk.pkl` and its own per-directory `mise` environment, so a workspace can add a linter without editing the root config, and the root does not need to know every workspace's toolchain.

## 2. Run each step in its workspace, not from the root

```pkl
["typecheck"] {
  dir = "{{workspace}}"
  check = "bun run typecheck"
  stomp = true
}
```

`dir` is a Tera template, so `{{workspace}}` resolves per subproject. This replaces `cd {{workspace}} && bun run typecheck`, which breaks the moment the workspace name contains a path segment that needs quoting.

## 3. Give an agent a hook it can actually run

```sh
hk check --unstaged
```

`--unstaged` checks only unstaged and untracked files. That is the right scope for an agent Stop hook: the agent just wrote those files, and the whole-repo check would report problems the agent did not cause and cannot see. A full `hk check --all` still belongs in CI.

## 4. Print the integration instead of hand-writing it

```sh
hk agent
hk mcp
```

`hk agent` prints ready-made snippets for the agent harness (instructions, hook entry points, MCP registration) and touches no config, so it is safe to run inside an agent session. `hk mcp` starts the MCP server with an interactive dashboard when the harness would rather call tools than shell commands.

## 5. Declare the steps that destroy work

```pkl
["organize-imports"] {
  glob = List("*.{ts,tsx}")
  fix = "bunx biome check --write --unsafe {{files}}"
  effect = "destructive"
}
```

A step marked `effect = "destructive"` makes hk require confirmation in agent and MCP contexts. Without it, an agent-facing hook can rewrite files with no human in the loop — the one place a hook is more dangerous than useful.

## 6. Verify

1. `hk config dump` from the root and from each subproject — the effective config must differ only where intended
2. `hk run pre-commit` inside a workspace — the step runs with that workspace as its directory
3. Touch a file and run `hk check --unstaged` — only that file is checked
4. Stage everything and run `hk check --all` — the full set runs
5. `hk agent` — the printed snippet matches the hooks the repo actually installs

## Pitfalls

- A root-only config for a monorepo whose workspaces have different tools — every workspace gets the union of all linters.
- `cd {{workspace}} && …` instead of `dir`, which hides the working directory from hk and breaks caching and stampede control.
- Pointing an agent Stop hook at `hk check --all`, so the agent is blamed for pre-existing failures and starts ignoring the hook.
- Forgetting `effect = "destructive"` on a fixer that rewrites or deletes files.
- Adding a subproject but not installing hooks inside it, so its config is never executed.
- Running `hk agent` expecting it to modify config — it is read-only by design; wiring it in is a separate step.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/hk.md`
- `usecases/hook-layout-by-hook.md`
