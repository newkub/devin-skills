# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@scalar/cli` |
| Registry | `npm` |
| Latest Version | `2.1.0` |
| Release Date | `2026-08-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Scalar` (scalar org) |
| License | `MIT` |
| Repository | `https://github.com/scalar/scalar` |
| Website | `https://scalar.com` |
| Documentation | `https://guides.scalar.com` |
| Releases / Changelog | `https://github.com/scalar/scalar/releases` |

## Install

```bash
bun add -D @scalar/cli
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@scalar/api-reference` | `npm` | `1.68.0` | Embeddable API reference renderer (standalone/React/Vue) — latest 2026-09-07 |

## Notes

- Breaking changes in latest major: `@scalar/cli v2 requires Node.js >=24; document subcommands (mock/validate/lint/serve/markdown/bundle) are the v2 CLI surface`
- Version pinned in SKILL.md: `@scalar/cli@2.1.0` / `@scalar/api-reference@1.68.0`
- CLI binary name is `scalar` (`bunx @scalar/cli` or `bunx scalar`)
- Source: `https://registry.npmjs.org/@scalar/cli`
