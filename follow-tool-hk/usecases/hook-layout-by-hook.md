# Use Case — Give Each Hook One Job

> A hook that does everything gets bypassed; a hook that does one visible thing gets trusted. The split that survives is: pre-commit fixes, pre-push verifies, pre-merge-commit typechecks. Sources: https://hk.jdx.dev and `hk --help` (accessed 2026-10-21)

## 1. Decide the split before writing config

| Hook | Job | Cost budget |
|------|-----|-------------|
| `pre-commit` | fix the staged files only | under a second per file |
| `pre-push` | run the workspace checks | tens of seconds |
| `pre-merge-commit` | the one check a merge can break | one command |
| `check` / `fix` | the same steps, called by a human or CI | no budget |

Anything that takes longer than the push it protects will be disabled. Put the slow, whole-repo steps in `pre-push`, never in `pre-commit`.

## 2. Pre-commit: staged files, fix in place

```pkl
local linters = new Mapping<String, Step> {
  ["biome"] {
    glob = List("*.{ts,tsx,js,jsx,json,jsonc,md}")
    exclude = List("/.agents/", "/.devin/")
    check = "bunx biome check --no-errors-on-unmatched {{files}}"
    fix = "bunx biome check --write --no-errors-on-unmatched {{files}}"
    batch = true
  }
}

hooks {
  ["pre-commit"] {
    fix = true
    steps {
      ...linters
    }
  }
}
```

`{{files}}` is the staged set, so the step never touches a file the commit does not contain. `batch = true` passes all files to one process instead of one process per file — the difference between 300 ms and 20 s on a large commit.

## 3. Pre-push: whole-workspace checks

```pkl
local checks = new Mapping<String, Step> {
  ["typecheck"] {
    check = "bun run typecheck"
    stomp = true
  }
  ["test"] {
    check = "bun run test"
    stomp = true
  }
}

hooks {
  ["pre-push"] {
    steps {
      ...checks
    }
  }
}
```

`stomp = true` lets independent steps run at the same time instead of queueing behind one file lock. A check that reads the whole repo has no reason to wait for another check that reads the whole repo.

## 4. Pre-merge-commit: the single expensive check

```pkl
hooks {
  ["pre-merge-commit"] {
    steps {
      ["typecheck"] = checks["typecheck"]
    }
  }
}
```

The hook name must be exactly `pre-merge-commit`; `pre-merge` is not a git hook and silently never runs.

## 5. Expose the same steps to CI and to humans

```sh
hk check --all
hk fix
```

The `check` and `fix` hooks are the whole pipeline in two commands. CI runs `hk check --all`; a developer runs `hk fix` and commits the result. Both use the config that the git hooks use, so a green CI cannot disagree with a green commit.

## 6. Verify

1. `hk validate` — the config compiles before any hook runs
2. `hk run pre-commit` — a staged file with a formatting error is rewritten and staged
3. `hk run pre-push` — the workspace checks run and fail on a real error
4. `hk run pre-merge-commit` — only the typecheck runs
5. `hk check --all` — the same steps as CI, on the same config
6. Run `/run-verify` after the setup to confirm lint, typecheck, and scan still pass

## Pitfalls

- Putting the test suite in `pre-commit` — every commit becomes a coffee break and `HK=0 git commit` becomes the habit.
- `fix = true` on `pre-push`: a push is not a place to rewrite the working tree.
- Omitting `glob` on a file-based linter, so it runs over the whole repo on every commit.
- Omitting `batch = true` for a formatter that accepts many files, turning one process into hundreds.
- Naming a hook `pre-merge` and assuming it runs.
- Duplicating step definitions between `pre-commit` and `check` instead of reusing one mapping, which is how hooks drift apart from CI.
- Running a destructive fixer without `effect = "destructive"`, so hk cannot prompt before overwriting files.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/hk.md`
- `usecases/monorepo-and-agent-hooks.md`
