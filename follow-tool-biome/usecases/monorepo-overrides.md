# Use Case — Monorepo Overrides and Rule Domains

> One root config, per-package overrides, and framework-aware rule domains instead of copy-pasted configs. Source: https://biomejs.dev/guides/configure-biome/ (accessed 2026-10-20)

## 1. Root config with overrides

```json
{
  "root": true,
  "linter": { "rules": { "recommended": true } },
  "overrides": [
    { "includes": ["apps/web/**"], "linter": { "domains": { "react": "recommended" } } },
    { "includes": ["packages/**"], "linter": { "domains": { "test": "recommended" } } },
    { "includes": ["**/*.config.ts"], "linter": { "rules": { "style": { "noDefaultExport": "off" } } } }
  ]
}
```

`root: true` stops Biome from walking up to a parent config; every package then shares one binary and one rule set.

## 2. Run from the task runner

```json
{ "scripts": { "lint": "biome check .", "fix": "biome check --write ." } }
```

With Turborepo, mark the task as cached (`outputs: []`) so unchanged packages are skipped.

## 3. Migrate an existing setup

```bash
bunx biome migrate eslint --write
bunx biome migrate prettier --write
```

Review the generated file: rules Biome implements only partially are left commented out — decide each explicitly instead of assuming parity.

## Pitfalls

- Nested configs without `root: true` in the parent → the nearest file wins and root rules silently disappear.
- `domains` plus explicit `rules` for the same rule → explicit values win; keep domains for framework presets only.
- Formatting generated folders (`dist`, `.next`, `drizzle/`) → noise and slow CI; exclude them in `files.includes`.
- Migrating and keeping both configs in one PR → reviewers cannot tell which one is authoritative.

## Related

- `references/apis.md`
- `usecases/lint-format-gate-in-ci.md`
