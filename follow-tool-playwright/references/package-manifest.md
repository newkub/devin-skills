# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@playwright/test` |
| Registry | `npm` |
| Latest Version | `1.63.0` |
| Release Date | `2026-09-04` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | `Microsoft Corporation` |
| License | `Apache-2.0` |
| Repository | `https://github.com/microsoft/playwright` |
| Website | `https://playwright.dev` |
| Documentation | `https://playwright.dev/docs/intro` |
| Releases / Changelog | `https://github.com/microsoft/playwright/releases` |

## Install

```bash
bun add -D @playwright/test && bunx playwright install
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `playwright` | `npm` | `1.63.0` | Browser driver package — same release train; pulled transitively by `@playwright/test` |
| `playwright-core` | `npm` | `1.63.0` | Core library — install directly only for library usage without test runner |

## Notes

- Breaking changes in latest major: `1.x — semver minor cadence; Node >=20 required (Node 18 dropped); v1.63 adds test lock option and locator.visible()`
- Version pinned in SKILL.md: `@playwright/test@1.63.0`
- Source: `https://registry.npmjs.org/@playwright/test`
