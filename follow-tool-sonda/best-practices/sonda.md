# Sonda — Best Practices

Bundle analyzer that reads the final source maps — reflects real tree-shaking/minification, not a pre-build estimate

## Recommended Patterns

- Always enable `sourcemap: true` in the build config first — Sonda doesn't work without source maps
- `format: ['html', 'json']` — html for humans to view, json as input for scripts/CI and `/report-bundle`
- `gzip: true` + `brotli: true` when comparing the sizes users actually download — raw numbers don't tell the full story
- `deep: true` when you need dependencies broken down into original source files — find the real big dep in a vendor chunk
- `open: false` in CI/headless; keep the JSON report as an artifact to diff across commits
- Use `include`/`exclude` to scope the report when a monorepo has lots of output — e.g. `include: [/\.js$/]`

## Common Pitfalls

- Vite CSS: Vite doesn't generate source maps for CSS → CSS never appears in the Sonda report (a limitation, not a config bug)
- `sources: true` embeds the full source code in the report — the report gets very large and leaks code if shared externally
- `deep`/`sources`/`gzip`/`brotli` all add build time — don't enable everything in a frequently iterating dev loop
- The gzip/brotli values are estimates — fine for comparing trends across builds, but don't claim absolute numbers against real infra
- The report doesn't compare against history on its own — store JSON per commit/tag and diff yourself if you want regression tracking

## Bundle Report Workflow

- `/report-bundle` uses the JSON output as the source of truth for chunk/dependency tables — more accurate than `du`
- Treemap view → find abnormally large chunks; dependency tree → trace which path pulled a dep into the bundle
- Pair with `/follow-tool-node-modules-inspector` — Sonda says what's in the bundle, the inspector says versions/duplicates in `node_modules`

## Do / Don't

| Do | Don't |
|----|-------|
| Enable sourcemaps before using Sonda | expect a report without source maps |
| `format: 'json'` + `open: false` in CI | Auto-open a browser on CI |
| Scope with `include`/`exclude` | Analyze every asset in a big monorepo |
| Keep JSON reports as artifacts | Rely on memory/eyeballing between builds |
| Share the report after checking `sources` is off | Share a report that embeds source code |
