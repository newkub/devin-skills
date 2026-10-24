# Use Case — Delete Dead Files, Exports and Dependencies

> Let Knip find what nothing imports, then remove it in a verifiable order instead of guessing. Source: https://knip.dev/overview/getting-started (accessed 2026-10-20)

## 1. Config that matches the app

```json
// knip.json
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "entry": ["src/index.ts", "src/routes/**/*.tsx", "scripts/*.ts"],
  "project": ["src/**/*.{ts,tsx}", "scripts/**/*.ts"],
  "ignore": ["dist/**", "coverage/**"],
  "ignoreDependencies": ["@types/*"]
}
```

`entry` is where execution starts; route files loaded by a framework convention must be listed or their imports read as unused.

## 2. Read the report in dependency order

```bash
bunx knip                 # files, dependencies, exports, types
bunx knip --include files,dependencies
bunx knip --fix-type exports,types   # safe mechanical fixes only
```

Remove in this order — each step can make more of the next one unused:

1. unused files
2. unused dependencies
3. unused exports/types
4. duplicate exports

## 3. Verify after each step

```bash
bun run typecheck && bun test && bun run build
```

A removed export that something *did* use fails typecheck immediately; a removed file that a bundler resolved dynamically fails the build.

## 4. Keep the gate green

```yaml
- run: bunx knip --no-progress
```

Run it in CI so new dead code fails the PR instead of accumulating. Add `--max-issues` only if you are intentionally paying down debt.

## Pitfalls

- Dynamic imports and template paths (`import(\`./locales/${lang}\`)`) → reported unused; list them in `entry`/`ignore`.
- Deleting an export that a public package surface needs → check `package.json` `exports` before removing.
- Running `--fix` blindly → it rewrites export syntax; commit the report-driven deletions separately.
- No `project` globs → Knip scans everything and reports noise from `dist/`.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/knip.md`
- `usecases/monorepo-dead-code-gate.md`
