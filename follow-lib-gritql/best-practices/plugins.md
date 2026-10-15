# GritQL — Biome Plugins And Search

## Recommended Patterns

### Custom Lint Plugin (.grit)

- create a `.grit/<rule-name>.grit` file then register it in `biome.json`/`biome.jsonc` under the `plugins` key
- use `register_diagnostic(span: ..., message: ..., severity: ...)` inside `where` to emit a diagnostic — the span comes from an `as $name` capture
- combine rewrites with the `=>` operator: `` `old($x)` => `new($x)` `` — match plus fix in one rule
- always set `fix_kind` in `register_diagnostic` when there is a rewrite — `safe` when semantics don't change, `unsafe` when they might (default is `unsafe`)

### Apply Fixes

- `biome check --write` applies safe fixes only — suited for CI and auto-fix
- `biome check --write --unsafe` includes unsafe fixes — use only after reviewing the pattern
- `biome lint --write` for lint fixes only (no formatting)
- test on a sample file or branch first — a wrong-pattern rewrite is hard to repair once committed

### biome search

- syntax: `bunx biome search '<pattern>' ./src` — wrap the pattern in single quotes so the shell doesn't interpret backticks
- `--language=<lang>` specifies the target: `javascript`, `css`, `json`
- use with a path/glob to scope — `biome search '...' ./src/components`
- search is read-only — rewrites happen through `.grit` plugins only

## Do / Don't

| Do | Don't |
|---|---|
| set `fix_kind` to match the real risk level | leave the `unsafe` default on a semantics-preserving rule |
| run `biome check --write` in CI for safe fixes | run `--unsafe` without reviewing the pattern |
| test rewrites on sample files before applying for real | apply a rewrite repo-wide on first write |
| wrap the pattern in single quotes in the shell | use double quotes and hit `$`/backtick expansion |
| check that the plugin rule fires on the intended glob scope | assume the plugin auto-runs every file without config |

## Common Pitfalls

- assuming `biome search` can rewrite — it can't; search is read-only
- forgetting `register_diagnostic` → the pattern matches but reports nothing
- rewrite `=>` without setting `fix_kind` → the `unsafe` default requires an extra flag, making it look like the fix doesn't work
- plugin file not registered in the `biome.json` `plugins` array → the rule never fires, silently
- severity unspecified → the default may be info, not blocking CI as intended

## Performance Notes

- every plugin runs on every linted file — a broad pattern (root is `$x`) is very slow on a large codebase
- limit scope with `files.includes`/path filters in the config when a rule only applies to certain directories
- specific node matchers prune fast — see `patterns.md` for pattern performance
- unsafe fixes don't affect the performance of normal checks — but the review cost is higher

## Ecosystem / Integration

- the GritQL engine lives in `@biomejs/biome` v2+ — there is no standalone CLI
- plugin diagnostics merge into the same `biome check`/`biome lint` output — CI can use one format
- if a rule is too complex for GritQL (cross-file, type-aware) → write a Biome lint rule or use another tool instead
