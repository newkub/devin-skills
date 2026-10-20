# Use Case — Structural Search and a Safe Rewrite

> Find every occurrence of a pattern with `biome search`, then migrate it with a plugin rewrite gated behind `--unsafe`. Source: https://biomejs.dev/reference/gritql/ (accessed 2026-10-20)

## 1. Search before changing anything

```bash
bunx biome search '`console.log($message)`' ./src --language=javascript
```

Wrap the pattern in single quotes so the shell does not interpret `$message`. Add globs to narrow the scope:

```bash
bunx biome search '`moment($date)`' './src/**/*.ts' --language=javascript
```

## 2. Confirm the pattern is not too broad

```grit
language js(typescript)

`moment($date)` as $call where {
  register_diagnostic(span = $call, message = "Use date-fns instead of moment", severity = "warning")
}
```

Run `biome check` with only this diagnostic first: the goal is to see the exact list that the rewrite will touch.

## 3. Add the rewrite

```grit
language js(typescript)

`moment($date).format($fmt)` => `format($date, $fmt)` where {
  register_diagnostic(
    span = $date,
    message = "Replace moment.format with date-fns format",
    severity = "warning",
    fix_kind = "unsafe"
  )
}
```

`=>` produces a fixable diagnostic. `fix_kind` defaults to `unsafe`, so the change never applies silently.

## 4. Apply and review

```bash
bunx biome check --write --unsafe ./src
git diff
```

Run the test suite, then commit the rewrite alone so review is a pure diff.

## 5. Handle what the pattern cannot express

Patterns are structural, not semantic. Calls with computed arguments, aliased imports, or dynamic formats usually need a manual follow-up; list them from the remaining diagnostics instead of widening the pattern until it is unsafe.

## Pitfalls

- Running the rewrite before the search → unverified patterns touch unrelated code; always inspect the diagnostic list first.
- Setting `fix_kind = "safe"` for a semantic change → `--write` applies it with no review; keep it unsafe unless it is provably behavior-preserving.
- Rewriting across the whole repo in one commit → an unreviewable diff; scope to a directory or a codemod series.
- Forgetting `--language` → the default engine may parse the file with the wrong grammar and match nothing.

## Related

- `references/apis.md`
- `best-practices/patterns.md`
- `best-practices/plugins.md`
- `usecases/custom-lint-rule.md`
