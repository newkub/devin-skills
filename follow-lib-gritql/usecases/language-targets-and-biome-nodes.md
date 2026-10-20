# Use Case — Language Targets and Biome Nodes

> One rule engine, four languages: pick the target, add flavors when the syntax needs them, and drop to Biome node matchers when a snippet is too coarse. Source: https://biomejs.dev/reference/gritql/ (accessed 2026-10-20)

## 1. Declare the language and its flavors

```grit
language js(typescript,jsx)

`$obj.$method($$$args)` as $call where {
  register_diagnostic(span = $call, message = "Audit this call site", severity = "info")
}
```

`language js` alone parses plain JavaScript, so TypeScript syntax such as `as const` or a typed parameter fails to parse and the pattern silently matches nothing. Add `typescript` and `jsx` whenever the codebase contains them.

## 2. Target CSS with a regex value test

```grit
language css

`color: $value` where {
  $value <: r"#[0-9a-fA-F]{3,8}",
  register_diagnostic(
    span = $value,
    message = "Use a design token instead of a raw hex colour",
    severity = "warning"
  )
}
```

CSS snippets are declarations, so the pattern reads like the stylesheet. String patterns are regex literals (`r"..."`), which is the practical way to test a value shape without an AST node name.

## 3. Target JSON config

```grit
language json

`"$key": $value` where {
  $key <: `"typesVersions"`,
  register_diagnostic(
    span = $key,
    message = "typesVersions is superseded by the exports map",
    severity = "warning"
  )
}
```

JSON has no expressions, so the useful checks are key names and literal values — deprecated manifest fields, banned scripts, an env var that must never be committed.

## 4. Drop to a Biome node matcher

```grit
language js(typescript)
engine biome(1.0)

JsIfStatement(consequent = $then) as $stmt where {
  $then <: contains `process.exit($$$_)`,
  register_diagnostic(
    span = $stmt,
    message = "Exiting inside a branch hides the reason from the caller",
    severity = "warning"
  )
}
```

`engine biome(1.0)` binds the pattern to Biome's own AST names, giving access to fields a snippet cannot express. The cost is precision: a misspelled node or field matches zero files without an error, so confirm the name in the Biome GritQL reference before committing the rule.

## 5. Search the whole project per language

```bash
bunx biome search '`console.error($$$)`' ./src --language=javascript
bunx biome search 'color: $value' ./src/styles --language=css
```

`--language` selects the parser for the search, and search is read-only — it reports matches and never rewrites. Use it to size the change before writing a plugin.

## 6. Verify

1. Each rule fires on a fixture file written in that exact language and flavor
2. A `.tsx` fixture is checked by the `js(typescript,jsx)` rule — not skipped as a parse failure
3. `biome search` with the same pattern returns the same files the plugin reports
4. `/run-scan` passes on the repo, with no "unsupported syntax" noise in the output

## Pitfalls

- Leaving `language js` on a TypeScript codebase, so half the files fail to parse and the rule looks clean.
- Writing a CSS rule as a JavaScript snippet (or the reverse), which parses nothing.
- Using an invented Biome node name and assuming the empty result means "no violations".
- Forgetting `jsx` on a React codebase, where every component file fails to parse.
- Expecting `biome search` to apply a rewrite — search is read-only, rewrites belong in a plugin.

## Related

- `references/apis.md`
- `best-practices/patterns.md`
- `usecases/custom-lint-rule.md`
- `usecases/metavariables-and-conditions.md`
- `usecases/safe-unsafe-fix-rollout.md`
