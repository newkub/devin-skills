# Use Case — Safe and Unsafe Fix Rollout

> A rewrite is a code change, not a formatting pass: declare how safe the fix is, apply only what you can defend, and roll out in two steps. Source: https://biomejs.dev/reference/gritql/ (accessed 2026-10-20)

## 1. Write a genuinely safe rewrite

```grit
language js(typescript,jsx)

`parseInt($value)` => `parseInt($value, 10)` where {
  register_diagnostic(
    span = $value,
    message = "Pass the radix explicitly",
    severity = "warning",
    fix_kind = safe
  )
}
```

`fix_kind = safe` promises the rewrite preserves behaviour in every case. `parseInt(x)` with an explicit radix 10 is the shape to aim for: no import changes, no naming changes, one local edit.

## 2. Separate the rewrites that change semantics

```grit
language js(typescript,jsx)

`$items.forEach(async ($item) => { $$$body })` as $call => `for (const $item of $items) { $$$body }` where {
  register_diagnostic(
    span = $call,
    message = "forEach does not await the callback — use for-of",
    severity = "error",
    fix_kind = unsafe
  )
}
```

This rewrite changes control flow: `forEach` runs callbacks in parallel and ignores the returned promise, `for-of` awaits each iteration. `fix_kind = unsafe` keeps it out of `--write`, so it is applied only after a human reads the diff.

Unsafe is also the default. A rewrite that forgets `fix_kind = safe` is treated as unsafe, which is the safe default but looks like a broken plugin if you expected `--write` to apply it.

## 3. Apply in two passes

```bash
bunx biome check --write ./src                 # safe fixes only
git diff --stat                                # review the mechanical changes
bunx biome check --write --unsafe ./src        # behaviour-changing fixes
bunx biome check ./src                         # confirm nothing is left
```

Keep the two passes in separate commits. Mixing them makes a mechanical rename and a control-flow change arrive in one diff, and the reviewer has to reconstruct which hunk is which.

## 4. Stage the unsafe pass on a sample

```bash
git switch -c grit-unsafe-fix
bunx biome check --write --unsafe ./src/features/checkout
bunx vitest run ./src/features/checkout
```

Run the unsafe pass on one directory, run its tests, then widen. When a fix breaks a test, the blast radius is one folder instead of the repo, and the offending pattern can be narrowed before the full rollout.

## 5. Prove the rewrite is idempotent

```bash
bunx biome check --write ./src
bunx biome check --write ./src && git diff --quiet && echo "stable"
```

A rewrite that keeps producing changes on the second run is oscillating with the formatter or matching its own output. Fix the pattern before merging, otherwise every future run rewrites the same lines.

## 6. Verify

1. `/run-test` after the safe pass — no behaviour change, tests unchanged
2. `/run-test` after the unsafe pass — the suite is green or the failure explains the semantics change
3. `git diff` — every hunk is a rewrite you can read as "before → after", with no import churn
4. Second `--write` run produces no diff
5. `/run-scan` in CI — the plugin is registered and the rules stay enforced after the rollout

## Pitfalls

- Forgetting `fix_kind = safe`, so `--write` silently skips the fix and the rule looks broken.
- Marking a semantic change as `safe`, then applying it across the repo in one command.
- Rewriting an import specifier with `=>` — GritQL rewrites expressions, not the module graph; use `/use-astgrep` or a codemod for import changes.
- Applying `--unsafe` on a dirty working tree, where the unexpected diff is indistinguishable from your own work.
- Committing safe and unsafe passes together, so the reviewer cannot separate mechanical churn from a logic change.

## Related

- `references/apis.md`
- `best-practices/plugins.md`
- `usecases/custom-lint-rule.md`
- `usecases/structural-search-rewrite.md`
- `usecases/metavariables-and-conditions.md`
