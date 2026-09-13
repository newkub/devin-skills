# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `pkg-pr-new` |
| Registry | `npm` |
| Latest Version | `0.0.88` |
| Release Date | `2026-08-14` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `StackBlitz Labs` (stackblitz-labs) |
| License | `MIT` |
| Repository | `https://github.com/stackblitz-labs/pkg.pr.new` |
| Website | `https://pkg.pr.new` |
| Documentation | `https://github.com/stackblitz-labs/pkg.pr.new#readme` |
| Releases / Changelog | `https://github.com/stackblitz-labs/pkg.pr.new/releases` |

## Install

```bash
bun add -D pkg-pr-new
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `pkg.pr.new` GitHub App | `GitHub` | — | Required companion — install app from `https://github.com/apps/pkg-pr-new` on each repo before publishing |

## Notes

- Breaking changes in latest major: `0.0.x — no semver guarantees; flags change between releases`
- Version pinned in SKILL.md: `pkg-pr-new@0.0.88`
- In CI, invoke from lockfile (`bun run pkg-pr-new publish`) rather than `bunx`/`npx`
- Source: `https://registry.npmjs.org/pkg-pr-new`
