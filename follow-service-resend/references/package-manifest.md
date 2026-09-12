# Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/check-release-notes` runs.

## Primary Package

| Field | Value |
|-------|-------|
| Package | `resend` |
| Registry | `npm` |
| Latest Version | `6.28.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Resend |
| License | `MIT` |
| Repository | `https://github.com/resend/resend-node` |
| Website | `https://resend.com/` |
| Documentation | `https://resend.com/docs` |
| Releases / Changelog | `https://github.com/resend/resend-node/releases` |

## Install

```bash
bun add resend
```

## Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@react-email/components` | `npm` | `unknown` | Optional — React email templates for `react` field in `emails.send` |

## Notes

- Breaking changes in latest major: none documented; `from` must use a verified domain in production
- Version pinned in SKILL.md: `6.28.0`
