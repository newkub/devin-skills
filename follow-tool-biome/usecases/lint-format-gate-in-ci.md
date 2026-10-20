# Use Case — Lint and Format Gate in CI

> Replace ESLint + Prettier with one Biome config, autofix locally, and block the PR in CI. Source: https://biomejs.dev/guides/getting-started/ (accessed 2026-10-20)

## 1. Config

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.0/schema.json",
  "vcs": { "enabled": true, "clientKind": "git", "useIgnoreFile": true },
  "files": { "includes": ["**", "!**/dist/**", "!**/coverage/**"] },
  "formatter": { "enabled": true, "indentStyle": "space", "lineWidth": 100 },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "javascript": { "formatter": { "quoteStyle": "double", "semicolons": "asNeeded" } }
}
```

Keep only overrides of Biome defaults (see `/follow-default-config`). The `$schema` version must match the installed CLI — check `biome --version` first.

## 2. Local loop

```bash
bunx biome check --write .          # format + safe lint fixes + import sorting
bunx biome check --write --unsafe . # unsafe fixes — review the diff
```

## 3. CI gate

```bash
bunx biome ci .
```

`biome ci` never writes files and exits non-zero on any diagnostic. A plain `biome check` can auto-write locally, which is why it is the wrong command for a gate.

## Pitfalls

- `biome check` in CI → the job may pass after rewriting files that were never committed; use `biome ci`.
- Misspelled/unknown rule keys → config error; validate after editing.
- `// biome-ignore lint/...` without a reason → reviewers cannot judge it; always state why.
- Keeping `.eslintrc`/`.prettierrc` beside `biome.json` → two formatters fighting; migrate, then delete.

## Related

- `references/apis.md`
- `usecases/monorepo-overrides.md`
