# GritQL — Pattern Authoring

## Recommended Patterns

### Snippet Patterns And Variables

- a code snippet in backticks is the base pattern: `` `console.log($message)` `` — parsed into an AST then matched structurally, not as text
- metavariable `$name` matches any node; reusing the same variable = enforced equality, e.g. `` `$x === $x` `` matches only same-variable compares
- spread metavariable `$$$args` matches an argument list of any length — `` `foo($$$args)` ``
- use `as $name` to capture the whole node span when you need to point at a location in a diagnostic or rewrite

### Conditions With Where

- `where` clauses filter matches further: `where { $x <: `literal` }` or combine with `or`/`and`/`not`
- operator `<:` = pattern subsumption — `$x <: pattern` means the node in `$x` matches that pattern
- use `contains`, `within`, `includes` for structural relations (e.g. must be inside a class named X)
- split complex patterns into named patterns then compose — easier to read than one long where clause

### Language And Engine Selection

- always declare the target: `language js(typescript,jsx)` / `language css` / `language json` — undeclared = default per context
- `engine biome(1.0)` matches Biome AST nodes directly, e.g. `JsIfStatement` — use when snippet syntax matching isn't enough
- check the language's integration status first — some languages are still experimental

## Do / Don't

| Do | Don't |
|---|---|
| declare `language ...` explicitly on every pattern | assume the default language is always right |
| reuse the same `$var` when you want equality | use regex in where when structural match can do it |
| split named patterns for complex logic | write a where clause too long to read |
| test the pattern with `biome search` on real code first | assume the pattern works from the spec alone |
| match a specific node type when you know the target | use a lone `$x` then filter afterwards (slow) |

## Common Pitfalls

- backticks in a pattern must be escaped when firing through a shell — wrap the whole pattern in single quotes
- metavariable `$x` doesn't match across statement boundaries — statement-level vs expression-level differ
- patterns matching whitespace/formatting may differ — GritQL matches the AST, not text, so formatting doesn't matter but semicolon/structure does
- `$$$args` is only valid in spread positions (argument list, elements) — wrong place = no match

## Performance Notes

- specific node type patterns are faster than generic snippets — the engine can prune from the node kind
- avoid patterns whose root is a bare `$x` — forces a walk of every node in every file
- `within`/`contains` constraints prune the tree faster than a where that checks afterwards
- benchmark on a real codebase — a pattern that looks small can scan very slowly on a large monorepo

## Ecosystem / Integration

- GritQL in Biome is used only via `biome search` and `.grit` lint plugins — there is no standalone binary
- cross-language codemods that Biome doesn't support → consider ast-grep (`/use-astgrep`) instead
- canonical docs: `https://biomejs.dev/reference/gritql/`
