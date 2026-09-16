# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `@testing-library/dom` |
| Registry | `npm` |
| Latest Version | `10.4.2` |
| Release Date | `2025-07-27` |
| Verified | `2026-09-13` (date this file was last checked) |
| Author / Publisher | `Kent C. Dodds (Testing Library)` |
| License | `MIT` |
| Repository | `<https://github.com/testing-library/dom-testing-library>` |
| Website | `<https://testing-library.com>` |
| Documentation | `<https://testing-library.com/docs/queries/about>` |
| Releases / Changelog | `<https://github.com/testing-library/dom-testing-library/releases>` |

## Install

```bash
bun add -D @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@testing-library/react` | `npm` | `16.3.3` | React renderer; requires `@testing-library/dom` as peer + React 18+; released 2026-08-27 |
| `@testing-library/jest-dom` | `npm` | `7.0.1` | Custom matchers (`toBeInTheDocument` etc.); released 2026-08-09 |
| `@testing-library/user-event` | `npm` | `14.6.7` | Realistic user interaction simulation; released 2026-09-02 |
| `@testing-library/vue` | `npm` | `8.1.0` | Vue renderer; released 2024-05-18 |

## Notes

- Breaking changes in latest major: `@testing-library/react@16` split `@testing-library/dom` out as a required peer dependency
- Version pinned in SKILL.md: dom `10.4.2` / react `16.3.3` / jest-dom `7.0.1` / user-event `14.6.7` / vue `8.1.0`
