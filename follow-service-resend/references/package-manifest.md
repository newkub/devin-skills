# Package manifest

## Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review-codebase` runs.

### Primary Package

| Field | Value |
|-------|-------|
| Package | `resend` |
| Registry | `npm` |
| Latest Version | `6.30.0` |
| Release Date | `unknown` (not re-checked when the version was confirmed) |
| Verified | `2026-09-26` (date this file was last checked) |
| Author / Publisher | Resend |
| License | `MIT` |
| Repository | `https://github.com/resend/resend-node` |
| Website | `https://resend.com/` |
| Documentation | `https://resend.com/docs` |
| Releases / Changelog | `https://github.com/resend/resend-node/releases` |

### Install

```bash
bun add resend
```

### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@react-email/components` | `npm` | `unknown` | Optional — React email templates for the `react` field in `emails.send` |

### Notes

- Breaking changes in latest major: none documented; `from` must use a verified domain in production
- Version is live-checked via `/deep-research` before install — do not treat this table as a pin
