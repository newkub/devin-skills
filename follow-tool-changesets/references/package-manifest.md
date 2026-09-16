# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@changesets/cli` |
| Registry | `npm` |
| Latest Version | `3.0.3` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `changesets` |
| License | `MIT` |
| Repository | `https://github.com/changesets/changesets` |
| Website | `https://changesets.dev` |
| Documentation | `https://github.com/changesets/changesets/tree/main/docs` |
| Releases / Changelog | `https://github.com/changesets/changesets/releases` |

## Install

```bash
bun add -D @changesets/cli && bunx changeset init
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@changesets/config` | `npm` | `4.x` | `$schema` in `.changeset/config.json` |
| `changesets/action` | `GitHub Action` | `v2` (v2.1.1) | Release PR/publish action — v2 requires Changesets CLI v3 |

## Notes

- Breaking changes in latest major: `v3 — requires \`changesets/action@v2\` (inputs renamed to \`version-script\`/\`publish-script\`); CLI v2 pairs with action@v1`
- Version pinned in SKILL.md: `3.0.3`
