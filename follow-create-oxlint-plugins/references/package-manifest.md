# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `oxlint` |
| Registry | `npm` |
| Latest Version | `1.82.0` |
| Release Date | `2026-09-07` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `oxc-project` |
| License | `MIT` |
| Repository | `<https://github.com/oxc-project/oxc>` (`npm/oxlint`) |
| Website | `<https://oxc.rs>` |
| Documentation | `<https://oxc.rs/docs/guide/usage/linter>` |
| Releases / Changelog | `<https://github.com/oxc-project/oxc/releases>` |

## Install

```bash
bun add -D oxlint
bunx oxlint --init   # starter config (.oxlintrc.json)
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `oxlint-tsgolint` | `npm` | `unknown` | optional type-aware linting preview |
| `node` | `system` | `unknown` | `oxlint.config.ts` needs Node v22.18+ or v24+ |

## Notes

- Breaking changes in latest major: `JS plugins (jsPlugins field) are alpha, not subject to semver; reserved plugin names (react, unicorn, typescript, oxc, import, jest, vitest, jsx-a11y, nextjs) are native — need custom alias for JS versions`
- Version pinned in SKILL.md: `oxlint@1.82.0` (verified 2026-09-12)
