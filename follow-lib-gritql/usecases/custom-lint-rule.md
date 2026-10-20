# Use Case — Add a Custom GritQL Lint Rule to Biome

> Turn a house rule into a real diagnostic that runs with the rest of the Biome checks. Source: https://biomejs.dev/reference/gritql/ (accessed 2026-10-20)

## 1. Write the plugin

```grit
language js(typescript)

`console.log($message)` as $call where {
  register_diagnostic(
    span = $call,
    message = "Use the project logger instead of console.log",
    severity = "error"
  )
}
```

Save as `.grit/no-console-log.grit`. `$message` and `$call` are metavariables; `as $call` captures the span reported in the diagnostic.

## 2. Register it in Biome

```jsonc
// biome.jsonc
{
  "plugins": ["./.grit/no-console-log.grit"]
}
```

## 3. Scope the rule to real violations

```grit
language js(typescript,jsx)

or {
  `console.log($$$args)`,
  `console.debug($$$args)`
} as $call where {
  register_diagnostic(span = $call, message = "No debug logging in src", severity = "warning")
}
```

`$$$args` matches any argument list; `or` keeps one rule for several call shapes.

## 4. Run and verify

```bash
bunx biome check ./src
bunx biome check --write ./src   # applies only safe fixes
```

Add the check to CI so the rule cannot regress. Confirm a known violation fails locally before enabling it repo-wide.

## 5. Keep the rule fast

Match a specific call shape instead of walking every node, and avoid open patterns such as `` `$fn($args)` `` that match every call in the codebase.

## Pitfalls

- Registering the plugin with a relative path from the wrong working directory → Biome silently loads nothing; run from the config root.
- Using `engine biome(1.0)` without checking node names → patterns match nothing when the AST name differs.
- Writing one broad pattern for unrelated cases → slow scans and false positives; split per call shape.
- Expecting `biome search` to fix code → search is read-only; rewrites live in plugins.

## Related

- `references/apis.md`
- `best-practices/patterns.md`
- `best-practices/plugins.md`
- `usecases/structural-search-rewrite.md`
