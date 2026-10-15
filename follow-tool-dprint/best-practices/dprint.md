# dprint — Best Practices

Pluggable multi-language formatter — config discipline and plugin hygiene

## Recommended Patterns

- One `dprint.json` at the root — the plugins array points at WASM plugin URLs (`plugins: ["https://plugins.dprint.dev/typescript-x.y.z.wasm", ...]`) with pinned versions
- Always pin plugin versions — the URLs already carry the version; floating refs = format drift across teams/CI
- Per-language config under the language keys (`typescript`, `json`, `markdown`) — global options (`lineWidth`, `indentWidth`, `useTabs`) at the top level
- Explicit `includes`/`excludes` — never format generated code, `node_modules`, dist, or lockfiles
- `dprint fmt` + `dprint check` (CI) + the editor extension — format-on-save matches the CI gate

## Common Pitfalls

- Editor integration: the VS Code extension points at `dprint.json` — if the prettier extension is still enabled = format conflicts; disable other formatters
- `dprint config update` upgrades plugin URLs — review the diff before committing (a format change = a mass diff)
- Overlapping tools: dprint vs prettier/biome — pick one per language — running both = flip-flopping diffs
- Incremental cache: `dprint fmt` is fast because of the cache — CI that clears the cache = slower than local; accept it
- The config is JSON — `//` comments work thanks to jsonc support, but other JSON5 features are not fully supported

## Perf Notes

- WASM plugins are very fast — do not spawn `dprint fmt` per file; run once for the whole repo
- Use `dprint check` in CI instead of `fmt` + diff — fails fast without dirtying the working tree

## Do / Don't

| Do | Don't |
|----|-------|
| pin plugin versions in the URLs | floating plugin refs |
| `dprint check` in CI | `fmt` then hope it's clean |
| exclude generated/vendor code | format lockfiles/dist |
| one formatter per language | prettier+dprint clashing |
