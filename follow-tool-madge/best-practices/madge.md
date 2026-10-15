# Madge — Best Practices

Dependency graph + circular import detection for JS/TS

## Recommended Patterns

- `madge --circular src/` — circular deps = the primary use case; fail CI when found
- `--extensions ts,tsx` + `--ts-config tsconfig.json` — so path aliases/TS resolve correctly
- `--image graph.svg` for a visual dep graph — useful when reviewing architecture, not every run
- `--depends`/`--orphans` queries — find modules nobody uses, or who-depends-on-X
- Engine for related checks: use alongside `/check-file-relation` and refactor workflows

## Common Pitfalls

- Circular imports aren't always errors (ES modules allow them) but are a smell — initialization-order issues, tree-shaking blockers; fix by extracting a shared module
- Path aliases need the tsconfig — otherwise unresolved imports = orphan false positives
- Dynamic imports (`import()`) — madge traces static ones but expression-based (`import(variable)`) are missed; such code yields an incomplete graph
- Barrel files amplify cycles: an `index.ts` re-exporting a whole folder makes cycles easy through the barrel — when hitting a cycle, check barrels first
- Large repos: madge is slow on the whole graph — scope by directory or use `--include-npm false`

## Fix Patterns for Cycles

1. Extract shared types/utils into a lower layer
2. Dependency inversion: callback/interface injection instead of direct imports
3. Barrel-less imports: import directly from the file, not through an all-inclusive index

## Do / Don't

| Do | Don't |
|----|-------|
| Gate CI with `--circular` | tolerate cycles "because they work" |
| use ts-config to resolve aliases | report on unresolved paths |
| extract a shared module to fix cycles | lazy-import hacks for every cycle |
| scope a dir when the graph is big | whole-repo graph every run |
