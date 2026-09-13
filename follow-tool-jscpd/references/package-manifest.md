# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `jscpd` |
| Registry | `npm` |
| Latest Version | `5.2.0` |
| Release Date | `2026-09-08` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Andrii Kucherenko` |
| License | `MIT` |
| Repository | `https://github.com/kucherenko/jscpd` |
| Website | `https://jscpd.dev` |
| Documentation | `https://jscpd.dev` |
| Releases / Changelog | `https://github.com/kucherenko/jscpd/releases` |

## Install

```bash
bun add -D jscpd   # or run ad-hoc: bunx jscpd .
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| — | — | — | none — reporters (`console`, `json`, `html`, `markdown`, `sarif`) are built in |

## Notes

- Breaking changes in latest major: `v5.2+ adds type-2 clone detection (\`--ignore-identifiers\`/\`--ignore-literals\`/\`--ignore-annotations\`), near-miss merge (\`--max-gap-lines\`), and function-level similarity (\`--similarity\`, JS/TS only)`
- Version pinned in SKILL.md: `5.2.0`
