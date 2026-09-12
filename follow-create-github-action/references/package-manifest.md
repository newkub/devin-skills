# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@actions/core` |
| Registry | `npm` |
| Latest Version | `3.0.1` |
| Release Date | `2026-04-21` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `GitHub (actions org)` |
| License | `MIT` |
| Repository | `<https://github.com/actions/toolkit>` (`packages/core`) |
| Website | `<https://docs.github.com/en/actions>` |
| Documentation | `<https://github.com/actions/toolkit/tree/main/packages/core>` |
| Releases / Changelog | `<https://github.com/actions/toolkit/releases>` |

## Install

```bash
bun add -D @actions/core @actions/github
# plus a bundler: bun add -D esbuild   (or @vercel/ncc / rollup)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@actions/github` | `npm` | `9.1.1` (2026-04-21) | Octokit context/API helpers |
| `esbuild` | `npm` | `unknown` | bundler producing `dist/index.js` (alternative: `@vercel/ncc`, `rollup`) |
| `node24` runtime | `system` | `n/a` | `runs.using` value in `action.yml`; node20 removed from runners 2026-09-23 |

## Notes

- Breaking changes in latest major: `@actions/core@3.x targets the node24 runtime; @actions/github@9.x uses newer Octokit — check toolkit changelog`
- Version pinned in SKILL.md: `@actions/core@3.0.1` / `@actions/github@9.1.1`, `node24` runtime (verified 2026-09-12)
