# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@usebruno/cli` |
| Registry | `npm` |
| Latest Version | `4.1.0` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `usebruno` |
| License | `MIT` |
| Repository | `https://github.com/usebruno/bruno` |
| Website | `https://www.usebruno.com` |
| Documentation | `https://docs.usebruno.com` |
| Releases / Changelog | `https://github.com/usebruno/bruno/releases` |

## Install

```bash
bun add -D @usebruno/cli          # project dev-dep
mise use -g npm:@usebruno/cli     # global via mise
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `usebruno/bruno-cli-action` | GitHub Actions | `v1` | Official composite action — prepend `bru`, auto JUnit, count outputs |

## Notes

- Breaking changes: v3.0.0 changed `--sandbox` default to `safe`; v4 changed JUnit `classname` attribute format
- CLI binary name is `bru` (`bunx @usebruno/cli` or `bru` when installed)
- Version pinned in SKILL.md: `@usebruno/cli@4.1.0`
- Source: `https://registry.npmjs.org/@usebruno/cli`
