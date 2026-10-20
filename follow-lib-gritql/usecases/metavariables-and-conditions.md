# Use Case — Metavariables and Conditions

> Bind the same name twice to express equality, match any argument list with a spread metavariable, and filter matches with `where` before reporting. Source: https://biomejs.dev/reference/gritql/ (accessed 2026-10-20)

## 1. Same metavariable twice means same code

```grit
language js(typescript,jsx)

`expect($x).toBe($x)` as $call where {
  register_diagnostic(
    span = $call,
    message = "Assertion compares a value with itself and always passes",
    severity = "error"
  )
}
```

A metavariable is not a wildcard that matches anything each time — repeating `$x` requires both positions to bind equal code. This is the whole reason the pattern can catch a self-comparison without a `where` condition.

## 2. Match any argument list with $$$

```grit
language js(typescript,jsx)

`$logger.log($$$args)` as $call where {
  register_diagnostic(
    span = $call,
    message = "Use the structured logger, not log()",
    severity = "warning"
  )
}
```

`$args` binds exactly one argument; `$$$args` binds zero or more. A pattern written with `$args` silently skips every call that passes two arguments, which looks like the rule works until someone adds a second parameter.

## 3. Capture the span with as

```grit
language js(typescript)

`if ($cond) { return $cond }` as $stmt where {
  register_diagnostic(span = $stmt, message = "Return the condition directly", severity = "warning")
}
```

Without `as $stmt`, the diagnostic can only point at a sub-node, so the editor underlines a fragment of the line. Capture the outermost match and report that.

## 4. Narrow with where and <:

```grit
language js(typescript,jsx)

`$obj.$method($$$args)` as $call where {
  $method <: or { `then`, `catch` },
  $obj <: not `Promise`,
  register_diagnostic(
    span = $call,
    message = "Promise chaining on a non-Promise value",
    severity = "warning"
  )
}
```

`<:` is "matches pattern". Conditions are comma-separated and all must hold, so the rule stays one block instead of three plugins. `or` / `not` compose inside a single condition.

## 5. Use contains / within for context

```grit
language js(typescript)

`await $call` where {
  $call <: within `for ($init; $cond; $update) { $$$body }`,
  register_diagnostic(span = $call, message = "await inside a loop serializes requests", severity = "warning")
}
```

`within` matches a node inside the surrounding shape; `contains` does the reverse and matches a shape that holds the node. Reach for them instead of copying the whole function body into the snippet.

## 6. Verify

```bash
bunx biome search '`expect($x).toBe($x)`' ./src
```

1. The search returns exactly the known violations
2. Add one deliberate violation to a scratch file — it is reported with the correct line span
3. Remove it — the rule reports nothing, so there is no false positive
4. `/run-scan` — the plugin runs with the rest of the Biome checks and does not slow the scan noticeably

## Pitfalls

- Using `$args` where `$$$args` is needed, so multi-argument calls escape the rule.
- Reusing `$x` across two unrelated positions by accident, which makes the pattern match almost nothing.
- Reporting `span = $value` and underlining one token instead of the statement.
- Writing a `where` condition that never runs because the snippet pattern already failed to match.
- Treating `<:` as assignment — it is a pattern match, comparing code and not a string.

## Related

- `references/apis.md`
- `best-practices/patterns.md`
- `usecases/custom-lint-rule.md`
- `usecases/language-targets-and-biome-nodes.md`
- `usecases/safe-unsafe-fix-rollout.md`
