# Vite Plugins — Best Practices

Plugin selection — the unplugin ecosystem and frontend-lib catalog discipline

## Recommended Patterns

- Official plugins first (`@vitejs/plugin-*`) — framework support (react, vue, svelte) must be official
- `unplugin-*` ecosystem = unified plugins (Icons, AutoImport, Components, Fonts) — one package works across Vite/Rollup/Webpack
- Plugin order matters: framework plugin first, transforms after — read plugin docs for ordering requirements
- `apply: 'serve'|'build'` for a mode-specific plugin — dev tools should not sit in the build pipeline
- Audit plugins: every plugin = transform overhead + supply chain — ask whether a built-in can do it before adding

## Common Pitfalls

- Version compat: Vite major upgrades break plugins — check peer ranges when upgrading Vite
- Duplicate functionality: `unplugin-auto-import` + manual imports collide = confusion; commit to one approach
- Plugin config goes through options, not monkey-patching — virtual modules/auto-imports have conventions
- `@vitejs/plugin-legacy`/SWC variants — pick by the browser matrix; don't stack plugins repeating the same transform
- SSR/edge targets: some plugins assume browser globals — verify in the target environment

## Selection Criteria

- Maintenance: latest commits <6 months, issue response, Vite version support
- Single-purpose beats mega-plugins — compose smaller primitives
- Unplugin versions preferred for multi-tool setups — shared config across bundlers

## Do / Don't

| Do | Don't |
|----|-------|
| official/unplugin plugins first | random community plugins |
| `apply` scope to a specific mode | dev plugins in the production build |
| audit plugin necessity | a plugin for everything config can do |
| check Vite peer compat | blind Vite upgrades that break plugins |
